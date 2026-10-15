import { SelamKidsLoader } from '@/components/ui/selam-kids-loader';

export default function GlobalLoading() {
  return (
    <div className="flex-1 w-full min-h-[70vh] flex items-center justify-center p-6">
      <SelamKidsLoader
        size="lg"
        message="Loading your magical adventure..."
        submessage="Ethiopian wonders & stories are on the way!"
      />
    </div>
  );
}
