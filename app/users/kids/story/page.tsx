import { requireAuth } from '@/backend/auth/guards';
import { KidService } from '@/backend/services/kid.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { Trophy } from 'lucide-react';
import { StoryPosters } from '@/components/users/story-posters';

export const metadata = {
  title: 'Illustrated Stories | Selam Kids',
  description: 'Read exciting illustrated stories for kids with friendly animals and adventures.',
};

export default async function KidStoryPage() {
  const user = await requireAuth();
  const kidService = new KidService();
  const kid = await kidService.getMyProfile(user);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-20 sm:pb-16">
      {/* Top Header */}
      <PageHeader
        title="Illustrated Stories"
        description="Choose a story below to begin your illustrated adventure!"
        breadcrumbs={[
          { label: 'Kids HQ', href: '/users/kids' },
          { label: 'Illustrated Stories' },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-1.5 text-slate-950 shadow-md font-display font-black text-xs border border-emerald-300">
              <Trophy className="h-4 w-4 fill-slate-950" />
              <span>{kid.orbs} Points</span>
            </div>
          </div>
        }
      />

      {/* 2 Story Posters Display */}
      <StoryPosters />
    </div>
  );
}
