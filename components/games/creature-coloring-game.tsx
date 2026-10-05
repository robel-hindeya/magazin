'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  RotateCcw,
  Download,
  Paintbrush,
  Eraser,
  Undo2,
  ArrowLeft,
  Stamp,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sounds } from '@/lib/sound';

interface ColoringTemplate {
  id: string;
  name: string;
  thumbnail: string;
  isSvg?: boolean;
}

const TEMPLATES: ColoringTemplate[] = [
  { id: 'cloudguy', name: 'Cloud Mascot', thumbnail: '/images/characters/cloud-guy.png' },
  { id: 'blank', name: 'Blank Canvas', thumbnail: '/images/characters/minion.png' },
  { id: 'owl', name: 'Astral Owl', thumbnail: '/images/animals/astral-owl.svg', isSvg: true },
  { id: 'giraffe', name: 'Star Giraffe', thumbnail: '/images/animals/star-giraffe.svg', isSvg: true },
  { id: 'po', name: 'Po Panda', thumbnail: '/images/characters/po-panda.png' },
  { id: 'toothless', name: 'Toothless', thumbnail: '/images/characters/toothless.png' },
  { id: 'pikachu', name: 'Pikachu', thumbnail: '/images/characters/pikachu.png' },
];

const COLORS = [
  { hex: '#10b981', name: 'Emerald Green' },
  { hex: '#8b5cf6', name: 'Mystic Purple' },
  { hex: '#06b6d4', name: 'Astral Cyan' },
  { hex: '#3b82f6', name: 'Ocean Blue' },
  { hex: '#ec4899', name: 'Pink Rose' },
  { hex: '#f43f5e', name: 'Coral Red' },
  { hex: '#a855f7', name: 'Neon Violet' },
  { hex: '#14b8a6', name: 'Teal Mint' },
  { hex: '#ffffff', name: 'Pure White' },
  { hex: '#0f0728', name: 'Deep Velvet' },
];

const STAMPS = ['⭐', '🐾', '💖', '⚡', '🌟', '🦄'];

interface CreatureColoringGameProps {
  onBackToArcade?: () => void;
  onOrbsEarned?: (orbs: number) => void;
}

export function CreatureColoringGame({ onBackToArcade, onOrbsEarned }: CreatureColoringGameProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [selectedTemplate, setSelectedTemplate] = React.useState<ColoringTemplate>(TEMPLATES[0]);
  const [selectedColor, setSelectedColor] = React.useState(COLORS[0].hex);
  const [brushSize, setBrushSize] = React.useState(10);
  const [isEraser, setIsEraser] = React.useState(false);
  const [activeStamp, setActiveStamp] = React.useState<string | null>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [history, setHistory] = React.useState<ImageData[]>([]);
  const [hasSavedOnce, setHasSavedOnce] = React.useState(false);

  const initCanvas = React.useCallback((template = selectedTemplate) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (template.id !== 'blank') {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = template.thumbnail;
      img.onload = () => {
        const size = Math.min(canvas.width, canvas.height) * 0.7;
        const x = (canvas.width - size) / 2;
        const y = (canvas.height - size) / 2;

        ctx.save();
        ctx.globalAlpha = 0.28;
        ctx.drawImage(img, x, y, size, size);
        ctx.restore();

        const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setHistory([initialData]);
      };
    } else {
      const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([initialData]);
    }
  }, [selectedTemplate]);

  React.useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const saveStateToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-15), snapshot]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    sounds.playPop();
    const nextHistory = history.slice(0, -1);
    const previousState = nextHistory[nextHistory.length - 1];
    if (previousState) {
      ctx.putImageData(previousState, 0, 0);
      setHistory(nextHistory);
    }
  };

  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);

    if (activeStamp) {
      sounds.playCoin();
      ctx.font = `${brushSize * 3.5}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(activeStamp, x, y);
      saveStateToHistory();
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = isEraser ? '#ffffff' : selectedColor;

    sounds.playPop();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeStamp) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.closePath();
    saveStateToHistory();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    sounds.playFanfare();

    const link = document.createElement('a');
    link.download = `selam-kids-${selectedTemplate.id}-art.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    if (!hasSavedOnce) {
      setHasSavedOnce(true);
      if (onOrbsEarned) {
        onOrbsEarned(40);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl bg-white dark:bg-[#140a33] border border-slate-200 dark:border-purple-800/50 p-4 sm:p-6 shadow-xl relative text-slate-900 dark:text-white transition-colors">
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
              Color Studio
            </h2>
            <p className="text-xs text-slate-500 dark:text-purple-300/80 font-medium">Draw, paint, and save your art</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={history.length <= 1}
            title="Undo"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-purple-900/40 text-slate-600 dark:text-purple-300 hover:text-slate-950 dark:hover:text-white disabled:opacity-30 transition-colors"
          >
            <Undo2 className="h-4 w-4" />
          </button>

          <button
            onClick={() => initCanvas(selectedTemplate)}
            title="Clear"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-purple-900/40 text-slate-600 dark:text-purple-300 hover:text-slate-950 dark:hover:text-white transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <Button
            variant="emerald"
            size="sm"
            onClick={handleDownload}
            className="text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3"
          >
            <Download className="h-3.5 w-3.5 mr-1" /> Save
          </Button>
        </div>
      </div>

      {/* Templates Bar */}
      <div className="flex items-center gap-2 my-3 overflow-x-auto pb-1 scrollbar-none">
        {TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            type="button"
            onClick={() => {
              setSelectedTemplate(tmpl);
              initCanvas(tmpl);
              sounds.playPop();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
              selectedTemplate.id === tmpl.id
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-100 dark:bg-purple-950/60 border border-slate-200 dark:border-purple-800/60 text-slate-600 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="relative w-3.5 h-3.5 shrink-0">
              <Image src={tmpl.thumbnail} alt={tmpl.name} fill sizes="14px" className="object-contain" />
            </div>
            <span>{tmpl.name}</span>
          </button>
        ))}
      </div>

      {/* Studio Arena */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-2">
        {/* Left Toolbar */}
        <div className="md:col-span-1 flex flex-col gap-3 bg-slate-50 dark:bg-purple-950/40 border border-slate-200 dark:border-purple-900/40 rounded-xl p-3">
          {/* Tool Modes */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => {
                setIsEraser(false);
                setActiveStamp(null);
                sounds.playPop();
              }}
              className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                !isEraser && !activeStamp
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-100 dark:bg-purple-900/40 text-slate-600 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Paintbrush className="h-3 w-3" /> Brush
            </button>

            <button
              type="button"
              onClick={() => {
                setIsEraser(true);
                setActiveStamp(null);
                sounds.playPop();
              }}
              className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                isEraser
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-100 dark:bg-purple-900/40 text-slate-600 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Eraser className="h-3 w-3" /> Eraser
            </button>
          </div>

          {/* Palette */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1.5">
              Colors
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {COLORS.map((col) => (
                <button
                  key={col.hex}
                  type="button"
                  onClick={() => {
                    setSelectedColor(col.hex);
                    setIsEraser(false);
                    sounds.playPop();
                  }}
                  title={col.name}
                  style={{ backgroundColor: col.hex }}
                  className={`w-6 h-6 rounded-full border transition-transform cursor-pointer flex items-center justify-center ${
                    selectedColor === col.hex && !isEraser
                      ? 'border-white scale-110 shadow-sm'
                      : 'border-purple-900/50 hover:scale-105'
                  }`}
                >
                  {selectedColor === col.hex && !isEraser && (
                    <Check
                      className={`h-3 w-3 ${
                        col.hex === '#ffffff' ? 'text-slate-950' : 'text-white'
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-purple-400 block mb-1">
              Brush Size
            </span>
            <div className="flex items-center justify-between gap-1 bg-slate-100 dark:bg-purple-900/30 p-1 rounded-lg">
              {[4, 8, 14, 22].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setBrushSize(size);
                    sounds.playPop();
                  }}
                  className={`flex-1 py-1 flex items-center justify-center rounded transition-all ${
                    brushSize === size
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-500 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div
                    className="rounded-full bg-current"
                    style={{ width: `${Math.min(14, size + 2)}px`, height: `${Math.min(14, size + 2)}px` }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Stamps */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-purple-400 block mb-1 flex items-center gap-1">
              <Stamp className="h-3 w-3 text-emerald-500" /> Stamps
            </span>
            <div className="grid grid-cols-3 gap-1">
              {STAMPS.map((stamp) => (
                <button
                  key={stamp}
                  type="button"
                  onClick={() => {
                    setActiveStamp(activeStamp === stamp ? null : stamp);
                    setIsEraser(false);
                    sounds.playPop();
                  }}
                  className={`py-1 text-sm rounded-lg transition-all cursor-pointer ${
                    activeStamp === stamp
                      ? 'bg-emerald-500 text-slate-950 scale-105'
                      : 'bg-slate-100 dark:bg-purple-900/40 hover:bg-slate-200 dark:hover:bg-purple-800'
                  }`}
                >
                  {stamp}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Canvas */}
        <div className="md:col-span-3 rounded-xl overflow-hidden border border-slate-200 dark:border-purple-800/60 bg-white flex items-center justify-center relative min-h-[360px]">
          <canvas
            ref={canvasRef}
            width={580}
            height={420}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="w-full h-full object-contain cursor-crosshair touch-none select-none"
          />

          {hasSavedOnce && (
            <div className="absolute top-2 right-2 bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
              +40 Orbs Saved
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
