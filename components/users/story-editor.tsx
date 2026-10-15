'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Send, PenTool, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type WritingMode = 'creative' | 'god';

export function StoryEditor({
  initialPrompt,
  currentOrbs: _currentOrbs,
}: {
  initialPrompt?: string;
  currentOrbs: number;
}) {
  const router = useRouter();
  const [mode, setMode] = React.useState<WritingMode>('creative');
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [reward, setReward] = React.useState<{ orbsEarned: number; words: number; category: string } | null>(null);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || wordCount < 5) return;

    setSubmitting(true);
    const categoryLabel = mode === 'creative' ? 'Daily Creative Writing' : 'Message to God';
    const computedTitle =
      title.trim() ||
      content.trim().split('\n')[0].slice(0, 50) ||
      (mode === 'creative' ? 'Selam Kids Story Adventure' : 'Heartfelt Message to God');
    const promptText = mode === 'creative'
      ? (initialPrompt || 'Creative Story Adventure')
      : 'Prayer & Gratitude to God';

    try {
      const res = await fetch('/api/kids/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: computedTitle,
          content,
          prompt: promptText,
          category: categoryLabel,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReward({
          orbsEarned: data.data.orbsEarned,
          words: data.data.wordCount,
          category: categoryLabel,
        });
        setTitle('');
        setContent('');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-2 sm:border-4 border-purple-200/80 dark:border-purple-800/80 bg-white dark:bg-[#12092e] shadow-xl rounded-2xl sm:rounded-4xl overflow-hidden">
      <CardContent className="p-3.5 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
        {/* CENTER 2 RECTANGULAR BUTTONS TO CHOOSE WRITING TYPE */}
        <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-3 pb-2 pt-0.5 border-b-2 border-purple-100 dark:border-purple-900/60">
          <span className="text-[10px] sm:text-[11px] font-display font-black uppercase tracking-wider text-purple-500 dark:text-purple-300">
            Select Writing Mode:
          </span>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-xl pb-1">
            {/* Rectangle Button 1: Daily Creative Writing */}
            <button
              type="button"
              onClick={() => {
                setMode('creative');
                setReward(null);
              }}
              className={cn(
                'w-full flex items-center justify-center gap-1.5 sm:gap-2.5 px-2 py-2.5 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 font-display text-xs sm:text-sm font-black transition-all cursor-pointer shadow-sm text-center',
                mode === 'creative'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30 ring-2 ring-purple-400/40'
                  : 'bg-purple-50/60 dark:bg-[#1a0e3f] text-slate-700 dark:text-purple-200 border-purple-200/80 dark:border-purple-800/80 hover:bg-purple-100/60 dark:hover:bg-purple-900/50 hover:border-purple-400'
              )}
            >
              <PenTool className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0', mode === 'creative' ? 'text-yellow-300' : 'text-purple-500 dark:text-purple-400')} />
              <span className="truncate">
                <span className="hidden sm:inline">Daily </span>Creative Writing
              </span>
            </button>

            {/* Rectangle Button 2: Message to God */}
            <button
              type="button"
              onClick={() => {
                setMode('god');
                setReward(null);
              }}
              className={cn(
                'w-full flex items-center justify-center gap-1.5 sm:gap-2.5 px-2 py-2.5 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 font-display text-xs sm:text-sm font-black transition-all cursor-pointer shadow-sm text-center',
                mode === 'god'
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-300/60'
                  : 'bg-purple-50/60 dark:bg-[#1a0e3f] text-slate-700 dark:text-purple-200 border-purple-200/80 dark:border-purple-800/80 hover:bg-purple-100/60 dark:hover:bg-purple-900/50 hover:border-emerald-400'
              )}
            >
              <Heart className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 fill-current', mode === 'god' ? 'text-white' : 'text-purple-400')} />
              <span className="truncate">Message to God</span>
            </button>
          </div>
        </div>

        {/* Section Heading & Word Count Badge */}
        <div className="flex items-center justify-between pb-0.5 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className={cn(
              "h-8 w-8 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 shadow-sm",
              mode === 'creative'
                ? "bg-purple-600 text-white shadow-purple-600/30"
                : "bg-emerald-500 text-white shadow-emerald-500/30"
            )}>
              {mode === 'creative' ? <PenTool className="h-4 w-4 sm:h-5 sm:w-5" /> : <Heart className="h-4 w-4 sm:h-5 sm:w-5 fill-white text-white" />}
            </div>
            <div className="min-w-0">
              <h4 className="font-display font-black text-slate-900 dark:text-white text-xs sm:text-lg leading-tight truncate">
                {mode === 'creative' ? 'Creative Writing Arena' : 'Message to God'}
              </h4>
              {mode === 'god' && (
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-purple-300/70 font-medium truncate">
                  Share your prayers & thankfulness
                </p>
              )}
            </div>
          </div>
          <Badge variant="purple" className="text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1 shrink-0">
            Words: {wordCount}
          </Badge>
        </div>

        {/* Success Celebration Reward Box */}
        {reward && (
          <div className="rounded-xl sm:rounded-2xl border-2 p-3.5 sm:p-5 text-center shadow-md animate-bounce bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700">
            <div className="mx-auto flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl shadow-lg mb-2 bg-emerald-500 text-white shadow-emerald-500/30">
              {reward.category === 'Message to God' ? (
                <Heart className="h-5 w-5 sm:h-7 sm:w-7 text-white fill-white" />
              ) : (
                <Trophy className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
              )}
            </div>
            <h4 className="font-display font-black text-base sm:text-xl text-emerald-950 dark:text-emerald-100">
              {reward.category === 'Message to God'
                ? 'Amen! Message to God Sent!'
                : 'Hooray! Story Published!'}
            </h4>
            <p className="text-xs sm:text-sm mt-1 font-bold text-emerald-800 dark:text-emerald-300">
              You wrote <strong className="font-black">{reward.words} words</strong> and earned{' '}
              <strong className="text-emerald-600 dark:text-emerald-400 font-black">+{reward.orbsEarned} Glowing Points!</strong>
            </p>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] sm:text-xs font-display font-black uppercase tracking-wider text-slate-700 dark:text-purple-200">
              {mode === 'creative' ? 'Your Story Adventure' : 'Your Message to God'}
            </label>
            <textarea
              rows={4}
              placeholder={
                mode === 'creative'
                  ? 'Write your adventure here... Describe sights, smells, sounds, and what your creature did!'
                  : 'Dear God, today I want to share with You... (Write your personal prayer, thankfulness, or blessings here)'
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 dark:border-purple-900/80 bg-slate-50/50 dark:bg-[#190b3b] dark:text-white dark:placeholder:text-purple-400/50 p-3 sm:p-4 text-base sm:text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all leading-relaxed"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pt-1">
            <div className="flex items-center justify-center sm:justify-start">
              <span className={cn(
                "text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full text-center transition-all",
                wordCount >= 5
                  ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60"
                  : "text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 dark:border dark:border-purple-800/60"
              )}>
                {wordCount >= 5 ? '✓ Ready to publish & claim points!' : 'Write at least 5 words to publish'}
              </span>
            </div>
            <Button
              type="submit"
              variant="yellow"
              size="lg"
              disabled={submitting || wordCount < 5}
              className="w-full sm:w-auto font-black text-xs sm:text-sm tracking-wide gap-2 h-11 sm:h-12 px-5 sm:px-6 cursor-pointer"
            >
              {submitting ? (
                mode === 'creative' ? 'Publishing Story...' : 'Sending Message...'
              ) : (
                <>
                  <span className="sm:hidden">
                    {mode === 'creative' ? 'Publish Story' : 'Send Message'}
                  </span>
                  <span className="hidden sm:inline">
                    {mode === 'creative' ? 'Publish Story & Claim Points!' : 'Send Message to God & Claim Points!'}
                  </span>
                  <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-900 shrink-0" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
