'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Eye, ArrowRight, Library, Search } from 'lucide-react';
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

  // Filter based on search query if child types in search box
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
      {/* Search & Quick Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-[#120733] border-2 border-slate-200 dark:border-purple-800/70 p-4 rounded-3xl shadow-sm">
        <div className="flex items-center gap-2 text-slate-600 dark:text-purple-200 text-xs font-bold">
          <Library className="h-4 w-4 text-emerald-500" />
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{filteredIssues.length}</strong> of{' '}
            {allIssues.length} Published Issues
          </span>
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-purple-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search issue or topic..."
            aria-label="Search magazines"
            className="w-full pl-9 pr-4 py-2 text-xs rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-purple-700/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredIssues.length === 0 && (
        <div className="py-16 px-6 text-center rounded-4xl bg-white dark:bg-[#150a3b] border-2 border-dashed border-slate-300 dark:border-purple-800 space-y-4 max-w-md mx-auto">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300">
            <BookOpen className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-black text-lg text-slate-900 dark:text-white">
              {searchQuery ? 'No Matching Issues Found' : 'No Magazines Published Yet'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-purple-200 leading-relaxed">
              {searchQuery
                ? `We couldn't find any issues matching "${searchQuery}". Try searching for another creature, topic, or issue number!`
                : 'New Selam Kids issues are published every month! Check back soon or visit Kids HQ to write stories.'}
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-2 cursor-pointer"
            >
              Clear search filter
            </button>
          )}
        </div>
      )}

      {/* Magazine Responsive Grid */}
      {filteredIssues.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
          {filteredIssues.map((magazine) => {
            return (
              <div
                key={magazine.id}
                role="article"
                aria-label={`${magazine.title}, Issue ${magazine.issueNumber}`}
                className="group flex flex-col justify-between rounded-3xl bg-white dark:bg-[#14083a] border-2 border-slate-200 dark:border-purple-800/70 p-4 shadow-sm hover:shadow-xl dark:hover:shadow-purple-900/40 transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Magazine Cover Card (Clickable) */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpenIssue(magazine.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenIssue(magazine.id);
                    }
                  }}
                  className="relative cursor-pointer rounded-2xl overflow-hidden outline-none focus-visible:ring-4 focus-visible:ring-emerald-400 transition-transform duration-300"
                >
                  {/* Glossy Cover Canvas */}
                  <div
                    className={`relative w-full h-[360px] rounded-2xl p-1 bg-gradient-to-b ${
                      magazine.borderGradient || 'from-amber-300 via-purple-500 to-amber-300'
                    } shadow-md`}
                  >
                    {/* Inner Cover Art */}
                    <div
                      className={`relative w-full h-full rounded-[14px] overflow-hidden bg-gradient-to-br ${magazine.gradient} p-4 flex flex-col justify-between border border-white/20 text-white select-none`}
                    >
                      {/* Top Masthead */}
                      <div className="text-center space-y-0.5 relative z-10">
                        <div className="flex items-center justify-between text-[8px] uppercase font-black tracking-widest text-purple-200 border-b border-white/20 pb-0.5">
                          <span>ISSUE #{magazine.issueNumber}</span>
                          <span>{magazine.releaseDate}</span>
                        </div>
                        <h4 className="font-display font-black text-lg text-yellow-300 tracking-wider drop-shadow-sm mt-0.5">
                          SELAM KIDS
                        </h4>
                        <span className="text-[9px] uppercase font-bold tracking-wider text-purple-100 block truncate">
                          {magazine.editionName}
                        </span>
                      </div>

                      {/* Main Character */}
                      <div className="relative flex-1 flex items-center justify-center my-1">
                        <div className="relative w-36 h-36 group-hover:scale-105 transition-transform duration-300">
                          <Image
                            src={magazine.characterMain.src}
                            alt={magazine.characterMain.alt}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                          />
                        </div>

                        {magazine.characterSecondary && (
                          <div className="absolute -bottom-1 -right-1 w-14 h-14 group-hover:scale-110 transition-transform duration-300">
                            <Image
                              src={magazine.characterSecondary.src}
                              alt={magazine.characterSecondary.alt}
                              fill
                              sizes="56px"
                              className="object-contain drop-shadow-md"
                            />
                          </div>
                        )}
                      </div>

                      {/* Cover Story Strip */}
                      <div className="relative z-10 bg-slate-950/80 backdrop-blur-sm p-2 rounded-xl border border-white/20 space-y-0.5">
                        <span className="text-[8px] font-black text-amber-300 uppercase tracking-widest block">
                          ★ COVER STORY
                        </span>
                        <h5 className="font-display font-black text-xs text-white line-clamp-1">
                          {magazine.title}
                        </h5>
                      </div>

                      {/* Hover Pill "Click to Read" */}
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-20">
                        <span className="btn-3d btn-3d-yellow flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-display font-black text-slate-950 shadow-xl scale-95 group-hover:scale-100 transition-transform">
                          <Eye className="h-3.5 w-3.5" />
                          CLICK TO READ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Details & Clear Click Action */}
                <div className="pt-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-purple-300 font-semibold">
                    <span>{magazine.releaseDate}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Issue #{magazine.issueNumber}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-sm text-slate-900 dark:text-white line-clamp-2 leading-tight">
                    {magazine.title}
                  </h3>

                  <p className="text-[11px] text-slate-600 dark:text-purple-200/80 font-medium line-clamp-1">
                    {magazine.editionName}
                  </p>

                  <div className="pt-1">
                    <Link
                      href={`/users/kids/magazine/${magazine.id}`}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-50 dark:bg-purple-900/50 hover:bg-emerald-500 hover:text-white text-purple-700 dark:text-purple-200 text-xs font-display font-bold transition-colors group-hover:bg-emerald-500 group-hover:text-white"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Read This Issue</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
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
