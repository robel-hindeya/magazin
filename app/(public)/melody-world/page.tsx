import { Suspense } from 'react';
import { Metadata } from 'next';
import { MelodyWorldExperience } from '@/components/melody/melody-world-experience';
import { LoadingSpinner } from '@/components/ui/loading';

export const metadata: Metadata = {
  title: 'Melody World - Music, Sounds & Wonder Playground | Selam Kids',
  description:
    'Step into Melody World! Play musical chimes, discover interactive character sounds, pop vocabulary bubbles, and collect glowing star orbs at Selam Kids.',
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
