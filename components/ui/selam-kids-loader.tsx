import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Sparkles, Star, Zap, Rocket } from 'lucide-react';

interface SelamKidsLoaderProps {
  message?: string;
  submessage?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  character?: 'lion' | 'cloud' | 'wolf' | 'ibex';
}

const CHARACTERS = {
  lion: {
    name: 'Simba Lion',
    src: '/images/characters/abyssinian-lion.svg',
    pngFallback: '/images/characters/abyssinian-lion.png',
    glow: 'from-amber-400/30 via-orange-500/20 to-yellow-400/30',
    bubble: '🦁 Roaring into action!',
  },
  cloud: {
    name: 'Sky Mascot',
    src: '/images/logo.png',
    pngFallback: '/images/logo.png',
    glow: 'from-cyan-400/30 via-blue-500/20 to-purple-500/30',
    bubble: '☁️ High flying adventure!',
  },
  wolf: {
    name: 'Lasta Wolf',
    src: '/images/characters/ethiopian-wolf.svg',
    pngFallback: '/images/characters/ethiopian-wolf.png',
    glow: 'from-rose-400/30 via-red-500/20 to-amber-400/30',
    bubble: '🐺 Sprinting through trails!',
  },
  ibex: {
    name: 'Bale Ibex',
    src: '/images/characters/walia-ibex.svg',
    pngFallback: '/images/characters/walia-ibex.png',
    glow: 'from-emerald-400/30 via-teal-500/20 to-cyan-400/30',
    bubble: '🐐 Leaping over peaks!',
  },
};

export function SelamKidsLoader({
  message = 'Loading Selam Kids...',
  submessage,
  fullScreen = false,
  size = 'md',
  className,
  character = 'lion',
}: SelamKidsLoaderProps) {
  const chosenChar = CHARACTERS[character] || CHARACTERS.lion;

  const charSizes = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24 sm:h-28 sm:w-28',
    lg: 'h-32 w-32 sm:h-36 sm:w-36',
  };

  const shadowSizes = {
    sm: 'w-12 h-2',
    md: 'w-20 h-3',
    lg: 'w-24 h-3.5',
  };

  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-6 select-none',
        className
      )}
    >
      {/* Speech bubble header */}
      <div className="relative mb-2 animate-in zoom-in-95 duration-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#140c36] border border-purple-300 dark:border-purple-600 shadow-sm text-[11px] font-display font-extrabold text-purple-700 dark:text-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
          <span>{chosenChar.bubble}</span>
        </div>
      </div>

      {/* Animated Mascot Motion Stage */}
      <div className="relative flex flex-col items-center justify-center my-1">
        {/* Soft glowing ambient background */}
        <div
          className={cn(
            'absolute -inset-6 rounded-full bg-gradient-to-tr blur-2xl animate-pulse duration-1000',
            chosenChar.glow
          )}
        />

        {/* Orbiting star */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-star-orbit-1">
          <Star className="w-4 h-4 text-amber-400 fill-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
        </div>

        {/* Dust puffs behind running character */}
        <div className="absolute bottom-3 left-2 pointer-events-none flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-purple-800/80 animate-dust-puff-1" />
          <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-purple-700/80 animate-dust-puff-2" />
        </div>

        {/* Mascot Character with lively running/leaping bounce */}
        <div
          className={cn(
            'relative drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)] animate-character-run',
            charSizes[size]
          )}
        >
          <Image
            src={chosenChar.src}
            alt={chosenChar.name}
            fill
            sizes="144px"
            className="object-contain"
            priority
          />
        </div>

        {/* Synchronized ground shadow */}
        <div
          className={cn(
            'rounded-full bg-black/15 dark:bg-black/50 blur-[2px] animate-character-shadow mt-1',
            shadowSizes[size]
          )}
        />
      </div>

      {/* Brand & Loading Status */}
      <div className="mt-3 flex flex-col items-center gap-1 z-10">
        <div className="flex items-center gap-1">
          <span className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white tracking-wide">
            Selam<span className="text-emerald-500 dark:text-emerald-400">Kids</span>
          </span>
        </div>

        {message && (
          <p className="font-display font-extrabold text-xs sm:text-sm text-purple-700 dark:text-purple-300">
            {message}
          </p>
        )}

        {submessage && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {submessage}
          </p>
        )}

        {/* Animated bounce dots */}
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
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/95 dark:bg-[#070314]/95 backdrop-blur-xl transition-all">
        {content}
      </div>
    );
  }

  return content;
}
