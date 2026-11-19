import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { getAdminDb, isDummyDb } from '../admin';
import { logger } from '@/backend/utils/logger';
import { UserRole } from '@/backend/constants/roles';

export interface TelegramAccountRecord {
  telegram_id: number;
  user_id: string;
  user_email: string;
  user_full_name: string;
  user_role: UserRole;
  telegram_username: string | null;
  telegram_first_name: string | null;
  telegram_last_name: string | null;
  telegram_photo_url: string | null;
  chat_id: number | null;
  notifications_enabled: boolean;
  linked_at: string;
  last_login_at: string | null;
  updated_at: string;
}

/* -------------------------------------------------------------------------- */
/* Local file store, used when Supabase is not configured or unreachable.      */
/* Same approach as the billing store: .data/ locally, /tmp on serverless.     */
/* -------------------------------------------------------------------------- */

declare global {
  // eslint-disable-next-line no-var
  var __selam_telegram_store: Record<string, TelegramAccountRecord> | undefined;
}

function getLocalFilePath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production') {
    return path.join(os.tmpdir(), 'selam_telegram.json');
  }
  return path.join(process.cwd(), '.data', 'telegram.json');
}

function getLocal(): Record<string, TelegramAccountRecord> {
  if (!globalThis.__selam_telegram_store) {
    try {
      const filePath = getLocalFilePath();
      globalThis.__selam_telegram_store = fs.existsSync(filePath)
        ? (JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Record<string, TelegramAccountRecord>)
        : {};
    } catch {
      globalThis.__selam_telegram_store = {};
    }
  }
  return globalThis.__selam_telegram_store;
}

function saveLocal(store: Record<string, TelegramAccountRecord>) {
  globalThis.__selam_telegram_store = store;
  try {
    const filePath = getLocalFilePath();
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(store, null, 2), 'utf-8');
  } catch {
    // Read-only filesystem: the in-memory copy is still updated.
  }
}

function normalize(row: Record<string, unknown>): TelegramAccountRecord {
  return {
    ...(row as unknown as TelegramAccountRecord),
    telegram_id: Number(row.telegram_id),
    chat_id: row.chat_id === null || row.chat_id === undefined ? null : Number(row.chat_id),
  };
}

function warn(op: string, err: unknown) {
  logger.warn(`[telegram] Supabase ${op} failed, using local store`, {
    error: err instanceof Error ? err.message : String(err),
  });
}

export class TelegramAccountRepository {
  async findByTelegramId(telegramId: number): Promise<TelegramAccountRecord | null> {
    if (!isDummyDb()) {
      try {
        const { data, error } = await getAdminDb()
          .from('telegram_accounts')
          .select('*')
          .eq('telegram_id', telegramId)
          .maybeSingle();
        if (error) throw new Error(error.message);
        return data ? normalize(data) : null;
      } catch (err) {
        warn('findByTelegramId', err);
      }
    }
    return getLocal()[String(telegramId)] ?? null;
  }

  async findByUserId(userId: string): Promise<TelegramAccountRecord | null> {
    if (!isDummyDb()) {
      try {
        const { data, error } = await getAdminDb()
          .from('telegram_accounts')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        if (error) throw new Error(error.message);
        return data ? normalize(data) : null;
      } catch (err) {
        warn('findByUserId', err);
      }
    }
    return Object.values(getLocal()).find((r) => r.user_id === userId) ?? null;
  }

  /** Inserts a new link. Callers must check for existing links first. */
  async create(record: TelegramAccountRecord): Promise<TelegramAccountRecord> {
    if (!isDummyDb()) {
      try {
        const { data, error } = await getAdminDb()
          .from('telegram_accounts')
          .insert(record)
          .select('*')
          .single();
        if (error) throw new Error(error.message);
        return normalize(data);
      } catch (err) {
        warn('create', err);
      }
    }
    const store = getLocal();
    if (store[String(record.telegram_id)]) {
      throw new Error('This Telegram account is already linked.');
    }
    if (Object.values(store).some((r) => r.user_id === record.user_id)) {
      throw new Error('This Selam Kids account already has a Telegram account linked.');
    }
    store[String(record.telegram_id)] = record;
    saveLocal(store);
    return record;
  }

  async update(
    telegramId: number,
    changes: Partial<Omit<TelegramAccountRecord, 'telegram_id' | 'user_id' | 'linked_at'>>
  ): Promise<void> {
    const patch = { ...changes, updated_at: new Date().toISOString() };
    if (!isDummyDb()) {
      try {
        const { error } = await getAdminDb()
          .from('telegram_accounts')
          .update(patch)
          .eq('telegram_id', telegramId);
        if (error) throw new Error(error.message);
        return;
      } catch (err) {
        warn('update', err);
      }
    }
    const store = getLocal();
    const existing = store[String(telegramId)];
    if (existing) {
      store[String(telegramId)] = { ...existing, ...patch };
      saveLocal(store);
    }
  }

  async deleteByTelegramId(telegramId: number): Promise<void> {
    if (!isDummyDb()) {
      try {
        const { error } = await getAdminDb()
          .from('telegram_accounts')
          .delete()
          .eq('telegram_id', telegramId);
        if (error) throw new Error(error.message);
        return;
      } catch (err) {
        warn('deleteByTelegramId', err);
      }
    }
    const store = getLocal();
    delete store[String(telegramId)];
    saveLocal(store);
  }
}
