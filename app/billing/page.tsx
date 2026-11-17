import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CheckCircle2, Clock, Crown, Sparkles, XCircle, ShieldCheck, ArrowLeft } from 'lucide-react';
import { getCurrentUser } from '@/backend/auth/session';
import { ROLE_REDIRECTS } from '@/backend/constants/roles';
import { ConfirmResult, SubscriptionService } from '@/backend/services/subscription.service';
import { isChapaConfigured, isChapaTestMode } from '@/backend/payments/chapa';
import { Card } from '@/components/ui/card';
import { PayWithChapaButton } from '@/components/billing/pay-with-chapa-button';

export const metadata = { title: 'Subscription - Selam Kids' };

function formatDate(iso: string | null): string {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function PaymentNotice({ result }: { result: ConfirmResult }) {
  if (result.outcome === 'activated' || result.outcome === 'already_applied') {
    return (
      <div className="flex items-start gap-3 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
        <div>
          <p className="font-black">Payment received. Thank you!</p>
          <p className="text-sm">Your subscription is active until {formatDate(result.paidUntil)}.</p>
        </div>
      </div>
    );
  }
  if (result.outcome === 'pending') {
    return (
      <div className="flex items-start gap-3 rounded-2xl border-2 border-sky-200 bg-sky-50 p-4 text-sky-900 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100">
        <Clock className="mt-0.5 h-5 w-5 shrink-0 text-sky-500" />
        <div>
          <p className="font-black">We are still waiting for Chapa to confirm your payment.</p>
          <p className="text-sm">Refresh this page in a minute. If you closed the payment page, you can pay again below.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3 rounded-2xl border-2 border-rose-200 bg-rose-50 p-4 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100">
      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
      <div>
        <p className="font-black">The payment did not go through.</p>
        <p className="text-sm">No access was added. Please try again.</p>
      </div>
    </div>
  );
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams?: Promise<{ tx_ref?: string; expired?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login?redirectTo=/billing');

  const service = new SubscriptionService();
  const homeHref = ROLE_REDIRECTS[user.role] || '/users';

  // Returning from Chapa checkout: verify that payment right away.
  let paymentResult: ConfirmResult | null = null;
  if (params.tx_ref) {
    try {
      paymentResult = await service.confirmPayment(params.tx_ref);
    } catch (error) {
      console.error('[billing] Could not confirm payment on return', error);
      paymentResult = { outcome: 'pending' };
    }
  }

  const status = await service.getStatus(user);
  const payments = service.isExempt(user) ? [] : await service.listPayments(user);
  const chapaReady = isChapaConfigured();

  const stateCopy = {
    EXEMPT: { label: 'Staff account', tone: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' },
    TRIALING: { label: 'Free trial', tone: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200' },
    ACTIVE: { label: 'Active', tone: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200' },
    EXPIRED: { label: 'Expired', tone: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-200' },
  }[status.state];

  return (
    <main className="flex-1 bg-slate-50 dark:bg-[#070314] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl space-y-6">
        {status.hasAccess && (
          <Link
            href={homeHref}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-600 hover:text-purple-500 dark:text-purple-300"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Selam Kids
          </Link>
        )}

        <header className="space-y-2">
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Your Selam Kids subscription
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Everyone starts with a {status.trialDays}-day free trial. After that, one payment unlocks{' '}
            {status.periodDays} days of stories, magazines, games and music.
          </p>
        </header>

        {paymentResult && <PaymentNotice result={paymentResult} />}

        {params.expired && status.state === 'EXPIRED' && !paymentResult && (
          <div className="flex items-start gap-3 rounded-2xl border-2 border-rose-200 bg-rose-50 p-4 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
            <p className="text-sm font-bold">
              Your access has ended. Subscribe below to continue the adventure.
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-5">
          {/* Current status */}
          <Card className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-black">Status</h2>
              <span className={`rounded-full px-3 py-1 text-xs font-black ${stateCopy.tone}`}>{stateCopy.label}</span>
            </div>

            {status.state === 'EXEMPT' ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Admin accounts have full access and never need to pay.
              </p>
            ) : (
              <dl className="space-y-3 text-sm">
                {(status.state === 'TRIALING' || status.state === 'ACTIVE') && (
                  <div>
                    <dt className="text-slate-500 dark:text-slate-400">Days left</dt>
                    <dd className="font-display text-3xl font-black text-slate-900 dark:text-white">{status.daysLeft}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-slate-500 dark:text-slate-400">Free trial ends</dt>
                  <dd className="font-bold">{formatDate(status.trialEndsAt)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 dark:text-slate-400">Paid until</dt>
                  <dd className="font-bold">{status.paidUntil ? formatDate(status.paidUntil) : 'Not paid yet'}</dd>
                </div>
              </dl>
            )}
          </Card>

          {/* Plan + pay */}
          {status.state !== 'EXEMPT' && (
            <Card className="md:col-span-3 space-y-5 border-purple-200 dark:border-purple-700/60">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-300">
                <Crown className="h-5 w-5" />
                <span className="text-sm font-black uppercase tracking-wider">Monthly plan</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="font-display text-5xl font-black text-slate-900 dark:text-white">
                  {status.priceEtb.toLocaleString()}
                </span>
                <span className="pb-2 font-bold text-slate-500 dark:text-slate-400">
                  ETB / {status.periodDays} days
                </span>
              </div>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                {['Full magazine library and reader', 'Story writing and daily quests', 'Games, Melody World and community'].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 shrink-0 text-amber-500" /> {item}
                    </li>
                  )
                )}
              </ul>

              {chapaReady ? (
                <PayWithChapaButton
                  label={status.state === 'EXPIRED' ? 'Pay with Chapa' : status.state === 'ACTIVE' ? `Add ${status.periodDays} more days` : 'Subscribe with Chapa'}
                />
              ) : (
                <p className="rounded-2xl bg-slate-100 p-3 text-sm font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">
                  Online payment is not available yet. Please check back soon.
                </p>
              )}

              <p className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Secure checkout by Chapa: telebirr, CBE Birr, M-Pesa, bank cards and more. One-time payment, no
                  automatic renewal. Paying early adds the days on top of the time you already have.
                  {isChapaTestMode() && ' (Test mode: no real money is charged.)'}
                </span>
              </p>
            </Card>
          )}
        </div>

        {payments.length > 0 && (
          <Card className="space-y-3">
            <h2 className="font-display text-lg font-black">Payment history</h2>
            <ul className="divide-y divide-slate-100 dark:divide-white/10 text-sm">
              {payments.map((p) => (
                <li key={p.tx_ref} className="flex items-center justify-between gap-3 py-2">
                  <span className="text-slate-600 dark:text-slate-300">{formatDate(p.created_at)}</span>
                  <span className="font-bold">
                    {p.amount.toLocaleString()} {p.currency}
                  </span>
                  <span
                    className={
                      p.status === 'SUCCESS'
                        ? 'font-black text-emerald-600 dark:text-emerald-400'
                        : p.status === 'FAILED'
                          ? 'font-black text-rose-600 dark:text-rose-400'
                          : 'font-black text-slate-500'
                    }
                  >
                    {p.status === 'SUCCESS' ? 'Paid' : p.status === 'FAILED' ? 'Failed' : 'Not completed'}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </main>
  );
}
