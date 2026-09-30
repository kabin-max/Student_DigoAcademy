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

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
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
              <span className="flex items-center gap-1">
                <Users className="size-3.5" />
                {course._count.enrollments} enrolled
              </span>
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
