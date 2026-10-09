'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  BookOpen,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MAGAZINES, MagazineIssue, MagazinePage } from '@/components/users/magazine-data';

interface CarouselItem {
  id: string;
  issueNumber: number;
  shortTitle: string;
  fullTitle: string;
  rating: string;
  year: string;
  metadata: string;
  characterMain: string;
  characterSecondary: string;
  bgGradient: string;
  glowColor: string;
  accentColor: string;
  summary: string;
}

const CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: 'issue-44',
    issueNumber: 44,
    shortTitle: 'Dragon Skies',
    fullTitle: 'DRAGON SKIES & THE COSMIC PORTAL',
    rating: '9.8',
    year: '2026',
    metadata: 'Issue #44 • 14 Stories',
    characterMain: '/images/characters/toothless.png',
    characterSecondary: '/images/characters/pikachu.png',
    bgGradient: 'from-[#1c0838] via-[#351061] to-[#0c031a]',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    accentColor: '#a855f7',
    summary: 'Dive into the mysterious northern constellations where Toothless guards the ancient Word Tree.',
  },
  {
    id: 'issue-45',
    issueNumber: 45,
    shortTitle: 'Galactic Odyssey',
    fullTitle: 'GALACTIC ODYSSEY & COSMIC COMETS',
    rating: '9.9',
    year: '2026',
    metadata: 'Issue #45 • 12 Stories',
    characterMain: '/images/characters/sonic.png',
    characterSecondary: '/images/characters/scrat.png',
    bgGradient: 'from-[#0b1329] via-[#1a234a] to-[#060a17]',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    accentColor: '#06b6d4',
    summary: 'Hyper-drive speed through crystal starways with Sonic & Scrat chasing cosmic adjectives.',
  },
  {
    id: 'issue-43',
    issueNumber: 43,
    shortTitle: 'Whispering Jungle',
    fullTitle: 'WHISPERING JUNGLE & STARLIGHT SAFARI',
    rating: '9.7',
    year: '2026',
    metadata: 'Issue #43 • 16 Stories',
    characterMain: '/images/characters/simba.png',
    characterSecondary: '/images/characters/stitch.png',
    bgGradient: 'from-[#042f23] via-[#065f46] to-[#021f17]',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    accentColor: '#10b981',
    summary: 'Journey deep into glowing baobab treehouses with Simba & Stitch exploring living scrolls.',
  },
  {
    id: 'issue-42',
    issueNumber: 42,
    shortTitle: 'Ocean of Dreams',
    fullTitle: 'OCEAN OF DREAMS & LUMINOUS REEFS',
    rating: '9.6',
    year: '2026',
    metadata: 'Issue #42 • 10 Stories',
    characterMain: '/images/characters/nemo.png',
    characterSecondary: '/images/characters/po-panda.png',
    bgGradient: 'from-[#082f49] via-[#0369a1] to-[#021824]',
    glowColor: 'rgba(14, 165, 233, 0.45)',
    accentColor: '#0ea5e9',
    summary: 'Plunge beneath shimmering waves where Nemo and Po Panda train in the underwater Kung Fu temple.',
  },
  {
    id: 'issue-41',
    issueNumber: 41,
    shortTitle: 'Enchanted Toy Realm',
    fullTitle: 'ENCHANTED TOY REALM & TIME GATES',
    rating: '9.8',
    year: '2026',
    metadata: 'Issue #41 • 15 Stories',
    characterMain: '/images/characters/toy-story.png',
    characterSecondary: '/images/characters/minion.png',
    bgGradient: 'from-[#3b0d1e] via-[#6e1333] to-[#1a040d]',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    accentColor: '#f43f5e',
    summary: 'Venture into the secret attic workshop where toy companions step into magical clockwork gears.',
  },
  {
    id: 'issue-40',
    issueNumber: 40,
    shortTitle: 'Swamp Kingdom',
    fullTitle: 'SWAMP KINGDOM & GIANT TALES',
    rating: '9.7',
    year: '2026',
    metadata: 'Issue #40 • 18 Stories',
    characterMain: '/images/characters/shrek.png',
    characterSecondary: '/images/characters/stitch.png',
    bgGradient: 'from-[#14532d] via-[#166534] to-[#052e16]',
    glowColor: 'rgba(34, 197, 94, 0.45)',
    accentColor: '#22c55e',
    summary: 'Step beneath mossy canopies where Shrek and Stitch guard ancient logs glowing with secret words.',
  },
  {
    id: 'issue-39',
    issueNumber: 39,
    shortTitle: 'Cosmic Mischief',
    fullTitle: 'COSMIC MISCHIEF & STARLIGHT ISLANDS',
    rating: '9.9',
    year: '2026',
    metadata: 'Issue #39 • 20 Stories',
    characterMain: '/images/characters/stitch.png',
    characterSecondary: '/images/characters/pikachu.png',
    bgGradient: 'from-[#312e81] via-[#3730a3] to-[#1e1b4b]',
    glowColor: 'rgba(99, 102, 241, 0.45)',
    accentColor: '#6366f1',
    summary: 'Glide through floating neon archipelagoes where Stitch and Pikachu create electric space tales.',
  },
  {
    id: 'issue-38',
    issueNumber: 38,
    shortTitle: 'Polar Lights',
    fullTitle: 'POLAR LIGHTS & ARCTIC WONDERS',
    rating: '9.8',
    year: '2026',
    metadata: 'Issue #38 • 15 Stories',
    characterMain: '/images/characters/penguin.png',
    characterSecondary: '/images/characters/cloud-guy.png',
    bgGradient: 'from-[#134e4a] via-[#0f766e] to-[#042f2e]',
    glowColor: 'rgba(20, 184, 166, 0.45)',
    accentColor: '#14b8a6',
    summary: 'Slide across crystalline ice glaciers with Pip the Penguin and Cloud Guy as they discover aurora caves.',
  },
];

export interface MagazineCoverSliderProps {
  title?: string;
  subtitle?: string;
}

export function MagazineCoverSlider({
  title = 'Magazins',
  subtitle = 'Explore our diverse Ethiopian themed magazines',
}: MagazineCoverSliderProps = {}) {
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [previewMagazine, setPreviewMagazine] = useState<MagazineIssue | null>(null);
  const [previewPageIndex, setPreviewPageIndex] = useState<number>(0);

  // References for ultra-smooth 60/120fps direct GPU transformation without re-render jank
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

  // Calculates and updates position for all 8 cards along the 3D arc spanning corner-to-corner
  const updateCardPositions = useCallback((currentOffset: number) => {
    if (typeof window === 'undefined') return 0;
    const width = window.innerWidth || 1200;
    const cardSpacing = Math.min(370, Math.max(260, width * 0.23));
    const totalWidth = total * cardSpacing;

    let closestDist = Infinity;
    let closestIdx = 0;

    CAROUSEL_ITEMS.forEach((_, idx) => {
      const el = cardRefs.current[idx];
      if (!el) return;

      let rawPos = (idx * cardSpacing + currentOffset) % totalWidth;
      if (rawPos < 0) rawPos += totalWidth;
      const pos = rawPos - totalWidth / 2;

      const dist = Math.abs(pos);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }

      // Smooth mathematical 3D Arc geometry
      const scale = Math.max(0.66, 1.0 - (dist / 1150) * 0.38);
      const maxRot = 16;
      const rotateY = pos < 0
        ? Math.min(maxRot, (dist / 380) * 9)
        : -Math.min(maxRot, (dist / 380) * 9);
      const opacity = Math.max(0.35, 1.0 - (dist / 1050) * 0.65);
      const zIndex = Math.max(5, Math.round(30 - (dist / 320) * 7));
      const brightness = Math.max(0.65, 1.0 - (dist / 1050) * 0.4);

      el.style.transform = `translateX(${pos.toFixed(1)}px) scale(${scale.toFixed(3)}) rotateY(${rotateY.toFixed(2)}deg)`;
      el.style.opacity = String(opacity.toFixed(2));
      el.style.zIndex = String(zIndex);
      el.style.filter = `brightness(${brightness.toFixed(2)})`;
    });

    return closestIdx;
  }, [total]);

  // Smooth continuous motion loop gliding FROM LEFT TO RIGHT
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      // Handle target transition (smooth glide to clicked card or dot)
      if (targetOffsetRef.current !== null) {
        const diff = targetOffsetRef.current - offsetRef.current;
        if (Math.abs(diff) < 1) {
          offsetRef.current = targetOffsetRef.current;
          targetOffsetRef.current = null;
        } else {
          offsetRef.current += diff * Math.min(1, 10 * delta);
        }
      } else if (!isHoveredRef.current && !isDraggingRef.current) {
        // Continuous smooth cinematic glide FROM LEFT TO RIGHT (positive offset)
        // 38 pixels per second creates an elegant, calm, premium flow
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
    const cardSpacing = Math.min(370, Math.max(260, width * 0.23));
    const totalWidth = total * cardSpacing;

    let rawPos = (targetIdx * cardSpacing + offsetRef.current) % totalWidth;
    if (rawPos < 0) rawPos += totalWidth;
    const pos = rawPos - totalWidth / 2;

    targetOffsetRef.current = offsetRef.current - pos;
  }, [total]);

  // Keyboard navigation (Arrow keys smoothly glide between cards)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth || 1200;
      const cardSpacing = Math.min(370, Math.max(260, width * 0.23));
      if (e.key === 'ArrowLeft') {
        targetOffsetRef.current = offsetRef.current - cardSpacing;
      } else if (e.key === 'ArrowRight') {
        targetOffsetRef.current = offsetRef.current + cardSpacing;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Touch Swipe & Move handlers (real-time interactive dragging)
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

  // Mouse Drag handlers (desktop real-time interactive dragging)
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

  // Helper to open reader modal preview
  const handleOpenPreview = (item: CarouselItem) => {
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

      {/* Dynamic Ambient Spotlight Glow (Directly behind active center card, adapts to Light & Dark) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] md:w-[1100px] h-[400px] sm:h-[550px] md:h-[650px] rounded-full blur-[150px] pointer-events-none transition-all duration-700 ease-out opacity-35 dark:opacity-100"
        style={{
          background: `radial-gradient(circle, ${currentItem.glowColor} 0%, rgba(7,3,20,0) 70%)`,
        }}
      />

      {/* =========================================================================
          SECTION HEADER: TITLE MAGAZINS
          ========================================================================= */}
      <div
        className="relative z-20 text-center max-w-3xl mx-auto mb-10 sm:mb-14 px-4 sm:px-6 pointer-events-auto"
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white tracking-tight leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-base sm:text-xl text-slate-600 dark:text-purple-200 font-medium">
            {subtitle}
          </p>
        )}
      </div>

      {/* =========================================================================
          FULL-WIDTH CORNER-TO-CORNER 8-CARD SMOOTH LEFT-TO-RIGHT ANIMATION
          Cards glide continuously from left to right with fluid 3D arc perspective
          ========================================================================= */}
      <div className="relative w-full overflow-hidden">
        
        <div
          className="relative w-full min-h-[490px] sm:min-h-[550px] md:min-h-[600px] flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ perspective: '1600px' }}
        >
          {/* 8-Card 3D Arc Track */}
          <div className="relative w-full h-[460px] sm:h-[500px] md:h-[530px] flex items-center justify-center">
            {CAROUSEL_ITEMS.map((item, idx) => {
              const isCenter = idx === activeItemIndex;

              return (
                <div
                  key={item.id}
                  ref={(el) => { cardRefs.current[idx] = el; }}
                  onClick={() => {
                    if (hasMovedRef.current) return;
                    if (isCenter) {
                      handleOpenPreview(item);
                    } else {
                      glideToIndex(idx);
                    }
                  }}
                  className={`absolute w-[280px] sm:w-[320px] md:w-[345px] h-[420px] sm:h-[480px] md:h-[505px] rounded-[32px] overflow-hidden cursor-pointer transition-shadow duration-300 will-change-transform ${
                    isCenter
                      ? 'shadow-[0_22px_50px_rgba(15,23,42,0.25)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.9)] ring-2 ring-slate-900/10 dark:ring-white/30 hover:ring-slate-900/20 dark:hover:ring-white/50'
                      : 'shadow-[0_12px_30px_rgba(15,23,42,0.18)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.7)] hover:opacity-95'
                  }`}
                >
                  {/* Card Background Gradient & Artwork Frame */}
                  <div className={`relative w-full h-full bg-gradient-to-b ${item.bgGradient} flex flex-col justify-between overflow-hidden border border-white/15 text-white`}>
                    
                    {/* Top Row: Brand Icon (Left) & Star Rating (Right) */}
                    <div className="relative z-20 flex items-center justify-between p-5 sm:p-6">
                      {/* Brand Circular Badge */}
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-600 p-[1.5px] shadow-lg flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                          <span className="font-display font-black text-xs sm:text-sm tracking-wider text-emerald-400 drop-shadow">
                            SK
                          </span>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 font-display font-black text-lg sm:text-xl text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        <span>{item.rating}</span>
                        <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400 drop-shadow" />
                      </div>
                    </div>

                    {/* Center Artwork: Rich Animated Movie Character Frame */}
                    <div className="relative flex-1 flex items-center justify-center px-4 -mt-2">
                      <div className={`relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 ${isCenter ? 'animate-float' : ''}`}>
                        <Image
                          src={item.characterMain}
                          alt={item.shortTitle}
                          fill
                          sizes="280px"
                          className="object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.85)]"
                        />
                      </div>

                      {/* Secondary floating character accent */}
                      {item.characterSecondary && (
                        <div className="absolute -bottom-1 -right-1 w-16 h-16 sm:w-20 sm:h-20 opacity-80 pointer-events-none">
                          <Image
                            src={item.characterSecondary}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-contain drop-shadow-md"
                          />
                        </div>
                      )}
                    </div>

                    {/* Bottom Scrim & Typography (Matched directly to reference pin) */}
                    <div className="relative z-20 bg-gradient-to-t from-black via-black/75 to-transparent pt-12 pb-5 px-5 sm:px-6 space-y-1">
                      <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                        {item.shortTitle}
                      </h3>

                      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium">
                        <span>{item.year}</span>
                        <span className="text-slate-500">•</span>
                        <span>{item.metadata}</span>
                      </div>

                      {/* Action Pill on Center Card */}
                      {isCenter && (
                        <div className="pt-2 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                            <BookOpen className="h-3.5 w-3.5" />
                            Tap Card to Read
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Free with Orbs
                          </span>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Minimal Progress Indicator Dots for all 8 Cards */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {CAROUSEL_ITEMS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => glideToIndex(idx)}
              aria-label={`Go to item ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeItemIndex === idx
                  ? 'w-7 bg-slate-900 dark:bg-white shadow-[0_0_12px_rgba(15,23,42,0.4)] dark:shadow-[0_0_12px_rgba(255,255,255,0.8)]'
                  : 'w-2 bg-slate-300 dark:bg-white/25 hover:bg-slate-400 dark:hover:bg-white/50'
              }`}
            />
          ))}
        </div>

      </div>

      {/* =========================================================================
          FULLSCREEN / POPUP PREVIEW READER MODAL (Adapts to Light & Dark)
          ========================================================================= */}
      {previewMagazine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 dark:bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
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
                      <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 animate-float">
                        <Image
                          src={page.characterImage}
                          alt={page.title}
                          fill
                          className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
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
