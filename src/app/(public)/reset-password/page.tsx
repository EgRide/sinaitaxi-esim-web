import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { ResetPasswordForm } from './ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Choose a new password',
  description: 'Set a new password for your Sinai Taxi account.',
};

// The reset email PHP sends embeds a magic link pointing here with
// a `?code=` query string. We read it and hand it to the form as
// a hidden input so it travels with the server-action submission.
// If the query is missing (customer manually navigated here),
// the form renders gracefully with a "request a new link" hint.
type Params = Promise<{ code?: string; email?: string }>;

export default async function ResetPasswordPage({ searchParams }: { searchParams: Params }) {
  const sp = await searchParams;
  const code = sp.code ?? '';

  return (
    <div className="min-h-screen bg-ink-50/40 grid place-items-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-soft border border-ink-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-extrabold tracking-tight text-lg leading-tight">
                Sinai<span className="text-brand-500">Taxi</span> eSIM
              </h1>
              <p className="text-xs text-ink-500 font-medium">Reset password</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-1">Choose a new password</h2>
          <p className="text-sm text-ink-500 mb-6">
            Pick something at least 8 characters long. The new password
            also works in the Sinai Taxi mobile app — same account on
            both sides.
          </p>

          <ResetPasswordForm code={code} />
        </div>

        <p className="text-center text-xs text-ink-400 mt-4">
          <Link href="/login" className="font-medium hover:text-ink-700">← Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
