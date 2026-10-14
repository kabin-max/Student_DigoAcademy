import { ArrowRight, BookOpen, Calendar, Clock, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { getAcademyBlogs, type BlogPost } from '@/lib/blogs';
import { HeroHeadline, HeroStage } from '@/shared/components/public/HeroMotion';
import { Reveal } from '@/shared/components/public/Reveal';
import { StaggerGroup, StaggerItem } from '@/shared/components/public/Stagger';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';

export const metadata = {
  title: 'Blogs & Insights | Digo Academy',
  description:
    'Practical insights, AWS guides, cloud tutorials, certification tips, and technology stories from Digo Academy.',
};

// Revalidate every hour (ISR) or on-demand
export const revalidate = 3600;

function BlogCard({ blog }: { blog: BlogPost }) {
  const publishedDate = blog.created_at
    ? new Date(blog.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const excerpt =
    blog.meta_description ||
    blog.description ||
    (blog.content ? blog.content.replace(/<[^>]*>/g, '').slice(0, 140) + '...' : '');

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/40 hover:shadow-xl hover:shadow-brand-blue/5">
      {/* Featured Cover Image */}
      <Link
        href={`/blogs/${blog.slug || blog.id}`}
        className="relative aspect-video w-full overflow-hidden bg-muted"
      >
        {blog.featured_image_url ? (
          <img
            src={blog.featured_image_url}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-brand-blue/10 via-muted to-background text-muted-foreground">
            <BookOpen className="size-10 opacity-30" />
          </div>
        )}

        {blog.category && (
          <span className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-md border border-border/50 shadow-xs">
            {blog.category}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          {publishedDate && (
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              {publishedDate}
            </span>
          )}
          {blog.read_time_min && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                {blog.read_time_min} min read
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="font-heading text-xl font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-brand-blue line-clamp-2 mb-2">
          <Link href={`/blogs/${blog.slug || blog.id}`}>
            {blog.title}
          </Link>
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4 flex-1">
            {excerpt}
          </p>
        )}

        {/* Footer: Author & Read CTA */}
        <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-4">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold">
              {blog.author_name ? blog.author_name.charAt(0).toUpperCase() : 'D'}
            </div>
            <span className="text-xs font-medium text-foreground">
              {blog.author_name || 'Digo Team'}
            </span>
          </div>

          <Link
            href={`/blogs/${blog.slug || blog.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue transition-all group-hover:translate-x-0.5"
          >
            <span>Read Story</span>
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function BlogsPage() {
  const blogs = await getAcademyBlogs();
  const hasBlogs = blogs.length > 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-linear-to-b from-brand-blue/5 via-background to-background pt-14 pb-12">
        <div className="animate-blob pointer-events-none absolute -left-32 -top-32 z-0 size-80 rounded-full bg-brand-blue/20 blur-3xl" />
        <div className="animate-blob pointer-events-none absolute right-0 top-1/2 z-0 size-72 rounded-full bg-accent/20 blur-3xl [animation-delay:4s]" />

        <HeroStage className="relative z-10 mx-auto w-full max-w-6xl px-4 text-center sm:px-6">
          <HeroHeadline
            className="mx-auto max-w-3xl font-heading text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl"
            segments={[
              { text: 'Learn.' },
              { text: 'Explore.', accent: true },
              { text: 'Stay' },
              { text: 'Ahead.' },
            ]}
          />

          <Reveal delay={150}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Practical guides, AWS architectures, career roadmaps, and cloud tutorials curated by industry practitioners.
            </p>
          </Reveal>
        </HeroStage>
      </section>

      {/* Blogs Content Section */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {hasBlogs ? (
          <StaggerGroup className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <StaggerItem key={blog.id}>
                <BlogCard blog={blog} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          <div className="flex min-h-[42vh] flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/40 p-8 text-center backdrop-blur-xs">
            <div className="rounded-2xl bg-brand-blue/10 p-4 text-brand-blue">
              <BookOpen className="size-8" />
            </div>
            <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
              No blogs published yet
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Articles published from the Digo Solution admin with &ldquo;Publish to Digo Academy&rdquo; enabled will appear here automatically.
            </p>
            <div className="mt-6">
              <Button asChild variant="outline">
                <Link href="/courses">Explore Courses</Link>
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
