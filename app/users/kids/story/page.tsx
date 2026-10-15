import { requireAuth } from '@/backend/auth/guards';
import { KidService } from '@/backend/services/kid.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { Sparkles, Trophy, BookOpen, PenTool, Lightbulb, Compass } from 'lucide-react';
import { StoryEditor } from '@/components/users/story-editor';
import Link from 'next/link';

export const metadata = {
  title: 'Story Studio - Selam Kids',
  description: 'Write your creative stories and heartfelt messages for the next Selam Kids magazine issue!',
};

export default async function KidStoryPage() {
  const user = await requireAuth();
  const kidService = new KidService();
  const kid = await kidService.getMyProfile(user);

  const storyPrompts = [
    {
      title: 'The Great Highland Adventure',
      prompt: 'Imagine journeying across the Simien Mountains with a mythical beast...',
      tag: 'Adventure',
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300',
    },
    {
      title: 'The Starlight Mystery',
      prompt: 'One night, the glowing stars begin singing a secret song over the city...',
      tag: 'Fantasy',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300',
    },
    {
      title: 'A Letter of Gratitude',
      prompt: 'Share what you are most thankful for today and send a blessing to your loved ones...',
      tag: 'Message to God',
      color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-20 sm:pb-16">
      {/* Top Header */}
      <PageHeader
        title="Story Studio"
        description="Write your creative stories and heartfelt messages for the next Selam Kids magazine issue!"
        breadcrumbs={[
          { label: 'Kids HQ', href: '/users/kids' },
          { label: 'Story Studio' },
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

      {/* Monthly Contest Callout Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-900/90 via-indigo-950 to-purple-950 p-5 sm:p-6 text-white border-2 border-purple-700/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/30 shrink-0">
            <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-lg sm:text-xl text-yellow-300">
                Monthly Kid Magazine Contest
              </h2>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                Featured
              </span>
            </div>
            <p className="text-xs sm:text-sm text-purple-200 mt-0.5 max-w-xl">
              Write your story below! Winning stories will be illustrated by our artists and published in the next monthly issue of Selam Kids Magazine.
            </p>
          </div>
        </div>

        <Link
          href="/users/kids/magazines"
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-800/80 hover:bg-purple-700 text-white font-display font-bold text-xs border border-purple-500/50 transition-all shrink-0 shadow-sm"
        >
          <BookOpen className="h-4 w-4" />
          <span>See Magazine Issues</span>
        </Link>
      </div>

      {/* Story Writing Arena Component */}
      <div className="space-y-4">
        <StoryEditor currentOrbs={kid.orbs} />
      </div>

      {/* Story Ideas & Prompts Inspiration */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <h3 className="font-display font-black text-base sm:text-lg">
            Need an idea? Try these fun story starters:
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {storyPrompts.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-[#12092e] border-2 border-purple-100 dark:border-purple-900/60 shadow-sm hover:border-purple-300 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${item.color}`}>
                  {item.tag}
                </span>
                <PenTool className="h-3.5 w-3.5 text-purple-400" />
              </div>
              <h4 className="font-display font-black text-sm text-slate-900 dark:text-white leading-tight">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-purple-300/80 leading-relaxed">
                {item.prompt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
