'use client';

import React, { useState, useEffect } from 'react';

interface TypewriterHeroTitleProps {
  prefix?: string;
  phrases?: string[];
  className?: string;
}

export function TypewriterHeroTitle({
  prefix = 'Selam Kids World!',
  phrases = ['Magazin and Games'],
  className = '',
}: TypewriterHeroTitleProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentPhrase = phrases[phraseIndex % phrases.length];

  useEffect(() => {
    if (!mounted) return;

    let timer: NodeJS.Timeout;

    if (!isDeleting && typedText.length < currentPhrase.length) {
      // Type next character
      timer = setTimeout(() => {
        setTypedText(currentPhrase.slice(0, typedText.length + 1));
      }, 110);
    } else if (!isDeleting && typedText.length === currentPhrase.length) {
      // Hold at full phrase
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 3000);
    } else if (isDeleting && typedText.length > 0) {
      // Delete character
      timer = setTimeout(() => {
        setTypedText(currentPhrase.slice(0, typedText.length - 1));
      }, 50);
    } else if (isDeleting && typedText.length === 0) {
      // Switch phrase and pause before re-typing
      timer = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, mounted, currentPhrase, phrases.length]);

  // Display full phrase during SSR to ensure optimal SEO and no layout shifts
  const displayText = mounted ? typedText : currentPhrase;

  return (
    <h1
      className={`font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-tight text-slate-900 dark:text-white drop-shadow-sm ${className}`}
    >
      {prefix} <br />
      <span className="inline-flex items-center justify-center min-h-[1.25em] transition-all">
        <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
          {displayText || '\u00A0'}
        </span>
        {/* Glowing typing caret */}
        <span
          aria-hidden="true"
          className="inline-block w-[3px] sm:w-[4px] lg:w-[6px] h-[0.85em] ml-1.5 sm:ml-2 bg-gradient-to-b from-emerald-400 to-cyan-400 rounded-full align-middle animate-pulse shadow-[0_0_14px_rgba(52,211,153,0.9)]"
        />
      </span>
    </h1>
  );
}
