'use client';

import * as React from 'react';
import {
  Users,
  Heart,
  MessageSquare,
  Share2,
  Plus,
  Send,
  BookOpen,
  Award,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: 'Parent' | 'Educator' | 'Young Author Family';
  authorAvatar?: string;
  title: string;
  content: string;
  category: 'spotlight' | 'tips' | 'prompts' | 'discussion';
  categoryLabel: string;
  categoryColor: string;
  childInfo?: string;
  likes: number;
  userLiked: boolean;
  commentsCount: number;
  timeAgo: string;
  comments: { id: string; author: string; text: string; time: string }[];
}

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: '1',
    authorName: 'Sarah Jenkins',
    authorRole: 'Young Author Family',
    title: 'Leo published his first 500-word chapter story!',
    content:
      'We wanted to share how proud we are of Leo (age 8). He used the vocabulary tools in Word Dash to craft an adventure about a starry dragon who rescues lost animals. The gamified glowing orbs gave him the extra spark to keep revising until it was perfect!',
    category: 'spotlight',
    categoryLabel: 'Story Spotlight',
    categoryColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    childInfo: 'Child: Leo • Grade 3',
    likes: 38,
    userLiked: false,
    commentsCount: 5,
    timeAgo: '2 hours ago',
    comments: [
      { id: 'c1', author: 'Mark T.', text: 'Way to go Leo! Love seeing young authors flourish!', time: '1 hour ago' },
      { id: 'c2', author: 'Elena Rostova', text: '500 words is a huge milestone for Grade 3!', time: '35 mins ago' },
    ],
  },
  {
    id: '2',
    authorName: 'David Chen',
    authorRole: 'Parent',
    title: 'Our 20-minute evening family writing routine',
    content:
      'After dinner, we set a 20-minute timer where everyone—parents included—writes or doodles. Our daughter loves pairing her writing with the Color Studio. It removed all the pressure and turned writing from homework into a fun creative habit.',
    category: 'tips',
    categoryLabel: 'Parent Tip',
    categoryColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    likes: 54,
    userLiked: true,
    commentsCount: 8,
    timeAgo: 'Yesterday',
    comments: [
      { id: 'c3', author: 'Jessica M.', text: 'Writing alongside our kids makes such a big difference!', time: 'Yesterday' },
    ],
  },
  {
    id: '3',
    authorName: 'Coach Marcus',
    authorRole: 'Educator',
    title: 'Monthly Creative Challenge: The Creature with Two Shadows',
    content:
      'Here is a fun prompt for this week: "You discover an animal in the Whispering Forest that casts two different colored shadows." Ask your kids what each shadow does and encourage them to use descriptive sensory words!',
    category: 'prompts',
    categoryLabel: 'Writing Prompt',
    categoryColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    likes: 92,
    userLiked: false,
    commentsCount: 14,
    timeAgo: '3 days ago',
    comments: [
      { id: 'c4', author: 'The Patel Family', text: 'Trying this tonight! Our son chose an owl with neon wings.', time: '2 days ago' },
    ],
  },
];

export default function CommunityPage() {
  const [posts, setPosts] = React.useState<CommunityPost[]>(INITIAL_POSTS);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [isPosting, setIsPosting] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newContent, setNewContent] = React.useState('');
  const [newCategory, setNewCategory] = React.useState<'spotlight' | 'tips' | 'prompts' | 'discussion'>('discussion');
  const [activeCommentPostId, setActiveCommentPostId] = React.useState<string | null>(null);
  const [commentText, setCommentText] = React.useState('');

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

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPostItem: CommunityPost = {
      id: Date.now().toString(),
      authorName: 'My Family',
      authorRole: 'Young Author Family',
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      categoryLabel:
        newCategory === 'spotlight'
          ? 'Story Spotlight'
          : newCategory === 'tips'
          ? 'Parent Tip'
          : newCategory === 'prompts'
          ? 'Writing Prompt'
          : 'Discussion',
      categoryColor:
        newCategory === 'spotlight'
          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
          : newCategory === 'tips'
          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
          : newCategory === 'prompts'
          ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      likes: 1,
      userLiked: true,
      commentsCount: 0,
      timeAgo: 'Just now',
      comments: [],
    };

    setPosts([newPostItem, ...posts]);
    setNewTitle('');
    setNewContent('');
    setIsPosting(false);
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: Date.now().toString(),
            author: 'My Family',
            text: commentText.trim(),
            time: 'Just now',
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );

    setCommentText('');
  };

  const filteredPosts = posts.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* =========================================================================
          MINIMAL HEADER
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-purple-900/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700/50">
              <Users className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
              Family & Educator Network
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Community <span className="text-emerald-500 dark:text-emerald-400">Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-purple-300/80 mt-0.5">
            Share young author milestones, reading tips, and creative writing prompts
          </p>
        </div>

        <Button
          variant="emerald"
          size="sm"
          onClick={() => setIsPosting(!isPosting)}
          className="font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          {isPosting ? 'Cancel' : 'New Post'}
        </Button>
      </div>

      {/* =========================================================================
          CREATE POST CARD (Collapsible)
          ========================================================================= */}
      {isPosting && (
        <form
          onSubmit={handleCreatePost}
          className="rounded-2xl bg-white dark:bg-[#13092e] border border-purple-200 dark:border-purple-800/60 p-5 shadow-lg space-y-4 animate-in fade-in duration-200"
        >
          <h3 className="font-display font-black text-lg text-slate-900 dark:text-white">
            Share with the Community
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-purple-300 mb-1">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'spotlight', label: 'Story Spotlight' },
                { id: 'tips', label: 'Parent Tip' },
                { id: 'prompts', label: 'Writing Prompt' },
                { id: 'discussion', label: 'General Discussion' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setNewCategory(cat.id as any)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    newCategory === cat.id
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                      : 'bg-slate-100 dark:bg-purple-950/60 text-slate-600 dark:text-purple-300 border border-slate-200 dark:border-purple-800/50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-purple-300 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. How we celebrated our first complete chapter book"
              className="w-full rounded-xl bg-slate-50 dark:bg-purple-950/40 border border-slate-200 dark:border-purple-800/60 px-3.5 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-purple-300 mb-1">
              Message
            </label>
            <textarea
              required
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Write your story, question, or tip..."
              className="w-full rounded-xl bg-slate-50 dark:bg-purple-950/40 border border-slate-200 dark:border-purple-800/60 px-3.5 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPosting(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="emerald"
              size="sm"
              className="text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5"
            >
              Publish Post
            </Button>
          </div>
        </form>
      )}

      {/* =========================================================================
          CATEGORY FILTER TABS
          ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Posts' },
          { id: 'spotlight', label: 'Story Spotlights' },
          { id: 'tips', label: 'Parent Tips' },
          { id: 'prompts', label: 'Writing Prompts' },
          { id: 'discussion', label: 'Discussions' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-white dark:bg-purple-950/50 text-slate-600 dark:text-purple-300 border border-slate-200 dark:border-purple-800/50 hover:border-purple-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* =========================================================================
          COMMUNITY POSTS FEED
          ========================================================================= */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="rounded-2xl bg-white dark:bg-[#13092e] border border-slate-200/80 dark:border-purple-800/50 p-5 sm:p-6 shadow-sm hover:border-purple-400 dark:hover:border-purple-600/70 transition-all"
          >
            {/* Post Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center font-bold text-xs text-purple-700 dark:text-purple-200 shrink-0">
                  {post.authorName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-sm text-slate-900 dark:text-white">
                      {post.authorName}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-purple-300/70">
                      • {post.timeAgo}
                    </span>
                  </div>
                  <span className="text-[11px] text-purple-600 dark:text-purple-300 font-medium">
                    {post.authorRole}
                  </span>
                </div>
              </div>

              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${post.categoryColor}`}
              >
                {post.categoryLabel}
              </span>
            </div>

            {/* Title & Body */}
            <h3 className="font-display font-black text-lg text-slate-900 dark:text-white mb-2">
              {post.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-purple-200/90 leading-relaxed font-medium">
              {post.content}
            </p>

            {post.childInfo && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/50">
                <Award className="h-3.5 w-3.5" />
                <span>{post.childInfo}</span>
              </div>
            )}

            {/* Post Actions (Like, Comment, Share) */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-purple-900/40 text-xs">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                    post.userLiked
                      ? 'text-rose-500'
                      : 'text-slate-500 dark:text-purple-300 hover:text-rose-500'
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      post.userLiked ? 'fill-rose-500 text-rose-500' : ''
                    }`}
                  />
                  <span>{post.likes}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveCommentPostId(
                      activeCommentPostId === post.id ? null : post.id
                    )
                  }
                  className="flex items-center gap-1.5 text-slate-500 dark:text-purple-300 hover:text-purple-600 dark:hover:text-white font-bold transition-colors cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.commentsCount} Comments</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-400 dark:text-purple-400">
                Family Friendly • Safe Community
              </span>
            </div>

            {/* Comment Section (Expanded) */}
            {activeCommentPostId === post.id && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-purple-900/30 space-y-3 animate-in fade-in duration-150">
                {post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-purple-950/40 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-slate-600 dark:text-purple-300">
                      <strong className="font-bold">{comment.author}</strong>
                      <span className="text-[10px] text-slate-400">{comment.time}</span>
                    </div>
                    <p className="text-slate-700 dark:text-purple-200">{comment.text}</p>
                  </div>
                ))}

                {/* Add Comment Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment(post.id);
                    }}
                    placeholder="Write an encouraging reply..."
                    className="flex-1 rounded-xl bg-slate-50 dark:bg-purple-950/50 border border-slate-200 dark:border-purple-800/60 px-3.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-400"
                  />
                  <Button
                    size="sm"
                    variant="emerald"
                    onClick={() => handleAddComment(post.id)}
                    className="text-xs h-8 px-3 font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                  >
                    <Send className="h-3 w-3 mr-1" /> Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
