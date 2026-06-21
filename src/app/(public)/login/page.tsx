import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { isCustomerSignedIn } from '@/lib/customer-auth';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { GoogleSignInButton } from './GoogleSignInButton';

export const metadata: Metadata = {
  title: 'Sign in or create an account',
  description: 'Sign in to your Sinai Taxi account to buy an eSIM and manage your travel data plans.',
};

type Params = Promise<{ next?: string; mode?: string }>;

export default async function CustomerLoginPage({ searchParams }: { searchParams: Params }) {
  const sp = await searchParams;
  if (await isCustomerSignedIn()) redirect('/account');

  const isSignUp = sp.mode === 'signup' || sp.mode === 'register';
  const next = sp.next ?? '/account';

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

          {/* Tab switcher — server-rendered, swaps via query string so
              the chosen tab survives form errors (useActionState
              re-renders the same page). */}
          <div role="tablist" aria-label="Auth mode" className="inline-flex bg-ink-100 rounded-full p-1 mb-6">
            <Link
              role="tab"
              aria-selected={!isSignUp}
              href={`/login?${new URLSearchParams({ next, mode: 'signin' }).toString()}`}
              className={
                'px-5 py-1.5 text-sm font-semibold rounded-full transition ' +
                (!isSignUp ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-900')
              }>
              Sign in
            </Link>
            <Link
              role="tab"
              aria-selected={isSignUp}
              href={`/login?${new URLSearchParams({ next, mode: 'signup' }).toString()}`}
              className={
                'px-5 py-1.5 text-sm font-semibold rounded-full transition ' +
                (isSignUp ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-900')
              }>
              Sign up
            </Link>
          </div>

          {isSignUp ? (
            <>
              <h2 className="text-2xl font-bold tracking-tight mb-1">Create your account</h2>
              <p className="text-sm text-ink-500 mb-6">
                Same login works on the Sinai Taxi app for rides.
              </p>
              <GoogleSignInButton next={next} />
              <SignUpForm next={next} />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold tracking-tight mb-1">Welcome back</h2>
              <p className="text-sm text-ink-500 mb-6">
                Same account as the Sinai Taxi mobile app.
              </p>
              <GoogleSignInButton next={next} />
              <LoginForm next={next} />
            </>
          )}
        </div>

        <p className="text-center text-xs text-ink-400 mt-4">
          <Link href="/" className="font-medium hover:text-ink-700">← Back to destinations</Link>
        </p>
      </div>
    </div>
  );
}
