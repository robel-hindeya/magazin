import { requireAuth } from '@/backend/auth/guards';
import { KidService } from '@/backend/services/kid.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { Trophy, PenTool, Sparkles, Flame, BookOpen } from 'lucide-react';
import { StoryEditor } from '@/components/users/story-editor';
import Link from 'next/link';

export const metadata = {
  title: 'Kids Daily - Selam Kids',
  description: 'Daily creative writing quests and heartfelt messages for Selam Kids explorers.',
};

export default async function KidsDailyPage() {
  const user = await requireAuth();
  const kidService = new KidService();
  const kid = await kidService.getMyProfile(user);

  return (
    <div className="space-y-8 max-w-7xl pb-12">
      {/* Top Header */}
      <PageHeader
        title="Kids Daily Writing Arena"
        description="Write your daily adventure, level up your writing streak, and earn glowing points!"
        breadcrumbs={[
          { label: 'Magazine Lounge', href: '/users/kids' },
          { label: 'Kids Daily' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-4 py-2 text-slate-950 shadow-md font-display font-black text-xs border border-amber-300">
              <Flame className="h-4 w-4 fill-slate-950" />
              <span>5 Day Streak</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 px-4 py-2 text-slate-950 shadow-md font-display font-black text-xs border border-emerald-300">
              <Trophy className="h-4 w-4 fill-slate-950" />
              <span>{kid.orbs} Points</span>
            </div>
          </div>
        }
      />

      {/* Motivational Quick Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-900/90 via-indigo-950 to-purple-950 p-6 text-white border-2 border-purple-700/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/30 shrink-0">
            <Sparkles className="h-7 w-7 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-yellow-300">
              Today&apos;s Daily Writing Mission
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 mt-0.5 max-w-xl">
              Write at least 5 words to earn glowing points! Pick Daily Creative Writing for the monthly magazine contest or send a Message to God.
            </p>
          </div>
        </div>

        <Link
          href="/users/kids"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-800/80 hover:bg-purple-700/80 text-white font-display font-bold text-xs border border-purple-500/50 transition-all shrink-0 shadow-sm"
        >
          <BookOpen className="h-4 w-4 text-emerald-400" />
          <span>View Magazine</span>
        </Link>
      </div>

      {/* Story Writing Arena */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-black text-slate-900 dark:text-white text-2xl flex items-center gap-2">
            <PenTool className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            Write for Today
          </h3>
          <span className="text-xs font-bold text-purple-700 dark:text-purple-200 bg-purple-100 dark:bg-purple-900/60 px-3 py-1 rounded-full">
            ★ Daily Quest
          </span>
        </div>

        <StoryEditor currentOrbs={kid.orbs} />
      </div>
    </div>
  );
}
