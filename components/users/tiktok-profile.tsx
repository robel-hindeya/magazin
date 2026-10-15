'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Share2,
  Grid3X3,
  Bookmark,
  Award,
  Sliders,
  CheckCircle2,
  Heart,
  Eye,
  Sparkles,
  Camera,
  Play,
  LogOut,
  X,
  Copy,
  Check,
  Palette,
  Shield,
  BookOpen,
  Pin,
  Flame,
  MessageCircle,
} from 'lucide-react';
import { AuthUser } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { CREATURE_CHARACTERS, CreatureCharacter } from '@/components/users/creature-customizer-form';
import { getAllMagazines } from '@/components/users/magazine-data';
import { cn } from '@/lib/utils';

export interface KidProfileData {
  id: string;
  user_id: string;
  nickname: string;
  age: number;
  grade_level: string;
  reading_level: string;
  orbs: number;
  words_written: number;
  creature_name?: string | null;
  creature_type?: string | null;
  creature_image_url?: string | null;
}

export interface TikTokProfileProps {
  user: AuthUser;
  kid: KidProfileData;
  accountIdentifier: string;
  updateCreatureAction: (formData: FormData) => Promise<void>;
  updateProfileNameAction: (formData: FormData) => Promise<void>;
  savedStatus?: string;
}

interface UserStory {
  id: string;
  title: string;
  category: string;
  preview: string;
  fullStory: string;
  views: string;
  likes: number;
  isPinned?: boolean;
  characterImage: string;
  bgGradient: string;
  date: string;
}

const SAMPLE_STORIES: UserStory[] = [
  {
    id: 'story-1',
    title: 'The Golden Lion of Lalibela',
    category: 'Epic Adventure',
    preview: 'High in the rock-hewn heights of Lalibela, Simba roared at the midnight moon...',
    fullStory:
      'High in the rock-hewn heights of Lalibela, Simba roared at the midnight moon. Every stone echoed ancient wisdom, reminding every traveler that courage lives in kindness and brotherhood.',
    views: '2.4K',
    likes: 842,
    isPinned: true,
    characterImage: '/images/characters/simba.png',
    bgGradient: 'from-amber-600 via-orange-600 to-rose-700',
    date: '2d ago',
  },
  {
    id: 'story-2',
    title: 'Flight of the Night Fury',
    category: 'Creature Quest',
    preview: 'Toothless soared through the starry galaxy above Semien Mountains...',
    fullStory:
      'Toothless soared through the starry galaxy above Semien Mountains. With emerald eyes gleaming in the dark realm, they charted forgotten constellations and delivered spark orbs to sleeping explorers.',
    views: '1.8K',
    likes: 615,
    isPinned: false,
    characterImage: '/images/characters/toothless.png',
    bgGradient: 'from-purple-900 via-indigo-900 to-slate-950',
    date: '4d ago',
  },
  {
    id: 'story-3',
    title: 'Kung Fu Dragon Scroll',
    category: 'Martial Comedy',
    preview: 'Po Panda discovered that the secret noodle ingredient was laughter and dedication...',
    fullStory:
      'Po Panda discovered that the secret noodle ingredient was laughter and dedication. No matter how many times you tumble down the hill, you always bounce back stronger with your favorite snacks!',
    views: '950',
    likes: 420,
    isPinned: false,
    characterImage: '/images/characters/po-panda.png',
    bgGradient: 'from-emerald-700 via-teal-800 to-cyan-900',
    date: '1w ago',
  },
  {
    id: 'story-4',
    title: 'Galactic Ohana Expedition',
    category: 'Sci-Fi Fun',
    preview: 'Stitch built a spaceship out of coconut shells and glowing energy crystals...',
    fullStory:
      'Stitch built a spaceship out of coconut shells and glowing energy crystals. "Ohana means family," he cheered as the starry engines ignited, taking the explorer squad to the candy moon.',
    views: '1.1K',
    likes: 512,
    isPinned: false,
    characterImage: '/images/characters/stitch.png',
    bgGradient: 'from-blue-600 via-sky-700 to-indigo-900',
    date: '2w ago',
  },
  {
    id: 'story-5',
    title: 'Banana Thunder Chase',
    category: 'Humor & Fun',
    preview: 'Three Minions accidentally launched a yellow banana rocket over Addis Ababa...',
    fullStory:
      'Three Minions accidentally launched a yellow banana rocket over Addis Ababa. Giggles erupted across the streets as colorful balloons drifted softly onto playgrounds everywhere!',
    views: '3.2K',
    likes: 1240,
    isPinned: false,
    characterImage: '/images/characters/minion.png',
    bgGradient: 'from-yellow-500 via-amber-600 to-red-600',
    date: '3w ago',
  },
  {
    id: 'story-6',
    title: 'Thunderbolt in Bale Mountains',
    category: 'Electric Tale',
    preview: 'Pikachu raced alongside the Ethiopian Wolf under a storm of crackling blue sparks...',
    fullStory:
      'Pikachu raced alongside the Ethiopian Wolf under a storm of crackling blue sparks. Together they protected the rare wild flower of the highlands from the sudden mountain frost.',
    views: '4.6K',
    likes: 1890,
    isPinned: false,
    characterImage: '/images/characters/pikachu.png',
    bgGradient: 'from-amber-400 via-yellow-500 to-orange-600',
    date: '1mo ago',
  },
];

const ACHIEVEMENTS = [
  {
    id: 'badge-1',
    title: 'Lionheart Scribe',
    desc: 'Wrote your first magical story',
    icon: '🦁',
    color: 'from-amber-400 to-orange-500',
    unlocked: true,
  },
  {
    id: 'badge-2',
    title: 'Galaxy Dreamer',
    desc: 'Read 5 complete Selam Kids magazines',
    icon: '🚀',
    color: 'from-purple-500 to-indigo-600',
    unlocked: true,
  },
  {
    id: 'badge-3',
    title: 'Flame of Wisdom',
    desc: 'Maintained a 7-day reading streak',
    icon: '🔥',
    color: 'from-rose-500 to-pink-600',
    unlocked: true,
  },
  {
    id: 'badge-4',
    title: 'Orb Hoarder',
    desc: 'Collected 100+ magical glowing points',
    icon: '✨',
    color: 'from-cyan-400 to-blue-600',
    unlocked: true,
  },
  {
    id: 'badge-5',
    title: 'Night Fury Scout',
    desc: 'Completed all night realm puzzles',
    icon: '🐉',
    color: 'from-slate-700 to-purple-900',
    unlocked: false,
  },
  {
    id: 'badge-6',
    title: 'Grand Master Writer',
    desc: 'Reached 1,000 words written in studio',
    icon: '👑',
    color: 'from-yellow-400 to-amber-600',
    unlocked: false,
  },
];

export function TikTokProfile({
  user,
  kid,
  accountIdentifier,
  updateCreatureAction,
  updateProfileNameAction,
  savedStatus,
}: TikTokProfileProps) {
  const router = useRouter();

  // Active Tab: 0 = Stories (grid), 1 = Magazines (bookmark), 2 = Badges (heart/trophy), 3 = Studio & Settings (gear)
  const [activeTab, setActiveTab] = React.useState<number>(0);

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = React.useState(false);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [selectedStory, setSelectedStory] = React.useState<UserStory | null>(null);
  const [storyLikes, setStoryLikes] = React.useState<Record<string, number>>({});
  const [hasLiked, setHasLiked] = React.useState<Record<string, boolean>>({});

  // Active character state
  const [selectedCharacter, setSelectedCharacter] = React.useState<CreatureCharacter>(() => {
    const found = CREATURE_CHARACTERS.find(
      (c) => c.name.toLowerCase() === (kid.creature_name || '').toLowerCase()
    );
    return found || CREATURE_CHARACTERS[0];
  });

  const [displayName, setDisplayName] = React.useState(user.fullName || kid.nickname || 'Explorer');
  const [nickname, setNickname] = React.useState(kid.nickname || 'Leo');
  const cleanGrade = (kid.grade_level || 'Grade 3').replace(/^Grade\s*/i, '');
  const [bioText, setBioText] = React.useState(
    `✨ Magical Story Creator & Beast Whisperer 🐾 | Grade ${cleanGrade} Explorer 🦁`
  );

  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // All published magazines
  const magazines = React.useMemo(() => getAllMagazines(), []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
      setIsLoggingOut(false);
    }
  };

  const handleCopyProfileLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleToggleLike = (storyId: string) => {
    setHasLiked((prev) => {
      const already = !!prev[storyId];
      setStoryLikes((likes) => ({
        ...likes,
        [storyId]: (likes[storyId] || 0) + (already ? -1 : 1),
      }));
      return { ...prev, [storyId]: !already };
    });
  };

  const currentAvatarSrc =
    user.avatarUrl ||
    selectedCharacter.imageUrl ||
    kid.creature_image_url ||
    '/images/characters/simba.png';

  const userHandle = `@${nickname.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'explorer'}`;

  return (
    <div className="max-w-md sm:max-w-xl mx-auto min-h-screen bg-white dark:bg-[#0f0728] text-slate-900 dark:text-white rounded-3xl sm:border border-purple-200/80 dark:border-purple-900/60 shadow-2xl overflow-hidden transition-colors relative pb-28">

      {savedStatus && (
        <div className="mx-4 mt-3 rounded-xl bg-emerald-500 text-white text-xs font-black py-2 px-3 text-center shadow-md animate-fade-in">
          ✨ Profile updated successfully!
        </div>
      )}

      {/* =====================================================================
          TIKTOK PROFILE HERO SECTION (Selam Kids Brand Colors)
          ===================================================================== */}
      <div className="pt-8 pb-4 px-4 flex flex-col items-center text-center">
        {/* Large Avatar (Clean, visible on mobile & desktop) */}
        <div className="relative group cursor-pointer mb-3" onClick={() => setIsEditProfileOpen(true)}>
          <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden bg-purple-100/50 dark:bg-[#1a0d3d] transition-transform duration-300 group-hover:scale-105 shadow-md flex items-center justify-center">
            <Image
              src={currentAvatarSrc}
              alt={selectedCharacter.name}
              fill
              sizes="(max-width: 640px) 112px, 128px"
              className="object-contain p-2"
              priority
            />
          </div>

          {/* Camera / Plus Badge on Avatar */}
          <div className="absolute bottom-1 right-1 h-7 w-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <Camera className="h-3.5 w-3.5 fill-slate-950" />
          </div>
        </div>

        {/* User Handle & Badge */}
        <h1 className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-1.5">
          {displayName}
          <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-500 text-white" />
        </h1>
        <p className="text-xs font-extrabold text-purple-700 dark:text-purple-300 mt-0.5">
          {userHandle}
        </p>

        {/* ===================================================================
            TIKTOK 3 STATS BAR (Following, Followers, Likes / Orbs)
            =================================================================== */}
        <div className="flex items-center justify-center gap-8 sm:gap-12 my-5 w-full max-w-xs">
          <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity">
            <span className="font-display font-black text-lg text-slate-900 dark:text-white tracking-tight">
              142
            </span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Following
            </span>
          </div>

          <div className="h-5 w-[1px] bg-purple-200 dark:bg-purple-900/60" />

          <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity">
            <span className="font-display font-black text-lg text-slate-900 dark:text-white tracking-tight">
              2.8K
            </span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-purple-300/70">
              Followers
            </span>
          </div>

          <div className="h-5 w-[1px] bg-purple-200 dark:bg-purple-900/60" />

          <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity">
            <span className="font-display font-black text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-0.5">
              <span>{kid.orbs || 75}</span>
              <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400 inline" />
            </span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-purple-300/70">
              Orbs / Likes
            </span>
          </div>
        </div>

        {/* ===================================================================
            TIKTOK ACTION BUTTONS ROW (Selam Kids Brand Colors)
            =================================================================== */}
        <div className="flex items-center justify-center gap-2.5 w-full max-w-sm mb-4">
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="flex-1 py-2.5 px-4 rounded-xl font-display font-black text-xs sm:text-sm bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/50 dark:hover:bg-purple-900/80 text-purple-950 dark:text-purple-100 border border-purple-200 dark:border-purple-700 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            Edit profile
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="py-2.5 px-3.5 rounded-xl font-display font-black text-xs sm:text-sm bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/50 dark:hover:bg-purple-900/80 text-purple-950 dark:text-purple-100 border border-purple-200 dark:border-purple-700 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center"
            title="Share profile"
          >
            <Share2 className="h-4 w-4" />
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="py-2.5 px-4 rounded-xl font-display font-black text-xs sm:text-sm bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            title="Sign Out"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{isLoggingOut ? '...' : 'Sign Out'}</span>
          </button>
        </div>

        {/* ===================================================================
            TIKTOK BIO & COMPANION CARD (Selam Kids Brand Colors)
            =================================================================== */}
        <div className="w-full max-w-sm text-left bg-purple-50/70 dark:bg-purple-950/30 rounded-2xl p-3.5 border border-purple-200/80 dark:border-purple-900/60 space-y-2">
          <p className="text-xs text-slate-700 dark:text-purple-200 font-medium leading-relaxed">
            {bioText}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold text-slate-600 dark:text-purple-300">
            <span className="inline-flex items-center gap-1 bg-white dark:bg-purple-900/50 px-2.5 py-1 rounded-lg border border-purple-200/80 dark:border-purple-800/60 shadow-2xs">
              🦁 Companion: <strong className="text-purple-700 dark:text-purple-300">{selectedCharacter.name}</strong>
            </span>
            <span className="inline-flex items-center gap-1 bg-white dark:bg-purple-900/50 px-2.5 py-1 rounded-lg border border-purple-200/80 dark:border-purple-800/60 shadow-2xs">
              ✍️ <strong className="text-emerald-600 dark:text-emerald-400">{kid.words_written || 142}</strong> words
            </span>
            <span className="inline-flex items-center gap-1 bg-white dark:bg-purple-900/50 px-2.5 py-1 rounded-lg border border-purple-200/80 dark:border-purple-800/60 shadow-2xs">
              📍 Selam Kids Zoo HQ
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================================
          TIKTOK 4 ICON TABS HEADER (Selam Kids Brand Accent & Active Underline)
          ===================================================================== */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#0f0728]/95 backdrop-blur-md border-b-2 border-purple-100 dark:border-purple-900/60 shadow-xs">
        <div className="grid grid-cols-4 text-center">
          {/* Tab 0: Story Creations / Videos */}
          <button
            onClick={() => setActiveTab(0)}
            className={cn(
              'py-3 flex flex-col items-center justify-center relative cursor-pointer transition-colors',
              activeTab === 0
                ? 'text-emerald-600 dark:text-emerald-400 font-black'
                : 'text-slate-400 dark:text-purple-300/60 hover:text-purple-700 dark:hover:text-purple-200'
            )}
            title="My Stories"
          >
            <Grid3X3 className="h-5 w-5" />
            <span className="text-[10px] font-extrabold mt-0.5">Stories</span>
            {activeTab === 0 && (
              <span className="absolute bottom-0 left-1/4 right-1/4 h-[3px] bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-sm shadow-emerald-400/50" />
            )}
          </button>

          {/* Tab 1: Saved Magazines / Bookmarks */}
          <button
            onClick={() => setActiveTab(1)}
            className={cn(
              'py-3 flex flex-col items-center justify-center relative cursor-pointer transition-colors',
              activeTab === 1
                ? 'text-emerald-600 dark:text-emerald-400 font-black'
                : 'text-slate-400 dark:text-purple-300/60 hover:text-purple-700 dark:hover:text-purple-200'
            )}
            title="Saved Magazines"
          >
            <Bookmark className="h-5 w-5" />
            <span className="text-[10px] font-extrabold mt-0.5">Library</span>
            {activeTab === 1 && (
              <span className="absolute bottom-0 left-1/4 right-1/4 h-[3px] bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-sm shadow-emerald-400/50" />
            )}
          </button>

          {/* Tab 2: Badges & Trophies */}
          <button
            onClick={() => setActiveTab(2)}
            className={cn(
              'py-3 flex flex-col items-center justify-center relative cursor-pointer transition-colors',
              activeTab === 2
                ? 'text-emerald-600 dark:text-emerald-400 font-black'
                : 'text-slate-400 dark:text-purple-300/60 hover:text-purple-700 dark:hover:text-purple-200'
            )}
            title="Badges & Achievements"
          >
            <Award className="h-5 w-5" />
            <span className="text-[10px] font-extrabold mt-0.5">Badges</span>
            {activeTab === 2 && (
              <span className="absolute bottom-0 left-1/4 right-1/4 h-[3px] bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-sm shadow-emerald-400/50" />
            )}
          </button>

          {/* Tab 3: Studio & Account Settings */}
          <button
            onClick={() => setActiveTab(3)}
            className={cn(
              'py-3 flex flex-col items-center justify-center relative cursor-pointer transition-colors',
              activeTab === 3
                ? 'text-emerald-600 dark:text-emerald-400 font-black'
                : 'text-slate-400 dark:text-purple-300/60 hover:text-purple-700 dark:hover:text-purple-200'
            )}
            title="Studio & Settings"
          >
            <Sliders className="h-5 w-5" />
            <span className="text-[10px] font-extrabold mt-0.5">Studio</span>
            {activeTab === 3 && (
              <span className="absolute bottom-0 left-1/4 right-1/4 h-[3px] bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-sm shadow-emerald-400/50" />
            )}
          </button>
        </div>
      </div>

      {/* =====================================================================
          TAB 0: TIKTOK 3-COLUMN PORTRAIT STORIES GRID
          ===================================================================== */}
      {activeTab === 0 && (
        <div className="p-1 sm:p-2">
          <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
            {SAMPLE_STORIES.map((story) => (
              <div
                key={story.id}
                onClick={() => setSelectedStory(story)}
                className="relative aspect-[9/16] rounded-lg overflow-hidden bg-gradient-to-br from-slate-900 to-purple-950 cursor-pointer group shadow-sm hover:opacity-95 transition-all"
              >
                {/* Background visual card with character */}
                <div
                  className={cn(
                    'absolute inset-0 bg-gradient-to-b opacity-85',
                    story.bgGradient
                  )}
                />

                {/* Character preview inside vertical video tile */}
                <div className="absolute inset-0 flex items-center justify-center p-3">
                  <div className="relative h-20 w-20 sm:h-28 sm:w-28 group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={story.characterImage}
                      alt={story.title}
                      fill
                      sizes="112px"
                      className="object-contain drop-shadow-lg"
                    />
                  </div>
                </div>

                {/* Top Pinned Badge (Like TikTok pinned videos) */}
                {story.isPinned && (
                  <div className="absolute top-1.5 left-1.5 bg-[#fe2c55] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-md flex items-center gap-0.5">
                    <Pin className="h-2.5 w-2.5 fill-white" />
                    <span>Pinned</span>
                  </div>
                )}

                {/* Story Title teaser */}
                <div className="absolute top-7 left-1.5 right-1.5">
                  <p className="text-[10px] sm:text-xs font-black text-white/95 leading-tight line-clamp-2 drop-shadow-md">
                    {story.title}
                  </p>
                </div>

                {/* Bottom Left Play Count (TikTok signature indicator) */}
                <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-white text-[10px] font-black drop-shadow-md">
                  <Play className="h-3 w-3 fill-white text-white" />
                  <span>{story.views}</span>
                </div>

                {/* Bottom Right Likes Count */}
                <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 text-white/90 text-[10px] font-bold drop-shadow-md">
                  <Heart
                    className={cn(
                      'h-3 w-3',
                      hasLiked[story.id] ? 'fill-rose-500 text-rose-500' : 'fill-white/80 text-white'
                    )}
                  />
                  <span>
                    {(story.likes + (storyLikes[story.id] || 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link href="/users/kids/story">
              <Button
                variant="magic"
                size="sm"
                className="font-black text-xs px-6 py-2 shadow-md rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Create New Story in Studio
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 1: TIKTOK 3-COLUMN PORTRAIT MAGAZINES LIBRARY
          ===================================================================== */}
      {activeTab === 1 && (
        <div className="p-1 sm:p-2">
          <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
            {magazines.map((issue) => (
              <div
                key={issue.id}
                onClick={() => router.push(`/users/kids/magazine/${issue.id}`)}
                className="relative aspect-[3/4] rounded-lg overflow-hidden bg-slate-900 cursor-pointer group shadow-sm hover:opacity-95 transition-all"
              >
                {/* Issue Cover Image */}
                <Image
                  src={issue.characterMain.src}
                  alt={issue.title}
                  fill
                  sizes="160px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Issue Badge Top Left */}
                <div className="absolute top-1.5 left-1.5 bg-yellow-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-md">
                  Issue #{issue.issueNumber}
                </div>

                {/* Bottom Title & Readers */}
                <div className="absolute bottom-1.5 left-1.5 right-1.5 text-white">
                  <p className="text-[10px] font-black leading-tight line-clamp-1 drop-shadow-md">
                    {issue.title}
                  </p>
                  <div className="flex items-center gap-1 text-[9px] text-emerald-300 font-extrabold mt-0.5">
                    <BookOpen className="h-2.5 w-2.5" />
                    <span>Tap to Read</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link href="/users/kids/magazines">
              <Button
                variant="outline"
                size="sm"
                className="font-black text-xs px-6 py-2 rounded-full border-2 border-slate-200 dark:border-white/20"
              >
                View Full Magazine Archive
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: BADGES & TROPHIES
          ===================================================================== */}
      {activeTab === 2 && (
        <div className="p-3 sm:p-4 space-y-3">
          <div className="text-center pb-2">
            <h3 className="font-display font-black text-base text-slate-900 dark:text-white">
              Explorer Trophy Case
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Read stories, create adventures, and level up your companion beast!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {ACHIEVEMENTS.map((badge) => (
              <div
                key={badge.id}
                className={cn(
                  'p-3.5 rounded-2xl border transition-all flex flex-col items-center text-center',
                  badge.unlocked
                    ? 'bg-slate-50 dark:bg-white/5 border-purple-200/80 dark:border-purple-800/60 shadow-sm'
                    : 'bg-slate-100/50 dark:bg-white/5 border-dashed border-slate-300 dark:border-white/10 opacity-60'
                )}
              >
                <div
                  className={cn(
                    'h-12 w-12 rounded-2xl flex items-center justify-center text-2xl shadow-md mb-2 bg-gradient-to-br',
                    badge.color
                  )}
                >
                  {badge.icon}
                </div>
                <h4 className="font-display font-black text-xs text-slate-900 dark:text-white">
                  {badge.title}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                  {badge.desc}
                </p>
                <span
                  className={cn(
                    'mt-2 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider',
                    badge.unlocked
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-400'
                  )}
                >
                  {badge.unlocked ? 'Unlocked ✨' : 'In Progress'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: CREATURE STUDIO & ACCOUNT SETTINGS
          ===================================================================== */}
      {activeTab === 3 && (
        <div className="p-4 space-y-6">
          {/* 1. Companion Beast Customizer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-black text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  Companion Beast
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select your active avatar companion
                </p>
              </div>
              <span className="text-xs font-black text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 px-2.5 py-1 rounded-full">
                {selectedCharacter.name}
              </span>
            </div>

            <form action={updateCreatureAction} className="space-y-4">
              <input type="hidden" name="creatureName" value={selectedCharacter.name} />
              <input type="hidden" name="creatureType" value={selectedCharacter.id} />
              <input type="hidden" name="creatureImageUrl" value={selectedCharacter.imageUrl} />
              <input type="hidden" name="gradeLevel" value={kid.grade_level || 'Grade 3'} />
              <input type="hidden" name="nickname" value={nickname} />

              <div className="grid grid-cols-3 gap-2">
                {CREATURE_CHARACTERS.map((char) => {
                  const isSelected = selectedCharacter.id === char.id;
                  return (
                    <button
                      key={char.id}
                      type="button"
                      onClick={() => setSelectedCharacter(char)}
                      className={cn(
                        'relative p-2.5 rounded-2xl border-2 flex flex-col items-center transition-all cursor-pointer',
                        isSelected
                          ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 shadow-md scale-102 ring-2 ring-emerald-400/40'
                          : 'border-purple-200/80 dark:border-purple-900/50 hover:border-purple-300 dark:hover:border-purple-700 bg-purple-50/40 dark:bg-purple-950/20'
                      )}
                    >
                      <div className="relative h-14 w-14 mb-1">
                        <Image
                          src={char.imageUrl}
                          alt={char.name}
                          fill
                          sizes="56px"
                          className="object-contain"
                        />
                      </div>
                      <span className="text-[11px] font-black text-slate-900 dark:text-white truncate w-full text-center">
                        {char.name}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <Button
                type="submit"
                variant="emerald"
                size="sm"
                className="w-full font-black text-xs py-2.5 bg-emerald-500 text-slate-950 shadow-md hover:bg-emerald-400"
              >
                Save {selectedCharacter.name} as Beast Partner
              </Button>
            </form>
          </div>

          <div className="h-[1px] bg-purple-100 dark:bg-purple-900/60" />

          {/* 2. Account Details Form */}
          <div className="space-y-3">
            <h3 className="font-display font-black text-base text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>⚙️</span> Display Name & Account
            </h3>

            <form action={updateProfileNameAction} className="space-y-3">
              <Input
                label="Explorer Full Name"
                name="fullName"
                defaultValue={displayName}
                required
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-purple-200 mb-1">
                  Registered Explorer ID
                </label>
                <input
                  type="text"
                  defaultValue={accountIdentifier}
                  disabled
                  className="w-full rounded-2xl border border-purple-200 dark:border-purple-900/80 bg-purple-50/40 dark:bg-[#160a36] px-4 py-2 text-xs text-slate-500 dark:text-purple-300/60 cursor-not-allowed"
                />
              </div>

              <Button
                type="submit"
                variant="emerald"
                size="sm"
                className="w-full font-black text-xs py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md"
              >
                Update Explorer Name
              </Button>
            </form>
          </div>

          <div className="h-[1px] bg-purple-100 dark:bg-purple-900/60" />

          {/* 3. Appearance & Theme Realm */}
          <div className="space-y-3">
            <h3 className="font-display font-black text-base text-slate-900 dark:text-white flex items-center gap-1.5">
              <Palette className="h-4 w-4 text-pink-500" />
              Day / Night Realm Theme
            </h3>
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/60">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-white">Active Realm</p>
                <p className="text-[10px] text-slate-500 dark:text-purple-300/70">
                  Switch between daytime sunshine and starry night galaxy
                </p>
              </div>
              <ThemeToggle variant="segmented" />
            </div>
          </div>

          <div className="h-[1px] bg-purple-100 dark:bg-purple-900/60" />

          {/* 4. Security & Sign Out Section */}
          <div className="space-y-3">
            <h3 className="font-display font-black text-base text-slate-900 dark:text-white flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-indigo-500" />
              Security & Sign Out
            </h3>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/60">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-white">Account Password</p>
                <p className="text-[10px] text-slate-500 dark:text-purple-300/70">
                  Reset password whenever needed
                </p>
              </div>
              <Link href="/auth/forgot-password">
                <Button variant="outline" size="sm" className="text-xs font-bold">
                  Reset Password
                </Button>
              </Link>
            </div>

            {/* Prominent Red Sign Out Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full py-3 px-4 rounded-2xl font-display font-black text-xs sm:text-sm bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/25 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>{isLoggingOut ? 'Signing out...' : 'Sign Out of Explorer Account'}</span>
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          TIKTOK MODAL: EDIT PROFILE BOTTOM SHEET (Selam Kids Brand Colors)
          ===================================================================== */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#12092e] rounded-t-3xl sm:rounded-3xl border-2 border-purple-200 dark:border-purple-800/80 p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/60 pb-3">
              <h3 className="font-display font-black text-base text-slate-900 dark:text-white">
                Edit Profile
              </h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Change Photo / Beast Carousel in Edit Sheet */}
            <form action={updateCreatureAction} className="space-y-4">
              <input type="hidden" name="creatureName" value={selectedCharacter.name} />
              <input type="hidden" name="creatureType" value={selectedCharacter.id} />
              <input type="hidden" name="creatureImageUrl" value={selectedCharacter.imageUrl} />
              <input type="hidden" name="gradeLevel" value={kid.grade_level || 'Grade 3'} />
              <input type="hidden" name="nickname" value={nickname} />

              <div className="text-center py-2">
                <div className="relative inline-block mb-2">
                  <div className="relative h-20 w-20 rounded-full overflow-hidden bg-purple-50 dark:bg-purple-950/60 shadow-md">
                    <Image
                      src={selectedCharacter.imageUrl}
                      alt={selectedCharacter.name}
                      fill
                      sizes="80px"
                      className="object-contain p-1.5"
                    />
                  </div>
                </div>
                <p className="text-xs font-black text-purple-700 dark:text-purple-300">
                  Choose Companion Avatar
                </p>

                <div className="flex items-center justify-center gap-2 mt-2 overflow-x-auto py-1">
                  {CREATURE_CHARACTERS.map((char) => (
                    <button
                      key={char.id}
                      type="button"
                      onClick={() => setSelectedCharacter(char)}
                      className={cn(
                        'relative h-10 w-10 rounded-full border-2 p-1 shrink-0 transition-transform cursor-pointer',
                        selectedCharacter.id === char.id
                          ? 'border-emerald-400 scale-110 ring-2 ring-emerald-400/40 bg-emerald-50 dark:bg-emerald-950/50'
                          : 'border-purple-200 dark:border-purple-800/40 opacity-70 hover:opacity-100'
                      )}
                    >
                      <Image
                        src={char.imageUrl}
                        alt={char.name}
                        fill
                        sizes="40px"
                        className="object-contain p-0.5"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-purple-200 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full rounded-xl border border-purple-200 dark:border-purple-800/80 bg-slate-50 dark:bg-[#180b3a] px-3.5 py-2 text-sm text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-purple-200 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full rounded-xl border border-purple-200 dark:border-purple-800/80 bg-slate-50 dark:bg-[#180b3a] px-3.5 py-2 text-sm text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-purple-200 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={bioText}
                    onChange={(e) => setBioText(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-purple-200 dark:border-purple-800/80 bg-slate-50 dark:bg-[#180b3a] p-3 text-xs text-slate-900 dark:text-white resize-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full py-3 rounded-2xl font-display font-black text-xs sm:text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-purple-600 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          TIKTOK MODAL: SHARE PROFILE (Selam Kids Brand Colors)
          ===================================================================== */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#12092e] rounded-t-3xl sm:rounded-3xl border-2 border-purple-200 dark:border-purple-800/80 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/60 pb-3">
              <h3 className="font-display font-black text-base text-slate-900 dark:text-white">
                Share Profile
              </h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-center py-3">
              <div className="relative inline-block mb-3">
                <div className="relative h-20 w-20 rounded-full overflow-hidden bg-purple-50 dark:bg-purple-950/60 shadow-md">
                  <Image
                    src={currentAvatarSrc}
                    alt={selectedCharacter.name}
                    fill
                    sizes="80px"
                    className="object-contain p-1.5"
                  />
                </div>
              </div>
              <h4 className="font-display font-black text-sm text-slate-900 dark:text-white">
                {displayName}
              </h4>
              <p className="text-xs text-purple-700 dark:text-purple-300 font-bold">{userHandle}</p>
            </div>

            <button
              onClick={handleCopyProfileLink}
              className="w-full py-3 px-4 rounded-2xl font-display font-black text-xs sm:text-sm bg-purple-100 dark:bg-purple-900/60 hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-950 dark:text-purple-100 border border-purple-200 dark:border-purple-700 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              {copiedLink ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Profile Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          TIKTOK MODAL: QUICK OPTIONS (3 Dots)
          ===================================================================== */}
      {isQuickMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#12092e] rounded-t-3xl sm:rounded-3xl border-2 border-purple-200 dark:border-purple-800/80 p-5 space-y-2">
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/60 pb-3 mb-2">
              <h3 className="font-display font-black text-sm text-slate-900 dark:text-white">
                Quick Options
              </h3>
              <button
                onClick={() => setIsQuickMenuOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <button
              onClick={() => {
                setIsQuickMenuOpen(false);
                setIsEditProfileOpen(true);
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/40 text-xs font-bold text-slate-800 dark:text-purple-200 flex items-center gap-2.5"
            >
              <Camera className="h-4 w-4 text-purple-500" />
              <span>Edit Profile & Avatar</span>
            </button>

            <button
              onClick={() => {
                setIsQuickMenuOpen(false);
                setActiveTab(3);
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/40 text-xs font-bold text-slate-800 dark:text-purple-200 flex items-center gap-2.5"
            >
              <Sliders className="h-4 w-4 text-emerald-500" />
              <span>Studio & Settings</span>
            </button>

            <button
              onClick={() => {
                setIsQuickMenuOpen(false);
                setIsShareModalOpen(true);
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/40 text-xs font-bold text-slate-800 dark:text-purple-200 flex items-center gap-2.5"
            >
              <Share2 className="h-4 w-4 text-amber-500" />
              <span>Share Profile Link</span>
            </button>

            <div className="h-[1px] bg-purple-100 dark:bg-purple-900/60 my-1" />

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-black text-rose-600 dark:text-rose-400 flex items-center gap-2.5"
            >
              <LogOut className="h-4 w-4" />
              <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          TIKTOK MODAL: STORY VIEWER (When tapping a video/story card)
          ===================================================================== */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-[#0f0728] text-white rounded-3xl overflow-hidden border-2 border-purple-800/80 shadow-2xl relative flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-purple-900/60 bg-black/40">
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 rounded-full overflow-hidden bg-purple-900 border border-purple-400">
                  <Image
                    src={selectedStory.characterImage}
                    alt={selectedStory.title}
                    fill
                    sizes="32px"
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-black leading-tight">{displayName}</h4>
                  <p className="text-[10px] text-purple-300/80">{selectedStory.date} • {selectedStory.category}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStory(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              <div
                className={cn(
                  'h-36 rounded-2xl relative flex items-center justify-center overflow-hidden bg-gradient-to-r',
                  selectedStory.bgGradient
                )}
              >
                <div className="relative h-28 w-28 drop-shadow-2xl">
                  <Image
                    src={selectedStory.characterImage}
                    alt={selectedStory.title}
                    fill
                    sizes="112px"
                    className="object-contain"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-display font-black text-lg text-white mb-2">
                  {selectedStory.title}
                </h3>
                <p className="text-xs text-purple-100/90 leading-relaxed font-medium">
                  {selectedStory.fullStory}
                </p>
              </div>
            </div>

            {/* Bottom Actions Bar (TikTok Like, Comments, Share) */}
            <div className="p-3 border-t border-purple-900/60 bg-black/40 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleToggleLike(selectedStory.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <Heart
                    className={cn(
                      'h-5 w-5 transition-transform active:scale-125',
                      hasLiked[selectedStory.id]
                        ? 'fill-rose-500 text-rose-500 scale-110'
                        : 'fill-transparent text-white'
                    )}
                  />
                  <span>
                    {(
                      selectedStory.likes + (storyLikes[selectedStory.id] || 0)
                    ).toLocaleString()}
                  </span>
                </button>

                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <MessageCircle className="h-5 w-5 text-white" />
                  <span>24</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedStory(null);
                  router.push('/users/kids/story');
                }}
                className="text-[11px] font-black text-emerald-400 hover:underline"
              >
                Open in Studio →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
