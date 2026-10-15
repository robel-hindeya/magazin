import * as React from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LoadingSpinner({
  className,
  size = 'md',
  message,
  showIcon = true,
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  showIcon?: boolean;
}) {
  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const spinnerSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-5 w-5',
    lg: 'h-7 w-7',
  };

  if (!showIcon) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-3 p-6 text-slate-500', className)}>
        <Loader2 className={cn('animate-spin text-emerald-500', spinnerSizes[size])} />
        {message && <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{message}</p>}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 p-6 text-center select-none', className)}>
      <div className="relative flex items-center justify-center">
        {/* Soft background aura */}
        <div className="absolute -inset-2 rounded-full bg-amber-400/20 blur-md animate-pulse" />
        {/* Animated Selam Kids Icon */}
        <div className={cn('relative animate-bounce duration-1000', iconSizes[size])}>
          <Image
            src="/images/logo.png"
            alt="Selam Kids"
            fill
            sizes="64px"
            className="object-contain drop-shadow-md"
            priority
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Loader2 className={cn('animate-spin text-emerald-500 shrink-0', spinnerSizes[size])} />
        {message && (
          <p className="font-display font-black text-xs sm:text-sm text-slate-800 dark:text-purple-200">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
