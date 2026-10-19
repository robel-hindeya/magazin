'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Info,
  Layers,
  BookOpen,
  Music,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EthiopianInstrument, ETHIOPIAN_INSTRUMENTS } from './ethiopian-instruments-data';
import { EthiopianInstrumentSvg } from './ethiopian-instrument-svg';
import { ethiopianAudio } from './ethiopian-audio-synth';

interface EthiopianInstrumentModalProps {
  instrument: EthiopianInstrument | null;
  onClose: () => void;
  onSelectInstrument: (inst: EthiopianInstrument) => void;
  onEarnPoints?: (pts: number) => void;
}

export function EthiopianInstrumentModal({
  instrument,
  onClose,
  onSelectInstrument,
  onEarnPoints,
}: EthiopianInstrumentModalProps) {
  const [activeTab, setActiveTab] = useState<'studio' | 'anatomy' | 'materials' | 'story'>('studio');
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);
  const [activeNoteIdx, setActiveNoteIdx] = useState<number | null>(null);
  const [activePart, setActivePart] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [lastActionText, setLastActionText] = useState<string>('Click any string, drum head, or play button to hear sound!');

  // Reset state when instrument changes
  useEffect(() => {
    ethiopianAudio.stopCurrentMelody();
    setIsPlayingMelody(false);
    setActiveNoteIdx(null);
    setActivePart(null);
    if (instrument) {
      setLastActionText(`Ready to explore ${instrument.name} (${instrument.amharic})!`);
    }
  }, [instrument]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      ethiopianAudio.stopCurrentMelody();
    };
  }, []);

  // Sync note triggers from audio engine to highlight SVG
  useEffect(() => {
    ethiopianAudio.setOnNoteTrigger((idx) => {
      setActiveNoteIdx(idx >= 0 ? idx : null);
    });
    return () => {
      ethiopianAudio.setOnNoteTrigger(null);
    };
  }, []);

  // Handle single note/hit trigger
  const handlePlayNote = useCallback(
    (noteIdx: number) => {
      if (!instrument) return;
      setActiveNoteIdx(noteIdx);
      if (onEarnPoints) onEarnPoints(10);

      const note = instrument.notes[noteIdx];
      if (note) {
        setLastActionText(`Played ${note.name} (${note.label}) • +10 Melody Points!`);
      }

      if (instrument.id === 'krar') {
        ethiopianAudio.playKrarString(note?.freq || 261.63, 1.5);
      } else if (instrument.id === 'masenqo') {
        ethiopianAudio.playMasenqoNote(note?.freq || 293.66, 1.2, -20);
      } else if (instrument.id === 'kebero') {
        const type = noteIdx === 0 || noteIdx === 1 ? 'bass' : noteIdx === 2 ? 'slap' : 'rim';
        ethiopianAudio.playKeberoDrum(type);
      } else if (instrument.id === 'washint') {
        ethiopianAudio.playWashintFlute(note?.freq || 329.63, 1.4);
      } else if (instrument.id === 'begena') {
        ethiopianAudio.playBegenaString(note?.freq || 87.31, 2.2);
      } else if (instrument.id === 'tsenatsil') {
        ethiopianAudio.playTsenatsilShake(1.0 + noteIdx * 0.2);
      } else if (instrument.id === 'embilta') {
        ethiopianAudio.playEmbiltaHorn(note?.freq || 247.5, 0.9);
      }

      setTimeout(() => {
        setActiveNoteIdx(null);
      }, 400);
    },
    [instrument, onEarnPoints]
  );

  // Play full pre-composed signature melody
  const handleToggleSignatureMelody = () => {
    if (!instrument) return;
    if (isPlayingMelody) {
      ethiopianAudio.stopCurrentMelody();
      setIsPlayingMelody(false);
      setActiveNoteIdx(null);
      setLastActionText('Melody stopped.');
    } else {
      setIsPlayingMelody(true);
      setLastActionText(`Playing ${instrument.audioMelodyTitle}... Listen to the authentic sound!`);
      if (onEarnPoints) onEarnPoints(30);

      ethiopianAudio.playSignatureMelody(instrument.id, () => {
        setIsPlayingMelody(false);
        setActiveNoteIdx(null);
        setLastActionText(`Finished ${instrument.name} melody!`);
      });
    }
  };

  // Keyboard navigation / triggers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!instrument) return;
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= instrument.notes.length) {
        handlePlayNote(num - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [instrument, handlePlayNote, onClose]);

  if (!instrument) return null;

  // Previous & Next navigation
  const currentIndex = ETHIOPIAN_INSTRUMENTS.findIndex((item) => item.id === instrument.id);
  const prevInstrument =
    ETHIOPIAN_INSTRUMENTS[(currentIndex - 1 + ETHIOPIAN_INSTRUMENTS.length) % ETHIOPIAN_INSTRUMENTS.length];
  const nextInstrument = ETHIOPIAN_INSTRUMENTS[(currentIndex + 1) % ETHIOPIAN_INSTRUMENTS.length];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="instrument-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Modal Container */}
      <div
        className={`relative w-full max-w-5xl my-auto rounded-3xl sm:rounded-4xl border-3 ${instrument.borderColor} bg-slate-900/95 text-white shadow-2xl overflow-hidden backdrop-blur-xl border border-white/10`}
      >
        {/* Top Header Bar with Ethiopian Cultural Ribbon */}
        <div className="h-2 w-full bg-gradient-to-r from-red-600 via-amber-400 to-emerald-600" />

        <div className="relative p-5 sm:p-7 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">🇪🇹</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="instrument-modal-title" className="font-display font-black text-2xl sm:text-3xl text-white">
                  {instrument.name}{' '}
                  <span className="text-amber-400 font-extrabold text-2xl sm:text-3xl">({instrument.amharic})</span>
                </h2>
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold px-2 py-0.5 rounded-full">
                  {instrument.phonetic}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-200/90 font-medium">{instrument.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Mute Button */}
            <button
              onClick={() => {
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                ethiopianAudio.setMuted(nextMute);
                if (nextMute) setIsPlayingMelody(false);
              }}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white/90 border border-white/10 transition cursor-pointer"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="h-5 w-5 text-rose-400" /> : <Volume2 className="h-5 w-5 text-emerald-400" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                ethiopianAudio.stopCurrentMelody();
                onClose();
              }}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-rose-500/20 hover:border-rose-500/50 text-white/90 border border-white/10 transition cursor-pointer"
              title="Close Full View"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-slate-950/40 px-5 overflow-x-auto no-scrollbar gap-2">
          {[
            { id: 'studio', label: 'Interactive Studio & Sounds', icon: <Music className="h-4 w-4" /> },
            { id: 'anatomy', label: 'Parts & Anatomy (ክፍሎች)', icon: <Layers className="h-4 w-4" /> },
            { id: 'materials', label: 'Materials & Craft (ቁሳቁስ)', icon: <Info className="h-4 w-4" /> },
            { id: 'story', label: 'Heritage Story (ታሪክ)', icon: <BookOpen className="h-4 w-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 font-display font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-amber-400 text-amber-300 bg-white/5'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Main Content Body */}
        <div className="p-5 sm:p-7 max-h-[calc(85vh-12rem)] overflow-y-auto">
          {/* ================================================================= */}
          {/* TAB 1: INTERACTIVE SOUND STUDIO (Main User Request) */}
          {/* ================================================================= */}
          {activeTab === 'studio' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Visual Vector Instrument Stage */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center rounded-3xl bg-slate-950/70 border border-white/10 p-6 relative overflow-hidden">
                {/* Visual Pulsing Glow in background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${instrument.accentColor} opacity-10 blur-2xl pointer-events-none`}
                />

                {/* Live SVG Instrument */}
                <div className="relative z-10 w-full flex items-center justify-center py-2">
                  <EthiopianInstrumentSvg
                    instrumentId={instrument.id}
                    activeNoteIndex={activeNoteIdx}
                    className="w-full max-h-[300px] sm:max-h-[340px]"
                  />
                </div>

                {/* Active feedback banner */}
                <div className="mt-3 w-full py-2 px-3 rounded-xl bg-white/10 text-center font-display font-bold text-xs text-amber-200 border border-amber-500/30 truncate">
                  {lastActionText}
                </div>
              </div>

              {/* Right Column: Audio Controls & Playable Keys */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                {/* PRIMARY AUDIO ACTION: Listen to Ethiopian Instrument Melody */}
                <div className="rounded-3xl bg-gradient-to-br from-purple-950/70 to-slate-900 border-2 border-amber-500/40 p-5 shadow-xl">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-400 fill-amber-400 animate-pulse" />
                      <span className="font-display font-black text-sm uppercase tracking-wider text-amber-300">
                        Authentic Melody Sound
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-purple-300 bg-purple-900/60 px-2.5 py-0.5 rounded-full border border-purple-700/60">
                      {instrument.scaleName}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-lg text-white mb-1">{instrument.audioMelodyTitle}</h3>
                  <p className="text-xs text-purple-200/80 mb-4">{instrument.audioMelodyDesc}</p>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      onClick={handleToggleSignatureMelody}
                      size="lg"
                      className={`font-black text-sm h-12 px-6 gap-2 shadow-lg transition-all cursor-pointer ${
                        isPlayingMelody
                          ? 'bg-rose-500 hover:bg-rose-600 text-white'
                          : 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-amber-500/25'
                      }`}
                    >
                      {isPlayingMelody ? (
                        <>
                          <Square className="h-4 w-4 fill-white" />
                          <span>Stop Melody</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 fill-slate-950" />
                          <span>▶ Listen to {instrument.name} Sound!</span>
                        </>
                      )}
                    </Button>

                    {/* Equalizer animation when playing */}
                    {isPlayingMelody && (
                      <div className="flex items-center gap-1 h-8 px-3 rounded-xl bg-amber-400/10 border border-amber-400/30">
                        <span className="w-1.5 h-6 bg-amber-400 rounded-full animate-bounce" />
                        <span
                          className="w-1.5 h-4 bg-amber-400 rounded-full animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        />
                        <span
                          className="w-1.5 h-7 bg-amber-400 rounded-full animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        />
                        <span
                          className="w-1.5 h-5 bg-amber-400 rounded-full animate-bounce"
                          style={{ animationDelay: '450ms' }}
                        />
                        <span className="text-[10px] font-mono font-bold text-amber-300 ml-2">Playing...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* PLAYABLE STRINGS / DRUM HEADS / FLUTE HOLES */}
                <div className="rounded-3xl bg-slate-950/60 border border-white/10 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-display font-black text-sm text-white flex items-center gap-2">
                      <span>Interactive Playable Notes</span>
                      <span className="text-[10px] font-mono text-purple-300 bg-white/10 px-2 py-0.5 rounded-full">
                        Press 1 - {instrument.notes.length} on keyboard
                      </span>
                    </h4>
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <Trophy className="h-3.5 w-3.5" /> +10 Pts / tap
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {instrument.notes.map((note, idx) => {
                      const isActive = activeNoteIdx === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handlePlayNote(idx)}
                          className={`relative flex flex-col justify-between p-3 rounded-2xl border-2 transition-all duration-150 text-left select-none cursor-pointer ${
                            isActive
                              ? 'scale-105 border-amber-400 bg-amber-500/30 ring-2 ring-amber-300 shadow-lg'
                              : 'border-white/10 bg-white/5 hover:border-amber-400/50 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-black h-5 w-5 rounded-full bg-black/40 flex items-center justify-center text-amber-300">
                              {idx + 1}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">{note.note}</span>
                          </div>

                          <div className="my-2">
                            <span className="font-display font-black text-base sm:text-lg text-white block">
                              {note.name}
                            </span>
                            <span className="text-[11px] text-purple-200/90 font-medium block truncate">
                              {note.label}
                            </span>
                          </div>

                          <div className="text-[10px] font-mono text-amber-400/80 font-bold">
                            {Math.round(note.freq)} Hz
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: CRAFTSMANSHIP & ANATOMY */}
          {/* ================================================================= */}
          {activeTab === 'anatomy' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="flex flex-col items-center justify-center rounded-3xl bg-slate-950/70 border border-white/10 p-6">
                <EthiopianInstrumentSvg
                  instrumentId={instrument.id}
                  className="w-full max-h-[300px]"
                  isAnimated={false}
                />
                <p className="text-xs text-purple-300 font-bold mt-4 text-center">
                  Anatomy of the traditional {instrument.name} ({instrument.amharic})
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="font-display font-black text-lg text-amber-300 mb-1">
                  Traditional Parts & Craftsmanship
                </h4>
                <div className="space-y-3">
                  {instrument.parts.map((part, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActivePart(part.name)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        activePart === part.name
                          ? 'border-amber-400 bg-amber-500/20'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-display font-black text-sm text-white">{part.name}</span>
                        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                          {part.amharic}
                        </span>
                      </div>
                      <p className="text-xs text-purple-200/80 leading-relaxed">{part.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: TRADITIONAL MATERIALS */}
          {/* ================================================================= */}
          {activeTab === 'materials' && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-slate-950/70 border border-white/10 p-6">
                <h4 className="font-display font-black text-lg text-amber-300 mb-2">
                  Traditional Natural Materials Used
                </h4>
                <p className="text-xs sm:text-sm text-purple-200/90 mb-5 leading-relaxed">
                  Ethiopian master instrument makers (ባህላዊ የሙዚቃ መሣሪያ አበጅዎች) use natural resources harvested sustainably from
                  the Ethiopian highlands and river valleys:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {instrument.traditionalMaterials.map((mat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10"
                    >
                      <span className="text-amber-400 font-bold text-lg leading-none">❖</span>
                      <span className="text-xs sm:text-sm text-white font-medium">{mat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-slate-950/70 border border-white/10 p-6">
                <h4 className="font-display font-black text-lg text-amber-300 mb-2">How It Is Played</h4>
                <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">{instrument.howItIsPlayed}</p>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: HERITAGE STORY & FUN FACTS */}
          {/* ================================================================= */}
          {activeTab === 'story' && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-slate-950/70 border border-white/10 p-6">
                <h4 className="font-display font-black text-lg text-amber-300 mb-2">Historical & Cultural Heritage</h4>
                <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed mb-4">
                  {instrument.heritageStory}
                </p>
                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-700/50">
                  <span className="text-xs font-black uppercase text-amber-400 block mb-1">
                    Musical Scale / Tuning:
                  </span>
                  <p className="text-xs text-purple-200">{instrument.scaleName}</p>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-950/70 border border-white/10 p-6">
                <h4 className="font-display font-black text-lg text-amber-300 mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <span>Fun Trivia for Young Musicians</span>
                </h4>
                <div className="space-y-3">
                  {instrument.funFacts.map((fact, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-lg">⭐</span>
                      <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed">{fact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar with Prev/Next Instrument Browsing */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-950/80 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectInstrument(prevInstrument)}
            className="border-white/20 text-white hover:bg-white/10 gap-1.5 cursor-pointer text-xs"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Prev:</span> {prevInstrument.name} ({prevInstrument.amharic})
          </Button>

          <span className="text-xs font-mono font-bold text-slate-400">
            {currentIndex + 1} of {ETHIOPIAN_INSTRUMENTS.length} Instruments
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectInstrument(nextInstrument)}
            className="border-white/20 text-white hover:bg-white/10 gap-1.5 cursor-pointer text-xs"
          >
            <span className="hidden sm:inline">Next:</span> {nextInstrument.name} ({nextInstrument.amharic})
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
