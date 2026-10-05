'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  LogOut,
  Shield,
  Compass,
  Settings,
  Home,
  User as UserIcon,
  BookOpen,
  Gamepad2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Dropdown } from '@/components/ui/dropdown';
import { AuthUser } from '@/types/auth';
import { ROLES, UserRole } from '@/backend/constants/roles';
import { cn } from '@/lib/utils';
import { ParentGateButton } from '@/components/navigation/parent-gate-button';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export interface NavbarProps {
  user?: AuthUser | null;
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAdminArea = pathname.startsWith('/admin') || pathname.startsWith('/superadmin');

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

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

  const dropdownItems = [
    {
      label: 'My Settings',
      icon: <Settings className="h-4 w-4 text-purple-600" />,
      onClick: () =>
        router.push(
          user?.role === 'SUPERADMIN'
            ? '/superadmin/settings'
            : user?.role === 'ADMIN'
            ? '/admin/settings'
            : user?.role === 'KID'
            ? '/users/kids/profile#settings'
            : '/users/settings'
        ),
    },
    {
      label: 'Sign Out',
      icon: <LogOut className="h-4 w-4 text-rose-600" />,
      variant: 'destructive' as const,
      onClick: handleLogout,
    },
  ];

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
          <Link href="/" className="flex items-center gap-3 group">
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
                Night Zookeeper Realm
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center space-x-7 font-display font-bold text-sm tracking-wide text-slate-600 dark:text-purple-200">
            {!isAdminArea && (
              <>
                <Link
                  href="/users/kids"
                  className={cn(
                    'flex items-center gap-1.5 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 hover:-translate-y-0.5 transform',
                    pathname === '/users/kids' || pathname === '/users/kids/magazine' ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''
                  )}
                >
                  <BookOpen className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                  Kids
                </Link>
                <Link
                  href="/games"
                  className={cn(
                    'flex items-center gap-1.5 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 hover:-translate-y-0.5 transform group',
                    pathname.startsWith('/games') ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''
                  )}
                >
                  <Gamepad2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 group-hover:rotate-12 transition-transform" />
                  <span>Games</span>
                </Link>
                <ParentGateButton variant="navbar-desktop" />
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

            {user ? (
              <div className="flex items-center gap-3">
                <Badge variant={getRoleBadgeVariant(user.role)} className="shadow-sm">
                  {user.role}
                </Badge>

                <Dropdown
                  trigger={
                    <button className="flex items-center gap-2 rounded-full ring-2 ring-emerald-400 p-0.5 focus:outline-none hover:scale-105 transition-transform cursor-pointer">
                      <Avatar
                        fallback={user.fullName || user.email}
                        src={user.avatarUrl}
                        size="sm"
                      />
                    </button>
                  }
                  items={dropdownItems}
                />
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
        <Link href="/" className="flex items-center gap-2">
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
          <ThemeToggle variant="compact" />
          {user ? (
            <Dropdown
              trigger={
                <button className="rounded-full ring-2 ring-emerald-400 p-0.5 focus:outline-none cursor-pointer">
                  <Avatar
                    fallback={user.fullName || user.email}
                    src={user.avatarUrl}
                    size="sm"
                  />
                </button>
              }
              items={dropdownItems}
            />
          ) : (
            <Link href="/auth/login">
              <Button variant="magic" size="sm" className="h-8 px-3.5 text-xs font-black">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* =========================================================================
          RESPONSIVE PHONE & TABLET BOTTOM NAVBAR ("under" navigation < 1024px)
          (Removed "more", "trial", "how it works")
          ========================================================================= */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 dark:bg-[#0f0728]/95 backdrop-blur-xl border-t-2 border-slate-200/80 dark:border-purple-900/70 shadow-2xl px-4 py-1.5 h-16 flex items-center justify-around transition-colors">
        {/* 1. Home */}
        <Link
          href="/"
          className={cn(
            'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all',
            pathname === '/' ? 'text-emerald-600 dark:text-emerald-400 font-black scale-105' : 'text-slate-600 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white'
          )}
        >
          <Home className="h-5 w-5 mb-0.5" />
          <span className="text-[11px] font-display font-bold">Home</span>
        </Link>

        {/* 2. Kids & 3. Parents */}
        {!isAdminArea && (
          <>
            <Link
              href="/users/kids"
              className={cn(
                'flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all',
                pathname === '/users/kids' || pathname === '/users/kids/magazine'
                  ? 'text-emerald-600 dark:text-emerald-400 font-black scale-105'
                  : 'text-slate-600 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <BookOpen className="h-5 w-5 mb-0.5" />
              <span className="text-[11px] font-display font-bold">Kids</span>
            </Link>

            <Link
              href="/games"
              className={cn(
                'flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all',
                pathname.startsWith('/games')
                  ? 'text-emerald-600 dark:text-emerald-400 font-black scale-105'
                  : 'text-slate-600 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <Gamepad2 className="h-5 w-5 mb-0.5 text-emerald-500 dark:text-emerald-400" />
              <span className="text-[11px] font-display font-bold">Games</span>
            </Link>

            <ParentGateButton variant="navbar-mobile" />
          </>
        )}

        {/* 4. Portal (if signed in) or Sign In (if signed out) */}
        {user ? (
          <Link
            href={
              user.role === ROLES.SUPERADMIN
                ? '/superadmin'
                : user.role === ROLES.ADMIN
                ? '/admin'
                : user.role === ROLES.KID || user.role === ROLES.FAMILY
                ? '/users/kids'
                : '/users/teachers'
            }
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-emerald-600 dark:text-emerald-400 font-black"
          >
            <Compass className="h-5 w-5 mb-0.5" />
            <span className="text-[11px] font-display font-bold">Portal</span>
          </Link>
        ) : (
          <Link
            href="/auth/login"
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-600 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white"
          >
            <UserIcon className="h-5 w-5 mb-0.5" />
            <span className="text-[11px] font-display font-bold">Sign In</span>
          </Link>
        )}
      </nav>
    </>
  );
}
