'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface HeroCharacter {
  id: string;
  name: string;
  amharic: string;
  origin: string;
  image: string;
  quote: string;
  power: string;
  positionClass: string;
  bubbleClass: string;
  sizeClass: string;
  glowColor: string;
  animationDelay: string;
}

const HERO_CHARACTERS: HeroCharacter[] = [
  {
    id: 'walia-ibex',
    name: 'Walia Ibex',
    amharic: 'ዋሊያ',
    origin: 'Simien Mountains',
    image: '/images/characters/walia-ibex.png',
    quote: 'Scale the highest peaks of your imagination! Every cliff leads to a new story!',
    power: 'Mountain Summit Vocabulary',
    positionClass: 'top-6 left-3 sm:left-6 lg:left-10',
    bubbleClass: 'top-full left-0 sm:left-4 mt-2',
    sizeClass: 'w-34 h-34 sm:w-44 sm:h-44 lg:w-52 lg:h-52',
    glowColor: 'drop-shadow-[0_12px_28px_rgba(245,158,11,0.55)]',
    animationDelay: '0s',
  },
  {
    id: 'ethiopian-wolf',
    name: 'Ethiopian Wolf',
    amharic: 'ቀይ ቀበሮ',
    origin: 'Bale Plateaus',
    image: '/images/characters/ethiopian-wolf.png',
    quote: 'Keep your thoughts swift and brave! Let your words track wondrous adventures!',
    power: 'Highland Agility & Focus',
    positionClass: 'top-4 right-1/4 sm:right-1/3 -translate-y-2 hidden lg:block',
    bubbleClass: 'top-full left-1/2 -translate-x-1/2 mt-2',
    sizeClass: 'w-34 h-34 sm:w-44 sm:h-44 lg:w-48 lg:h-48',
    glowColor: 'drop-shadow-[0_12px_28px_rgba(234,88,12,0.55)]',
    animationDelay: '1.2s',
  },
  {
    id: 'abyssinian-lion',
    name: 'Abyssinian Lion',
    amharic: 'አንበሳ',
    origin: 'Highland Emperor',
    image: '/images/characters/abyssinian-lion.png',
    quote: 'Roar with creative confidence! Every child is a mighty storytelling ruler!',
    power: 'Royal Creative Courage',
    positionClass: 'top-6 right-3 sm:right-6 lg:right-12',
    bubbleClass: 'top-full right-0 sm:right-4 mt-2',
    sizeClass: 'w-34 h-34 sm:w-44 sm:h-44 lg:w-52 lg:h-52',
    glowColor: 'drop-shadow-[0_12px_28px_rgba(245,158,11,0.6)]',
    animationDelay: '0.8s',
  },
  {
    id: 'gelada-baboon',
    name: 'Gelada Baboon',
    amharic: 'ጭላዳ ዝንጀሮ',
    origin: 'Guassa Escarpment',
    image: '/images/characters/gelada-baboon.png',
    quote: 'Speak straight from your heart! True tales carry the living rhythm of song!',
    power: 'Heartfelt Story Rhythm',
    positionClass: 'bottom-8 left-4 sm:left-10 lg:left-20 hidden md:block',
    bubbleClass: 'bottom-full left-0 mb-2',
    sizeClass: 'w-28 h-28 sm:w-38 sm:h-38 lg:w-48 lg:h-48',
    glowColor: 'drop-shadow-[0_12px_28px_rgba(251,191,36,0.55)]',
    animationDelay: '1.6s',
  },
  {
    id: 'mountain-nyala',
    name: 'Mountain Nyala',
    amharic: 'የተራራ ድኩላ',
    origin: 'Cloud Forest',
    image: '/images/characters/mountain-nyala.png',
    quote: 'Listen to the whispering trees! Gentle words can summon the brightest magic!',
    power: 'Cloud Forest Wisdom',
    positionClass: 'bottom-10 right-4 sm:right-10 lg:right-24 hidden md:block',
    bubbleClass: 'bottom-full right-0 mb-2',
    sizeClass: 'w-28 h-28 sm:w-38 sm:h-38 lg:w-48 lg:h-48',
    glowColor: 'drop-shadow-[0_12px_28px_rgba(16,185,129,0.55)]',
    animationDelay: '0.5s',
  },
];

export function InteractiveHeroCharacters() {
  const [hoveredChar, setHoveredChar] = useState<string | null>(null);
  const [clickedChar, setClickedChar] = useState<string | null>(null);

  const handleCharClick = (id: string) => {
    setClickedChar(id);
    setTimeout(() => setClickedChar(null), 1200);
  };

  return (
    <>
      {HERO_CHARACTERS.map((char) => {
        const isHovered = hoveredChar === char.id;
        const isClicked = clickedChar === char.id;

        return (
          <div
            key={char.id}
            className={`absolute select-none z-20 transition-all duration-300 ${char.positionClass}`}
            style={{ animationDelay: char.animationDelay }}
            onMouseEnter={() => setHoveredChar(char.id)}
            onMouseLeave={() => setHoveredChar(null)}
            onClick={() => handleCharClick(char.id)}
          >
            {/* Interactive Character Wrapper (No Background) */}
            <div
              className={`relative cursor-pointer transition-all duration-300 ease-out transform ${
                isHovered
                  ? 'scale-115 -translate-y-2 rotate-2'
                  : 'animate-float hover:scale-105'
              } ${isClicked ? 'animate-wiggle scale-125' : ''}`}
            >
              {/* Subtle Ambient Glow on Hover without solid background box */}
              <div
                className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-300 ${
                  isHovered ? 'opacity-80 scale-125' : 'opacity-0'
                } bg-gradient-to-tr from-amber-400 via-emerald-400 to-cyan-400 -z-10`}
              />

              {/* Character Image (Transparent vector, no background) */}
              <div className={`${char.sizeClass} relative`}>
                <Image
                  src={char.image}
                  alt={`${char.name} (${char.amharic})`}
                  fill
                  sizes="(max-width: 768px) 160px, 240px"
                  className={`object-contain transition-all duration-300 ${char.glowColor}`}
                  priority
                />
              </div>

              {/* Interactive Speech Bubble that appears on Cursor Hover */}
              <div
                className={`absolute ${char.bubbleClass} z-30 transition-all duration-300 pointer-events-none w-56 sm:w-64 ${
                  isHovered || isClicked
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-90 translate-y-2'
                }`}
              >
                <div className="bg-white/95 dark:bg-[#160c38]/95 text-slate-900 dark:text-white rounded-2xl p-3 sm:p-4 shadow-2xl border-2 border-emerald-400 backdrop-blur-md relative">
                  {/* Bubble Pointer Arrow */}
                  <div className="text-[10px] uppercase font-black tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center justify-between mb-1">
                    <span>{char.name} • {char.amharic}</span>
                    <span className="text-[9px] text-slate-400 dark:text-purple-300 font-bold">{char.origin}</span>
                  </div>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-purple-100 leading-snug">
                    &ldquo;{char.quote}&rdquo;
                  </p>
                  <div className="mt-1.5 pt-1.5 border-t border-slate-100 dark:border-purple-800/60 flex items-center justify-between text-[10px] font-black text-purple-700 dark:text-purple-300">
                    <span>Power: {char.power}</span>
                    <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded-full font-bold">
                      Ready!
                    </span>
                  </div>
                </div>
              </div>

              {/* Small Label Badge when not hovered */}
              {!isHovered && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/80 backdrop-blur-xs text-[9px] font-black text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/40 opacity-0 sm:opacity-90 pointer-events-none shadow-sm transition-opacity">
                  {char.name}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
