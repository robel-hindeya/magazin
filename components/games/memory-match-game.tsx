'use client';

import * as React from 'react';
import Image from 'next/image';
import { RotateCcw, Trophy, Star, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sounds } from '@/lib/sound';

interface CardItem {
  id: string;
  name: string;
  image: string;
  isAnimalSvg?: boolean;
}

const ALL_CARDS: CardItem[] = [
  { id: 'cloudguy', name: 'Cloud Mascot', image: '/images/characters/cloud-guy.png' },
  { id: 'pikachu', name: 'Pikachu', image: '/images/characters/pikachu.png' },
  { id: 'toothless', name: 'Toothless', image: '/images/characters/toothless.png' },
  { id: 'stitch', name: 'Stitch', image: '/images/characters/stitch.png' },
  { id: 'minion', name: 'Minion', image: '/images/characters/minion.png' },
  { id: 'po', name: 'Po Panda', image: '/images/characters/po-panda.png' },
  { id: 'simba', name: 'Simba', image: '/images/characters/simba.png' },
  { id: 'sonic', name: 'Sonic', image: '/images/characters/sonic.png' },
  { id: 'owl', name: 'Astral Owl', image: '/images/animals/astral-owl.svg', isAnimalSvg: true },
  { id: 'giraffe', name: 'Star Giraffe', image: '/images/animals/star-giraffe.svg', isAnimalSvg: true },
  { id: 'penguin', name: 'Glow Penguin', image: '/images/animals/glow-penguin.svg', isAnimalSvg: true },
];

interface PlayCard {
  instanceId: number;
  cardId: string;
  name: string;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
  isAnimalSvg?: boolean;
}

interface MemoryMatchGameProps {
  onBackToArcade?: () => void;
  onOrbsEarned?: (orbs: number) => void;
}

export function MemoryMatchGame({ onBackToArcade, onOrbsEarned }: MemoryMatchGameProps) {
  const [difficulty, setDifficulty] = React.useState<'easy' | 'medium' | 'hard'>('medium');
  const [cards, setCards] = React.useState<PlayCard[]>([]);
  const [flippedCards, setFlippedCards] = React.useState<number[]>([]);
  const [moves, setMoves] = React.useState(0);
  const [matches, setMatches] = React.useState(0);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  const [timerActive, setTimerActive] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [rewardOrbs, setRewardOrbs] = React.useState(0);

  const pairCounts = { easy: 4, medium: 6, hard: 8 };

  const startNewGame = React.useCallback((diff = difficulty) => {
    const pairCount = pairCounts[diff];
    const shuffledPool = [...ALL_CARDS].sort(() => Math.random() - 0.5).slice(0, pairCount);
    const deck: PlayCard[] = [];

    shuffledPool.forEach((item, index) => {
      deck.push({
        instanceId: index * 2,
        cardId: item.id,
        name: item.name,
        image: item.image,
        isAnimalSvg: item.isAnimalSvg,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        instanceId: index * 2 + 1,
        cardId: item.id,
        name: item.name,
        image: item.image,
        isAnimalSvg: item.isAnimalSvg,
        isFlipped: false,
        isMatched: false,
      });
    });

    const shuffledDeck = deck.sort(() => Math.random() - 0.5);
    setCards(shuffledDeck);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setIsGameOver(false);
    setSeconds(0);
    setTimerActive(false);
    setRewardOrbs(0);
  }, [difficulty]);

  React.useEffect(() => {
    startNewGame();
    setIsMuted(sounds.isMuted());
  }, [startNewGame]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && !isGameOver) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, isGameOver]);

  const handleCardClick = (instanceId: number) => {
    if (flippedCards.length >= 2) return;

    const clickedCard = cards.find((c) => c.instanceId === instanceId);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    if (!timerActive) {
      setTimerActive(true);
    }

    sounds.playPop();

    const nextCards = cards.map((c) =>
      c.instanceId === instanceId ? { ...c, isFlipped: true } : c
    );
    setCards(nextCards);

    const nextFlipped = [...flippedCards, instanceId];
    setFlippedCards(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstId, secondId] = nextFlipped;
      const first = nextCards.find((c) => c.instanceId === firstId);
      const second = nextCards.find((c) => c.instanceId === secondId);

      if (first && second && first.cardId === second.cardId) {
        // MATCH!
        setTimeout(() => {
          sounds.playMatch();
          setCards((prev) =>
            prev.map((c) =>
              c.cardId === first.cardId ? { ...c, isMatched: true, isFlipped: true } : c
            )
          );
          setFlippedCards([]);
          const nextMatches = matches + 1;
          setMatches(nextMatches);

          const targetPairs = pairCounts[difficulty];
          if (nextMatches >= targetPairs) {
            handleVictory(nextMatches);
          }
        }, 300);
      } else {
        // NO MATCH
        setTimeout(() => {
          sounds.playHazard();
          setCards((prev) =>
            prev.map((c) =>
              c.instanceId === firstId || c.instanceId === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 800);
      }
    }
  };

  const handleVictory = (finalMatches: number) => {
    setTimerActive(false);
    setIsGameOver(true);
    sounds.playFanfare();

    const baseOrbs = difficulty === 'easy' ? 40 : difficulty === 'medium' ? 65 : 90;
    const bonus = moves <= finalMatches * 1.5 ? 25 : 10;
    const totalEarned = baseOrbs + bonus;
    setRewardOrbs(totalEarned);

    if (onOrbsEarned) {
      onOrbsEarned(totalEarned);
    }
  };

  const calculateStars = () => {
    const minMoves = pairCounts[difficulty];
    if (moves <= minMoves + 2) return 3;
    if (moves <= minMoves * 2) return 2;
    return 1;
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl bg-white dark:bg-[#140a33] border border-slate-200 dark:border-purple-800/50 p-4 sm:p-6 shadow-xl relative text-slate-900 dark:text-white transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-purple-800/40">
        <div className="flex items-center gap-3">
          {onBackToArcade && (
            <button
              onClick={onBackToArcade}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-purple-300 hover:text-slate-950 dark:hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-purple-900/40 hover:bg-slate-200 dark:hover:bg-purple-900/70 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
          )}
          <div>
            <h2 className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white">
              Memory Match
            </h2>
            <p className="text-xs text-slate-500 dark:text-purple-300/80 font-medium">Find all matching pairs</p>
          </div>
        </div>

        {/* Difficulty & Controls */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg bg-slate-100 dark:bg-purple-950/80 p-0.5 border border-slate-200 dark:border-purple-800">
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <button
                key={level}
                onClick={() => {
                  setDifficulty(level);
                  startNewGame(level);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase transition-all ${
                  difficulty === level
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              const muted = sounds.toggleMute();
              setIsMuted(muted);
            }}
            title={isMuted ? 'Unmute' : 'Mute'}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-purple-900/40 text-slate-600 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <button
            onClick={() => startNewGame()}
            title="Reset"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-purple-900/40 text-slate-600 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Minimal Stats */}
      <div className="flex items-center justify-around py-3 my-3 bg-slate-50 dark:bg-purple-950/40 rounded-xl border border-slate-200 dark:border-purple-900/30 text-xs">
        <div>
          <span className="text-slate-500 dark:text-purple-400">Moves: </span>
          <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{moves}</strong>
        </div>
        <div>
          <span className="text-slate-500 dark:text-purple-400">Pairs: </span>
          <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
            {matches} / {pairCounts[difficulty]}
          </strong>
        </div>
        <div>
          <span className="text-slate-500 dark:text-purple-400">Time: </span>
          <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{formatTime(seconds)}</strong>
        </div>
      </div>

      {/* Cards Grid */}
      <div
        className={`grid gap-2.5 sm:gap-3 my-4 transition-all ${
          difficulty === 'easy'
            ? 'grid-cols-4'
            : difficulty === 'medium'
            ? 'grid-cols-4'
            : 'grid-cols-4'
        }`}
      >
        {cards.map((card) => {
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.instanceId}
              type="button"
              onClick={() => handleCardClick(card.instanceId)}
              disabled={card.isMatched || isRevealed}
              className={`aspect-square rounded-xl relative p-2 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer select-none ${
                card.isMatched
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400 opacity-80'
                  : isRevealed
                  ? 'bg-purple-50 dark:bg-purple-900/90 border-2 border-emerald-500 scale-[1.02] shadow-md'
                  : 'bg-slate-50 dark:bg-purple-950/80 border border-slate-200 dark:border-purple-800/60 hover:border-emerald-400 hover:scale-[1.02]'
              }`}
            >
              {isRevealed ? (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 mb-1">
                    <Image
                      src={card.image}
                      alt={card.name}
                      fill
                      sizes="56px"
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-900 dark:text-purple-200 text-center truncate max-w-full px-1">
                    {card.name}
                  </span>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-purple-900/50 flex items-center justify-center text-slate-500 dark:text-purple-400 text-xs font-bold">
                  ?
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Minimal Victory Modal */}
      {isGameOver && (
        <div className="absolute inset-0 bg-white/95 dark:bg-[#0c0524]/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center z-20 animate-in fade-in duration-200 border-2 border-slate-200 dark:border-purple-700">
          <div className="w-14 h-14 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mb-3 shadow-md shadow-emerald-500/30">
            <Trophy className="h-7 w-7 fill-slate-950" />
          </div>

          <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white">All Pairs Found!</h3>
          <p className="text-slate-600 dark:text-purple-300 text-xs sm:text-sm font-medium mt-1">
            Completed in {moves} moves ({formatTime(seconds)})
          </p>

          <div className="flex items-center justify-center gap-1 my-3">
            {[1, 2, 3].map((starIndex) => (
              <Star
                key={starIndex}
                className={`h-5 w-5 ${
                  starIndex <= calculateStars()
                    ? 'text-emerald-500 fill-emerald-500'
                    : 'text-slate-200 dark:text-purple-900 fill-slate-200 dark:fill-purple-950'
                }`}
              />
            ))}
          </div>

          <div className="px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-xs border border-emerald-300 dark:border-emerald-500/30 mb-5">
            +{rewardOrbs} Orbs Earned
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="emerald"
              size="sm"
              onClick={() => startNewGame()}
              className="font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> Play Again
            </Button>
            {onBackToArcade && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBackToArcade}
                className="font-bold border-slate-300 dark:border-purple-700 text-slate-700 dark:text-purple-200 hover:bg-slate-100"
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
