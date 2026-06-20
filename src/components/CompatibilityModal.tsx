'use client';

// Single shared modal that any plan card can open via
// useCompatibility().open(). Loads the Airalo compatible device
// catalogue once per session and lets the user search for their
// exact model. Result is a clear ✓/✗.
//
// Backed by /v1/compatible-devices (cached 1h on the API side).
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, Smartphone, Apple, CheckCircle2, AlertCircle } from 'lucide-react';
import { api, type CompatibleDevice } from '@/lib/api';
import { cn } from '@/lib/cn';

// Lazy module-level cache so we only fetch the device list once.
let devicePromise: Promise<CompatibleDevice[]> | null = null;
const loadDevices = (): Promise<CompatibleDevice[]> => {
  if (!devicePromise) devicePromise = api.compatibleDevices();
  return devicePromise;
};

type Os = 'ios' | 'android' | 'all';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CompatibilityModal: React.FC<Props> = ({ open, onClose }) => {
  const [devices, setDevices] = useState<CompatibleDevice[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [os, setOs] = useState<Os>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || devices) return;
    setError(null);
    loadDevices()
      .then(setDevices)
      .catch(err => setError((err as Error).message));
  }, [open, devices]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const matches = useMemo(() => {
    if (!devices) return [];
    const t = q.trim().toLowerCase();
    return devices
      .filter(d => os === 'all' ? true : d.os.toLowerCase() === os)
      .filter(d => !t
        || d.name.toLowerCase().includes(t)
        || d.brand.toLowerCase().includes(t)
        || `${d.brand} ${d.name}`.toLowerCase().includes(t),
      )
      .slice(0, 200);
  }, [devices, q, os]);

  // Group matches by brand so the list scans cleanly.
  const grouped = useMemo(() => {
    const m = new Map<string, CompatibleDevice[]>();
    for (const d of matches) {
      const arr = m.get(d.brand) ?? [];
      arr.push(d);
      m.set(d.brand, arr);
    }
    return [...m.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [matches]);

  const total = devices?.length ?? 0;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 grid place-items-center p-4 bg-ink-900/50 backdrop-blur-sm"
          onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-soft border border-ink-100 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-ink-100">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">
                    Check device compatibility
                  </h2>
                  <p className="text-sm text-ink-500 mt-1">
                    eSIM works on most phones from 2018 onwards.
                    Search for your exact model below.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="rounded-full bg-ink-50 hover:bg-ink-100 transition w-9 h-9 grid place-items-center flex-shrink-0">
                  <X className="h-4 w-4 text-ink-600" />
                </button>
              </div>

              {/* Search + OS filter */}
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                  <input
                    ref={inputRef}
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder="e.g. iPhone 14, Pixel 8, Galaxy S23…"
                    className="w-full rounded-2xl border border-ink-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition"
                  />
                </div>
                <div className="inline-flex bg-ink-50 rounded-full p-1 self-start">
                  <OsTab active={os === 'all'} onClick={() => setOs('all')}>
                    All
                  </OsTab>
                  <OsTab active={os === 'ios'} onClick={() => setOs('ios')}>
                    <Apple className="h-3.5 w-3.5" /> iPhone
                  </OsTab>
                  <OsTab active={os === 'android'} onClick={() => setOs('android')}>
                    <Smartphone className="h-3.5 w-3.5" /> Android
                  </OsTab>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>Couldn&apos;t load the device list right now. Refresh and try again.</span>
                </div>
              ) : !devices ? (
                <SkeletonList />
              ) : matches.length === 0 ? (
                <NoMatch q={q} />
              ) : (
                <div className="space-y-5">
                  {grouped.map(([brand, items]) => (
                    <section key={brand}>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">
                        {brand} <span className="text-ink-400 font-medium">({items.length})</span>
                      </h3>
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {items.map(d => (
                          <li
                            key={`${d.brand}-${d.name}-${d.os}`}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-100 bg-emerald-50/50">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                            <span className="text-sm text-ink-800">{d.name}</span>
                            <span className="ml-auto text-[10px] uppercase font-bold tracking-wider text-emerald-700">
                              {d.os === 'ios' ? 'iOS' : 'Android'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-ink-100 bg-ink-50/40 flex items-center justify-between gap-3 text-xs text-ink-500">
              <span>
                Don&apos;t see your model?{' '}
                <strong className="text-ink-700">Most phones from 2018+ support eSIM.</strong>
                {' '}Check Settings → About → search &quot;eIM&quot; or &quot;EID&quot;.
              </span>
              {total > 0 ? (
                <span className="tabular-nums whitespace-nowrap">{total} supported</span>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

const OsTab: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={cn(
      'inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full transition',
      active ? 'bg-ink-900 text-white' : 'text-ink-600 hover:text-ink-900',
    )}>
    {children}
  </button>
);

const SkeletonList: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-3 w-24 rounded-md bg-ink-100 animate-pulse" />
        <div className="grid sm:grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} className="h-9 rounded-xl bg-ink-100 animate-pulse" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const NoMatch: React.FC<{ q: string }> = ({ q }) => (
  <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-4 text-sm text-amber-900">
    <div className="font-bold mb-1">Hmm, &quot;{q}&quot; isn&apos;t in the official list.</div>
    <p>
      Airalo&apos;s catalogue is partial — most phones released after 2018
      support eSIM even if they&apos;re not listed. Open <strong>Settings → About / General</strong>{' '}
      on your phone and look for <code className="bg-amber-100 px-1 rounded">EID</code>{' '}
      or <code className="bg-amber-100 px-1 rounded">eSIM</code>. If you see either,
      the plan will work.
    </p>
  </div>
);
