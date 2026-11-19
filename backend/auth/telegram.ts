import { logger } from '@/backend/utils/logger';
import { getAppUrl } from '@/lib/config';

/**
 * Telegram Login + Bot helpers. Server-only: the bot token must never reach the browser.
 *
 * Env:
 *   TELEGRAM_BOT_TOKEN            token from @BotFather
 *   NEXT_PUBLIC_TELEGRAM_BOT_USERNAME  bot username without "@" (public, used for t.me links)
 *   TELEGRAM_WEBHOOK_SECRET       random string; Telegram sends it back on every webhook call
 *
 * Identity comes only from updates Telegram delivers to the webhook (secret-checked), never
 * from data the browser sends.
 */

/** A Telegram user as reported by Telegram in a webhook update. */
export interface TelegramIdentity {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export function getTelegramBotToken(): string | null {
  return process.env.TELEGRAM_BOT_TOKEN?.trim() || null;
}

export function getTelegramBotUsername(): string | null {
  return process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.replace(/^@/, '').trim() || null;
}

export function isTelegramConfigured(): boolean {
  return Boolean(getTelegramBotToken() && getTelegramBotUsername());
}

/* -------------------------------------------------------------------------- */
/* Bot API                                                                      */
/* -------------------------------------------------------------------------- */

export async function callTelegramApi<T = unknown>(
  method: string,
  body: Record<string, unknown>
): Promise<T | null> {
  const botToken = getTelegramBotToken();
  if (!botToken) return null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    const json = (await res.json()) as { ok: boolean; result?: T; description?: string };
    if (!json.ok) {
      logger.warn(`[telegram] ${method} failed: ${json.description ?? res.status}`);
      return null;
    }
    return json.result ?? null;
  } catch (err) {
    logger.warn(`[telegram] ${method} request error`, { error: err instanceof Error ? err.message : String(err) });
    return null;
  }
}

/** Escapes text for Telegram's HTML parse mode. */
export function escapeTelegramHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function sendTelegramMessage(
  chatId: number,
  html: string,
  buttons?: { text: string; url: string }[]
): Promise<boolean> {
  const result = await callTelegramApi('sendMessage', {
    chat_id: chatId,
    text: html,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    ...(buttons && buttons.length
      ? { reply_markup: { inline_keyboard: buttons.map((b) => [{ text: b.text, url: b.url }]) } }
      : {}),
  });
  return result !== null;
}

/** Telegram only accepts https URLs in inline buttons, so skip buttons on http://localhost. */
export function siteButton(text: string, pathname: string): { text: string; url: string }[] {
  const url = `${getAppUrl()}${pathname}`;
  return url.startsWith('https://') ? [{ text, url }] : [];
}

export function describeDevice(userAgent: string): string {
  const ua = userAgent || '';
  const browser = /Edg\//.test(ua)
    ? 'Edge'
    : /OPR\//.test(ua)
      ? 'Opera'
      : /Chrome\//.test(ua)
        ? 'Chrome'
        : /Firefox\//.test(ua)
          ? 'Firefox'
          : /Safari\//.test(ua)
            ? 'Safari'
            : 'Unknown browser';
  const os = /Android/.test(ua)
    ? 'Android'
    : /iPhone|iPad/.test(ua)
      ? 'iOS'
      : /Windows/.test(ua)
        ? 'Windows'
        : /Mac OS X/.test(ua)
          ? 'macOS'
          : /Linux/.test(ua)
            ? 'Linux'
            : 'Unknown device';
  return `${browser} on ${os}`;
}

/** Security alert sent to the linked Telegram chat after every successful sign-in. */
export async function sendLoginAlert(
  chatId: number,
  details: { fullName: string; method: string; ip: string; userAgent: string }
): Promise<void> {
  const when = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Addis_Ababa', hour12: false });
  await sendTelegramMessage(
    chatId,
    [
      '🔐 <b>New sign-in to Selam Kids</b>',
      '',
      `Account: ${escapeTelegramHtml(details.fullName)}`,
      `Method: ${escapeTelegramHtml(details.method)}`,
      `Device: ${escapeTelegramHtml(describeDevice(details.userAgent))}`,
      `IP: ${escapeTelegramHtml(details.ip)}`,
      `Time: ${escapeTelegramHtml(when)} (Addis Ababa)`,
      '',
      "If this wasn't you, change your password right away and send /unlink here to disconnect Telegram.",
    ].join('\n'),
    siteButton('Change password', '/auth/forgot-password')
  );
}
