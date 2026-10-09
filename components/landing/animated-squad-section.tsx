'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  MessageCircle,
  Zap,
  Check,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface EthiopianAnimal {
  id: string;
  name: string;
  amharicName: string;
  scientificName: string;
  region: string;
  image: string;
  tagline: string;
  quote: string;
  power: string;
  bgGlow: string;
  stats: {
    imagination: number;
    vocabulary: number;
    adventure: number;
  };
}

export const ETHIOPIAN_ENDEMIC_ANIMALS: EthiopianAnimal[] = [
  {
    id: 'walia-ibex',
    name: 'Walia Ibex',
    amharicName: 'ዋሊያ',
    scientificName: 'Capra walie',
    region: 'Simien Mountains National Park',
    image: '/images/characters/walia-ibex.jpg',
    tagline: 'High Alpine Mountain King',
    quote: 'Scale the highest peaks of imagination! Every cliff you climb leads to an unforgettable story.',
    power: 'Mountain Summit Vocabulary',
    bgGlow: 'from-amber-400/25 to-yellow-500/25',
    stats: { imagination: 98, vocabulary: 96, adventure: 99 },
  },
  {
    id: 'ethiopian-wolf',
    name: 'Ethiopian Wolf',
    amharicName: 'ቀይ ቀበሮ',
    scientificName: 'Canis simensis',
    region: 'Bale & Simien Afroalpine Plateaus',
    image: '/images/characters/ethiopian-wolf.jpg',
    tagline: 'The World’s Rarest Red Canid',
    quote: 'Keep your senses sharp and thoughts swift. Brave words track truth across the misty highlands.',
    power: 'Highland Agility & Keen Focus',
    bgGlow: 'from-red-500/25 to-orange-500/25',
    stats: { imagination: 97, vocabulary: 95, adventure: 100 },
  },
  {
    id: 'gelada-baboon',
    name: 'Gelada Baboon',
    amharicName: 'ጭላዳ ዝንጀሮ',
    scientificName: 'Theropithecus gelada',
    region: 'Guassa & Simien Highland Escarpments',
    image: '/images/characters/gelada-baboon.jpg',
    tagline: 'Golden-Maned Highland Sovereign',
    quote: 'Speak straight from your heart! True tales carry the living rhythm of community and song.',
    power: 'Heartfelt Story Rhythm & Voice',
    bgGlow: 'from-yellow-400/25 to-amber-600/25',
    stats: { imagination: 96, vocabulary: 94, adventure: 97 },
  },
  {
    id: 'mountain-nyala',
    name: 'Mountain Nyala',
    amharicName: 'የተራራ ድኩላ',
    scientificName: 'Tragelaphus buxtoni',
    region: 'Bale Mountains Cloud Forests',
    image: '/images/characters/mountain-nyala.jpg',
    tagline: 'Queen of the Cloud Forests',
    quote: 'Step gracefully into quiet mist. The deepest wonders unfold when you listen to the ancient trees.',
    power: 'Poetic Mysticism & Elegance',
    bgGlow: 'from-emerald-400/25 to-teal-600/25',
    stats: { imagination: 99, vocabulary: 97, adventure: 95 },
  },
  {
    id: 'ruspoli-turaco',
    name: 'Prince Ruspoli’s Turaco',
    amharicName: 'ሩስፖሊ ቱራኮ',
    scientificName: 'Tauraco ruspolii',
    region: 'Southern Juniper Woodlands',
    image: '/images/characters/ruspoli-turaco.jpg',
    tagline: 'Crimson-Crested Emerald Jewel',
    quote: 'Flash your brightest creative colors! Never hide your unique voice beneath the branches.',
    power: 'Vivid Colorful Imagery',
    bgGlow: 'from-emerald-400/25 to-rose-500/25',
    stats: { imagination: 99, vocabulary: 98, adventure: 94 },
  },
  {
    id: 'bale-monkey',
    name: 'Bale Mountains Monkey',
    amharicName: 'የባሌ ዝንጀሮ',
    scientificName: 'Chlorocebus djamdjamensis',
    region: 'Bale Highland Bamboo Canopy',
    image: '/images/characters/bale-monkey.jpg',
    tagline: 'Bamboo Specialist Explorer',
    quote: 'Stay nimble, chew on fresh ideas, and leap boldly from branch to branch of your adventures!',
    power: 'Curious Wit & Playful Tropes',
    bgGlow: 'from-lime-400/25 to-emerald-600/25',
    stats: { imagination: 95, vocabulary: 93, adventure: 98 },
  },
];

const ANIMAL_GLOW_COLORS: Record<string, string> = {
  'walia-ibex': 'rgba(245, 158, 11, 0.45)',
  'ethiopian-wolf': 'rgba(239, 68, 68, 0.45)',
  'gelada-baboon': 'rgba(234, 179, 8, 0.45)',
  'mountain-nyala': 'rgba(16, 185, 129, 0.45)',
  'ruspoli-turaco': 'rgba(244, 63, 94, 0.45)',
  'bale-monkey': 'rgba(132, 204, 22, 0.45)',
};

// Duplicated list creates an endless loop on any screen width
const SQUAD_ITEMS = [...ETHIOPIAN_ENDEMIC_ANIMALS, ...ETHIOPIAN_ENDEMIC_ANIMALS];

export function AnimatedSquadSection() {
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const offsetRef = useRef<number>(0);
  const targetOffsetRef = useRef<number | null>(null);

  const isDraggingRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const startOffsetRef = useRef<number>(0);
  const hasMovedRef = useRef<boolean>(false);
  const lastActiveIndexRef = useRef<number>(0);

  const total = SQUAD_ITEMS.length;

  // Calculates and updates position for all 12 cards along the 3D arc perspective
  const updateCardPositions = useCallback((currentOffset: number) => {
    if (typeof window === 'undefined') return 0;
    const width = window.innerWidth || 1200;
    const cardSpacing = Math.min(360, Math.max(270, width * 0.24));
    const totalWidth = total * cardSpacing;

    let closestDist = Infinity;
    let closestIdx = 0;

    SQUAD_ITEMS.forEach((_, idx) => {
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
      const scale = Math.max(0.68, 1.0 - (dist / 1150) * 0.36);
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

  // Smooth continuous motion loop gliding in 1 direction (from left to right)
  useEffect(() => {
    // Ensure initial placement is applied immediately on mount
    updateCardPositions(offsetRef.current);

    let animId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (targetOffsetRef.current !== null) {
        const diff = targetOffsetRef.current - offsetRef.current;
        if (Math.abs(diff) < 1) {
          offsetRef.current = targetOffsetRef.current;
          targetOffsetRef.current = null;
        } else {
          offsetRef.current += diff * Math.min(1, 10 * delta);
        }
      } else if (!isDraggingRef.current) {
        // Continuous smooth cinematic glide in 1 direction (from left to right)
        // Glides at 48px/s and gracefully slows to 14px/s on hover so slide motion is always active
        const speed = isHoveredRef.current ? 14 : 48;
        offsetRef.current += speed * delta;
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
    const cardSpacing = Math.min(360, Math.max(270, width * 0.24));
    const totalWidth = total * cardSpacing;

    let rawPos = (targetIdx * cardSpacing + offsetRef.current) % totalWidth;
    if (rawPos < 0) rawPos += totalWidth;
    const pos = rawPos - totalWidth / 2;

    targetOffsetRef.current = offsetRef.current - pos;
  }, [total]);

  const glideToAnimal = (animalIdx: number) => {
    const currentLoop = Math.floor(activeItemIndex / ETHIOPIAN_ENDEMIC_ANIMALS.length);
    const targetIdx = currentLoop * ETHIOPIAN_ENDEMIC_ANIMALS.length + animalIdx;
    glideToIndex(targetIdx);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth || 1200;
      const cardSpacing = Math.min(360, Math.max(270, width * 0.24));
      if (e.key === 'ArrowLeft') {
        targetOffsetRef.current = offsetRef.current - cardSpacing;
      } else if (e.key === 'ArrowRight') {
        targetOffsetRef.current = offsetRef.current + cardSpacing;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Touch handlers
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

  // Mouse drag handlers
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

  const currentAnimal = SQUAD_ITEMS[activeItemIndex % total] || ETHIOPIAN_ENDEMIC_ANIMALS[0];
  const activeGlowColor = ANIMAL_GLOW_COLORS[currentAnimal.id] || 'rgba(16, 185, 129, 0.45)';

  return (
    <section
      className="relative w-full py-20 sm:py-24 md:py-28 bg-transparent text-slate-900 dark:text-white overflow-hidden select-none transition-colors duration-300"
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; isDraggingRef.current = false; }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Dynamic Ambient Spotlight Glow behind center animal card */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] md:w-[1100px] h-[400px] sm:h-[550px] md:h-[650px] rounded-full blur-[150px] pointer-events-none transition-all duration-700 ease-out opacity-35 dark:opacity-100"
        style={{
          background: `radial-gradient(circle, ${activeGlowColor} 0%, rgba(7,3,20,0) 70%)`,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 pointer-events-auto"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white tracking-tight leading-tight">
            Animals Found Only in Ethiopia
          </h2>
          <p className="mt-3 text-base sm:text-xl text-slate-600 dark:text-purple-200 font-medium">
            Meet the rare and wondrous endemic wildlife of the Ethiopian highlands, guiding young storytellers on magical writing adventures!
          </p>
        </div>
      </div>

      {/* =========================================================================
          FULL-WIDTH 3D ARC SLIDER: Continuous 1-Direction Motion & Drag
          ========================================================================= */}
      <div className="relative w-full overflow-hidden">
        <div
          className="relative w-full min-h-[560px] sm:min-h-[600px] md:min-h-[630px] flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ perspective: '1600px' }}
        >
          {/* 3D Arc Track */}
          <div className="relative w-full h-[530px] sm:h-[570px] md:h-[600px] flex items-center justify-center">
            {SQUAD_ITEMS.map((char, idx) => {
              const isCenter = idx === activeItemIndex;
              const isSelected = selectedId === char.id;
              const isHovered = hoveredIdx === idx;

              return (
                <div
                  key={`${char.id}-${idx}`}
                  ref={(el) => { cardRefs.current[idx] = el; }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => {
                    if (hasMovedRef.current) return;
                    if (isCenter) {
                      setSelectedId(selectedId === char.id ? null : char.id);
                    } else {
                      glideToIndex(idx);
                    }
                  }}
                  className={`absolute w-[290px] sm:w-[325px] md:w-[340px] rounded-[32px] overflow-visible cursor-pointer transition-shadow duration-300 will-change-transform ${
                    isCenter
                      ? 'shadow-[0_22px_50px_rgba(15,23,42,0.25)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.9)] ring-2 ring-emerald-500/60 dark:ring-emerald-400/80'
                      : 'shadow-[0_12px_30px_rgba(15,23,42,0.18)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.7)] hover:opacity-95'
                  }`}
                >
                  <div
                    className={`relative w-full rounded-[30px] border-2 transition-all duration-300 p-6 flex flex-col items-center backdrop-blur-md overflow-hidden ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/95 dark:bg-purple-950/95 shadow-xl shadow-emerald-500/20'
                        : 'border-slate-200/90 dark:border-purple-800/70 bg-white/95 dark:bg-[#160d3d]/95 hover:border-emerald-400 dark:hover:border-emerald-400/80'
                    }`}
                  >
                    {/* Floating Background Glow Accent */}
                    <div
                      className={`absolute -top-8 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-tr ${char.bgGlow} rounded-full blur-2xl transition-opacity duration-300 pointer-events-none ${
                        isCenter || isHovered ? 'opacity-100 scale-125' : 'opacity-35'
                      }`}
                    />

                    {/* Speech Bubble on Center Card or Hover */}
                    <div
                      className={`absolute -top-16 left-1/2 -translate-x-1/2 w-64 z-30 transition-all duration-300 pointer-events-none ${
                        isCenter || isHovered
                          ? 'opacity-100 scale-100 -translate-y-1'
                          : 'opacity-0 scale-90 translate-y-2'
                      }`}
                    >
                      <div className="bg-white dark:bg-[#1f1254] text-slate-900 dark:text-white rounded-2xl p-3 shadow-2xl border-2 border-emerald-400 text-left relative">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-purple-700 dark:text-purple-300 uppercase">
                          <MessageCircle className="h-3 w-3 text-emerald-500 fill-emerald-400" />
                          <span>{char.name} Says:</span>
                        </div>
                        <p className="text-[11px] font-extrabold text-slate-800 dark:text-purple-100 leading-snug mt-0.5 line-clamp-2">
                          &ldquo;{char.quote}&rdquo;
                        </p>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-emerald-400" />
                      </div>
                    </div>

                    {/* Character Portrait Render */}
                    <div className="relative w-40 h-40 sm:w-44 sm:h-44 my-2 rounded-2xl overflow-hidden border-2 border-emerald-400/40 dark:border-purple-500/40 shadow-xl transition-all duration-300 bg-slate-950 shrink-0">
                      <Image
                        src={char.image}
                        alt={`${char.name} (${char.amharicName})`}
                        fill
                        sizes="220px"
                        className="object-cover"
                      />
                    </div>

                    {/* Region & Habitat Badge */}
                    <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate max-w-[220px]">{char.region}</span>
                    </div>

                    {/* Name & Amharic Title */}
                    <div className="w-full mt-1 text-center">
                      <h4 className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white flex items-center justify-center gap-2">
                        <span>{char.name}</span>
                        <span className="text-base font-extrabold text-amber-500 dark:text-amber-400">({char.amharicName})</span>
                        {isSelected && (
                          <Check className="h-5 w-5 text-emerald-500 inline shrink-0" />
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-purple-300 font-bold mt-0.5 truncate">
                        <span className="italic">{char.scientificName}</span> • {char.tagline}
                      </p>
                    </div>

                    {/* Power & Adventure Stat Bar */}
                    <div className="mt-3 w-full">
                      <div className="rounded-xl bg-slate-50 dark:bg-purple-900/60 border border-slate-200 dark:border-purple-700/60 p-2 text-left space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-black">
                          <span className="text-purple-700 dark:text-purple-300 flex items-center gap-1">
                            <Zap className="h-3.5 w-3.5 text-emerald-500" /> {char.power}
                          </span>
                          <span className="text-slate-500 dark:text-purple-300">{char.stats.adventure}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-purple-950 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${char.stats.adventure}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Selection Button */}
                    <div className="mt-3 w-full">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(selectedId === char.id ? null : char.id);
                        }}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                            : 'bg-slate-100 dark:bg-purple-800/50 hover:bg-emerald-500 hover:text-slate-950 text-slate-700 dark:text-purple-200'
                        }`}
                      >
                        {isSelected ? 'Selected Story Mentor' : `Pick ${char.name}`}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Minimal Progress Indicator Dots & Navigation Arrows */}
        <div
          className="mt-6 flex items-center justify-center gap-3 sm:gap-4 pointer-events-auto"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              const width = window.innerWidth || 1200;
              const cardSpacing = Math.min(360, Math.max(270, width * 0.24));
              targetOffsetRef.current = offsetRef.current - cardSpacing;
            }}
            aria-label="Previous animal"
            className="p-2.5 rounded-full bg-white dark:bg-purple-900/80 border-2 border-slate-200 dark:border-purple-700/80 shadow-md hover:bg-emerald-500 hover:border-emerald-500 hover:text-slate-950 dark:hover:text-slate-950 text-slate-700 dark:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {ETHIOPIAN_ENDEMIC_ANIMALS.map((animal, idx) => {
              const isCurrent = (activeItemIndex % ETHIOPIAN_ENDEMIC_ANIMALS.length) === idx;
              return (
                <button
                  key={animal.id}
                  onClick={() => glideToAnimal(idx)}
                  aria-label={`Go to ${animal.name}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'w-8 bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                      : 'w-2.5 bg-slate-300 dark:bg-white/25 hover:bg-slate-400 dark:hover:bg-white/50'
                  }`}
                />
              );
            })}
          </div>

          <button
            onClick={() => {
              const width = window.innerWidth || 1200;
              const cardSpacing = Math.min(360, Math.max(270, width * 0.24));
              targetOffsetRef.current = offsetRef.current + cardSpacing;
            }}
            aria-label="Next animal"
            className="p-2.5 rounded-full bg-white dark:bg-purple-900/80 border-2 border-slate-200 dark:border-purple-700/80 shadow-md hover:bg-emerald-500 hover:border-emerald-500 hover:text-slate-950 dark:hover:text-slate-950 text-slate-700 dark:text-white transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Bottom Squad Callout */}
      <div
        className="mt-14 text-center px-4 pointer-events-auto"
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <p className="text-base font-bold text-slate-600 dark:text-purple-200 capitalize">
          create free account and choose your Ethiopia companion
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <Link href="/auth/register">
            <Button
              variant="emerald"
              size="lg"
              className="font-black text-sm px-10 h-12 bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg"
            >
              Create
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
