import Link from 'next/link';
import { Sparkles, Crown } from 'lucide-react';
import type { SubscriptionStatus } from '@/backend/services/subscription.service';

/**
 * Slim reminder shown at the top of the portal while the user is on the free
 * trial, or when a paid period is about to run out (3 days or less).
 */
export function SubscriptionBanner({ status }: { status: SubscriptionStatus }) {
  const endingSoon = status.state === 'ACTIVE' && status.daysLeft <= 3;
  if (status.state !== 'TRIALING' && !endingSoon) return null;

  const dayWord = status.daysLeft === 1 ? 'day' : 'days';
  const message =
    status.state === 'TRIALING'
      ? `Free trial: ${status.daysLeft} ${dayWord} left`
      : `Your subscription ends in ${status.daysLeft} ${dayWord}`;

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 justify-between rounded-2xl border-2 border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
      <p className="flex items-center gap-2 text-sm font-bold">
        {status.state === 'TRIALING' ? (
          <Sparkles className="h-4 w-4 shrink-0 text-amber-500" />
        ) : (
          <Crown className="h-4 w-4 shrink-0 text-amber-500" />
        )}
        <span>
          {message}. Keep the adventure going for {status.priceEtb.toLocaleString()} ETB / {status.periodDays} days.
        </span>
      </p>
      <Link
        href="/billing"
        className="inline-flex shrink-0 items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-xs font-black text-slate-950 shadow-sm transition-colors hover:bg-emerald-400"
      >
        {status.state === 'TRIALING' ? 'Subscribe now' : 'Renew now'}
      </Link>
    </div>
  );
}
