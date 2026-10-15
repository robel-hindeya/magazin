import { requireAuth } from '@/backend/auth/guards';
import { KidService } from '@/backend/services/kid.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { MagazineGrid } from '@/components/users/magazine-grid';

export const metadata = {
  title: 'Magazine Library | Selam Kids',
  description: 'Explore every Selam Kids edition and revisit your favorite stories, animals, and adventures.',
};

export default async function MagazineLibraryPage() {
  const user = await requireAuth();
  const kidService = new KidService();
  const kid = await kidService.getMyProfile(user);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto pb-24 sm:pb-20 px-3 sm:px-6">
      {/* Page Header */}
      <PageHeader
        title="Magazine Library"
        description="Explore every Selam Kids edition and revisit your favorite stories, animals, and adventures."
        breadcrumbs={[
          { label: 'Kids HQ', href: '/users/kids' },
          { label: 'Magazine Library' },
        ]}
      />

      {/* Complete Collection of Published Magazines */}
      <MagazineGrid currentOrbs={kid.orbs} />
    </div>
  );
}
