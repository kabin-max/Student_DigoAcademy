import {
  Award,
  Briefcase,
  Terminal,
  Users,
} from 'lucide-react';

import { CourseCard } from '@/features/marketplace/components/CourseCard';
import {
  getFeaturedInstructors,
  getPublishedCourses,
} from '@/features/marketplace/server/data';
import type { CourseFilters } from '@/features/marketplace/schemas';
import { HeroHeadline, HeroStage } from '@/shared/components/public/HeroMotion';
import { Reveal } from '@/shared/components/public/Reveal';
import { StaggerGroup, StaggerItem } from '@/shared/components/public/Stagger';
import { CourseFinder } from '@/shared/components/public/CourseFinder';

import { cn } from '@/shared/utils/cn';

const DEFAULT_FILTERS: CourseFilters = {
  q: '',
  categoryId: null,
  difficulty: null,
  language: null,
  price: 'all',
  sort: 'rating',
};

const FEATURES = [
  {
    icon: Briefcase,
    title: 'Real-World Projects',
    body: 'Build cloud environments and applications based on practical scenarios.',
    className: 'bg-brand-blue/10 text-brand-blue',
  },
  {
    icon: Terminal,
    title: 'Hands-On Cloud Labs',
    body: 'Work directly with AWS services instead of learning only through theory.',
    className: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  },
  {
    icon: Users,
    title: 'Industry Mentors',
    body: 'Learn from practitioners working with cloud, DevOps, and modern infrastructure.',
    className: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  },
  {
    icon: Award,
    title: 'Certification + Skills',
    body: 'Prepare for certification while developing skills you can actually use.',
    className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
];

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export const metadata = {
  title: 'Courses | Digo Academy',
  description: 'Explore our top courses, live cohorts, and self-paced tracks.',
};

export default async function CoursesPage() {
  const [courses, instructors] = await Promise.all([
    getPublishedCourses(DEFAULT_FILTERS),
    getFeaturedInstructors(8),
  ]);
  const featured = courses.slice(0, 8);

  return (
    <div className="flex flex-col">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-linear-to-b from-brand-blue/5 via-background to-background pt-12 pb-12">
        <div className="animate-blob pointer-events-none absolute -left-32 -top-32 z-0 size-80 rounded-full bg-brand-blue/20 blur-3xl" />
        <HeroStage className="relative z-10 mx-auto w-full max-w-6xl px-4 text-center sm:px-6">
          <HeroHeadline
            className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl"
            segments={[
              { text: 'Learn' },
              { text: 'AWS', accent: true },
              { text: 'through' },
              { text: 'structured,' },
              { text: 'hands-on' },
              { text: 'courses' },
            ]}
          />
          <Reveal delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Designed around certification goals and real-world cloud skills.
            </p>
          </Reveal>
        </HeroStage>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Top courses                                                        */}
      {/* ------------------------------------------------------------------ */}
      {featured.length > 0 && (
        <section id="courses" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Explore Our Courses
              </h2>
              <p className="mt-2 text-muted-foreground">
                Build practical skills through certification-focused and career-oriented learning paths.
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-full border border-border/70 bg-card p-1 shadow-sm">
              <span className="rounded-full bg-brand-blue px-3.5 py-1.5 text-sm font-medium text-white">
                Featured
              </span>
              <span className="rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground">
                Live cohort
              </span>
              <span className="rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground">
                Self-paced
              </span>
            </div>
          </Reveal>
          <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((course) => (
              <StaggerItem key={course.id}>
                <CourseCard course={course} hrefBase="/courses" showWishlist={false} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Course Finder                                                      */}
      {/* ------------------------------------------------------------------ */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <CourseFinder />
        </Reveal>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Why choose us                                                      */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal className="mb-10 max-w-2xl mx-auto text-center">
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Learn From People Who Build With Cloud
            </h2>
            <p className="mt-2 text-muted-foreground">
              What makes Digo Academy different: practical real-world scenarios, hands-on AWS labs, direct industry mentorship, and career-ready certification skills.
            </p>
          </Reveal>
          <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <StaggerItem key={feature.title}>
                <div className="group h-full rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <span
                    className={cn(
                      'flex size-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 [&_svg]:size-6',
                      feature.className
                    )}
                  >
                    <feature.icon />
                  </span>
                  <h3 className="mt-4 font-heading text-base font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

    </div>
  );
}
