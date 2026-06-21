import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, Globe, ArrowRight, Smartphone } from 'lucide-react';
import { customerUser, fetchMyEsims } from '@/lib/customer-auth';

export const metadata: Metadata = {
  title: 'Account',
  description: 'Your Sinai Taxi account.',
};

export default async function AccountPage() {
  const user = await customerUser();
  const history = await fetchMyEsims();
  const orderCount = history?.orders.length ?? 0;
  const activeCount = history?.orders.filter(o => o.status === 'fulfilled').length ?? 0;

  return (
    <div className="space-y-6">
      {/* Quick stats */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4">
        <StatTile label="eSIMs purchased" value={orderCount} />
        <StatTile label="Active eSIMs" value={activeCount} accent />
      </section>

      {/* Profile */}
      <section className="bg-white rounded-3xl border border-ink-100 shadow-soft p-6">
        <h2 className="text-lg font-bold tracking-tight mb-4">Personal information</h2>
        <dl className="grid sm:grid-cols-2 gap-4">
          <Field icon={<Mail className="h-4 w-4" />} label="Email" value={user?.email ?? '—'} />
          <Field icon={<Phone className="h-4 w-4" />} label="Phone" value={user?.phoneNumber ?? '—'} />
          <Field icon={<Globe className="h-4 w-4" />} label="Country" value={user?.countryCode ? `Country ID ${user.countryCode}` : '—'} />
        </dl>
        <p className="mt-5 text-xs text-ink-500">
          Account details are managed via the Sinai Taxi mobile app or sinaitaxi.com. Changes there will reflect here on next sign-in.
        </p>
      </section>

      {/* eSIMs quick view */}
      <section className="bg-white rounded-3xl border border-ink-100 shadow-soft p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold tracking-tight">Recent eSIMs</h2>
          <Link
            href="/account/esims"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {history && history.orders.length > 0 ? (
          <ul className="space-y-3">
            {history.orders.slice(0, 3).map(o => (
              <li key={o.id} className="flex items-center gap-3 p-3 rounded-2xl border border-ink-100">
                <span className="grid place-items-center w-10 h-10 rounded-2xl bg-ink-50 text-xl">
                  {o.package.countries?.[0]?.code ? flag(o.package.countries[0].code) : '🌍'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{o.package.title}</div>
                  <div className="text-xs text-ink-500">
                    {o.package.data} · {o.package.validity} days · {fmtDate(o.createdAt)}
                  </div>
                </div>
                <Link
                  href={`/orders/${o.id}`}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                  Open →
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10">
            <div className="grid place-items-center w-12 h-12 rounded-2xl bg-ink-50 mx-auto mb-3">
              <Smartphone className="h-5 w-5 text-ink-500" />
            </div>
            <p className="text-sm text-ink-500">No eSIMs yet.</p>
            <Link href="/" className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-brand-600 hover:text-brand-700">
              Pick a destination <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

const StatTile: React.FC<{ label: string; value: number; accent?: boolean }> = ({ label, value, accent }) => (
  <div className={`rounded-3xl border p-5 ${accent ? 'bg-gradient-to-br from-brand-500 to-brand-700 text-white border-brand-700' : 'bg-white border-ink-100'}`}>
    <div className={`text-xs uppercase tracking-wider font-semibold ${accent ? 'text-white/80' : 'text-ink-500'}`}>{label}</div>
    <div className={`text-3xl font-extrabold mt-1 ${accent ? 'text-white' : 'text-ink-900'}`}>{value}</div>
  </div>
);

const Field: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div>
    <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-ink-500 mb-1">
      {icon}{label}
    </div>
    <div className="font-medium text-ink-900 truncate">{value}</div>
  </div>
);

const flag = (code: string): string => {
  if (!code || code.length !== 2) return '🌍';
  const A = 0x1F1E6;
  return String.fromCodePoint(A + code.charCodeAt(0) - 65, A + code.charCodeAt(1) - 65);
};

const fmtDate = (iso: string): string => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
