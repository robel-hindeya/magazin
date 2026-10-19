'use client';

import React, { useState } from 'react';
import {
  Music,
  Sparkles,
  Play,
  Square,
  Maximize2,
  Volume2,
  Trophy,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  EthiopianInstrument,
  ETHIOPIAN_INSTRUMENTS,
} from './ethiopian-instruments-data';
import { EthiopianInstrumentSvg } from './ethiopian-instrument-svg';
import { EthiopianInstrumentModal } from './ethiopian-instrument-modal';
import { ethiopianAudio } from './ethiopian-audio-synth';

interface EthiopianInstrumentsSectionProps {
  onEarnPoints?: (pts: number) => void;
}

export function EthiopianInstrumentsSection({
  onEarnPoints,
}: EthiopianInstrumentsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'strings' | 'percussion' | 'wind'>('all');
  const [activeModalInstrument, setActiveModalInstrument] = useState<EthiopianInstrument | null>(null);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);

  // Filter instruments based on tab
  const filteredInstruments = ETHIOPIAN_INSTRUMENTS.filter((inst) => {
    if (selectedCategory === 'all') return true;
    return inst.category === selectedCategory;
  });

  // Handle quick card audio listen
  const handleQuickListen = (inst: EthiopianInstrument, e: React.MouseEvent) => {
    e.stopPropagation();

    if (currentlyPlayingId === inst.id) {
      ethiopianAudio.stopCurrentMelody();
      setCurrentlyPlayingId(null);
    } else {
      setCurrentlyPlayingId(inst.id);
      if (onEarnPoints) onEarnPoints(25);

      ethiopianAudio.playSignatureMelody(inst.id, () => {
        setCurrentlyPlayingId((prev) => (prev === inst.id ? null : prev));
      });
    }
  };

  // Open full view modal
  const handleOpenFullView = (inst: EthiopianInstrument) => {
    ethiopianAudio.stopCurrentMelody();
    setCurrentlyPlayingId(null);
    setActiveModalInstrument(inst);
    if (onEarnPoints) onEarnPoints(15);
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Background Subtle Cultural Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Decorative Traditional Ethiopian Border Motif */}
      <div className="relative mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 dark:bg-amber-950/80 px-5 py-2 border-2 border-amber-300 dark:border-amber-600/80 shadow-md mb-4">
          <span className="text-lg">🇪🇹</span>
          <span className="font-display font-black text-xs uppercase tracking-wider text-amber-900 dark:text-amber-200">
            የኢትዮጵያ ባህላዊ የሙዚቃ መሣሪያዎች • Cultural Heritage
          </span>
          <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full">
            REAL SOUNDS
          </span>
        </div>

        <h2 className="font-display font-black text-3xl sm:text-5xl text-slate-900 dark:text-white leading-tight">
          Ethiopian Cultural{' '}
          <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-400 bg-clip-text text-transparent">
            Music Materials & Sounds
          </span>
        </h2>

        <p className="mt-3 text-slate-600 dark:text-purple-200 max-w-2xl mx-auto font-medium text-sm sm:text-base">
          Click any Ethiopian instrument to see its <strong>full craftsmanship and anatomy</strong>, and{' '}
          <strong>listen to its authentic melody sounds</strong> in traditional Ethiopian scales!
        </p>

        {/* Category Filter Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          {[
            { id: 'all', label: 'All Instruments (ሁሉም)', count: ETHIOPIAN_INSTRUMENTS.length },
            {
              id: 'strings',
              label: 'Strings / Lyres (አውታር)',
              count: ETHIOPIAN_INSTRUMENTS.filter((i) => i.category === 'strings').length,
            },
            {
              id: 'percussion',
              label: 'Drums & Rattles (ከበሮና ጽናጽል)',
              count: ETHIOPIAN_INSTRUMENTS.filter((i) => i.category === 'percussion').length,
            },
            {
              id: 'wind',
              label: 'Flutes & Horns (ንፋስ)',
              count: ETHIOPIAN_INSTRUMENTS.filter((i) => i.category === 'wind').length,
            },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as typeof selectedCategory)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-display font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                  : 'bg-white/80 dark:bg-[#150a36]/80 text-slate-700 dark:text-purple-200 border border-slate-200 dark:border-purple-800/80 hover:border-amber-400'
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded-full font-mono">
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Ethiopian Instrument Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredInstruments.map((inst) => {
          const isPlayingThis = currentlyPlayingId === inst.id;

          return (
            <div
              key={inst.id}
              onClick={() => handleOpenFullView(inst)}
              className="group relative flex flex-col justify-between rounded-4xl border-3 border-slate-200 dark:border-purple-800/60 bg-white/90 dark:bg-[#140833]/90 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-amber-400 dark:hover:border-amber-400 hover:shadow-2xl cursor-pointer overflow-hidden"
            >
              {/* Top Accent Gradient Border */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500" />

              <div>
                {/* Header with Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                    <Music className="h-3.5 w-3.5" />
                    {inst.categoryAmharic}
                  </span>

                  <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-purple-300">
                    {inst.scaleName.split(' ')[0]}
                  </span>
                </div>

                {/* Instrument Illustration Stage */}
                <div className="relative w-full h-56 flex items-center justify-center rounded-3xl bg-gradient-to-b from-slate-100 to-amber-50/50 dark:from-[#1d0d47]/60 dark:to-[#100629]/90 border border-slate-100 dark:border-purple-900/40 p-4 overflow-hidden mb-4 group-hover:scale-[1.02] transition-transform duration-300">
                  <EthiopianInstrumentSvg
                    instrumentId={inst.id}
                    className="max-h-[190px] w-auto drop-shadow-md"
                    isAnimated={isPlayingThis}
                  />

                  {/* Equalizer overlay when playing */}
                  {isPlayingThis && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full shadow-lg">
                      <span className="w-1 h-3 bg-slate-950 rounded-full animate-bounce" />
                      <span className="w-1 h-2 bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 h-3.5 bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="ml-1">Playing Sound</span>
                    </div>
                  )}
                </div>

                {/* Titles */}
                <div className="mb-2">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white">
                      {inst.name}
                    </h3>
                    <span className="font-display font-black text-xl text-amber-500 dark:text-amber-400">
                      ({inst.amharic})
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-purple-300 font-mono">
                    Pronounced: {inst.phonetic}
                  </span>
                </div>

                {/* Tagline / Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-purple-200 line-clamp-2 leading-relaxed mb-4">
                  {inst.tagline}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-purple-900/60 flex items-center gap-2">
                {/* Instant Quick Listen Button */}
                <Button
                  onClick={(e) => handleQuickListen(inst, e)}
                  size="sm"
                  className={`flex-1 font-black text-xs h-10 gap-1.5 shadow-md transition-all cursor-pointer ${
                    isPlayingThis
                      ? 'bg-rose-500 hover:bg-rose-600 text-white'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950'
                  }`}
                >
                  {isPlayingThis ? (
                    <>
                      <Square className="h-3.5 w-3.5 fill-white" />
                      <span>Stop Sound</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-slate-950" />
                      <span>Listen Sound (አዳምጥ)</span>
                    </>
                  )}
                </Button>

                {/* Full View Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenFullView(inst);
                  }}
                  variant="outline"
                  size="sm"
                  className="font-bold text-xs h-10 px-3.5 border-slate-200 dark:border-purple-700 hover:border-amber-400 gap-1.5 cursor-pointer text-slate-700 dark:text-purple-200"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Full View</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full View Modal Dialog */}
      {activeModalInstrument && (
        <EthiopianInstrumentModal
          instrument={activeModalInstrument}
          onClose={() => setActiveModalInstrument(null)}
          onSelectInstrument={(inst) => setActiveModalInstrument(inst)}
          onEarnPoints={onEarnPoints}
        />
      )}
    </section>
  );
}
