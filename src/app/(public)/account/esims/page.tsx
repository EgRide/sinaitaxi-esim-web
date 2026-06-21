import type { Metadata } from 'next';
import Link from 'next/link';
import { Smartphone, ArrowRight, Clock, CheckCircle2, XCircle, Ban, Plus, PlusCircle } from 'lucide-react';
import { fetchMyEsims } from '@/lib/customer-auth';

export const metadata: Metadata = {
  title: 'My eSIMs',
  description: 'Every eSIM and top-up you have purchased.',
};

type Status = 'pending' | 'fulfilled' | 'fulfillment_failed' | 'cancelled';

interface TopupSummary {
  id: string;
  status: Status;
  data: string;
  validity: number;
  createdAt: string;
  price: string;
}
interface OrderRow {
  id: string;
  status: Status;
  title: string;
  data: string;
  validity: number;
  createdAt: string;
  flag: string;
  price: string;
  topups: TopupSummary[];
}

export default async function MyEsimsPage() {
  const history = await fetchMyEsims();

  // Build rows keyed by order id so top-ups attach to the parent
  // eSIM card instead of cluttering the main list as standalone
  // "Top-up" items. Orphaned top-ups (parent not in history — rare
  // edge case after deletions) fall through to a second list at
  // the bottom of the page.
  const ordersById = new Map<string, OrderRow>();
  const orphanTopups: Array<TopupSummary & { parentOrderId: string }> = [];

  if (history) {
    for (const o of history.orders) {
      ordersById.set(o.id, {
        id: o.id,
        status: o.status,
        title: o.package.title,
        data: o.package.data,
        validity: o.package.validity,
        createdAt: o.createdAt,
        // Prefer the country the customer selected at checkout
        // — regional / global packages list many countries but the
        // shopper always navigated from one specific destination,
        // and that's what we want the flag to show. Falls back to
        // the package's first country (covers historical orders).
        flag: o.selectedCountryCode ?? o.package.countries?.[0]?.code ?? '🌍',
        price: `${o.currency} ${o.retailPrice.toFixed(2)}`,
        topups: [],
      });
    }
    for (const t of history.topups) {
      const summary: TopupSummary = {
        id: t.id,
        status: t.status,
        data: t.package.data,
        validity: t.package.validity,
        createdAt: t.createdAt,
        price: `${t.currency} ${t.retailPrice.toFixed(2)}`,
      };
      const parent = ordersById.get(t.parentOrderId);
      if (parent) parent.topups.push(summary);
      else orphanTopups.push({ ...summary, parentOrderId: t.parentOrderId });
    }
  }

  const orders = [...ordersById.values()]
    .map(o => ({ ...o, topups: o.topups.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)) }))
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const totalRows = orders.length + orphanTopups.length;

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My eSIMs</h2>
          <p className="text-sm text-ink-500">
            {totalRows === 0
              ? 'No purchases yet.'
              : `${orders.length} eSIM${orders.length === 1 ? '' : 's'}${
                  orders.some(o => o.topups.length > 0) ? ' · top-ups grouped under each' : ''
                }`}
          </p>
        </div>
        <Link
          href="/"
          className="hidden sm:inline-flex btn-secondary !text-xs !py-2 !px-3">
          <Plus className="h-4 w-4" /> New eSIM
        </Link>
      </header>

      {totalRows === 0 ? (
        <div className="bg-white rounded-3xl border border-ink-100 p-10 text-center">
          <div className="grid place-items-center w-14 h-14 rounded-2xl bg-ink-50 mx-auto mb-4">
            <Smartphone className="h-6 w-6 text-ink-500" />
          </div>
          <h3 className="text-lg font-bold tracking-tight">No eSIMs yet</h3>
          <p className="text-sm text-ink-500 mt-1 mb-5">
            Buy your first travel eSIM and it will show up here.
          </p>
          <Link href="/" className="btn-primary !text-sm">
            Browse destinations <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map(o => (
            <li key={`order-${o.id}`}>
              <Link
                href={`/orders/${o.id}`}
                className="block bg-white rounded-3xl border border-ink-100 p-4 sm:p-5 hover:border-brand-200 hover:shadow-soft transition">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="grid place-items-center w-12 h-12 rounded-2xl bg-ink-50 text-2xl flex-shrink-0">
                    {o.flag.length === 2 ? flagEmoji(o.flag) : '🌍'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm sm:text-base truncate">{o.title}</div>
                    <div className="text-xs text-ink-500 mt-0.5">
                      {o.data} · {o.validity} days · {fmtDate(o.createdAt)}
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <StatusBadge status={o.status} />
                      {o.topups.length > 0 ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-brand-50 text-brand-700 border-brand-200">
                          <PlusCircle className="h-3 w-3" />
                          {o.topups.length} top-up{o.topups.length === 1 ? '' : 's'}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold">{o.price}</div>
                    <div className="text-xs text-brand-600 font-semibold mt-1 inline-flex items-center gap-0.5">
                      Open <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>

                {/* Nested top-ups summary. Mounted inside the same
                    Link so tapping anywhere on the card opens the
                    parent eSIM (where each top-up's details and
                    install info live). */}
                {o.topups.length > 0 ? (
                  <div className="mt-3 pt-3 border-t border-ink-100 space-y-1.5">
                    {o.topups.map(t => (
                      <div key={t.id} className="flex items-center gap-2 text-xs">
                        <PlusCircle className="h-3.5 w-3.5 text-brand-500 flex-shrink-0" />
                        <span className="font-semibold text-ink-700 truncate">
                          {t.data} · {t.validity} days
                        </span>
                        <span className="text-ink-400">·</span>
                        <span className="text-ink-500">{fmtDate(t.createdAt)}</span>
                        <span className="ml-auto text-ink-600 font-semibold">{t.price}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </Link>
            </li>
          ))}

          {/* Edge case: top-ups whose parent order isn't in the
              fetched history. Render them as standalone rows so
              they aren't lost. */}
          {orphanTopups.map(t => (
            <li key={`orphan-${t.id}`}>
              <Link
                href={`/topups/${t.id}`}
                className="block bg-white rounded-3xl border border-ink-100 p-4 sm:p-5 hover:border-brand-200 hover:shadow-soft transition">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="grid place-items-center w-12 h-12 rounded-2xl bg-brand-50 text-2xl flex-shrink-0">
                    <PlusCircle className="h-6 w-6 text-brand-600" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm sm:text-base truncate">
                      Top-up · {t.data}
                    </div>
                    <div className="text-xs text-ink-500 mt-0.5">
                      {t.validity} days · {fmtDate(t.createdAt)}
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold">{t.price}</div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const map = {
    fulfilled:           { label: 'Active',    icon: <CheckCircle2 className="h-3 w-3" />, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    pending:             { label: 'Pending',   icon: <Clock className="h-3 w-3" />,        cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    fulfillment_failed:  { label: 'Failed',    icon: <XCircle className="h-3 w-3" />,      cls: 'bg-red-50 text-red-700 border-red-200' },
    cancelled:           { label: 'Expired',   icon: <Ban className="h-3 w-3" />,          cls: 'bg-ink-50 text-ink-500 border-ink-200' },
  } as const;
  const m = map[status];
  return (
    <span className={`inline-flex items-center gap-1 mt-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${m.cls}`}>
      {m.icon}{m.label}
    </span>
  );
};

const flagEmoji = (code: string): string => {
  if (!code || code.length !== 2) return '🌍';
  const A = 0x1F1E6;
  return String.fromCodePoint(A + code.charCodeAt(0) - 65, A + code.charCodeAt(1) - 65);
};

const fmtDate = (iso: string): string => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
