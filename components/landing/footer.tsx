'use client';

import React from 'react';
import Link from 'next/link';

interface SocialLink {
  name: string;
  href: string;
  ariaLabel: string;
  hoverColorClass: string;
  icon: React.ReactNode;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'YouTube',
    href: 'https://youtube.com',
    ariaLabel: 'Follow Selam Kids on YouTube',
    hoverColorClass: 'hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 hover:shadow-[0_10px_25px_rgba(239,68,68,0.35)]',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    ariaLabel: 'Follow Selam Kids on Instagram',
    hoverColorClass: 'hover:text-pink-500 hover:border-pink-500/50 hover:bg-pink-500/10 hover:shadow-[0_10px_25px_rgba(236,72,153,0.35)]',
    icon: (
      <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://tiktok.com',
    ariaLabel: 'Follow Selam Kids on TikTok',
    hoverColorClass: 'hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:shadow-[0_10px_25px_rgba(6,182,212,0.35)]',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.4a6.33 6.33 0 0 0-5.07 6.23 6.34 6.34 0 0 0 10.55 4.67 6.34 6.34 0 0 0 2.22-4.81V7.89a8.16 8.16 0 0 0 4.93 1.63V6.09a4.79 4.79 0 0 1-3.38-2.4z"/>
      </svg>
    ),
  },
  {
    name: 'Telegram',
    href: 'https://t.me',
    ariaLabel: 'Join Selam Kids on Telegram',
    hoverColorClass: 'hover:text-sky-400 hover:border-sky-400/50 hover:bg-sky-500/10 hover:shadow-[0_10px_25px_rgba(14,165,233,0.35)]',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06-.01.24-.03.4z"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    ariaLabel: 'Follow Selam Kids on Facebook',
    hoverColorClass: 'hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/10 hover:shadow-[0_10px_25px_rgba(59,130,246,0.35)]',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'X',
    href: 'https://x.com',
    ariaLabel: 'Follow Selam Kids on X',
    hoverColorClass: 'hover:text-slate-900 dark:hover:text-white hover:border-slate-400/50 hover:bg-slate-500/10 hover:shadow-[0_10px_25px_rgba(0,0,0,0.35)]',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
];

export function LandingFooter() {
  return (
    <footer className="relative w-full bg-transparent text-slate-900 dark:text-white pt-10 pb-12 sm:pb-16 overflow-hidden transition-colors">
      {/* Social Media Icons (Above selamkids) */}
      <div className="relative mx-auto max-w-5xl px-4 flex flex-col items-center mb-4 sm:mb-6">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          {SOCIAL_LINKS.map((social) => (
            <Link
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.ariaLabel}
              className={`group relative h-11 w-11 sm:h-12 sm:w-12 rounded-2xl border border-slate-200/80 dark:border-purple-800/60 bg-white/70 dark:bg-[#140b33]/80 backdrop-blur-md flex items-center justify-center text-slate-600 dark:text-purple-200 shadow-sm transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${social.hoverColorClass}`}
            >
              {social.icon}
            </Link>
          ))}
        </div>
      </div>

      {/* Big Bold Brand Statement: selamkids */}
      <div className="w-full text-center px-4 select-none">
        <span className="inline-block font-display font-black tracking-tight text-[11.5vw] sm:text-[12.5vw] md:text-[13.5vw] lg:text-[14.5vw] leading-[0.85] lowercase bg-gradient-to-b from-slate-900/50 via-slate-800/25 to-slate-800/5 dark:from-white/60 dark:via-purple-200/30 dark:to-purple-200/5 bg-clip-text text-transparent hover:opacity-100 transition-opacity whitespace-nowrap">
          selamkids
        </span>
      </div>
    </footer>
  );
}
