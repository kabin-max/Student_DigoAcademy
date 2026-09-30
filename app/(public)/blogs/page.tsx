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


        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <article key={i} className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand-blue/30">
              <div className="aspect-video overflow-hidden bg-muted">
                <img
                  src={`https://images.unsplash.com/photo-${1550000000000 + i}?w=600&h=400&fit=crop`}
                  alt={`Blog Post ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-brand-blue">Technology</span>
                  <span>•</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <h3 className="mt-4 font-heading text-xl font-semibold text-foreground transition-colors group-hover:text-brand-blue">
                  Dummy Blog Title {i + 1}
                </h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">
                  This is a placeholder excerpt for the blog post. It gives a brief overview of what the article is about, encouraging readers to click and read the full story.
                </p>
                <div className="mt-6 flex items-center font-semibold text-brand-blue">
                  Read article <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
