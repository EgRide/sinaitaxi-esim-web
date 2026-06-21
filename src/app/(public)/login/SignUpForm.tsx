'use client';

// Mirror of LoginForm for sinaitaxi /signup. Same styling so the
// tab swap inside CustomerLoginPage feels seamless, and same
// useActionState pattern so server-side validation errors land on
// the same inline panel. We collect first name, last name, email,
// phone number and password — country defaults on the PHP side.
import { useActionState } from 'react';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { registerAction, type RegisterState } from '@/lib/customer-actions';

const initial: RegisterState = {};

export const SignUpForm: React.FC<{ next: string }> = ({ next }) => {
  const [state, action, pending] = useActionState(registerAction, initial);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />

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
          Phone number
        </span>
        <div className="mt-1.5 relative">
          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input
            type="tel"
            name="phoneNumber"
            autoComplete="tel"
            inputMode="tel"
            required
            className="w-full rounded-2xl border border-ink-200 bg-white pl-10 pr-4 py-3 text-base outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition"
            placeholder="+44 7700 900123"
          />
        </div>
        <span className="text-[11px] text-ink-400 mt-1 block">
          Include the country code (e.g. +44, +20, +1).
        </span>
      </label>

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
