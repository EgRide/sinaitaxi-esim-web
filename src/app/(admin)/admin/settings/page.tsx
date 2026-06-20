// Pricing settings — commission % + minimum commission floor.
// Server-fetches current values, hands them to a client form
// that uses a useActionState server action.
import { redirect } from 'next/navigation';
import { Calculator, Coins, Percent } from 'lucide-react';
import { adminApi } from '@/lib/admin';
import { SettingsForm } from './SettingsForm';

export const metadata = { title: 'Pricing · Team' };

export default async function SettingsPage() {
  const settings = await adminApi.settings();
  if (!settings) redirect('/admin/login');

  return (
    <div className="px-4 sm:px-8 py-8 max-w-3xl mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Calculator className="h-7 w-7 text-brand-500" />
          Pricing
        </h1>
        <p className="text-ink-500 text-sm mt-1">
          Controls the commission applied to every package and
          top-up. Changes propagate within 30 seconds.
        </p>
      </header>

      <div className="bg-white rounded-3xl border border-ink-100 shadow-soft p-6 sm:p-8">
        <SettingsForm
          initial={{
            commissionPct: settings.commissionPct,
            minCommissionEur: settings.minCommissionEur,
          }}
          usdToEur={settings.usdToEur}
          displayCurrency={settings.displayCurrency}
        />
      </div>

      <section className="mt-6 grid sm:grid-cols-2 gap-4">
        <InfoCard
          icon={<Percent className="h-4 w-4" />}
          label="How commission works"
          body="Applied as a percentage of the wholesale price (after USD → EUR). E.g. a €10 wholesale package with 30% commission earns €3 unless the minimum kicks in."
        />
        <InfoCard
          icon={<Coins className="h-4 w-4" />}
          label="Why the minimum floor"
          body={`Tiny wholesale packages (€1–2) would yield too little commission to be worth fulfilling. The minimum guarantees a baseline margin per order.`}
        />
      </section>
    </div>
  );
}

const InfoCard: React.FC<{ icon: React.ReactNode; label: string; body: string }> = ({ icon, label, body }) => (
  <div className="bg-white rounded-3xl border border-ink-100 p-5">
    <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold uppercase tracking-wider text-ink-500">
      {icon}{label}
    </div>
    <p className="text-sm text-ink-700 leading-relaxed">{body}</p>
  </div>
);
