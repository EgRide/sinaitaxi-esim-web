// Full orders table. Server-rendered; filters drive a new fetch
// via search params, so the URL is shareable.
import { redirect } from 'next/navigation';
import { adminApi, type AdminStats } from '@/lib/admin';
import { RangeTabs } from '../RangeTabs';
import { StatusBadge } from '../StatusBadge';
import { StatusTabs } from './StatusTabs';
import { fmtDateTime, fmtMoney } from '../format';

type RangeKey = AdminStats['range'];
type StatusKey = 'all' | 'pending' | 'fulfilled' | 'fulfillment_failed';

const isRange = (v: string | undefined): v is RangeKey =>
  v === 'today' || v === '7d' || v === '30d' || v === 'all';
const isStatus = (v: string | undefined): v is StatusKey =>
  v === 'all' || v === 'pending' || v === 'fulfilled' || v === 'fulfillment_failed';

export const metadata = { title: 'Orders · Team' };

export default async function OrdersPage({
  searchParams,
}: { searchParams: Promise<{ range?: string; status?: string }> }) {
  const sp = await searchParams;
  const range: RangeKey = isRange(sp.range) ? sp.range : '30d';
  const status: StatusKey = isStatus(sp.status) ? sp.status : 'all';

  const res = await adminApi.orders(range, status, 200);
  if (!res) redirect('/admin/login');

  return (
    <div className="px-4 sm:px-8 py-8 max-w-7xl mx-auto w-full">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Orders</h1>
          <p className="text-ink-500 text-sm mt-1">
            Showing {res.data.length} orders · prices in {res.currency}
          </p>
        </div>
        <RangeTabs current={range} basePath="/admin/orders" />
      </header>

      <div className="mb-6">
        <StatusTabs current={status} />
      </div>

      <div className="bg-white rounded-3xl border border-ink-100 shadow-soft overflow-hidden">
        {res.data.length === 0 ? (
          <div className="px-6 py-20 text-center text-sm text-ink-500">
            No orders match these filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-ink-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left font-semibold px-6 py-3">Order</th>
                  <th className="text-left font-semibold px-6 py-3">Customer</th>
                  <th className="text-left font-semibold px-6 py-3">Package</th>
                  <th className="text-left font-semibold px-6 py-3">Status</th>
                  <th className="text-right font-semibold px-6 py-3">Revenue</th>
                  <th className="text-right font-semibold px-6 py-3">Wholesale</th>
                  <th className="text-right font-semibold px-6 py-3">Commission</th>
                  <th className="text-right font-semibold px-6 py-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {res.data.map(o => (
                  <tr key={o.id} className="border-t border-ink-100 hover:bg-ink-50/50 transition">
                    <td className="px-6 py-3 font-mono text-xs text-ink-500">{o.id.slice(0, 10)}…</td>
                    <td className="px-6 py-3 font-medium text-ink-900">{o.email}</td>
                    <td className="px-6 py-3 text-ink-700">
                      {o.package.country || '—'} · {o.package.data || '—'}
                      <span className="text-ink-400"> · {o.package.validity}d</span>
                      {o.quantity > 1 ? <span className="ml-1 text-ink-400">×{o.quantity}</span> : null}
                    </td>
                    <td className="px-6 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-6 py-3 text-right font-semibold">
                      {fmtMoney(o.retailPrice, o.currency)}
                    </td>
                    <td className="px-6 py-3 text-right text-ink-500">
                      ${o.wholesalePriceUsd.toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-right font-semibold text-emerald-600">
                      {fmtMoney(o.commission, o.currency)}
                    </td>
                    <td className="px-6 py-3 text-right text-ink-500 whitespace-nowrap">
                      {fmtDateTime(o.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
