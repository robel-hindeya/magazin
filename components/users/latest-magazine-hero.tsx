'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Eye,
  Library,
} from 'lucide-react';
import {
  getLatestMagazine,
  getEditionLabel,
  MagazineIssue,
} from './magazine-data';

interface LatestMagazineHeroProps {
  currentOrbs?: number;
  onOrbsUpdated?: (newOrbs: number) => void;
  magazine?: MagazineIssue;
}

export function LatestMagazineHero({
  currentOrbs = 75,
  onOrbsUpdated,
  magazine,
}: LatestMagazineHeroProps) {
  const router = useRouter();
  const [orbs, setOrbs] = React.useState<number>(currentOrbs);
  const [hasClaimedReward, setHasClaimedReward] = React.useState<boolean>(false);

  // Typewriter animation for "Selam Kids!" in the welcome banner
  const [typedText, setTypedText] = React.useState<string>('');
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fullText = 'Selam Kids!';
    let timer: NodeJS.Timeout;

    if (!isDeleting && typedText.length < fullText.length) {
      timer = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 120);
    } else if (!isDeleting && typedText.length === fullText.length) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 3500);
    } else if (isDeleting && typedText.length > 0) {
      timer = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length - 1));
      }, 55);
    } else if (isDeleting && typedText.length === 0) {
      timer = setTimeout(() => {
        setIsDeleting(false);
      }, 600);
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting]);

  // Dynamically determine the latest published magazine
  const latestMagazine = React.useMemo(() => {
    return magazine || getLatestMagazine();
  }, [magazine]);

  const editionLabel = React.useMemo(() => {
    return getEditionLabel(latestMagazine);
  }, [latestMagazine]);

  const handleOpenLatest = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (!hasClaimedReward) {
      setHasClaimedReward(true);
      const nextOrbs = orbs + 50;
      setOrbs(nextOrbs);
      onOrbsUpdated?.(nextOrbs);
    }
    router.push(`/users/kids/magazine/${latestMagazine.id}`);
  };

  return (
    <section aria-label="Latest Magazine Showcase" className="space-y-6">
      {/* 
        Two main columns on desktop:
        - Left side: BIG SIZE latest magazine poster (moved to left of content area)
        - Right side: Small compact welcome banner with Simba's tip & rewards
        On mobile: Neat vertical stack (poster first, then banner directly below it)
      */}
      <div className="flex flex-col lg:flex-row items-center lg:items-center justify-start gap-8 lg:gap-10">
        
        {/* =========================================================================
            LEFT SIDE: BIG SIZE LATEST MAGAZINE POSTER & ACTION BUTTON
            ========================================================================= */}
        <div className="w-full lg:w-auto shrink-0 flex flex-col items-center lg:items-start gap-3.5 sm:gap-4">
          <div
            id="latest-magazine-poster"
            role="button"
            tabIndex={0}
            onClick={handleOpenLatest}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpenLatest();
              }
            }}
            aria-label={`Read ${latestMagazine.title}, Issue ${latestMagazine.issueNumber}`}
            className="group relative cursor-pointer outline-none transition-all duration-300 ease-out transform hover:scale-[1.03] hover:-translate-y-2.5 focus-visible:ring-4 focus-visible:ring-amber-400 rounded-[36px]"
          >
            {/* Ambient Multi-Layer Back Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-400/30 via-purple-600/30 to-emerald-400/30 blur-2xl rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Physical Magazine Poster Body (Minimized -20%) */}
            <div
              className={`relative w-[260px] sm:w-[290px] md:w-[320px] lg:w-[336px] h-[390px] sm:h-[440px] md:h-[475px] lg:h-[490px] max-w-[90vw] rounded-[32px] p-1.5 bg-gradient-to-b ${
                latestMagazine.borderGradient || 'from-amber-300 via-purple-500 to-amber-300'
              } shadow-2xl shadow-purple-950/40 group-hover:shadow-amber-400/50 transition-shadow`}
            >
              {/* Glossy Sheen Overlay */}
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-tr from-white/25 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20" />

              {/* Top-Right Corner Sticker */}
              {latestMagazine.sticker && (
                <div className="absolute -top-2.5 -right-1 sm:-top-3 sm:-right-3 z-30 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all">
                  <span
                    className={`px-2.5 sm:px-3 py-1 rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-xl ${latestMagazine.sticker.bg}`}
                  >
                    {latestMagazine.sticker.text}
                  </span>
                </div>
              )}

              {/* Top-Left Edition Badge */}
              {latestMagazine.badge && (
                <div className="absolute -top-2 -left-1 sm:-top-2.5 sm:-left-2 z-30 transform -rotate-6 group-hover:rotate-0 transition-transform">
                  <span
                    className={`px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black tracking-wider shadow-lg ${latestMagazine.badge.color}`}
                  >
                    {latestMagazine.badge.text}
                  </span>
                </div>
              )}

              {/* Inner Magazine Poster Artwork */}
              <div
                className={`relative w-full h-full rounded-[26px] overflow-hidden bg-gradient-to-br ${latestMagazine.gradient} p-4 sm:p-5 flex flex-col justify-between border-2 border-white/25 text-white select-none`}
              >
                {/* Masthead */}
                <div className="text-center space-y-0.5 relative z-10">
                  <div className="flex items-center justify-between border-b border-white/20 pb-1 text-[9px] uppercase tracking-widest text-purple-200 font-extrabold">
                    <span>ISSUE #{String(latestMagazine.issueNumber || 1).padStart(2, '0')}</span>
                    <span className="text-emerald-300 font-black">FREE EDITION</span>
                  </div>

                  <h3 className="font-display font-black text-2xl sm:text-3xl text-yellow-300 tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] mt-1">
                    SELAM KIDS
                  </h3>
                  <span className="text-[11px] uppercase font-black tracking-widest text-purple-100 block">
                    {latestMagazine.editionName}
                  </span>
                </div>

                {/* Cover Main & Secondary Characters Area (Poster Size Increased +25%) */}
                <div className="relative flex-1 flex items-center justify-center my-1 sm:my-2">
                  {/* Main Character Poster (+25% size) */}
                  <div className="relative w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] md:w-[280px] md:h-[280px] group-hover:scale-108 transition-transform duration-300">
                    <Image
                      src={latestMagazine.characterMain.src}
                      alt={latestMagazine.characterMain.alt}
                      fill
                      priority
                      className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
                    />
                  </div>

                  {/* Secondary Character floating in corner (+25% size) */}
                  {latestMagazine.characterSecondary && (
                    <div className="absolute -bottom-1 -right-1 w-[80px] h-[80px] sm:w-[96px] sm:h-[96px] group-hover:scale-115 transition-transform duration-300">
                      <Image
                        src={latestMagazine.characterSecondary.src}
                        alt={latestMagazine.characterSecondary.alt}
                        fill
                        className="object-contain drop-shadow-xl"
                      />
                    </div>
                  )}
                </div>


                {/* Interactive "CLICK TO READ" Pill - Hidden on mobile phones, desktop hover only */}
                <div className="hidden sm:block absolute bottom-3.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-30">
                  <span className="btn-3d btn-3d-yellow flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-display font-black text-slate-950 shadow-2xl whitespace-nowrap scale-95 group-hover:scale-100 transition-transform">
                    <Eye className="h-3.5 w-3.5" />
                    TAP TO READ POSTER
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dedicated "Read Latest Issue" Button Directly Under Poster */}
          <div className="w-full flex justify-center lg:justify-start">
            <button
              onClick={handleOpenLatest}
              className="btn-3d btn-3d-yellow w-full max-w-[260px] sm:max-w-[290px] lg:max-w-[336px] inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-display font-black text-xs sm:text-sm text-slate-950 shadow-xl cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            >
              <BookOpen className="h-4 w-4" />
              <span>Read Latest Issue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            RIGHT SIDE: COMPACT WELCOME BANNER (Hidden on mobile phone, shown on desktop)
            ========================================================================= */}
        <div className="hidden lg:flex w-full lg:flex-1 lg:self-center lg:min-h-[280px] lg:max-h-[315px] flex-col justify-center rounded-3xl sm:rounded-4xl bg-white dark:bg-gradient-to-br dark:from-[#1b0b42] dark:via-[#261159] dark:to-[#120733] border-2 sm:border-3 border-slate-200 dark:border-purple-800/80 p-5 sm:p-7 md:p-8 shadow-xl text-slate-900 dark:text-white transition-colors relative overflow-hidden">
          {/* Subtle magical ambient glow */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-3 sm:space-y-4">
            {/* Dynamic Edition Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500 text-white px-3 sm:px-3.5 py-1 text-[11px] sm:text-xs font-black shadow-sm uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{editionLabel}</span>
            </div>

            {/* Welcome Heading with Typing Animation */}
            <div className="space-y-1 sm:space-y-1.5">
              <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl text-slate-900 dark:text-white tracking-tight leading-tight">
                Welcome to{' '}
                <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center">
                  <span>{typedText}</span>
                  <span
                    aria-hidden="true"
                    className="inline-block w-[3px] h-[0.85em] bg-emerald-500 dark:bg-emerald-400 ml-1 rounded-full animate-pulse align-middle"
                  />
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-purple-200/90 font-medium leading-relaxed max-w-xl">
                Explore the latest Selam Kids magazine, discover amazing animals, and enjoy new stories and learning adventures every month.
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="relative z-10 pt-4 sm:pt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <button
              onClick={handleOpenLatest}
              className="btn-3d btn-3d-yellow w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-display font-black text-xs sm:text-sm text-slate-950 shadow-lg cursor-pointer hover:scale-105 transition-transform"
            >
              <BookOpen className="h-4 w-4" />
              <span>Read Latest Issue</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <Link
              href="/users/kids/magazines"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-display font-bold text-xs sm:text-sm text-purple-700 dark:text-purple-200 bg-purple-100 dark:bg-purple-900/60 hover:bg-purple-200 dark:hover:bg-purple-800/80 transition-all border border-purple-200 dark:border-purple-700/60 shadow-sm"
            >
              <Library className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
              <span>Browse Magazine Library</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

