import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Reset your password',
  description: 'Get a link by email to reset your Sinai Taxi account password.',
};

export default function ForgotPasswordPage() {
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
              <p className="text-xs text-ink-500 font-medium">Customer account</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-1">Forgot your password?</h2>
          <p className="text-sm text-ink-500 mb-6">
            Enter your account email and we&apos;ll send you a link to
            choose a new password. The link is good for one use only.
          </p>

          <ForgotPasswordForm />
        </div>

        <p className="text-center text-xs text-ink-400 mt-4">
          <Link href="/login" className="font-medium hover:text-ink-700">← Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
