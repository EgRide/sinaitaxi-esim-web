'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/cn';

const STATUSES: { key: 'all' | 'pending' | 'fulfilled' | 'fulfillment_failed'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'fulfilled', label: 'Fulfilled' },
  { key: 'pending', label: 'Pending' },
  { key: 'fulfillment_failed', label: 'Failed' },
];

interface Props {
  current: 'all' | 'pending' | 'fulfilled' | 'fulfillment_failed';
}
export const StatusTabs: React.FC<Props> = ({ current }) => {
  const sp = useSearchParams();
  const buildHref = (status: string) => {
    const next = new URLSearchParams(sp);
    next.set('status', status);
    return `/admin/orders?${next.toString()}`;
  };
  return (
    <div className="inline-flex bg-white rounded-full p-1 border border-ink-100 shadow-sm">
      {STATUSES.map(s => (
        <Link
          key={s.key}
          href={buildHref(s.key)}
          className={cn(
            'px-4 py-1.5 text-xs font-semibold rounded-full transition',
            current === s.key
              ? 'bg-ink-900 text-white'
              : 'text-ink-500 hover:text-ink-900',
          )}>
          {s.label}
        </Link>
      ))}
    </div>
  );
};
