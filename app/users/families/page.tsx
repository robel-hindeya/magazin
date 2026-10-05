import { requireAuth } from '@/backend/auth/guards';
import { FamilyService } from '@/backend/services/family.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Users,
  Award,
  BookOpen,
  Plus,
  ArrowRight,
  Settings,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ParentLockExitButton } from '@/components/navigation/parent-gate-button';

export default async function FamiliesDashboardPage() {
  const user = await requireAuth();
  const familyService = new FamilyService();
  const family = await familyService.getMyFamily(user);

  const totalWords = family.children.reduce((acc, c) => acc + (c.words_written || 0), 0);
  const totalOrbs = family.children.reduce((acc, c) => acc + (c.orbs || 0), 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* =========================================================================
          MINIMAL HEADER
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-purple-900/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700/50">
              <Users className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
              {family.family_name}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
              {family.subscription_tier} Plan
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Family <span className="text-emerald-500 dark:text-emerald-400">Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-purple-300/80 mt-0.5">
            Monitor your children&apos;s writing adventures and reading progress
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/users/families/settings#add-child">
            <Button
              size="sm"
              variant="emerald"
              className="text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Child
            </Button>
          </Link>
          <Link href="/users/families/settings">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-bold border-slate-200 dark:border-purple-800 gap-1.5"
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Button>
          </Link>
          <ParentLockExitButton />
        </div>
      </div>

      {/* =========================================================================
          MINIMAL COMPACT STATS STRIP
          ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl bg-white dark:bg-[#13092e] border border-slate-200/80 dark:border-purple-800/40 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-purple-300 text-xs font-medium mb-1">
            <span>Children</span>
            <Users className="h-4 w-4 text-purple-500 dark:text-purple-400" />
          </div>
          <div className="font-display font-black text-2xl text-slate-900 dark:text-white">
            {family.children.length}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-purple-400">Enrolled explorers</span>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#13092e] border border-slate-200/80 dark:border-purple-800/40 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-purple-300 text-xs font-medium mb-1">
            <span>Words Written</span>
            <BookOpen className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
          </div>
          <div className="font-display font-black text-2xl text-slate-900 dark:text-white">
            {totalWords.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-purple-400">Total authored</span>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#13092e] border border-slate-200/80 dark:border-purple-800/40 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-purple-300 text-xs font-medium mb-1">
            <span>Orbs Balance</span>
            <Award className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="font-display font-black text-2xl text-emerald-600 dark:text-emerald-400">
            {totalOrbs.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-purple-400">Earned in quests</span>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#13092e] border border-slate-200/80 dark:border-purple-800/40 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-purple-300 text-xs font-medium mb-1">
            <span>Subscription</span>
            <Heart className="h-4 w-4 text-pink-500 dark:text-pink-400" />
          </div>
          <div className="font-display font-black text-2xl text-slate-900 dark:text-white capitalize">
            {family.subscription_status.toLowerCase()}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            {family.subscription_tier} Tier
          </span>
        </div>
      </div>

      {/* =========================================================================
          COMMUNITY QUICK PROMPT BANNER
          ========================================================================= */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-purple-900/30 border border-purple-200 dark:border-purple-800/50 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-purple-600 dark:text-purple-300 shrink-0">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-display font-black text-sm text-slate-900 dark:text-white">
              Connect with the Family Community
            </h4>
            <p className="text-xs text-slate-500 dark:text-purple-300/80">
              Discover bedtime writing prompts, reading habits, and young author spotlights.
            </p>
          </div>
        </div>

        <Link href="/users/community">
          <Button
            size="sm"
            variant="outline"
            className="text-xs font-bold shrink-0 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-200"
          >
            Visit Community &rarr;
          </Button>
        </Link>
      </div>

      {/* =========================================================================
          YOUNG AUTHORS SECTION (Minimal Cards)
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-black text-slate-900 dark:text-white text-xl">
            My Young Authors
          </h3>
          <span className="text-xs text-slate-400 dark:text-purple-400 font-medium">
            {family.children.length} {family.children.length === 1 ? 'Child' : 'Children'}
          </span>
        </div>

        {family.children.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-purple-200 dark:border-purple-800/60 p-8 text-center bg-purple-50/20 dark:bg-purple-950/20">
            <Heart className="h-10 w-10 mx-auto text-pink-400 mb-2" />
            <h4 className="font-display font-black text-lg text-slate-800 dark:text-white">
              No Children Linked Yet
            </h4>
            <p className="text-xs text-slate-500 dark:text-purple-300/70 mt-1 max-w-sm mx-auto">
              Add your young author&apos;s explorer profile to view their stories and reading levels.
            </p>
            <Link href="/users/families/settings#add-child" className="inline-block mt-4">
              <Button
                variant="emerald"
                size="sm"
                className="font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Child Profile
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {family.children.map((child) => (
              <div
                key={child.id}
                className="rounded-2xl bg-white dark:bg-[#13092e] border border-slate-200/80 dark:border-purple-800/50 p-5 shadow-sm hover:border-emerald-500/50 transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
                      {child.grade_level} • Age {child.age}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                      {child.reading_level || 'Adventurer'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                      <Image
                        src="/images/logo.png"
                        alt={child.nickname}
                        fill
                        sizes="48px"
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-slate-900 dark:text-white text-base">
                        {child.nickname}
                      </h4>
                      <p className="text-[11px] text-slate-400 dark:text-purple-400">
                        Explorer ID: {child.id.slice(0, 8)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-slate-50 dark:bg-purple-950/40 p-2.5 border border-slate-100 dark:border-purple-900/30">
                      <span className="text-[11px] text-slate-400 dark:text-purple-400 block">Words</span>
                      <strong className="text-slate-900 dark:text-white font-black text-sm">
                        {child.words_written || 0}
                      </strong>
                    </div>
                    <div className="rounded-xl bg-slate-50 dark:bg-purple-950/40 p-2.5 border border-slate-100 dark:border-purple-900/30">
                      <span className="text-[11px] text-slate-400 dark:text-purple-400 block">Orbs</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-black text-sm">
                        {child.orbs || 0}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-purple-900/30 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 dark:text-purple-400 font-medium">
                    Stories journal
                  </span>
                  <Link
                    href={`/users/kids/${child.id}`}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                  >
                    View Stories <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
