'use client';

// Package list — two-tab layout (Unlimited / Standard) with
// premium gold treatment on the Unlimited tab. The split is
// designed for conversion: Unlimited is shown first because it
// carries the highest AOV + the clearest value prop ("travel
// without limits"), Standard is the value-shopper alternative.
//
// Within each tab, plans are sortable by duration and a
// "Recommended" badge highlights the highest-data Unlimited or
// the cheapest Standard, depending on context.
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, Clock, Database, Mic, MessageSquare, ChevronDown,
  AlertTriangle, Info, Radio, Globe, Power, Crown, Sparkles, Zap,
  Smartphone,
} from 'lucide-react';
import type { CustomerPackage } from '@/lib/api';
import { cn } from '@/lib/cn';
import { fmtPrice } from '@/lib/price';
import { CheckoutForm, type CheckoutUser } from './CheckoutForm';
import { CompatibilityModal } from '@/components/CompatibilityModal';

type Tab = 'unlimited' | 'standard';

const DURATION_BUCKETS: { id: string; label: string; min: number; max: number }[] = [
  { id: 'any',  label: 'Any duration', min: 0,   max: Infinity },
  { id: '1-7',  label: '1–7 days',     min: 1,   max: 7 },
  { id: '8-30', label: '8–30 days',    min: 8,   max: 30 },
  { id: '30+',  label: '30+ days',     min: 31,  max: Infinity },
];

interface Props {
  packages: CustomerPackage[];
  /** Signed-in customer (null = show login gate on checkout). */
  user: CheckoutUser | null;
  /** Where /login should send the user after sign-in. */
  loginNext: string;
  /** ISO 3166 alpha-2 of the country the page belongs to.
   *  Persisted on the order so My eSIMs renders the correct
   *  destination flag. */
  selectedCountryCode: string;
}

const isUnlimited = (p: CustomerPackage): boolean =>
  /unlim/i.test(p.data) || /unlim/i.test(p.title);

export const PackageList: React.FC<Props> = ({ packages, user, loginNext, selectedCountryCode }) => {
  // Split into the two top-level buckets up front so the tab
  // counts stay accurate regardless of the duration filter.
  const { unlimited, standard } = useMemo(() => {
    const u: CustomerPackage[] = [];
    const s: CustomerPackage[] = [];
    for (const p of packages) (isUnlimited(p) ? u : s).push(p);
    return { unlimited: u, standard: s };
  }, [packages]);

  // Default to whichever tab actually has plans, preferring
  // Unlimited because that's the higher-AOV path.
  const [tab, setTab] = useState<Tab>(unlimited.length > 0 ? 'unlimited' : 'standard');
  const [bucket, setBucket] = useState('any');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [compatOpen, setCompatOpen] = useState(false);
  const openCompat = () => setCompatOpen(true);

  const list = tab === 'unlimited' ? unlimited : standard;

  const filtered = useMemo(() => {
    const b = DURATION_BUCKETS.find(x => x.id === bucket)!;
    return list
      .filter(p => p.validity >= b.min && p.validity <= b.max)
      .sort((a, b) => {
        // Unlimited tab: longer validity = better. Standard tab:
        // cheapest first (so "Best value" lands at the top).
        if (tab === 'unlimited') return b.validity - a.validity;
        return a.retailPrice - b.retailPrice;
      });
  }, [list, bucket, tab]);

  // Recommended badge: longest-validity in Unlimited (the
  // commitment plan), highest-data in Standard, cheapest as a
  // tiebreaker.
  const recommendedId = useMemo(() => {
    if (filtered.length === 0) return null;
    if (tab === 'unlimited') return filtered[0]?.id ?? null;
    return [...filtered].sort((a, b) => parseDataGB(b.data) - parseDataGB(a.data))[0]?.id ?? null;
  }, [filtered, tab]);
  const cheapestId = filtered[0]?.id;

  return (
    <div className="rounded-3xl bg-white border border-ink-100 shadow-soft overflow-hidden">
      {/* Tab bar */}
      <div className="px-5 lg:px-8 pt-6">
        <div className="inline-flex p-1 rounded-full bg-ink-50 border border-ink-100">
          <TabButton
            active={tab === 'unlimited'}
            onClick={() => { setTab('unlimited'); setExpanded(null); setBucket('any'); }}
            gold>
            <Crown className="h-3.5 w-3.5" />
            Unlimited
            <Count n={unlimited.length} active={tab === 'unlimited'} gold />
          </TabButton>
          <TabButton
            active={tab === 'standard'}
            onClick={() => { setTab('standard'); setExpanded(null); setBucket('any'); }}>
            <Database className="h-3.5 w-3.5" />
            Standard
            <Count n={standard.length} active={tab === 'standard'} />
          </TabButton>
        </div>

        {/* Tab-level pitch — short, conversion-oriented */}
        {tab === 'unlimited' ? (
          <div className="mt-4 rounded-2xl bg-gradient-to-br from-amber-50 via-amber-50/60 to-transparent border border-amber-200/60 px-5 py-4 flex items-start gap-3">
            <span className="grid place-items-center w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-soft text-white flex-shrink-0">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <div className="font-extrabold tracking-tight text-amber-900">
                Travel without limits
              </div>
              <p className="text-sm text-amber-900/80 mt-0.5">
                One price, unlimited data. Best for streaming, hotspot tethering,
                heavy navigation — no anxiety about running out mid-trip.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-sm text-ink-500">
            Fixed-data plans for travellers who just need the basics.
            Pick the GB tier that fits your trip.
          </div>
        )}
      </div>

      {/* Duration filter */}
      <div className="px-5 lg:px-8 mt-5 flex flex-wrap gap-2">
        {DURATION_BUCKETS.map(b => (
          <button
            key={b.id}
            onClick={() => { setBucket(b.id); setExpanded(null); }}
            className={cn(
              'rounded-full px-4 py-1.5 text-xs font-medium border transition',
              bucket === b.id
                ? 'bg-ink-900 text-white border-ink-900'
                : 'bg-white text-ink-600 border-ink-200 hover:border-ink-300',
            )}>
            {b.label}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-ink-500">
          {filtered.length} plan{filtered.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="px-5 lg:px-8 py-16 text-center text-sm text-ink-500">
          No {tab} plans match this duration. Try another filter.
        </div>
      ) : null}

      {/* List */}
      <ul className="px-5 lg:px-8 pb-6 pt-5 space-y-3">
        {filtered.map((pkg, i) => (
          <motion.li
            key={pkg.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: Math.min(i * 0.02, 0.22) }}>
            {tab === 'unlimited' ? (
              <PremiumCard
                pkg={pkg}
                isRecommended={pkg.id === recommendedId}
                open={expanded === pkg.id}
                onToggle={() => setExpanded(prev => (prev === pkg.id ? null : pkg.id))}
                onCheckCompat={openCompat}
                user={user}
                loginNext={loginNext}
                selectedCountryCode={selectedCountryCode}
              />
            ) : (
              <StandardCard
                pkg={pkg}
                isCheapest={pkg.id === cheapestId}
                isRecommended={pkg.id === recommendedId}
                open={expanded === pkg.id}
                onToggle={() => setExpanded(prev => (prev === pkg.id ? null : pkg.id))}
                onCheckCompat={openCompat}
                user={user}
                loginNext={loginNext}
                selectedCountryCode={selectedCountryCode}
              />
            )}
          </motion.li>
        ))}
      </ul>

      <CompatibilityModal open={compatOpen} onClose={() => setCompatOpen(false)} />
    </div>
  );
};

// ── Tab UI ────────────────────────────────────────────────────
const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  gold?: boolean;
  children: React.ReactNode;
}> = ({ active, onClick, gold, children }) => (
  <button
    onClick={onClick}
    className={cn(
      'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition',
      active
        ? gold
          ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-glow'
          : 'bg-white text-ink-900 shadow-sm'
        : 'text-ink-600 hover:text-ink-900',
    )}>
    {children}
  </button>
);

const Count: React.FC<{ n: number; active: boolean; gold?: boolean }> = ({ n, active, gold }) => (
  <span className={cn(
    'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold tabular-nums',
    active
      ? gold ? 'bg-white/25 text-white' : 'bg-ink-100 text-ink-700'
      : 'bg-ink-100 text-ink-500',
  )}>
    {n}
  </span>
);

// ── Premium (Unlimited) card — gold gradient, biggest pitch ───
const PremiumCard: React.FC<{
  pkg: CustomerPackage;
  isRecommended: boolean;
  open: boolean;
  onToggle: () => void;
  onCheckCompat: () => void;
  user: CheckoutUser | null;
  loginNext: string;
  selectedCountryCode: string;
}> = ({ pkg, isRecommended, open, onToggle, onCheckCompat, user, loginNext, selectedCountryCode }) => (
  <div className={cn(
    'relative rounded-3xl overflow-hidden transition',
    open
      ? 'ring-2 ring-amber-400 shadow-glow'
      : 'border border-amber-200/70 hover:border-amber-300 hover:shadow-soft',
  )}>
    {/* Decorative gold backdrop */}
    <span
      aria-hidden
      className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-50/30 pointer-events-none"
    />
    <span
      aria-hidden
      className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-amber-300/30 blur-3xl pointer-events-none"
    />

    {/* Full-width "Most popular" ribbon at the top — sits above the
        headline row so it never overlaps the price column. */}
    {isRecommended ? (
      <div className="relative z-10 flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-700 text-white text-[10px] font-bold uppercase tracking-widest py-1.5">
        <Crown className="h-3 w-3" />
        Most popular
      </div>
    ) : null}

    <button
      onClick={onToggle}
      className="relative w-full text-left p-4 sm:p-6">
      {/* Top row on mobile: crown + price floats up. On desktop: 3-col layout. */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Crown */}
        <div className="flex-shrink-0">
          <div className="grid place-items-center w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-soft">
            <Crown className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="hidden sm:block text-center mt-2">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-700">
              Unlimited
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] sm:hidden font-bold uppercase tracking-widest text-amber-700">
            Unlimited
          </div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-ink-900">
              {pkg.validity}
              <span className="text-sm sm:text-base text-ink-500 font-bold ml-1">days</span>
            </span>
            {pkg.operatorName ? (
              <span className="text-[11px] sm:text-xs text-ink-500 font-semibold truncate">
                · {pkg.operatorName}
              </span>
            ) : null}
          </div>
        </div>

        {/* Price — right side, scales on mobile too */}
        <div className="flex-shrink-0 text-right">
          <div className="text-xl sm:text-4xl font-extrabold tracking-tighter bg-gradient-to-br from-amber-700 to-amber-900 bg-clip-text text-transparent leading-none">
            {fmtPrice(pkg.retailPrice, pkg.currency)}
          </div>
          <div className="mt-1 inline-flex items-center gap-1 text-[10px] sm:text-xs text-amber-700 font-bold uppercase tracking-wider">
            {open ? 'Hide' : 'Get this plan'}
            <ChevronDown className={cn('h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform', open && 'rotate-180')} />
          </div>
        </div>
      </div>

      {/* Feature chips + fair-use — full width below the headline on every breakpoint */}
      <ul className="mt-3 flex flex-wrap gap-1.5 sm:gap-x-3 sm:gap-y-1 text-[11px] sm:text-xs text-ink-600">
        <Feature icon={<Database className="h-3 w-3 sm:h-3.5 sm:w-3.5" />} label="Unlimited data" gold />
        {pkg.isRoaming ? (
          <Feature icon={<Globe className="h-3 w-3 sm:h-3.5 sm:w-3.5" />} label="Multi-carrier" />
        ) : null}
        <Feature icon={<Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />} label="Instant activation" />
      </ul>

      {pkg.hasFairUsagePolicy && pkg.fairUsagePolicy ? (
        <p className="mt-2 inline-flex items-start gap-1.5 text-[11px] sm:text-xs text-amber-800 bg-white/70 border border-amber-200 rounded-lg px-2 py-1 sm:max-w-md">
          <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mt-px flex-shrink-0" />
          <span>{pkg.fairUsagePolicy}</span>
        </p>
      ) : null}
    </button>

    {/* Compatibility check — under the headline, always visible */}
    <CompatCheckButton onClick={onCheckCompat} tone="gold" />


    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="overflow-hidden relative">
          <div className="border-t border-amber-200/60 px-5 sm:px-6 pb-6 pt-5 bg-white/50 backdrop-blur-sm">
            <PackageDetails pkg={pkg} />
            <div className="mt-5 pt-5 border-t border-amber-200/40">
              <CheckoutForm pkg={pkg} user={user} loginNext={loginNext} selectedCountryCode={selectedCountryCode} />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  </div>
);

// ── Standard card — sleek, scannable ──────────────────────────
const StandardCard: React.FC<{
  pkg: CustomerPackage;
  isCheapest: boolean;
  isRecommended: boolean;
  open: boolean;
  onToggle: () => void;
  onCheckCompat: () => void;
  user: CheckoutUser | null;
  loginNext: string;
  selectedCountryCode: string;
}> = ({ pkg, isCheapest, isRecommended, open, onToggle, onCheckCompat, user, loginNext, selectedCountryCode }) => (
  <div
    className={cn(
      'rounded-2xl border bg-white transition',
      open ? 'border-brand-500 shadow-soft' : 'border-ink-100 hover:border-ink-200',
    )}>
    <button
      onClick={onToggle}
      className="w-full text-left p-4 sm:p-5">
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Data — compact on mobile */}
        <div className="flex-shrink-0">
          <div className="text-xl sm:text-3xl font-extrabold tracking-tightest text-ink-900 leading-none">
            {pkg.data}
          </div>
          <div className="text-[10px] sm:text-xs text-ink-500 mt-0.5">{pkg.validity} days</div>
        </div>

        {/* Middle — badges + carrier + bullets */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            {isCheapest ? (
              <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 sm:px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                Best value
              </span>
            ) : null}
            {isRecommended && !isCheapest ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 px-1.5 sm:px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                <Sparkles className="h-3 w-3" />
                Most data
              </span>
            ) : null}
            <span className="hidden sm:inline text-xs text-ink-500 capitalize">{pkg.type}</span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-ink-500 line-clamp-2">
            {pkg.operatorName ? <span className="font-semibold text-ink-700">{pkg.operatorName}</span> : null}
            {pkg.operatorName && (pkg.shortInfo || pkg.title) ? ' · ' : null}
            {pkg.shortInfo ?? pkg.title}
          </p>
          <ul className="mt-1.5 hidden sm:flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
            <li className="inline-flex items-center gap-1"><Database className="h-3.5 w-3.5" /> {pkg.data}</li>
            <li className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {pkg.validity} days</li>
            {pkg.voice ? <li className="inline-flex items-center gap-1"><Mic className="h-3.5 w-3.5" /> {pkg.voice} min</li> : null}
            {pkg.text  ? <li className="inline-flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {pkg.text} sms</li> : null}
          </ul>
        </div>

        <div className="flex-shrink-0 text-right">
          <div className="text-lg sm:text-2xl font-extrabold tracking-tighter leading-none">
            {fmtPrice(pkg.retailPrice, pkg.currency)}
          </div>
          <div className="mt-1 inline-flex items-center gap-1 text-[10px] sm:text-xs text-brand-500 font-semibold">
            {open ? 'Hide' : 'Select'}
            <ChevronDown className={cn('h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform', open && 'rotate-180')} />
          </div>
        </div>
      </div>
    </button>

    {/* Compatibility check — under the headline, always visible */}
    <CompatCheckButton onClick={onCheckCompat} tone="default" />

    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="overflow-hidden">
          <div className="border-t border-ink-100 px-5 pb-5 pt-4">
            <PackageDetails pkg={pkg} />
            <div className="mt-5 pt-5 border-t border-ink-100">
              <CheckoutForm pkg={pkg} user={user} loginNext={loginNext} selectedCountryCode={selectedCountryCode} />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  </div>
);

// ── Compat check pill (used in both card flavours) ────────────
// `relative` is required so the gold decorative overlays on
// PremiumCard don't paint on top of this button — otherwise the
// icon and label disappear behind the amber backdrop.
const CompatCheckButton: React.FC<{ onClick: () => void; tone: 'gold' | 'default' }> = ({ onClick, tone }) => (
  <div className="relative px-5 sm:px-6 pb-4 -mt-2">
    <button
      onClick={e => { e.stopPropagation(); onClick(); }}
      className={cn(
        'inline-flex items-center gap-2 text-xs font-bold tracking-wide rounded-full px-3 py-1.5 transition border',
        tone === 'gold'
          ? 'bg-white/80 hover:bg-white border-amber-300 text-amber-900 shadow-sm'
          : 'bg-ink-50 hover:bg-white border-ink-200 text-ink-700 hover:border-brand-300',
      )}>
      <Smartphone className="h-3.5 w-3.5" />
      Check compatibility
    </button>
  </div>
);

const Feature: React.FC<{ icon: React.ReactNode; label: string; gold?: boolean }> = ({ icon, label, gold }) => (
  <li className={cn(
    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 border',
    gold
      ? 'bg-amber-100/60 border-amber-200 text-amber-900 font-semibold'
      : 'bg-white border-ink-200 text-ink-700',
  )}>
    {icon}{label}
  </li>
);

// Full plan detail panel — surfaces every piece of info Airalo
// publishes about the package: operator, fair usage, network
// notes, activation policy, coverage caveats. Renders above the
// inline checkout so customers can read it before paying.
const PackageDetails: React.FC<{ pkg: CustomerPackage }> = ({ pkg }) => {
  const info = pkg.operatorInfo ?? [];
  const hasOperatorBlock = pkg.operatorName || info.length > 0 || pkg.isRoaming != null;
  const hasPolicies = pkg.hasFairUsagePolicy || pkg.activationPolicy;
  const hasNotes = pkg.otherInfo;

  if (!hasOperatorBlock && !hasPolicies && !hasNotes) return null;

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {hasOperatorBlock ? (
        <div className="rounded-2xl border border-ink-100 bg-ink-50/50 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">
            <Radio className="h-3.5 w-3.5" />
            Network
          </div>
          {pkg.operatorName ? (
            <div className="text-base font-bold text-ink-900">{pkg.operatorName}</div>
          ) : null}
          {pkg.isRoaming != null ? (
            <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-600">
              <Globe className="h-3.5 w-3.5 text-ink-400" />
              {pkg.isRoaming ? 'Roams across local carriers' : 'No roaming'}
            </div>
          ) : null}
          {info.length > 0 ? (
            <ul className="mt-3 space-y-1.5 text-sm text-ink-700">
              {info.map((line, i) => (
                <li key={i} className="flex gap-2">
                  <Check className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {hasPolicies ? (
        <div className="rounded-2xl border border-ink-100 bg-ink-50/50 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">
            <Power className="h-3.5 w-3.5" />
            Policies
          </div>
          {pkg.hasFairUsagePolicy && pkg.fairUsagePolicy ? (
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-900 flex gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">Fair usage policy</div>
                <p className="mt-0.5 leading-snug">{pkg.fairUsagePolicy}</p>
              </div>
            </div>
          ) : null}
          {pkg.activationPolicy ? (
            <div className="text-sm text-ink-700 flex gap-2">
              <Power className="h-4 w-4 text-ink-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">Activation</div>
                <p className="mt-0.5 text-ink-600">
                  {pkg.activationPolicy === 'first-usage'
                    ? `Validity (${pkg.validity} days) starts the moment data is first used.`
                    : pkg.activationPolicy === 'purchase'
                      ? `Validity (${pkg.validity} days) starts the moment the eSIM is purchased.`
                      : pkg.activationPolicy}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {hasNotes ? (
        <div className="sm:col-span-2 rounded-2xl border border-ink-100 bg-white p-4 flex gap-3">
          <Info className="h-4 w-4 text-ink-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-ink-700 leading-relaxed">{pkg.otherInfo}</div>
        </div>
      ) : null}
    </div>
  );
};

// Crude "what's the GB count" extractor so the Most data badge
// can rank plans. Falls back to 999 for Unlimited so it ranks
// at the top, and 0 for unknown.
const parseDataGB = (s: string): number => {
  if (/unlim/i.test(s)) return 999;
  const m = s.match(/([\d.]+)\s*GB/i);
  if (m) return Number(m[1]);
  const mb = s.match(/([\d.]+)\s*MB/i);
  if (mb) return Number(mb[1]) / 1024;
  return 0;
};
