import { requireAuth } from '@/backend/auth/guards';
import { KidService } from '@/backend/services/kid.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { MagazineGrid } from '@/components/users/magazine-grid';
import { Trophy } from 'lucide-react';

export const metadata = {
  title: 'Magazine Library | Selam Kids',
  description: 'Explore every Selam Kids edition and revisit your favorite stories, animals, and adventures.',
};

export default async function MagazineLibraryPage() {
  const user = await requireAuth();
  const kidService = new KidService();
  const kid = await kidService.getMyProfile(user);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <PageHeader
        title="Magazine Library"
        description="Explore every Selam Kids edition and revisit your favorite stories, animals, and adventures."
        breadcrumbs={[
          { label: 'Kids HQ', href: '/users/kids' },
          { label: 'Magazine Library' },
        ]}
        actions={
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 px-5 py-2.5 text-slate-950 shadow-md font-display font-black text-sm border-2 border-emerald-300">
            <Trophy className="h-4 w-4 fill-slate-950" />
            <span>{kid.orbs} Glowing Points</span>
          </div>
        }
      />

      {/* Complete Collection of Published Magazines */}
      <MagazineGrid currentOrbs={kid.orbs} />
    </div>
  );
}
