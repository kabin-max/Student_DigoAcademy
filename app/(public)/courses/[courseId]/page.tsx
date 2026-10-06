import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  PlayCircle,
  FileText,
  HelpCircle,
  ClipboardList,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CourseThumbnail } from '@/features/marketplace/components/CourseThumbnail';
import { getMarketplaceCourse } from '@/features/marketplace/server/data';
import { DIFFICULTY_LABELS, type MarketplaceDifficulty } from '@/features/marketplace/schemas';
import { RichTextContent } from '@/shared/components/dashboard/RichTextContent';
import { formatMoney } from '@/shared/utils/money';
import { PublicEnrollmentSidebar } from './PublicEnrollmentSidebar';
import { cn } from '@/shared/utils/cn';

const LESSON_ICONS = {
  VIDEO: PlayCircle,
  NOTE: FileText,
  QUIZ: HelpCircle,
  ASSIGNMENT: ClipboardList,
} as const;

function formatDuration(totalSec: number): string {
  if (totalSec <= 0) return '';
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.round((totalSec % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>;
}): Promise<Metadata> {
  const { courseId } = await params;
  const course = await getMarketplaceCourse(courseId);

  if (!course) {
    return buildMetadata({ title: 'Course Not Found', noindex: true });
  }

  const plainTextDescription = course.description
    ? course.description.replace(/<[^>]+>/g, '').substring(0, 155)
    : `Learn ${course.title} at Digo Academy.`;

  return buildMetadata({
    title: course.title,
    description: plainTextDescription,
    path: `/courses/${course.id}`,
    image: course.thumbnailUrl || undefined,
  });
}

import { JsonLd } from '@/components/seo/JsonLd';
import { SEO_CONFIG } from '@/lib/seo/config';

export default async function PublicCourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  
  const course = await getMarketplaceCourse(courseId);
  if (!course) notFound();

  const lessonCount = course.sections.reduce((sum, s) => sum + s.lessons.length, 0);

  const initials = course.instructor.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description?.replace(/<[^>]+>/g, '').substring(0, 500) || `Online course on ${course.title}`,
    provider: {
      '@type': 'Organization',
      name: SEO_CONFIG.siteName,
      sameAs: SEO_CONFIG.siteUrl,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      instructor: {
        '@type': 'Person',
        name: course.instructor.name,
      },
    },
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <JsonLd data={jsonLdData} />
      <nav className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
        <Link href="/courses" className="hover:text-primary transition-colors">Courses</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{course.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header Info */}
          <div className="space-y-4">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl uppercase leading-[1.1]">
              {course.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-[9px] font-bold text-brand-blue">
                  {initials}
                </span>
                <span>Created by <span className="font-bold text-foreground">{course.instructor.name}</span></span>
              </div>

              <span className="rounded-full bg-muted px-2 py-0.5">
                {DIFFICULTY_LABELS[course.difficulty as MarketplaceDifficulty]}
              </span>
              <span className="uppercase">{course.language}</span>
            </div>
          </div>

          {/* Video Thumbnail area */}
          <div className="relative overflow-hidden rounded-xl bg-violet-600/10 shadow-sm ring-1 ring-border/60 group">
            <div className="aspect-video w-full">
               {/* Replace this with CourseThumbnail if available, but wrap in the violet-overlay look */}
               <CourseThumbnail title={course.title} url={course.thumbnailUrl} />
            </div>
            
            <div className="absolute inset-0 bg-violet-900/40 transition-opacity group-hover:bg-violet-900/50" />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
               <button className="flex size-16 items-center justify-center rounded-full bg-white/90 text-brand-blue shadow-xl transition-transform hover:scale-110">
                 <PlayCircle className="size-8" />
               </button>
            </div>
            
            <div className="absolute bottom-4 left-4">
              <span className="rounded-full bg-black/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                Preview this course
              </span>
            </div>
          </div>

          {/* Upcoming Batches */}
          {course.batches && course.batches.length > 0 && (
            <div className="rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-6 space-y-4">
              <div className="flex items-center gap-2 text-brand-blue font-bold text-lg">
                <Users className="size-5" />
                <h2>Upcoming Live Batches</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {course.batches.map((batch) => {
                  const seatsLeft = batch.capacity !== null ? Math.max(0, batch.capacity - batch._count.enrollments) : null;
                  return (
                    <div
                      key={batch.id}
                      className="rounded-xl border border-border/80 bg-background p-4 flex flex-col justify-between space-y-2 shadow-xs"
                    >
                      <div>
                        <span className="font-bold text-foreground text-sm block">{batch.name}</span>
                        {batch.startDate && (
                          <span className="text-xs text-muted-foreground block mt-0.5">
                            Starts: {new Date(batch.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          {seatsLeft !== null ? (seatsLeft > 0 ? `${seatsLeft} seats remaining` : 'Full') : 'Unlimited seats'}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-full">
                          Live Cohort
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* About this course */}
          {course.description?.trim() ? (
            <div className="space-y-4 pt-4">
              <h2 className="font-heading text-xl font-bold">About this course</h2>
              <div className="text-sm text-muted-foreground leading-relaxed">
                <RichTextContent html={course.description} />
              </div>
            </div>
          ) : null}

          {/* Course Syllabus */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h2 className="font-heading text-xl font-bold">Course syllabus</h2>
              <span className="text-xs font-semibold text-muted-foreground">
                {course.sections.length} sections · {lessonCount} lessons
              </span>
            </div>
            
            {course.sections.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">Curriculum coming soon.</p>
            ) : (
              <div className="space-y-3 pt-2">
                {course.sections.map((section, idx) => (
                  <details
                    key={section.id}
                    className="group rounded-xl border border-border/80 bg-card overflow-hidden [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                          <BookOpen className="size-4" />
                        </div>
                        <span className="text-sm font-bold text-foreground">
                          Module {idx + 1}: {section.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
                        <span>{section.lessons.length} lessons</span>
                        <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                      </div>
                    </summary>
                    <div className="border-t border-border/60 bg-muted/10 p-4">
                      <ul className="space-y-3">
                        {section.lessons.map((lesson) => {
                          const Icon = LESSON_ICONS[lesson.type as keyof typeof LESSON_ICONS] ?? BookOpen;
                          const duration = formatDuration(lesson.videoDurationSec ?? 0);
                          return (
                            <li
                              key={lesson.id}
                              className="flex items-center justify-between text-sm text-muted-foreground"
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="size-4 text-primary/70 shrink-0" />
                                <span className="font-medium text-foreground">{lesson.title}</span>
                              </div>
                              {duration ? <span className="text-xs font-medium">{duration}</span> : null}
                            </li>
                          );
                        })}
                        {section.lessons.length === 0 ? (
                          <li className="text-sm text-muted-foreground">No lessons yet.</li>
                        ) : null}
                      </ul>
                    </div>
                  </details>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <PublicEnrollmentSidebar 
              courseId={course.id} 
              price={course.priceCents === 0 ? 'Free' : formatMoney(course.priceCents, course.currency)}
              instructorName={course.instructor.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
