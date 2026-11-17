import crypto from 'node:crypto';
import { AppError } from '@/backend/errors/app-error';

/**
 * Minimal server-side Chapa client (https://developer.chapa.co).
 * Keys come from .env.local and must never reach the browser.
 */

const CHAPA_API = 'https://api.chapa.co/v1';

export class PaymentsNotConfiguredError extends AppError {
  constructor() {
    super(
      'Payments are not set up yet. Add CHAPA_SECRET_KEY to .env.local and restart the server.',
      503,
      'PAYMENTS_NOT_CONFIGURED'
    );
  }
}

export class PaymentProviderError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 502, 'PAYMENT_PROVIDER_ERROR', true, details);
  }
}

function getSecretKey(): string {
  const key = process.env.CHAPA_SECRET_KEY?.trim();
  if (!key) throw new PaymentsNotConfiguredError();
  return key;
}

export function isChapaConfigured(): boolean {
  return Boolean(process.env.CHAPA_SECRET_KEY?.trim());
}

export function isChapaTestMode(): boolean {
  return (process.env.CHAPA_SECRET_KEY ?? '').startsWith('CHASECK_TEST');
}

function describeChapaMessage(message: unknown): string {
  if (!message) return 'Unknown error from Chapa.';
  if (typeof message === 'string') return message;
  if (typeof message === 'object') {
    return Object.entries(message as Record<string, unknown>)
      .map(([field, value]) => `${field}: ${Array.isArray(value) ? value.join(', ') : String(value)}`)
      .join('; ');
  }
  return String(message);
}

export interface InitializeInput {
  txRef: string;
  amount: number;
  currency: string;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  callbackUrl: string;
  returnUrl: string;
  title: string;
  description: string;
}

export async function initializeTransaction(input: InitializeInput): Promise<{ checkoutUrl: string }> {
  const body: Record<string, unknown> = {
    amount: input.amount.toFixed(2),
    currency: input.currency,
    tx_ref: input.txRef,
    callback_url: input.callbackUrl,
    return_url: input.returnUrl,
    customization: {
      // Chapa limits: title <= 16 chars; letters, numbers, spaces, - _ . only.
      title: input.title.slice(0, 16),
      description: input.description,
    },
  };
  if (input.email) body.email = input.email;
  if (input.phoneNumber) body.phone_number = input.phoneNumber;
  if (input.firstName) body.first_name = input.firstName;
  if (input.lastName) body.last_name = input.lastName;

  const res = await fetch(`${CHAPA_API}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const json = (await res.json().catch(() => null)) as
    | { status?: string; message?: unknown; data?: { checkout_url?: string } }
    | null;

  const checkoutUrl = json?.data?.checkout_url;
  if (!res.ok || json?.status !== 'success' || !checkoutUrl) {
    throw new PaymentProviderError(`Chapa could not start the payment: ${describeChapaMessage(json?.message)}`);
  }

  return { checkoutUrl };
}

export interface VerifiedTransaction {
  status: 'success' | 'failed' | 'pending';
  amount: number;
  currency: string;
  txRef: string;
  reference: string | null;
}

export async function verifyTransaction(txRef: string): Promise<VerifiedTransaction> {
  const res = await fetch(`${CHAPA_API}/transaction/verify/${encodeURIComponent(txRef)}`, {
    headers: { Authorization: `Bearer ${getSecretKey()}` },
    cache: 'no-store',
  });

  const json = (await res.json().catch(() => null)) as
    | {
        status?: string;
        message?: unknown;
        data?: {
          status?: string;
          amount?: number | string;
          currency?: string;
          tx_ref?: string;
          reference?: string;
        } | null;
      }
    | null;

  // Chapa answers 4xx/"failed" while the customer has not paid yet.
  if (!res.ok || json?.status !== 'success' || !json.data) {
    return { status: 'pending', amount: 0, currency: '', txRef, reference: null };
  }

  const raw = (json.data.status ?? '').toLowerCase();
  const status: VerifiedTransaction['status'] =
    raw === 'success' ? 'success' : raw === 'failed' ? 'failed' : 'pending';

  return {
    status,
    amount: Number(json.data.amount ?? 0),
    currency: (json.data.currency ?? '').toUpperCase(),
    txRef: json.data.tx_ref ?? txRef,
    reference: json.data.reference ?? null,
  };
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

/**
 * Checks a Chapa webhook signature. Chapa sends `x-chapa-signature`
 * (HMAC-SHA256 of the raw body) and `chapa-signature` (HMAC-SHA256 of the
 * secret itself), both keyed with the webhook secret from the dashboard.
 * Returns true when no webhook secret is configured; every payment is
 * re-verified with the Chapa API before it is applied anyway.
 */
export function isValidWebhookSignature(rawBody: string, headers: Headers): boolean {
  const secret = process.env.CHAPA_WEBHOOK_SECRET?.trim();
  if (!secret) return true;

  const bodySig = headers.get('x-chapa-signature');
  if (bodySig) {
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    if (safeEqual(bodySig, expected)) return true;
  }

  const secretSig = headers.get('chapa-signature');
  if (secretSig) {
    const expected = crypto.createHmac('sha256', secret).update(secret).digest('hex');
    if (safeEqual(secretSig, expected)) return true;
  }

  return false;
}
