'use client';

import * as React from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Gamepad2,
  Trophy,
  Play,
  Volume2,
  VolumeX,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MemoryMatchGame } from './memory-match-game';
import { WordScrambleGame } from './word-scramble-game';
import { OrbCatcherGame } from './orb-catcher-game';
import { CreatureColoringGame } from './creature-coloring-game';
import { sounds } from '@/lib/sound';

type GameId = 'word' | 'memory' | 'catcher' | 'coloring' | null;

interface GameItem {
  id: 'word' | 'memory' | 'catcher' | 'coloring';
  title: string;
  tagline: string;
  tag: string;
  tagColor: string;
  mascot: string;
}

const FOUR_GAMES: GameItem[] = [
  {
    id: 'word',
    title: 'Word Dash',
    tagline: 'Unscramble words and build vocabulary with Po',
    tag: 'Spelling',
    tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    mascot: '/images/characters/po-panda.png',
  },
  {
    id: 'memory',
    title: 'Memory Match',
    tagline: 'Flip and match character pairs with Pikachu',
    tag: 'Memory',
    tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    mascot: '/images/characters/pikachu.png',
  },
  {
    id: 'catcher',
    title: 'Orb Catcher',
    tagline: 'Catch falling starlight and dodge monsters with Toothless',
    tag: 'Reflex',
    tagColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    mascot: '/images/characters/toothless.png',
  },
  {
    id: 'coloring',
    title: 'Color Studio',
    tagline: 'Draw and color magical creatures with Minion',
    tag: 'Creative',
    tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    mascot: '/images/characters/minion.png',
  },
];

export function GamesLobby() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialGame = searchParams.get('play');
  const [activeGame, setActiveGame] = React.useState<GameId>(
    initialGame && ['word', 'memory', 'catcher', 'coloring'].includes(initialGame)
      ? (initialGame as GameId)
      : null
  );

  const [totalArcadeOrbs, setTotalArcadeOrbs] = React.useState(250);
  const [isMuted, setIsMuted] = React.useState(false);

  // Sync game from query parameter
  React.useEffect(() => {
    const gameParam = searchParams.get('play');
    if (gameParam && ['word', 'memory', 'catcher', 'coloring'].includes(gameParam)) {
      setActiveGame(gameParam as GameId);
    } else if (!gameParam) {
      setActiveGame(null);
    }
  }, [searchParams]);

  React.useEffect(() => {
    try {
      const storedOrbs = localStorage.getItem('selam-kids-arcade-orbs');
      if (storedOrbs) {
        setTotalArcadeOrbs(parseInt(storedOrbs, 10));
      }
    } catch {}
    setIsMuted(sounds.isMuted());
  }, []);

  const handleSelectGame = (gameId: GameId) => {
    sounds.playPop();
    setActiveGame(gameId);
    if (gameId) {
      router.push(`/games?play=${gameId}`, { scroll: false });
    } else {
      router.push('/games', { scroll: false });
    }
  };

  const handleEarnOrbs = (earned: number) => {
    setTotalArcadeOrbs((prev) => {
      const next = prev + earned;
      try {
        localStorage.setItem('selam-kids-arcade-orbs', next.toString());
      } catch {}
      return next;
    });
  };

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] bg-white dark:bg-[#0b051d] text-slate-900 dark:text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-5xl">
        {/* =========================================================================
            CLEAN MINIMAL HEADER
            ========================================================================= */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-200/80 dark:border-purple-900/50">
          <div className="flex items-center gap-3.5">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0">
              <Image
                src="/images/logo.png"
                alt="Selam Kids Mascot"
                fill
                sizes="64px"
                className="object-contain drop-shadow-md"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700/50">
                  <Gamepad2 className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                  Play & Learn
                </span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
                Selam <span className="text-emerald-500 dark:text-emerald-400">Games</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-purple-300/80 mt-0.5">
                Choose a game to play and earn glowing orbs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Minimal Orbs Pill */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-xs font-bold text-purple-800 dark:text-purple-200 shadow-sm">
              <Trophy className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>
                <strong className="text-emerald-600 dark:text-emerald-400">{totalArcadeOrbs}</strong> Orbs
              </span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                const muted = sounds.toggleMute();
                setIsMuted(muted);
              }}
              title={isMuted ? 'Unmute' : 'Mute'}
              className="p-2 rounded-full bg-slate-100 dark:bg-purple-950/80 border border-slate-200 dark:border-purple-800 text-slate-600 dark:text-purple-300 hover:text-emerald-500 hover:border-emerald-500/40 transition-colors"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* =========================================================================
            ACTIVE GAME CONTAINER
            ========================================================================= */}
        {activeGame ? (
          <div className="animate-in fade-in duration-200">
            {activeGame === 'word' && (
              <WordScrambleGame
                onBackToArcade={() => handleSelectGame(null)}
                onOrbsEarned={handleEarnOrbs}
              />
            )}
            {activeGame === 'memory' && (
              <MemoryMatchGame
                onBackToArcade={() => handleSelectGame(null)}
                onOrbsEarned={handleEarnOrbs}
              />
            )}
            {activeGame === 'catcher' && (
              <OrbCatcherGame
                onBackToArcade={() => handleSelectGame(null)}
                onOrbsEarned={handleEarnOrbs}
              />
            )}
            {activeGame === 'coloring' && (
              <CreatureColoringGame
                onBackToArcade={() => handleSelectGame(null)}
                onOrbsEarned={handleEarnOrbs}
              />
            )}
          </div>
        ) : (
          /* =========================================================================
              MINIMAL 4 GAMES GRID
              ========================================================================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {FOUR_GAMES.map((game) => (
              <div
                key={game.id}
                onClick={() => handleSelectGame(game.id)}
                className="group relative rounded-2xl bg-white dark:bg-[#140a33] border border-slate-200/90 dark:border-purple-800/50 hover:border-emerald-500 dark:hover:border-emerald-500/70 p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-md dark:shadow-purple-950/40 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${game.tagColor}`}
                    >
                      {game.tag}
                    </span>
                    <span className="text-xs text-purple-600 dark:text-purple-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors font-bold">
                      Play &rarr;
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-purple-50 dark:bg-purple-900/40 border border-purple-100 dark:border-purple-800/60 p-1 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Image
                        src={game.mascot}
                        alt={game.title}
                        fill
                        sizes="80px"
                        className="object-contain"
                      />
                    </div>

                    <div>
                      <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-purple-200/80 font-medium mt-1 leading-snug">
                        {game.tagline}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-100 dark:border-purple-900/40 flex items-center justify-between">
                  <span className="text-xs text-slate-400 dark:text-purple-400 font-medium">Free to play</span>
                  <Button
                    variant="emerald"
                    size="sm"
                    className="text-xs font-black px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm"
                  >
                    <Play className="h-3.5 w-3.5 mr-1 fill-slate-950" /> Play
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
