import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  callTelegramApi,
  describeDevice,
  escapeTelegramHtml,
  sendTelegramMessage,
  siteButton,
} from '@/backend/auth/telegram';
import { TelegramLoginRequestRepository } from '@/backend/db/repositories/telegram-login-request.repository';
import { getTelegramAccountRepository, unlinkTelegram } from '@/backend/services/telegram-auth.service';
import { getAppUrl } from '@/lib/config';
import { logger } from '@/backend/utils/logger';

/**
 * Telegram Bot webhook. Telegram calls this with every update; requests are accepted only
 * when they carry the secret set via setWebhook (X-Telegram-Bot-Api-Secret-Token).
 */

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  is_bot?: boolean;
}

interface TelegramUpdate {
  message?: {
    chat: { id: number; type: string };
    from?: TelegramUser;
    text?: string;
  };
  callback_query?: {
    id: string;
    from: TelegramUser;
    data?: string;
    message?: { message_id: number; chat: { id: number; type: string } };
  };
}

const CONFIRM_PREFIX = 'tgok:';
const CANCEL_PREFIX = 'tgno:';

/** "/start login_<id>": the user arrived from "Continue with Telegram" on the website. */
async function handleLoginStart(chatId: number, requestId: string) {
  const requests = new TelegramLoginRequestRepository();
  const req = requests.find(requestId);
  if (!req || req.status !== 'pending' || Date.now() > req.expiresAt) {
    await sendTelegramMessage(
      chatId,
      '⌛ This sign-in link has expired or was already used. Go back to the website and tap <b>Continue with Telegram</b> again.'
    );
    return;
  }

  const when = new Date(req.createdAt).toLocaleString('en-GB', { timeZone: 'Africa/Addis_Ababa', hour12: false });
  const action =
    req.intent === 'link' ? 'connect this Telegram to a Selam Kids account' : 'sign in to Selam Kids with this Telegram';
  const sent = await callTelegramApi<{ message_id: number }>('sendMessage', {
    chat_id: chatId,
    parse_mode: 'HTML',
    text: [
      `🔐 <b>Confirm: ${action}?</b>`,
      '',
      `Device: ${escapeTelegramHtml(describeDevice(req.userAgent))}`,
      `IP: ${escapeTelegramHtml(req.ip)}`,
      `Requested: ${escapeTelegramHtml(when)} (Addis Ababa)`,
      '',
      '⚠️ Only press <b>Confirm</b> if <b>you</b> just tapped “Continue with Telegram” on the Selam Kids website. Never confirm a link someone else sent you.',
    ].join('\n'),
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ Confirm', callback_data: `${CONFIRM_PREFIX}${req.id}` },
          { text: '✖️ Cancel', callback_data: `${CANCEL_PREFIX}${req.id}` },
        ],
      ],
    },
  });
  requests.update(req.id, { chatId, messageId: sent?.message_id ?? null });
}

/** Confirm / Cancel buttons on the sign-in message. */
async function handleCallback(cb: NonNullable<TelegramUpdate['callback_query']>) {
  const data = cb.data ?? '';
  const confirm = data.startsWith(CONFIRM_PREFIX);
  const cancel = data.startsWith(CANCEL_PREFIX);
  if (!confirm && !cancel) {
    await callTelegramApi('answerCallbackQuery', { callback_query_id: cb.id });
    return;
  }

  const requests = new TelegramLoginRequestRepository();
  const req = requests.find(data.slice(CONFIRM_PREFIX.length));
  const editMessage = (text: string) =>
    cb.message
      ? callTelegramApi('editMessageText', {
          chat_id: cb.message.chat.id,
          message_id: cb.message.message_id,
          text,
          parse_mode: 'HTML',
        })
      : Promise.resolve(null);

  // Only the Telegram user the link was opened by can answer it, and only once.
  if (!req || req.status !== 'pending' || Date.now() > req.expiresAt || req.chatId !== cb.from.id || cb.from.is_bot) {
    await callTelegramApi('answerCallbackQuery', {
      callback_query_id: cb.id,
      text: 'This sign-in request has expired. Start again on the website.',
      show_alert: true,
    });
    await editMessage('⌛ This sign-in request has expired.');
    return;
  }

  if (cancel) {
    requests.update(req.id, { status: 'denied' });
    await callTelegramApi('answerCallbackQuery', { callback_query_id: cb.id, text: 'Cancelled' });
    await editMessage('✖️ <b>Cancelled.</b> Nobody was signed in.');
    return;
  }

  requests.update(req.id, {
    status: 'approved',
    telegram: {
      id: cb.from.id,
      first_name: cb.from.first_name || cb.from.username || 'Telegram user',
      last_name: cb.from.last_name,
      username: cb.from.username,
    },
  });
  await callTelegramApi('answerCallbackQuery', { callback_query_id: cb.id, text: 'Confirmed ✅' });
  await editMessage(
    req.intent === 'link'
      ? '✅ <b>Confirmed.</b> Go back to the website. Your Telegram is being connected.'
      : '✅ <b>Confirmed.</b> Go back to the website. You are being signed in.'
  );
}

function secretMatches(received: string | null): boolean {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected || !received) return false;
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const ROLE_LABELS: Record<string, string> = {
  KID: 'Kid explorer',
  FAMILY: 'Parent / family',
  TEACHER: 'Teacher',
  ADMIN: 'Admin',
  SUPERADMIN: 'Super admin',
};

function formatDate(iso: string | null): string {
  if (!iso) return 'never';
  return new Date(iso).toLocaleString('en-GB', { timeZone: 'Africa/Addis_Ababa', hour12: false });
}

const HELP_TEXT = [
  '<b>Selam Kids bot</b>',
  '',
  '/start – welcome and connection status',
  '/login – how to sign in with Telegram',
  '/profile – the Selam Kids account linked to this Telegram',
  '/verify – check whether this Telegram is verified and linked',
  '/alerts – turn sign-in alerts on or off',
  '/unlink – disconnect this Telegram from Selam Kids',
  '/help – this message',
].join('\n');

async function handleCommand(chatId: number, telegramId: number, firstName: string, command: string) {
  const repo = getTelegramAccountRepository();
  const link = await repo.findByTelegramId(telegramId);
  const siteUrl = getAppUrl();

  switch (command) {
    case '/start': {
      if (link) {
        await sendTelegramMessage(
          chatId,
          [
            `👋 Welcome back, ${escapeTelegramHtml(firstName)}!`,
            '',
            `This Telegram is connected to <b>${escapeTelegramHtml(link.user_full_name)}</b> (${ROLE_LABELS[link.user_role] ?? link.user_role}).`,
            'I will message you whenever someone signs in to your account.',
            '',
            'Send /help to see all commands.',
          ].join('\n'),
          siteButton('Open Selam Kids', '/users')
        );
      } else {
        await sendTelegramMessage(
          chatId,
          [
            `👋 Hi ${escapeTelegramHtml(firstName)}, welcome to the <b>Selam Kids</b> bot!`,
            '',
            'To connect your account:',
            '• <b>New here?</b> On the sign-in page, tap <i>Continue with Telegram</i> to create a parent account.',
            '• <b>Already have an account?</b> Sign in with your phone, open <i>Settings</i>, and tap <i>Connect Telegram</i>.',
            '',
            `Website: ${escapeTelegramHtml(siteUrl)}`,
          ].join('\n'),
          siteButton('Sign in to Selam Kids', '/auth/login')
        );
      }
      return;
    }

    case '/login': {
      await sendTelegramMessage(
        chatId,
        [
          '🔑 <b>Signing in with Telegram</b>',
          '',
          `1. Open ${escapeTelegramHtml(siteUrl)}/auth/login`,
          '2. Tap <i>Continue with Telegram</i>.',
          '3. Confirm in Telegram. You are signed in.',
          '',
          link
            ? 'Your Telegram is linked, so you will go straight to your account.'
            : 'Your Telegram is not linked yet, so a new parent account will be created.',
          '',
          'Selam Kids never asks for your password or a code in this chat.',
        ].join('\n'),
        siteButton('Go to sign-in', '/auth/login')
      );
      return;
    }

    case '/profile': {
      if (!link) {
        await sendTelegramMessage(chatId, 'This Telegram is not linked to a Selam Kids account yet. Send /start to see how.');
        return;
      }
      await sendTelegramMessage(
        chatId,
        [
          '👤 <b>Linked account</b>',
          '',
          `Name: ${escapeTelegramHtml(link.user_full_name)}`,
          `Role: ${ROLE_LABELS[link.user_role] ?? link.user_role}`,
          `Telegram: ${link.telegram_username ? '@' + escapeTelegramHtml(link.telegram_username) : escapeTelegramHtml(link.telegram_first_name ?? '')}`,
          `Linked since: ${formatDate(link.linked_at)}`,
          `Last Telegram sign-in: ${formatDate(link.last_login_at)}`,
          `Sign-in alerts: ${link.notifications_enabled ? 'on' : 'off'}`,
        ].join('\n'),
        siteButton('Account settings', '/users/settings')
      );
      return;
    }

    case '/verify': {
      await sendTelegramMessage(
        chatId,
        link
          ? `✅ <b>Verified.</b> Telegram ID ${telegramId} is linked to <b>${escapeTelegramHtml(link.user_full_name)}</b>. Telegram confirmed your identity with a signed login the website checked on the server.`
          : '❌ <b>Not linked.</b> This Telegram has not been connected to a Selam Kids account. Send /start to see how.'
      );
      return;
    }

    case '/alerts': {
      if (!link) {
        await sendTelegramMessage(chatId, 'This Telegram is not linked, so there are no alerts to change.');
        return;
      }
      const enabled = !link.notifications_enabled;
      await repo.update(telegramId, { notifications_enabled: enabled });
      await sendTelegramMessage(
        chatId,
        enabled ? '🔔 Sign-in alerts are <b>on</b>.' : '🔕 Sign-in alerts are <b>off</b>. Send /alerts again to turn them back on.'
      );
      return;
    }

    case '/unlink': {
      if (!link) {
        await sendTelegramMessage(chatId, 'This Telegram is not linked to any Selam Kids account.');
        return;
      }
      if (link.user_id.startsWith('tg-')) {
        await sendTelegramMessage(
          chatId,
          'This account was created with Telegram, and Telegram is its only way to sign in, so it cannot be unlinked here.'
        );
        return;
      }
      await unlinkTelegram(
        telegramId,
        { userId: link.user_id, email: link.user_email, role: link.user_role },
        'bot'
      );
      await sendTelegramMessage(
        chatId,
        '🔓 Telegram disconnected. You will no longer get sign-in alerts, and you can no longer sign in with this Telegram. Reconnect any time from Settings on the website.'
      );
      return;
    }

    case '/help':
    default:
      await sendTelegramMessage(chatId, HELP_TEXT);
  }
}

export async function POST(request: NextRequest) {
  if (!secretMatches(request.headers.get('x-telegram-bot-api-secret-token'))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let update: TelegramUpdate;
  try {
    update = (await request.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ ok: true });
  }

  try {
    if (update.callback_query) {
      if (update.callback_query.message?.chat.type === 'private') {
        await handleCallback(update.callback_query);
      }
      return NextResponse.json({ ok: true });
    }

    const message = update.message;
    // Only handle private chats with real users; ignore groups, channels and other bots.
    if (!message?.text || !message.from || message.from.is_bot || message.chat.type !== 'private') {
      return NextResponse.json({ ok: true });
    }

    // "/start@MyBot payload" -> "/start"
    const [first, payload] = message.text.trim().split(/\s+/);
    const command = first.split('@')[0].toLowerCase();

    if (command === '/start' && payload?.startsWith('login_')) {
      await handleLoginStart(message.chat.id, payload.slice('login_'.length));
    } else {
      await handleCommand(message.chat.id, message.from.id, message.from.first_name || 'there', command);
    }
  } catch (err) {
    logger.error('[telegram] webhook handler failed', { error: err instanceof Error ? err.message : String(err) });
  }

  // Always 200 so Telegram doesn't retry the same update forever.
  return NextResponse.json({ ok: true });
}
