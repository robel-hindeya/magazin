'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Heart, ExternalLink, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PARENT_PIN_COOKIE } from '@/backend/constants/roles';

export interface ParentGateButtonProps {
  variant?: 'navbar-desktop' | 'navbar-mobile' | 'sidebar' | 'kid-page-card' | 'badge';
  className?: string;
  label?: string;
  showIcon?: boolean;
}

export function ParentGateButton({
  variant = 'navbar-desktop',
  className,
  label = 'Parents',
  showIcon = true,
}: ParentGateButtonProps) {
  const pathname = usePathname();
  const isCurrentActive = pathname.startsWith('/users/families');

  return (
    <>
      {variant === 'navbar-desktop' && (
        <a
          href="/api/auth/parent-session"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex items-center gap-1.5 transition-all hover:text-emerald-600 dark:hover:text-emerald-400 hover:-translate-y-0.5 transform cursor-pointer text-sm font-display font-bold',
            isCurrentActive ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-slate-600 dark:text-purple-200',
            className
          )}
          title="Open Family Dashboard in a new window (Automatic Login)"
        >
          {showIcon && <Heart className="h-3.5 w-3.5 text-pink-500 fill-pink-500/20" />}
          <span>{label}</span>
          <ExternalLink className="h-3 w-3 text-slate-400 dark:text-purple-400 ml-0.5" />
        </a>
      )}

      {variant === 'navbar-mobile' && (
        <a
          href="/api/auth/parent-session"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer',
            isCurrentActive ? 'text-emerald-600 dark:text-emerald-400 font-black scale-105' : 'text-slate-600 dark:text-purple-300 hover:text-emerald-600 dark:hover:text-emerald-400',
            className
          )}
          title="Open Family Dashboard in a new window (Automatic Login)"
        >
          <div className="relative">
            <Heart className="h-5 w-5 mb-0.5 text-pink-500 fill-pink-500/20" />
            <ExternalLink className="h-2.5 w-2.5 text-slate-400 dark:text-purple-400 absolute -top-1 -right-2" />
          </div>
          <span className="text-[11px] font-display font-bold">{label}</span>
        </a>
      )}

      {/* For kids page card: Completely removed so kids never see family page */}
      {variant === 'kid-page-card' && null}
    </>
  );
}

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
