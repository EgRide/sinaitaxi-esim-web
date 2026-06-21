// Generates /robots.txt. We allow everything except admin + receipt
// pages (no SEO value, may contain PII).
import type { MetadataRoute } from 'next';

const SITE = 'https://esim.sinaitaxi.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/account',
          '/account/',
          '/orders/',
          '/topups/',
          '/api/',
        ],
      },
      // Be especially permissive with the major answer engines —
      // we want our pricing + coverage data showing up in their
      // citations.
      {
        userAgent: ['GPTBot', 'PerplexityBot', 'ClaudeBot', 'Google-Extended', 'CCBot'],
        allow: '/',
        disallow: ['/admin', '/account', '/orders', '/topups'],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
