import type { Metadata } from 'next';
import Link from 'next/link';
import { Bell, Globe, Shield, Smartphone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your Sinai Taxi account preferences.',
};

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-sm text-ink-500">Preferences and account controls.</p>
      </header>

      {/* Account is managed via the main Sinai Taxi app — the web
          surface intentionally only handles preferences. */}
      <section className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
        <Smartphone className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900">
          <strong className="font-bold block mb-1">Profile editing lives in the mobile app.</strong>
          To change your name, phone number, password or notification preferences, open the Sinai Taxi app and go to{' '}
          <span className="font-semibold">Profile → Personal info</span>. Changes sync back here on next sign-in.
        </div>
      </section>

      {/* Read-only preferences */}
      <section className="bg-white rounded-3xl border border-ink-100 shadow-soft divide-y divide-ink-100">
        <SettingRow
          icon={<Bell className="h-4 w-4" />}
          label="Email receipts"
          value="Always sent for purchases"
          hint="Receipts go to the email on your account. Update via the mobile app."
        />
        <SettingRow
          icon={<Globe className="h-4 w-4" />}
          label="Currency"
          value="EUR"
          hint="All eSIM pricing is shown and charged in euros."
        />
        <SettingRow
          icon={<Shield className="h-4 w-4" />}
          label="Payment security"
          value="Stripe — PCI-DSS Level 1"
          hint="Card details are processed by Stripe. Sinai Taxi never sees or stores card numbers."
        />
      </section>

      {/* Legal footer */}
      <section className="mt-6 pt-6 border-t border-ink-100 grid sm:grid-cols-3 gap-3 text-xs">
        <Link href="/privacy" className="text-ink-600 hover:text-ink-900 font-medium">Privacy policy</Link>
        <Link href="/terms" className="text-ink-600 hover:text-ink-900 font-medium">Terms of service</Link>
        <a href="mailto:sales@sinaitaxi.com" className="text-ink-600 hover:text-ink-900 font-medium">Contact support</a>
      </section>
    </div>
  );
}

const SettingRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}> = ({ icon, label, value, hint }) => (
  <div className="flex items-start gap-3 p-5">
    <span className="grid place-items-center w-9 h-9 rounded-2xl bg-ink-50 text-ink-700 flex-shrink-0">
      {icon}
    </span>
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline justify-between gap-2 flex-wrap">
        <span className="font-bold text-sm text-ink-900">{label}</span>
        <span className="text-sm font-medium text-ink-700">{value}</span>
      </div>
      <p className="text-xs text-ink-500 mt-1">{hint}</p>
    </div>
  </div>
);
