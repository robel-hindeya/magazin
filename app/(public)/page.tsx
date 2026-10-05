import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InteractiveHeroCharacters } from '@/components/landing/interactive-hero-characters';
import { WonderZoneSection } from '@/components/landing/wonder-zone-section';
import { AnimatedSquadSection } from '@/components/landing/animated-squad-section';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center overflow-hidden">
      {/* =========================================================================
          HERO SECTION: Enchanted Night Zoo Sky with Big Animal Characters
          ========================================================================= */}
      <section className="relative w-full min-h-[calc(100vh_-_3.5rem)] lg:min-h-[calc(100vh_-_5rem)] flex flex-col justify-center items-center night-sky-bg text-slate-900 dark:text-white py-20 sm:py-28 lg:py-32 overflow-hidden border-b-4 border-slate-200/80 dark:border-purple-900/50 transition-colors">
        {/* Twinkling starry canvas overlay */}
        <div className="absolute inset-0 stars-pattern opacity-20 dark:opacity-60 pointer-events-none" />

        {/* Interactive Famous Animation Movie Characters with Cursor Hover Interactivity */}
        <InteractiveHeroCharacters />

        {/* Ambient Aurora glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-purple-600/10 dark:bg-purple-600/25 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[450px] h-[250px] bg-emerald-500/10 dark:bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-tight text-slate-900 dark:text-white drop-shadow-sm">
            Selam Kids World! <br />
            <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
              Magazin and Games
            </span>
          </h1>

          {/* Chunky CTA Buttons */}
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
            <Link href="/games">
              <Button
                variant="magic"
                size="xl"
                className="h-16 px-8 text-lg font-black tracking-wide shadow-2xl hover:scale-105 transition-transform"
              >
                <Gamepad2 className="mr-2.5 h-6 w-6 text-emerald-400 animate-wiggle" />
                Play Games Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE LIVING CREATURE WONDER ZONE: Undefined Morphing Shapes,
          Character Movements & Interactive Kid-Delight Elements
          ========================================================================= */}
      <WonderZoneSection />

      {/* =========================================================================
          ANIMATED MOVIE CHARACTERS SQUAD SHOWCASE (Meet Your Animated Writing Mentors)
          ========================================================================= */}
      <AnimatedSquadSection />

      {/* =========================================================================
          INTERACTIVE REALM SHOWCASE
          ========================================================================= */}
      <section className="w-full bg-slate-50 dark:bg-[#110931] py-24 text-slate-900 dark:text-white relative overflow-hidden border-y-4 border-slate-200/80 dark:border-purple-900/60 transition-colors">
        <div className="absolute inset-0 stars-pattern opacity-10 dark:opacity-50 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="purple" className="mb-4 text-xs font-black">
                Gamified Character Story Engine
              </Badge>
              <h2 className="font-display font-black text-4xl sm:text-5xl leading-tight text-slate-900 dark:text-white">
                Train Animated Companions Through the Power of Words
              </h2>
              <p className="mt-4 text-slate-600 dark:text-purple-200 text-base sm:text-lg leading-relaxed font-medium">
                In the Night Zoo, monsters called the <strong className="text-purple-600 dark:text-purple-400">Grims</strong>{' '}
                try to steal color and imagination. Every story a child writes acts as a shield of
                light that defends their favorite movie companions!
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border-2 border-slate-200 dark:border-purple-800/80 bg-white dark:bg-purple-950/70 p-5 shadow-sm backdrop-blur-sm">
                  <div className="font-display text-4xl font-black text-purple-600 dark:text-purple-300">10,000,000+</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-purple-300 font-bold">Words Authored by Children</div>
                </div>
                <div className="rounded-2xl border-2 border-slate-200 dark:border-purple-800/80 bg-white dark:bg-purple-950/70 p-5 shadow-sm backdrop-blur-sm">
                  <div className="font-display text-4xl font-black text-emerald-600 dark:text-emerald-400">98%</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-purple-300 font-bold">Parents Report Rapid Writing Boost</div>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/auth/register?role=KID">
                  <Button variant="emerald" size="lg" className="font-black text-base bg-emerald-500 hover:bg-emerald-400 text-slate-950">
                    Join Today as a Young Author &rarr;
                  </Button>
                </Link>
              </div>
            </div>

            {/* Interactive Creature Mockup Box with Real Animation Movie Character */}
            <div className="rounded-4xl border-4 border-slate-200 dark:border-purple-500/50 bg-white dark:bg-[#1b0d47] p-8 shadow-xl relative group hover:border-emerald-400 transition-all duration-300">
              <div className="flex items-center justify-between border-b-2 border-slate-100 dark:border-purple-800/60 pb-5">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform overflow-hidden p-1.5 shrink-0">
                    <Image
                      src="/images/characters/po-panda.png"
                      alt="Po the Dragon Warrior"
                      fill
                      sizes="80px"
                      className="object-contain drop-shadow-md"
                    />
                  </div>
                  <div>
                    <h4 className="font-display text-2xl font-black text-slate-900 dark:text-white">
                      Po the Dragon Warrior
                    </h4>
                    <p className="text-xs text-purple-600 dark:text-purple-300 font-bold">Kung Fu Panda • Master Storyteller • Level 5</p>
                  </div>
                </div>
                <Badge variant="emerald">350 Orbs</Badge>
              </div>

              {/* Story excerpt */}
              <div className="mt-6 rounded-2xl bg-purple-50/70 dark:bg-[#0e0626] p-5 border-2 border-purple-100 dark:border-purple-900/60 text-sm text-slate-800 dark:text-purple-100 font-sans leading-relaxed">
                &ldquo;Po stood at the edge of the Whispering Canopy, holding the ancient Silver Scroll.
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
          BOTTOM STARLIT CALL-TO-ACTION BANNER with Real Animation Movie Companions
          ========================================================================= */}
      <section className="w-full night-sky-bg text-slate-900 dark:text-white py-20 px-4 text-center border-t-4 border-slate-200/80 dark:border-purple-900/50 relative overflow-hidden transition-colors">
        <div className="absolute inset-0 stars-pattern opacity-20 dark:opacity-50 pointer-events-none" />

        <div className="relative mx-auto max-w-4xl">
          {/* Celebrating Animation Movie Companions */}
          <div className="mx-auto flex items-center justify-center gap-4 mb-6">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 animate-float">
              <Image
                src="/images/characters/toothless.png"
                alt="Toothless"
                fill
                sizes="110px"
                className="object-contain drop-shadow-[0_12px_24px_rgba(147,51,234,0.4)]"
              />
            </div>
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 animate-wiggle">
              <Image
                src="/images/characters/stitch.png"
                alt="Stitch"
                fill
                sizes="96px"
                className="object-contain drop-shadow-[0_12px_24px_rgba(59,130,246,0.4)]"
              />
            </div>
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 animate-float delay-700">
              <Image
                src="/images/characters/minion.png"
                alt="Minion"
                fill
                sizes="96px"
                className="object-contain drop-shadow-[0_12px_24px_rgba(16,185,129,0.4)]"
              />
            </div>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-slate-900 dark:text-white">
            Ready to Begin the Magical Adventure?
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-purple-200 max-w-2xl mx-auto font-medium">
            Join creative young authors, families, and schools making reading and writing an
            exhilarating creative journey.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/auth/register">
              <Button
                variant="emerald"
                size="xl"
                className="h-16 px-10 text-lg font-black tracking-wide shadow-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950"
              >
                Start Your 7 Day Free Trial
                <ArrowRight className="ml-2 h-5 w-5 text-slate-950" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
