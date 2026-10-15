import { requireAuth } from '@/backend/auth/guards';
import { KidService } from '@/backend/services/kid.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { PenTool } from 'lucide-react';
import { StoryEditor } from '@/components/users/story-editor';
import { LatestMagazineHero } from '@/components/users/latest-magazine-hero';

export default async function KidsDashboardPage() {
  const user = await requireAuth();
  const kidService = new KidService();
  const kid = await kidService.getMyProfile(user);

  return (
    <div className="space-y-10 max-w-7xl pb-12">
      {/* Top Greeting */}
      <PageHeader
        title={`Welcome to Selam Kids, ${kid.nickname || 'Explorer'}!`}
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
