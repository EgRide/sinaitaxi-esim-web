'use client';

// Pricing form with a live worked-example. Backend stores
// commissionPct as a decimal (0.30); we surface it as a
// percentage (30) for the user, then convert on submit.
import { useActionState, useState } from 'react';
import { Check, Percent, Euro } from 'lucide-react';
import { updateSettingsAction, type SettingsState } from '@/lib/admin-settings-action';

interface Props {
  initial: { commissionPct: number; minCommissionEur: number };
  usdToEur: number;
  displayCurrency: string;
}

const initialState: SettingsState = {};

export const SettingsForm: React.FC<Props> = ({ initial, usdToEur, displayCurrency }) => {
  const [state, action, pending] = useActionState(updateSettingsAction, initialState);
  // Form is uncontrolled, but we mirror the inputs to drive the
  // worked example. The action reads from FormData directly.
  const [pctInput, setPctInput] = useState((initial.commissionPct * 100).toFixed(2).replace(/\.?0+$/, ''));
  const [minInput, setMinInput] = useState(initial.minCommissionEur.toFixed(2).replace(/\.?0+$/, ''));

  const pct = Number(pctInput) || 0;
  const min = Number(minInput) || 0;
  const sample = computeExamples([1, 5, 10, 30], pct / 100, min, usdToEur);

  return (
    <form action={action} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          label="Commission percentage"
          name="commissionPct"
          icon={<Percent className="h-4 w-4 text-ink-400" />}
          suffix="%"
          value={pctInput}
          onChange={setPctInput}
          step="0.1"
          min={0}
          max={200}
          hint="Applied to wholesale (in EUR). Try 30."
        />
        <Field
          label={`Minimum commission (${displayCurrency})`}
          name="minCommissionEur"
          icon={<Euro className="h-4 w-4 text-ink-400" />}
          suffix={displayCurrency}
          value={minInput}
          onChange={setMinInput}
          step="0.5"
          min={0}
          max={100}
          hint="Floor for low-wholesale packages. Try 5."
        />
      </div>

      {/* Worked example */}
      <div className="rounded-2xl border border-ink-100 bg-ink-50/50 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            Worked example
          </span>
          <span className="text-[11px] text-ink-400 font-mono">
            USD → {displayCurrency} @ {usdToEur.toFixed(4)}
          </span>
        </div>
        <table className="w-full text-sm">
          <thead className="text-[11px] uppercase tracking-wider text-ink-400">
            <tr>
              <th className="text-left font-semibold py-1">Wholesale</th>
              <th className="text-right font-semibold py-1">Wholesale ({displayCurrency})</th>
              <th className="text-right font-semibold py-1">Commission</th>
              <th className="text-right font-semibold py-1">Retail</th>
              <th className="text-right font-semibold py-1">Margin</th>
            </tr>
          </thead>
          <tbody>
            {sample.map(r => (
              <tr key={r.wholesaleUsd} className="border-t border-ink-100">
                <td className="py-2 font-mono text-xs">${r.wholesaleUsd.toFixed(2)}</td>
                <td className="py-2 text-right text-ink-500">€{r.wholesaleEur.toFixed(2)}</td>
                <td className={`py-2 text-right font-semibold ${r.flooredBy === 'min' ? 'text-amber-600' : 'text-emerald-700'}`}>
                  €{r.commission.toFixed(2)}
                  {r.flooredBy === 'min' ? <span className="ml-1 text-[10px] uppercase">min</span> : null}
                </td>
                <td className="py-2 text-right font-bold">€{r.retail.toFixed(2)}</td>
                <td className="py-2 text-right text-ink-500">{r.marginPct.toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {state?.error ? (
        <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}
      {state?.ok ? (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800 inline-flex items-center gap-2">
          <Check className="h-4 w-4" />
          Saved. New pricing applies on the next package fetch (within 30s).
        </div>
      ) : null}

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-2xl bg-ink-900 text-white font-semibold px-5 py-3 hover:bg-ink-800 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-wait">
          {pending ? 'Saving…' : 'Save pricing'}
        </button>
      </div>
    </form>
  );
};

interface FieldProps {
  label: string;
  name: string;
  icon: React.ReactNode;
  suffix: string;
  value: string;
  onChange: (v: string) => void;
  step?: string;
  min?: number;
  max?: number;
  hint: string;
}
const Field: React.FC<FieldProps> = ({ label, name, icon, suffix, value, onChange, step, min, max, hint }) => (
  <label className="block">
    <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</span>
    <div className="mt-1.5 relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2">{icon}</span>
      <input
        type="number"
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        step={step}
        min={min}
        max={max}
        required
        className="w-full rounded-2xl border border-ink-200 bg-white pl-10 pr-14 py-3 text-base font-bold outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink-400">
        {suffix}
      </span>
    </div>
    <p className="mt-1.5 text-xs text-ink-500">{hint}</p>
  </label>
);

interface SampleRow {
  wholesaleUsd: number;
  wholesaleEur: number;
  commission: number;
  retail: number;
  marginPct: number;
  flooredBy: 'pct' | 'min';
}
const computeExamples = (
  prices: number[],
  pct: number,
  min: number,
  usdToEur: number,
): SampleRow[] => prices.map(wholesaleUsd => {
  const wholesaleEur = wholesaleUsd * usdToEur;
  const pctCommission = wholesaleEur * pct;
  const commission = Math.max(pctCommission, min);
  const retail = wholesaleEur + commission;
  return {
    wholesaleUsd,
    wholesaleEur,
    commission,
    retail,
    marginPct: wholesaleEur > 0 ? (commission / wholesaleEur) * 100 : 0,
    flooredBy: pctCommission >= min ? 'pct' : 'min',
  };
});
