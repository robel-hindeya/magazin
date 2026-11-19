#!/usr/bin/env node
/**
 * Local bot runner for development.
 *
 * Telegram can't reach a webhook on localhost, so this script long-polls Telegram for
 * messages and forwards each one to the local webhook route, exactly like Telegram would.
 *
 *   npm run bot:dev                       (dev server must be running)
 *   APP_URL=http://localhost:3001 npm run bot:dev
 *
 * Reads TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET from .env.local.
 * Note: it removes any webhook registered for the bot. In production, register it again with
 * POST /api/superadmin/telegram after you stop this script.
 */
import fs from 'node:fs';
import path from 'node:path';

function loadEnv(file) {
  const env = {};
  try {
    for (const line of fs.readFileSync(file, 'utf-8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
  } catch {
    // No file: rely on process.env.
  }
  return env;
}

const fileEnv = loadEnv(path.join(process.cwd(), '.env.local'));
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || fileEnv.TELEGRAM_BOT_TOKEN;
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET || fileEnv.TELEGRAM_WEBHOOK_SECRET;
const APP_URL = (process.env.APP_URL || 'http://localhost:3001').replace(/\/$/, '');

if (!TOKEN || !SECRET) {
  console.error('Set TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET in .env.local first.');
  process.exit(1);
}

const api = async (method, body = {}) => {
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(`${method}: ${json.description}`);
  return json.result;
};

const me = await api('getMe');
console.log(`Bot @${me.username} connected. Forwarding messages to ${APP_URL}/api/telegram/webhook`);
await api('deleteWebhook', { drop_pending_updates: false });
await api('setMyCommands', {
  commands: [
    { command: 'start', description: 'Welcome and connection status' },
    { command: 'login', description: 'How to sign in with Telegram' },
    { command: 'profile', description: 'Your linked Selam Kids account' },
    { command: 'verify', description: 'Check that this Telegram is verified' },
    { command: 'alerts', description: 'Turn sign-in alerts on or off' },
    { command: 'unlink', description: 'Disconnect this Telegram' },
    { command: 'help', description: 'Show all commands' },
  ],
});
console.log('Send /start to the bot in Telegram. Press Ctrl+C to stop.');

let offset = 0;
for (;;) {
  try {
    const updates = await api('getUpdates', { offset, timeout: 30, allowed_updates: ['message', 'callback_query'] });
    for (const update of updates) {
      offset = update.update_id + 1;
      const text = update.message?.text ?? (update.callback_query ? `[button] ${(update.callback_query.data || '').split(':')[0]}` : '(no text)');
      const res = await fetch(`${APP_URL}/api/telegram/webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Telegram-Bot-Api-Secret-Token': SECRET },
        body: JSON.stringify(update),
      });
      console.log(`${new Date().toLocaleTimeString()}  ${text}  -> ${res.status}`);
    }
  } catch (err) {
    console.error('Polling error:', err.message);
    await new Promise((r) => setTimeout(r, 3000));
  }
}
