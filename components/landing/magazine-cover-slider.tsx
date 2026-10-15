'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MAGAZINES, MagazineIssue, MagazinePage } from '@/components/users/magazine-data';

export interface MagazinePosterItem {
  id: string;
  issueNumber: number;
  shortTitle: string;
  fullTitle: string;
  category: string;
  ageRange: string;
  code: string;
  coverImage: string;
  rating: string;
  year: string;
  metadata: string;
  glowColor: string;
  accentColor: string;
  summary: string;
}

export const AUTHENTIC_POSTERS: MagazinePosterItem[] = [
  {
    id: 'ancient-wonders',
    issueNumber: 1,
    shortTitle: 'Ancient Wonders',
    fullTitle: "Ancient Wonders! Lalibela's Secrets!",
    category: 'History & Exploration',
    ageRange: 'Ages 7–10',
    code: 'Magazine',
    coverImage: '/images/magazines/ancient-wonders-lalibela.jpg',
    rating: '9.9',
    year: '2026',
    metadata: 'Issue #01 • Lalibela Secrets',
    glowColor: 'rgba(217, 119, 6, 0.55)',
    accentColor: '#d97706',
    summary: 'Journey into the rock-hewn wonders of Lalibela, explore ancient subterranean churches, and uncover centuries of craftsmanship.',
  },
  {
    id: 'wild-highlands',
    issueNumber: 2,
    shortTitle: 'Wild Highlands',
    fullTitle: 'Wild Highlands! Meet the Baboons!',
    category: 'Nature & Wildlife',
    ageRange: 'Ages 7–10',
    code: 'Magazine',
    coverImage: '/images/magazines/wild-highlands-baboon.jpg',
    rating: '9.8',
    year: '2026',
    metadata: 'Issue #02 • Simien Adventures',
    glowColor: 'rgba(34, 197, 94, 0.55)',
    accentColor: '#22c55e',
    summary: 'Traverse dramatic Simien Mountain escarpments, meet golden-maned Gelada baboons, and spot the rare Walia Ibex on alpine cliffs.',
  },
  {
    id: 'get-active',
    issueNumber: 50,
    shortTitle: 'Get Active',
    fullTitle: 'Get Active! Play with Friends!',
    category: 'Sports & Adventure',
    ageRange: 'Ages 7–10',
    code: 'Magazine',
    coverImage: '/images/magazines/get-active-sports.jpg',
    rating: '9.7',
    year: '2026',
    metadata: 'Issue 7-50 • Traditional Games',
    glowColor: 'rgba(14, 165, 233, 0.55)',
    accentColor: '#0ea5e9',
    summary: 'Step onto the field! Discover soccer fundamentals, traditional Ethiopian field games, friendship, and staying active with teammates.',
  },
  {
    id: 'get-creative',
    issueNumber: 48,
    shortTitle: 'Get Creative',
    fullTitle: 'Get Creative! Make a Mesob!',
    category: 'Creativity & Arts',
    ageRange: 'Ages 7–10',
    code: 'Magazine',
    coverImage: '/images/magazines/get-creative-mesob.jpg',
    rating: '9.9',
    year: '2026',
    metadata: 'Issue 7-10 • Fun Art & Crafts',
    glowColor: 'rgba(236, 72, 153, 0.55)',
    accentColor: '#ec4899',
    summary: 'Ignite your artistic sparks with hands-on crafts! Weave miniature Mesob baskets, sculpt Gondar stone castles, and mix bold folk patterns.',
  },
  {
    id: 'royal-castle',
    issueNumber: 46,
    shortTitle: 'The Royal Castle',
    fullTitle: 'The Royal Castle! Gondar Kings!',
    category: 'History & Exploration',
    ageRange: 'Ages 7–10',
    code: 'Magazine',
    coverImage: '/images/magazines/royal-castle-gondar.jpg',
    rating: '9.8',
    year: '2026',
    metadata: 'Issue 7-10 • Fun History Games',
    glowColor: 'rgba(245, 158, 11, 0.55)',
    accentColor: '#f59e0b',
    summary: 'Pass through the majestic fortress gates of Gondar’s Fasil Ghebbi, solve historical royal puzzles, and uncover legendary tales of Ethiopian kings.',
  },
];

// Duplicated sequence ensures a seamless continuous 3D loop corner-to-corner on any screen size
const CAROUSEL_ITEMS: MagazinePosterItem[] = [...AUTHENTIC_POSTERS, ...AUTHENTIC_POSTERS];

export interface MagazineCoverSliderProps {
  title?: string;
  subtitle?: string;
  subtitleClassName?: string;
}

export function MagazineCoverSlider({
  title = 'Kids Magazine',
  subtitle = 'Explore our diverse Ethiopian themed Kids Magazines',
  subtitleClassName = '',
}: MagazineCoverSliderProps = {}) {
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [previewMagazine, setPreviewMagazine] = useState<MagazineIssue | null>(null);
  const [previewPageIndex, setPreviewPageIndex] = useState<number>(0);

  // References for ultra-smooth 60/120fps direct GPU transformation
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const offsetRef = useRef<number>(0);
  const targetOffsetRef = useRef<number | null>(null);

  const isDraggingRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const startOffsetRef = useRef<number>(0);
  const hasMovedRef = useRef<boolean>(false);
  const lastActiveIndexRef = useRef<number>(0);

  const total = CAROUSEL_ITEMS.length;

  // Calculates clean, un-overlapping spacing with distinct breathing room between posters
  const getCardSpacing = (width: number) => {
    if (width < 640) return 295; // mobile: 260px card + 35px gap
    if (width < 768) return 350; // sm: 305px card + 45px gap
    return 385; // md / desktop: 338px card + 47px gap
  };

  // Calculates and updates position for all 10 cards along the 3D arc spanning corner-to-corner
  const updateCardPositions = useCallback((currentOffset: number) => {
    if (typeof window === 'undefined') return 0;
    const width = window.innerWidth || 1200;
    const cardSpacing = getCardSpacing(width);
    const totalWidth = total * cardSpacing;

    let closestDist = Infinity;
    let closestIdx = 0;

    CAROUSEL_ITEMS.forEach((_, idx) => {
      const el = cardRefs.current[idx];
      if (!el) return;

      let rawPos = (idx * cardSpacing + currentOffset) % totalWidth;
      if (rawPos < 0) rawPos += totalWidth;
      const pos = rawPos - totalWidth / 2;

      const norm = pos / (totalWidth / 2);
      const absNorm = Math.abs(norm);

      if (absNorm < closestDist) {
        closestDist = absNorm;
        closestIdx = idx;
      }

      const rotateY = norm * -28;
      const scale = Math.max(0.72, 1.05 - absNorm * 0.32);
      const translateZ = Math.max(-420, -absNorm * 380);
      const translateY = absNorm * 35;
      const opacity = Math.max(0.35, 1 - absNorm * 0.65);
      const zIndex = Math.round(100 - absNorm * 50);

      el.style.transform = `translate3d(${pos}px, ${translateY}px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      el.style.opacity = `${opacity}`;
      el.style.zIndex = `${zIndex}`;
    });

    return closestIdx;
  }, [total]);

  // Continuous animation loop: smoothly moves cards left-to-right
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (targetOffsetRef.current !== null) {
        const diff = targetOffsetRef.current - offsetRef.current;
        if (Math.abs(diff) < 0.5) {
          offsetRef.current = targetOffsetRef.current;
          targetOffsetRef.current = null;
        } else {
          offsetRef.current += diff * Math.min(1, 10 * delta);
        }
      } else if (!isHoveredRef.current && !isDraggingRef.current) {
        // Continuous smooth cinematic glide
        offsetRef.current += 38 * delta;
      }

      const closest = updateCardPositions(offsetRef.current);
      if (closest !== lastActiveIndexRef.current) {
        lastActiveIndexRef.current = closest;
        setActiveItemIndex(closest);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [updateCardPositions]);

  // Handle window resize dynamically
  useEffect(() => {
    const handleResize = () => {
      updateCardPositions(offsetRef.current);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateCardPositions]);

  // Smooth glide to a specific card index
  const glideToIndex = useCallback((targetIdx: number) => {
    if (typeof window === 'undefined') return;
    const width = window.innerWidth || 1200;
    const cardSpacing = getCardSpacing(width);
    const totalWidth = total * cardSpacing;

    let rawPos = (targetIdx * cardSpacing + offsetRef.current) % totalWidth;
    if (rawPos < 0) rawPos += totalWidth;
    const pos = rawPos - totalWidth / 2;

    targetOffsetRef.current = offsetRef.current - pos;
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth || 1200;
      const cardSpacing = getCardSpacing(width);
      if (e.key === 'ArrowLeft') {
        targetOffsetRef.current = offsetRef.current - cardSpacing;
      } else if (e.key === 'ArrowRight') {
        targetOffsetRef.current = offsetRef.current + cardSpacing;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.touches[0].clientX;
    startOffsetRef.current = offsetRef.current;
    hasMovedRef.current = false;
    targetOffsetRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const diff = e.touches[0].clientX - dragStartXRef.current;
    if (Math.abs(diff) > 4) {
      hasMovedRef.current = true;
    }
    offsetRef.current = startOffsetRef.current + diff;
    updateCardPositions(offsetRef.current);
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    startOffsetRef.current = offsetRef.current;
    hasMovedRef.current = false;
    targetOffsetRef.current = null;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const diff = e.clientX - dragStartXRef.current;
    if (Math.abs(diff) > 4) {
      hasMovedRef.current = true;
    }
    offsetRef.current = startOffsetRef.current + diff;
    updateCardPositions(offsetRef.current);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Open full reader modal preview
  const handleOpenPreview = (item: MagazinePosterItem) => {
    const matched = MAGAZINES.find((m) => m.id === item.id) || MAGAZINES[0];
    setPreviewMagazine(matched);
    setPreviewPageIndex(0);
  };

  const currentItem = CAROUSEL_ITEMS[activeItemIndex] || CAROUSEL_ITEMS[0];

  return (
    <section
      className="relative w-full py-16 sm:py-24 md:py-28 bg-transparent text-slate-900 dark:text-white overflow-hidden select-none transition-colors duration-300"
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; isDraggingRef.current = false; }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Dynamic Ambient Spotlight Glow behind active card */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] md:w-[1100px] h-[400px] sm:h-[550px] md:h-[650px] rounded-full blur-[150px] pointer-events-none transition-all duration-700 ease-out opacity-40 dark:opacity-100"
        style={{
          background: `radial-gradient(circle, ${currentItem.glowColor} 0%, rgba(7,3,20,0) 70%)`,
        }}
      />

      {/* Section Header */}
      <div
        className="relative z-20 text-center max-w-3xl mx-auto mb-10 sm:mb-14 px-4 sm:px-6 pointer-events-auto"
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white tracking-tight leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className={`mt-3 text-base sm:text-xl text-emerald-600 dark:text-emerald-400 font-semibold tracking-wide ${subtitleClassName}`}>
            {subtitle}
          </p>
        )}
      </div>

      {/* 3D Arc Track: Corner-to-Corner Continuous Flow */}
      <div className="relative w-full overflow-hidden">
        <div
          className="relative w-full min-h-[450px] sm:min-h-[510px] md:min-h-[560px] flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ perspective: '1600px' }}
        >
          <div className="relative w-full h-[420px] sm:h-[470px] md:h-[510px] flex items-center justify-center">
            {CAROUSEL_ITEMS.map((item, idx) => {
              const isCenter = idx === activeItemIndex;

              return (
                <div
                  key={`${item.id}-${idx}`}
                  ref={(el) => { cardRefs.current[idx] = el; }}
                  onClick={() => {
                    if (hasMovedRef.current) return;
                    if (isCenter) {
                      handleOpenPreview(item);
                    } else {
                      glideToIndex(idx);
                    }
                  }}
                  className={`absolute w-[260px] sm:w-[305px] md:w-[338px] aspect-[814/1024] rounded-2xl overflow-visible cursor-pointer transition-shadow duration-300 will-change-transform bg-slate-950 border-2 ${
                    isCenter
                      ? 'border-emerald-400 shadow-[0_24px_60px_rgba(16,185,129,0.35)] ring-4 ring-emerald-400/30'
                      : 'border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.6)] hover:border-white/30'
                  }`}
                >
                  {/* Authentic Magazine Cover Image - Uncropped, Unzoomed, Full Quality */}
                  <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950">
                    <Image
                      src={item.coverImage}
                      alt={item.fullTitle}
                      fill
                      sizes="(max-width: 640px) 260px, 340px"
                      quality={100}
                      unoptimized
                      className="object-contain"
                      priority={idx < 4}
                    />
                  </div>

                  {/* External Indicator on Center Card (Does not cover or crop the poster) */}
                  {isCenter && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-30 flex items-center gap-2 bg-slate-950/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-emerald-400/80 shadow-2xl pointer-events-none">
                      <BookOpen className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                        Tap to Read Issue
                      </span>
                      <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded-full">
                        {item.code}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Minimal Progress Indicator Dots for the 5 Authentic Posters */}
        <div className="mt-8 flex items-center justify-center gap-2.5">
          {AUTHENTIC_POSTERS.map((poster, pIdx) => {
            const isActive = activeItemIndex % AUTHENTIC_POSTERS.length === pIdx;
            return (
              <button
                key={poster.id}
                onClick={() => glideToIndex(pIdx)}
                aria-label={`Go to ${poster.shortTitle}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-8 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                    : 'w-2.5 bg-slate-300 dark:bg-white/25 hover:bg-slate-400 dark:hover:bg-white/50'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Fullscreen Preview Reader Modal */}
      {previewMagazine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[92vh] rounded-4xl bg-white dark:bg-[#13072b] border-4 border-amber-300/80 shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-white">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-purple-800/80 p-4 sm:p-5 bg-slate-50 dark:bg-purple-950/60">
              <div className="flex items-center gap-3">
                <Badge variant="emerald" className="font-black text-xs">
                  Issue #{previewMagazine.issueNumber}
                </Badge>
                <div>
                  <h3 className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white leading-tight">
                    {previewMagazine.title}
                  </h3>
                  <span className="text-xs text-purple-600 dark:text-purple-300 font-bold">
                    {previewMagazine.editionName} • Page {previewPageIndex + 1} of {previewMagazine.pages.length}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/users/kids/magazine/${previewMagazine.id}`}>
                  <Button size="sm" variant="outline" className="text-xs font-black rounded-xl border-purple-400 hover:border-emerald-400">
                    Open Full Reader
                  </Button>
                </Link>
                <button
                  onClick={() => setPreviewMagazine(null)}
                  className="p-2 rounded-xl bg-slate-200 dark:bg-purple-900/80 hover:bg-rose-500 hover:text-white text-slate-700 dark:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content Page */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              {(() => {
                const page: MagazinePage = previewMagazine.pages[previewPageIndex];
                if (!page) return null;

                return (
                  <div className="space-y-6 max-w-3xl mx-auto">
                    <div className="text-center space-y-2 border-b-2 border-slate-200 dark:border-purple-800/60 pb-4">
                      <Badge variant="magic" className="text-xs uppercase font-black">
                        {page.type.toUpperCase()} PAGE
                      </Badge>
                      <h4 className="font-display font-black text-2xl sm:text-4xl text-slate-900 dark:text-white">
                        {page.title}
                      </h4>
                      {page.subtitle && (
                        <p className="text-sm text-purple-600 dark:text-purple-300 font-bold">
                          {page.subtitle}
                        </p>
                      )}
                    </div>

                    {page.characterImage && (
                      <div className="relative mx-auto w-56 sm:w-72 aspect-[814/1024] rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-300/60 bg-slate-950">
                        <Image
                          src={page.characterImage}
                          alt={page.title}
                          fill
                          quality={100}
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                    )}

                    <div className="rounded-3xl bg-slate-50 dark:bg-purple-950/60 border-2 border-slate-200 dark:border-purple-800/80 p-6 text-sm sm:text-base leading-relaxed text-slate-800 dark:text-purple-100 font-medium">
                      {page.content}
                    </div>

                    {page.creatureStats && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-600 p-4 rounded-2xl text-center">
                          <span className="text-xs font-bold text-slate-600 dark:text-purple-200 uppercase block">Bravery</span>
                          <strong className="font-display text-2xl text-emerald-600 dark:text-emerald-400">
                            {page.creatureStats.bravery} / 100
                          </strong>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-600 p-4 rounded-2xl text-center">
                          <span className="text-xs font-bold text-slate-600 dark:text-purple-200 uppercase block">Magic</span>
                          <strong className="font-display text-2xl text-purple-600 dark:text-purple-300">
                            {page.creatureStats.magic} / 100
                          </strong>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-600 p-4 rounded-2xl text-center">
                          <span className="text-xs font-bold text-slate-600 dark:text-purple-200 uppercase block">Speed</span>
                          <strong className="font-display text-2xl text-amber-600 dark:text-amber-400">
                            {page.creatureStats.speed} / 100
                          </strong>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Modal Bottom Pagination Controls */}
            <div className="flex items-center justify-between border-t-2 border-slate-200 dark:border-purple-800/80 p-4 sm:p-5 bg-slate-50 dark:bg-purple-950/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewPageIndex((prev) => Math.max(0, prev - 1))}
                disabled={previewPageIndex === 0}
                className="font-black rounded-xl"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous Page
              </Button>

              <div className="flex items-center gap-1.5">
                {previewMagazine.pages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPreviewPageIndex(i)}
                    className={`h-2.5 rounded-full transition-all ${
                      previewPageIndex === i
                        ? 'w-6 bg-emerald-500'
                        : 'w-2.5 bg-slate-300 dark:bg-purple-800'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="emerald"
                size="sm"
                onClick={() =>
                  setPreviewPageIndex((prev) =>
                    Math.min(previewMagazine.pages.length - 1, prev + 1)
                  )
                }
                disabled={previewPageIndex === previewMagazine.pages.length - 1}
                className="font-black rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950"
              >
                Next Page
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
