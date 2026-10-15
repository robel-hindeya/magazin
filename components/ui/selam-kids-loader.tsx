import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SelamKidsLoaderProps {
  message?: string;
  submessage?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SelamKidsLoader({
  message = 'Loading Selam Kids...',
  submessage,
  fullScreen = false,
  size = 'md',
  className,
}: SelamKidsLoaderProps) {
  const iconSizes = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16 sm:h-20 sm:w-20',
    lg: 'h-24 w-24 sm:h-28 sm:w-28',
  };

  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-6 select-none',
        className
      )}
    >
      {/* Animated Mascot Container */}
      <div className="relative flex items-center justify-center">
        {/* Soft glowing ambient background */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-purple-600/30 via-amber-400/30 to-emerald-500/30 blur-xl animate-pulse" />

        {/* Mascot Icon with gentle floating animation */}
        <div className={cn('relative drop-shadow-[0_10px_25px_rgba(16,185,129,0.35)] animate-bounce duration-1000', iconSizes[size])}>
          <Image
            src="/images/logo.png"
            alt="Selam Kids"
            fill
            sizes="120px"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Brand & Loading Status */}
      <div className="mt-4 flex flex-col items-center gap-1.5 z-10">
        <div className="flex items-center gap-1">
          <span className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white tracking-wide">
            Selam<span className="text-emerald-500 dark:text-emerald-400">Kids</span>
          </span>
        </div>

        {message && (
          <p className="font-display font-bold text-xs sm:text-sm text-purple-700 dark:text-purple-300">
            {message}
          </p>
        )}

        {submessage && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {submessage}
          </p>
        )}

        {/* Fun pulsating dots indicator */}
        <div className="flex items-center gap-1.5 mt-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping duration-1000" />
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping delay-150 duration-1000" />
          <span className="h-2 w-2 rounded-full bg-purple-500 animate-ping delay-300 duration-1000" />
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/95 dark:bg-[#070314]/95 backdrop-blur-md transition-all">
        {content}
      </div>
    );
  }

  return content;
}
