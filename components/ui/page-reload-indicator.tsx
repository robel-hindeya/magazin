'use client';

import * as React from 'react';
import Image from 'next/image';

export function PageReloadIndicator() {
  const [isReloading, setIsReloading] = React.useState(false);

  React.useEffect(() => {
    const handleBeforeUnload = () => {
      setIsReloading(true);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (!isReloading) return null;

  return (
    <div
      className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white/95 dark:bg-[#070314]/95 backdrop-blur-md transition-opacity duration-200 animate-in fade-in select-none"
      aria-live="polite"
    >
      <div className="relative flex items-center justify-center">
        {/* Soft magical glowing orb */}
        <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-purple-600/30 via-amber-400/30 to-emerald-500/30 blur-2xl animate-pulse" />

        {/* Mascot cloud icon */}
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 drop-shadow-[0_12px_28px_rgba(16,185,129,0.4)] animate-bounce duration-700">
          <Image
            src="/images/logo.png"
            alt="Selam Kids"
            fill
            sizes="96px"
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col items-center gap-1.5 z-10 text-center">
        <h2 className="font-display font-black text-xl text-slate-900 dark:text-white tracking-wide">
          Selam<span className="text-emerald-500 dark:text-emerald-400">Kids</span>
        </h2>
        <p className="font-display font-bold text-xs text-purple-700 dark:text-purple-300">
          Loading your adventure...
        </p>

        {/* Animated bounce dots */}
        <div className="flex items-center gap-1.5 mt-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping duration-1000" />
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping delay-150 duration-1000" />
          <span className="h-2 w-2 rounded-full bg-purple-500 animate-ping delay-300 duration-1000" />
        </div>
      </div>
    </div>
  );
}
