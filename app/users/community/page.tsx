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
  Camera,
  MapPin,
  Calendar,
  Link as LinkIcon,
  ArrowLeft,
  UserCheck,
  UserPlus,
  Check,
  Youtube,
  Play,
  Maximize2,
  Film,
} from 'lucide-react';
import Image from 'next/image';

// Extract YouTube video ID from various YouTube URL formats (watch, share youtu.be, shorts, embed)
function getYouTubeVideoId(url?: string): string | null {
  if (!url) return null;
  const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

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
  categoryBadgeStyle: string;
  childInfo?: string;
  imageUrl?: string;
  youtubeUrl?: string;
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
    avatar?: string;
    avatarBg: string;
    text: string;
    time: string;
    likes: number;
    userLiked?: boolean;
  }[];
}

interface UserProfile {
  name: string;
  handle: string;
  role: 'Parent' | 'Educator' | 'Young Author Family';
  initial: string;
  avatarBg: string;
  avatar?: string;
  bannerGradient: string;
  isVerified: boolean;
  bio: string;
  location: string;
  joinedDate: string;
  following: number;
  followers: number;
  storiesCount: number;
  childInfo?: string;
  website?: string;
}

const PRESET_CHARACTERS = [
  { id: 'cloud', name: 'Cloud Mascot', image: '/images/characters/cloud-guy.png' },
  { id: 'simba', name: 'Lion Simba', image: '/images/characters/simba.png' },
  { id: 'toothless', name: 'Night Fury', image: '/images/characters/toothless.png' },
  { id: 'wolf', name: 'Ethiopian Wolf', image: '/images/characters/ethiopian-wolf.png' },
  { id: 'ibex', name: 'Walia Ibex', image: '/images/characters/walia-ibex.png' },
  { id: 'nyala', name: 'Mountain Nyala', image: '/images/characters/mountain-nyala.png' },
  { id: 'lion', name: 'Abyssinian Lion', image: '/images/characters/abyssinian-lion.png' },
  { id: 'baboon', name: 'Gelada Baboon', image: '/images/characters/gelada-baboon.png' },
];

const INITIAL_PROFILES: Record<string, UserProfile> = {
  '@my_family': {
    name: 'My Family',
    handle: '@my_family',
    role: 'Young Author Family',
    initial: 'M',
    avatarBg: 'from-emerald-500 via-teal-500 to-emerald-600',
    bannerGradient: 'from-emerald-900 via-teal-950 to-purple-950',
    isVerified: true,
    bio: 'Exploring Ethiopian wonders, reading ancient mysteries, and writing creative bedtime adventures with Selam Kids! 🚀✨',
    location: 'Addis Ababa & Global',
    joinedDate: 'Joined September 2025',
    following: 48,
    followers: 124,
    storiesCount: 5,
    childInfo: 'Child: Explorer Kid • Grade 2',
    website: 'selamkids.com',
  },
  '@sarah_jenkins': {
    name: 'Sarah Jenkins',
    handle: '@sarah_jenkins',
    role: 'Young Author Family',
    initial: 'S',
    avatarBg: 'from-purple-600 to-indigo-600',
    avatar: '/images/characters/simba.png',
    bannerGradient: 'from-purple-900 via-indigo-950 to-emerald-950',
    isVerified: true,
    bio: 'Proud mom cheering on our 8yo son Leo! Big fans of Simien wildlife adventures, mythology, and creative literacy. 🌟🦁',
    location: 'Seattle, WA',
    joinedDate: 'Joined August 2025',
    following: 112,
    followers: 840,
    storiesCount: 14,
    childInfo: 'Child: Leo • Grade 3 Author',
    website: 'selamkids.com/leo-stories',
  },
  '@davidchen_dad': {
    name: 'David Chen',
    handle: '@davidchen_dad',
    role: 'Parent',
    initial: 'D',
    avatarBg: 'from-teal-500 to-emerald-600',
    bannerGradient: 'from-teal-950 via-cyan-950 to-purple-950',
    isVerified: false,
    bio: 'Father of two passionate young doodlers and storytellers. Advocating for relaxed 20-minute daily family writing habits. ☕📚',
    location: 'Toronto, Canada',
    joinedDate: 'Joined October 2025',
    following: 76,
    followers: 432,
    storiesCount: 8,
  },
  '@coach_marcus': {
    name: 'Coach Marcus',
    handle: '@coach_marcus',
    role: 'Educator',
    initial: 'M',
    avatarBg: 'from-emerald-600 to-teal-700',
    avatar: '/images/characters/cloud-guy.png',
    bannerGradient: 'from-emerald-950 via-amber-950 to-purple-950',
    isVerified: true,
    bio: 'Elementary Creative Writing Specialist. Passionate about empowering kids to invent magical animals with descriptive sensory adjectives! 🌳✏️',
    location: 'Nairobi & Virtual HQ',
    joinedDate: 'Joined July 2025',
    following: 204,
    followers: 2450,
    storiesCount: 32,
    website: 'coachmarcus.edu',
  },
  '@elena_illustrator': {
    name: 'Elena Rostova',
    handle: '@elena_illustrator',
    role: 'Educator',
    initial: 'E',
    avatarBg: 'from-amber-500 to-yellow-500',
    bannerGradient: 'from-amber-950 via-rose-950 to-purple-950',
    isVerified: true,
    bio: 'Children’s book illustrator and creative mentor. Helping young authors turn their stories into vivid visual masterpieces! 🎨✨',
    location: 'Stockholm, Sweden',
    joinedDate: 'Joined June 2025',
    following: 95,
    followers: 1890,
    storiesCount: 21,
  },
  '@selam_creators': {
    name: 'Selam Creators',
    handle: '@selam_creators',
    role: 'Young Author Family',
    initial: 'S',
    avatarBg: 'from-purple-600 to-indigo-700',
    avatar: '/images/logo.png',
    bannerGradient: 'from-purple-900 via-emerald-950 to-[#070314]',
    isVerified: true,
    bio: 'Official Selam Kids Creator Community! Discover writing prompts, Ethiopian folklore quests, and young author highlights. 🇪🇹✨',
    location: 'Addis Ababa, Ethiopia',
    joinedDate: 'Joined January 2025',
    following: 15,
    followers: 12500,
    storiesCount: 94,
    website: 'selamkids.com',
  },
};

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'yt-1',
    authorName: 'Ye Ethiopia Lijoch TV',
    authorHandle: '@yeethiopialijoch',
    authorRole: 'Educator',
    authorInitial: 'Y',
    avatarBg: 'from-amber-500 to-rose-500',
    isVerified: true,
    title: 'አንበሳና አይጥ - Ethiopian Animated Kids Story (Lion and Mouse)',
    content:
      'Watch today\'s featured Ethiopian animated tale: "The Lion and the Mouse" (አንበሳና አይጥ)! A heartwarming animated story teaching kindness, friendship, and wisdom for our young authors. 🦁🐭✨\n\nEnjoy the video together with your kids below!',
    category: 'spotlight',
    categoryLabel: 'Story Spotlight',
    categoryBadgeStyle: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    youtubeUrl: 'https://www.youtube.com/watch?v=ICk03t9WTcE',
    likes: 142,
    userLiked: true,
    reposts: 35,
    userReposted: false,
    views: '12.4K',
    bookmarked: true,
    commentsCount: 2,
    timeAgo: '45m',
    comments: [
      {
        id: 'c-yt-1',
        author: 'Sarah Jenkins',
        handle: '@sarah_jenkins',
        avatarBg: 'from-purple-600 to-indigo-600',
        text: 'Leo loved watching this! It inspired his new drawing this afternoon.',
        time: '30m',
        likes: 5,
      },
      {
        id: 'c-yt-2',
        author: 'David Chen',
        handle: '@davidchen_dad',
        avatarBg: 'from-teal-500 to-emerald-600',
        text: 'The animation and moral are so wonderful for bedtime storytelling.',
        time: '15m',
        likes: 3,
      },
    ],
  },
  {
    id: 'yt-2',
    authorName: 'Selam Kids Animated Theater',
    authorHandle: '@selamkids_theater',
    authorRole: 'Educator',
    authorInitial: 'S',
    avatarBg: 'from-emerald-500 to-teal-600',
    isVerified: true,
    title: 'ሰባቱ የፍየል ልጆች - The Seven Little Goats (Ethiopian Fairy Tale)',
    content:
      'Classic folklore adventure: "The Seven Little Goats" (ሰባቱ የፍየል ልጆች)! A fun and educational animation about staying attentive, working together, and family love. 🐐🏡\n\nClick "Open in Website" to watch right here on Selam Kids!',
    category: 'spotlight',
    categoryLabel: 'Video Story',
    categoryBadgeStyle: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
    youtubeUrl: 'https://www.youtube.com/watch?v=rBkHQMDbjEY',
    likes: 98,
    userLiked: false,
    reposts: 21,
    userReposted: false,
    views: '8.7K',
    bookmarked: false,
    commentsCount: 1,
    timeAgo: '2h',
    comments: [
      {
        id: 'c-yt-3',
        author: 'Ye Ethiopia Lijoch TV',
        handle: '@yeethiopialijoch',
        avatarBg: 'from-amber-500 to-rose-500',
        text: 'A timeless story that every child remembers with joy!',
        time: '1h',
        likes: 4,
      },
    ],
  },
  {
    id: '1',
    authorName: 'Sarah Jenkins',
    authorHandle: '@sarah_jenkins',
    authorRole: 'Young Author Family',
    authorInitial: 'S',
    avatarBg: 'from-purple-600 to-indigo-600',
    authorAvatar: '/images/characters/simba.png',
    isVerified: true,
    title: 'Leo published his first 500-word chapter story!',
    content:
      'We wanted to share how proud we are of Leo (age 8)! He used the vocabulary tools in Word Dash to craft an adventure about a starry dragon who rescues lost animals in the Simien Mountains. The glowing points gave him the extra spark to keep revising until it was perfect! 🌟✨ #YoungAuthor #LalibelaSecrets',
    category: 'spotlight',
    categoryLabel: 'Story Spotlight',
    categoryBadgeStyle: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
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
        avatarBg: 'from-amber-500 to-yellow-500',
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
    avatarBg: 'from-teal-500 to-emerald-600',
    isVerified: false,
    title: 'Our 20-minute evening family writing routine',
    content:
      'After dinner, we set a 20-minute timer where everyone—parents included—writes or doodles together. Our daughter pairs her writing with Selam Kids Color Studio. It completely removed homework pressure and turned writing into a joyful nightly ritual! 📚☕ #ParentTip #FamilyWriting',
    category: 'tips',
    categoryLabel: 'Parent Tip',
    categoryBadgeStyle: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
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
    avatarBg: 'from-emerald-600 to-teal-700',
    authorAvatar: '/images/characters/cloud-guy.png',
    isVerified: true,
    title: 'Monthly Creative Challenge: The Creature with Two Shadows',
    content:
      'Here is a fun challenge for this week: "You discover an animal in the Whispering Forest that casts two different colored shadows." Ask your kids what power each shadow has and challenge them to use 3 sensory adjectives! Post your kids\' creations below! 🦁🌳 #WritingPrompt #CreativeKids',
    category: 'prompts',
    categoryLabel: 'Writing Prompt',
    categoryBadgeStyle: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
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
        avatarBg: 'from-indigo-500 to-purple-700',
        text: 'Our son chose a golden mountain owl whose shadow creates starlight at night!',
        time: '18h',
        likes: 12,
      },
    ],
  },
];

export default function CommunityPage() {
  const [posts, setPosts] = React.useState<CommunityPost[]>(INITIAL_POSTS);
  const [profiles, setProfiles] = React.useState<Record<string, UserProfile>>(INITIAL_PROFILES);
  const [activeTab, setActiveTab] = React.useState<
    'for-you' | 'videos' | 'spotlight' | 'tips' | 'prompts' | 'discussion'
  >('for-you');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Website In-App Video Player Modal State ("Watch in Website Player")
  const [activeModalVideo, setActiveModalVideo] = React.useState<{
    id: string;
    youtubeId: string;
    title: string;
    authorName: string;
    authorHandle: string;
    content: string;
  } | null>(null);

  // Close Video Modal on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModalVideo) {
        setActiveModalVideo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalVideo]);
  
  // Custom Profile Picture State for Current User ("My Family")
  const [myProfilePic, setMyProfilePic] = React.useState<string | null>(null);

  // Profile Modal State
  const [selectedProfileHandle, setSelectedProfileHandle] = React.useState<string | null>(null);
  const [profileActiveTab, setProfileActiveTab] = React.useState<'posts' | 'replies' | 'media' | 'likes'>('posts');

  // Add / Change Profile Picture Modal State
  const [isPhotoModalOpen, setIsPhotoModalOpen] = React.useState(false);
  const profileFileInputRef = React.useRef<HTMLInputElement | null>(null);

  // New Tweet Compose State
  const [tweetText, setTweetText] = React.useState('');
  const [newCategory, setNewCategory] = React.useState<'spotlight' | 'tips' | 'prompts' | 'discussion'>('discussion');
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = React.useState('');
  const [showYoutubeInput, setShowYoutubeInput] = React.useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Thread Reply State
  const [activeReplyPostId, setActiveReplyPostId] = React.useState<string | null>(null);
  const [replyText, setReplyText] = React.useState('');

  // Who to follow state
  const [followedUsers, setFollowedUsers] = React.useState<Record<string, boolean>>({});

  // Load custom profile picture from localStorage on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPic = localStorage.getItem('selam-kids-profile-pic');
      if (savedPic) {
        setMyProfilePic(savedPic);
        setProfiles((prev) => ({
          ...prev,
          '@my_family': {
            ...prev['@my_family'],
            avatar: savedPic,
          },
        }));
      }
    }
  }, []);

  const handleUpdateProfilePic = (picUrl: string | null) => {
    setMyProfilePic(picUrl);
    if (picUrl) {
      localStorage.setItem('selam-kids-profile-pic', picUrl);
    } else {
      localStorage.removeItem('selam-kids-profile-pic');
    }
    setProfiles((prev) => ({
      ...prev,
      '@my_family': {
        ...prev['@my_family'],
        avatar: picUrl || undefined,
      },
    }));
    setIsPhotoModalOpen(false);
  };

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo file size exceeds 5MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      handleUpdateProfilePic(result);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenProfile = (handle: string) => {
    setSelectedProfileHandle(handle);
    setProfileActiveTab('posts');
  };

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
    if (!tweetText.trim() && !youtubeUrl.trim() && !imagePreview) return;

    const detectedYt = youtubeUrl.trim() || (getYouTubeVideoId(tweetText) ? tweetText : undefined);

    const newPost: CommunityPost = {
      id: Date.now().toString(),
      authorName: 'My Family',
      authorHandle: '@my_family',
      authorRole: 'Young Author Family',
      authorInitial: 'M',
      authorAvatar: myProfilePic || undefined,
      avatarBg: 'from-emerald-500 via-teal-500 to-emerald-600',
      isVerified: true,
      content: tweetText.trim() || (detectedYt ? 'Watch this story video together!' : ''),
      category: newCategory,
      imageUrl: imagePreview || undefined,
      youtubeUrl: detectedYt,
      categoryLabel:
        newCategory === 'spotlight'
          ? 'Story Spotlight'
          : newCategory === 'tips'
          ? 'Parent Tip'
          : newCategory === 'prompts'
          ? 'Writing Prompt'
          : 'Discussion',
      categoryBadgeStyle:
        newCategory === 'spotlight'
          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
          : newCategory === 'tips'
          ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
          : newCategory === 'prompts'
          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
          : 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
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
    setYoutubeUrl('');
    setShowYoutubeInput(false);
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
            avatar: myProfilePic || undefined,
            avatarBg: 'from-emerald-500 via-teal-500 to-emerald-600',
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
    const hasVideo = !!p.youtubeUrl || !!getYouTubeVideoId(p.content);
    const matchesTab =
      activeTab === 'for-you'
        ? true
        : activeTab === 'videos'
        ? hasVideo
        : p.category === activeTab;
    const matchesSearch =
      !searchQuery.trim() ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authorHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const activeProfile = selectedProfileHandle ? profiles[selectedProfileHandle] : null;
  const activeProfilePosts = selectedProfileHandle
    ? posts.filter((p) => p.authorHandle === selectedProfileHandle)
    : [];

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#070314] text-slate-900 dark:text-slate-100 flex justify-center -mx-4 -my-4 sm:-mx-6 sm:-my-6 lg:-mx-8 lg:-my-8 transition-colors">
      {/* Central Feed Container (Twitter Main Feed + Right Sidebar) */}
      <div className="w-full max-w-6xl flex justify-between">
        
        {/* =========================================================================
            MAIN TIMELINE (Bordered feed like X/Twitter in Selam Kids brand style)
            ========================================================================= */}
        <main className="w-full max-w-2xl min-h-screen bg-white dark:bg-[#0c0522] border-x border-purple-100 dark:border-purple-900/40 pb-20 shadow-xs">
          
          {/* Sticky Header: Tabs */}
          <div className="sticky top-0 z-30 bg-white/95 dark:bg-[#0c0522]/95 backdrop-blur-md border-b border-purple-100 dark:border-purple-900/40">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-xl text-slate-900 dark:text-white tracking-wide">
                  Family <span className="text-emerald-500 dark:text-emerald-400">Connect</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
                  X Feed
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                title="Filter Topics"
                className="p-2 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/40 transition-colors text-slate-600 dark:text-purple-300"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* Twitter-style Navigation Tabs with Bottom Underline Indicator */}
            <div className="flex items-center overflow-x-auto no-scrollbar border-t border-purple-100/70 dark:border-purple-900/30 px-3 sm:px-6 gap-1 sm:gap-2">
              {[
                { id: 'for-you', label: 'For you' },
                { id: 'videos', label: '🎥 Videos' },
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
                    className="relative flex-1 min-w-[110px] sm:min-w-[130px] py-4 sm:py-5 px-3 sm:px-5 text-center text-xs sm:text-sm font-bold transition-colors hover:bg-purple-50/50 dark:hover:bg-purple-900/20 cursor-pointer whitespace-nowrap"
                  >
                    <span
                      className={
                        isActive
                          ? 'font-black text-slate-950 dark:text-white'
                          : 'text-slate-500 dark:text-purple-300/70 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold'
                      }
                    >
                      {tab.label}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 sm:w-18 h-1 rounded-full bg-emerald-500 shadow-[0_2px_10px_rgba(16,185,129,0.5)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* =======================================================================
              TWEET COMPOSER ("What is happening?!")
              ======================================================================= */}
          <div className="p-5 sm:p-7 pt-7 sm:pt-9 border-b border-purple-100 dark:border-purple-900/40 flex gap-4 sm:gap-5">
            {/* User Avatar - CLICK TO VIEW PROFILE & ADD PROFILE PIC */}
            <div className="relative group shrink-0 pt-0.5">
              <button
                type="button"
                onClick={() => handleOpenProfile('@my_family')}
                title="Click to view profile & add profile picture"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-500 to-emerald-600 ring-2 ring-emerald-300 dark:ring-emerald-700/60 shadow-md shadow-emerald-500/20 flex items-center justify-center font-black text-slate-950 text-sm overflow-hidden cursor-pointer hover:scale-105 active:scale-95 transition-all select-none"
              >
                {myProfilePic ? (
                  <img
                    src={myProfilePic}
                    alt="My Profile Picture"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>M</span>
                )}
              </button>

              {/* Small Camera badge overlay */}
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(true)}
                title="Add / Change Profile Picture"
                className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md border border-white dark:border-[#0c0522] transition-transform hover:scale-110 cursor-pointer"
              >
                <Camera className="h-2.5 w-2.5" />
              </button>
            </div>

            {/* Compose Area */}
            <div className="flex-1 min-w-0 space-y-4">
              {/* Audience pill & My Profile shortcut with generous breathing space */}
              <div className="flex items-center justify-between pb-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors shadow-xs"
                >
                  <Globe className="h-3.5 w-3.5 text-emerald-500" />
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

                <button
                  type="button"
                  onClick={() => handleOpenProfile('@my_family')}
                  className="text-xs font-bold text-slate-500 dark:text-purple-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors px-3 py-1.5 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30"
                >
                  View My Profile
                </button>
              </div>

              {/* Category selector dropdown if toggled */}
              {showCategoryPicker && (
                <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-purple-50/70 dark:bg-[#13092e] border border-purple-200/80 dark:border-purple-800/60 animate-in fade-in">
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
                      className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all ${
                        newCategory === cat.id
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                          : 'bg-white dark:bg-purple-950/80 text-slate-700 dark:text-purple-200 border border-purple-200 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-900/60'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Textarea with comfortable height and breathing room */}
              <div className="py-2.5">
                <textarea
                  value={tweetText}
                  onChange={(e) => setTweetText(e.target.value)}
                  placeholder="What is happening in your family's writing adventure?!"
                  rows={3}
                  className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-purple-300/50 text-base sm:text-lg focus:outline-none resize-none font-medium leading-relaxed"
                />
              </div>

              {/* YouTube Link Input & Live Preview */}
              {(showYoutubeInput || youtubeUrl) && (
                <div className="my-3 p-3.5 rounded-2xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-red-700 dark:text-red-300">
                    <span className="flex items-center gap-1.5">
                      <Youtube className="h-4 w-4 text-red-500" />
                      Add YouTube Video Link
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setYoutubeUrl('');
                        setShowYoutubeInput(false);
                      }}
                      className="p-1 rounded-full hover:bg-red-200/50 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="Paste YouTube link (e.g. https://www.youtube.com/watch?v=...)"
                      className="flex-1 px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#0c0522] border border-red-200 dark:border-red-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-purple-300/40 focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                    {youtubeUrl && (
                      <button
                        type="button"
                        onClick={() => setYoutubeUrl('')}
                        className="text-xs text-red-600 dark:text-red-400 hover:underline px-1 font-bold"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Sample Ethiopian Kids Stories shortcuts */}
                  <div className="flex items-center gap-2 flex-wrap pt-0.5">
                    <span className="text-[11px] text-slate-500 dark:text-purple-300/70 font-semibold">Try sample story:</span>
                    <button
                      type="button"
                      onClick={() => setYoutubeUrl('https://www.youtube.com/watch?v=ICk03t9WTcE')}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-white dark:bg-[#0c0522] border border-red-200 dark:border-red-900/60 hover:border-red-400 text-slate-700 dark:text-purple-200 font-bold transition-colors"
                    >
                      🦁 Lion & Mouse
                    </button>
                    <button
                      type="button"
                      onClick={() => setYoutubeUrl('https://www.youtube.com/watch?v=rBkHQMDbjEY')}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-white dark:bg-[#0c0522] border border-red-200 dark:border-red-900/60 hover:border-red-400 text-slate-700 dark:text-purple-200 font-bold transition-colors"
                    >
                      🐐 Seven Little Goats
                    </button>
                  </div>

                  {/* Live Embedded Preview with Website Player option */}
                  {(() => {
                    const previewId = getYouTubeVideoId(youtubeUrl);
                    if (!previewId) return null;
                    return (
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            Video Ready to Share
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setActiveModalVideo({
                                id: 'preview',
                                youtubeId: previewId,
                                title: tweetText.trim() || 'My Video Story Preview',
                                authorName: 'My Family',
                                authorHandle: '@my_family',
                                content:
                                  tweetText.trim() ||
                                  'Previewing this video story in website theater player before posting.',
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-xs cursor-pointer"
                          >
                            <Maximize2 className="h-3 w-3" />
                            <span>Watch in Website Player</span>
                          </button>
                        </div>
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-red-300 dark:border-red-800/80 bg-black shadow-md">
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${previewId}`}
                            title="YouTube Video Preview"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Attached Image Preview */}
              {imagePreview && (
                <div className="relative mt-2 mb-3 rounded-2xl overflow-hidden border border-purple-200 dark:border-purple-800/60 max-h-72 shadow-sm">
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
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/80 text-white hover:bg-slate-900 transition-colors shadow-md"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Toolbar & Post Button */}
              <div className="flex items-center justify-between pt-3 border-t border-purple-100/80 dark:border-purple-900/30">
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
                    className="p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-purple-900/40 transition-colors cursor-pointer"
                  >
                    <ImagePlus className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowYoutubeInput((prev) => !prev)}
                    title="Add YouTube Video"
                    className={`p-2 rounded-full transition-colors cursor-pointer flex items-center gap-1 ${
                      showYoutubeInput || youtubeUrl
                        ? 'bg-red-500/20 text-red-500 dark:text-red-400 ring-1 ring-red-400/50'
                        : 'hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500 dark:text-red-400'
                    }`}
                  >
                    <Youtube className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTweetText((prev) => prev + ' 🌟')}
                    title="Emoji"
                    className="p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-purple-900/40 transition-colors cursor-pointer"
                  >
                    <Smile className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTweetText((prev) => prev + ' #LalibelaSecrets ')}
                    title="Add Hashtag"
                    className="p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-purple-900/40 transition-colors cursor-pointer"
                  >
                    <Sparkles className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {tweetText.length > 0 && (
                    <span className="text-xs text-slate-400 dark:text-purple-300/60 font-mono">
                      {280 - tweetText.length}
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={!tweetText.trim() && !imagePreview && !youtubeUrl.trim()}
                    onClick={() => handleCreateTweet()}
                    className={`btn-3d rounded-full px-5 py-2 font-display font-black text-xs sm:text-sm transition-all active:scale-95 shadow-md ${
                      tweetText.trim() || imagePreview || youtubeUrl.trim()
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border border-emerald-300 shadow-emerald-500/25 cursor-pointer'
                        : 'bg-emerald-500/30 text-slate-950/40 border border-emerald-500/20 cursor-not-allowed'
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
              <div className="p-12 text-center text-slate-400 dark:text-purple-300/50">
                <p className="font-display font-bold text-base mb-1">No posts found</p>
                <p className="text-xs">Be the first to share a post in this category!</p>
              </div>
            ) : (
              filteredPosts.map((post) => {
                const isAuthorMe = post.authorHandle === '@my_family';
                const displayAvatar = isAuthorMe ? (myProfilePic || post.authorAvatar) : post.authorAvatar;

                return (
                  <article
                    key={post.id}
                    className="p-4 sm:p-5 border-b border-purple-100/80 dark:border-purple-900/40 hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-colors"
                  >
                    <div className="flex gap-3">
                      {/* Author Avatar - CLICKABLE TO VIEW PROFILE */}
                      <button
                        type="button"
                        onClick={() => handleOpenProfile(post.authorHandle)}
                        title={`View ${post.authorName}'s Profile`}
                        className={`w-10 h-10 rounded-full bg-gradient-to-tr ${post.avatarBg} shadow-sm flex items-center justify-center font-black text-white shrink-0 text-sm select-none cursor-pointer hover:scale-105 active:scale-95 transition-transform overflow-hidden ring-2 ring-transparent hover:ring-emerald-400`}
                      >
                        {displayAvatar ? (
                          <img
                            src={displayAvatar}
                            alt={post.authorName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{post.authorInitial}</span>
                        )}
                      </button>

                      {/* Main Tweet Body */}
                      <div className="flex-1 min-w-0">
                        {/* Header: Name (CLICKABLE), Verified Badge, Handle (CLICKABLE), Dot, Time, More */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                            <button
                              type="button"
                              onClick={() => handleOpenProfile(post.authorHandle)}
                              className="font-display font-black text-sm text-slate-900 dark:text-white truncate hover:underline hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer text-left"
                            >
                              {post.authorName}
                            </button>

                            {post.isVerified && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-emerald-500 text-white shrink-0" />
                            )}

                            <button
                              type="button"
                              onClick={() => handleOpenProfile(post.authorHandle)}
                              className="text-xs text-slate-500 dark:text-purple-300/70 truncate hover:underline cursor-pointer"
                            >
                              {post.authorHandle}
                            </button>

                            <span className="text-xs text-slate-400 dark:text-purple-400/50">·</span>

                            <span className="text-xs text-slate-500 dark:text-purple-300/70 shrink-0">
                              {post.timeAgo}
                            </span>

                            {/* Category Badge with brand styling */}
                            <span className={`ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${post.categoryBadgeStyle}`}>
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
                          <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-400/15 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-400/30">
                            <Award className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            <span>{post.childInfo}</span>
                          </div>
                        )}

                        {/* Tweet Content */}
                        <p className="mt-2 text-sm text-slate-800 dark:text-purple-100 leading-relaxed font-normal whitespace-pre-line">
                          {post.content}
                        </p>

                        {/* Attached Media / Image in Selam Kids rounded frame */}
                        {post.imageUrl && (
                          <div className="mt-3 rounded-2xl overflow-hidden border border-purple-200 dark:border-purple-800/60 bg-slate-50 dark:bg-purple-950/30 max-h-[380px] shadow-sm">
                            <img
                              src={post.imageUrl}
                              alt={post.title || 'Attached artwork'}
                              className="w-full h-auto max-h-[380px] object-cover hover:scale-[1.01] transition-transform"
                              loading="lazy"
                            />
                          </div>
                        )}

                        {/* Embedded Playable YouTube Video with Website Player Option */}
                        {(() => {
                          const youtubeId = getYouTubeVideoId(post.youtubeUrl || post.content);
                          if (!youtubeId) return null;
                          return (
                            <div className="mt-3 rounded-2xl overflow-hidden border-2 border-purple-200/90 dark:border-purple-800/80 bg-black shadow-lg">
                              {/* Video Card Header Bar */}
                              <div className="flex items-center justify-between px-3.5 py-2 bg-gradient-to-r from-slate-950 via-[#160738] to-slate-950 text-white border-b border-purple-800/60">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="p-1 rounded-md bg-red-600 text-white shrink-0">
                                    <Play className="h-3 w-3 fill-white" />
                                  </div>
                                  <span className="text-xs font-black truncate text-purple-100">
                                    {post.title || 'Selam Kids Video Story'}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActiveModalVideo({
                                      id: post.id,
                                      youtubeId,
                                      title: post.title || 'Selam Kids Video Story',
                                      authorName: post.authorName,
                                      authorHandle: post.authorHandle,
                                      content: post.content,
                                    })
                                  }
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all hover:scale-105 shadow-xs cursor-pointer shrink-0"
                                  title="Open video in website player"
                                >
                                  <Maximize2 className="h-3 w-3" />
                                  <span>Open in Website</span>
                                </button>
                              </div>

                              {/* Playable Video Frame */}
                              <div className="relative aspect-video w-full bg-black">
                                <iframe
                                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
                                  title={post.title || 'Community Video Story'}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="w-full h-full border-0"
                                />
                              </div>
                            </div>
                          );
                        })()}

                        {/* Twitter Action Bar: Reply, Repost, Like, Views, Bookmark, Share */}
                        <div className="flex items-center justify-between mt-3 pt-1 text-slate-500 dark:text-purple-300/70 max-w-md">
                          {/* Reply */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveReplyPostId(
                                activeReplyPostId === post.id ? null : post.id
                              );
                            }}
                            className="group flex items-center gap-1.5 hover:text-emerald-500 transition-colors cursor-pointer text-xs"
                          >
                            <span className="p-2 rounded-full group-hover:bg-emerald-500/10 transition-colors">
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
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-purple-400/50">
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
                                  ? 'text-amber-500'
                                  : 'hover:text-amber-500 hover:bg-amber-500/10'
                              }`}
                            >
                              <Bookmark
                                className={`h-4 w-4 ${
                                  post.bookmarked ? 'fill-amber-500' : ''
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
                              className="p-2 rounded-full hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                            >
                              <Share className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* =============================================================
                            THREAD REPLIES SECTION (Twitter Thread layout)
                            ============================================================= */}
                        {activeReplyPostId === post.id && (
                          <div className="mt-4 pt-3 border-t border-purple-100 dark:border-purple-900/40 space-y-3 animate-in fade-in duration-150">
                            {/* Existing Replies */}
                            {post.comments.map((comment) => {
                              const isCommentMe = comment.handle === '@my_family';
                              const commentAvatar = isCommentMe ? (myProfilePic || comment.avatar) : comment.avatar;

                              return (
                                <div key={comment.id} className="flex gap-2.5 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenProfile(comment.handle)}
                                    className={`w-8 h-8 rounded-full bg-gradient-to-tr ${comment.avatarBg} flex items-center justify-center font-bold text-white shrink-0 text-xs shadow-sm overflow-hidden cursor-pointer hover:scale-105 transition-transform`}
                                  >
                                    {commentAvatar ? (
                                      <img
                                        src={commentAvatar}
                                        alt={comment.author}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span>{comment.author.charAt(0)}</span>
                                    )}
                                  </button>
                                  <div className="flex-1 min-w-0 bg-purple-50/50 dark:bg-purple-950/40 rounded-2xl p-3 border border-purple-100 dark:border-purple-900/40">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                      <div className="flex items-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenProfile(comment.handle)}
                                          className="font-bold text-slate-900 dark:text-white hover:underline text-left"
                                        >
                                          {comment.author}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleOpenProfile(comment.handle)}
                                          className="text-slate-400 dark:text-purple-300/60 hover:underline"
                                        >
                                          {comment.handle}
                                        </button>
                                        <span className="text-slate-400 dark:text-purple-400/50">·</span>
                                        <span className="text-slate-400 dark:text-purple-300/60">
                                          {comment.time}
                                        </span>
                                      </div>
                                    </div>
                                    <p className="text-xs text-slate-700 dark:text-purple-200 leading-relaxed font-normal">
                                      {comment.text}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}

                            {/* Reply Input Form */}
                            <div className="flex items-center gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => handleOpenProfile('@my_family')}
                                className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center font-black text-slate-950 shrink-0 text-xs overflow-hidden cursor-pointer"
                              >
                                {myProfilePic ? (
                                  <img
                                    src={myProfilePic}
                                    alt="My Avatar"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span>M</span>
                                )}
                              </button>
                              <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddReply(post.id);
                                }}
                                placeholder="Post your reply..."
                                className="flex-1 rounded-full bg-slate-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 focus:border-emerald-500 px-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-purple-300/50 focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddReply(post.id)}
                                disabled={!replyText.trim()}
                                className="btn-3d rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-black text-xs px-4 py-2 transition-all border border-emerald-300"
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </main>

        {/* =========================================================================
            RIGHT SIDEBAR (Twitter Widgets styled in Selam Kids Brand Palette)
            ========================================================================= */}
        <aside className="hidden lg:block w-80 shrink-0 space-y-4 pl-6 pt-3 sticky top-4 self-start">
          
          {/* Pill Search Input with Brand Focus */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-purple-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Family Connect"
              className="w-full rounded-full bg-purple-50/70 dark:bg-purple-950/50 border border-purple-200/60 dark:border-purple-800/60 focus:border-emerald-500 focus:bg-white dark:focus:bg-[#0c0522] pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-purple-300/50 focus:outline-none transition-all shadow-xs"
            />
          </div>

          {/* Subscribe to Premium Card in Selam Kids Gold / Emerald Brand Colors */}
          <div className="rounded-2xl border border-amber-300/70 dark:border-amber-400/30 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 dark:from-purple-950/60 dark:via-[#140c36] dark:to-purple-950/40 p-4 space-y-2 shadow-sm">
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <Sparkles className="h-4 w-4" />
              <h3 className="font-display font-black text-sm text-slate-900 dark:text-white">
                Young Author Club
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-purple-200/80 leading-relaxed font-normal">
              Unlock Ethiopian audio narration, exclusive magazine badges, and printable creative worksheets!
            </p>
            <button
              type="button"
              className="btn-3d rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-display font-black text-xs px-4 py-2 transition-all cursor-pointer shadow-md shadow-amber-400/20 border border-yellow-200"
            >
              Subscribe
            </button>
          </div>

          {/* What's Happening (Trends Widget in Brand Purple / Emerald) */}
          <div className="rounded-2xl border border-purple-100 dark:border-purple-900/40 bg-white dark:bg-[#12082e]/80 p-4 space-y-3 shadow-xs">
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
                  <p className="text-[11px] text-purple-600/70 dark:text-purple-300/60 font-semibold">
                    {trend.category}
                  </p>
                  <p className="font-bold text-slate-900 dark:text-purple-100 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                    {trend.topic}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-purple-400/50">
                    {trend.posts}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Who to follow Widget in Brand Palette */}
          <div className="rounded-2xl border border-purple-100 dark:border-purple-900/40 bg-white dark:bg-[#12082e]/80 p-4 space-y-3 shadow-xs">
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
                  avatar: '/images/characters/cloud-guy.png',
                  bg: 'from-emerald-600 to-teal-700',
                },
                {
                  name: 'Elena Rostova',
                  handle: '@elena_illustrator',
                  role: 'Children’s Illustrator',
                  initial: 'E',
                  bg: 'from-amber-500 to-yellow-600',
                },
                {
                  name: 'Selam Creators',
                  handle: '@selam_creators',
                  role: 'Author Squad',
                  initial: 'S',
                  avatar: '/images/logo.png',
                  bg: 'from-purple-600 to-indigo-700',
                },
              ].map((user) => {
                const isFollowed = !!followedUsers[user.handle];
                return (
                  <div key={user.handle} className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => handleOpenProfile(user.handle)}
                      className="flex items-center gap-2 min-w-0 text-left cursor-pointer group"
                    >
                      <div
                        className={`w-9 h-9 rounded-full bg-gradient-to-tr ${user.bg} shadow-sm flex items-center justify-center font-bold text-white shrink-0 text-xs overflow-hidden group-hover:ring-2 group-hover:ring-emerald-400 transition-all`}
                      >
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{user.initial}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate group-hover:underline group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-purple-300/60 truncate">
                          {user.handle}
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleFollow(user.handle)}
                      className={`btn-3d rounded-full px-3.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                        isFollowed
                          ? 'border border-purple-200 dark:border-purple-700/80 bg-purple-50/50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 hover:border-rose-400 hover:text-rose-500'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black border border-emerald-300 shadow-sm'
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
          <div className="px-2 text-[11px] text-slate-400 dark:text-purple-400/60 space-y-1">
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

      {/* =========================================================================
          X / TWITTER STYLE USER PROFILE MODAL
          ========================================================================= */}
      {activeProfile && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0c0522] rounded-3xl border-2 border-purple-200 dark:border-purple-800/80 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            
            {/* Modal Top Header (Back/Close button, Name, Story count) */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/95 dark:bg-[#0c0522]/95 backdrop-blur-md border-b border-purple-100 dark:border-purple-900/40">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedProfileHandle(null)}
                  className="p-2 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/40 text-slate-700 dark:text-purple-300 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-display font-black text-lg text-slate-900 dark:text-white leading-tight">
                      {activeProfile.name}
                    </h2>
                    {activeProfile.isVerified && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-emerald-500 text-white" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-purple-400">
                    {activeProfilePosts.length} posts · {activeProfile.storiesCount} stories written
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProfileHandle(null)}
                className="p-2 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/40 text-slate-500 dark:text-purple-400 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Profile Body */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {/* Cover Banner */}
              <div
                className={`relative w-full h-36 sm:h-44 bg-gradient-to-r ${activeProfile.bannerGradient}`}
              >
                <div className="absolute inset-0 stars-pattern opacity-30 pointer-events-none" />
              </div>

              {/* Profile Details Container */}
              <div className="px-5 sm:px-6 pb-4">
                {/* Avatar and Action Buttons Row */}
                <div className="flex items-end justify-between -mt-14 sm:-mt-16 mb-4">
                  {/* Large Profile Avatar */}
                  <div className="relative group">
                    <div
                      className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr ${activeProfile.avatarBg} border-4 border-white dark:border-[#0c0522] shadow-xl flex items-center justify-center font-black text-white text-3xl sm:text-4xl overflow-hidden select-none`}
                    >
                      {activeProfile.handle === '@my_family' && myProfilePic ? (
                        <img
                          src={myProfilePic}
                          alt={activeProfile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : activeProfile.avatar ? (
                        <img
                          src={activeProfile.avatar}
                          alt={activeProfile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{activeProfile.initial}</span>
                      )}
                    </div>

                    {/* Camera icon badge if viewing own profile */}
                    {activeProfile.handle === '@my_family' && (
                      <button
                        type="button"
                        onClick={() => setIsPhotoModalOpen(true)}
                        title="Click to Add / Change Profile Picture"
                        className="absolute bottom-1 right-1 p-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-2 border-white dark:border-[#0c0522] shadow-lg transition-transform hover:scale-110 cursor-pointer"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div>
                    {activeProfile.handle === '@my_family' ? (
                      <button
                        type="button"
                        onClick={() => setIsPhotoModalOpen(true)}
                        className="btn-3d flex items-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-xs sm:text-sm px-4 sm:px-5 py-2 border border-emerald-300 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Add / Change Profile Pic</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleFollow(activeProfile.handle)}
                        className={`btn-3d rounded-full px-5 py-2 font-display font-black text-xs sm:text-sm transition-all cursor-pointer ${
                          followedUsers[activeProfile.handle]
                            ? 'border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border border-emerald-300 shadow-md'
                        }`}
                      >
                        {followedUsers[activeProfile.handle] ? 'Following' : 'Follow'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Name, Handle, Role Badge */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                      {activeProfile.name}
                    </h3>
                    {activeProfile.isVerified && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-emerald-500 text-white" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-purple-300/70 font-mono">
                      {activeProfile.handle}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                      {activeProfile.role}
                    </span>
                  </div>
                </div>

                {/* Milestone Badge if present */}
                {activeProfile.childInfo && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400/15 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-400/30">
                    <Award className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>{activeProfile.childInfo}</span>
                  </div>
                )}

                {/* Bio */}
                <p className="mt-3 text-sm text-slate-800 dark:text-purple-100 leading-relaxed font-normal">
                  {activeProfile.bio}
                </p>

                {/* Meta details: Location, Joined Date, Website */}
                <div className="flex items-center gap-4 flex-wrap mt-3 text-xs text-slate-500 dark:text-purple-400/70">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{activeProfile.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{activeProfile.joinedDate}</span>
                  </div>
                  {activeProfile.website && (
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline">
                      <LinkIcon className="h-3.5 w-3.5" />
                      <span>{activeProfile.website}</span>
                    </div>
                  )}
                </div>

                {/* Following / Followers Stats */}
                <div className="flex items-center gap-5 mt-3 pt-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {activeProfile.following}
                    </span>{' '}
                    <span className="text-slate-500 dark:text-purple-400/70">Following</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {activeProfile.followers}
                    </span>{' '}
                    <span className="text-slate-500 dark:text-purple-400/70">Followers</span>
                  </div>
                </div>
              </div>

              {/* Profile Tabs: Posts, Replies, Media, Likes */}
              <div className="flex items-center border-b border-purple-100 dark:border-purple-900/40 border-t">
                {[
                  { id: 'posts', label: 'Posts' },
                  { id: 'replies', label: 'Replies' },
                  { id: 'media', label: 'Media' },
                  { id: 'likes', label: 'Likes' },
                ].map((tab) => {
                  const isActive = profileActiveTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setProfileActiveTab(tab.id as any)}
                      className="relative flex-1 py-3 text-center text-xs sm:text-sm font-bold transition-colors hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
                    >
                      <span
                        className={
                          isActive
                            ? 'font-black text-slate-950 dark:text-white'
                            : 'text-slate-500 dark:text-purple-300/70'
                        }
                      >
                        {tab.label}
                      </span>
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-emerald-500 shadow-[0_2px_8px_rgba(16,185,129,0.5)]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Posts by this Profile */}
              <div>
                {activeProfilePosts.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 dark:text-purple-300/50 text-xs">
                    No posts published yet by {activeProfile.name}.
                  </div>
                ) : (
                  activeProfilePosts.map((post) => (
                    <article
                      key={post.id}
                      className="p-4 sm:p-5 border-b border-purple-100/80 dark:border-purple-900/40 hover:bg-purple-50/30 dark:hover:bg-purple-950/20 transition-colors"
                    >
                      <div className="flex gap-3">
                        <div
                          className={`w-9 h-9 rounded-full bg-gradient-to-tr ${post.avatarBg} flex items-center justify-center font-black text-white shrink-0 text-xs overflow-hidden`}
                        >
                          {post.authorHandle === '@my_family' && myProfilePic ? (
                            <img src={myProfilePic} alt="avatar" className="w-full h-full object-cover" />
                          ) : post.authorAvatar ? (
                            <img src={post.authorAvatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span>{post.authorInitial}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-display font-black text-sm text-slate-900 dark:text-white">
                              {post.authorName}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-purple-400/60">
                              {post.authorHandle} · {post.timeAgo}
                            </span>
                          </div>
                          <p className="mt-1 text-xs sm:text-sm text-slate-800 dark:text-purple-100 leading-relaxed">
                            {post.content}
                          </p>
                          {post.imageUrl && (
                            <div className="mt-2.5 rounded-xl overflow-hidden border border-purple-200 dark:border-purple-800/60 max-h-56">
                              <img src={post.imageUrl} alt="post" className="w-full h-auto object-cover max-h-56" />
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          ADD / CHANGE PROFILE PICTURE MODAL
          ========================================================================= */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0c0522] rounded-3xl border-2 border-emerald-400/60 dark:border-emerald-500/50 p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/40 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-emerald-500" />
                <h3 className="font-display font-black text-lg text-slate-900 dark:text-white">
                  Profile Picture
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/40 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Current Avatar Preview */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-500 to-emerald-600 ring-4 ring-emerald-300 dark:ring-emerald-600/60 shadow-xl overflow-hidden flex items-center justify-center font-black text-white text-3xl select-none">
                {myProfilePic ? (
                  <img
                    src={myProfilePic}
                    alt="Current Profile Picture"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>M</span>
                )}
              </div>
              <p className="mt-2 text-xs font-bold text-slate-600 dark:text-purple-300">
                {myProfilePic ? 'Custom Photo Active' : 'Default Initial Avatar'}
              </p>
            </div>

            {/* Option 1: Upload from Device */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-purple-200">
                Option 1: Upload from Phone / Computer
              </label>
              <input
                ref={profileFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePhotoUpload}
              />
              <button
                type="button"
                onClick={() => profileFileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-dashed border-emerald-400/80 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 text-xs font-bold transition-all cursor-pointer"
              >
                <ImagePlus className="h-4 w-4" />
                <span>Choose Photo file (PNG, JPG, WebP)</span>
              </button>
            </div>

            {/* Option 2: Choose Selam Kids Character */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-purple-200">
                Option 2: Pick an Ethiopian Companion Beast
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {PRESET_CHARACTERS.map((char) => {
                  const isSelected = myProfilePic === char.image;
                  return (
                    <button
                      key={char.id}
                      type="button"
                      onClick={() => handleUpdateProfilePic(char.image)}
                      title={char.name}
                      className={`group relative rounded-2xl p-1.5 border-2 transition-all flex flex-col items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 shadow-md ring-2 ring-emerald-400'
                          : 'border-purple-100 dark:border-purple-800/60 bg-slate-50 dark:bg-purple-950/40 hover:border-emerald-400'
                      }`}
                    >
                      <div className="relative w-11 h-11">
                        <Image
                          src={char.image}
                          alt={char.name}
                          fill
                          sizes="44px"
                          className="object-contain"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 dark:text-purple-200 truncate w-full text-center">
                        {char.name.split(' ')[0]}
                      </span>
                      {isSelected && (
                        <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset / Remove Photo */}
            {myProfilePic && (
              <div className="pt-2 border-t border-purple-100 dark:border-purple-900/40 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => handleUpdateProfilePic(null)}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Remove Photo (Reset to Default)
                </button>
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          WEBSITE IN-APP VIDEO PLAYER MODAL (Theater Mode inside Selam Kids)
          Opens the YouTube video directly inside the website with story details,
          author info, related stories, and a prominent Return to Community button.
          ========================================================================= */}
      {activeModalVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModalVideo(null);
          }}
        >
          <div className="relative w-full max-w-4xl bg-white dark:bg-[#0c0522] rounded-3xl border-2 border-emerald-500/40 dark:border-purple-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-100 dark:bg-[#130830] border-b border-purple-100 dark:border-purple-900/50">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModalVideo(null)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-200/60 dark:bg-purple-900/50 hover:bg-emerald-500 hover:text-slate-950 text-slate-800 dark:text-purple-100 text-xs font-black transition-all cursor-pointer shadow-xs"
                  title="Return to Community Page"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Return to Community</span>
                </button>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black text-slate-600 dark:text-purple-300 uppercase tracking-wider">
                    Selam Kids In-Website Player
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-purple-400/80 truncate max-w-[180px] sm:max-w-xs">
                  {activeModalVideo.authorName} ({activeModalVideo.authorHandle})
                </span>
                <button
                  type="button"
                  onClick={() => setActiveModalVideo(null)}
                  className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-purple-900/60 text-slate-500 dark:text-purple-300 hover:text-rose-500 transition-colors cursor-pointer"
                  title="Close Video"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Video Player (16:9 HD Theater Player) */}
            <div className="relative aspect-video w-full bg-black shadow-inner">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeModalVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeModalVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Video Details & Actions */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-100 dark:border-purple-900/40">
                <div>
                  <h3 className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white">
                    {activeModalVideo.title}
                  </h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                    Shared by {activeModalVideo.authorName} • Selam Kids Community
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalVideo(null)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
                  >
                    Back to Feed
                  </button>
                </div>
              </div>

              {/* Story Content / Description */}
              <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-[#130830]/80 border border-purple-100 dark:border-purple-900/40">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-purple-400 block mb-1">
                  Story Details
                </span>
                <p className="text-sm text-slate-800 dark:text-purple-100 whitespace-pre-line leading-relaxed">
                  {activeModalVideo.content}
                </p>
              </div>

              {/* More Video Stories */}
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-purple-300 block mb-2">
                  More Video Stories in Community
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {posts
                    .filter(
                      (p) =>
                        (p.youtubeUrl || getYouTubeVideoId(p.content)) &&
                        p.id !== activeModalVideo.id
                    )
                    .slice(0, 2)
                    .map((otherPost) => {
                      const otherYtId = getYouTubeVideoId(
                        otherPost.youtubeUrl || otherPost.content
                      );
                      if (!otherYtId) return null;
                      return (
                        <button
                          key={otherPost.id}
                          type="button"
                          onClick={() =>
                            setActiveModalVideo({
                              id: otherPost.id,
                              youtubeId: otherYtId,
                              title:
                                otherPost.title ||
                                'Ethiopian Kids Animated Story',
                              authorName: otherPost.authorName,
                              authorHandle: otherPost.authorHandle,
                              content: otherPost.content,
                            })
                          }
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800/50 hover:border-emerald-400 text-left transition-all cursor-pointer group"
                        >
                          <div className="w-16 h-11 rounded-lg bg-black overflow-hidden relative shrink-0">
                            <img
                              src={`https://img.youtube.com/vi/${otherYtId}/mqdefault.jpg`}
                              alt={otherPost.title || 'Video'}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <Play className="h-3 w-3 fill-white text-white" />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-black text-slate-900 dark:text-white truncate group-hover:text-emerald-500 transition-colors">
                              {otherPost.title || 'Animated Tale'}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-purple-300/70 truncate">
                              {otherPost.authorName}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
