'use client';

// Full country grid with a regional filter. Renders all 215
// countries with motion staggered on scroll. Filter chips above
// the grid — click a region to narrow the list (purely
// client-side, instant).
//
// Earlier we showed an "All" chip alongside the five continents.
// The 200-row continent-mixed list was overwhelming the customer
// without giving them a clearer path to a purchase, so we dropped
// it — Europe is the default tab now since it accounts for the
// majority of bookings.
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CountryCard } from '@/components/CountryCard';
import type { Country } from '@/lib/api';
import { cn } from '@/lib/cn';

const REGIONS: { id: string; label: string; codes: string[] }[] = [
  { id: 'europe',      label: 'Europe',       codes: ['AL','AT','BA','BE','BG','BY','CH','CY','CZ','DE','DK','EE','ES','FI','FR','GB','GR','HR','HU','IE','IS','IT','LT','LU','LV','MD','ME','MK','MT','NL','NO','PL','PT','RO','RS','RU','SE','SI','SK','UA','VA','XK'] },
  { id: 'asia',        label: 'Asia',         codes: ['AF','AM','AZ','BD','BH','BN','BT','CN','GE','HK','ID','IL','IN','IQ','IR','JO','JP','KG','KH','KP','KR','KW','KZ','LA','LB','LK','MM','MN','MO','MV','MY','NP','OM','PH','PK','PS','QA','SA','SG','SY','TH','TJ','TL','TM','TR','TW','UZ','VN','YE'] },
  { id: 'americas',    label: 'Americas',     codes: ['AR','BB','BO','BR','BS','BZ','CA','CL','CO','CR','CU','DM','DO','EC','GD','GT','GY','HN','HT','JM','KN','KY','LC','MX','NI','PA','PE','PR','PY','SR','SV','TT','US','UY','VC','VE'] },
  { id: 'africa',      label: 'Africa',       codes: ['AO','BF','BI','BJ','BW','CD','CF','CG','CI','CM','CV','DJ','DZ','EG','ER','ET','GA','GH','GM','GN','GQ','GW','KE','KM','LR','LS','LY','MA','MG','ML','MR','MU','MW','MZ','NA','NE','NG','RW','SC','SD','SL','SN','SO','SS','SZ','TD','TG','TN','TZ','UG','ZA','ZM','ZW'] },
  { id: 'oceania',     label: 'Oceania',      codes: ['AU','CK','FJ','FM','KI','MH','NC','NR','NU','NZ','PF','PG','PW','SB','TO','TV','VU','WS'] },
];

interface Props {
  countries: Country[];
  error: string | null;
}

export const CountryGrid: React.FC<Props> = ({ countries, error }) => {
  const [region, setRegion] = useState<string>('europe');

  const filtered = useMemo(() => {
    const def = REGIONS.find(r => r.id === region) ?? REGIONS[0];
    const set = new Set(def!.codes);
    return countries.filter(c => set.has(c.code));
  }, [region, countries]);

  return (
    <section id="all" className="mx-auto max-w-6xl px-6 py-24 lg:py-28">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <span className="chip mb-3">Destinations</span>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tightest">
            Pick where you're going.
          </h2>
        </div>
        <p className="text-sm text-ink-500 md:max-w-sm">
          {filtered.length} of {countries.length} countries shown.
        </p>
      </div>

      {/* Region chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {REGIONS.map(r => (
          <button
            key={r.id}
            onClick={() => setRegion(r.id)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium border transition',
              region === r.id
                ? 'bg-ink-900 text-white border-ink-900'
                : 'bg-white text-ink-700 border-ink-200 hover:border-ink-300',
            )}>
            {r.label}
          </button>
        ))}
      </div>

      {error ? (
        <ErrorPanel message={error} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((c, i) => (
            <CountryCard key={c.code} country={c} index={i} />
          ))}
        </div>
      )}
    </section>
  );
};

const ErrorPanel: React.FC<{ message: string }> = ({ message }) => (
  <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-800">
    <p className="font-bold">Could not load destinations.</p>
    <p className="text-sm mt-1">{message}</p>
    <p className="text-sm mt-2 text-red-700">
      Make sure the API service is running on{' '}
      <code className="rounded bg-red-100 px-1">
        {process.env.NEXT_PUBLIC_API_BASE_URL}
      </code>.
    </p>
  </div>
);
