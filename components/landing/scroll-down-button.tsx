'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ScrollDownButtonProps {
  targetId?: string;
  className?: string;
}

export function ScrollDownButton({
  targetId = 'magazines',
  className = '',
}: ScrollDownButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'instant' });
    }
  };

  return (
    <div className={`absolute bottom-12 sm:bottom-16 left-1/2 -translate-x-1/2 z-20 ${className}`}>
      <a
        href={`#${targetId}`}
        onClick={handleClick}
        aria-label="Scroll down"
        className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-slate-300/80 dark:border-purple-500/40 bg-white/80 dark:bg-purple-950/80 backdrop-blur-md shadow-md text-slate-700 dark:text-purple-200 cursor-pointer select-none hover:border-emerald-500 dark:hover:border-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-400 animate-bounce transition-colors"
      >
        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
      </a>
    </div>
  );
}

