'use client';

// Sign-up form that talks to sinaitaxi PHP /register through our
// /v1/customer/register proxy. Field list matches the RegisterRequest
// schema in the OpenAPI doc:
//   first_name, last_name, email, password, password_confirmation
//   phone_number_country_code + phone_number
//   whatsapp_number_country_code + whatsapp_number (auto-mirrored from phone)
//   country_code   (ISO alpha-2 — PHP resolves country_id from this)
//   [gender]       optional, omitted from this form (lifestyle CTA)
//   [birth_date]   optional, omitted from this form (we ask later)
import { useActionState, useMemo, useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { registerAction, type RegisterState } from '@/lib/customer-actions';
import { COUNTRIES, COUNTRIES_BY_CODE } from '@/data/countries';

const initial: RegisterState = {};
const DEFAULT_COUNTRY = 'EG';

export const SignUpForm: React.FC<{ next: string }> = ({ next }) => {
  const [state, action, pending] = useActionState(registerAction, initial);
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY);
  const [waSameAsPhone, setWaSameAsPhone] = useState(true);

  // The dial code defaults to the selected country's dialling
  // prefix; user can override (e.g. Egyptian customer with a UK SIM).
  const defaultDial = useMemo(
    () => COUNTRIES_BY_CODE[countryCode]?.dial ?? '20',
    [countryCode],
  );

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <input type="hidden" name="countryCode" value={countryCode} />

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            First name
          </span>
          <div className="mt-1.5 relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              type="text"
              name="firstName"
              autoComplete="given-name"
              required
              autoFocus
              className="w-full rounded-2xl border border-ink-200 bg-white pl-10 pr-3 py-3 text-base outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition"
              placeholder="Ahmed"
            />
          </div>
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            Last name
          </span>
          <div className="mt-1.5 relative">
            <input
              type="text"
              name="lastName"
              autoComplete="family-name"
              required
              className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition"
              placeholder="Hassan"
            />
          </div>
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          Email
        </span>
        <div className="mt-1.5 relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            className="w-full rounded-2xl border border-ink-200 bg-white pl-10 pr-4 py-3 text-base outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition"
            placeholder="you@example.com"
          />
        </div>
      </label>

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          Country
        </span>
        <select
          value={countryCode}
          onChange={e => setCountryCode(e.target.value)}
          className="mt-1.5 w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition appearance-none"
          required>
          {COUNTRIES.map(c => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          Phone number
        </span>
        <div className="mt-1.5 flex gap-2">
          <div className="relative flex-shrink-0">
            <input
              type="text"
              name="phoneCountryCode"
              defaultValue={defaultDial}
              key={defaultDial /* re-mount when country changes so the input value resets */}
              required
              inputMode="numeric"
              pattern="\d{1,4}"
              className="w-20 rounded-2xl border border-ink-200 bg-white pl-7 pr-2 py-3 text-base outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition text-center font-mono"
              aria-label="Country dial code"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">+</span>
          </div>
          <input
            type="tel"
            name="phoneNumber"
            autoComplete="tel-national"
            inputMode="tel"
            required
            className="flex-1 rounded-2xl border border-ink-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition"
            placeholder="1234567890"
          />
        </div>
      </label>

      <label className="flex items-center gap-2 text-xs text-ink-600">
        <input
          type="checkbox"
          checked={waSameAsPhone}
          onChange={e => setWaSameAsPhone(e.target.checked)}
          className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
        />
        WhatsApp is the same as my phone number
      </label>

      {!waSameAsPhone ? (
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            WhatsApp number
          </span>
          <div className="mt-1.5 flex gap-2">
            <div className="relative flex-shrink-0">
              <input
                type="text"
                name="whatsappCountryCode"
                defaultValue={defaultDial}
                key={`wa-${defaultDial}`}
                required
                inputMode="numeric"
                pattern="\d{1,4}"
                className="w-20 rounded-2xl border border-ink-200 bg-white pl-7 pr-2 py-3 text-base outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition text-center font-mono"
                aria-label="WhatsApp country dial code"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">+</span>
            </div>
            <input
              type="tel"
              name="whatsappNumber"
              inputMode="tel"
              required
              className="flex-1 rounded-2xl border border-ink-200 bg-white px-4 py-3 text-base outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition"
              placeholder="1234567890"
            />
          </div>
        </label>
      ) : (
        // Mirror inputs so the action receives the same values without
        // showing the WA fields in the UI. The hidden inputs are
        // rendered on every submit so the server action gets them.
        <input type="hidden" name="whatsappSameAsPhone" value="1" />
      )}

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          Password
        </span>
        <div className="mt-1.5 relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="w-full rounded-2xl border border-ink-200 bg-white pl-10 pr-4 py-3 text-base outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition"
            placeholder="At least 8 characters"
          />
        </div>
      </label>

      {state?.error ? (
        <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-ink-900 text-white font-semibold py-3 hover:bg-ink-800 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-wait">
        {pending ? 'Creating your account…' : 'Create account'}
      </button>

      <p className="text-[11px] text-ink-500 leading-relaxed">
        By creating an account you agree to the{' '}
        <a href="/terms" className="font-semibold text-ink-700 hover:text-ink-900 underline-offset-2 hover:underline">Terms</a>{' '}
        and{' '}
        <a href="/privacy" className="font-semibold text-ink-700 hover:text-ink-900 underline-offset-2 hover:underline">Privacy Policy</a>.
        We share auth with the Sinai Taxi rides product — one login for both.
      </p>
    </form>
  );
};
