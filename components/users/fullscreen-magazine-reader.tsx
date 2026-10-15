'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Maximize,
  Lock,
  Unlock,
  KeyRound,
  ArrowLeft,
  Trophy,
  BookOpen,
  X,
  HelpCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MagazineIssue } from './magazine-data';

interface FullscreenMagazineReaderProps {
  magazine: MagazineIssue;
  initialOrbs?: number;
}

export function FullscreenMagazineReader({
  magazine,
  initialOrbs = 75,
}: FullscreenMagazineReaderProps) {
  const router = useRouter();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // Magazine pages & navigation
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(21);
  const [isLoadingPdf, setIsLoadingPdf] = React.useState<boolean>(true);
  const [isRenderingPage, setIsRenderingPage] = React.useState<boolean>(false);
  const [pdfDoc, setPdfDoc] = React.useState<any>(null);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  // Rewards state
  const [orbs, setOrbs] = React.useState<number>(initialOrbs);
  const [orbsClaimed, setOrbsClaimed] = React.useState<boolean>(false);

  // Fullscreen & Passcode state
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false);
  const [passcodeModalOpen, setPasscodeModalOpen] = React.useState<boolean>(false);
  const [exitPasscodeModalOpen, setExitPasscodeModalOpen] = React.useState<boolean>(false);
  const [enteredPasscode, setEnteredPasscode] = React.useState<string>('');
  const [secretPasscode, setSecretPasscode] = React.useState<string>('1234');
  const [passcodeError, setPasscodeError] = React.useState<string | null>(null);
  const [showHint, setShowHint] = React.useState<boolean>(false);
  const [celebrationMessage, setCelebrationMessage] = React.useState<string | null>(null);

  const pdfUrl = magazine.pdfUrl || '/magazines/selam-kids-magazine-issue-1.pdf';

  // Sound effects
  const playSound = (type: 'flip' | 'unlock' | 'error' | 'win') => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'flip') {
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'unlock' || type === 'win') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.1);
        osc.frequency.setValueAtTime(659.25, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(180, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch {
      // Audio not supported
    }
  };

  // Helper to safely load /pdf.min.js in the browser without Webpack bundling canvas issues
  const loadBrowserPdfJs = React.useCallback((): Promise<any> => {
    if (typeof window === 'undefined') return Promise.reject(new Error('Window not available'));
    if ((window as any).pdfjsLib) {
      return Promise.resolve((window as any).pdfjsLib);
    }
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-pdfjs="true"]') as HTMLScriptElement | null;
      if (existing) {
        if ((window as any).pdfjsLib) {
          return resolve((window as any).pdfjsLib);
        }
        existing.addEventListener('load', () => resolve((window as any).pdfjsLib));
        existing.addEventListener('error', () => reject(new Error('Failed to load pdf.min.js')));
        return;
      }
      const script = document.createElement('script');
      script.src = '/pdf.min.js';
      script.async = true;
      script.setAttribute('data-pdfjs', 'true');
      script.onload = () => {
        const lib = (window as any).pdfjsLib;
        if (lib) {
          lib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
          resolve(lib);
        } else {
          reject(new Error('pdfjsLib is not on window'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load pdf.min.js'));
      document.head.appendChild(script);
    });
  }, []);

  // Load PDF.js Document once on mount
  React.useEffect(() => {
    let isMounted = true;
    async function initPdf() {
      setIsLoadingPdf(true);
      setLoadError(null);
      try {
        const pdfjsLib = await loadBrowserPdfJs();
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const doc = await loadingTask.promise;
        if (!isMounted) return;

        setPdfDoc(doc);
        setTotalPages(doc.numPages || 21);
        setIsLoadingPdf(false);
      } catch (err: any) {
        console.error('Failed to load PDF in reader:', err);
        if (isMounted) {
          setLoadError('Failed to load PDF directly. You can view via fallback embed.');
          setIsLoadingPdf(false);
        }
      }
    }

    initPdf();
    return () => {
      isMounted = false;
    };
  }, [pdfUrl, loadBrowserPdfJs]);

  // Render current page onto <canvas>
  React.useEffect(() => {
    if (!pdfDoc) return;
    let renderTask: any = null;
    let isCancelled = false;

    async function renderPage() {
      setIsRenderingPage(true);
      try {
        const page = await pdfDoc.getPage(currentPage);
        if (isCancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        // Render at high resolution (2x or DPR) for razor-sharp text and graphics
        const dpr = typeof window !== 'undefined' ? Math.max(window.devicePixelRatio || 1, 2) : 2;
        const scale = dpr;
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Page render error:', err);
        }
      } finally {
        if (!isCancelled) {
          setIsRenderingPage(false);
        }
      }
    }

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTask) {
        try {
          renderTask.cancel();
        } catch {
          // ignore
        }
      }
    };
  }, [pdfDoc, currentPage]);

  // Keyboard navigation (Arrow keys)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (passcodeModalOpen || exitPasscodeModalOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, passcodeModalOpen, exitPasscodeModalOpen]);

  // Fullscreen change listener
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen && !exitPasscodeModalOpen) {
        setExitPasscodeModalOpen(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isFullscreen, exitPasscodeModalOpen]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      playSound('flip');
      setCurrentPage((prev) => prev + 1);
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      playSound('flip');
      setCurrentPage((prev) => prev - 1);
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Fullscreen flow
  const handleStartFullscreenFlow = () => {
    setEnteredPasscode('');
    setPasscodeError(null);
    setShowHint(false);
    setPasscodeModalOpen(true);
  };

  const handleConfirmSetPasscode = () => {
    const code = enteredPasscode.trim() || '1234';
    setSecretPasscode(code);
    setPasscodeModalOpen(false);
    setIsFullscreen(true);
    playSound('unlock');

    try {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
    } catch {
      // Fallback
    }

    setCelebrationMessage(`✨ Fullscreen Mode Locked! Code: "${code}"`);
    setTimeout(() => setCelebrationMessage(null), 3500);
  };

  const handleRequestExit = () => {
    setEnteredPasscode('');
    setPasscodeError(null);
    setShowHint(false);
    setExitPasscodeModalOpen(true);
  };

  const handleVerifyExitPasscode = () => {
    if (enteredPasscode.trim().toLowerCase() === secretPasscode.trim().toLowerCase()) {
      playSound('unlock');
      setCelebrationMessage('🎉 Passcode Accepted! Returning to Magazines Lounge...');

      setTimeout(() => {
        if (document.fullscreenElement) {
          try {
            document.exitFullscreen().catch(() => {});
          } catch {
            // Safe fallback
          }
        }
        setIsFullscreen(false);
        setExitPasscodeModalOpen(false);
        router.push('/users/kids');
      }, 900);
    } else {
      playSound('error');
      setPasscodeError(`Incorrect code! Check your secret code.`);
    }
  };

  const handleKeypadPress = (val: string) => {
    if (val === 'back') {
      setEnteredPasscode((prev) => prev.slice(0, -1));
    } else if (val === 'clear') {
      setEnteredPasscode('');
    } else {
      if (enteredPasscode.length < 8) {
        setEnteredPasscode((prev) => prev + val);
      }
    }
    setPasscodeError(null);
  };

  const handleClaimReward = () => {
    if (orbsClaimed) return;
    playSound('win');
    setOrbsClaimed(true);
    const nextOrbs = orbs + 50;
    setOrbs(nextOrbs);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('selam-kids-points-updated', {
          detail: { points: nextOrbs, delta: 50 },
        })
      );
    }
    setCelebrationMessage('🌟 +50 Glowing Points Added to Your Vault!');
    setTimeout(() => setCelebrationMessage(null), 4000);
  };

  return (
    <div
      ref={containerRef}
      className={`transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-[9999] w-screen h-screen bg-[#0a0418] flex flex-col justify-between text-white p-2 sm:p-4 select-none'
          : 'relative space-y-3 max-w-[1400px] w-full mx-auto select-none px-2 sm:px-4'
      }`}
    >
      {/* =========================================================================
          TOP ACTION BAR: Breadcrumbs, Title, 100% Size Controls & Fullscreen
          ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-gradient-to-r dark:from-purple-950 dark:via-[#1c0e44] dark:to-purple-950 p-3 sm:p-4 rounded-3xl border-2 border-slate-200 dark:border-purple-700/60 shadow-sm dark:shadow-xl text-slate-900 dark:text-white transition-colors">
        {/* Left: Back / Lock Status */}
        <div className="flex items-center gap-3">
          {!isFullscreen ? (
            <Link
              href="/users/kids"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-white bg-emerald-50 dark:bg-purple-900/80 hover:bg-emerald-100 px-3.5 py-2 rounded-2xl border border-emerald-200 dark:border-purple-700 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Magazines</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2 bg-amber-400 text-slate-950 px-3 py-1.5 rounded-full text-xs font-black shadow-md">
              <Lock className="h-3.5 w-3.5" />
              <span>FULLSCREEN LOCKED (Code: {secretPasscode})</span>
            </div>
          )}

          <div>
            <h2 className="font-display font-black text-slate-900 dark:text-white text-sm sm:text-base leading-tight">
              Issue #{magazine.issueNumber}: {magazine.title}
            </h2>
          </div>
        </div>

        {/* Right: Fullscreen Mode */}
        <div className="flex items-center gap-2">
          {/* Fullscreen Button */}
          {!isFullscreen ? (
            <button
              onClick={handleStartFullscreenFlow}
              title="Click this icon to change to Full Screen Reading Mode!"
              className="group btn-3d relative flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 px-4 py-2 text-slate-950 font-display font-black text-xs sm:text-sm shadow-xl shadow-amber-400/40 border-2 border-yellow-100 hover:scale-105 active:scale-95 transition-all"
            >
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500" />
              </span>
              <Maximize className="h-4 w-4 text-slate-950 group-hover:rotate-45 transition-transform duration-200" />
              <span className="hidden sm:inline">FULL SCREEN</span>
            </button>
          ) : (
            <button
              onClick={handleRequestExit}
              className="btn-3d flex items-center gap-2 rounded-2xl bg-rose-600 hover:bg-rose-500 border-2 border-rose-300 px-4 py-2 text-white font-display font-black text-xs shadow-xl transition-all active:scale-95 animate-pulse"
            >
              <KeyRound className="h-4 w-4" />
              <span>Exit (Passcode)</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Celebration Banner */}
      {celebrationMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[10001] bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-display font-black text-sm sm:text-base px-6 py-3 rounded-full shadow-2xl border-2 border-emerald-300 animate-in zoom-in-95 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-300" />
          <span>{celebrationMessage}</span>
        </div>
      )}

      {/* =========================================================================
          MAGAZINE READER STAGE: Exactly 1 Page Visible, Uncropped & Centered
          ========================================================================= */}
      <div
        className={`relative flex-1 rounded-4xl bg-gradient-to-b from-[#160a3a] via-[#10062a] to-[#080318] border-4 border-amber-400/80 p-2 sm:p-4 shadow-2xl flex flex-col justify-between overflow-hidden transition-all ${
          isFullscreen ? 'h-[calc(100vh-130px)] min-h-[550px]' : 'min-h-[86vh] sm:min-h-[88vh]'
        }`}
      >
        {/* Star backdrop */}
        <div className="absolute inset-0 stars-pattern opacity-20 pointer-events-none rounded-4xl" />

        {/* Stage Top Bar: Page counter badge, Pop out link, Claim Points */}
        <div className="relative z-20 flex items-center justify-between px-2 sm:px-4 py-1 text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="emerald" className="font-display font-black text-xs px-3 py-1 shadow-md">
              PAGE {currentPage} OF {totalPages}
            </Badge>
            <span className="text-[11px] text-purple-300 font-bold hidden sm:inline">
              ✦ Use Next Page or Arrow Keys to Turn Pages
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleClaimReward}
              disabled={orbsClaimed}
              size="sm"
              className={`gap-1.5 font-display font-black text-xs px-3 py-1.5 rounded-xl transition-all ${
                orbsClaimed
                  ? 'bg-emerald-600/90 border border-emerald-400 text-slate-950 cursor-default opacity-90'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border border-emerald-300 shadow-emerald-500/30 active:scale-95'
              }`}
            >
              <Trophy className="h-3.5 w-3.5 fill-slate-950 text-slate-950" />
              {orbsClaimed ? '✓ Claimed' : 'Claim +50 Points'}
            </Button>
          </div>
        </div>


        {/* Central Display Area: ONE PAGE ALONE, SCROLL UP AND DOWN, NEVER CROPPED */}
        <div
          ref={scrollContainerRef}
          className="relative z-10 flex-1 w-full overflow-y-auto overflow-x-hidden my-auto p-2 sm:p-4 min-h-[60vh] max-h-[78vh] sm:max-h-[82vh]"
        >
          {loadError && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/80 rounded-3xl p-6 text-center space-y-3">
              <p className="font-display font-bold text-sm text-amber-300">{loadError}</p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d btn-3d-yellow px-5 py-2.5 rounded-2xl text-xs font-black text-slate-950"
              >
                Open Magazine in New Tab
              </a>
            </div>
          )}

          {/* Loading state */}
          {(isLoadingPdf || isRenderingPage) && (
            <div className="sticky top-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-xs rounded-3xl p-6 max-w-xs mx-auto space-y-3 shadow-2xl">
              <Loader2 className="h-10 w-10 text-amber-400 animate-spin" />
              <p className="font-display font-bold text-xs text-amber-200">
                {isLoadingPdf ? 'Opening Selam Kids Magazine...' : `Loading Page ${currentPage}...`}
              </p>
            </div>
          )}

          {/* The Page Canvas (Zero crop, scrolls up and down from top to bottom) */}
          <div className="w-full flex flex-col items-center justify-start min-h-full py-2">
            <canvas
              ref={canvasRef}
              className={`w-full max-w-[760px] md:max-w-[840px] h-auto object-contain rounded-2xl bg-white shadow-[0_25px_60px_rgba(0,0,0,0.9)] border-2 border-yellow-200/50 transition-opacity duration-200 ${
                isRenderingPage ? 'opacity-70' : 'opacity-100'
              }`}
            />
          </div>
        </div>


        {/* =========================================================================
            BOTTOM NAVIGATION BAR: Big Next Page button, scrubber & indicators
            ========================================================================= */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-3 sm:px-6 py-2.5 bg-slate-950/80 border-2 border-purple-800/80 rounded-3xl backdrop-blur-md mt-2">
          {/* Previous Page Button */}
          <Button
            onClick={handlePrev}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="btn-3d rounded-2xl font-display font-black text-xs px-4 py-2 text-slate-200 border-purple-600 hover:border-amber-400 hover:text-white disabled:opacity-30"
          >
            <span>Previous Page</span>
          </Button>

          {/* Middle: Page Scrubber / Quick Page Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-200">
              Page <span className="text-amber-400 font-black">{currentPage}</span> of {totalPages}
            </span>

            {/* Quick jump input slider for 21 pages */}
            <input
              type="range"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) {
                  playSound('flip');
                  setCurrentPage(val);
                }
              }}
              className="w-24 sm:w-40 h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
              title="Drag to jump to any page"
            />
          </div>

          {/* Next Page Button */}
          <Button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="btn-3d btn-3d-yellow rounded-2xl font-display font-black text-xs px-5 py-2 text-slate-950 disabled:opacity-30"
          >
            <span>Next Page</span>
          </Button>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: ADD PASSWORD (Before entering Fullscreen)
          ========================================================================= */}
      {passcodeModalOpen && (
        <div className="fixed inset-0 z-[10005] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-[#190d45] border-4 border-emerald-400 rounded-4xl p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-white text-center space-y-5 transition-colors">
            <button
              onClick={() => setPasscodeModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-purple-900/60 hover:bg-rose-600 hover:text-white text-slate-700 dark:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/30">
              <Lock className="h-8 w-8" />
            </div>

            <div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-emerald-600 dark:text-emerald-400">
                Set Secret Reading Code
              </h3>
              <p className="text-xs text-slate-500 dark:text-purple-200 mt-1">
                Enter your secret password below. When you finish reading, write this code to unlock and exit!
              </p>
            </div>

            {/* Display Box */}
            <div className="bg-slate-50 dark:bg-slate-950/80 border-2 border-slate-200 dark:border-purple-500 rounded-2xl p-4 flex items-center justify-center">
              <span className="font-mono font-black text-2xl tracking-[0.4em] text-emerald-600 dark:text-emerald-400">
                {enteredPasscode ? enteredPasscode : '1234'}
              </span>
            </div>

            {/* Chunky Keypad for Kids */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'].map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeypadPress(key)}
                  className="btn-3d py-3 rounded-2xl bg-slate-100 dark:bg-purple-900/80 hover:bg-slate-200 dark:hover:bg-purple-800 border border-slate-200 dark:border-purple-600 font-display font-black text-base text-slate-900 dark:text-white active:scale-95 shadow-md"
                >
                  {key === 'back' ? '⌫' : key === 'clear' ? 'C' : key}
                </button>
              ))}
            </div>

            <Button
              onClick={handleConfirmSetPasscode}
              className="btn-3d btn-3d-yellow w-full py-6 font-display font-black text-base rounded-2xl shadow-xl gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950"
            >
              <Maximize className="h-5 w-5" />
              Lock Into Fullscreen Reader 🚀
            </Button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: WRITE PASSWORD THEN BACK TO MAGAZINES PAGE
          ========================================================================= */}
      {exitPasscodeModalOpen && (
        <div className="fixed inset-0 z-[10005] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-[#190d45] border-4 border-emerald-400 rounded-4xl p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-white text-center space-y-5 transition-colors">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/30">
              <KeyRound className="h-8 w-8" />
            </div>

            <div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-emerald-600 dark:text-emerald-400">
                Write Secret Passcode
              </h3>
              <p className="text-xs text-slate-500 dark:text-purple-200 mt-1">
                Write your secret code to exit full screen and return to the Magazines Lounge!
              </p>
            </div>

            {/* Display Box */}
            <div className="bg-slate-50 dark:bg-slate-950/80 border-2 border-slate-200 dark:border-purple-500 rounded-2xl p-4 flex items-center justify-center min-h-[58px]">
              <span className="font-mono font-black text-2xl tracking-[0.4em] text-emerald-600 dark:text-emerald-400">
                {enteredPasscode ? enteredPasscode : '____'}
              </span>
            </div>

            {passcodeError && (
              <p className="text-xs font-bold text-rose-500 animate-wiggle">
                {passcodeError}
              </p>
            )}

            {/* Chunky Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'].map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeypadPress(key)}
                  className="btn-3d py-3 rounded-2xl bg-slate-100 dark:bg-purple-900/80 hover:bg-slate-200 dark:hover:bg-purple-800 border border-slate-200 dark:border-purple-600 font-display font-black text-base text-slate-900 dark:text-white active:scale-95 shadow-md"
                >
                  {key === 'back' ? '⌫' : key === 'clear' ? 'C' : key}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={handleVerifyExitPasscode}
                className="btn-3d btn-3d-yellow w-full py-6 font-display font-black text-base rounded-2xl shadow-xl gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950"
              >
                <Unlock className="h-5 w-5" />
                Unlock & Back to Magazines Page
              </Button>

              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-slate-500 dark:text-purple-300 hover:text-emerald-600 underline flex items-center gap-1"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  {showHint ? `Secret Code: "${secretPasscode}"` : 'Need a hint?'}
                </button>

                <button
                  onClick={() => setExitPasscodeModalOpen(false)}
                  className="text-slate-500 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white"
                >
                  Keep Reading
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
