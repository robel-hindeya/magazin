import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, BookOpen, Heart, GraduationCap, PenTool, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Top Header */}
      <section className="relative w-full night-sky-bg text-slate-900 dark:text-white py-20 px-4 text-center border-b-4 border-slate-200/80 dark:border-purple-900/50 overflow-hidden transition-colors">
        <div className="absolute inset-0 stars-pattern opacity-20 dark:opacity-60 pointer-events-none" />

        <div className="relative mx-auto max-w-4xl space-y-4">
          <Badge variant="purple" className="mb-2 text-xs font-black">
            Behind The Realm
          </Badge>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-slate-900 dark:text-white tracking-tight drop-shadow-sm">
            Empowering the Next Generation of Storytellers
          </h1>
          <p className="text-base sm:text-xl text-slate-600 dark:text-purple-200 max-w-2xl mx-auto font-medium leading-relaxed">
            We bring the wonder of creative writing, reading comprehension, and artistic imagination to
            children everywhere, backed by educational pedagogical research and gamified motivation.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link href="/auth/register">
              <Button variant="emerald" size="lg" className="font-black text-base bg-emerald-500 hover:bg-emerald-400 text-slate-950">
                Join the Adventure
                <ArrowRight className="ml-2 h-5 w-5 text-slate-950" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Pillars */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8 border-4 border-purple-200/80 rounded-4xl hover:-translate-y-2 transition-transform shadow-xl bg-gradient-to-b from-purple-50/50 to-white">
            <CardContent className="p-0 space-y-4">
              <div className="h-16 w-16 rounded-3xl bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
                <PenTool className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display font-black text-2xl text-slate-900">
                Creative Learning Philosophy
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Inspired by the world-famous Night Zookeeper universe, our learning engine prioritizes
                story creation, visual creature design, and emotional investment before strict grammar
                drills. When children love their characters, they are eager to write!
              </p>
            </CardContent>
          </Card>

          <Card className="p-8 border-4 border-emerald-200/80 rounded-4xl hover:-translate-y-2 transition-transform shadow-xl bg-gradient-to-b from-emerald-50/50 to-white">
            <CardContent className="p-0 space-y-4">
              <div className="h-16 w-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display font-black text-2xl text-slate-900">
                Safety & Moderation First
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Every story, comment, and creature created by young learners passes through automated
                safety filters and human educator moderation to guarantee a safe, positive haven with zero
                advertising or unvetted external links.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 3 User Types Highlights */}
        <div className="rounded-4xl bg-white dark:bg-[#120832] p-8 sm:p-12 text-slate-900 dark:text-white border-4 border-slate-200/90 dark:border-purple-800/80 shadow-xl relative overflow-hidden transition-colors">
          <div className="absolute inset-0 stars-pattern opacity-10 dark:opacity-40 pointer-events-none" />
          <div className="relative text-center max-w-2xl mx-auto mb-10">
            <Badge variant="purple" className="mb-3 font-black">
              One Shared Universe
            </Badge>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white">
              Built for Families, Schools & Young Authors
            </h2>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl bg-purple-50/70 dark:bg-purple-950/70 p-6 border-2 border-purple-200/80 dark:border-purple-800/60 backdrop-blur-sm space-y-2">
              <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-300 mb-2" />
              <h4 className="font-display font-black text-xl text-purple-700 dark:text-purple-300">For Kids</h4>
              <p className="text-xs text-slate-600 dark:text-purple-200 font-medium leading-relaxed">
                An enchanting game world where writing sentences powers up custom beasts and unlocks magical zoo islands.
              </p>
            </div>

            <div className="rounded-3xl bg-pink-50/70 dark:bg-purple-950/70 p-6 border-2 border-pink-200/80 dark:border-purple-800/60 backdrop-blur-sm space-y-2">
              <Heart className="h-8 w-8 text-pink-500 dark:text-pink-300 mb-2" />
              <h4 className="font-display font-black text-xl text-pink-600 dark:text-pink-300">For Parents</h4>
              <p className="text-xs text-slate-600 dark:text-purple-200 font-medium leading-relaxed">
                Guaranteed wholesome screen time with weekly progress digests and real tutor feedback celebration.
              </p>
            </div>

            <div className="rounded-3xl bg-emerald-50/70 dark:bg-purple-950/70 p-6 border-2 border-emerald-200/80 dark:border-purple-800/60 backdrop-blur-sm space-y-2">
              <GraduationCap className="h-8 w-8 text-emerald-600 dark:text-emerald-300 mb-2" />
              <h4 className="font-display font-black text-xl text-emerald-700 dark:text-emerald-300">For Educators</h4>
              <p className="text-xs text-slate-600 dark:text-purple-200 font-medium leading-relaxed">
                Curriculum-aligned writing prompts, cohort grammar tracking, and interactive gamified student engagement.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
