import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { JsonLd, schemas } from '@/components/JsonLd';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://esim.sinaitaxi.com'),
  title: {
    default: 'Sinai Taxi eSIM — Travel data without roaming fees',
    template: '%s · Sinai Taxi eSIM',
  },
  description:
    'Buy an eSIM for any country in 60 seconds. Instant activation, no SIM swap, no roaming charges. 200+ destinations worldwide, pay in EUR.',
  keywords: [
    'eSIM',
    'travel data',
    'travel eSIM',
    'roaming alternative',
    'global eSIM',
    'data plan',
    'international roaming',
    'eSIM marketplace',
    '200 countries eSIM',
  ],
  authors: [{ name: 'Sinai Taxi', url: 'https://sinaitaxi.com' }],
  category: 'Travel Technology',
  openGraph: {
    title: 'Sinai Taxi eSIM — Travel data without roaming fees',
    description: 'Travel data for 200+ countries. Instant activation, EUR pricing, no roaming fees.',
    type: 'website',
    siteName: 'Sinai Taxi eSIM',
    locale: 'en_US',
    url: 'https://esim.sinaitaxi.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sinai Taxi eSIM — Travel data without roaming fees',
    description: 'Travel data for 200+ countries. Instant activation, EUR pricing, no roaming fees.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  applicationName: 'Sinai Taxi eSIM',
  verification: {
    // Add when you set up Search Console + Bing Webmaster:
    // google: '...', other: { 'msvalidate.01': '...' }
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* Site-wide structured data. Page-specific schemas (FAQs,
            country Product, breadcrumbs) are injected by individual
            page components. */}
        <JsonLd data={schemas.organization()} />
        <JsonLd data={schemas.website()} />
      </head>
      <body>{children}</body>
    </html>
  );
}
