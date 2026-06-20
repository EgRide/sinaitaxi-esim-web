export const runtime = 'edge';

// Country detail — package picker. Hero with the country's flag
// and stats, filter bar by duration, and a polished list of
// package cards. Inline checkout lives in CheckoutForm.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { api } from '@/lib/api';
import { Flag } from '@/components/Flag';
import { fmtPrice } from '@/lib/price';
import { PackageList } from './PackageList';

type Params = Promise<{ code: string }>;

export default async function CountryPage({ params }: { params: Params }) {
  const { code } = await params;
  const upper = code.toUpperCase();
  let packages: Awaited<ReturnType<typeof api.packages>> = [];
  try { packages = await api.packages(upper); } catch { notFound(); }
  if (packages.length === 0) notFound();

  // Resolve human-readable name via Intl. The API only sends ISO codes
  // on a per-package basis so we look up locally.
  const countryName = new Intl.DisplayNames(['en'], { type: 'region' }).of(upper) ?? upper;
  const cheapest = packages.reduce(
    (acc, p) => (p.retailPrice > 0 && p.retailPrice < acc ? p.retailPrice : acc),
    Number.POSITIVE_INFINITY,
  );
  const cheapestCurrency = packages[0]?.currency ?? 'EUR';

  return (
    <>
      {/* Hero band */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% -10%, rgba(83,136,255,0.55), transparent 50%)',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pt-12 pb-14 text-white">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> All destinations
          </Link>
          <div className="mt-6 grid lg:grid-cols-[auto_1fr] gap-6 items-center">
            <Flag code={upper} size="xl" className="!h-16 !w-24 ring-1 ring-white/20 shadow-glow" />
            <div>
              <span className="text-xs uppercase tracking-widest text-white/60">
                Travel data for
              </span>
              <h1 className="mt-1 text-4xl sm:text-5xl font-extrabold tracking-tightest">
                {countryName}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/80">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1">
                  <Sparkles className="h-3.5 w-3.5 text-accent-400" />
                  {packages.length} plans
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1">
                  <Zap className="h-3.5 w-3.5 text-accent-400" />
                  From {fmtPrice(cheapest, cheapestCurrency)}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent-400" />
                  Stripe-secured
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="relative -mt-8 mx-auto max-w-6xl px-6">
        <PackageList packages={packages} />
      </section>
    </>
  );
}
