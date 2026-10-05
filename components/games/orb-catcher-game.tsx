'use client';

import * as React from 'react';
import Image from 'next/image';
import { RotateCcw, Trophy, Heart, Volume2, VolumeX, ArrowLeft, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sounds } from '@/lib/sound';

interface FallingItem {
  id: number;
  x: number;
  y: number;
  radius: number;
  speed: number;
  type: 'orb' | 'star' | 'gem' | 'grim';
  rotation: number;
}

interface OrbCatcherGameProps {
  onBackToArcade?: () => void;
  onOrbsEarned?: (orbs: number) => void;
}

export function OrbCatcherGame({ onBackToArcade, onOrbsEarned }: OrbCatcherGameProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [highScore, setHighScore] = React.useState(0);
  const [lives, setLives] = React.useState(3);
  const [combo, setCombo] = React.useState(0);
  const [isMuted, setIsMuted] = React.useState(false);

  const playerXRef = React.useRef(250);
  const playerWidth = 84;
  const playerHeight = 22;

  const gameStateRef = React.useRef({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    lives: 3,
    combo: 0,
    items: [] as FallingItem[],
    nextItemId: 1,
    lastSpawnTime: 0,
    spawnInterval: 650,
    animationFrameId: 0,
    canvasWidth: 500,
    canvasHeight: 380,
  });

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('selam-kids-orbs-highscore');
      if (saved) setHighScore(parseInt(saved, 10));
    } catch {}
    setIsMuted(sounds.isMuted());
  }, []);

  const startGame = React.useCallback(() => {
    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : 500;
    const height = canvas ? canvas.height : 380;

    playerXRef.current = width / 2;

    gameStateRef.current = {
      isPlaying: true,
      isGameOver: false,
      score: 0,
      lives: 3,
      combo: 0,
      items: [],
      nextItemId: 1,
      lastSpawnTime: performance.now(),
      spawnInterval: 650,
      animationFrameId: 0,
      canvasWidth: width,
      canvasHeight: height,
    };

    setScore(0);
    setLives(3);
    setCombo(0);
    setIsGameOver(false);
    setIsPlaying(true);
    sounds.playPop();
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStateRef.current.isPlaying) return;
      const step = 28;
      const max = gameStateRef.current.canvasWidth - playerWidth / 2;
      const min = playerWidth / 2;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        playerXRef.current = Math.max(min, playerXRef.current - step);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        playerXRef.current = Math.min(max, playerXRef.current + step);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerWidth]);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !gameStateRef.current.isPlaying) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const clientX = (e.clientX - rect.left) * scaleX;

    const min = playerWidth / 2;
    const max = canvas.width - playerWidth / 2;
    playerXRef.current = Math.min(max, Math.max(min, clientX));
  };

  React.useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const state = gameStateRef.current;
      if (!state.isPlaying || state.isGameOver) return;

      lastTime = currentTime;

      // Clean dark canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0c0522';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle background stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      for (let i = 0; i < 12; i++) {
        const sx = ((i * 47) % canvas.width);
        const sy = ((i * 31) % canvas.height);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Spawn falling items
      if (currentTime - state.lastSpawnTime > state.spawnInterval) {
        state.lastSpawnTime = currentTime;
        const rand = Math.random();
        let itemType: FallingItem['type'] = 'orb';
        if (rand < 0.22) itemType = 'grim';
        else if (rand < 0.45) itemType = 'star';
        else if (rand < 0.55) itemType = 'gem';

        const radius = itemType === 'gem' ? 12 : itemType === 'star' ? 14 : 12;
        const margin = 25;
        const x = margin + Math.random() * (canvas.width - margin * 2);
        const baseSpeed = 2.4 + (state.score / 500) * 0.8;
        const speed = baseSpeed + Math.random() * 1.5;

        state.items.push({
          id: state.nextItemId++,
          x,
          y: -20,
          radius,
          speed,
          type: itemType,
          rotation: Math.random() * Math.PI,
        });

        state.spawnInterval = Math.max(380, 650 - state.score * 0.25);
      }

      // Update and draw items
      const playerY = canvas.height - 30;
      const playerLeft = playerXRef.current - playerWidth / 2;
      const playerRight = playerXRef.current + playerWidth / 2;

      for (let i = state.items.length - 1; i >= 0; i--) {
        const item = state.items[i];
        item.y += item.speed;
        item.rotation += 0.03;

        // Collision check
        if (
          item.y + item.radius >= playerY &&
          item.y - item.radius <= playerY + playerHeight &&
          item.x >= playerLeft &&
          item.x <= playerRight
        ) {
          if (item.type === 'grim') {
            sounds.playHazard();
            state.lives -= 1;
            state.combo = 0;
            setLives(state.lives);
            setCombo(0);

            if (state.lives <= 0) {
              state.isGameOver = true;
              state.isPlaying = false;
              setIsGameOver(true);
              setIsPlaying(false);
              sounds.playHazard();

              const finalScore = state.score;
              const earnedOrbs = Math.floor(finalScore / 10);
              if (onOrbsEarned && earnedOrbs > 0) {
                onOrbsEarned(earnedOrbs);
              }

              if (finalScore > highScore) {
                setHighScore(finalScore);
                try {
                  localStorage.setItem('selam-kids-orbs-highscore', finalScore.toString());
                } catch {}
              }
              return;
            }
          } else {
            sounds.playCoin();
            const points = item.type === 'gem' ? 50 : item.type === 'star' ? 25 : 10;
            const comboBonus = state.combo * 2;
            state.score += points + comboBonus;
            state.combo += 1;
            setScore(state.score);
            setCombo(state.combo);
          }

          state.items.splice(i, 1);
          continue;
        }

        if (item.y > canvas.height + 20) {
          if (item.type !== 'grim') {
            state.combo = 0;
            setCombo(0);
          }
          state.items.splice(i, 1);
          continue;
        }

        // Draw item
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation);

        if (item.type === 'orb') {
          // Emerald Orb
          ctx.fillStyle = '#10b981';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === 'star') {
          // Cyan Star
          ctx.fillStyle = '#06b6d4';
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          for (let p = 0; p < 5; p++) {
            ctx.lineTo(
              Math.cos(((18 + p * 72) * Math.PI) / 180) * item.radius,
              -Math.sin(((18 + p * 72) * Math.PI) / 180) * item.radius
            );
            ctx.lineTo(
              Math.cos(((54 + p * 72) * Math.PI) / 180) * (item.radius * 0.5),
              -Math.sin(((54 + p * 72) * Math.PI) / 180) * (item.radius * 0.5)
            );
          }
          ctx.closePath();
          ctx.fill();
        } else if (item.type === 'gem') {
          // Purple Diamond
          ctx.fillStyle = '#a855f7';
          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(0, -item.radius);
          ctx.lineTo(item.radius, 0);
          ctx.lineTo(0, item.radius);
          ctx.lineTo(-item.radius, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          // Shadow Grim
          ctx.fillStyle = '#1f1338';
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(-4, -2, 2.5, 2.5);
          ctx.fillRect(1.5, -2, 2.5, 2.5);
        }
        ctx.restore();
      }

      // Draw Player Shield (Emerald / Purple minimal pill)
      ctx.save();
      const px = playerXRef.current;
      const py = playerY;

      ctx.fillStyle = '#10b981';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.roundRect(px - playerWidth / 2, py, playerWidth, playerHeight, 10);
      ctx.fill();

      ctx.restore();

      state.animationFrameId = requestAnimationFrame(loop);
    };

    gameStateRef.current.animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(gameStateRef.current.animationFrameId);
    };
  }, [isPlaying, highScore, onOrbsEarned, playerWidth]);

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
              Orb Catcher
            </h2>
            <p className="text-xs text-slate-500 dark:text-purple-300/80 font-medium">
              Catch green orbs & stars, dodge red monsters
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
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-purple-900/40 text-slate-600 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          {isPlaying && (
            <button
              onClick={startGame}
              title="Reset"
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-purple-900/40 text-slate-600 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Minimal Stats */}
      <div className="flex items-center justify-around py-3 my-3 bg-slate-50 dark:bg-purple-950/40 rounded-xl border border-slate-200 dark:border-purple-900/30 text-xs">
        <div>
          <span className="text-slate-500 dark:text-purple-400">Score: </span>
          <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{score}</strong>
        </div>
        <div>
          <span className="text-slate-500 dark:text-purple-400">Combo: </span>
          <strong className="text-cyan-600 dark:text-cyan-400 font-bold">{combo > 1 ? `${combo}x` : '—'}</strong>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-slate-500 dark:text-purple-400 mr-1">Lives:</span>
          {[1, 2, 3].map((heart) => (
            <Heart
              key={heart}
              className={`h-3.5 w-3.5 ${
                heart <= lives ? 'text-rose-500 fill-rose-500' : 'text-slate-200 dark:text-purple-900 fill-slate-200 dark:fill-purple-950'
              }`}
            />
          ))}
        </div>
        <div>
          <span className="text-slate-500 dark:text-purple-400">Best: </span>
          <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{highScore}</strong>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-purple-800/60 bg-[#0c0522] aspect-[5/3.5] max-h-[380px] mx-auto flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={520}
          height={380}
          onPointerMove={handlePointerMove}
          className="w-full h-full object-contain cursor-ew-resize touch-none select-none"
        />

        {/* Start Game Overlay */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-white/95 dark:bg-[#0c0524]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10 text-slate-900 dark:text-white">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-3">
              <Image
                src="/images/characters/toothless.png"
                alt="Toothless"
                fill
                sizes="80px"
                className="object-contain"
              />
            </div>

            <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
              Ready to Catch?
            </h3>
            <p className="mt-1 text-slate-600 dark:text-purple-300 text-xs font-medium max-w-xs">
              Use keyboard arrows or slide your mouse/finger to steer the green shield.
            </p>

            <Button
              variant="emerald"
              size="sm"
              onClick={startGame}
              className="mt-4 font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6"
            >
              <Play className="h-3.5 w-3.5 mr-1 fill-slate-950" /> Start Game
            </Button>
          </div>
        )}

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-white/95 dark:bg-[#0c0524]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20 animate-in fade-in duration-200 border-2 border-slate-200 dark:border-purple-700 text-slate-900 dark:text-white">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mb-2 shadow-md shadow-emerald-500/30">
              <Trophy className="h-6 w-6 fill-slate-950" />
            </div>

            <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white">Run Complete!</h3>
            <p className="text-slate-600 dark:text-purple-300 text-xs font-medium mt-1">Final Score: {score}</p>

            <div className="px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-xs border border-emerald-300 dark:border-emerald-500/30 my-3">
              +{Math.floor(score / 10)} Orbs Earned
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="emerald"
                size="sm"
                onClick={startGame}
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

      {/* Mobile Touch controls */}
      {isPlaying && (
        <div className="flex sm:hidden items-center justify-between gap-3 mt-3">
          <button
            type="button"
            onPointerDown={() => {
              playerXRef.current = Math.max(playerWidth / 2, playerXRef.current - 45);
            }}
            className="flex-1 py-2.5 bg-purple-900/60 rounded-xl font-bold text-emerald-400 text-sm border border-purple-700 active:scale-95 text-center"
          >
            ◀ Left
          </button>
          <button
            type="button"
            onPointerDown={() => {
              playerXRef.current = Math.min(
                gameStateRef.current.canvasWidth - playerWidth / 2,
                playerXRef.current + 45
              );
            }}
            className="flex-1 py-2.5 bg-purple-900/60 rounded-xl font-bold text-emerald-400 text-sm border border-purple-700 active:scale-95 text-center"
          >
            Right ▶
          </button>
        </div>
      )}
    </div>
  );
}
