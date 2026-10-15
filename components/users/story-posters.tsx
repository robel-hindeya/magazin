'use client';

import * as React from 'react';
import Image from 'next/image';
import { BookOpen, Sparkles, Heart, X, Volume2, VolumeX, ArrowRight, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface StoryItem {
  id: string;
  storyNumber: number;
  title: string;
  amharicTitle?: string;
  subtitle: string;
  image: string;
  badge: string;
  badgeColor: string;
  readTime: string;
  synopsis: string;
  paragraphs: string[];
  moral: string;
}

export const STORIES_DATA: StoryItem[] = [
  {
    id: 'clever-mice-cat',
    storyNumber: 1,
    title: 'The Clever Mice & The Gentleman Cat',
    amharicTitle: 'የብልሆቹ አይጦችና የጨዋው ድመት ተረት',
    subtitle: 'A cozy tale of wit, secret hideaways, and an unexpected tea-time friendship.',
    image: '/images/stories/story-poster-1.jpg',
    badge: 'Featured Story #1',
    badgeColor: 'bg-amber-400 text-slate-950 border-amber-300',
    readTime: '3 Min Read',
    synopsis:
      'Three little mice peeking out of cozy wall arches discover that the dapper cat in a top hat came bearing cheddar and polite conversation!',
    paragraphs: [
      'Deep inside the warm wooden baseboard of the sunny parlor lived three clever little mice: Pip, Squeak, and Barnaby. For days, they had heard soft pitter-pat steps outside their three little arched doorways.',
      'One bright afternoon, Pip took a brave peek. Sitting right by the golden sunbeam was Mr. Whiskerkins, a grand ginger cat dressed in a splendid grey top hat and a dapper blue bow tie!',
      '“Oh my whiskers! Is he going to chase us?” squeaked little Pip, ducking back into the safety of the baseboard.',
      'Barnaby peered through the middle arch and chuckled softly, “Look closer, Pip! He is not crouching or pouncing. He has set down a wooden plate with roasted sunflower seeds and fresh golden cheddar slices!”',
      'Mr. Whiskerkins tipped his miniature top hat politely and purred with a gentle smile, “Good afternoon, little neighbors. In this house, gentle cats never chase friends. Would you care to join me for an afternoon tea?”',
      'The three little mice stepped into the warm sunshine. From that unforgettable day onward, the mice and the gentleman cat shared stories, cheese, and giggles by the window every single afternoon.',
    ],
    moral: 'Kindness and polite hearts turn even the most surprising strangers into lifelong best friends.',
  },
  {
    id: 'picnic-frog-pond',
    storyNumber: 2,
    title: 'The Picnic at Lily Pad Pond',
    amharicTitle: 'የአይጦቹና የእንቁራሪቶቹ ድንቅ ድግስ',
    subtitle: 'Two adventurous mice share a riverside feast with friendly frog neighbors.',
    image: '/images/stories/story-poster-2.jpg',
    badge: 'Featured Story #2',
    badgeColor: 'bg-emerald-400 text-slate-950 border-emerald-300',
    readTime: '4 Min Read',
    synopsis:
      'Mimi and Milo carried their tiny picnic table to the lake, where two green frogs leaped up to share songs, cheese, and berry sweets!',
    paragraphs: [
      'On a breezy morning filled with wildflower scents, Mimi and Milo decided to go on a grand expedition. Together, they carried their tiny hand-carved picnic table all the way to the water’s edge at Lily Pad Pond.',
      'Upon the wooden tabletop, they placed their prized treasures: a wedge of golden Swiss cheese, sweet red berries fresh from the bramble bushes, and crisp yellow lemon slices.',
      'Just as Milo was about to take his first delicious bite, the cool blue water rippled with gentle rings. Pop! Pop! Two friendly green frogs poked their heads above the surface with big shining eyes and broad smiles.',
      '“Ribbit! Good morning, little wanderers!” called Ferdinand the frog, waving a cheerful webbed hand. Beside him, his brother Barnaby splashed playfully among the floating green lily pads.',
      '“Hello down there!” called Mimi warmly. “Would you like to come share our cheese, berries, and sunshine with us?”',
      '“We would be delighted!” Ferdinand cheered. “And in return, we will sing you our favorite pond melody on the cattail reeds!”',
      'The mice and the frogs spent the entire afternoon feasting, laughing, and singing sweet songs by the sparkling pond, proving that sharing your blessings makes every picnic twice as delicious.',
    ],
    moral: 'Sharing what you have makes every meal sweeter and brings joyful songs to every friendship.',
  },
];

export function StoryPosters() {
  const [selectedStory, setSelectedStory] = React.useState<StoryItem | null>(null);
  const [isReadingSpeech, setIsReadingSpeech] = React.useState(false);
  const [likes, setLikes] = React.useState<Record<string, number>>({
    'clever-mice-cat': 342,
    'picnic-frog-pond': 489,
  });
  const [hasLiked, setHasLiked] = React.useState<Record<string, boolean>>({});

  // Stop speech if modal closes or unmounts
  React.useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleOpenStory = (story: StoryItem) => {
    setSelectedStory(story);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsReadingSpeech(false);
    }
  };

  const handleCloseStory = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsReadingSpeech(false);
    setSelectedStory(null);
  };

  const handleToggleLike = (storyId: string) => {
    setHasLiked((prev) => {
      const current = !!prev[storyId];
      setLikes((l) => ({
        ...l,
        [storyId]: l[storyId] + (current ? -1 : 1),
      }));
      return { ...prev, [storyId]: !current };
    });
  };

  const handleToggleSpeech = (story: StoryItem) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isReadingSpeech) {
      window.speechSynthesis.cancel();
      setIsReadingSpeech(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${story.title}. ${story.subtitle}. ${story.paragraphs.join(' ')} Remember: ${story.moral}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.onend = () => setIsReadingSpeech(false);
      utterance.onerror = () => setIsReadingSpeech(false);
      window.speechSynthesis.speak(utterance);
      setIsReadingSpeech(true);
    }
  };

  const handleSwitchStory = (currentId: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsReadingSpeech(false);
    const other = STORIES_DATA.find((s) => s.id !== currentId) || STORIES_DATA[0];
    setSelectedStory(other);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 2 Story Posters Grid: Left and Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
        {STORIES_DATA.map((story) => (
          <div
            key={story.id}
            onClick={() => handleOpenStory(story)}
            className="group relative flex flex-col rounded-4xl bg-white dark:bg-[#12092e] border-4 border-purple-200/90 dark:border-purple-800/80 shadow-xl hover:shadow-2xl hover:border-emerald-400 dark:hover:border-emerald-400 transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1.5"
          >
            {/* Poster Image Container */}
            <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
              <Image
                src={story.image}
                alt={story.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                priority
              />

              {/* Gradient Overlay for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Badge Top Left */}
              <div className="absolute top-4 left-4 z-10">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-display font-black text-xs uppercase tracking-wider shadow-lg border',
                    story.badgeColor
                  )}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{story.badge}</span>
                </span>
              </div>

              {/* Read Time Top Right */}
              <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-bold text-xs shadow-md border border-white/20">
                  <Clock className="h-3.5 w-3.5 text-amber-300" />
                  <span>{story.readTime}</span>
                </span>
              </div>

              {/* Title & Quick Read on Poster bottom */}
              <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 drop-shadow-md">
                    Illustrated Tale
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-300 font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-300" />
                    <span>5.0 Rating</span>
                  </div>
                </div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-white drop-shadow-lg leading-tight mt-1 line-clamp-2">
                  {story.title}
                </h3>
              </div>
            </div>

            {/* Poster Footer Card */}
            <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 gap-4 bg-gradient-to-b from-white to-purple-50/50 dark:from-[#12092e] dark:to-[#170a38]">
              <div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-purple-200/90 leading-relaxed font-medium">
                  {story.subtitle}
                </p>
                {story.amharicTitle && (
                  <p className="text-xs text-purple-700 dark:text-purple-300 font-bold mt-1.5">
                    {story.amharicTitle}
                  </p>
                )}
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-purple-100 dark:border-purple-800/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-purple-300">
                  <Heart
                    className={cn(
                      'h-4 w-4',
                      hasLiked[story.id]
                        ? 'fill-rose-500 text-rose-500'
                        : 'text-slate-400 dark:text-purple-400'
                    )}
                  />
                  <span>{likes[story.id]} Kids Liked</span>
                </div>

                <Button
                  variant="magic"
                  size="default"
                  className="font-black text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:scale-105 transition-transform"
                >
                  <BookOpen className="h-4 w-4 fill-slate-950" />
                  <span>Tap to Read Story</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================================
          FULL ILLUSTRATED STORY READING MODAL
          ===================================================================== */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#12092e] rounded-4xl border-4 border-purple-300 dark:border-purple-700 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-900 via-indigo-950 to-purple-950 text-white flex items-center justify-between border-b border-purple-800 shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <span
                  className={cn(
                    'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider',
                    selectedStory.badgeColor
                  )}
                >
                  Story #{selectedStory.storyNumber}
                </span>
                <span className="text-xs text-purple-200 font-medium">
                  {selectedStory.readTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Text to Speech Narration */}
                {typeof window !== 'undefined' && 'speechSynthesis' in window && (
                  <button
                    onClick={() => handleToggleSpeech(selectedStory)}
                    className={cn(
                      'p-2 rounded-full border transition-all cursor-pointer',
                      isReadingSpeech
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 animate-pulse'
                        : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                    )}
                    title={isReadingSpeech ? 'Pause Read-Aloud' : 'Read Aloud to Me'}
                  >
                    {isReadingSpeech ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </button>
                )}

                <button
                  onClick={handleCloseStory}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Close Story"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Story Content */}
            <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
              {/* Story Poster Illustration */}
              <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-lg border-2 border-purple-200 dark:border-purple-800/80 bg-slate-950">
                <Image
                  src={selectedStory.image}
                  alt={selectedStory.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover"
                />
              </div>

              {/* Title & Amharic Title */}
              <div className="text-center space-y-1">
                <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white leading-tight">
                  {selectedStory.title}
                </h2>
                {selectedStory.amharicTitle && (
                  <p className="font-display font-bold text-base text-emerald-600 dark:text-emerald-400">
                    {selectedStory.amharicTitle}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-slate-500 dark:text-purple-300 font-medium max-w-lg mx-auto pt-1">
                  {selectedStory.subtitle}
                </p>
              </div>

              {/* Story Paragraphs */}
              <div className="space-y-4 pt-2">
                {selectedStory.paragraphs.map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="text-sm sm:text-base text-slate-700 dark:text-purple-100 font-sans leading-relaxed tracking-normal"
                  >
                    {idx === 0 && (
                      <span className="font-display font-black text-2xl sm:text-3xl text-purple-600 dark:text-purple-400 float-left mr-2 leading-none">
                        {paragraph.charAt(0)}
                      </span>
                    )}
                    {idx === 0 ? paragraph.slice(1) : paragraph}
                  </p>
                ))}
              </div>

              {/* Moral Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/80 flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm font-black">
                  💡
                </div>
                <div>
                  <h4 className="font-display font-black text-xs sm:text-sm text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                    Story Lesson
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 font-medium mt-0.5 leading-relaxed">
                    {selectedStory.moral}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#180b3a] border-t border-purple-100 dark:border-purple-800/60 flex items-center justify-between shrink-0">
              <button
                onClick={() => handleToggleLike(selectedStory.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-purple-900/40 border border-slate-200 dark:border-purple-700 text-xs font-bold text-slate-800 dark:text-white shadow-sm hover:scale-105 transition-transform cursor-pointer"
              >
                <Heart
                  className={cn(
                    'h-4 w-4',
                    hasLiked[selectedStory.id]
                      ? 'fill-rose-500 text-rose-500'
                      : 'text-slate-400'
                  )}
                />
                <span>
                  {hasLiked[selectedStory.id] ? 'Liked!' : 'Like Story'} (
                  {likes[selectedStory.id]})
                </span>
              </button>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleSwitchStory(selectedStory.id)}
                  variant="outline"
                  size="sm"
                  className="font-bold text-xs gap-1.5"
                >
                  <span>See Next Story</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>

                <Button
                  onClick={handleCloseStory}
                  variant="emerald"
                  size="sm"
                  className="font-black text-xs px-4"
                >
                  Done Reading
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
