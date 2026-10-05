'use client';

import * as React from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Delete,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FamilyPinSettingsCardProps {
  currentPinExists: boolean;
  pinUpdated?: boolean;
  updatePinAction: (formData: FormData) => Promise<void>;
}

export function FamilyPinSettingsCard({
  currentPinExists,
  pinUpdated = false,
  updatePinAction,
}: FamilyPinSettingsCardProps) {
  const [pinDigits, setPinDigits] = React.useState<string[]>(['', '', '', '']);
  const [confirmDigits, setConfirmDigits] = React.useState<string[]>(['', '', '', '']);
  const [showDigits, setShowDigits] = React.useState<boolean>(false);
  const [showKeypad, setShowKeypad] = React.useState<boolean>(false);
  const [activeTarget, setActiveTarget] = React.useState<'pin' | 'confirm'>('pin');
  const [activeBoxIndex, setActiveBoxIndex] = React.useState<number>(0);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = React.useState<boolean>(pinUpdated);

  const pinInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const confirmInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const pinString = pinDigits.join('');
  const confirmString = confirmDigits.join('');

  // Handle key typing in individual box
  const handleDigitChange = (
    value: string,
    index: number,
    target: 'pin' | 'confirm'
  ) => {
    setErrorMsg(null);
    const digits = target === 'pin' ? [...pinDigits] : [...confirmDigits];
    const setDigits = target === 'pin' ? setPinDigits : setConfirmDigits;
    const refs = target === 'pin' ? pinInputRefs : confirmInputRefs;

    // Handle single digit
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      digits[index] = '';
      setDigits(digits);
      return;
    }

    // If pasted multiple digits
    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 4).split('');
      chars.forEach((char, i) => {
        if (i < 4) digits[i] = char;
      });
      setDigits(digits);
      const nextIndex = Math.min(chars.length, 3);
      refs.current[nextIndex]?.focus();
      return;
    }

    digits[index] = cleaned[cleaned.length - 1];
    setDigits(digits);

    // Auto-advance to next box
    if (index < 3) {
      refs.current[index + 1]?.focus();
      setActiveBoxIndex(index + 1);
    } else if (target === 'pin') {
      // Auto move to confirm pin first box
      confirmInputRefs.current[0]?.focus();
      setActiveTarget('confirm');
      setActiveBoxIndex(0);
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    target: 'pin' | 'confirm'
  ) => {
    const digits = target === 'pin' ? pinDigits : confirmDigits;
    const setDigits = target === 'pin' ? setPinDigits : setConfirmDigits;
    const refs = target === 'pin' ? pinInputRefs : confirmInputRefs;

    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        digits[index - 1] = '';
        setDigits([...digits]);
        refs.current[index - 1]?.focus();
        setActiveBoxIndex(index - 1);
      } else {
        digits[index] = '';
        setDigits([...digits]);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus();
      setActiveBoxIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < 3) {
      refs.current[index + 1]?.focus();
      setActiveBoxIndex(index + 1);
    }
  };

  // Handle on-screen keypad press
  const handleKeypadPress = (num: string) => {
    setErrorMsg(null);
    const target = activeTarget;
    const digits = target === 'pin' ? [...pinDigits] : [...confirmDigits];
    const setDigits = target === 'pin' ? setPinDigits : setConfirmDigits;
    const refs = target === 'pin' ? pinInputRefs : confirmInputRefs;

    // Find first empty index
    const firstEmpty = digits.findIndex((d) => d === '');
    const targetIndex = firstEmpty !== -1 ? firstEmpty : 3;

    digits[targetIndex] = num;
    setDigits(digits);

    if (targetIndex < 3) {
      refs.current[targetIndex + 1]?.focus();
      setActiveBoxIndex(targetIndex + 1);
    } else if (target === 'pin') {
      confirmInputRefs.current[0]?.focus();
      setActiveTarget('confirm');
      setActiveBoxIndex(0);
    }
  };

  const handleKeypadBackspace = () => {
    const target = activeTarget;
    const digits = target === 'pin' ? [...pinDigits] : [...confirmDigits];
    const setDigits = target === 'pin' ? setPinDigits : setConfirmDigits;
    const refs = target === 'pin' ? pinInputRefs : confirmInputRefs;

    for (let i = 3; i >= 0; i--) {
      if (digits[i] !== '') {
        digits[i] = '';
        setDigits(digits);
        refs.current[i]?.focus();
        setActiveBoxIndex(i);
        return;
      }
    }

    if (target === 'confirm') {
      setActiveTarget('pin');
      pinInputRefs.current[3]?.focus();
      setActiveBoxIndex(3);
    }
  };

  const handleClearAll = () => {
    setPinDigits(['', '', '', '']);
    setConfirmDigits(['', '', '', '']);
    setErrorMsg(null);
    setActiveTarget('pin');
    setActiveBoxIndex(0);
    pinInputRefs.current[0]?.focus();
  };

  // Validation before submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (pinString.length !== 4) {
      e.preventDefault();
      setErrorMsg('Please enter all 4 numeric digits for your PIN.');
      pinInputRefs.current[pinString.length]?.focus();
      return;
    }

    if (pinString !== confirmString) {
      e.preventDefault();
      setErrorMsg('The PINs do not match. Please re-enter them carefully.');
      confirmInputRefs.current[0]?.focus();
      return;
    }

    setIsSubmitting(true);
  };

  const pinsMatch = pinString.length === 4 && confirmString.length === 4 && pinString === confirmString;
  const pinsMismatch = confirmString.length === 4 && pinString !== confirmString;

  return (
    <Card className="shadow-sm border-2 border-purple-200 dark:border-purple-800/60 bg-gradient-to-r from-purple-50/50 via-white to-white dark:from-purple-950/40 dark:via-[#13092e] dark:to-[#13092e] transition-colors">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-purple-950 dark:text-purple-200 font-display font-black text-xl">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-purple-700 dark:text-purple-300">
              <Lock className="h-4 w-4" />
            </div>
            <span>Parental 4-Digit Security PIN</span>
          </CardTitle>
          <span
            className={cn(
              'rounded-full text-[11px] font-black uppercase px-3 py-1 border transition-colors',
              currentPinExists
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700'
                : 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/60 dark:text-purple-300 dark:border-purple-700'
            )}
          >
            {currentPinExists ? '✓ PIN Active' : 'Setup Required'}
          </span>
        </div>
        <CardDescription className="text-slate-600 dark:text-purple-300/80 mt-1">
          This 4-digit security code locks the Family Dashboard and settings. Children browsing the Night Zoo
          cannot access parent-only areas without entering this passcode.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Success Banner */}
        {localSuccess && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 animate-in fade-in duration-200">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-xs sm:text-sm font-bold">
              Parental 4-digit PIN saved successfully! Your family controls and reports are now secured.
            </div>
          </div>
        )}

        {/* Error Banner */}
        {errorMsg && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200 animate-in fade-in duration-200">
            <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <div className="text-xs sm:text-sm font-bold">{errorMsg}</div>
          </div>
        )}

        <form action={updatePinAction} onSubmit={handleSubmit} className="space-y-6">
          {/* Hidden input to pass to Next.js server action */}
          <input type="hidden" name="pin" value={pinString} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Enter New PIN */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-display font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  New 4-Digit PIN
                </label>
                <button
                  type="button"
                  onClick={() => setShowDigits(!showDigits)}
                  className="inline-flex items-center gap-1.5 text-xs text-purple-700 dark:text-purple-300 hover:text-purple-900 font-bold"
                >
                  {showDigits ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      <span>Hide Digits</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" />
                      <span>Show Digits</span>
                    </>
                  )}
                </button>
              </div>

              {/* 4 Digit Boxes */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                {[0, 1, 2, 3].map((index) => {
                  const val = pinDigits[index];
                  const isFilled = Boolean(val);
                  return (
                    <input
                      key={`pin-${index}`}
                      ref={(el) => {
                        pinInputRefs.current[index] = el;
                      }}
                      type={showDigits ? 'text' : 'password'}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={val}
                      onFocus={() => {
                        setActiveTarget('pin');
                        setActiveBoxIndex(index);
                      }}
                      onChange={(e) => handleDigitChange(e.target.value, index, 'pin')}
                      onKeyDown={(e) => handleKeyDown(e, index, 'pin')}
                      className={cn(
                        'w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-black rounded-2xl border-2 transition-all select-none',
                        'bg-white dark:bg-[#1b0d47] text-slate-900 dark:text-white',
                        isFilled
                          ? 'border-purple-500 shadow-md ring-2 ring-purple-500/20'
                          : 'border-slate-200 dark:border-purple-800/80 hover:border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20'
                      )}
                      autoComplete="off"
                    />
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-purple-300/70">
                {pinString.length}/4 digits entered
              </p>
            </div>

            {/* 2. Confirm PIN */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-display font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Confirm 4-Digit PIN
                </label>
                {pinsMatch && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    PINs Match
                  </span>
                )}
                {pinsMismatch && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Do Not Match
                  </span>
                )}
              </div>

              {/* 4 Confirm Boxes */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                {[0, 1, 2, 3].map((index) => {
                  const val = confirmDigits[index];
                  const isFilled = Boolean(val);
                  return (
                    <input
                      key={`confirm-${index}`}
                      ref={(el) => {
                        confirmInputRefs.current[index] = el;
                      }}
                      type={showDigits ? 'text' : 'password'}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={val}
                      onFocus={() => {
                        setActiveTarget('confirm');
                        setActiveBoxIndex(index);
                      }}
                      onChange={(e) => handleDigitChange(e.target.value, index, 'confirm')}
                      onKeyDown={(e) => handleKeyDown(e, index, 'confirm')}
                      className={cn(
                        'w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-black rounded-2xl border-2 transition-all select-none',
                        'bg-white dark:bg-[#1b0d47] text-slate-900 dark:text-white',
                        pinsMatch
                          ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                          : pinsMismatch
                          ? 'border-rose-400 ring-2 ring-rose-400/20'
                          : isFilled
                          ? 'border-purple-500 shadow-md ring-2 ring-purple-500/20'
                          : 'border-slate-200 dark:border-purple-800/80 hover:border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20'
                      )}
                      autoComplete="off"
                    />
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-purple-300/70">
                Repeat the same 4 numbers to confirm
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-purple-900/40">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-purple-300 hover:bg-slate-100 dark:hover:bg-purple-900/40 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear
              </button>

              <button
                type="button"
                onClick={() => setShowKeypad(!showKeypad)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/40 transition-colors"
              >
                <span>{showKeypad ? 'Hide Keypad' : 'Touch Keypad'}</span>
              </button>
            </div>

            <Button
              type="submit"
              variant="emerald"
              disabled={isSubmitting || !pinsMatch}
              className={cn(
                'font-black text-xs px-6 py-2.5 rounded-2xl transition-all shadow-md',
                pinsMatch
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 dark:bg-purple-950/60 dark:text-purple-400/50 cursor-not-allowed'
              )}
            >
              {isSubmitting ? 'Saving PIN...' : 'Save 4-Digit Parent PIN'}
            </Button>
          </div>

          {/* Optional Touch Keypad for tablet/mobile parents */}
          {showKeypad && (
            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-purple-950/50 border-2 border-purple-100 dark:border-purple-800/60 max-w-xs mx-auto animate-in fade-in duration-150">
              <div className="text-[11px] font-bold text-center text-slate-500 dark:text-purple-300 mb-3">
                Typing into:{' '}
                <strong className="text-purple-700 dark:text-purple-300 uppercase">
                  {activeTarget === 'pin' ? 'New PIN' : 'Confirm PIN'}
                </strong>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleKeypadPress(digit)}
                    className="h-12 rounded-2xl bg-white dark:bg-[#180a3a] border border-slate-200 dark:border-purple-800/60 font-display font-black text-lg text-slate-800 dark:text-white hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 active:scale-95 transition-all shadow-sm flex items-center justify-center cursor-pointer"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="h-12 rounded-2xl bg-slate-100 dark:bg-purple-900/40 border border-slate-200 dark:border-purple-800/60 font-bold text-xs text-slate-600 dark:text-purple-300 hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handleKeypadPress('0')}
                  className="h-12 rounded-2xl bg-white dark:bg-[#180a3a] border border-slate-200 dark:border-purple-800/60 font-display font-black text-lg text-slate-800 dark:text-white hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 active:scale-95 transition-all shadow-sm flex items-center justify-center cursor-pointer"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleKeypadBackspace}
                  className="h-12 rounded-2xl bg-slate-100 dark:bg-purple-900/40 border border-slate-200 dark:border-purple-800/60 font-bold text-slate-600 dark:text-purple-300 hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                >
                  <Delete className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
