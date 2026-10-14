import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getAcademyBlogBySlug } from '@/lib/blogs';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getAcademyBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Blog Not Found | Digo Academy',
    };
  }

  const title = blog.meta_title || `${blog.title} | Digo Academy`;
  const description =
    blog.meta_description ||
    blog.description ||
    `Read ${blog.title} on Digo Academy.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: blog.featured_image_url ? [blog.featured_image_url] : [],
    },
  };
}

export default async function SingleBlogPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getAcademyBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const publishedDate = blog.created_at
    ? new Date(blog.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  // Check if content already starts with an image (e.g. author pasted flyer/graphic at top of editor)
  const contentStartsWithImage = /^\s*(?:<p[^>]*>)?\s*<img[^>]+>/i.test(blog.content?.trim() || '');

  return (
    <article className="min-h-screen py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb / Back button */}
        <div className="mb-8">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            <span>Back to all articles</span>
          </Link>
        </div>

        {/* Post Header */}
        <header className="mb-10 space-y-5">
          {blog.category && (
            <span className="inline-block rounded-full bg-brand-blue/10 px-3.5 py-1 text-xs font-semibold text-brand-blue border border-brand-blue/20">
              {blog.category}
            </span>
          )}

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            {blog.title}
          </h1>

          {/* Author and Publishing Metadata */}
          <div className="flex flex-wrap items-center gap-4 border-y border-border/60 py-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue font-bold text-sm">
                {blog.author_name ? blog.author_name.charAt(0).toUpperCase() : 'D'}
              </div>
              <span className="font-semibold text-foreground">
                {blog.author_name || 'Digo Team'}
              </span>
            </div>

            {publishedDate && (
              <>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-4" />
                  {publishedDate}
                </span>
              </>
            )}

            {blog.read_time_min && (
              <>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" />
                  {blog.read_time_min} min read
                </span>
              </>
            )}
          </div>
        </header>

        {/* Featured Cover Image (only displayed if the article body doesn't already start with an image) */}
        {!contentStartsWithImage && blog.featured_image_url && (
          <div className="mb-12 overflow-hidden rounded-3xl border border-border/70 shadow-lg bg-muted/30 relative flex items-center justify-center">
            <img
              src={blog.featured_image_url}
              alt={blog.title}
              className="w-full max-h-[600px] object-contain rounded-3xl"
            />
          </div>
        )}

        {/* Blog Post Content Body */}
        {blog.content ? (
          <div
            className="prose prose-lg dark:prose-invert max-w-none 
              prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight 
              prose-a:text-brand-blue prose-a:underline hover:prose-a:text-brand-blue/80
              prose-img:rounded-2xl prose-img:shadow-md
              prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        ) : (
          <p className="text-muted-foreground italic">No content available for this post.</p>
        )}
      </div>
    </article>
  );
}
