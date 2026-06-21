import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { isCustomerSignedIn } from '@/lib/customer-auth';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your Sinai Taxi account to buy an eSIM and manage your travel data plans.',
};

type Params = Promise<{ next?: string }>;

export default async function CustomerLoginPage({ searchParams }: { searchParams: Params }) {
  const sp = await searchParams;
  if (await isCustomerSignedIn()) redirect('/account');

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

          <h2 className="text-2xl font-bold tracking-tight mb-1">Welcome back</h2>
          <p className="text-sm text-ink-500 mb-6">
            Same account as the Sinai Taxi mobile app.
          </p>

          <LoginForm next={sp.next ?? '/account'} />
        </div>

        <p className="text-center text-xs text-ink-500 mt-4">
          New to Sinai Taxi?{' '}
          <a href="https://sinaitaxi.com/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Create an account
          </a>
          {' '}on sinaitaxi.com or download the mobile app — then come back to buy an eSIM.
        </p>

        <p className="text-center text-xs text-ink-400 mt-3">
          <Link href="/" className="font-medium hover:text-ink-700">← Back to destinations</Link>
        </p>
      </div>
    </div>
  );
}
