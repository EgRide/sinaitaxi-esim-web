import Link from 'next/link';
import { LoginForm } from './LoginForm';

export const metadata = { title: 'Admin · Sign in' };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-soft border border-ink-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 4h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                <path d="M9 13h6M9 17h6M9 9h3" />
              </svg>
            </span>
            <div>
              <h1 className="font-extrabold tracking-tight text-lg leading-tight">
                Sinai<span className="text-brand-500">Taxi</span> eSIM
              </h1>
              <p className="text-xs text-ink-500 font-medium">Team dashboard</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-1">Sign in</h2>
          <p className="text-sm text-ink-500 mb-6">
            Use your sinaitaxi.com admin credentials.
          </p>

          <LoginForm />
        </div>

        <p className="text-center text-xs text-ink-400 mt-4">
          Not staff?{' '}
          <Link href="/" className="font-semibold text-ink-600 hover:text-ink-900">
            Back to the eSIM store
          </Link>
        </p>
      </div>
    </div>
  );
}
