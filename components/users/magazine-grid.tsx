'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BookOpen, Eye, Search, X } from 'lucide-react';
import { MagazineIssue, getAllMagazines } from './magazine-data';

interface MagazineGridProps {
  magazines?: MagazineIssue[];
  currentOrbs?: number;
  onOrbsUpdated?: (newOrbs: number) => void;
}

export function MagazineGrid({
  magazines,
}: MagazineGridProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoading] = React.useState(false);

  // Load all published magazines, sorted from newest to oldest
  const allIssues = React.useMemo(() => {
    return magazines || getAllMagazines();
  }, [magazines]);

  // Filter based on search query
  const filteredIssues = React.useMemo(() => {
    if (!searchQuery.trim()) return allIssues;
    const q = searchQuery.toLowerCase();
    return allIssues.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.editionName.toLowerCase().includes(q) ||
        m.releaseDate.toLowerCase().includes(q) ||
        String(m.issueNumber).includes(q) ||
        m.theme.toLowerCase().includes(q)
    );
  }, [allIssues, searchQuery]);

  const handleOpenIssue = (magazineId: string) => {
    router.push(`/users/kids/magazine/${magazineId}`);
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center space-y-4">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent" />
        <p className="font-display font-bold text-sm text-slate-600 dark:text-purple-200">
          Loading the Magazine Library...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Minimal Borderless Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-purple-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search magazines..."
          aria-label="Search magazines"
          className="w-full h-11 pl-11 pr-10 text-sm font-medium rounded-full bg-slate-100 dark:bg-purple-950/40 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-purple-400/50 border-0 outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all shadow-sm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredIssues.length === 0 && (
        <div className="py-16 px-6 text-center rounded-3xl bg-slate-50/50 dark:bg-purple-950/20 space-y-3 max-w-md mx-auto">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300">
            <BookOpen className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-black text-base text-slate-900 dark:text-white">
              No Matching Issues Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-purple-300/80 leading-relaxed">
              We couldn&apos;t find any issues matching &ldquo;{searchQuery}&rdquo;.
            </p>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-1 cursor-pointer"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Magazine Responsive Grid: 2, 2 Left and Right Posters */}
      {filteredIssues.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
          {filteredIssues.map((magazine) => {
            return (
              <div
                key={magazine.id}
                role="button"
                tabIndex={0}
                onClick={() => handleOpenIssue(magazine.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenIssue(magazine.id);
                  }
                }}
                aria-label={`Read ${magazine.title}, Issue ${magazine.issueNumber}`}
                className="group relative cursor-pointer outline-none transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-2 focus-visible:ring-4 focus-visible:ring-emerald-400 rounded-2xl sm:rounded-3xl"
              >
                {/* Ambient Multi-Layer Back Glow */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400/20 via-purple-600/20 to-emerald-400/20 blur-xl rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Glossy Cover Canvas */}
                <div
                  className={`relative w-full h-[270px] xs:h-[310px] sm:h-[410px] md:h-[450px] rounded-2xl sm:rounded-3xl p-1 bg-gradient-to-b ${
                    magazine.borderGradient || 'from-amber-300 via-purple-500 to-amber-300'
                  } shadow-xl shadow-purple-950/30 group-hover:shadow-2xl transition-shadow`}
                >
                  {/* Glossy Sheen Overlay */}
                  <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20" />

                  {/* Corner Badge */}
                  {magazine.badge && (
                    <div className="absolute -top-2 -left-1 sm:-top-2.5 sm:-left-2 z-30 transform -rotate-6 group-hover:rotate-0 transition-transform">
                      <span className={`px-2 sm:px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black tracking-wider shadow-md ${magazine.badge.color}`}>
                        {magazine.badge.text}
                      </span>
                    </div>
                  )}

                  {/* Corner Sticker */}
                  {magazine.sticker && (
                    <div className="absolute -top-2 -right-1 sm:-top-2.5 sm:-right-2 z-30 transform rotate-12 group-hover:rotate-0 group-hover:scale-105 transition-all">
                      <span className={`px-2 sm:px-2.5 py-0.5 rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow-md ${magazine.sticker.bg}`}>
                        {magazine.sticker.text}
                      </span>
                    </div>
                  )}

                  {/* Inner Cover Art */}
                  <div
                    className={`relative w-full h-full rounded-[18px] sm:rounded-[22px] overflow-hidden bg-gradient-to-br ${magazine.gradient} p-2.5 xs:p-3 sm:p-5 flex flex-col justify-between border-2 border-white/25 text-white select-none`}
                  >
                    {/* Top Masthead */}
                    <div className="text-center space-y-0.5 relative z-10">
                      <div className="flex items-center justify-between text-[7px] sm:text-[9px] uppercase font-black tracking-widest text-purple-200 border-b border-white/20 pb-0.5 sm:pb-1">
                        <span>ISSUE #{String(magazine.issueNumber || 1).padStart(2, '0')}</span>
                        <span className="text-emerald-300 font-black">FREE</span>
                      </div>
                      <h4 className="font-display font-black text-sm xs:text-base sm:text-2xl text-yellow-300 tracking-wider drop-shadow-md mt-0.5 sm:mt-1">
                        SELAM KIDS
                      </h4>
                      <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-wider text-purple-100 block truncate">
                        {magazine.editionName}
                      </span>
                    </div>

                    {/* Main Character */}
                    <div className="relative flex-1 flex items-center justify-center my-1 sm:my-2">
                      <div className="relative w-24 h-24 xs:w-28 xs:h-28 sm:w-44 sm:h-44 md:w-50 md:h-50 group-hover:scale-108 transition-transform duration-300">
                        <Image
                          src={magazine.characterMain.src}
                          alt={magazine.characterMain.alt}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 400px"
                          className="object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)] sm:drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
                        />
                      </div>

                      {magazine.characterSecondary && (
                        <div className="absolute -bottom-1 -right-1 w-9 h-9 xs:w-11 xs:h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 group-hover:scale-115 transition-transform duration-300">
                          <Image
                            src={magazine.characterSecondary.src}
                            alt={magazine.characterSecondary.alt}
                            fill
                            sizes="64px"
                            className="object-contain drop-shadow-md"
                          />
                        </div>
                      )}
                    </div>

                    {/* Hover Pill "CLICK TO READ" */}
                    <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-30">
                      <span className="btn-3d btn-3d-yellow flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full text-[10px] sm:text-xs font-display font-black text-slate-950 shadow-2xl whitespace-nowrap scale-95 group-hover:scale-100 transition-transform">
                        <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        READ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
