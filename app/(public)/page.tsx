import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Camera,
  ClipboardList,
  Code2,
  Globe2,
  LineChart,
  Megaphone,
  MonitorPlay,
  Music2,
  PenTool,
  Radio,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Terminal,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import certAI from '@/shared/components/public/Cert/AI_practitioner.png';
import certSecurity from '@/shared/components/public/Cert/Aws_security_specialist.webp';
import certCloudPractitioner from '@/shared/components/public/Cert/cloudPractitioner.png';
import certDeveloper from '@/shared/components/public/Cert/developerAssociate.png';
import certDevOps from '@/shared/components/public/Cert/devopsEngineerProfessional.png';
import certSAA from '@/shared/components/public/Cert/solutionArchitectAssociate.png';
import certSAP from '@/shared/components/public/Cert/solutionArchitectProfessional.png';

import { CourseCard } from '@/features/marketplace/components/CourseCard';
import {
  getBrowseCategories,
  getFeaturedInstructors,
  getPublishedCourses,
} from '@/features/marketplace/server/data';
import type { CourseFilters } from '@/features/marketplace/schemas';
import { HeroHeadline, HeroItem, HeroPreview, HeroStage, Magnetic } from '@/shared/components/public/HeroMotion';
import { Reveal } from '@/shared/components/public/Reveal';
import { StaggerGroup, StaggerItem } from '@/shared/components/public/Stagger';
import { CourseFinder } from '@/shared/components/public/CourseFinder';
import { ComparisonSection } from '@/shared/components/public/ComparisonSection';
import { ReviewsAndFaqSection } from '@/shared/components/public/ReviewsAndFaqSection';
import { AwsHeroAnimation } from '@/shared/components/public/AwsHeroAnimation';
import { ConfettiOnView } from '@/shared/components/public/ConfettiOnView';
import { getPromoCourses, getUpcomingBatches } from '@/features/courses/server/data';
import { getSettings } from '@/features/settings/server/data';
import { presignDownload } from '@/lib/storage';
import { isS3Configured } from '@/lib/env';
import { OfferBanner } from '@/shared/components/public/OfferBanner';
import { PopupModal } from '@/shared/components/public/PopupModal';
import { UpcomingBatchesSection } from '@/shared/components/public/UpcomingBatchesSection';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';

const AWS_CERTS = [
  { name: 'AWS Certified Cloud Practitioner', image: certCloudPractitioner },
  { name: 'AWS Certified AI Practitioner', image: certAI },
  { name: 'AWS Certified Solutions Architect - Associate', image: certSAA },
  { name: 'AWS Certified Developer - Associate', image: certDeveloper },
  { name: 'AWS Certified DevOps Engineer - Professional', image: certDevOps },
  { name: 'AWS Certified Solutions Architect - Professional', image: certSAP },
  { name: 'AWS Certified Security - Specialty', image: certSecurity },
];

const DEFAULT_FILTERS: CourseFilters = {
  q: '',
  categoryId: null,
  difficulty: null,
  language: null,
  price: 'all',
  sort: 'rating',
};

const CATEGORY_STYLES = [
  { icon: Code2, className: 'bg-brand-blue/10 text-brand-blue', glow: 'group-hover:bg-brand-blue' },
  { icon: PenTool, className: 'bg-brand-coral/10 text-brand-coral', glow: 'group-hover:bg-brand-coral' },
  {
    icon: LineChart,
    className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    glow: 'group-hover:bg-emerald-500',
  },
  {
    icon: Megaphone,
    className: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    glow: 'group-hover:bg-violet-500',
  },
  {
    icon: Camera,
    className: 'bg-amber-500/10 text-amber-600 dark:text-amber-500',
    glow: 'group-hover:bg-amber-500',
  },
  {
    icon: Globe2,
    className: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    glow: 'group-hover:bg-sky-500',
  },
  {
    icon: Music2,
    className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    glow: 'group-hover:bg-rose-500',
  },
  {
    icon: BookOpen,
    className: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    glow: 'group-hover:bg-indigo-500',
  },
] as const;

const STEPS = [
  {
    icon: Search,
    title: 'Browse courses',
    body: 'Explore live cohorts and self-paced tracks across every category — filter by level, price, and language.',
  },
  {
    icon: ClipboardList,
    title: 'Request enrollment',
    body: 'Found the right fit? Submit an inquiry in seconds. No upfront payment and no commitment required.',
  },
  {
    icon: Rocket,
    title: 'Start learning',
    body: 'Our team confirms your spot and gets you into a live classroom or a self-paced track.',
  },
];

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

function compactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(
    value
  );
}

export default async function HomePage() {
  const [courses, categories, instructors, promoCourses, settings, upcomingBatches] = await Promise.all([
    getPublishedCourses(DEFAULT_FILTERS),
    getBrowseCategories(8),
    getFeaturedInstructors(8),
    getPromoCourses(),
    getSettings(),
    getUpcomingBatches(),
  ]);
  const difficultyOrder = { BEGINNER: 1, INTERMEDIATE: 2, ADVANCED: 3 };
  const sortedCourses = [...courses].sort((a, b) => {
    return (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 99) - (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 99);
  });
  const featured = sortedCourses.slice(0, 6);

  let popupImageUrl: string | null = null;
  const popupImageKey = typeof settings['home.popup.imageKey'] === 'string' ? settings['home.popup.imageKey'] : null;
  if (isS3Configured && popupImageKey) {
    try {
      popupImageUrl = await presignDownload(popupImageKey);
    } catch {
      popupImageUrl = null;
    }
  }

  return (
    <div className="flex flex-col">
      {settings['home.popup.enabled'] && popupImageUrl && (
        <PopupModal 
          imageUrl={popupImageUrl} 
          linkUrl={String(settings['home.popup.linkUrl'] || '/courses')} 
        />
      )}
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-linear-to-b from-brand-blue/5 via-background to-background">
        <div className="animate-blob pointer-events-none absolute -left-32 -top-32 z-0 size-80 rounded-full bg-brand-blue/20 blur-3xl" />
        <div className="animate-blob anim-delay-2 pointer-events-none absolute -right-24 top-10 z-0 size-72 rounded-full bg-violet-500/20 blur-3xl" />
        <HeroStage className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-4 pb-6 lg:pt-8 lg:pb-12 flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-10">
          <div className="text-left lg:max-w-lg -translate-y-5">
            <HeroHeadline
              className="font-heading text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl text-foreground" segments={[
                { text: 'Master' },
                { text: 'AWS' },
                { text: 'Cloud &' },
                { text: 'DevOps' },
              ]}
            />
            <HeroItem>
              <p className="mt-4 text-sm sm:text-base text-black dark:text-white leading-relaxed">
                Success in the modern cloud isn&apos;t just about adopting new tools—it&apos;s about mastering them. We bring unparalleled expertise in AWS Cloud architecture and DevOps automation to accelerate your digital transformation.
              </p>
            </HeroItem>
            <HeroItem className="mt-8 flex flex-col items-start gap-8">
              <div className="flex items-center gap-6 text-left border-l-2 border-brand-blue pl-4">
                <div>
                  <p className="text-2xl font-bold text-foreground">10K+</p>
                  <p className="text-sm font-medium text-black dark:text-white">Students Trained</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">150+</p>
                  <p className="text-sm font-medium text-black dark:text-white">Workshops Conducted</p>
                </div>
              </div>
              <Magnetic>
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-10 h-14 text-lg"
                  nativeButton={false}
                  render={
                    <Link href="/courses">
                      Explore Courses
                    </Link>
                  }
                />
              </Magnetic>
            </HeroItem>
          </div>
          <div className="flex-1 w-full lg:max-w-[55%] flex justify-center items-center lg:justify-end pl-0 lg:pl-10 mt-8 lg:mt-0">
            <div className="relative w-full max-w-2xl flex justify-center items-center py-8">
              <AwsHeroAnimation />
            </div>
          </div>
        </HeroStage>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Offer / Promo Banner (If Any Active Promo Courses Exist)           */}
      {/* ------------------------------------------------------------------ */}
      <OfferBanner courses={promoCourses} />

      {/* ------------------------------------------------------------------ */}
      {/* Upcoming Batches Section                                           */}
      {/* ------------------------------------------------------------------ */}
      <UpcomingBatchesSection batches={upcomingBatches} />

      {/* ------------------------------------------------------------------ 
          Trusted By Section (Commented out)
          ------------------------------------------------------------------ 
      <section className="border-y border-border/50 bg-background py-10 overflow-hidden relative">
        <style>{`
          @keyframes slideLeft {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .animate-slide-left {
            animation: slideLeft 20s linear infinite;
          }
        `}</style>
        <div className="mx-auto flex flex-col md:flex-row max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="shrink-0 md:w-48 mb-6 md:mb-0 md:mr-8 z-10 bg-background relative md:shadow-[20px_0_20px_-10px_var(--background)]">
            <h3 className="text-xl md:text-lg font-bold text-black dark:text-white leading-tight text-center md:text-left">
              Trusted by 100+<br className="hidden md:block" />clients
            </h3>
          </div>
          <div className="flex flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] w-full">
            <div className="flex w-max animate-slide-left items-center gap-10 sm:gap-16 transition-all duration-300">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-10 sm:gap-16 shrink-0">
                  <Image src="/partner/iims.png" alt="IIMS" width={120} height={60} className="object-contain" />
                  <Image src="/partner/purbanchal.png" alt="Purbanchal University" width={120} height={60} className="object-contain" />
                  <Image src="/partner/techspire.png" alt="Techspire" width={120} height={60} className="object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      */}

      {/* ------------------------------------------------------------------ */}
      {/* Learn from Cloud Professionals                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8 relative">
        <ConfettiOnView />
        <Reveal className="mb-12 text-center max-w-3xl mx-auto">
          <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-4xl text-foreground">
            Learn from Certified, Become Certified
          </h2>
          <p className="mt-4 text-lg text-black dark:text-white">
            Our training is supported by professionals with hands-on experience in AWS and modern cloud technologies. Our team includes AWS-certified professionals who bring practical knowledge from real cloud infrastructure and DevOps environments into our training programs.
          </p>
        </Reveal>

        <StaggerGroup className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
          {AWS_CERTS.map((cert) => (
            <StaggerItem key={cert.name}>
              <div className="flex flex-col items-center justify-center gap-3 p-2 transition-transform hover:-translate-y-1">
                <Image
                  src={cert.image}
                  alt={cert.name}
                  width={137}
                  height={137}
                  className="object-contain w-[110px] h-[110px] sm:w-[137px] sm:h-[137px] drop-shadow-sm"
                />
                <span className="font-medium text-xs text-foreground text-center max-w-[150px] hidden sm:block">{cert.name}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Power of dual-learning                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-background">
        <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 size-96 rounded-full bg-brand-blue/5 blur-3xl" />
        <div className="pointer-events-none absolute right-0 bottom-0 size-80 rounded-full bg-violet-500/5 blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-y-8 gap-x-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-y-8 lg:gap-x-16 lg:px-8 lg:py-20">
          {/* Section Title - Centered Container, Left-Aligned Text */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="text-center">
              <Reveal>
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-4xl text-foreground">
                  The power of dual-learning
                </h2>
                <p className="mt-2 text-base text-black dark:text-white leading-relaxed max-w-2xl mx-auto">
                  Digo Academy combines the best of both worlds—structured guidance with the flexibility you need.
                </p>
              </Reveal>
            </div>
          </div>
          {/* Left Column - Features */}
          <div>
            <Reveal>
              <div className="space-y-6">
                <div className="group relative flex gap-6 rounded-3xl bg-gradient-to-br from-brand-blue/8 via-brand-blue/4 to-transparent p-8 ring-1 ring-brand-blue/20 shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-brand-blue/10 hover:ring-brand-blue/30 hover:-translate-y-2">
                  {/* Background glow effect */}
                  <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-r from-brand-blue/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <span className="relative flex size-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-blue/20 to-brand-blue/10 text-brand-blue ring-2 ring-brand-blue/25 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl [&_svg]:size-7">
                    <Radio />
                    {/* Icon glow */}
                    <div className="absolute inset-0 rounded-3xl bg-brand-blue/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60" />
                  </span>

                  <div className="relative flex-1">
                    <h3 className="font-heading text-xl font-bold text-foreground group-hover:text-brand-blue transition-colors duration-300">
                      Live Cohorts
                    </h3>
                    <p className="mt-3 text-sm text-black dark:text-white leading-relaxed group-hover:text-black dark:text-white transition-colors duration-300">
                      Real-time interaction with industry experts, weekly milestones, and peer
                      accountability to keep you on track with personalized mentorship.
                    </p>
                  </div>
                </div>

                <div className="group relative flex gap-6 rounded-3xl bg-gradient-to-br from-violet-500/8 via-violet-500/4 to-transparent p-8 ring-1 ring-violet-500/20 shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10 hover:ring-violet-500/30 hover:-translate-y-2">
                  {/* Background glow effect */}
                  <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <span className="relative flex size-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500/20 to-violet-500/10 text-violet-600 ring-2 ring-violet-500/25 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-xl [&_svg]:size-7">
                    <MonitorPlay />
                    {/* Icon glow */}
                    <div className="absolute inset-0 rounded-3xl bg-violet-500/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60" />
                  </span>

                  <div className="relative flex-1">
                    <h3 className="font-heading text-xl font-bold text-foreground group-hover:text-violet-600 transition-colors duration-300">
                      Self-Paced Mastery
                    </h3>
                    <p className="mt-3 text-sm text-black dark:text-white leading-relaxed group-hover:text-black dark:text-white transition-colors duration-300">
                      Binge-worthy video content, interactive labs, and lifetime access to
                      resources so you can learn at your own pace with complete flexibility.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column - World Map */}
          <Reveal delay={150} className="relative">
            <div className="relative">
              <div className="relative">

                <div className="relative mt-6 aspect-2/1 w-full">
                  <img
                    src="/world-map-dots.svg"
                    alt="Learners across the globe"
                    className="size-full select-none object-contain opacity-90 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"
                    draggable={false}
                  />
                  {/* Learner location markers — spread across continents to convey a global community. */}
                  {[
                    { top: '29%', left: '16%', city: 'New York' },   // North America
                    { top: '40%', left: '28%', city: 'São Paulo' },   // South America
                    { top: '21%', left: '50%', city: 'London' },   // Europe
                    { top: '51%', left: '60%', city: 'Lagos' },   // Africa
                    { top: '30%', left: '68%', city: 'Dubai' },   // Middle East / South Asia
                    { top: '35%', left: '74%', city: 'Mumbai' },   // South Asia
                    { top: '30%', left: '89%', city: 'Tokyo' },   // East Asia
                    { top: '69%', left: '92%', city: 'Sydney' },   // Australia
                  ].map((pos, i) => (
                    <span
                      key={i}
                      style={{ top: pos.top, left: pos.left, animationDelay: `${(i % 4) * 0.4}s` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 animate-pulse group cursor-pointer"
                      title={`Anywhere. Anytime. - ${pos.city}`}
                    >
                      <span className="relative flex size-2.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-blue/60" />
                        <span className="relative inline-flex size-2.5 rounded-full bg-brand-blue ring-2 ring-background" />
                      </span>

                      {/* Hover Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="relative bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                          <div className="text-center">
                            <div className="font-semibold">Anywhere. Anytime.</div>
                            <div className="text-gray-300">{pos.city}</div>
                          </div>
                          {/* Tooltip Arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </span>
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[
                    { icon: Radio, label: 'Live Sessions' },
                    { icon: MonitorPlay, label: 'On-Demand' },
                    { icon: Users, label: 'Community' },
                    { icon: Award, label: 'Certified' }
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 text-sm font-medium text-foreground ring-1 ring-border transition-all hover:ring-brand-blue/30"
                    >
                      <item.icon className="size-5 shrink-0 text-brand-blue" />
                      <span className="truncate">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* How it works                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section id="how-it-works" className="scroll-mt-24 bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal className="mb-12 text-center">
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-4xl text-foreground">
              How to Enroll at Digo Academy
            </h2>
            <p className="mt-2 text-black dark:text-white">
              Watch how to find your course, complete your enrollment, and start learning in just a few simple steps.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg flex items-center justify-center relative aspect-video">
              <iframe
                src="https://www.youtube.com/embed/KzHkWkmWiXk?si=Eopi8ab0J3mewCZG"
                title="How students enroll in our platform"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full border-0"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Top courses                                                        */}
      {/* ------------------------------------------------------------------ */}
      {featured.length > 0 && (
        <section id="courses" className="scroll-mt-24 mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal className="mb-8 text-center">
            <div>
              <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-4xl text-foreground">
                Explore Our Courses
              </h2>
              <p className="mt-2 text-black dark:text-white">
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

      <ComparisonSection />


      {/* ------------------------------------------------------------------ */}
      {/* Real Stories & Got A Question For Digo Academy?                    */}
      {/* ------------------------------------------------------------------ */}
      <ReviewsAndFaqSection />

    </div>
  );
}
