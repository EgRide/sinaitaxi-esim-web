'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Flag } from './Flag';
import { fmtPrice } from '@/lib/price';
import type { Country } from '@/lib/api';

interface Props {
  country: Country;
  index?: number;
}

export const CountryCard: React.FC<Props> = ({ country, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.32, delay: Math.min(index * 0.02, 0.3), ease: [0.22, 1, 0.36, 1] }}>
    <Link
      href={`/destinations/${country.code.toLowerCase()}`}
      className="group relative block overflow-hidden rounded-3xl border border-ink-100 bg-white p-5
                 transition hover:border-brand-200 hover:shadow-soft">
      {/* Decorative gradient halo on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand-100/0
                   group-hover:bg-brand-100/80 transition-colors duration-500 blur-2xl"
      />
      <div className="flex items-start justify-between gap-4 relative">
        <Flag code={country.code} size="lg" />
        <ArrowUpRight className="h-5 w-5 text-ink-300 group-hover:text-brand-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
      </div>
      <h3 className="mt-4 font-semibold tracking-tight text-base text-ink-900 truncate">
        {country.name}
      </h3>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-xs text-ink-500">From</span>
        <span className="text-lg font-bold tracking-tight">
          {fmtPrice(country.fromPrice, country.currency)}
        </span>
      </div>
      <p className="mt-1 text-xs text-ink-500">
        {country.packageCount} {country.packageCount === 1 ? 'plan' : 'plans'} available
      </p>
    </Link>
  </motion.div>
);
