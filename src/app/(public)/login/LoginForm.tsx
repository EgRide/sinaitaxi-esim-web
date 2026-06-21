'use client';

import { useActionState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { loginAction, type LoginState } from '@/lib/customer-actions';

const initial: LoginState = {};

export const LoginForm: React.FC<{ next: string }> = ({ next }) => {
  const [state, action, pending] = useActionState(loginAction, initial);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          Email
        </span>
        <div className="mt-1.5 relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input
            type="email"
            name="email"
            autoComplete="username"
            required
            autoFocus
            className="w-full rounded-2xl border border-ink-200 bg-white pl-10 pr-4 py-3 text-base outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition"
            placeholder="you@example.com"
          />
        </div>
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
            autoComplete="current-password"
            required
            className="w-full rounded-2xl border border-ink-200 bg-white pl-10 pr-4 py-3 text-base outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition"
            placeholder="•••••••••"
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
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
};
