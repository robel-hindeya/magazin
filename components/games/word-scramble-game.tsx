'use client';

import * as React from 'react';
import Image from 'next/image';
import { RotateCcw, Trophy, Lightbulb, Shuffle, Volume2, VolumeX, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sounds } from '@/lib/sound';

interface WordChallenge {
  word: string;
  hint: string;
  mascot: string;
  category: string;
}

const WORDS_DATABASE: WordChallenge[] = [
  {
    word: 'DRAGON',
    hint: 'A legendary winged beast flying across the realm',
    mascot: '/images/characters/toothless.png',
    category: 'Mythical',
  },
  {
    word: 'SAFARI',
    hint: 'An exciting expedition to discover wild animals',
    mascot: '/images/characters/simba.png',
    category: 'Adventures',
  },
  {
    word: 'GALAXY',
    hint: 'A giant cosmic spiral of billions of bright stars',
    mascot: '/images/characters/stitch.png',
    category: 'Space',
  },
  {
    word: 'WARRIOR',
    hint: 'A brave Kung Fu master defending peace',
    mascot: '/images/characters/po-panda.png',
    category: 'Heroes',
  },
  {
    word: 'LIGHTNING',
    hint: 'A fast electric strike traveling at high speed',
    mascot: '/images/characters/sonic.png',
    category: 'Nature',
  },
  {
    word: 'TREASURE',
    hint: 'Valuable hidden crystals, coins, and glowing gems',
    mascot: '/images/characters/pikachu.png',
    category: 'Loot',
  },
  {
    word: 'CREATURE',
    hint: 'A wondrous living animal in the enchanted world',
    mascot: '/images/animals/astral-owl.svg',
    category: 'Animals',
  },
];

interface WordScrambleGameProps {
  onBackToArcade?: () => void;
  onOrbsEarned?: (orbs: number) => void;
}

export function WordScrambleGame({ onBackToArcade, onOrbsEarned }: WordScrambleGameProps) {
  const [wordIndex, setWordIndex] = React.useState(0);
  const [scrambledLetters, setScrambledLetters] = React.useState<{ id: number; char: string; used: boolean }[]>([]);
  const [selectedLetters, setSelectedLetters] = React.useState<{ id: number; char: string }[]>([]);
  const [score, setScore] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [totalOrbs, setTotalOrbs] = React.useState(0);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isFinished, setIsFinished] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);

  const currentWordData = WORDS_DATABASE[wordIndex];

  const initWord = React.useCallback((index: number) => {
    const data = WORDS_DATABASE[index];
    if (!data) return;

    const chars = data.word.split('');
    let shuffled = [...chars].sort(() => Math.random() - 0.5);
    while (shuffled.join('') === data.word && chars.length > 2) {
      shuffled = [...chars].sort(() => Math.random() - 0.5);
    }

    setScrambledLetters(
      shuffled.map((char, idx) => ({
        id: idx,
        char,
        used: false,
      }))
    );
    setSelectedLetters([]);
    setIsSuccess(false);
  }, []);

  React.useEffect(() => {
    initWord(wordIndex);
    setIsMuted(sounds.isMuted());
  }, [wordIndex, initWord]);

  const handlePickLetter = (item: { id: number; char: string; used: boolean }) => {
    if (item.used || isSuccess) return;

    sounds.playPop();

    setScrambledLetters((prev) =>
      prev.map((l) => (l.id === item.id ? { ...l, used: true } : l))
    );

    const nextSelected = [...selectedLetters, { id: item.id, char: item.char }];
    setSelectedLetters(nextSelected);

    if (nextSelected.length === currentWordData.word.length) {
      const guessedWord = nextSelected.map((l) => l.char).join('');
      if (guessedWord === currentWordData.word) {
        // Correct
        sounds.playSuccess();
        setIsSuccess(true);
        const earned = 25 + streak * 5;
        setTotalOrbs((prev) => prev + earned);
        setScore((s) => s + 100);
        setStreak((st) => st + 1);

        if (onOrbsEarned) {
          onOrbsEarned(earned);
        }

        setTimeout(() => {
          if (wordIndex + 1 < WORDS_DATABASE.length) {
            setWordIndex((i) => i + 1);
          } else {
            setIsFinished(true);
            sounds.playFanfare();
          }
        }, 1100);
      } else {
        // Wrong
        sounds.playHazard();
        setTimeout(() => {
          setSelectedLetters([]);
          setScrambledLetters((prev) => prev.map((l) => ({ ...l, used: false })));
          setStreak(0);
        }, 600);
      }
    }
  };

  const handleRemoveLetter = (index: number) => {
    if (isSuccess) return;
    const removed = selectedLetters[index];
    if (!removed) return;

    sounds.playPop();

    setScrambledLetters((prev) =>
      prev.map((l) => (l.id === removed.id ? { ...l, used: false } : l))
    );

    setSelectedLetters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleShuffle = () => {
    sounds.playPop();
    setScrambledLetters((prev) => {
      const unused = prev.filter((l) => !l.used).sort(() => Math.random() - 0.5);
      let unusedIndex = 0;
      return prev.map((l) => {
        if (!l.used) {
          const replacement = unused[unusedIndex++];
          return { ...l, char: replacement.char };
        }
        return l;
      });
    });
  };

  const handleHint = () => {
    if (isSuccess) return;
    const nextCharIndex = selectedLetters.length;
    const targetChar = currentWordData.word[nextCharIndex];
    if (!targetChar) return;

    const candidate = scrambledLetters.find((l) => !l.used && l.char === targetChar);
    if (candidate) {
      handlePickLetter(candidate);
    }
  };

  const handleRestart = () => {
    setWordIndex(0);
    setScore(0);
    setStreak(0);
    setTotalOrbs(0);
    setIsFinished(false);
    initWord(0);
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl bg-[#140a33] border border-purple-800/50 p-4 sm:p-6 shadow-xl relative text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-purple-800/40">
        <div className="flex items-center gap-3">
          {onBackToArcade && (
            <button
              onClick={onBackToArcade}
              className="inline-flex items-center gap-1 text-xs font-bold text-purple-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-900/70 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
          )}
          <div>
            <h2 className="font-display font-black text-lg sm:text-xl text-white">
              Word Dash
            </h2>
            <p className="text-xs text-purple-300/80 font-medium">
              Word {wordIndex + 1} of {WORDS_DATABASE.length}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const muted = sounds.toggleMute();
              setIsMuted(muted);
            }}
            title={isMuted ? 'Unmute' : 'Mute'}
            className="p-1.5 rounded-lg bg-purple-900/40 text-purple-300 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <button
            onClick={handleRestart}
            title="Restart"
            className="p-1.5 rounded-lg bg-purple-900/40 text-purple-300 hover:text-white transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Minimal Stats */}
      <div className="flex items-center justify-around py-3 my-3 bg-purple-950/40 rounded-xl border border-purple-900/30 text-xs">
        <div>
          <span className="text-purple-400">Score: </span>
          <strong className="text-emerald-400 font-bold">{score}</strong>
        </div>
        <div>
          <span className="text-purple-400">Streak: </span>
          <strong className="text-emerald-400 font-bold">{streak}x</strong>
        </div>
        <div>
          <span className="text-purple-400">Orbs: </span>
          <strong className="text-emerald-400 font-bold">+{totalOrbs}</strong>
        </div>
      </div>

      {/* Hint & Mascot */}
      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-purple-950/50 border border-purple-800/40 my-3">
        <div className="relative w-12 h-12 rounded-lg bg-purple-900/50 p-1 flex items-center justify-center shrink-0">
          <Image
            src={currentWordData.mascot}
            alt="Mascot"
            fill
            sizes="48px"
            className="object-contain"
          />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            {currentWordData.category}
          </span>
          <p className="text-xs sm:text-sm text-purple-100 font-medium">
            {currentWordData.hint}
          </p>
        </div>
      </div>

      {/* Word Slots */}
      <div className="flex flex-wrap items-center justify-center gap-2 my-5 min-h-[3.5rem]">
        {Array.from({ length: currentWordData.word.length }).map((_, index) => {
          const placed = selectedLetters[index];

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleRemoveLetter(index)}
              disabled={!placed || isSuccess}
              className={`w-11 h-13 sm:w-12 sm:h-14 rounded-xl font-display font-black text-xl sm:text-2xl flex items-center justify-center transition-all ${
                isSuccess
                  ? 'bg-emerald-500 text-slate-950 scale-105 shadow-sm'
                  : placed
                  ? 'bg-purple-600 text-white border border-purple-400 cursor-pointer hover:bg-rose-500 transition-colors'
                  : 'bg-purple-950/80 border border-dashed border-purple-700 text-purple-600'
              }`}
            >
              {placed ? placed.char : ''}
            </button>
          );
        })}
      </div>

      {/* Success banner */}
      {isSuccess && (
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400 mb-3 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>Correct! +{25 + streak * 5} Orbs</span>
        </div>
      )}

      {/* Scrambled Letters Pool */}
      <div className="flex flex-wrap items-center justify-center gap-2 my-3">
        {scrambledLetters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handlePickLetter(item)}
            disabled={item.used || isSuccess}
            className={`w-11 h-12 sm:w-12 sm:h-13 rounded-xl font-display font-black text-lg sm:text-xl transition-all ${
              item.used
                ? 'opacity-20 bg-purple-950 border border-purple-900 cursor-not-allowed'
                : 'bg-purple-900/80 hover:bg-purple-700 text-white border border-purple-600 cursor-pointer active:scale-95'
            }`}
          >
            {item.char}
          </button>
        ))}
      </div>

      {/* Minimal Helper Buttons */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-purple-800/30">
        <button
          type="button"
          onClick={handleShuffle}
          disabled={isSuccess}
          className="inline-flex items-center gap-1 text-xs font-bold text-purple-300 hover:text-white px-3 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-900/70 transition-colors"
        >
          <Shuffle className="h-3.5 w-3.5" /> Shuffle
        </button>

        <button
          type="button"
          onClick={handleHint}
          disabled={isSuccess || selectedLetters.length >= currentWordData.word.length}
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 transition-colors"
        >
          <Lightbulb className="h-3.5 w-3.5" /> Hint
        </button>
      </div>

      {/* Completion Modal */}
      {isFinished && (
        <div className="absolute inset-0 bg-[#0c0524]/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center z-20 animate-in fade-in duration-200">
          <div className="w-14 h-14 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mb-3">
            <Trophy className="h-7 w-7 fill-slate-950" />
          </div>

          <h3 className="font-display font-black text-2xl text-white">Wordsmith Champion!</h3>
          <p className="text-purple-300 text-xs sm:text-sm font-medium mt-1">
            You rescued all {WORDS_DATABASE.length} words!
          </p>

          <div className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 my-4">
            +{totalOrbs} Total Orbs Earned
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="emerald"
              size="sm"
              onClick={handleRestart}
              className="font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> Play Again
            </Button>
            {onBackToArcade && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBackToArcade}
                className="font-bold border-purple-700 text-purple-200"
              >
                Back to Games
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
