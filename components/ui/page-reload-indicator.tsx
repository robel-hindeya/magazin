'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Sparkles, Zap, Rocket, Star, Compass, FastForward } from 'lucide-react';

interface Mascot {
  id: string;
  name: string;
  species: string;
  title: string;
  src: string;
  pngFallback: string;
  badgeColor: string;
  glowGradient: string;
  quotes: {
    start: string;
    middle: string;
    finish: string;
  };
}

const MASCOTS: Mascot[] = [
  {
    id: 'lion',
    name: 'Simba the Lion',
    species: 'Abyssinian Lion',
    title: 'Brave Highland Explorer',
    src: '/images/characters/abyssinian-lion.svg',
    pngFallback: '/images/characters/abyssinian-lion.png',
    badgeColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400/40',
    glowGradient: 'from-amber-400/35 via-orange-500/25 to-yellow-400/30',
    quotes: {
      start: '🦁 Roaring into high-speed adventure!',
      middle: '⚡ Running across the golden savanna...',
      finish: '🚀 3... 2... 1... Ready to explore!',
    },
  },
  {
    id: 'cloud',
    name: 'Sky Mascot',
    species: 'Selam Cloud',
    title: 'Cloud Captain',
    src: '/images/logo.png',
    pngFallback: '/images/logo.png',
    badgeColor: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-400/40',
    glowGradient: 'from-cyan-400/35 via-purple-500/25 to-pink-400/30',
    quotes: {
      start: '☁️ Floating high above the rainbow!',
      middle: '✨ Collecting sparkling star orbs...',
      finish: '🎉 Whoosh! Landing on your new quest!',
    },
  },
  {
    id: 'wolf',
    name: 'Lasta Wolf',
    species: 'Ethiopian Red Wolf',
    title: 'Simien Mountain Sprinter',
    src: '/images/characters/ethiopian-wolf.svg',
    pngFallback: '/images/characters/ethiopian-wolf.png',
    badgeColor: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-400/40',
    glowGradient: 'from-rose-400/35 via-red-500/25 to-amber-400/30',
    quotes: {
      start: '🐺 Dashing through the misty peaks!',
      middle: '⚡ Sprung forward with lightning speed...',
      finish: '🏆 Simien trail unlocked! Let\'s GO!',
    },
  },
  {
    id: 'ibex',
    name: 'Bale Ibex',
    species: 'Walia Ibex',
    title: 'Summit Peak Leaper',
    src: '/images/characters/walia-ibex.svg',
    pngFallback: '/images/characters/walia-ibex.png',
    badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400/40',
    glowGradient: 'from-emerald-400/35 via-teal-500/25 to-cyan-400/30',
    quotes: {
      start: '🐐 Leaping from mountain peak to peak!',
      middle: '🌟 Hopping across rocky adventures...',
      finish: '🚀 Reached the highest summit! Enjoy!',
    },
  },
];

const TRANSITION_DURATION_MS = 3000; // Guaranteed 3-second character motion animation
const TICK_INTERVAL_MS = 25; // High-precision 40fps progress tick

export function PageReloadIndicator() {
  const router = useRouter();
  const pathname = usePathname();

  const [isActive, setIsActive] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [mascotIndex, setMascotIndex] = React.useState(0);
  const [speechText, setSpeechText] = React.useState('');
  const [countdownNum, setCountdownNum] = React.useState(3);

  const activeMascot = MASCOTS[mascotIndex] || MASCOTS[0];

  const startTimeRef = React.useRef<number | null>(null);
  const timerHandleRef = React.useRef<NodeJS.Timeout | null>(null);
  const currentPathRef = React.useRef<string>(pathname);

  React.useEffect(() => {
    currentPathRef.current = pathname;
  }, [pathname]);

  // Clean-up animation timers
  const clearTimers = React.useCallback(() => {
    if (timerHandleRef.current) {
      clearInterval(timerHandleRef.current);
      timerHandleRef.current = null;
    }
  }, []);

  // Main 3-Second Transition Trigger
  const triggerTransition = React.useCallback(
    (reason: 'refresh' | 'navigation' = 'navigation') => {
      clearTimers();

      // Pick a random mascot or rotate for variety
      const nextIdx = Math.floor(Math.random() * MASCOTS.length);
      setMascotIndex(nextIdx);
      const mascot = MASCOTS[nextIdx];

      setIsActive(true);
      setIsExiting(false);
      setProgress(0);
      setCountdownNum(3);
      setSpeechText(mascot.quotes.start);

      const startTime = Date.now();
      startTimeRef.current = startTime;

      timerHandleRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const rawPct = Math.min(100, Math.floor((elapsed / TRANSITION_DURATION_MS) * 100));
        setProgress(rawPct);

        // Update countdown number & speech text
        const remainingSeconds = Math.max(1, Math.ceil((TRANSITION_DURATION_MS - elapsed) / 1000));
        setCountdownNum(remainingSeconds);

        if (elapsed < 1100) {
          setSpeechText(mascot.quotes.start);
        } else if (elapsed < 2300) {
          setSpeechText(mascot.quotes.middle);
        } else {
          setSpeechText(mascot.quotes.finish);
        }

        // When 3000ms is complete
        if (elapsed >= TRANSITION_DURATION_MS) {
          clearTimers();
          setProgress(100);
          setSpeechText(mascot.quotes.finish);

          // Smooth fade/scale out transition
          setIsExiting(true);
          setTimeout(() => {
            setIsActive(false);
            setIsExiting(false);
          }, 320);
        }
      }, TICK_INTERVAL_MS);
    },
    [clearTimers]
  );

  // 1. Initial Page Load or Refresh detection
  React.useEffect(() => {
    let shouldTrigger = false;

    try {
      // Check if browser navigation was a reload or initial visit
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navEntries && navEntries.length > 0 && navEntries[0].type === 'reload') {
        shouldTrigger = true;
      }
      if (sessionStorage.getItem('selam-kids-page-reloading') === 'true') {
        shouldTrigger = true;
        sessionStorage.removeItem('selam-kids-page-reloading');
      }
    } catch {
      // Fallback
    }

    // Always trigger 3-second character motion on page refresh
    if (shouldTrigger) {
      triggerTransition('refresh');
    }

    // Handle beforeunload: set reload flag and activate immediately
    const handleBeforeUnload = () => {
      try {
        sessionStorage.setItem('selam-kids-page-reloading', 'true');
      } catch {}
      setIsActive(true);
      setProgress(10);
      setSpeechText('Preparing your magical world...');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearTimers();
    };
  }, [clearTimers, triggerTransition]);

  // 2. Global Link Interception for Page Changes (Transitions between pages)
  React.useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Check left clicks without modifier keys
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const targetEl = e.target as HTMLElement | null;
      if (!targetEl) return;

      const anchor = targetEl.closest('a');
      if (!anchor) return;

      const rawHref = anchor.getAttribute('href');
      if (!rawHref) return;

      // Ignore special links
      if (
        anchor.target === '_blank' ||
        rawHref.startsWith('#') ||
        rawHref.startsWith('mailto:') ||
        rawHref.startsWith('tel:') ||
        rawHref.startsWith('javascript:') ||
        anchor.hasAttribute('download')
      ) {
        return;
      }

      try {
        const destination = new URL(anchor.href, window.location.href);

        // Check if internal domain
        if (destination.origin !== window.location.origin) return;

        // Check if destination is exactly the current page
        const isSamePage =
          destination.pathname === window.location.pathname &&
          destination.search === window.location.search;

        if (isSamePage) return;

        // Prevent default instantaneous jump, initiate 3-second motion
        e.preventDefault();

        triggerTransition('navigation');

        // Trigger router navigation in background
        router.push(destination.pathname + destination.search);
      } catch {
        // Fallback for relative paths
      }
    };

    // Capture phase intercepts before Link does
    document.addEventListener('click', handleDocumentClick, { capture: true });

    // Handle browser forward/back buttons
    const handlePopState = () => {
      triggerTransition('navigation');
    };
    window.addEventListener('popstate', handlePopState);

    // Custom event listener for manual programmatic triggers
    const handleCustomTrigger = () => {
      triggerTransition('navigation');
    };
    window.addEventListener('selam-kids-trigger-transition', handleCustomTrigger);

    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('selam-kids-trigger-transition', handleCustomTrigger);
    };
  }, [router, triggerTransition]);

  if (!isActive) return null;

  return (
    <aside
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-300 ${
        isExiting
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100 bg-white/95 dark:bg-[#070314]/95 backdrop-blur-xl'
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading page transition with Selam Kids character motion"
    >
      {/* Playful Floating Speed Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
        <div className="absolute top-[28%] left-0 w-48 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-speed-line-1" />
        <div className="absolute top-[45%] left-0 w-72 h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-speed-line-2" />
        <div className="absolute top-[65%] left-0 w-56 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-speed-line-1" />
      </div>

      {/* Ambient Pulsing Aura in Background */}
      <div
        className={`absolute -inset-10 rounded-full bg-gradient-to-tr ${activeMascot.glowGradient} blur-3xl opacity-60 dark:opacity-40 animate-pulse duration-1000`}
      />

      {/* Main Interactive Motion Stage */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-sm px-6 text-center">
        {/* Animated Speech Bubble */}
        <div className="relative mb-3 animate-in zoom-in-95 duration-200">
          <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-[#140c36] border-2 border-purple-300 dark:border-purple-600 shadow-[0_8px_20px_rgba(124,58,237,0.18)]">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin duration-1000" />
            <span className="font-display font-black text-xs sm:text-sm text-slate-800 dark:text-white tracking-wide">
              {speechText}
            </span>
          </div>
          {/* Speech bubble pointer arrow */}
          <div className="w-0 h-0 mx-auto border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-purple-300 dark:border-t-purple-600" />
        </div>

        {/* Character Motion Arena */}
        <div className="relative flex flex-col items-center justify-center my-2 h-44 w-44 sm:h-48 sm:w-48">
          {/* Orbiting Magical Star 1 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-star-orbit-1">
            <Star className="w-5 h-5 text-amber-400 fill-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          </div>

          {/* Orbiting Magical Star 2 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-star-orbit-2">
            <Zap className="w-4 h-4 text-emerald-400 fill-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>

          {/* Dust Puffs behind running paws/feet */}
          <div className="absolute bottom-6 left-6 pointer-events-none flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-full bg-slate-300 dark:bg-purple-800/80 animate-dust-puff-1" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-purple-700/80 animate-dust-puff-2" />
          </div>

          {/* Main Running/Jumping Character Container */}
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 animate-character-run cursor-pointer">
            <Image
              src={activeMascot.src}
              alt={activeMascot.name}
              fill
              sizes="(max-width: 640px) 144px, 160px"
              className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
              priority
              onError={(e) => {
                // Fallback to PNG if SVG encounters any rendering quirk
                const img = e.target as HTMLImageElement;
                if (img && img.src !== activeMascot.pngFallback) {
                  img.src = activeMascot.pngFallback;
                }
              }}
            />
          </div>

          {/* Synchronized Ground Shadow */}
          <div className="w-24 h-3.5 rounded-full bg-black/15 dark:bg-black/50 blur-[2px] animate-character-shadow mt-1" />
        </div>

        {/* Mascot Identity Tag */}
        <div className="mt-1 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-display font-extrabold ${activeMascot.badgeColor} shadow-sm`}
          >
            <Compass className="w-3.5 h-3.5" />
            {activeMascot.name} • {activeMascot.title}
          </span>
        </div>

        {/* 3-Second Chunky Animated Progress Bar */}
        <div className="w-full mt-4 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] font-display font-black text-slate-600 dark:text-slate-300 px-1">
            <span className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400">
              <Rocket className="w-3.5 h-3.5" />
              3s Adventure Transition
            </span>
            <span className="tabular-nums font-extrabold text-emerald-600 dark:text-emerald-400">
              {progress}%
            </span>
          </div>

          {/* Progress Track */}
          <div className="relative w-full h-3.5 rounded-full bg-slate-200/90 dark:bg-purple-950/70 p-0.5 border border-purple-200 dark:border-purple-800/60 shadow-inner overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-purple-600 animate-rainbow-shimmer transition-all duration-75 relative"
              style={{ width: `${progress}%` }}
            >
              {/* Glowing Comet Head */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_10px_#ffffff] animate-ping duration-700" />
            </div>
          </div>
        </div>

        {/* 3-2-1 Countdown Indicator */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs font-display font-extrabold text-slate-500 dark:text-slate-400">
          <span>Speeding up:</span>
          <div className="flex items-center gap-1.5">
            <span
              className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                countdownNum <= 3
                  ? 'bg-purple-600 text-white scale-110 shadow-sm'
                  : 'bg-slate-200 dark:bg-purple-900/40 text-slate-500'
              }`}
            >
              3
            </span>
            <span
              className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                countdownNum <= 2
                  ? 'bg-amber-500 text-white scale-110 shadow-sm'
                  : 'bg-slate-200 dark:bg-purple-900/40 text-slate-500'
              }`}
            >
              2
            </span>
            <span
              className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                countdownNum <= 1
                  ? 'bg-emerald-500 text-white scale-110 shadow-sm'
                  : 'bg-slate-200 dark:bg-purple-900/40 text-slate-500'
              }`}
            >
              1
            </span>
          </div>
          <span className="text-emerald-500 font-black">Go!</span>
        </div>
      </div>

      {/* Discreet Quick Skip for Adults / Power Users */}
      <button
        onClick={() => {
          clearTimers();
          setIsExiting(true);
          setTimeout(() => {
            setIsActive(false);
            setIsExiting(false);
          }, 150);
        }}
        type="button"
        className="absolute bottom-5 right-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-display font-bold text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 bg-black/5 dark:bg-white/5 hover:bg-black/10 transition-colors"
        aria-label="Skip character animation transition"
      >
        <span>Skip</span>
        <FastForward className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
}
