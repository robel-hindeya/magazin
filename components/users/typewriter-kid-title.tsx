'use client';

import React, { useState, useEffect } from 'react';

interface TypewriterKidTitleProps {
  prefix?: string;
  name: string;
  className?: string;
}

export function TypewriterKidTitle({
  prefix = 'Welcome to Selam Kids,',
  name = 'Leo Starlight',
  className = '',
}: TypewriterKidTitleProps) {
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fullName = `${name}!`;

  useEffect(() => {
    if (!mounted) return;

    let timer: NodeJS.Timeout;

    if (!isDeleting && typedText.length < fullName.length) {
      // Type next character
      timer = setTimeout(() => {
        setTypedText(fullName.slice(0, typedText.length + 1));
      }, 110);
    } else if (!isDeleting && typedText.length === fullName.length) {
      // Hold at full name
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 3500);
    } else if (isDeleting && typedText.length > 0) {
      // Delete character
      timer = setTimeout(() => {
        setTypedText(fullName.slice(0, typedText.length - 1));
      }, 55);
    } else if (isDeleting && typedText.length === 0) {
      // Pause before re-typing
      timer = setTimeout(() => {
        setIsDeleting(false);
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, mounted, fullName]);

  // SSR fallback ensures zero layout shifts
  const displayText = mounted ? typedText : fullName;

  return (
    <span className={`inline-flex flex-wrap items-center gap-x-2 gap-y-1 ${className}`}>
      <span>{prefix}</span>
      <span className="inline-flex items-center text-emerald-500 dark:text-emerald-400 font-black drop-shadow-sm min-h-[1.2em]">
        <span>{displayText || '\u00A0'}</span>
        {/* Blinking typing caret */}
        <span
          aria-hidden="true"
          className="inline-block w-[2.5px] sm:w-[3.5px] h-[0.85em] ml-1 bg-emerald-500 dark:bg-emerald-400 rounded-full align-middle animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.85)]"
        />
      </span>
    </span>
  );
}
