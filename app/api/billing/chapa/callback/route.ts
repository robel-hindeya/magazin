import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/backend/services/subscription.service';
import { isValidWebhookSignature } from '@/backend/payments/chapa';
import { logger } from '@/backend/utils/logger';

/**
 * Chapa server-to-server notifications. Public (no user session).
 *  - GET  : the `callback_url` Chapa calls after checkout (?trx_ref=...&status=...)
 *  - POST : the webhook URL set in the Chapa dashboard (JSON body with tx_ref)
 * Nothing in the request is trusted: the payment is always re-verified with
 * the Chapa API before access is granted.
 */

async function confirm(txRef: string | null | undefined) {
  if (!txRef) {
    return NextResponse.json({ ok: false, error: 'Missing tx_ref' }, { status: 400 });
  }
  try {
    const result = await new SubscriptionService().confirmPayment(txRef);
    return NextResponse.json({ ok: true, outcome: result.outcome });
  } catch (error) {
    logger.error('[billing] Chapa callback failed', {
      txRef,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  return confirm(params.get('trx_ref') ?? params.get('tx_ref'));
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  if (!isValidWebhookSignature(rawBody, request.headers)) {
    return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 401 });
  }

  let payload: { tx_ref?: string; trx_ref?: string } = {};
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  return confirm(payload.tx_ref ?? payload.trx_ref);
}
