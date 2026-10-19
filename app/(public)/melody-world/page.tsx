import { Suspense } from 'react';
import { Metadata } from 'next';
import { MelodyWorldExperience } from '@/components/melody/melody-world-experience';
import { LoadingSpinner } from '@/components/ui/loading';

export const metadata: Metadata = {
  title: 'Melody World - Ethiopian Cultural Music Materials & Sounds | Selam Kids',
  description:
    'Discover and play traditional Ethiopian cultural music instruments: Krar, Masenqo, Kebero, Washint, Begena, Tsenatsil, and Embilta. See full craftsmanship anatomy and listen to authentic Ethiopian melodies at Selam Kids.',
};

export default function MelodyWorldPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[calc(100vh-5rem)] night-sky-bg flex items-center justify-center">
          <LoadingSpinner size="lg" message="Entering Melody World..." />
        </div>
      }
    >
      <MelodyWorldExperience />
    </Suspense>
  );
}
