'use client';

// Popular destinations — handpicked priority codes shown as
// pill-shaped pressable chips. Horizontally scrollable on mobile,
// inline-wrapped on desktop.
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flag } from '@/components/Flag';
import { fmtPrice } from '@/lib/price';
import type { Country } from '@/lib/api';

const POPULAR = ['US','GB','TR','EG','AE','SA','JP','IT','FR','ES','TH','DE'];

interface Props { countries: Country[]; }

export const PopularStrip: React.FC<Props> = ({ countries }) => {
  const lookup = new Map(countries.map(c => [c.code, c]));
  const pinned = POPULAR.map(code => lookup.get(code)).filter(Boolean) as Country[];
  if (pinned.length === 0) return null;
  return (
    <section className="relative -mt-12 z-10">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl bg-white border border-ink-100 shadow-soft p-5">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-sm font-bold tracking-wide uppercase text-ink-500">
              Popular destinations
            </h2>
            <Link href="#all" className="text-xs font-medium text-brand-500 hover:underline">
              See all {countries.length} →
            </Link>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {pinned.map(c => (
              <Link
                key={c.code}
                href={`/destinations/${c.code.toLowerCase()}`}
                className="flex-shrink-0 flex items-center gap-2 rounded-full
                           bg-ink-50 hover:bg-brand-50 transition
                           border border-ink-100 hover:border-brand-200
                           px-3 py-2 text-sm font-medium">
                <Flag code={c.code} size="sm" />
                <span>{c.name}</span>
                <span className="text-ink-500 text-xs">
                  {fmtPrice(c.fromPrice, c.currency)}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
