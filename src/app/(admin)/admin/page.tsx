export const runtime = 'edge';

// Team dashboard overview. Server-rendered: pulls /v1/admin/stats
// + /v1/admin/orders for the requested range and shows headline
// tiles + a recent-orders preview. Range comes from `?range=`.
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ArrowRight,
  AlertTriangle,
  Clock,
  Coins,
  Euro,
  Receipt,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { adminApi, type AdminStats } from '@/lib/admin';
import { RangeTabs } from './RangeTabs';
import { StatusBadge } from './StatusBadge';
import { fmtMoney, fmtRelative } from './format';

type RangeKey = AdminStats['range'];
const RANGE_LABEL: Record<RangeKey, string> = {
  today: 'Today',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  all: 'All time',
};

const isRange = (v: string | undefined): v is RangeKey =>
  v === 'today' || v === '7d' || v === '30d' || v === 'all';

export default async function AdminDashboard({
  searchParams,
}: { searchParams: Promise<{ range?: string }> }) {
  const sp = await searchParams;
  const range: RangeKey = isRange(sp.range) ? sp.range : '30d';

  const [stats, recent, balance] = await Promise.all([
    adminApi.stats(range),
    adminApi.orders(range, 'all', 8),
    adminApi.balance().catch(() => null),
  ]);

  // Layout-level guard should already have caught this, but guard
  // again in case the backend's ADMIN_TOKEN was rotated.
  if (!stats || !recent) redirect('/admin/login');

  return (
    <div className="px-4 sm:px-8 py-8 max-w-7xl mx-auto w-full">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Overview</h1>
          <p className="text-ink-500 text-sm mt-1">
            {RANGE_LABEL[range]} · prices in {stats.currency}
          </p>
        </div>
        <RangeTabs current={range} basePath="/admin" />
      </header>

      {/* Headline tiles */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Tile
          icon={<Receipt className="h-4 w-4" />}
          label="Orders"
          value={stats.orders.toLocaleString()}
          accent="ink"
        />
        <Tile
          icon={<Euro className="h-4 w-4" />}
          label="Revenue"
          value={fmtMoney(stats.revenue, stats.currency)}
          accent="brand"
        />
        <Tile
          icon={<Coins className="h-4 w-4" />}
          label="Commission"
          value={fmtMoney(stats.commission, stats.currency)}
          hint={`Wholesale: $${stats.wholesaleUsd.toLocaleString()}`}
          accent="emerald"
        />
        <Tile
          icon={<TrendingUp className="h-4 w-4" />}
          label="Avg order value"
          value={fmtMoney(stats.avgOrderValue, stats.currency)}
          accent="ink"
        />
      </section>

      {/* Airalo balance — the wholesale wallet we draw from on every order. */}
      {balance ? (
        <section className="mb-8">
          <div className="bg-white rounded-3xl border border-ink-100 shadow-soft p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid place-items-center w-11 h-11 rounded-2xl bg-brand-50 text-brand-700">
                <Wallet className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                  Airalo wallet
                </div>
                <div className="text-2xl font-extrabold tracking-tight">
                  {fmtMoney(balance.total, balance.primaryCurrency)}
                </div>
                <div className="text-xs text-ink-400 mt-0.5">
                  Updated {new Date(balance.fetchedAt).toLocaleTimeString()}
                  {balance.accounts.length > 1 ? ` · ${balance.accounts.length} accounts` : ''}
                </div>
              </div>
            </div>
            {balance.total < 50 ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5" />
                Low balance — top up before more orders fail
              </span>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Operational tiles */}
      {(stats.pending > 0 || stats.failed > 0) ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {stats.pending > 0 ? (
            <AlertTile
              icon={<Clock className="h-4 w-4" />}
              tone="amber"
              label="Pending payment"
              value={stats.pending}
              hint="Awaiting Stripe confirmation"
            />
          ) : null}
          {stats.failed > 0 ? (
            <AlertTile
              icon={<AlertTriangle className="h-4 w-4" />}
              tone="red"
              label="Fulfillment failed"
              value={stats.failed}
              hint="Paid but Airalo order errored — investigate"
            />
          ) : null}
        </section>
      ) : null}

      {/* Recent orders */}
      <section className="bg-white rounded-3xl border border-ink-100 shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
          <h2 className="font-bold tracking-tight">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recent.data.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-ink-500">
            No orders in this range yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-ink-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left font-semibold px-6 py-3">Customer</th>
                  <th className="text-left font-semibold px-6 py-3">Package</th>
                  <th className="text-left font-semibold px-6 py-3">Status</th>
                  <th className="text-right font-semibold px-6 py-3">Revenue</th>
                  <th className="text-right font-semibold px-6 py-3">Commission</th>
                  <th className="text-right font-semibold px-6 py-3">When</th>
                </tr>
              </thead>
              <tbody>
                {recent.data.map(o => (
                  <tr key={o.id} className="border-t border-ink-100">
                    <td className="px-6 py-3 font-medium text-ink-900">{o.email}</td>
                    <td className="px-6 py-3 text-ink-700">
                      {o.package.country || '—'} · {o.package.data || '—'}
                      <span className="text-ink-400"> · {o.package.validity}d</span>
                    </td>
                    <td className="px-6 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-6 py-3 text-right font-semibold">
                      {fmtMoney(o.retailPrice, o.currency)}
                    </td>
                    <td className="px-6 py-3 text-right font-semibold text-emerald-600">
                      {fmtMoney(o.commission, o.currency)}
                    </td>
                    <td className="px-6 py-3 text-right text-ink-500 whitespace-nowrap">
                      {fmtRelative(o.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

interface TileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
  accent: 'ink' | 'brand' | 'emerald';
}
const Tile: React.FC<TileProps> = ({ icon, label, value, hint, accent }) => {
  const ring = accent === 'brand'
    ? 'bg-brand-50 text-brand-700'
    : accent === 'emerald'
      ? 'bg-emerald-50 text-emerald-700'
      : 'bg-ink-50 text-ink-700';
  return (
    <div className="bg-white rounded-3xl border border-ink-100 shadow-soft p-5">
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider ${ring}`}>
          {icon}{label}
        </span>
      </div>
      <div className="text-3xl font-extrabold tracking-tight">{value}</div>
      {hint ? <div className="text-xs text-ink-400 mt-1">{hint}</div> : null}
    </div>
  );
};

interface AlertTileProps {
  icon: React.ReactNode;
  tone: 'amber' | 'red';
  label: string;
  value: number;
  hint: string;
}
const AlertTile: React.FC<AlertTileProps> = ({ icon, tone, label, value, hint }) => {
  const styles = tone === 'amber'
    ? 'bg-amber-50 border-amber-200 text-amber-900'
    : 'bg-red-50 border-red-200 text-red-900';
  return (
    <div className={`rounded-3xl border p-5 ${styles}`}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1">
        {icon}{label}
      </div>
      <div className="text-2xl font-extrabold">{value.toLocaleString()}</div>
      <div className="text-xs mt-1 opacity-80">{hint}</div>
    </div>
  );
};
