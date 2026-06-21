import type { Metadata } from 'next';
import Link from 'next/link';
import { Smartphone, ArrowRight, Clock, CheckCircle2, XCircle, Ban, Plus } from 'lucide-react';
import { fetchMyEsims } from '@/lib/customer-auth';

export const metadata: Metadata = {
  title: 'My eSIMs',
  description: 'Every eSIM and top-up you have purchased.',
};

type Status = 'pending' | 'fulfilled' | 'fulfillment_failed' | 'cancelled';

export default async function MyEsimsPage() {
  const history = await fetchMyEsims();
  const rows: Array<
    | { kind: 'order'; id: string; status: Status; title: string; data: string; validity: number; createdAt: string; flag: string; price: string }
    | { kind: 'topup'; id: string; parentOrderId: string; status: Status; title: string; data: string; validity: number; createdAt: string; price: string }
  > = [];

  if (history) {
    for (const o of history.orders) {
      rows.push({
        kind: 'order',
        id: o.id,
        status: o.status,
        title: o.package.title,
        data: o.package.data,
        validity: o.package.validity,
        createdAt: o.createdAt,
        flag: o.package.countries?.[0]?.code ?? '🌍',
        price: `${o.currency} ${o.retailPrice.toFixed(2)}`,
      });
    }
    for (const t of history.topups) {
      rows.push({
        kind: 'topup',
        id: t.id,
        parentOrderId: t.parentOrderId,
        status: t.status,
        title: t.package.title || 'Top-up',
        data: t.package.data,
        validity: t.package.validity,
        createdAt: t.createdAt,
        price: `${t.currency} ${t.retailPrice.toFixed(2)}`,
      });
    }
    rows.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My eSIMs</h2>
          <p className="text-sm text-ink-500">
            {rows.length === 0 ? 'No purchases yet.' : `${rows.length} purchase${rows.length === 1 ? '' : 's'} in total.`}
          </p>
        </div>
        <Link
          href="/"
          className="hidden sm:inline-flex btn-secondary !text-xs !py-2 !px-3">
          <Plus className="h-4 w-4" /> New eSIM
        </Link>
      </header>

      {rows.length === 0 ? (
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
          {rows.map(r => {
            const href = r.kind === 'order' ? `/orders/${r.id}` : `/topups/${r.id}`;
            return (
              <li key={`${r.kind}-${r.id}`}>
                <Link
                  href={href}
                  className="block bg-white rounded-3xl border border-ink-100 p-4 sm:p-5 hover:border-brand-200 hover:shadow-soft transition">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="grid place-items-center w-12 h-12 rounded-2xl bg-ink-50 text-2xl flex-shrink-0">
                      {r.kind === 'order' && r.flag.length === 2 ? flagEmoji(r.flag) : r.kind === 'topup' ? '+' : '🌍'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm sm:text-base truncate">
                        {r.kind === 'topup' ? `Top-up · ${r.title}` : r.title}
                      </div>
                      <div className="text-xs text-ink-500 mt-0.5">
                        {r.data} · {r.validity} days · {fmtDate(r.createdAt)}
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold">{r.price}</div>
                      <div className="text-xs text-brand-600 font-semibold mt-1 inline-flex items-center gap-0.5">
                        Open <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
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
