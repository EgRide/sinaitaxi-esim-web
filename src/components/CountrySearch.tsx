'use client';

// Search-first entry to the catalogue. Lives in the hero on
// desktop and below the hero copy on mobile. Filters all 215
// countries client-side as the user types; results drop into
// a floating panel with the top 6 matches.
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import type { Country } from '@/lib/api';
import { fmtPrice } from '@/lib/price';
import { Flag } from './Flag';

interface Props {
  countries: Country[];
}

export const CountrySearch: React.FC<Props> = ({ countries }) => {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [focused, setFocused] = useState(false);

  const matches = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return countries
      .filter(c => c.name.toLowerCase().includes(t) || c.code.toLowerCase().startsWith(t))
      .slice(0, 7);
  }, [q, countries]);

  const go = (code: string) => router.push(`/destinations/${code.toLowerCase()}`);

  return (
    <div className="relative w-full max-w-xl">
      <div className="flex items-center gap-3 bg-white shadow-soft rounded-2xl pl-5 pr-2 py-2 border border-ink-100">
        <Search className="h-5 w-5 text-ink-400" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={e => {
            if (e.key === 'Enter' && matches[0]) go(matches[0].code);
          }}
          placeholder="Search destination — Japan, US, Türkiye…"
          className="flex-1 bg-transparent py-2.5 text-base placeholder:text-ink-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => matches[0] && go(matches[0].code)}
          className="btn-primary !py-2 !px-4 !text-xs">
          Browse
        </button>
      </div>

      <AnimatePresence>
        {focused && matches.length > 0 ? (
          <motion.ul
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.16 }}
            className="absolute z-20 mt-2 left-0 right-0 rounded-2xl bg-white border border-ink-100 shadow-soft overflow-hidden">
            {matches.map(c => (
              <li key={c.code}>
                <button
                  onMouseDown={() => go(c.code)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-ink-50 transition text-left">
                  <Flag code={c.code} size="sm" />
                  <span className="flex-1 font-medium">{c.name}</span>
                  <span className="text-xs text-ink-500">
                    from {fmtPrice(c.fromPrice, c.currency)}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
