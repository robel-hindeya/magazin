'use client';

import * as React from 'react';
import { CheckCircle2, ExternalLink, Loader2, Send, X } from 'lucide-react';

interface TelegramBotLoginButtonProps {
  /** "login": sign in / sign up. "link": connect Telegram to the signed-in account. */
  intent: 'login' | 'link';
  /** Same-site path to open after signing in (login only). */
  redirectTo?: string;
  className?: string;
}

type Phase = 'idle' | 'starting' | 'waiting' | 'done' | 'error';

const POLL_MS = 2000;

/**
 * "Continue with Telegram" through the Selam Kids bot. Works on any domain, including
 * localhost: the user confirms in the bot, and this page picks up the session by polling.
 */
export function TelegramBotLoginButton({ intent, redirectTo, className }: TelegramBotLoginButtonProps) {
  const [phase, setPhase] = React.useState<Phase>('idle');
  const [botUrl, setBotUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = React.useState(0);
  const expiresAtRef = React.useRef(0);

  const label = intent === 'link' ? 'Connect Telegram' : 'Continue with Telegram';

  const start = async () => {
    setError(null);
    setPhase('starting');
    // Open the tab synchronously (inside the click) so pop-up blockers allow it.
    const tab = window.open('', '_blank');
    try {
      const res = await fetch('/api/auth/telegram/bot-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent, redirectTo }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error?.message || 'Could not start Telegram sign-in.');

      const url: string = json.data.botUrl;
      setBotUrl(url);
      expiresAtRef.current = json.data.expiresAt;
      if (tab) tab.location.href = url;
      setPhase('waiting');
    } catch (err) {
      tab?.close();
      setError(err instanceof Error ? err.message : 'Could not start Telegram sign-in.');
      setPhase('error');
    }
  };

  React.useEffect(() => {
    if (phase !== 'waiting') return;
    let stopped = false;

    const tick = () => setSecondsLeft(Math.max(0, Math.round((expiresAtRef.current - Date.now()) / 1000)));
    tick();
    const countdown = window.setInterval(tick, 1000);

    const poll = async () => {
      if (stopped) return;
      try {
        const res = await fetch('/api/auth/telegram/bot-login/status', { cache: 'no-store' });
        const json = await res.json();
        const status = json.data?.status;
        if (status === 'done') {
          stopped = true;
          setPhase('done');
          window.location.href = json.data.redirectTo || '/users';
          return;
        }
        if (status === 'denied' || status === 'expired' || status === 'error') {
          stopped = true;
          setError(
            status === 'denied'
              ? 'Sign-in was cancelled in Telegram.'
              : status === 'expired'
                ? 'The request expired. Please try again.'
                : json.data?.message || 'Telegram sign-in failed. Please try again.'
          );
          setPhase('error');
          return;
        }
      } catch {
        // Network blip: keep polling.
      }
      if (!stopped) timer = window.setTimeout(poll, POLL_MS);
    };
    let timer = window.setTimeout(poll, POLL_MS);

    return () => {
      stopped = true;
      window.clearTimeout(timer);
      window.clearInterval(countdown);
    };
  }, [phase]);

  if (phase === 'waiting' || phase === 'done') {
    return (
      <div
        className={`w-full rounded-2xl border-2 border-sky-300 dark:border-sky-500/50 bg-sky-50 dark:bg-sky-950/40 p-4 text-center space-y-2.5 ${className ?? ''}`}
        role="status"
        aria-live="polite"
      >
        {phase === 'done' ? (
          <p className="flex items-center justify-center gap-2 text-sm font-black text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> Confirmed! Signing you in…
          </p>
        ) : (
          <>
            <p className="flex items-center justify-center gap-2 text-sm font-black text-sky-700 dark:text-sky-300">
              <Loader2 className="h-4 w-4 animate-spin" /> Waiting for you in Telegram…
            </p>
            <p className="text-xs font-medium text-slate-600 dark:text-sky-100/80">
              In the Selam Kids bot, press <b>Start</b>, then <b>✅ Confirm</b>. This page continues by itself.
            </p>
            <div className="flex items-center justify-center gap-3 text-xs font-bold">
              {botUrl && (
                <a
                  href={botUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sky-700 dark:text-sky-300 hover:underline"
                >
                  Open Telegram <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <button
                type="button"
                onClick={() => setPhase('idle')}
                className="inline-flex items-center gap-1 text-slate-500 dark:text-purple-300 hover:underline"
              >
                <X className="h-3 w-3" /> Cancel
              </button>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-purple-300/70">
              Expires in {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`w-full space-y-2 ${className ?? ''}`}>
      <button
        type="button"
        onClick={start}
        disabled={phase === 'starting'}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#229ED9] hover:bg-[#1c8bc0] disabled:opacity-70 text-white text-sm font-black shadow-lg shadow-sky-500/20 transition-colors"
      >
        {phase === 'starting' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {phase === 'starting' ? 'Opening Telegram…' : label}
      </button>
      {error && (
        <p className="rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-xs font-bold text-rose-700 dark:text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}
