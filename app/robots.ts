import { MetadataRoute } from 'next';
import { SEO_CONFIG } from '@/lib/seo/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/student/',
        '/dashboard/',
        '/settings/',
        '/api/',
        '/checkout/',
        '/suspended/',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/two-factor',
        '/verify-email',
      ],
    },
    sitemap: `${SEO_CONFIG.siteUrl}/sitemap.xml`,
  };
}
