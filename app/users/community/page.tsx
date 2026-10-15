'use client';

import * as React from 'react';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Bookmark,
  BarChart2,
  ImagePlus,
  Smile,
  Sparkles,
  Search,
  MoreHorizontal,
  CheckCircle2,
  X,
  Send,
  Award,
  Globe,
  SlidersHorizontal,
  TrendingUp,
  UserPlus,
  UserCheck,
} from 'lucide-react';
import Image from 'next/image';

interface CommunityPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorRole: 'Parent' | 'Educator' | 'Young Author Family';
  authorAvatar?: string;
  authorInitial: string;
  avatarBg: string;
  isVerified?: boolean;
  title?: string;
  content: string;
  category: 'spotlight' | 'tips' | 'prompts' | 'discussion';
  categoryLabel: string;
  childInfo?: string;
  imageUrl?: string;
  likes: number;
  userLiked: boolean;
  reposts: number;
  userReposted: boolean;
  views: string;
  bookmarked: boolean;
  commentsCount: number;
  timeAgo: string;
  comments: {
    id: string;
    author: string;
    handle: string;
    avatarBg: string;
    text: string;
    time: string;
    likes: number;
    userLiked?: boolean;
  }[];
}

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: '1',
    authorName: 'Sarah Jenkins',
    authorHandle: '@sarah_jenkins',
    authorRole: 'Young Author Family',
    authorInitial: 'S',
    avatarBg: 'from-purple-500 to-indigo-600',
    isVerified: true,
    title: 'Leo published his first 500-word chapter story!',
    content:
      'We wanted to share how proud we are of Leo (age 8)! He used the vocabulary tools in Word Dash to craft an adventure about a starry dragon who rescues lost animals in the Simien Mountains. The glowing points gave him the extra spark to keep revising until it was perfect! 🌟✨ #YoungAuthor #LalibelaSecrets',
    category: 'spotlight',
    categoryLabel: 'Story Spotlight',
    childInfo: 'Child: Leo • Grade 3 Author',
    imageUrl: '/images/characters/simba.png',
    likes: 38,
    userLiked: false,
    reposts: 9,
    userReposted: false,
    views: '2.4K',
    bookmarked: false,
    commentsCount: 2,
    timeAgo: '2h',
    comments: [
      {
        id: 'c1',
        author: 'Mark Thorne',
        handle: '@mark_thorne',
        avatarBg: 'from-emerald-500 to-teal-600',
        text: 'Way to go Leo! Writing 500 words is a massive milestone for Grade 3!',
        time: '1h',
        likes: 4,
      },
      {
        id: 'c2',
        author: 'Elena Rostova',
        handle: '@elena_illustrator',
        avatarBg: 'from-amber-500 to-orange-600',
        text: 'The starry dragon concept is brilliant. Would love to see his illustrations next!',
        time: '35m',
        likes: 2,
      },
    ],
  },
  {
    id: '2',
    authorName: 'David Chen',
    authorHandle: '@davidchen_dad',
    authorRole: 'Parent',
    authorInitial: 'D',
    avatarBg: 'from-cyan-500 to-blue-600',
    isVerified: false,
    title: 'Our 20-minute evening family writing routine',
    content:
      'After dinner, we set a 20-minute timer where everyone—parents included—writes or doodles together. Our daughter pairs her writing with Selam Kids Color Studio. It completely removed homework pressure and turned writing into a joyful nightly ritual! 📚☕ #ParentTip #FamilyWriting',
    category: 'tips',
    categoryLabel: 'Parent Tip',
    likes: 54,
    userLiked: true,
    reposts: 14,
    userReposted: false,
    views: '4.1K',
    bookmarked: true,
    commentsCount: 1,
    timeAgo: '5h',
    comments: [
      {
        id: 'c3',
        author: 'Jessica Miller',
        handle: '@jess_miller',
        avatarBg: 'from-pink-500 to-rose-600',
        text: 'Writing alongside our kids makes such a tremendous difference. Starting this tonight!',
        time: '3h',
        likes: 7,
      },
    ],
  },
  {
    id: '3',
    authorName: 'Coach Marcus',
    authorHandle: '@coach_marcus',
    authorRole: 'Educator',
    authorInitial: 'M',
    avatarBg: 'from-emerald-600 to-emerald-800',
    isVerified: true,
    title: 'Monthly Creative Challenge: The Creature with Two Shadows',
    content:
      'Here is a fun challenge for this week: "You discover an animal in the Whispering Forest that casts two different colored shadows." Ask your kids what power each shadow has and challenge them to use 3 sensory adjectives! Post your kids\' creations below! 🦁🌳 #WritingPrompt #CreativeKids',
    category: 'prompts',
    categoryLabel: 'Writing Prompt',
    imageUrl: '/images/characters/cloud-guy.png',
    likes: 92,
    userLiked: false,
    reposts: 28,
    userReposted: true,
    views: '8.9K',
    bookmarked: false,
    commentsCount: 1,
    timeAgo: '1d',
    comments: [
      {
        id: 'c4',
        author: 'The Patel Family',
        handle: '@patel_explorers',
        avatarBg: 'from-violet-500 to-purple-700',
        text: 'Our son chose a golden mountain owl whose shadow creates starlight at night!',
        time: '18h',
        likes: 12,
      },
    ],
  },
];

export default function CommunityPage() {
  const [posts, setPosts] = React.useState<CommunityPost[]>(INITIAL_POSTS);
  const [activeTab, setActiveTab] = React.useState<'for-you' | 'spotlight' | 'tips' | 'prompts' | 'discussion'>('for-you');
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // New Tweet Compose State
  const [tweetText, setTweetText] = React.useState('');
  const [newCategory, setNewCategory] = React.useState<'spotlight' | 'tips' | 'prompts' | 'discussion'>('discussion');
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Thread Reply State
  const [activeReplyPostId, setActiveReplyPostId] = React.useState<string | null>(null);
  const [replyText, setReplyText] = React.useState('');

  // Who to follow state
  const [followedUsers, setFollowedUsers] = React.useState<Record<string, boolean>>({});

  const toggleFollow = (username: string) => {
    setFollowedUsers((prev) => ({
      ...prev,
      [username]: !prev[username],
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size exceeds 5MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.userLiked;
          return {
            ...p,
            userLiked: nextLiked,
            likes: nextLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleRepost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextReposted = !p.userReposted;
          return {
            ...p,
            userReposted: nextReposted,
            reposts: nextReposted ? p.reposts + 1 : p.reposts - 1,
          };
        }
        return p;
      })
    );
  };

  const handleBookmark = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            bookmarked: !p.bookmarked,
          };
        }
        return p;
      })
    );
  };

  const handleCreateTweet = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tweetText.trim()) return;

    const newPost: CommunityPost = {
      id: Date.now().toString(),
      authorName: 'My Family',
      authorHandle: '@my_family',
      authorRole: 'Young Author Family',
      authorInitial: 'M',
      avatarBg: 'from-emerald-500 via-teal-500 to-cyan-500',
      isVerified: true,
      content: tweetText.trim(),
      category: newCategory,
      imageUrl: imagePreview || undefined,
      categoryLabel:
        newCategory === 'spotlight'
          ? 'Story Spotlight'
          : newCategory === 'tips'
          ? 'Parent Tip'
          : newCategory === 'prompts'
          ? 'Writing Prompt'
          : 'Discussion',
      likes: 1,
      userLiked: true,
      reposts: 0,
      userReposted: false,
      views: '1',
      bookmarked: false,
      commentsCount: 0,
      timeAgo: 'Just now',
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setTweetText('');
    setImagePreview(null);
    setShowCategoryPicker(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddReply = (postId: string) => {
    if (!replyText.trim()) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newReply = {
            id: Date.now().toString(),
            author: 'My Family',
            handle: '@my_family',
            avatarBg: 'from-emerald-500 via-teal-500 to-cyan-500',
            text: replyText.trim(),
            time: 'Just now',
            likes: 0,
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newReply],
          };
        }
        return p;
      })
    );

    setReplyText('');
  };

  const filteredPosts = posts.filter((p) => {
    const matchesTab =
      activeTab === 'for-you' || p.category === activeTab;
    const matchesSearch =
      !searchQuery.trim() ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authorHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] text-slate-900 dark:text-neutral-100 flex justify-center -mx-4 -my-4 sm:-mx-6 sm:-my-6 lg:-mx-8 lg:-my-8">
      {/* Central Feed Container (Twitter Main Feed + Right Sidebar) */}
      <div className="w-full max-w-6xl flex justify-between">
        
        {/* =========================================================================
            MAIN TIMELINE (Bordered feed like X/Twitter)
            ========================================================================= */}
        <main className="w-full max-w-2xl min-h-screen border-x border-slate-200 dark:border-neutral-800 pb-20">
          
          {/* Sticky Header: Tabs */}
          <div className="sticky top-0 z-30 bg-white/85 dark:bg-[#000000]/85 backdrop-blur-md border-b border-slate-200 dark:border-neutral-800">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-xl text-slate-900 dark:text-white">
                  Family Connect
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  X Feed
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                title="Filter Topics"
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors text-slate-500 dark:text-neutral-400"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* Twitter-style Navigation Tabs with Bottom Underline Indicator */}
            <div className="flex items-center overflow-x-auto no-scrollbar border-t border-slate-100 dark:border-neutral-800/80">
              {[
                { id: 'for-you', label: 'For you' },
                { id: 'spotlight', label: 'Story Spotlight' },
                { id: 'tips', label: 'Parent Tips' },
                { id: 'prompts', label: 'Prompts' },
                { id: 'discussion', label: 'Discussion' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className="relative flex-1 min-w-[100px] py-3.5 px-3 text-center text-xs sm:text-sm font-bold transition-colors hover:bg-slate-50 dark:hover:bg-neutral-900/40 cursor-pointer whitespace-nowrap"
                  >
                    <span
                      className={
                        isActive
                          ? 'font-black text-slate-950 dark:text-white'
                          : 'text-slate-500 dark:text-neutral-400 font-semibold'
                      }
                    >
                      {tab.label}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-1 rounded-full bg-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* =======================================================================
              TWEET COMPOSER ("What is happening?!")
              ======================================================================= */}
          <div className="p-4 border-b border-slate-200 dark:border-neutral-800 flex gap-3">
            {/* User Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center font-black text-slate-950 shrink-0 text-sm shadow-sm select-none">
              M
            </div>

            {/* Compose Area */}
            <div className="flex-1 min-w-0">
              {/* Audience pill */}
              <div className="mb-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-neutral-700 hover:bg-emerald-500/10 transition-colors"
                >
                  <Globe className="h-3 w-3" />
                  <span>
                    {newCategory === 'spotlight'
                      ? 'Story Spotlight'
                      : newCategory === 'tips'
                      ? 'Parent Tip'
                      : newCategory === 'prompts'
                      ? 'Writing Prompt'
                      : 'Everyone can reply'}
                  </span>
                </button>
              </div>

              {/* Category selector dropdown if toggled */}
              {showCategoryPicker && (
                <div className="mb-3 flex flex-wrap gap-1.5 p-2 rounded-2xl bg-slate-50 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 animate-in fade-in">
                  {[
                    { id: 'spotlight', label: '🌟 Story Spotlight' },
                    { id: 'tips', label: '💡 Parent Tip' },
                    { id: 'prompts', label: '✍️ Writing Prompt' },
                    { id: 'discussion', label: '💬 General Discussion' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setNewCategory(cat.id as any);
                        setShowCategoryPicker(false);
                      }}
                      className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all ${
                        newCategory === cat.id
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-white dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Textarea */}
              <textarea
                value={tweetText}
                onChange={(e) => setTweetText(e.target.value)}
                placeholder="What is happening in your family's writing adventure?!"
                rows={2}
                className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 text-base sm:text-lg focus:outline-none resize-none font-medium leading-relaxed"
              />

              {/* Attached Image Preview */}
              {imagePreview && (
                <div className="relative mt-2 mb-3 rounded-2xl overflow-hidden border border-slate-200 dark:border-neutral-800 max-h-72">
                  <img
                    src={imagePreview}
                    alt="Upload preview"
                    className="w-full h-auto object-cover max-h-72"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Toolbar & Post Button */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-neutral-800">
                <div className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Media / Image"
                    className="p-2 rounded-full hover:bg-emerald-500/10 transition-colors cursor-pointer"
                  >
                    <ImagePlus className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTweetText((prev) => prev + ' 🌟')}
                    title="Emoji"
                    className="p-2 rounded-full hover:bg-emerald-500/10 transition-colors cursor-pointer"
                  >
                    <Smile className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTweetText((prev) => prev + ' #LalibelaSecrets ')}
                    title="Add Hashtag"
                    className="p-2 rounded-full hover:bg-emerald-500/10 transition-colors cursor-pointer"
                  >
                    <Sparkles className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {tweetText.length > 0 && (
                    <span className="text-xs text-slate-400 dark:text-neutral-500 font-mono">
                      {280 - tweetText.length}
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={!tweetText.trim() && !imagePreview}
                    onClick={() => handleCreateTweet()}
                    className={`rounded-full px-5 py-2 font-display font-black text-xs sm:text-sm transition-all active:scale-95 shadow-sm ${
                      tweetText.trim() || imagePreview
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer'
                        : 'bg-emerald-500/40 text-slate-950/50 cursor-not-allowed'
                    }`}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* =======================================================================
              TWEETS FEED
              ======================================================================= */}
          <div>
            {filteredPosts.length === 0 ? (
              <div className="p-12 text-center text-slate-400 dark:text-neutral-500">
                <p className="font-display font-bold text-base mb-1">No posts found</p>
                <p className="text-xs">Be the first to share a post in this category!</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="p-4 sm:p-5 border-b border-slate-100 dark:border-neutral-800/80 hover:bg-slate-50/70 dark:hover:bg-neutral-950/60 transition-colors cursor-pointer"
                >
                  <div className="flex gap-3">
                    {/* Author Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-tr ${post.avatarBg} flex items-center justify-center font-black text-white shrink-0 text-sm shadow-sm select-none`}
                    >
                      {post.authorInitial}
                    </div>

                    {/* Main Tweet Body */}
                    <div className="flex-1 min-w-0">
                      {/* Header: Name, Verified Badge, Handle, Dot, Time, More */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                          <span className="font-display font-black text-sm text-slate-900 dark:text-white truncate hover:underline">
                            {post.authorName}
                          </span>

                          {post.isVerified && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-emerald-500 text-white shrink-0" />
                          )}

                          <span className="text-xs text-slate-500 dark:text-neutral-500 truncate">
                            {post.authorHandle}
                          </span>

                          <span className="text-xs text-slate-400 dark:text-neutral-600">·</span>

                          <span className="text-xs text-slate-500 dark:text-neutral-500 shrink-0">
                            {post.timeAgo}
                          </span>

                          {/* Category Badge */}
                          <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700/60">
                            {post.categoryLabel}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="p-1 rounded-full text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Milestone Badge if present */}
                      {post.childInfo && (
                        <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
                          <Award className="h-3.5 w-3.5 shrink-0" />
                          <span>{post.childInfo}</span>
                        </div>
                      )}

                      {/* Tweet Content */}
                      <p className="mt-2 text-sm text-slate-800 dark:text-neutral-200 leading-relaxed font-normal whitespace-pre-line">
                        {post.content}
                      </p>

                      {/* Attached Media / Image in Twitter rounded frame */}
                      {post.imageUrl && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-slate-200 dark:border-neutral-800 bg-slate-100 dark:bg-neutral-900 max-h-[380px]">
                          <img
                            src={post.imageUrl}
                            alt={post.title || 'Attached artwork'}
                            className="w-full h-auto max-h-[380px] object-cover hover:scale-[1.01] transition-transform"
                            loading="lazy"
                          />
                        </div>
                      )}

                      {/* Twitter Action Bar: Reply, Repost, Like, Views, Bookmark, Share */}
                      <div className="flex items-center justify-between mt-3 pt-1 text-slate-500 dark:text-neutral-500 max-w-md">
                        {/* Reply */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveReplyPostId(
                              activeReplyPostId === post.id ? null : post.id
                            );
                          }}
                          className="group flex items-center gap-1.5 hover:text-sky-500 transition-colors cursor-pointer text-xs"
                        >
                          <span className="p-2 rounded-full group-hover:bg-sky-500/10 transition-colors">
                            <MessageCircle className="h-4 w-4" />
                          </span>
                          <span>{post.commentsCount > 0 ? post.commentsCount : ''}</span>
                        </button>

                        {/* Repost (Retweet) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRepost(post.id);
                          }}
                          className={`group flex items-center gap-1.5 transition-colors cursor-pointer text-xs ${
                            post.userReposted
                              ? 'text-emerald-500 font-bold'
                              : 'hover:text-emerald-500'
                          }`}
                        >
                          <span className="p-2 rounded-full group-hover:bg-emerald-500/10 transition-colors">
                            <Repeat2 className="h-4 w-4" />
                          </span>
                          <span>{post.reposts > 0 ? post.reposts : ''}</span>
                        </button>

                        {/* Like (Heart) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(post.id);
                          }}
                          className={`group flex items-center gap-1.5 transition-colors cursor-pointer text-xs ${
                            post.userLiked
                              ? 'text-rose-500 font-bold'
                              : 'hover:text-rose-500'
                          }`}
                        >
                          <span className="p-2 rounded-full group-hover:bg-rose-500/10 transition-colors">
                            <Heart
                              className={`h-4 w-4 ${
                                post.userLiked ? 'fill-rose-500 text-rose-500' : ''
                              }`}
                            />
                          </span>
                          <span>{post.likes > 0 ? post.likes : ''}</span>
                        </button>

                        {/* Views */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-neutral-600">
                          <span className="p-2">
                            <BarChart2 className="h-4 w-4" />
                          </span>
                          <span>{post.views}</span>
                        </div>

                        {/* Bookmark & Share */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookmark(post.id);
                            }}
                            className={`p-2 rounded-full transition-colors cursor-pointer ${
                              post.bookmarked
                                ? 'text-sky-500'
                                : 'hover:text-sky-500 hover:bg-sky-500/10'
                            }`}
                          >
                            <Bookmark
                              className={`h-4 w-4 ${
                                post.bookmarked ? 'fill-sky-500' : ''
                              }`}
                            />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (navigator.share) {
                                navigator.share({
                                  title: post.title || 'Selam Kids Post',
                                  text: post.content,
                                  url: window.location.href,
                                });
                              }
                            }}
                            className="p-2 rounded-full hover:text-sky-500 hover:bg-sky-500/10 transition-colors cursor-pointer"
                          >
                            <Share className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* =============================================================
                          THREAD REPLIES SECTION (Twitter Thread layout)
                          ============================================================= */}
                      {activeReplyPostId === post.id && (
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800 space-y-3 animate-in fade-in duration-150">
                          {/* Existing Replies */}
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-2.5 pt-1">
                              <div
                                className={`w-8 h-8 rounded-full bg-gradient-to-tr ${comment.avatarBg} flex items-center justify-center font-bold text-white shrink-0 text-xs shadow-sm`}
                              >
                                {comment.author.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0 bg-slate-50 dark:bg-neutral-900/60 rounded-2xl p-3 border border-slate-100 dark:border-neutral-800">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-slate-900 dark:text-white">
                                      {comment.author}
                                    </span>
                                    <span className="text-slate-400 dark:text-neutral-500">
                                      {comment.handle}
                                    </span>
                                    <span className="text-slate-400 dark:text-neutral-600">·</span>
                                    <span className="text-slate-400 dark:text-neutral-500">
                                      {comment.time}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed font-normal">
                                  {comment.text}
                                </p>
                              </div>
                            </div>
                          ))}

                          {/* Reply Input Form */}
                          <div className="flex items-center gap-2 pt-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center font-black text-slate-950 shrink-0 text-xs">
                              M
                            </div>
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddReply(post.id);
                              }}
                              placeholder="Post your reply..."
                              className="flex-1 rounded-full bg-slate-100 dark:bg-neutral-900 border border-transparent focus:border-emerald-500 px-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddReply(post.id)}
                              disabled={!replyText.trim()}
                              className="rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-black text-xs px-4 py-2 transition-all"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </main>

        {/* =========================================================================
            RIGHT SIDEBAR (Twitter Widgets: Search, What's happening, Who to follow)
            ========================================================================= */}
        <aside className="hidden lg:block w-80 shrink-0 space-y-4 pl-6 pt-3 sticky top-4 self-start">
          
          {/* Pill Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Family Connect"
              className="w-full rounded-full bg-slate-100 dark:bg-neutral-900 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-black pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-neutral-500 focus:outline-none transition-all"
            />
          </div>

          {/* Subscribe to Premium Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/40 p-4 space-y-2">
            <h3 className="font-display font-black text-sm text-slate-900 dark:text-white">
              Young Author Club
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed font-normal">
              Unlock Ethiopian audio narration, exclusive magazine badges, and printable worksheets!
            </p>
            <button
              type="button"
              className="rounded-full bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-slate-950 font-black text-xs px-4 py-2 transition-all cursor-pointer shadow-sm"
            >
              Subscribe
            </button>
          </div>

          {/* What's Happening (Trends Widget) */}
          <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-black text-sm text-slate-900 dark:text-white">
                What&apos;s happening
              </h3>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>

            <div className="space-y-3 text-xs">
              {[
                { category: 'Ethiopian Treasures · Trending', topic: '#LalibelaSecrets', posts: '12.4K posts' },
                { category: 'Young Authors · Trending', topic: '#SimbaAdventure', posts: '8.1K posts' },
                { category: 'Family Learning · Trending', topic: '#DailyWritingRoutine', posts: '5.2K posts' },
                { category: 'Creativity Quest · Trending', topic: '#BaleMountainsPrompt', posts: '3.6K posts' },
              ].map((trend) => (
                <div
                  key={trend.topic}
                  onClick={() => setSearchQuery(trend.topic)}
                  className="cursor-pointer group block"
                >
                  <p className="text-[11px] text-slate-400 dark:text-neutral-500">
                    {trend.category}
                  </p>
                  <p className="font-bold text-slate-900 dark:text-neutral-100 group-hover:underline">
                    {trend.topic}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-neutral-500">
                    {trend.posts}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Who to follow Widget */}
          <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/40 p-4 space-y-3">
            <h3 className="font-display font-black text-sm text-slate-900 dark:text-white">
              Who to follow
            </h3>

            <div className="space-y-3">
              {[
                {
                  name: 'Coach Marcus',
                  handle: '@coach_marcus',
                  role: 'Educator',
                  initial: 'M',
                  bg: 'from-emerald-600 to-emerald-800',
                },
                {
                  name: 'Elena Rostova',
                  handle: '@elena_illustrator',
                  role: 'Children’s Illustrator',
                  initial: 'E',
                  bg: 'from-amber-500 to-orange-600',
                },
                {
                  name: 'Selam Creators',
                  handle: '@selam_creators',
                  role: 'Author Squad',
                  initial: 'S',
                  bg: 'from-purple-600 to-indigo-700',
                },
              ].map((user) => {
                const isFollowed = !!followedUsers[user.handle];
                return (
                  <div key={user.handle} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-full bg-gradient-to-tr ${user.bg} flex items-center justify-center font-bold text-white shrink-0 text-xs`}
                      >
                        {user.initial}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate hover:underline cursor-pointer">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-neutral-500 truncate">
                          {user.handle}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFollow(user.handle)}
                      className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                        isFollowed
                          ? 'border border-slate-300 dark:border-neutral-700 text-slate-700 dark:text-neutral-300 hover:border-rose-500 hover:text-rose-500'
                          : 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-neutral-200'
                      }`}
                    >
                      {isFollowed ? 'Following' : 'Follow'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Terms */}
          <div className="px-2 text-[11px] text-slate-400 dark:text-neutral-600 space-y-1">
            <div className="flex flex-wrap gap-x-2 gap-y-0.5">
              <span className="hover:underline cursor-pointer">Terms of Service</span>
              <span className="hover:underline cursor-pointer">Privacy Policy</span>
              <span className="hover:underline cursor-pointer">Cookie Policy</span>
              <span className="hover:underline cursor-pointer">Accessibility</span>
            </div>
            <p>© 2026 Selam Kids Community, Inc.</p>
          </div>
        </aside>

      </div>
    </div>
  );
}
