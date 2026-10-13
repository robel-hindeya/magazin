'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { RotateCcw } from 'lucide-react';

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
  floatAnimationClass: string;
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
    sizeClass: 'w-32 h-32 sm:w-44 sm:h-44 lg:w-52 lg:h-52',
    glowColor: 'drop-shadow-[0_12px_28px_rgba(245,158,11,0.55)]',
    floatAnimationClass: 'animate-float-smooth-1',
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
    sizeClass: 'w-32 h-32 sm:w-44 sm:h-44 lg:w-48 lg:h-48',
    glowColor: 'drop-shadow-[0_12px_28px_rgba(234,88,12,0.55)]',
    floatAnimationClass: 'animate-float-smooth-2',
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
    sizeClass: 'w-32 h-32 sm:w-44 sm:h-44 lg:w-52 lg:h-52',
    glowColor: 'drop-shadow-[0_12px_28px_rgba(245,158,11,0.6)]',
    floatAnimationClass: 'animate-float-smooth-3',
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
    floatAnimationClass: 'animate-float-smooth-1',
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
    floatAnimationClass: 'animate-float-smooth-2',
    animationDelay: '0.5s',
  },
];

export function InteractiveHeroCharacters() {
  const [hoveredChar, setHoveredChar] = useState<string | null>(null);
  const [activeSpeechChar, setActiveSpeechChar] = useState<string | null>(null);
  const [draggingChar, setDraggingChar] = useState<string | null>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});

  const dragSession = useRef<{
    charId: string | null;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    hasDragged: boolean;
  }>({
    charId: null,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    hasDragged: false,
  });

  // Kid-friendly playful boing sound
  const playPlayfulSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // AudioContext not permitted or supported
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, charId: string) => {
    // Only capture primary button (left mouse or touch)
    if (e.button !== 0) return;

    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const currentPos = positions[charId] || { x: 0, y: 0 };
    dragSession.current = {
      charId,
      startX: e.clientX,
      startY: e.clientY,
      initialX: currentPos.x,
      initialY: currentPos.y,
      hasDragged: false,
    };

    setDraggingChar(charId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>, charId: string) => {
    if (dragSession.current.charId !== charId) return;

    const dx = e.clientX - dragSession.current.startX;
    const dy = e.clientY - dragSession.current.startY;

    if (!dragSession.current.hasDragged && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
      dragSession.current.hasDragged = true;
      setActiveSpeechChar(null); // dismiss speech bubble when dragging begins
    }

    if (dragSession.current.hasDragged) {
      setPositions((prev) => ({
        ...prev,
        [charId]: {
          x: dragSession.current.initialX + dx,
          y: dragSession.current.initialY + dy,
        },
      }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>, charId: string) => {
    if (dragSession.current.charId !== charId) return;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const hadMoved = dragSession.current.hasDragged;
    dragSession.current.charId = null;
    setDraggingChar(null);

    playPlayfulSound();

    // If it was a quick click rather than a drag, toggle speech bubble
    if (!hadMoved) {
      setActiveSpeechChar((prev) => (prev === charId ? null : charId));
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>, charId: string) => {
    if (dragSession.current.charId === charId) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      dragSession.current.charId = null;
      setDraggingChar(null);
    }
  };

  // Reset all characters to their initial positions
  const resetAllPositions = () => {
    setPositions({});
    setActiveSpeechChar(null);
    playPlayfulSound();
  };

  const hasAnyMoved = Object.values(positions).some((pos) => pos.x !== 0 || pos.y !== 0);

  return (
    <>
      {/* Reset positions pill button if any animal was dragged */}
      {hasAnyMoved && (
        <button
          type="button"
          onClick={resetAllPositions}
          className="absolute top-3 right-4 sm:right-8 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-white/80 dark:bg-purple-950/80 backdrop-blur-md border border-emerald-400 text-slate-800 dark:text-emerald-300 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer animate-fade-in"
          title="Reset animals to their original spots"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-500 animate-spin-reverse" />
          <span>Reset Animals</span>
        </button>
      )}

      {HERO_CHARACTERS.map((char) => {
        const isHovered = hoveredChar === char.id;
        const isDragging = draggingChar === char.id;
        const showBubble = activeSpeechChar === char.id && !isDragging;
        const pos = positions[char.id] || { x: 0, y: 0 };

        return (
          <div
            key={char.id}
            className={`absolute select-none z-20 touch-none ${char.positionClass}`}
            style={{
              transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
              transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
              animationDelay: char.animationDelay,
            }}
            onPointerDown={(e) => handlePointerDown(e, char.id)}
            onPointerMove={(e) => handlePointerMove(e, char.id)}
            onPointerUp={(e) => handlePointerUp(e, char.id)}
            onPointerCancel={(e) => handlePointerCancel(e, char.id)}
            onMouseEnter={() => setHoveredChar(char.id)}
            onMouseLeave={() => setHoveredChar(null)}
          >
            {/* Movable & Smoothly Floating Inner Animal Container */}
            <div
              className={`relative ${
                isDragging
                  ? 'cursor-grabbing scale-110 -rotate-2 shadow-2xl'
                  : 'cursor-grab hover:scale-105'
              } ${!isDragging ? char.floatAnimationClass : ''} transition-transform duration-300 ease-out`}
              style={{
                animationPlayState: isDragging ? 'paused' : 'running',
              }}
            >
              {/* Subtle Ambient Magical Glow on Hover & Drag */}
              <div
                className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-300 pointer-events-none ${
                  isHovered || isDragging ? 'opacity-80 scale-125' : 'opacity-0'
                } bg-gradient-to-tr from-amber-400/50 via-emerald-400/50 to-cyan-400/50 -z-10`}
              />

              {/* Character Animal Image (Transparent vector, no background, un-draggable ghost) */}
              <div className={`${char.sizeClass} relative`}>
                <Image
                  src={char.image}
                  alt={`${char.name} (${char.amharic})`}
                  fill
                  sizes="(max-width: 768px) 160px, 240px"
                  className={`object-contain pointer-events-none select-none transition-all duration-300 ${char.glowColor}`}
                  draggable={false}
                  priority
                />
              </div>

              {/* Speech Bubble on Click/Tap (dismissible) */}
              {showBubble && (
                <div
                  className={`absolute ${char.bubbleClass} z-40 transition-all duration-300 pointer-events-auto w-56 sm:w-64 animate-in fade-in zoom-in-95`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSpeechChar(null);
                  }}
                >
                  <div className="bg-white/95 dark:bg-[#160c38]/95 text-slate-900 dark:text-white rounded-2xl p-3 sm:p-4 shadow-2xl border-2 border-emerald-400 backdrop-blur-md relative cursor-pointer">
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
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
