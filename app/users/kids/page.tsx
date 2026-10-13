import { requireAuth } from '@/backend/auth/guards';
import { KidService } from '@/backend/services/kid.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { Trophy, PenTool } from 'lucide-react';
import { StoryEditor } from '@/components/users/story-editor';
import { LatestMagazineHero } from '@/components/users/latest-magazine-hero';

export default async function KidsDashboardPage() {
  const user = await requireAuth();
  const kidService = new KidService();
  const kid = await kidService.getMyProfile(user);

  return (
    <div className="space-y-10 max-w-7xl pb-12">
      {/* Top Greeting & Points Bar */}
      <PageHeader
        title={`Welcome to Selam Kids, ${kid.nickname || 'Explorer'}!`}
        actions={
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 px-5 py-2.5 text-slate-950 shadow-lg shadow-emerald-500/20 font-display font-black text-sm border-2 border-emerald-300">
            <Trophy className="h-4 w-4 fill-slate-950" />
            <span>{kid.orbs} Glowing Points</span>
          </div>
        }
      />

      {/* =========================================================================
          MAIN MAGAZINE EXPERIENCE: LATEST MAGAZINE COVER & COMPACT WELCOME BANNER
          ========================================================================= */}
      <div id="magazine-main-section">
        <LatestMagazineHero currentOrbs={kid.orbs} />
      </div>

      {/* =========================================================================
          STORY WRITING & PUBLISHING ARENA
          ========================================================================= */}
      <div id="story-editor-section" className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-black text-slate-900 dark:text-white text-2xl flex items-center gap-2">
            <PenTool className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            Write for the Next Magazine Issue
          </h3>
          <span className="text-xs font-bold text-purple-700 dark:text-purple-200 bg-purple-100 dark:bg-purple-900/60 px-3 py-1 rounded-full">
            ★ Monthly Kid Contest
          </span>
        </div>

        <StoryEditor currentOrbs={kid.orbs} />
      </div>
    </div>
  );
}
