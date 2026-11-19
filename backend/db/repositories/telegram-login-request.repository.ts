import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { TelegramIdentity } from '@/backend/auth/telegram';

/**
 * Pending "Continue with Telegram" requests.
 *
 * 1. The browser starts a request -> gets a random id (also stored in an httpOnly cookie).
 * 2. The user opens t.me/<bot>?start=login_<id>; the bot asks them to confirm.
 * 3. Pressing Confirm (a webhook update from Telegram) marks the request approved with the
 *    Telegram identity that Telegram itself reported.
 * 4. The browser that holds the cookie polls and receives its session exactly once.
 */

export type LoginRequestIntent = 'login' | 'link';
export type LoginRequestStatus = 'pending' | 'approved' | 'denied' | 'used';

export interface TelegramLoginRequest {
  id: string;
  intent: LoginRequestIntent;
  /** For "link": the signed-in account that asked to connect Telegram. */
  userId: string | null;
  redirectTo: string | null;
  status: LoginRequestStatus;
  createdAt: number;
  expiresAt: number;
  ip: string;
  userAgent: string;
  telegram: TelegramIdentity | null;
  /** Bot message showing the Confirm button, so it can be updated afterwards. */
  chatId: number | null;
  messageId: number | null;
}

export const LOGIN_REQUEST_TTL_MS = 5 * 60 * 1000;

declare global {
  // eslint-disable-next-line no-var
  var __selam_tg_login_requests: Record<string, TelegramLoginRequest> | undefined;
}

function getFilePath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production') {
    return path.join(os.tmpdir(), 'selam_telegram_logins.json');
  }
  return path.join(process.cwd(), '.data', 'telegram-logins.json');
}

/** Always re-read: the webhook and the polling request may run in different workers. */
function load(): Record<string, TelegramLoginRequest> {
  try {
    const filePath = getFilePath();
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Record<string, TelegramLoginRequest>;
      globalThis.__selam_tg_login_requests = data;
      return data;
    }
  } catch {
    // Fall back to memory below.
  }
  return (globalThis.__selam_tg_login_requests ??= {});
}

function save(data: Record<string, TelegramLoginRequest>) {
  // Drop anything that expired more than a minute ago.
  const cutoff = Date.now() - 60 * 1000;
  for (const [id, req] of Object.entries(data)) {
    if (req.expiresAt < cutoff) delete data[id];
  }
  globalThis.__selam_tg_login_requests = data;
  try {
    const filePath = getFilePath();
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Read-only filesystem: memory copy only.
  }
}

/** 24 random bytes -> 32 url-safe chars; fits Telegram's 64-char /start payload limit. */
export function isValidRequestId(id: string): boolean {
  return /^[A-Za-z0-9_-]{32}$/.test(id);
}

export class TelegramLoginRequestRepository {
  create(params: {
    intent: LoginRequestIntent;
    userId: string | null;
    redirectTo: string | null;
    ip: string;
    userAgent: string;
  }): TelegramLoginRequest {
    const now = Date.now();
    const request: TelegramLoginRequest = {
      id: crypto.randomBytes(24).toString('base64url'),
      ...params,
      status: 'pending',
      createdAt: now,
      expiresAt: now + LOGIN_REQUEST_TTL_MS,
      telegram: null,
      chatId: null,
      messageId: null,
    };
    const data = load();
    data[request.id] = request;
    save(data);
    return request;
  }

  find(id: string): TelegramLoginRequest | null {
    if (!isValidRequestId(id)) return null;
    return load()[id] ?? null;
  }

  update(id: string, changes: Partial<Omit<TelegramLoginRequest, 'id'>>): TelegramLoginRequest | null {
    const data = load();
    const existing = data[id];
    if (!existing) return null;
    data[id] = { ...existing, ...changes };
    save(data);
    return data[id];
  }
}
