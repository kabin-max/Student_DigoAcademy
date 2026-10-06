import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { SEO_CONFIG } from '@/lib/seo/config';

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SEO_CONFIG.siteUrl;

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/courses',
    '/instructors',
    '/blogs',
    '/career-roadmap',
    '/contact',
    '/privacy',
    '/terms',
    '/refund',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch dynamic courses
  const courses = await db.course.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true, updatedAt: true },
  });

  const courseRoutes = courses.map((course) => ({
    url: `${baseUrl}/courses/${course.id}`,
    lastModified: course.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...courseRoutes];
}
