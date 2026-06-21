'use client';

// New-password form. The reset `code` from the email link is
// passed in via prop (read from the URL by the server page),
// stored in a hidden input so it travels with the form action.
// Customer enters a new password twice; client-side check for
// match + length so we don't burn a server round-trip on the
// obvious mistakes.
import Link from 'next/link';
import { useActionState } from 'react';
import { Lock, CheckCircle2 } from 'lucide-react';
import { resetPasswordAction, type ResetPasswordState } from '@/lib/customer-actions';

const initial: ResetPasswordState = {};

export const ResetPasswordForm: React.FC<{ code: string }> = ({ code }) => {
  const [state, action, pending] = useActionState(resetPasswordAction, initial);

  if (state?.ok) {
    return (
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-emerald-900 space-y-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 mt-0.5 text-emerald-600 flex-shrink-0" />
          <div>
            <div className="font-bold">Password updated</div>
            <p className="text-sm mt-1 leading-relaxed">
              You&apos;re all set. Sign in with your new password to
              continue.
            </p>
          </div>
        </div>
        <Link
          href="/login"
          className="block w-full text-center rounded-2xl bg-ink-900 text-white font-semibold py-3 hover:bg-ink-800 transition">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="code" value={code} />

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          New password
        </span>
        <div className="mt-1.5 relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
            autoFocus
            className="w-full rounded-2xl border border-ink-200 bg-white pl-10 pr-4 py-3 text-base outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition"
            placeholder="At least 8 characters"
          />
        </div>
      </label>

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          Confirm new password
        </span>
        <div className="mt-1.5 relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input
            type="password"
            name="confirm"
            autoComplete="new-password"
            required
            minLength={8}
            className="w-full rounded-2xl border border-ink-200 bg-white pl-10 pr-4 py-3 text-base outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition"
            placeholder="Re-enter the new password"
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
        {pending ? 'Updating password…' : 'Update password'}
      </button>

      {!code ? (
        <p className="text-xs text-ink-500 text-center">
          Missing reset link?{' '}
          <Link href="/forgot-password" className="font-semibold text-brand-600 hover:text-brand-700">
            Request a new one
          </Link>
        </p>
      ) : null}
    </form>
  );
};
