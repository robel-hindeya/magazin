'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PARENT_PIN_COOKIE } from '@/backend/constants/roles';

export function ParentLockExitButton({
  className,
}: {
  className?: string;
}) {
  const router = useRouter();
  const [locking, setLocking] = React.useState(false);

  const handleLockAndExit = async () => {
    setLocking(true);
    try {
      await fetch('/api/families/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'lock' }),
      });
    } catch {
      // Continue anyway
    }
    // Delete cookie on client as well
    if (typeof document !== 'undefined') {
      document.cookie = `${PARENT_PIN_COOKIE}=; path=/; max-age=0`;
    }
    router.push('/users/kids');
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleLockAndExit}
      disabled={locking}
      className={cn(
        'font-black text-xs gap-1.5 border-rose-300 text-rose-700 bg-rose-50/80 hover:bg-rose-100 hover:text-rose-900 shadow-sm cursor-pointer',
        className
      )}
    >
      <Lock className="h-3.5 w-3.5 text-rose-600" />
      <span>{locking ? 'Locking...' : 'Exit to Kids Mode (✕)'}</span>
    </Button>
  );
}
