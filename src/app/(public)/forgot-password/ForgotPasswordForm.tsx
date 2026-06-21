'use client';

// Single-field form: customer types their email, we POST through
// our /v1/customer/forget-password proxy to sinaitaxi PHP, then
// flip the surface to a "Check your inbox" confirmation. The
// success state is shown unconditionally on a 200 response —
// PHP returns the same envelope whether the account exists or
// not (to avoid user enumeration) so we mirror that.
import Link from 'next/link';
import { useActionState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { forgetPasswordAction, type ForgetPasswordState } from '@/lib/customer-actions';

const initial: ForgetPasswordState = {};

export const ForgotPasswordForm: React.FC = () => {
  const [state, action, pending] = useActionState(forgetPasswordAction, initial);

  if (state?.sent) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-emerald-900">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 mt-0.5 text-emerald-600 flex-shrink-0" />
            <div>
              <div className="font-bold">Check your inbox</div>
              <p className="text-sm mt-1 leading-relaxed">
                {state.email ? (
                  <>If an account exists for <strong>{state.email}</strong>, we&apos;ve sent a link
                  to reset your password.</>
                ) : (
                  <>We&apos;ve sent you a link to reset your password if an account exists for that email.</>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Set expectations about the cross-domain link. Sinai Taxi
            uses one account across the eSIM site, the rides
            website, and the mobile app, so the reset page lives on
            sinaitaxi.com. Mentioning it up-front prevents the
            customer from worrying when the link in the email takes
            them off-brand. */}
        <div className="rounded-2xl border border-ink-100 bg-white p-5 text-ink-700">
          <h3 className="text-sm font-bold text-ink-900 mb-1">What happens next</h3>
          <ol className="text-xs leading-relaxed space-y-1.5 list-decimal pl-4">
            <li>Click the link in the email we just sent you.</li>
            <li>
              You&apos;ll land on the Sinai Taxi reset page (at{' '}
              <span className="font-mono text-ink-900">sinaitaxi.com</span>) — same account
              you use here.
            </li>
            <li>Choose a new password and confirm.</li>
            <li>
              Come back to{' '}
              <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
                esim.sinaitaxi.com&nbsp;/&nbsp;sign in
              </Link>{' '}
              with the new password.
            </li>
          </ol>
        </div>

        <p className="text-xs text-ink-500">
          Don&apos;t see the email? Check your spam folder, or{' '}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="font-semibold text-brand-600 hover:text-brand-700">
            try again
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
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
            autoFocus
            className="w-full rounded-2xl border border-ink-200 bg-white pl-10 pr-4 py-3 text-base outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition"
            placeholder="you@example.com"
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
        {pending ? 'Sending link…' : 'Send reset link'}
      </button>
    </form>
  );
};
