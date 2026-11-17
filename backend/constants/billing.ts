import { ROLES, UserRole } from './roles';

function readInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readAmount(value: string | undefined, fallback: number): number {
  const parsed = Number.parseFloat(value ?? '');
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Billing settings, read from env at call time so edits to .env.local
 * take effect after a dev-server restart without code changes.
 */
export function getBillingConfig() {
  return {
    trialDays: readInt(process.env.TRIAL_DAYS, 14),
    periodDays: readInt(process.env.SUBSCRIPTION_PERIOD_DAYS, 30),
    priceEtb: readAmount(process.env.SUBSCRIPTION_PRICE_ETB, 300),
    currency: 'ETB' as const,
  };
}

/** Staff accounts never need a subscription. */
export const BILLING_EXEMPT_ROLES: UserRole[] = [ROLES.ADMIN, ROLES.SUPERADMIN];

export const DAY_MS = 24 * 60 * 60 * 1000;
