'use client';

import * as React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/components/theme/theme-provider';
import { cn } from '@/lib/utils';

export interface ThemeToggleProps {
  variant?: 'icon' | 'pill' | 'compact' | 'segmented';
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({
  variant = 'icon',
  className,
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme, mounted } = useTheme();

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className={cn(
          'relative flex items-center justify-center rounded-2xl p-2 text-slate-400 opacity-60 transition-all',
          variant === 'compact' ? 'h-8 w-8' : 'h-10 w-10',
          className
        )}
        disabled
      >
        <div className="h-5 w-5 rounded-full border-2 border-purple-400/40 border-t-transparent animate-spin" />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  if (variant === 'segmented') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-purple-950/60 border border-slate-200/80 dark:border-purple-800/60 shadow-inner',
          className
        )}
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={cn(
            'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-display font-bold transition-all',
            theme === 'light'
              ? 'bg-white text-emerald-600 shadow-sm font-black dark:bg-emerald-500 dark:text-slate-950'
              : 'text-slate-600 hover:text-slate-900 dark:text-purple-300 dark:hover:text-white'
          )}
          title="Light Mode (Day Realm)"
        >
          <Sun className="h-3.5 w-3.5" />
          <span>Day</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={cn(
            'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-display font-bold transition-all',
            theme === 'dark'
              ? 'bg-purple-900 text-purple-200 shadow-sm font-black border border-purple-700/60'
              : 'text-slate-600 hover:text-slate-900 dark:text-purple-300 dark:hover:text-white'
          )}
          title="Dark Mode (Night Realm)"
        >
          <Moon className="h-3.5 w-3.5" />
          <span>Night</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('system')}
          className={cn(
            'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-display font-bold transition-all',
            theme === 'system'
              ? 'bg-white text-purple-700 shadow-sm font-black dark:bg-purple-800 dark:text-white'
              : 'text-slate-600 hover:text-slate-900 dark:text-purple-300 dark:hover:text-white'
          )}
          title="System Preference"
        >
          <Monitor className="h-3.5 w-3.5" />
          <span>Auto</span>
        </button>
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={cn(
          'group flex items-center gap-2.5 rounded-2xl px-3.5 py-2 text-xs font-display font-extrabold transition-all border shadow-sm active:scale-95',
          isDark
            ? 'bg-purple-950/80 hover:bg-purple-900/90 text-purple-200 border-purple-800/80 shadow-purple-950/40'
            : 'bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 border-emerald-200/80 shadow-emerald-200/20',
          className
        )}
        title={isDark ? 'Switch to Light Mode (Day Realm)' : 'Switch to Dark Mode (Night Realm)'}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <span
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-xl transition-transform duration-300 group-hover:rotate-12',
            isDark ? 'bg-purple-900 text-purple-200' : 'bg-emerald-400 text-slate-950'
          )}
        >
          {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
        </span>
        <span>{isDark ? 'Night Realm' : 'Day Realm'}</span>
      </button>
    );
  }

  // Default 'icon' or 'compact' button
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'group relative flex items-center justify-center rounded-2xl border transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400',
        variant === 'compact' ? 'h-9 w-9' : 'h-10 w-10 sm:h-11 sm:w-11',
        isDark
          ? 'bg-purple-950/80 hover:bg-purple-900/90 text-purple-200 border-purple-800/80 shadow-md shadow-purple-950/50 hover:shadow-purple-900/60'
          : 'bg-white hover:bg-emerald-50 text-emerald-600 border-slate-200/90 shadow-sm hover:border-emerald-300 shadow-emerald-200/20',
        className
      )}
      title={isDark ? 'Switch to Light Mode (Day Realm)' : 'Switch to Dark Mode (Night Realm)'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className="relative flex items-center justify-center">
        {isDark ? (
          <Moon className="h-5 w-5 text-purple-300 transition-transform duration-300 group-hover:rotate-[-20deg] group-hover:scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
        ) : (
          <Sun className="h-5 w-5 text-emerald-500 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
        )}
      </div>

      {showLabel && (
        <span className="ml-2 font-display text-xs font-bold">
          {isDark ? 'Night' : 'Day'}
        </span>
      )}
    </button>
  );
}
