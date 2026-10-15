'use client';

import * as React from 'react';
import { Download, X, Smartphone, Sparkles, Share, PlusSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [, setIsInstallable] = React.useState<boolean>(false);
  const [isIos, setIsIos] = React.useState<boolean>(false);
  const [isStandalone, setIsStandalone] = React.useState<boolean>(false);
  const [showPromptBanner, setShowPromptBanner] = React.useState<boolean>(false);
  const [showIosGuide, setShowIosGuide] = React.useState<boolean>(false);

  React.useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[PWA] Service Worker registered:', reg.scope);
          })
          .catch((err) => {
            console.warn('[PWA] Service Worker registration failed:', err);
          });
      });
    }

    // 2. Detect if already in standalone display mode
    if (typeof window !== 'undefined') {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);

      // Check iOS Safari
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
      setIsIos(isIosDevice);

      // Listen for beforeinstallprompt event (Chrome, Android, Edge)
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setIsInstallable(true);

        // Show banner if not dismissed previously
        const dismissed = sessionStorage.getItem('selam-kids-pwa-dismissed');
        if (!dismissed && !isStandaloneMode) {
          setShowPromptBanner(true);
        }
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      window.addEventListener('appinstalled', () => {
        setIsInstallable(false);
        setShowPromptBanner(false);
        setDeferredPrompt(null);
        console.log('[PWA] Selam Kids App successfully installed!');
      });

      // Expose a global event for opening the install prompt from any button (e.g. drawer)
      const handleTriggerInstall = () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              setIsInstallable(false);
              setShowPromptBanner(false);
            }
            setDeferredPrompt(null);
          });
        } else if (isIosDevice) {
          setShowIosGuide(true);
        } else {
          setShowPromptBanner(true);
        }
      };

      window.addEventListener('selam-kids-open-install', handleTriggerInstall);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('selam-kids-open-install', handleTriggerInstall);
      };
    }
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
        setShowPromptBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowPromptBanner(false);
    sessionStorage.setItem('selam-kids-pwa-dismissed', 'true');
  };

  // If already running inside standalone app, do not display prompts
  if (isStandalone) return null;

  return (
    <>
      {/* Floating PWA Install Banner at bottom */}
      {showPromptBanner && (
        <aside
          role="region"
          aria-label="Install Selam Kids Application"
          className="fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-[9990] bg-white dark:bg-[#150a38] border-2 border-purple-400 dark:border-purple-600 rounded-3xl p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-300 select-none text-slate-900 dark:text-white"
        >
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-purple-500/30 text-white">
              <Smartphone className="h-6 w-6" />
            </div>

            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-sm sm:text-base leading-tight">
                  Install Selam Kids App
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
                  <Sparkles className="h-2.5 w-2.5" /> Fast
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-purple-200/80 mt-0.5 leading-snug">
                Install as a mobile app for fast reading, offline access, and full screen experience!
              </p>

              <div className="flex items-center gap-2 mt-3">
                <Button
                  onClick={handleInstallClick}
                  className="btn-3d btn-3d-yellow text-slate-950 font-display font-black text-xs px-4 py-2 rounded-xl gap-1.5 shadow-md h-9 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Install Now</span>
                </Button>
                <button
                  onClick={handleDismiss}
                  className="text-xs font-bold text-slate-500 dark:text-purple-300 hover:text-slate-800 dark:hover:text-white px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  Maybe Later
                </button>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              aria-label="Dismiss install banner"
              className="absolute top-3.5 right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </aside>
      )}

      {/* iOS Safari "Add to Home Screen" Instructions Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-[10002] flex items-end sm:items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white dark:bg-[#180a3a] border-2 border-purple-400 dark:border-purple-600 rounded-3xl p-5 shadow-2xl text-slate-900 dark:text-white space-y-4">
            <button
              onClick={() => setShowIosGuide(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-purple-900/60 text-slate-600 dark:text-purple-200 hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-base leading-tight">Install on iPhone / iPad</h3>
                <p className="text-[11px] text-purple-400">Add to your Home Screen in 2 steps</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 dark:text-purple-200">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/40 border border-purple-100 dark:border-purple-800">
                <span className="h-5 w-5 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                <div>
                  Tap the <strong className="font-black text-purple-700 dark:text-purple-300">Share</strong> button <Share className="inline h-3.5 w-3.5 mx-1" /> at the bottom of Safari.
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/40 border border-purple-100 dark:border-purple-800">
                <span className="h-5 w-5 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                <div>
                  Scroll down and tap <strong className="font-black text-purple-700 dark:text-purple-300">Add to Home Screen</strong> <PlusSquare className="inline h-3.5 w-3.5 mx-1" />.
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowIosGuide(false)}
              className="btn-3d btn-3d-yellow w-full text-slate-950 font-display font-black text-xs h-10 rounded-xl"
            >
              Got It!
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
