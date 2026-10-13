'use client';

import * as React from 'react';
import {
  X,
  Trophy,
  BookOpen,
  Heart,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MagazineIssue } from './magazine-data';

interface MagazineReaderModalProps {
  magazine: MagazineIssue | null;
  isOpen: boolean;
  onClose: () => void;
  onClaimOrbs?: (amount: number) => void;
  onWriteStory?: () => void;
}

export function MagazineReaderModal({
  magazine,
  isOpen,
  onClose,
  onClaimOrbs,
}: MagazineReaderModalProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(21);
  const [pdfDoc, setPdfDoc] = React.useState<any>(null);
  const [isLoadingPdf, setIsLoadingPdf] = React.useState<boolean>(true);
  const [isRenderingPage, setIsRenderingPage] = React.useState<boolean>(false);
  const [orbsClaimed, setOrbsClaimed] = React.useState<boolean>(false);
  const [liked, setLiked] = React.useState<boolean>(false);

  const pdfUrl = magazine?.pdfUrl || '/magazines/selam-kids-magazine-issue-1.pdf';

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

  // Load PDF when modal opens
  React.useEffect(() => {
    if (!isOpen || !magazine) return;
    let isMounted = true;
    setCurrentPage(1);
    setOrbsClaimed(false);
    setIsLoadingPdf(true);

    async function loadPdf() {
      try {
        const pdfjsLib = await loadBrowserPdfJs();
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const doc = await loadingTask.promise;
        if (!isMounted) return;

        setPdfDoc(doc);
        setTotalPages(doc.numPages || 21);
        setIsLoadingPdf(false);
      } catch (err) {
        console.error('Modal failed to load PDF:', err);
        if (isMounted) setIsLoadingPdf(false);
      }
    }

    loadPdf();
    return () => {
      isMounted = false;
    };
  }, [isOpen, magazine, pdfUrl, loadBrowserPdfJs]);

  // Render current page onto canvas
  React.useEffect(() => {
    if (!isOpen || !pdfDoc) return;
    let renderTask: any = null;
    let isCancelled = false;

    async function renderPage() {
      setIsRenderingPage(true);
      try {
        const page = await pdfDoc.getPage(currentPage);
        if (isCancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = typeof window !== 'undefined' ? Math.max(window.devicePixelRatio || 1, 2) : 2;
        const viewport = page.getViewport({ scale: dpr });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        renderTask = page.render({
          canvasContext: ctx,
          viewport: viewport,
        });

        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Modal page render error:', err);
        }
      } finally {
        if (!isCancelled) setIsRenderingPage(false);
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
  }, [isOpen, pdfDoc, currentPage]);

  if (!isOpen || !magazine) return null;

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClaim = () => {
    if (orbsClaimed) return;
    setOrbsClaimed(true);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('selam-kids-points-updated', {
          detail: { delta: 50 },
        })
      );
    }
    if (onClaimOrbs) {
      onClaimOrbs(50);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-7xl h-[95vh] flex flex-col bg-[#11062b] border-4 border-amber-400 rounded-4xl shadow-2xl overflow-hidden text-white justify-between">
        {/* Top Header */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-2.5 bg-white dark:bg-[#0f0728] border-b-2 border-slate-200 dark:border-purple-900/80">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/30">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-emerald-600 dark:text-emerald-400 text-sm sm:text-base tracking-wide uppercase">
                  Issue #{magazine.issueNumber}: {magazine.title}
                </span>
                <Badge variant="magic" className="text-[10px] px-2 py-0.5 uppercase tracking-widest hidden sm:inline-flex">
                  PAGE {currentPage} OF {totalPages}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className={`p-2 rounded-xl border transition-all ${
                liked
                  ? 'bg-rose-500 border-rose-400 text-white scale-110 shadow-lg shadow-rose-500/40'
                  : 'bg-purple-950/60 border-purple-700/60 text-purple-200 hover:text-rose-500'
              }`}
              title="Like this Issue"
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-purple-950/80 border border-purple-700/60 hover:bg-rose-600 hover:border-rose-500 text-white transition-all"
              title="Close Reader"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Previous Page Floating Side Button (Pinned to modal vertical center) */}
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-950/80 hover:bg-amber-400 text-white hover:text-slate-950 border-2 border-amber-400/80 shadow-2xl disabled:opacity-20 disabled:pointer-events-none transition-all active:scale-90"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Central Stage: 1 Page alone, uncropped & scrollable up and down */}
        <div
          ref={scrollContainerRef}
          className="relative z-10 flex-1 w-full overflow-y-auto overflow-x-hidden my-auto p-2 sm:p-4 min-h-[50vh] max-h-[78vh]"
        >
          {(isLoadingPdf || isRenderingPage) && (
            <div className="sticky top-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-xs rounded-3xl p-6 max-w-xs mx-auto space-y-2 shadow-2xl">
              <Loader2 className="h-8 w-8 text-amber-400 animate-spin" />
              <p className="font-display font-bold text-xs text-amber-200">
                Loading Page {currentPage}...
              </p>
            </div>
          )}

          {/* The Page Canvas (Zero crop, scrolls up and down from top to bottom) */}
          <div className="w-full flex flex-col items-center justify-start min-h-full py-2">
            <canvas
              ref={canvasRef}
              className={`w-full max-w-[760px] md:max-w-[840px] h-auto object-contain rounded-2xl bg-white shadow-2xl border-2 border-yellow-200/40 transition-opacity ${
                isRenderingPage ? 'opacity-70' : 'opacity-100'
              }`}
            />
          </div>
        </div>

        {/* Next Page Floating Side Button (Pinned to modal vertical center) */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-950/80 hover:bg-amber-400 text-white hover:text-slate-950 border-2 border-amber-400/80 shadow-2xl disabled:opacity-20 disabled:pointer-events-none transition-all active:scale-90"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Footer Navigation: Next Page button & page counter */}
        <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#0f0728] border-t-2 border-purple-900/80">
          <Button
            onClick={handlePrev}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="btn-3d rounded-xl font-display font-black text-xs gap-1 px-3 py-1.5 text-slate-200 border-purple-600 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-purple-200">
              Page <span className="text-amber-400 font-black">{currentPage}</span> of {totalPages}
            </span>

            <Button
              onClick={handleClaim}
              disabled={orbsClaimed}
              size="sm"
              className={`gap-1 font-display font-black text-xs px-3 py-1.5 rounded-xl transition-all ${
                orbsClaimed
                  ? 'bg-emerald-600/90 border border-emerald-400 text-slate-950 cursor-default opacity-90'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border border-emerald-300'
              }`}
            >
              <Trophy className="h-3.5 w-3.5 fill-slate-950 text-slate-950" />
              {orbsClaimed ? '✓ Claimed' : 'Claim +50'}
            </Button>
          </div>

          <Button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            size="sm"
            className="btn-3d btn-3d-yellow rounded-xl font-display font-black text-xs gap-1 px-4 py-1.5 text-slate-950 disabled:opacity-30"
          >
            <span>Next Page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
