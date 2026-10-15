import { SelamKidsLoader } from '@/components/ui/selam-kids-loader';

export default function MagazinePageLoading() {
  return (
    <div className="flex-1 w-full min-h-[85vh] flex items-center justify-center p-6">
      <SelamKidsLoader
        size="lg"
        message="Opening Selam Kids Magazine..."
        submessage="Getting Lalibela & Ethiopian treasures ready for you!"
      />
    </div>
  );
}
