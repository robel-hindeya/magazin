import { Suspense } from 'react';
import { Metadata } from 'next';
import { GamesLobby } from '@/components/games/games-lobby';
import { LoadingSpinner } from '@/components/ui/loading';

export const metadata: Metadata = {
  title: 'Games Arcade - Selam Kids World',
  description:
    'Play exciting educational games, vocabulary scramble, memory match, and star orb catching at the Selam Kids Night Zoo Arcade!',
};

export default function GamesPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[calc(100vh-5rem)] night-sky-bg flex items-center justify-center">
          <LoadingSpinner size="lg" message="Entering Night Zoo Arcade..." />
        </div>
      }
    >
      <GamesLobby />
    </Suspense>
  );
}
