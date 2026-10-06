import type { Metadata } from 'next';
import { SEO_CONFIG } from './config';

interface BuildMetadataParams {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noindex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path,
  image,
  noindex = false,
}: BuildMetadataParams = {}): Metadata {
  const url = path ? `${SEO_CONFIG.siteUrl}${path}` : SEO_CONFIG.siteUrl;
  const ogImage = image || `${SEO_CONFIG.siteUrl}/api/og`; // Or use /opengraph-image

  return {
    title: title ? `${title} | ${SEO_CONFIG.siteName}` : SEO_CONFIG.defaultTitle,
    description: description || SEO_CONFIG.defaultDescription,
    alternates: {
      canonical: url,
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: title ? `${title} | ${SEO_CONFIG.siteName}` : SEO_CONFIG.defaultTitle,
      description: description || SEO_CONFIG.defaultDescription,
      url,
      siteName: SEO_CONFIG.siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || SEO_CONFIG.siteName,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title ? `${title} | ${SEO_CONFIG.siteName}` : SEO_CONFIG.defaultTitle,
      description: description || SEO_CONFIG.defaultDescription,
      creator: SEO_CONFIG.twitterHandle,
      images: [ogImage],
    },
  };
}
