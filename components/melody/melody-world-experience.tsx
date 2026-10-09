'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Music,
  Sparkles,
  Volume2,
  VolumeX,
  Trophy,
  Play,
  Gamepad2,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WonderZoneSection } from '@/components/landing/wonder-zone-section';

interface ChimeKey {
  note: string;
  name: string;
  animal: string;
  freq: number;
  color: string;
  shadowColor: string;
  borderCol: string;
  keyNum: string;
  amharic: string;
}

const CHIME_KEYS: ChimeKey[] = [
  {
    note: 'C4',
    name: 'Do',
    animal: 'Red Wolf',
    amharic: 'ቀይ ቀበሮ',
    freq: 261.63,
    color: 'from-rose-500 to-red-600',
    shadowColor: 'shadow-rose-500/40',
    borderCol: 'border-rose-300 dark:border-rose-500',
    keyNum: '1',
  },
  {
    note: 'D4',
    name: 'Re',
    animal: 'Golden Lion',
    amharic: 'አንበሳ',
    freq: 293.66,
    color: 'from-amber-500 to-orange-600',
    shadowColor: 'shadow-amber-500/40',
    borderCol: 'border-amber-300 dark:border-amber-500',
    keyNum: '2',
  },
  {
    note: 'E4',
    name: 'Mi',
    animal: 'Sun Turaco',
    amharic: 'ሩስፖሊ',
    freq: 329.63,
    color: 'from-yellow-400 to-amber-500',
    shadowColor: 'shadow-yellow-400/40',
    borderCol: 'border-yellow-200 dark:border-yellow-400',
    keyNum: '3',
  },
  {
    note: 'F4',
    name: 'Fa',
    animal: 'Alpine Walia',
    amharic: 'ዋሊያ',
    freq: 349.23,
    color: 'from-emerald-500 to-teal-600',
    shadowColor: 'shadow-emerald-500/40',
    borderCol: 'border-emerald-300 dark:border-emerald-500',
    keyNum: '4',
  },
  {
    note: 'G4',
    name: 'Sol',
    animal: 'Mountain Nyala',
    amharic: 'ድኩላ',
    freq: 392.00,
    color: 'from-cyan-400 to-blue-600',
    shadowColor: 'shadow-cyan-500/40',
    borderCol: 'border-cyan-300 dark:border-cyan-500',
    keyNum: '5',
  },
  {
    note: 'A4',
    name: 'La',
    animal: 'Gelada Baboon',
    amharic: 'ጭላዳ',
    freq: 440.00,
    color: 'from-indigo-500 to-purple-600',
    shadowColor: 'shadow-indigo-500/40',
    borderCol: 'border-indigo-300 dark:border-indigo-500',
    keyNum: '6',
  },
  {
    note: 'B4',
    name: 'Ti',
    animal: 'Bale Monkey',
    amharic: 'ዝንጀሮ',
    freq: 493.88,
    color: 'from-purple-500 to-pink-600',
    shadowColor: 'shadow-purple-500/40',
    borderCol: 'border-purple-300 dark:border-purple-500',
    keyNum: '7',
  },
  {
    note: 'C5',
    name: 'High Do',
    animal: 'Cosmic Toothless',
    amharic: 'ዘንዶ',
    freq: 523.25,
    color: 'from-fuchsia-500 to-rose-500',
    shadowColor: 'shadow-fuchsia-500/40',
    borderCol: 'border-fuchsia-300 dark:border-fuchsia-500',
    keyNum: '8',
  },
];

interface FloatingNote {
  id: number;
  x: number;
  y: number;
  symbol: string;
}

export function MelodyWorldExperience() {
  const [audioMuted, setAudioMuted] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [musicalOrbs, setMusicalOrbs] = useState(0);
  const [lastPlayedNote, setLastPlayedNote] = useState<string>('Tap any key to play magical music!');
  const [floatingNotes, setFloatingNotes] = useState<FloatingNote[]>([]);
  const [isPlayingAuto, setIsPlayingAuto] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio Context on first interaction
  const getAudioContext = () => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Play a musical bell chime with rich harmonic warmth
  const playChimeTone = (freq: number) => {
    if (audioMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Fundamental oscillator
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      // Warm harmonic overtone (octave + fifth)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now);

      // Bell envelope
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      gain2.gain.setValueAtTime(0.15, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(ctx.destination);
      gain2.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.2);
      osc2.stop(now + 0.8);
    } catch {
      // Audio not permitted or failed
    }
  };

  const handleTriggerNote = (chime: ChimeKey, e?: React.MouseEvent) => {
    playChimeTone(chime.freq);
    setActiveKey(chime.note);
    setMusicalOrbs((prev) => prev + 5);
    setLastPlayedNote(`${chime.name} (${chime.note}) • ${chime.animal} (${chime.amharic})`);

    // Spawn floating musical particles
    const symbols = ['🎵', '🎶', '⭐', '✨', '🔔'];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const clientX = e ? e.clientX : window.innerWidth / 2;
    const clientY = e ? e.clientY : 300;

    const noteParticle: FloatingNote = {
      id: Date.now() + Math.random(),
      x: clientX,
      y: clientY,
      symbol: randomSymbol,
    };

    setFloatingNotes((prev) => [...prev, noteParticle]);
    setTimeout(() => {
      setFloatingNotes((prev) => prev.filter((n) => n.id !== noteParticle.id));
    }, 1200);

    setTimeout(() => {
      setActiveKey(null);
    }, 300);
  };

  // Keyboard shortcut support (keys 1 - 8)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const matched = CHIME_KEYS.find((k) => k.keyNum === e.key);
      if (matched) {
        handleTriggerNote(matched);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioMuted]);

  // Play a joyful automatic nursery chime tune: "Twinkle Twinkle / Selam Melody"
  const handlePlayTune = async () => {
    if (isPlayingAuto) return;
    setIsPlayingAuto(true);
    // C, C, G, G, A, A, G, F, F, E, E, D, D, C
    const melodySeq = [0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0];
    for (let i = 0; i < melodySeq.length; i++) {
      const chime = CHIME_KEYS[melodySeq[i]];
      if (chime) {
        handleTriggerNote(chime);
      }
      await new Promise((res) => setTimeout(res, 380));
    }
    setIsPlayingAuto(false);
  };

  return (
    <div className="relative w-full min-h-screen night-sky-bg text-slate-900 dark:text-white overflow-hidden transition-colors">
      {/* Background starlight nebulae */}
      <div className="absolute inset-0 stars-pattern opacity-30 dark:opacity-60 pointer-events-none" />
      <div className="absolute top-10 left-1/4 w-[600px] h-[350px] bg-pink-500/15 dark:bg-pink-500/25 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-[600px] h-[350px] bg-purple-600/15 dark:bg-purple-600/25 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-1/3 w-[650px] h-[400px] bg-emerald-500/15 dark:bg-emerald-500/20 blur-[160px] rounded-full pointer-events-none" />

      {/* Floating Animated Musical Note Emitters */}
      {floatingNotes.map((note) => (
        <div
          key={note.id}
          style={{ left: note.x, top: note.y }}
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 text-3xl font-black drop-shadow-[0_4px_12px_rgba(236,72,153,0.8)] animate-out fade-out slide-out-to-top-16 duration-1000"
        >
          {note.symbol}
        </div>
      ))}

      {/* =========================================================================
          HERO BANNER: WELCOME TO MELODY WORLD
          ========================================================================= */}
      <section className="relative w-full pt-16 pb-12 sm:pt-24 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 dark:bg-pink-950/80 px-5 py-2 border-2 border-pink-300 dark:border-pink-600/80 shadow-md mb-6">
          <Music className="h-4 w-4 text-pink-600 dark:text-pink-400 animate-bounce" />
          <span className="font-display font-black text-xs uppercase tracking-wider text-pink-900 dark:text-pink-200">
            Interactive Musical Wonderland
          </span>
          <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full">
            REAL SOUNDS
          </span>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-slate-900 dark:text-white leading-tight">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            Melody World
          </span>
          ! 🎵
        </h1>

        <p className="mt-4 text-base sm:text-xl text-slate-600 dark:text-purple-200 max-w-3xl mx-auto font-medium leading-relaxed">
          Tap the enchanted animal sound chimes, listen to musical chords, pop melodic vocabulary bubbles, and earn glowing star orbs!
        </p>

        {/* Floating Melody HUD / Scoreboard */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2.5 rounded-2xl bg-white/90 dark:bg-[#150a36]/90 border-2 border-emerald-400/80 px-6 py-3 shadow-lg backdrop-blur-md">
            <Trophy className="h-5 w-5 text-emerald-500 fill-emerald-500 animate-pulse" />
            <div className="text-left">
              <span className="text-[10px] font-black uppercase text-slate-500 dark:text-purple-300 block">
                Melody Orbs Earned
              </span>
              <span className="font-display font-black text-xl text-emerald-600 dark:text-emerald-400 leading-none">
                +{musicalOrbs} Glowing Orbs
              </span>
            </div>
          </div>

          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className="flex items-center gap-2 rounded-2xl bg-white/90 dark:bg-[#150a36]/90 border-2 border-slate-200 dark:border-purple-700/80 px-5 py-3 shadow-md backdrop-blur-md hover:border-pink-400 text-slate-700 dark:text-purple-200 font-display font-bold text-xs transition-all active:scale-95 cursor-pointer"
          >
            {audioMuted ? (
              <>
                <VolumeX className="h-4 w-4 text-rose-500" />
                <span>Audio Muted (Click to Unmute)</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 text-emerald-500 animate-pulse" />
                <span>Audio Enabled</span>
              </>
            )}
          </button>

          <Button
            onClick={handlePlayTune}
            disabled={isPlayingAuto}
            variant="emerald"
            size="lg"
            className="font-black text-xs sm:text-sm h-12 px-6 gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg cursor-pointer"
          >
            <Play className={`h-4 w-4 ${isPlayingAuto ? 'animate-spin' : 'fill-slate-950'}`} />
            {isPlayingAuto ? 'Playing Selam Tune...' : 'Auto-Play Melody Tune'}
          </Button>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE PIANO CHIMES INSTRUMENT
          ========================================================================= */}
      <section className="relative w-full max-w-6xl mx-auto px-4 pb-16">
        <div className="rounded-4xl border-4 border-purple-200 dark:border-purple-700/60 bg-white/80 dark:bg-[#130730]/90 backdrop-blur-xl p-6 sm:p-10 shadow-2xl">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-slate-100 dark:border-purple-800/60 pb-6 mb-8">
            <div className="text-center sm:text-left">
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                <span>The Enchanted Chimes</span>
                <Sparkles className="h-5 w-5 text-amber-400 fill-amber-400" />
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-purple-300 font-bold mt-1">
                Tap the keys with your mouse/touch, or press numbers <strong>1 through 8</strong> on your keyboard!
              </p>
            </div>

            <div className="rounded-2xl bg-purple-50 dark:bg-[#1d0d47] border border-purple-200 dark:border-purple-700 px-4 py-2 text-center text-xs font-black text-purple-700 dark:text-purple-200">
              {lastPlayedNote}
            </div>
          </div>

          {/* 8 Giant Colorful Musical Chime Keys */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {CHIME_KEYS.map((chime) => {
              const isActive = activeKey === chime.note;
              return (
                <button
                  key={chime.note}
                  type="button"
                  onClick={(e) => handleTriggerNote(chime, e)}
                  className={`group relative flex flex-col justify-between items-center rounded-3xl p-4 sm:py-8 sm:px-3 border-4 ${chime.borderCol} bg-gradient-to-b ${chime.color} text-white shadow-xl transition-all duration-150 cursor-pointer select-none active:scale-95 ${
                    isActive ? 'scale-105 -translate-y-2 ring-4 ring-yellow-300 shadow-2xl' : 'hover:-translate-y-1.5'
                  }`}
                  style={{ minHeight: '190px' }}
                >
                  {/* Key Number Hint */}
                  <span className="h-6 w-6 rounded-full bg-black/25 flex items-center justify-center font-mono font-bold text-[10px] text-white/90">
                    {chime.keyNum}
                  </span>

                  {/* Main Note Label */}
                  <div className="text-center my-3">
                    <span className="block font-display font-black text-2xl sm:text-3xl drop-shadow-md">
                      {chime.name}
                    </span>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/90 block">
                      {chime.note}
                    </span>
                  </div>

                  {/* Animal Mentor & Amharic Title */}
                  <div className="w-full text-center border-t border-white/20 pt-2">
                    <span className="block text-[11px] font-black truncate">
                      {chime.animal}
                    </span>
                    <span className="text-[10px] text-yellow-200 font-extrabold block">
                      {chime.amharic}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE LIVING WONDER & SOUND PLAYGROUND (Creatures, Mystery Chest, Word Bubbles)
          ========================================================================= */}
      <div className="relative w-full border-t-4 border-slate-200/80 dark:border-purple-900/60">
        <WonderZoneSection />
      </div>

      {/* =========================================================================
          BOTTOM CALLOUT TO EXPLORE STORIES & MAGAZINES
          ========================================================================= */}
      <section className="relative w-full py-16 px-4 text-center max-w-5xl mx-auto">
        <h3 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white">
          Loved the Sounds? Bring Your Words to Life!
        </h3>
        <p className="mt-3 text-slate-600 dark:text-purple-200 max-w-xl mx-auto font-medium text-sm sm:text-base">
          Read exciting stories in the Selam Kids magazine or test your brain in the Games Arcade!
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/#magazines">
            <Button variant="outline" size="lg" className="font-black text-sm h-12 px-6 gap-2">
              <BookOpen className="h-4 w-4" />
              Explore Magazin Issues
            </Button>
          </Link>
          <Link href="/games">
            <Button variant="emerald" size="lg" className="font-black text-sm h-12 px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 gap-2">
              <Gamepad2 className="h-4 w-4" />
              Play Games Arcade
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
