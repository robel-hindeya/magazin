'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  Shield,
  Compass,
  Home,
  User as UserIcon,
  BookOpen,
  Gamepad2,
  Sparkles,
  Music,
  Trophy,
  LayoutGrid,
  X,
  Flame,
  Users,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { AuthUser } from '@/types/auth';
import { ROLES, UserRole } from '@/backend/constants/roles';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export interface NavbarProps {
  user?: AuthUser | null;
  initialPoints?: number;
}

export function Navbar({ user, initialPoints = 75 }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAdminArea = pathname.startsWith('/admin') || pathname.startsWith('/superadmin');

  // Interactive user points tracking in navbar
  const [points, setPoints] = React.useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selam-kids-points');
      if (saved && !isNaN(Number(saved))) return Number(saved);
    }
    return initialPoints;
  });

  React.useEffect(() => {
    const handlePointsUpdated = (e: any) => {
      setPoints((prev) => {
        let next = prev;
        if (typeof e.detail?.points === 'number') {
          next = e.detail.points;
        } else if (typeof e.detail?.delta === 'number') {
          next = prev + e.detail.delta;
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('selam-kids-points', String(next));
        }
        return next;
      });
    };

    window.addEventListener('selam-kids-points-updated' as any, handlePointsUpdated);
    return () => {
      window.removeEventListener('selam-kids-points-updated' as any, handlePointsUpdated);
    };
  }, []);

  // Super App drawer state for mobile view
  const [isSuperAppOpen, setIsSuperAppOpen] = React.useState(false);

  // Close super app drawer whenever the page route changes
  React.useEffect(() => {
    setIsSuperAppOpen(false);
  }, [pathname]);

  // Lock background body scroll when super app modal is open
  React.useEffect(() => {
    if (isSuperAppOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSuperAppOpen]);

  // Keyboard accessibility: ESC key closes drawer
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSuperAppOpen(false);
    };
    if (isSuperAppOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSuperAppOpen]);

  // When logged in, clicking the logo routes to /users/kids (or their respective portal) instead of the landing page
  const logoHref = user
    ? user.role === ROLES.ADMIN
      ? '/admin'
      : user.role === ROLES.SUPERADMIN
      ? '/superadmin'
      : user.role === ROLES.TEACHER
      ? '/users/teachers'
      : '/users/kids'
    : '/';

  // Mobile Profile button target
  const profileHref = user
    ? user.role === ROLES.SUPERADMIN
      ? '/superadmin'
      : user.role === ROLES.ADMIN
      ? '/admin'
      : user.role === ROLES.TEACHER
      ? '/users/teachers'
      : user.role === ROLES.FAMILY
      ? '/users/families'
      : '/users/kids/profile'
    : '/auth/login';

  const isActiveHome = logoHref === '/' ? pathname === '/' : pathname === logoHref;
  const isActiveProfile =
    pathname.startsWith('/users/kids/profile') ||
    pathname.startsWith('/users/families') ||
    pathname.startsWith('/users/settings') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/superadmin') ||
    pathname.startsWith('/users/teachers');
  const isActiveApps =
    isSuperAppOpen ||
    pathname.startsWith('/games') ||
    pathname.startsWith('/melody-world') ||
    pathname.startsWith('/users/kids/magazines') ||
    pathname.startsWith('/users/kids/magazine') ||
    pathname.startsWith('/users/kids/daily') ||
    pathname.startsWith('/users/kids/story') ||
    pathname.startsWith('/users/community');

  // Complete roster of apps & features in the Super App Launcher
  const superApps = [
    {
      id: 'magazines',
      title: 'Magazine',
      desc: 'Ethiopian Kids Issues',
      href: user ? '/users/kids/magazines' : '/#magazines',
      icon: BookOpen,
      iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
      badge: '10 Issues',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300',
    },
    {
      id: 'story',
      title: 'Story',
      desc: 'Write For Next Issue',
      href: user ? '/users/kids/story' : '/auth/login',
      icon: Sparkles,
      iconBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30',
      badge: 'Contest',
      badgeBg: 'bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300',
    },
    {
      id: 'community',
      title: 'Community',
      desc: 'Young Authors Club',
      href: '/users/community',
      icon: Users,
      iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30',
      badge: 'Club',
      badgeBg: 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300',
    },
    {
      id: 'daily',
      title: 'Daily Writing',
      desc: 'Daily Writing Quests',
      href: '/users/kids/daily',
      icon: Flame,
      iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30',
      badge: 'Daily',
      badgeBg: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300',
    },
    {
      id: 'melody',
      title: 'Melody World',
      desc: 'Songs & Audio Tales',
      href: '/melody-world',
      icon: Music,
      iconBg: 'bg-pink-500/15 text-pink-600 dark:text-pink-400 border border-pink-500/30',
      badge: 'Audio',
      badgeBg: 'bg-pink-100 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300',
    },
    {
      id: 'games',
      title: 'Games',
      desc: 'Word Dash & Coloring',
      href: '/games',
      icon: Gamepad2,
      iconBg: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30',
      badge: '3 Games',
      badgeBg: 'bg-cyan-100 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300',
    },
  ];

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case ROLES.KID:
        return 'kid';
      case ROLES.FAMILY:
        return 'family';
      case ROLES.TEACHER:
        return 'teacher';
      case ROLES.ADMIN:
        return 'admin';
      case ROLES.SUPERADMIN:
        return 'superadmin';
      default:
        return 'default';
    }
  };

  return (
    <>
      {/* =========================================================================
          DESKTOP NAVBAR (Top Header for Large Screens >= 1024px)
          ========================================================================= */}
      <header className="hidden lg:block sticky top-0 z-50 bg-white/95 dark:bg-[#0f0728] backdrop-blur-md border-b-2 border-slate-200/80 dark:border-purple-900/60 shadow-sm dark:shadow-lg dark:shadow-purple-950/40 relative overflow-visible transition-colors">
        <div className="absolute inset-0 stars-pattern opacity-10 dark:opacity-40 pointer-events-none" />
        <div className="absolute -top-12 left-1/4 w-96 h-20 bg-purple-500/10 dark:bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative flex h-20 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href={logoHref} className="flex items-center gap-3 group">
            <div className="relative h-12 w-12 group-hover:scale-110 transition-transform duration-200 shrink-0">
              <Image
                src="/images/logo.png"
                alt="Selam Kids Logo"
                fill
                sizes="48px"
                className="object-contain drop-shadow-[0_4px_12px_rgba(16,185,129,0.25)]"
                priority
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-2xl tracking-wide text-slate-900 dark:text-white drop-shadow-sm">
                  Selam<span className="text-emerald-500 dark:text-emerald-400">Kids</span>
                </span>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-300">
                Selam Kids Realm
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center space-x-7 font-display font-bold text-sm tracking-wide text-slate-600 dark:text-purple-200">
            {!isAdminArea && (
              <>
                <Link
                  href={user ? '/users/kids/magazines' : '/#magazines'}
                  className={cn(
                    'flex items-center gap-1.5 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 hover:-translate-y-0.5 transform',
                    pathname.startsWith('/users/kids/magazine') ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''
                  )}
                >
                  <BookOpen className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                  Magazin
                </Link>
                <Link
                  href={user ? '/users/kids#story-editor-section' : '/#story'}
                  className={cn(
                    'flex items-center gap-1.5 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 hover:-translate-y-0.5 transform',
                    pathname === '/users/kids' && !pathname.includes('magazine') ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''
                  )}
                >
                  <Sparkles className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
                  Story
                </Link>
                <Link
                  href="/melody-world"
                  className={cn(
                    'flex items-center gap-1.5 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 hover:-translate-y-0.5 transform',
                    pathname.startsWith('/melody-world') ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''
                  )}
                >
                  <Music className="h-3.5 w-3.5 text-pink-500 dark:text-pink-400" />
                  Melody World
                </Link>
                <Link
                  href="/games"
                  className={cn(
                    'flex items-center gap-1.5 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 hover:-translate-y-0.5 transform group',
                    pathname.startsWith('/games') ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''
                  )}
                >
                  <Gamepad2 className="h-4 w-4 text-cyan-500 dark:text-cyan-400 group-hover:rotate-12 transition-transform" />
                  <span>Games</span>
                </Link>
              </>
            )}

            {user && (
              <>
                {(user.role === ROLES.KID || user.role === ROLES.FAMILY || user.role === ROLES.TEACHER) && (
                  <Link
                    href={
                      user.role === ROLES.KID || user.role === ROLES.FAMILY
                        ? '/users/kids'
                        : '/users/teachers'
                    }
                    className="flex items-center gap-1.5 text-purple-700 dark:text-emerald-400 font-extrabold bg-purple-100 dark:bg-purple-900/60 px-3.5 py-1.5 rounded-full border border-purple-200 dark:border-purple-700/60 hover:bg-purple-200 dark:hover:bg-purple-800/80 transition-all shadow-inner hover:-translate-y-0.5"
                  >
                    <Compass className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                    My Portal
                  </Link>
                )}
                {user.role === ROLES.ADMIN && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 text-indigo-300 font-extrabold bg-indigo-950/70 px-3.5 py-1.5 rounded-full border border-indigo-700/60 hover:bg-indigo-900 transition-all hover:-translate-y-0.5"
                  >
                    <Shield className="h-4 w-4" />
                    Admin Console
                  </Link>
                )}
                {user.role === ROLES.SUPERADMIN && (
                  <Link
                    href="/superadmin"
                    className="flex items-center gap-1.5 text-purple-200 font-extrabold bg-purple-950 px-3.5 py-1.5 rounded-full border border-purple-500/80 hover:bg-purple-900 transition-all hover:-translate-y-0.5"
                  >
                    <Shield className="h-4 w-4 text-purple-300" />
                    Root Security
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Desktop Right CTA Section */}
          <div className="flex items-center gap-3">
            <ThemeToggle variant="icon" />

            {/* Glowing Points in Navbar */}
            <div
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 px-3.5 py-1.5 rounded-full font-display font-black text-xs shadow-md shadow-amber-400/20 border border-yellow-200 animate-in fade-in transition-all hover:scale-105 select-none"
              title={`${points} Glowing Points`}
            >
              <Trophy className="h-3.5 w-3.5 fill-slate-950 text-slate-950" />
              <span>{points} Points</span>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <Badge variant={getRoleBadgeVariant(user.role)} className="shadow-sm">
                  {user.role}
                </Badge>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login">
                  <Button
                    variant="magic"
                    size="sm"
                    className="text-xs h-10 px-5 shadow-sm"
                  >
                    Sign In
                  </Button>
                </Link>

                <Link href="/auth/register">
                  <Button
                    variant="emerald"
                    size="default"
                    className="text-xs sm:text-sm font-black tracking-wide"
                  >
                    Start 7 Day Trial
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          RESPONSIVE PHONE & TABLET TOP BAR (< 1024px)
          ========================================================================= */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 dark:bg-[#0f0728] border-b-2 border-slate-200/80 dark:border-purple-900/60 px-4 sm:px-6 h-14 flex items-center justify-between shadow-sm dark:shadow-md transition-colors">
        <Link href={logoHref} className="flex items-center gap-2">
          <div className="relative h-9 w-9 shrink-0">
            <Image
              src="/images/logo.png"
              alt="Selam Kids Logo"
              fill
              sizes="36px"
              className="object-contain drop-shadow-sm"
              priority
            />
          </div>
          <span className="font-display font-black text-lg text-slate-900 dark:text-white">
            Selam<span className="text-emerald-500 dark:text-emerald-400">Kids</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Mobile Points Badge */}
          <div
            className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 px-2.5 py-1 rounded-full font-display font-black text-xs shadow-sm border border-yellow-200 select-none"
            title={`${points} Points`}
          >
            <Trophy className="h-3 w-3 fill-slate-950 text-slate-950" />
            <span>{points} pts</span>
          </div>

          <ThemeToggle variant="compact" />
          {!user && (
            <Link href="/auth/login">
              <Button variant="magic" size="sm" className="h-8 px-3.5 text-xs font-black">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* =========================================================================
          RESPONSIVE PHONE & TABLET BOTTOM NAVBAR (< 1024px)
          Exactly 3 Buttons: [Home] [Apps (Centered Super App Launcher)] [Profile]
          ========================================================================= */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#0f0728]/95 backdrop-blur-xl border-t-2 border-slate-200/80 dark:border-purple-900/70 shadow-[0_-8px_25px_rgba(0,0,0,0.12)] px-4 h-16 grid grid-cols-3 items-center transition-colors pb-safe"
      >
        {/* 1. HOME (Left) */}
        <Link
          href={logoHref}
          onClick={() => setIsSuperAppOpen(false)}
          className={cn(
            'flex flex-col items-center justify-center py-1 rounded-xl transition-all',
            isActiveHome && !isSuperAppOpen
              ? 'text-emerald-600 dark:text-emerald-400 font-black scale-105'
              : 'text-slate-600 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white'
          )}
        >
          <Home className="h-5 w-5 mb-0.5" />
          <span className="text-[11px] font-display font-bold">Home</span>
        </Link>

        {/* 2. APPS (Center - Elevated Super App Button) */}
        <div className="flex justify-center items-center">
          <button
            type="button"
            onClick={() => setIsSuperAppOpen((prev) => !prev)}
            aria-label="Open Super App Launcher"
            aria-expanded={isSuperAppOpen}
            className="relative -top-3.5 flex flex-col items-center justify-center focus:outline-none group cursor-pointer"
          >
            <div
              className={cn(
                'h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 group-hover:scale-105 group-active:scale-95 border-2',
                isSuperAppOpen
                  ? 'bg-emerald-500 text-white shadow-emerald-500/50 border-white ring-4 ring-emerald-300 dark:ring-emerald-700'
                  : 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 shadow-emerald-500/40 border-white dark:border-[#0f0728]'
              )}
            >
              {isSuperAppOpen ? (
                <X className="h-6 w-6 text-white stroke-[2.5]" />
              ) : (
                <LayoutGrid className="h-6 w-6 text-slate-950 stroke-[2.5]" />
              )}
            </div>
            <span
              className={cn(
                'text-[11px] font-display font-extrabold mt-0.5 transition-colors',
                isSuperAppOpen || isActiveApps
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-700 dark:text-purple-200'
              )}
            >
              Apps
            </span>
          </button>
        </div>

        {/* 3. PROFILE (Right) */}
        <Link
          href={profileHref}
          onClick={() => setIsSuperAppOpen(false)}
          className={cn(
            'flex flex-col items-center justify-center py-1 rounded-xl transition-all',
            isActiveProfile && !isSuperAppOpen
              ? 'text-emerald-600 dark:text-emerald-400 font-black scale-105'
              : 'text-slate-600 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white'
          )}
        >
          {user?.avatarUrl ? (
            <div className="relative h-5 w-5 mb-0.5 rounded-full overflow-hidden ring-1 ring-emerald-400">
              <Avatar
                size="sm"
                src={user.avatarUrl}
                fallback={user.fullName || user.email}
              />
            </div>
          ) : (
            <UserIcon className="h-5 w-5 mb-0.5" />
          )}
          <span className="text-[11px] font-display font-bold">Profile</span>
        </Link>
      </nav>

      {/* =========================================================================
          SUPER APP MODAL / DRAWER (< 1024px)
          Opens when user taps "Apps" in the center of mobile navbar
          ========================================================================= */}
      {isSuperAppOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Selam Super App Launcher"
        >
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsSuperAppOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative z-10 w-full max-h-[85vh] bg-white dark:bg-[#120a30] rounded-t-[32px] border-t-2 border-slate-200/90 dark:border-purple-800/80 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Top Drag Handle */}
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-12 h-1.5 bg-slate-300 dark:bg-purple-800 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-purple-900/40">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
                  <LayoutGrid className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-slate-900 dark:text-white leading-tight">
                    Selam Super App
                  </h3>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-purple-300/80">
                    All games, stories, magazines & tools
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSuperAppOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 dark:bg-purple-900/60 text-slate-600 dark:text-purple-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-purple-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Super App Grid */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {superApps.map((app) => (
                  <Link
                    key={app.id}
                    href={app.href}
                    onClick={() => setIsSuperAppOpen(false)}
                    className="flex flex-col items-center text-center p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1040]/70 hover:bg-emerald-50/70 dark:hover:bg-purple-900/40 border border-slate-200/70 dark:border-purple-800/50 active:scale-95 transition-all group relative overflow-hidden"
                  >
                    <div
                      className={cn(
                        'h-12 w-12 rounded-2xl flex items-center justify-center mb-1.5 shadow-sm transition-transform group-hover:scale-110',
                        app.iconBg
                      )}
                    >
                      <app.icon className="h-6 w-6" />
                    </div>

                    <span className="font-display font-extrabold text-xs sm:text-[13px] text-slate-900 dark:text-white leading-tight line-clamp-1">
                      {app.title}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Install PWA App Action inside Drawer */}
              <button
                type="button"
                onClick={() => {
                  setIsSuperAppOpen(false);
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('selam-kids-open-install'));
                  }
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-display text-xs font-black shadow-md shadow-purple-600/30 cursor-pointer active:scale-98 transition-all my-2"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Download className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="leading-tight">Install Selam Kids App</div>
                    <div className="text-[10px] text-purple-200 font-medium">Add to phone home screen</div>
                  </div>
                </div>
                <span className="text-[10px] bg-yellow-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                  Install
                </span>
              </button>

              {/* Bottom Quick Bar inside Drawer */}
              <div className="pt-2 border-t border-slate-100 dark:border-purple-900/40">
                {user ? (
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-900/50">
                    <Avatar
                      fallback={user.fullName || user.email}
                      src={user.avatarUrl}
                      size="sm"
                    />
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">
                        {user.fullName || user.email}
                      </div>
                      <div className="text-[10px] text-purple-600 dark:text-purple-300 font-bold uppercase tracking-wider">
                        {user.role} Explorer
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsSuperAppOpen(false)}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-purple-900/40 text-slate-900 dark:text-white text-xs font-black text-center hover:bg-slate-200 dark:hover:bg-purple-900/70 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsSuperAppOpen(false)}
                      className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black text-center shadow-md transition-colors"
                    >
                      Start Free Trial
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
