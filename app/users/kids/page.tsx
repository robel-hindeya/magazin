import { requireAuth } from '@/backend/auth/guards';
import { KidService } from '@/backend/services/kid.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { PenTool } from 'lucide-react';
import { StoryEditor } from '@/components/users/story-editor';
import { LatestMagazineHero } from '@/components/users/latest-magazine-hero';
import { TypewriterKidTitle } from '@/components/users/typewriter-kid-title';

export default async function KidsDashboardPage() {
  const user = await requireAuth();
  const kidService = new KidService();
  const kid = await kidService.getMyProfile(user);

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10 max-w-7xl pb-24 sm:pb-16 lg:pb-12">
      {/* Top Greeting with Typing Motion on Kid's Name */}
      <PageHeader
        title={
          <TypewriterKidTitle
            prefix="Welcome to Selam Kids,"
            name={kid.nickname || 'Leo Starlight'}
          />
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
      <div id="story-editor-section" className="space-y-3 sm:space-y-5 pt-1 sm:pt-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center shrink-0 text-purple-600 dark:text-purple-400">
              <PenTool className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h3 className="font-display font-black text-slate-900 dark:text-white text-base sm:text-xl lg:text-2xl leading-tight truncate sm:overflow-visible">
              Write for the Next Magazine Issue
            </h3>
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-purple-700 dark:text-purple-200 bg-purple-100 dark:bg-purple-900/60 px-2.5 sm:px-3 py-1 rounded-full shrink-0">
            ★ <span className="hidden sm:inline">Monthly Kid </span>Contest
          </span>
        </div>

        <StoryEditor currentOrbs={kid.orbs} />
      </div>
    </div>
  );
}
