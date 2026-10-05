import { CourseCard } from '@/features/marketplace/components/CourseCard';
import { getFeaturedInstructors, getPublishedCourses } from '@/features/marketplace/server/data';
import type { CourseFilters } from '@/features/marketplace/schemas';
import { HeroHeadline, HeroStage } from '@/shared/components/public/HeroMotion';
import { Reveal } from '@/shared/components/public/Reveal';
import { StaggerGroup, StaggerItem } from '@/shared/components/public/Stagger';

const DEFAULT_FILTERS: CourseFilters = {
  q: '',
  categoryId: null,
  difficulty: null,
  language: null,
  price: 'all',
  sort: 'rating',
};
export const metadata = {
  title: 'Courses | Digo Academy',
  description: 'Explore our top courses, live cohorts, and self-paced tracks.',
};

export default async function CoursesPage() {
  const [courses, instructors] = await Promise.all([
    getPublishedCourses(DEFAULT_FILTERS),
    getFeaturedInstructors(8),
  ]);
  const difficultyOrder = { BEGINNER: 1, INTERMEDIATE: 2, ADVANCED: 3 };
  const sortedCourses = [...courses].sort((a, b) => {
    return (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 99) - (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 99);
  });
  const featured = sortedCourses.slice(0, 6);

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
          </Reveal>
          <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((course) => (
              <StaggerItem key={course.id}>
                <CourseCard course={course} hrefBase="/courses" showWishlist={false} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      )}



    </div>
  );
}
