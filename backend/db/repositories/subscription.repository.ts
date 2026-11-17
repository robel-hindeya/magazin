import fs from 'node:fs';
import path from 'node:path';
import { getAdminDb, isDummyDb } from '../admin';

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
/* Local file store, used while Supabase is not configured (dummy mode).       */
/* Persisted to .data/billing.json so trials and payments survive restarts.    */
/* -------------------------------------------------------------------------- */

interface LocalBillingData {
  subscriptions: Record<string, SubscriptionRecord>;
  payments: Record<string, PaymentRecord>;
}

const LOCAL_FILE = path.join(process.cwd(), '.data', 'billing.json');

function readLocal(): LocalBillingData {
  try {
    const raw = fs.readFileSync(LOCAL_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<LocalBillingData>;
    return { subscriptions: parsed.subscriptions ?? {}, payments: parsed.payments ?? {} };
  } catch {
    return { subscriptions: {}, payments: {} };
  }
}

function writeLocal(data: LocalBillingData) {
  fs.mkdirSync(path.dirname(LOCAL_FILE), { recursive: true });
  fs.writeFileSync(LOCAL_FILE, JSON.stringify(data, null, 2), 'utf-8');
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
      return readLocal().subscriptions[userId] ?? null;
    }

    const { data, error } = await getAdminDb()
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw new Error(`Could not load subscription: ${error.message}`);
    return data;
  }

  /** Creates the row if missing; never overwrites an existing one. */
  async createIfMissing(record: SubscriptionRecord): Promise<SubscriptionRecord> {
    if (isDummyDb()) {
      const store = readLocal();
      const existing = store.subscriptions[record.user_id];
      if (existing) return existing;
      store.subscriptions[record.user_id] = record;
      writeLocal(store);
      return record;
    }

    const db = getAdminDb();
    const { error } = await db
      .from('subscriptions')
      .upsert(record, { onConflict: 'user_id', ignoreDuplicates: true });
    if (error) throw new Error(`Could not create subscription: ${error.message}`);
    const saved = await this.findByUserId(record.user_id);
    if (!saved) throw new Error('Subscription row missing after create.');
    return saved;
  }

  async updatePeriod(
    userId: string,
    periodStart: string,
    periodEnd: string
  ): Promise<SubscriptionRecord> {
    const updatedAt = new Date().toISOString();

    if (isDummyDb()) {
      const store = readLocal();
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

    const { data, error } = await getAdminDb()
      .from('subscriptions')
      .update({ current_period_start: periodStart, current_period_end: periodEnd, updated_at: updatedAt })
      .eq('user_id', userId)
      .select('*')
      .single();
    if (error || !data) throw new Error(`Could not update subscription: ${error?.message}`);
    return data;
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
      const store = readLocal();
      store.payments[record.tx_ref] = record;
      writeLocal(store);
      return record;
    }

    const { data, error } = await getAdminDb().from('payments').insert(record).select('*').single();
    if (error || !data) throw new Error(`Could not record payment: ${error?.message}`);
    return normalizePayment(data);
  }

  async findPaymentByTxRef(txRef: string): Promise<PaymentRecord | null> {
    if (isDummyDb()) {
      return readLocal().payments[txRef] ?? null;
    }

    const { data, error } = await getAdminDb()
      .from('payments')
      .select('*')
      .eq('tx_ref', txRef)
      .maybeSingle();
    if (error) throw new Error(`Could not load payment: ${error.message}`);
    return data ? normalizePayment(data) : null;
  }

  async listPaymentsForUser(userId: string, limit = 10): Promise<PaymentRecord[]> {
    if (isDummyDb()) {
      return Object.values(readLocal().payments)
        .filter((p) => p.user_id === userId)
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .slice(0, limit);
    }

    const { data, error } = await getAdminDb()
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw new Error(`Could not load payments: ${error.message}`);
    return (data ?? []).map(normalizePayment);
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
      const store = readLocal();
      const payment = store.payments[txRef];
      if (!payment || payment.status !== 'PENDING') return false;
      store.payments[txRef] = { ...payment, status, provider_ref: providerRef, verified_at: verifiedAt };
      writeLocal(store);
      return true;
    }

    const { data, error } = await getAdminDb()
      .from('payments')
      .update({ status, provider_ref: providerRef, verified_at: verifiedAt })
      .eq('tx_ref', txRef)
      .eq('status', 'PENDING')
      .select('tx_ref');
    if (error) throw new Error(`Could not settle payment: ${error.message}`);
    return (data ?? []).length > 0;
  }
}
