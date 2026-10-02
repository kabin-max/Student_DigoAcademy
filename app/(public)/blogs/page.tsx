import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { HeroHeadline, HeroItem, HeroPreview, HeroStage, Magnetic } from '@/shared/components/public/HeroMotion';
import { Reveal } from '@/shared/components/public/Reveal';
import { Button } from '@/shared/components/ui/button';

export const metadata = {
  title: 'Blogs | Digo Academy',
  description: 'Insights and news from Digo Academy',
};

export default function BlogsPage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-linear-to-b from-brand-blue/5 via-background to-background pt-12 pb-12">
        <div className="animate-blob pointer-events-none absolute -left-32 -top-32 z-0 size-80 rounded-full bg-brand-blue/20 blur-3xl" />

        <HeroStage className="relative z-10 mx-auto w-full max-w-6xl px-4 text-center sm:px-6">
          <HeroHeadline
            className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl"
            segments={[
              { text: 'Learn.' },
              { text: 'Explore.', accent: true },
              { text: 'Stay' },
              { text: 'Ahead.' },
            ]}
          />

          <Reveal delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Practical insights, AWS guides, cloud tutorials, certification tips, and technology stories from the Digo Academy community.
            </p>
          </Reveal>
        </HeroStage>
      </section>

      {/* Blogs Grid */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">


        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 text-center">
          <div className="rounded-full bg-muted p-4">
            <svg
              className="size-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5L18.5 7M4 16h16M4 12h16M4 8h16"
              />
            </svg>
          </div>
          <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
            No blogs available yet
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Check back later for new articles and insights.
          </p>
        </div>
      </section>
    </div>
  );
}
