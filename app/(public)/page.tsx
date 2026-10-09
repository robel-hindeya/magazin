import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InteractiveHeroCharacters } from '@/components/landing/interactive-hero-characters';
import { MagazineCoverSlider } from '@/components/landing/magazine-cover-slider';
import { AnimatedSquadSection } from '@/components/landing/animated-squad-section';
import { LandingFooter } from '@/components/landing/footer';

export default function HomePage() {
  return (
    <div className="relative w-full flex flex-col items-center overflow-hidden night-sky-bg text-slate-900 dark:text-white transition-colors">
      {/* Continuous Twinkling Starry Canvas across the entire landing page */}
      <div className="absolute inset-0 stars-pattern opacity-20 dark:opacity-60 pointer-events-none" />

      {/* Ambient Aurora Nebulas distributed continuously down the whole page */}
      <div className="absolute top-[6%] left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-purple-600/10 dark:bg-purple-600/25 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-[14%] right-1/4 w-[500px] h-[300px] bg-emerald-500/10 dark:bg-emerald-500/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-[32%] left-1/4 w-[650px] h-[400px] bg-cyan-500/10 dark:bg-cyan-500/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[50%] right-1/5 w-[650px] h-[400px] bg-purple-600/10 dark:bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[68%] left-1/3 w-[700px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-purple-600/10 dark:bg-purple-600/25 blur-[160px] rounded-full pointer-events-none" />

      {/* =========================================================================
          HERO SECTION: Enchanted Night Zoo Sky with Big Animal Characters
          ========================================================================= */}
      <section className="relative w-full min-h-[calc(100vh_-_3.5rem)] lg:min-h-[calc(100vh_-_5rem)] flex flex-col justify-center items-center bg-transparent text-slate-900 dark:text-white py-20 sm:py-28 lg:py-32 overflow-hidden">
        {/* Interactive Famous Animation Movie Characters with Cursor Hover Interactivity */}
        <InteractiveHeroCharacters />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-tight text-slate-900 dark:text-white drop-shadow-sm">
            Selam Kids World! <br />
            <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
              Magazin and Games
            </span>
          </h1>

          {/* Chunky CTA Button */}
          <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button
                variant="emerald"
                size="xl"
                className="h-16 px-10 text-lg font-black tracking-wide shadow-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950"
              >
                Start 7 Day Trial
                <ArrowRight className="ml-2 h-5 w-5 text-slate-950" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: MOVABLE & SLIDING MAGAZINE COVERS SHOWCASE
          Interactive 3D Carousel & Freely Movable Desk of Kid-Authored Magazines
          ========================================================================= */}
      <div id="magazines" className="w-full scroll-mt-20">
        <MagazineCoverSlider subtitle="Explore our diverse Ethiopian themed magazines" />
      </div>

      {/* =========================================================================
          INTERACTIVE REALM SHOWCASE: Gamified Character Story Engine
          ========================================================================= */}
      <section id="story" className="w-full bg-transparent py-24 text-slate-900 dark:text-white relative overflow-hidden transition-colors">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display font-black text-4xl sm:text-5xl leading-tight text-slate-900 dark:text-white">
                Fairy Tale Companions Through the Power of Words
              </h2>

              <div className="mt-8">
                <Link href="/auth/register?role=KID">
                  <Button variant="emerald" size="lg" className="font-black text-base bg-emerald-500 hover:bg-emerald-400 text-slate-950">
                    Join Today as a Young Author &rarr;
                  </Button>
                </Link>
              </div>
            </div>

            {/* Interactive Creature Mockup Box with Ethiopian Wildlife Companion */}
            <div className="rounded-4xl border-4 border-slate-200 dark:border-purple-500/50 bg-white/90 dark:bg-[#1b0d47]/90 backdrop-blur-md p-8 shadow-xl relative group hover:border-emerald-400 transition-all duration-300">
              <div className="flex items-center justify-between border-b-2 border-slate-100 dark:border-purple-800/60 pb-5">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform overflow-hidden p-1 shrink-0">
                    <Image
                      src="/images/characters/walia-ibex.jpg"
                      alt="Walia the Alpine King"
                      fill
                      sizes="80px"
                      className="object-cover rounded-2xl"
                    />
                  </div>
                  <div>
                    <h4 className="font-display text-2xl font-black text-slate-900 dark:text-white">
                      Walia the Alpine King (ዋሊያ)
                    </h4>
                    <p className="text-xs text-purple-600 dark:text-purple-300 font-bold">Simien Mountains • Master Storyteller • Level 5</p>
                  </div>
                </div>
                <Badge variant="emerald">350 Orbs</Badge>
              </div>

              {/* Story excerpt */}
              <div className="mt-6 rounded-2xl bg-purple-50/70 dark:bg-[#0e0626]/80 p-5 border-2 border-purple-100 dark:border-purple-900/60 text-sm text-slate-800 dark:text-purple-100 font-sans leading-relaxed">
                &ldquo;Walia stood at the highest peak of the Simien cliffs, holding the ancient Silver Scroll.
                With a mighty leap and a surge of vivid vocabulary, he banished the shadow Grims back into the mist...&rdquo;
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold text-slate-600 dark:text-purple-300">
                  Daily Writing Quest: <strong className="text-slate-900 dark:text-white">185 words written</strong>
                </span>
                <Button variant="emerald" size="sm" className="font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950">
                  +50 Orbs Claimed!
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ETHIOPIAN ENDEMIC WILDLIFE MENTORS SHOWCASE
          ========================================================================= */}
      <AnimatedSquadSection />

      {/* =========================================================================
          LANDING PAGE FOOTER with Big selamkids Brand Statement
          ========================================================================= */}
      <LandingFooter />
    </div>
  );
}
