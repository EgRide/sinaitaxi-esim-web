// Dynamic sitemap — Next.js reads the export, generates /sitemap.xml.
// Entries include every static marketing page plus the dynamic
// destination pages for all countries Airalo serves.
import type { MetadataRoute } from 'next';
import { api } from '@/lib/api';

const SITE = 'https://esim.sinaitaxi.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static + marketing entries
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE}/`,               changeFrequency: 'daily',   priority: 1.0 },
    { url: `${SITE}/how-it-works`,   changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/why-us`,         changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/install-esim`,   changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/privacy`,        changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE}/terms`,          changeFrequency: 'yearly',  priority: 0.3 },
  ];

  // Per-country destination pages. Catalogue rarely changes,
  // so weekly revalidation is plenty.
  let countryEntries: MetadataRoute.Sitemap = [];
  try {
    const countries = await api.countries();
    countryEntries = countries.map(c => ({
      url: `${SITE}/destinations/${c.code.toLowerCase()}`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));
  } catch {
    // If the API is down at build time we still ship a valid sitemap.
  }

  return [...staticEntries, ...countryEntries];
}
