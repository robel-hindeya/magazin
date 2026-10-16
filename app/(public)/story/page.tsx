import { Metadata } from 'next';
import { StoryPosters } from '@/components/users/story-posters';
import { PageHeader } from '@/components/dashboard/page-header';

export const metadata: Metadata = {
  title: 'Illustrated Stories - Selam Kids World',
  description:
    'Read exciting illustrated Ethiopian stories for kids with friendly animals, moral fables, and read-aloud audio narration!',
};

export default function PublicStoryPage() {
  return (
    <div className="relative w-full min-h-[calc(100vh-5rem)] night-sky-bg text-slate-900 dark:text-white transition-colors py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Ambient glow backgrounds */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 dark:bg-purple-600/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-1/4 w-[450px] h-[250px] bg-emerald-500/10 dark:bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-5xl space-y-6 sm:space-y-8 pb-20 sm:pb-16">
        <PageHeader
          title="Illustrated Stories"
          description="Choose a story below to begin your illustrated adventure with read-aloud narration!"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Illustrated Stories' },
          ]}
        />

        {/* Interactive Story Posters with Read-Aloud Modal */}
        <StoryPosters />
      </div>
    </div>
  );
}
