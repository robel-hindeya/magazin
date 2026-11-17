import crypto from 'node:crypto';
import { AuthUser } from '@/types/auth';
import { BILLING_EXEMPT_ROLES, DAY_MS, getBillingConfig } from '@/backend/constants/billing';
import {
  PaymentRecord,
  SubscriptionRecord,
  SubscriptionRepository,
} from '@/backend/db/repositories/subscription.repository';
import {
  initializeTransaction,
  isChapaConfigured,
  PaymentsNotConfiguredError,
  verifyTransaction,
} from '@/backend/payments/chapa';
import { getPhoneAuthStore } from '@/backend/auth/phone-auth';
import { siteConfig } from '@/lib/config';
import { logger } from '@/backend/utils/logger';

export type SubscriptionState = 'EXEMPT' | 'TRIALING' | 'ACTIVE' | 'EXPIRED';

export interface SubscriptionStatus {
  state: SubscriptionState;
  hasAccess: boolean;
  trialEndsAt: string | null;
  paidUntil: string | null;
  /** Whole days of access left (trial or paid, whichever is later). */
  daysLeft: number;
  priceEtb: number;
  periodDays: number;
  trialDays: number;
}

export type ConfirmResult =
  | { outcome: 'activated' | 'already_applied'; paidUntil: string | null }
  | { outcome: 'pending' | 'failed' | 'not_found' };

function laterOf(...dates: (string | null | undefined)[]): number {
  return Math.max(0, ...dates.filter(Boolean).map((d) => new Date(d as string).getTime()));
}

function daysUntil(ms: number, now: number): number {
  return ms > now ? Math.ceil((ms - now) / DAY_MS) : 0;
}

/** Chapa expects Ethiopian numbers as 09xxxxxxxx / 07xxxxxxxx. */
function toChapaPhone(fullPhone: string | undefined): string | undefined {
  const digits = (fullPhone ?? '').replace(/\D/g, '');
  const local = digits.startsWith('251') ? digits.slice(3) : digits.replace(/^0/, '');
  return /^[79]\d{8}$/.test(local) ? `0${local}` : undefined;
}

function splitName(fullName: string | undefined): { firstName?: string; lastName?: string } {
  const parts = (fullName ?? '').replace(/[^\p{L}\s'-]/gu, ' ').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return {};
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') || undefined };
}

export class SubscriptionService {
  private repo = new SubscriptionRepository();

  isExempt(user: AuthUser): boolean {
    return BILLING_EXEMPT_ROLES.includes(user.role);
  }

  /** Returns the user's subscription row, starting their free trial on first visit. */
  async getOrStartSubscription(userId: string): Promise<SubscriptionRecord> {
    const existing = await this.repo.findByUserId(userId);
    if (existing) return existing;

    const { trialDays } = getBillingConfig();
    const now = new Date();
    return this.repo.createIfMissing({
      user_id: userId,
      plan: 'MONTHLY',
      trial_started_at: now.toISOString(),
      trial_ends_at: new Date(now.getTime() + trialDays * DAY_MS).toISOString(),
      current_period_start: null,
      current_period_end: null,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    });
  }

  async getStatus(user: AuthUser): Promise<SubscriptionStatus> {
    const config = getBillingConfig();
    const base = { priceEtb: config.priceEtb, periodDays: config.periodDays, trialDays: config.trialDays };

    if (this.isExempt(user)) {
      return { ...base, state: 'EXEMPT', hasAccess: true, trialEndsAt: null, paidUntil: null, daysLeft: 0 };
    }

    const sub = await this.getOrStartSubscription(user.id);
    const now = Date.now();
    const trialEnd = new Date(sub.trial_ends_at).getTime();
    const paidEnd = sub.current_period_end ? new Date(sub.current_period_end).getTime() : 0;

    const state: SubscriptionState = paidEnd > now ? 'ACTIVE' : trialEnd > now ? 'TRIALING' : 'EXPIRED';

    return {
      ...base,
      state,
      hasAccess: state !== 'EXPIRED',
      trialEndsAt: sub.trial_ends_at,
      paidUntil: sub.current_period_end,
      daysLeft: daysUntil(Math.max(trialEnd, paidEnd), now),
    };
  }

  async listPayments(user: AuthUser): Promise<PaymentRecord[]> {
    return this.repo.listPaymentsForUser(user.id);
  }

  /** Creates a pending payment and returns the Chapa checkout page URL. */
  async startCheckout(user: AuthUser, appUrlOverride?: string): Promise<{ checkoutUrl: string; txRef: string }> {
    if (!isChapaConfigured()) throw new PaymentsNotConfiguredError();

    const { priceEtb, periodDays, currency } = getBillingConfig();
    const txRef = `selam-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const targetAppUrl = appUrlOverride || siteConfig.url;
    const appUrl = targetAppUrl.replace(/\/$/, '');

    await this.getOrStartSubscription(user.id);
    await this.repo.createPayment({
      user_id: user.id,
      tx_ref: txRef,
      provider: 'CHAPA',
      amount: priceEtb,
      currency,
      period_days: periodDays,
    });

    const phoneUser = getPhoneAuthStore().findById(user.id);
    const email = user.email || `${user.id.slice(0, 8)}@selamkids.com`;

    const checkout = initializeTransaction({
      txRef,
      amount: priceEtb,
      currency,
      email,
      phoneNumber: toChapaPhone(phoneUser?.fullPhoneNumber),
      ...splitName(user.fullName),
      callbackUrl: `${appUrl}/api/billing/chapa/callback`,
      returnUrl: `${appUrl}/billing?tx_ref=${encodeURIComponent(txRef)}`,
      title: 'Selam Kids',
      description: `Selam Kids ${periodDays} day subscription`,
    });

    try {
      const { checkoutUrl } = await checkout;
      return { checkoutUrl, txRef };
    } catch (error) {
      // Chapa never opened a checkout for this tx_ref, so close it out.
      await this.repo.settlePayment(txRef, 'FAILED', null).catch(() => undefined);
      throw error;
    }
  }

  /**
   * Verifies a payment with Chapa and, the first time it succeeds, extends the
   * user's access by one period. Safe to call repeatedly for the same tx_ref.
   */
  async confirmPayment(txRef: string): Promise<ConfirmResult> {
    const payment = await this.repo.findPaymentByTxRef(txRef);
    if (!payment) return { outcome: 'not_found' };

    if (payment.status === 'SUCCESS') {
      const sub = await this.repo.findByUserId(payment.user_id);
      return { outcome: 'already_applied', paidUntil: sub?.current_period_end ?? null };
    }
    if (payment.status === 'FAILED') return { outcome: 'failed' };

    const verified = await verifyTransaction(txRef);
    if (verified.status === 'pending') return { outcome: 'pending' };

    const amountOk = verified.amount + 0.001 >= payment.amount;
    const currencyOk = verified.currency === payment.currency;

    if (verified.status === 'failed' || !amountOk || !currencyOk) {
      if (verified.status === 'success') {
        logger.warn('[billing] Chapa payment did not match the expected amount/currency', {
          txRef,
          expected: { amount: payment.amount, currency: payment.currency },
          received: { amount: verified.amount, currency: verified.currency },
        });
      }
      await this.repo.settlePayment(txRef, 'FAILED', verified.reference);
      return { outcome: 'failed' };
    }

    const claimed = await this.repo.settlePayment(txRef, 'SUCCESS', verified.reference);
    if (!claimed) {
      const sub = await this.repo.findByUserId(payment.user_id);
      return { outcome: 'already_applied', paidUntil: sub?.current_period_end ?? null };
    }

    // A new period starts after whatever access the user still has left,
    // so paying early (even during the free trial) never loses days.
    const sub = await this.getOrStartSubscription(payment.user_id);
    const now = Date.now();
    const start = Math.max(now, laterOf(sub.trial_ends_at, sub.current_period_end));
    const end = start + payment.period_days * DAY_MS;
    const updated = await this.repo.updatePeriod(
      payment.user_id,
      new Date(start).toISOString(),
      new Date(end).toISOString()
    );

    return { outcome: 'activated', paidUntil: updated.current_period_end };
  }
}
