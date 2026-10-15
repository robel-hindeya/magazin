'use client';

import Link from 'next/link';
import { WifiOff, RefreshCw, BookOpen, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OfflinePage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-12 select-none">
      <div className="relative mb-6">
        <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl bg-purple-100 dark:bg-purple-950/80 border-4 border-purple-300 dark:border-purple-700/80 flex items-center justify-center shadow-2xl mx-auto text-purple-600 dark:text-purple-300">
          <WifiOff className="h-12 w-12 sm:h-14 sm:w-14" />
        </div>
        <div className="absolute -bottom-2 -right-2 h-9 w-9 rounded-full bg-amber-400 border-2 border-white dark:border-slate-900 flex items-center justify-center text-slate-950 font-black shadow-md">
          !
        </div>
      </div>

      <h1 className="font-display font-black text-2xl sm:text-4xl text-slate-900 dark:text-white leading-tight mb-2">
        You're Offline
      </h1>

      <p className="max-w-md text-sm sm:text-base text-slate-600 dark:text-purple-200/80 font-medium mb-8">
        It looks like your device is disconnected from the internet. Reconnect to explore new magazine editions and claim your glowing points!
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs sm:max-w-md justify-center">
        <Button
          onClick={() => window.location.reload()}
          className="btn-3d btn-3d-yellow w-full sm:w-auto font-display font-black text-xs sm:text-sm px-6 py-3 rounded-2xl gap-2 text-slate-950 shadow-xl cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </Button>

        <Link
          href="/users/kids"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border-2 border-purple-200 dark:border-purple-800 bg-white dark:bg-purple-900/60 font-display font-black text-xs sm:text-sm text-slate-800 dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors shadow-sm"
        >
          <Home className="h-4 w-4" />
          <span>Go to Home</span>
        </Link>
      </div>
    </div>
  );
}
