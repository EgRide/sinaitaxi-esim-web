import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://esim.sinaitaxi.com'),
  title: {
    default: 'Sinai Taxi eSIM — Travel data without roaming fees',
    template: '%s · Sinai Taxi eSIM',
  },
  description:
    'Buy an eSIM for any country in 60 seconds. Instant activation, no SIM swap, no roaming charges. 200+ destinations worldwide.',
  openGraph: {
    title: 'Sinai Taxi eSIM',
    description: 'Travel data for 200+ countries. No roaming fees.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
