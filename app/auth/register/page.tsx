'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Phone, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { CountrySelector } from '@/components/auth/country-selector';

export default function RegisterPage() {
  const { register, loading, error: authError } = useAuth();

  const [countryCode, setCountryCode] = React.useState('+251');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);
  const [registeredSuccess, setRegisteredSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const cleanPhone = phoneNumber.replace(/\D/g, '');

    if (!cleanPhone) {
      setLocalError('Please enter your phone number');
      return;
    }

    if (cleanPhone.length < 5) {
      setLocalError('Please enter a valid phone number');
      return;
    }

    if (!password || password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    try {
      await register({
        countryCode,
        phoneNumber: cleanPhone,
        username: `user_${cleanPhone.slice(-4)}`,
        password,
      });
      setRegisteredSuccess(true);
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center p-4 night-sky-bg overflow-hidden">
      {/* Starry pattern and ambient floating glow */}
      <div className="absolute inset-0 stars-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-purple-600/20 blur-[140px] rounded-full pointer-events-none" />

      <Card className="relative w-full max-w-md shadow-2xl border-2 border-slate-200/90 dark:border-purple-500/40 bg-white dark:bg-[#160b3d]/95 backdrop-blur-xl text-slate-900 dark:text-white rounded-4xl my-6 transition-colors">
        <CardHeader className="text-center space-y-3 pt-8 pb-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/20">
            <Compass className="h-8 w-8 text-slate-950 animate-pulse" />
          </div>
          <div>
            <CardTitle className="font-display font-black text-3xl sm:text-4xl tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
              Create Account
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-purple-200 font-medium text-sm mt-1">
              Join Selam Kids
            </CardDescription>
          </div>
        </CardHeader>

        {registeredSuccess ? (
          <CardContent className="space-y-4 px-6 sm:px-8 py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-400/50">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white">Account Created!</h3>
            <p className="text-slate-600 dark:text-purple-200 text-sm">
              Welcome to Selam Kids! Redirecting you to your adventure...
            </p>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 px-6 sm:px-8">
              {(localError || authError) && (
                <div className="rounded-2xl border-2 border-rose-500/60 bg-rose-50 dark:bg-rose-950/80 p-3.5 text-xs font-bold text-rose-700 dark:text-rose-200 shadow-inner">
                  {localError || authError}
                </div>
              )}

              {/* 1. Country Code and Phone Number */}
              <div>
                <label className="block text-xs font-display font-black uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-1.5">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  {/* Searchable Country Code Dropdown */}
                  <CountrySelector
                    value={countryCode}
                    onChange={setCountryCode}
                  />

                  {/* Phone input */}
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="912 345 678"
                      className="w-full h-12 pl-10 pr-3.5 rounded-2xl border-2 border-slate-200 dark:border-purple-700/80 bg-slate-50 dark:bg-purple-950/70 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder-purple-400 focus:border-emerald-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-purple-300 font-medium">
                  Select your country code and enter your mobile number.
                </p>
              </div>

              {/* 2. Password */}
              <div>
                <label className="block text-xs font-display font-black uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full h-12 pl-10 pr-10 rounded-2xl border-2 border-slate-200 dark:border-purple-700/80 bg-slate-50 dark:bg-purple-950/70 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder-purple-400 focus:border-emerald-500 focus:outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:text-purple-400 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="emerald"
                  size="lg"
                  className="w-full h-14 text-base font-black shadow-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Register Now
                      <ArrowRight className="h-5 w-5 text-slate-950" />
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2 pb-8 border-t border-slate-100 dark:border-purple-800/40 text-center">
              <div className="text-xs text-slate-500 dark:text-purple-300 font-medium">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="font-black text-emerald-600 dark:text-emerald-400 hover:underline transition-all"
                >
                  Sign In &rarr;
                </Link>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
