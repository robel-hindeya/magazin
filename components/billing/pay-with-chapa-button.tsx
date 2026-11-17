'use client';

import { useState } from 'react';
import { Loader2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PayWithChapaButton({ label, disabled }: { label: string; disabled?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/billing/checkout', { method: 'POST' });
      const json = await res.json().catch(() => null);
      const checkoutUrl: string | undefined = json?.data?.checkoutUrl;
      if (!res.ok || !checkoutUrl) {
        throw new Error(json?.error?.message || 'Could not start the payment. Please try again.');
      }
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start the payment.');
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button
        variant="emerald"
        size="lg"
        className="w-full"
        onClick={handlePay}
        disabled={loading || disabled}
      >
        {loading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <CreditCard className="mr-2 h-5 w-5" />
        )}
        {loading ? 'Opening Chapa…' : label}
      </Button>
      {error && (
        <p role="alert" className="text-sm font-semibold text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
}
