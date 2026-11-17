import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { getAdminDb, isDummyDb } from '../admin';
import { logger } from '@/backend/utils/logger';

export interface SubscriptionRecord {
  user_id: string;
  plan: string;
  trial_started_at: string;
  trial_ends_at: string;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface PaymentRecord {
  id: string;
  user_id: string;
  tx_ref: string;
  provider: string;
  provider_ref: string | null;
  amount: number;
  currency: string;
  period_days: number;
  status: PaymentStatus;
  created_at: string;
  verified_at: string | null;
}

export type NewPayment = Omit<PaymentRecord, 'id' | 'created_at' | 'verified_at' | 'provider_ref' | 'status'>;

/* -------------------------------------------------------------------------- */
/* Local memory & file store, used in dummy mode or as a resilient fallback.   */
/* Safe in serverless / Vercel (avoids EROFS read-only filesystem crash).     */
/* -------------------------------------------------------------------------- */

interface LocalBillingData {
  subscriptions: Record<string, SubscriptionRecord>;
  payments: Record<string, PaymentRecord>;
}

declare global {
  // eslint-disable-next-line no-var
  var __selam_billing_store: LocalBillingData | undefined;
}

function getLocalFilePath(): string {
  // In serverless / Vercel, the only writable directory is /tmp
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production') {
    return path.join(os.tmpdir(), 'selam_billing.json');
  }
  return path.join(process.cwd(), '.data', 'billing.json');
}

function getMemoryStore(): LocalBillingData {
  if (!globalThis.__selam_billing_store) {
    globalThis.__selam_billing_store = readLocalFromDisk();
  }
  return globalThis.__selam_billing_store;
}

function readLocalFromDisk(): LocalBillingData {
  try {
    const filePath = getLocalFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<LocalBillingData>;
      return {
        subscriptions: parsed.subscriptions ?? {},
        payments: parsed.payments ?? {},
      };
    }
  } catch {
    // Disk read failed, fallback to empty
  }
  return { subscriptions: {}, payments: {} };
}

function writeLocal(data: LocalBillingData) {
  globalThis.__selam_billing_store = data;
  try {
    const filePath = getLocalFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // In read-only serverless environments, writing to disk might fail.
    // In-memory global store is already updated so we safely swallow this error.
  }
}

function normalizePayment(row: Record<string, unknown>): PaymentRecord {
  return {
    ...(row as unknown as PaymentRecord),
    amount: Number(row.amount),
    period_days: Number(row.period_days),
  };
}

export class SubscriptionRepository {
  async findByUserId(userId: string): Promise<SubscriptionRecord | null> {
    if (isDummyDb()) {
      return getMemoryStore().subscriptions[userId] ?? null;
    }

    try {
      const { data, error } = await getAdminDb()
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      if (!error) return data;
      logger.warn(`[billing] Supabase error in findByUserId (${error.message}), falling back to local store.`);
    } catch (err) {
      logger.warn('[billing] Supabase exception in findByUserId, falling back to local store', {
        error: err instanceof Error ? err.message : String(err),
      });
    }

    return getMemoryStore().subscriptions[userId] ?? null;
  }

  /** Creates the row if missing; never overwrites an existing one. */
  async createIfMissing(record: SubscriptionRecord): Promise<SubscriptionRecord> {
    if (isDummyDb()) {
      const store = getMemoryStore();
      const existing = store.subscriptions[record.user_id];
      if (existing) return existing;
      store.subscriptions[record.user_id] = record;
      writeLocal(store);
      return record;
    }

    try {
      const db = getAdminDb();
      const { error } = await db
        .from('subscriptions')
        .upsert(record, { onConflict: 'user_id', ignoreDuplicates: true });
      if (!error) {
        const saved = await this.findByUserId(record.user_id);
        if (saved) return saved;
      } else {
        logger.warn(`[billing] Supabase error in createIfMissing (${error.message}), falling back to local store.`);
      }
    } catch (err) {
      logger.warn('[billing] Supabase exception in createIfMissing, falling back to local store', {
        error: err instanceof Error ? err.message : String(err),
      });
    }

    const store = getMemoryStore();
    const existing = store.subscriptions[record.user_id];
    if (existing) return existing;
    store.subscriptions[record.user_id] = record;
    writeLocal(store);
    return record;
  }

  async updatePeriod(
    userId: string,
    periodStart: string,
    periodEnd: string
  ): Promise<SubscriptionRecord> {
    const updatedAt = new Date().toISOString();

    if (isDummyDb()) {
      const store = getMemoryStore();
      const existing = store.subscriptions[userId];
      if (!existing) throw new Error('Subscription not found.');
      const next = {
        ...existing,
        current_period_start: periodStart,
        current_period_end: periodEnd,
        updated_at: updatedAt,
      };
      store.subscriptions[userId] = next;
      writeLocal(store);
      return next;
    }

    try {
      const { data, error } = await getAdminDb()
        .from('subscriptions')
        .update({ current_period_start: periodStart, current_period_end: periodEnd, updated_at: updatedAt })
        .eq('user_id', userId)
        .select('*')
        .single();
      if (!error && data) return data;
      logger.warn(`[billing] Supabase error in updatePeriod (${error?.message}), falling back to local store.`);
    } catch (err) {
      logger.warn('[billing] Supabase exception in updatePeriod, falling back to local store', {
        error: err instanceof Error ? err.message : String(err),
      });
    }

    const store = getMemoryStore();
    const existing = store.subscriptions[userId];
    if (!existing) throw new Error('Subscription not found.');
    const next = {
      ...existing,
      current_period_start: periodStart,
      current_period_end: periodEnd,
      updated_at: updatedAt,
    };
    store.subscriptions[userId] = next;
    writeLocal(store);
    return next;
  }

  async createPayment(payment: NewPayment): Promise<PaymentRecord> {
    const record: PaymentRecord = {
      ...payment,
      id: crypto.randomUUID(),
      provider_ref: null,
      status: 'PENDING',
      created_at: new Date().toISOString(),
      verified_at: null,
    };

    if (isDummyDb()) {
      const store = getMemoryStore();
      store.payments[record.tx_ref] = record;
      writeLocal(store);
      return record;
    }

    try {
      const { data, error } = await getAdminDb().from('payments').insert(record).select('*').single();
      if (!error && data) return normalizePayment(data);
      logger.warn(`[billing] Supabase error in createPayment (${error?.message}), falling back to local store.`);
    } catch (err) {
      logger.warn('[billing] Supabase exception in createPayment, falling back to local store', {
        error: err instanceof Error ? err.message : String(err),
      });
    }

    const store = getMemoryStore();
    store.payments[record.tx_ref] = record;
    writeLocal(store);
    return record;
  }

  async findPaymentByTxRef(txRef: string): Promise<PaymentRecord | null> {
    if (isDummyDb()) {
      return getMemoryStore().payments[txRef] ?? null;
    }

    try {
      const { data, error } = await getAdminDb()
        .from('payments')
        .select('*')
        .eq('tx_ref', txRef)
        .maybeSingle();
      if (!error) return data ? normalizePayment(data) : null;
      logger.warn(`[billing] Supabase error in findPaymentByTxRef (${error.message}), falling back to local store.`);
    } catch (err) {
      logger.warn('[billing] Supabase exception in findPaymentByTxRef, falling back to local store', {
        error: err instanceof Error ? err.message : String(err),
      });
    }

    return getMemoryStore().payments[txRef] ?? null;
  }

  async listPaymentsForUser(userId: string, limit = 10): Promise<PaymentRecord[]> {
    if (isDummyDb()) {
      return Object.values(getMemoryStore().payments)
        .filter((p) => p.user_id === userId)
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .slice(0, limit);
    }

    try {
      const { data, error } = await getAdminDb()
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (!error) return (data ?? []).map(normalizePayment);
      logger.warn(`[billing] Supabase error in listPaymentsForUser (${error.message}), falling back to local store.`);
    } catch (err) {
      logger.warn('[billing] Supabase exception in listPaymentsForUser, falling back to local store', {
        error: err instanceof Error ? err.message : String(err),
      });
    }

    return Object.values(getMemoryStore().payments)
      .filter((p) => p.user_id === userId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, limit);
  }

  /**
   * Moves a PENDING payment to a final status. Returns true only for the caller
   * that performed the transition, so a payment is never applied twice even if
   * the Chapa callback, webhook and return page all arrive at once.
   */
  async settlePayment(
    txRef: string,
    status: Exclude<PaymentStatus, 'PENDING'>,
    providerRef: string | null
  ): Promise<boolean> {
    const verifiedAt = new Date().toISOString();

    if (isDummyDb()) {
      const store = getMemoryStore();
      const payment = store.payments[txRef];
      if (!payment || payment.status !== 'PENDING') return false;
      store.payments[txRef] = { ...payment, status, provider_ref: providerRef, verified_at: verifiedAt };
      writeLocal(store);
      return true;
    }

    try {
      const { data, error } = await getAdminDb()
        .from('payments')
        .update({ status, provider_ref: providerRef, verified_at: verifiedAt })
        .eq('tx_ref', txRef)
        .eq('status', 'PENDING')
        .select('tx_ref');
      if (!error) return (data ?? []).length > 0;
      logger.warn(`[billing] Supabase error in settlePayment (${error.message}), falling back to local store.`);
    } catch (err) {
      logger.warn('[billing] Supabase exception in settlePayment, falling back to local store', {
        error: err instanceof Error ? err.message : String(err),
      });
    }

    const store = getMemoryStore();
    const payment = store.payments[txRef];
    if (!payment || payment.status !== 'PENDING') return false;
    store.payments[txRef] = { ...payment, status, provider_ref: providerRef, verified_at: verifiedAt };
    writeLocal(store);
    return true;
  }
}
