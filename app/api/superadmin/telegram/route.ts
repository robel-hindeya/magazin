import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/backend/auth/session';
import { ROLES } from '@/backend/constants/roles';
import { callTelegramApi, getTelegramBotUsername, isTelegramConfigured } from '@/backend/auth/telegram';
import { getAppUrl } from '@/lib/config';

/**
 * Super admin only (also enforced by middleware).
 * GET  -> current webhook status from Telegram.
 * POST -> registers the webhook URL + secret and the bot's command menu.
 */

async function requireSuperadmin() {
  const user = await getCurrentUser();
  return user?.role === ROLES.SUPERADMIN ? user : null;
}

const COMMANDS = [
  { command: 'start', description: 'Welcome and connection status' },
  { command: 'login', description: 'How to sign in with Telegram' },
  { command: 'profile', description: 'Your linked Selam Kids account' },
  { command: 'verify', description: 'Check that this Telegram is verified' },
  { command: 'alerts', description: 'Turn sign-in alerts on or off' },
  { command: 'unlink', description: 'Disconnect this Telegram' },
  { command: 'help', description: 'Show all commands' },
];

export async function GET() {
  if (!(await requireSuperadmin())) {
    return NextResponse.json({ success: false, error: { message: 'Forbidden' } }, { status: 403 });
  }
  if (!isTelegramConfigured()) {
    return NextResponse.json({
      success: false,
      error: { message: 'Set TELEGRAM_BOT_TOKEN and NEXT_PUBLIC_TELEGRAM_BOT_USERNAME first.' },
    });
  }
  const info = await callTelegramApi('getWebhookInfo', {});
  return NextResponse.json({ success: true, data: { bot: getTelegramBotUsername(), webhook: info } });
}

export async function POST() {
  if (!(await requireSuperadmin())) {
    return NextResponse.json({ success: false, error: { message: 'Forbidden' } }, { status: 403 });
  }
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!isTelegramConfigured() || !secret) {
    return NextResponse.json({
      success: false,
      error: {
        message: 'Set TELEGRAM_BOT_TOKEN, NEXT_PUBLIC_TELEGRAM_BOT_USERNAME and TELEGRAM_WEBHOOK_SECRET first.',
      },
    });
  }

  const webhookUrl = `${getAppUrl()}/api/telegram/webhook`;
  if (!webhookUrl.startsWith('https://')) {
    return NextResponse.json({
      success: false,
      error: { message: `Telegram needs a public https URL; NEXT_PUBLIC_APP_URL resolves to ${webhookUrl}.` },
    });
  }

  const webhook = await callTelegramApi('setWebhook', {
    url: webhookUrl,
    secret_token: secret,
    allowed_updates: ['message', 'callback_query'],
    drop_pending_updates: true,
  });
  const commands = await callTelegramApi('setMyCommands', { commands: COMMANDS });

  return NextResponse.json({
    success: webhook !== null,
    data: { webhookUrl, webhookSet: webhook !== null, commandsSet: commands !== null },
  });
}
