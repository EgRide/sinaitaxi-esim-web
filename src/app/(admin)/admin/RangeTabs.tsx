'use client';

// Pill segmented control for time range. Server-rendered table
// re-reads on each click via a Link, so this is purely visual.
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/cn';

const RANGES: { key: 'today' | '7d' | '30d' | 'all'; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: '7d' },
  { key: '30d', label: '30d' },
  { key: 'all', label: 'All' },
];

interface Props {
  current: 'today' | '7d' | '30d' | 'all';
  basePath: string;
}
export const RangeTabs: React.FC<Props> = ({ current, basePath }) => {
  const sp = useSearchParams();
  const buildHref = (range: string) => {
    const next = new URLSearchParams(sp);
    next.set('range', range);
    return `${basePath}?${next.toString()}`;
  };
  return (
    <div className="inline-flex bg-ink-100 rounded-full p-1">
      {RANGES.map(r => (
        <Link
          key={r.key}
          href={buildHref(r.key)}
          className={cn(
            'px-3.5 py-1.5 text-xs font-semibold rounded-full transition',
            current === r.key
              ? 'bg-white text-ink-900 shadow-sm'
              : 'text-ink-500 hover:text-ink-700',
          )}>
          {r.label}
        </Link>
      ))}
    </div>
  );
};
