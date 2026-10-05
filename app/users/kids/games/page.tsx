import { Suspense } from 'react';
import { Metadata } from 'next';
import { GamesLobby } from '@/components/games/games-lobby';
import { LoadingSpinner } from '@/components/ui/loading';

export const metadata: Metadata = {
  title: 'Games Arcade - Selam Kids Portal',
  description: 'Play fun games and earn glowing orbs for your author profile!',
};

export default function KidsGamesPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[500px] flex items-center justify-center">
          <LoadingSpinner size="lg" message="Loading Arcade..." />
        </div>
      }
    >
      <GamesLobby />
    </Suspense>
  );
}
