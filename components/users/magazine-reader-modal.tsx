'use client';

import * as React from 'react';
import {
  X,
  Trophy,
  BookOpen,
  Heart,
  ExternalLink,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ZoomIn,
  ZoomOut,
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
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(21);
  const [pdfDoc, setPdfDoc] = React.useState<any>(null);
  const [isLoadingPdf, setIsLoadingPdf] = React.useState<boolean>(true);
  const [isRenderingPage, setIsRenderingPage] = React.useState<boolean>(false);
  const [orbsClaimed, setOrbsClaimed] = React.useState<boolean>(false);
  const [liked, setLiked] = React.useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = React.useState<number>(1);
  const [viewMode, setViewMode] = React.useState<'fit' | 'fullWidth'>('fit');

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
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleClaim = () => {
    if (orbsClaimed) return;
    setOrbsClaimed(true);
    if (onClaimOrbs) {
      onClaimOrbs(50);
    }
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setViewMode('fit');
  };

  const handleAdd100PercentSize = () => {
    setZoomLevel(2.0);
  };

  const handleToggleFullWidth = () => {
    setViewMode((prev) => (prev === 'fit' ? 'fullWidth' : 'fit'));
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(Number((prev - 0.25).toFixed(2)), 0.75));
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
            {/* 100% Size & Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-purple-950/70 p-1 rounded-2xl border border-slate-200 dark:border-purple-700/60 shadow-inner">
              <button
                onClick={handleResetZoom}
                className={`px-2.5 py-1 rounded-xl font-display font-black text-xs transition-all ${
                  zoomLevel === 1 && viewMode === 'fit'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'text-slate-700 dark:text-purple-200 hover:bg-slate-200 dark:hover:bg-purple-800'
                }`}
                title="Set to 100% Full Page Size (Fit)"
              >
                100% Size
              </button>

              <button
                onClick={handleAdd100PercentSize}
                className={`px-2.5 py-1 rounded-xl font-display font-black text-xs transition-all ${
                  zoomLevel === 2.0
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'text-slate-700 dark:text-purple-200 hover:bg-slate-200 dark:hover:bg-purple-800'
                }`}
                title="Add 100% of Size (200% Zoom)"
              >
                +100% Size
              </button>

              <button
                onClick={handleToggleFullWidth}
                className={`px-2.5 py-1 rounded-xl font-display font-black text-xs transition-all ${
                  viewMode === 'fullWidth'
                    ? 'bg-emerald-400 text-slate-950 shadow-md font-black'
                    : 'text-slate-700 dark:text-purple-200 hover:bg-slate-200 dark:hover:bg-purple-800'
                }`}
                title="Expand to 100% Width"
              >
                {viewMode === 'fullWidth' ? '✓ 100% Width' : '100% Width'}
              </button>

              <div className="h-3.5 w-px bg-slate-300 dark:bg-purple-700 mx-0.5" />

              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.75}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-purple-800 text-slate-700 dark:text-purple-200 disabled:opacity-30"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>

              <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-purple-300 px-1 hidden xs:inline">
                {Math.round(zoomLevel * 100)}%
              </span>

              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 2.5}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-purple-800 text-slate-700 dark:text-purple-200 disabled:opacity-30"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-purple-950/60 border border-purple-700/60 text-purple-200 hover:text-white hover:bg-purple-900 transition-all"
              title="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </a>

            <a
              href={pdfUrl}
              download="Selam-Kids-Magazine-Issue-1.pdf"
              className="p-2 rounded-xl bg-purple-950/60 border border-purple-700/60 text-purple-200 hover:text-white hover:bg-purple-900 transition-all"
              title="Download PDF"
            >
              <Download className="h-4 w-4" />
            </a>

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

        {/* Central Stage: 1 Page alone, uncropped & scrollable if enlarged */}
        <div className="relative flex-1 w-full flex items-center justify-center p-2 sm:p-4 overflow-auto my-auto min-h-[50vh]">
          {(isLoadingPdf || isRenderingPage) && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-xs rounded-3xl space-y-2">
              <Loader2 className="h-8 w-8 text-amber-400 animate-spin" />
              <p className="font-display font-bold text-xs text-amber-200">
                Loading Page {currentPage}...
              </p>
            </div>
          )}

          {/* Floating side buttons */}
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="absolute left-2 sm:left-4 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-950/80 hover:bg-amber-400 text-white hover:text-slate-950 border-2 border-amber-400/80 shadow-2xl disabled:opacity-20 disabled:pointer-events-none transition-all active:scale-90"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <canvas
            ref={canvasRef}
            className={`object-contain rounded-2xl bg-white shadow-2xl border-2 border-yellow-200/40 transition-all ${
              isRenderingPage ? 'opacity-70' : 'opacity-100'
            }`}
            style={
              viewMode === 'fullWidth'
                ? {
                    width: `${Math.round(100 * zoomLevel)}%`,
                    maxWidth: `${Math.round(1100 * zoomLevel)}px`,
                    height: 'auto',
                  }
                : {
                    maxHeight: `${Math.round(84 * zoomLevel)}vh`,
                    maxWidth: '100%',
                    width: 'auto',
                    height: 'auto',
                  }
            }
          />

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="absolute right-2 sm:right-4 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-950/80 hover:bg-amber-400 text-white hover:text-slate-950 border-2 border-amber-400/80 shadow-2xl disabled:opacity-20 disabled:pointer-events-none transition-all active:scale-90"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

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
