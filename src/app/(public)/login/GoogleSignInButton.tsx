'use client';

// "Continue with Google" button. Uses the sinaitaxi PHP redirect
// flow: we ask the eSIM API for the upstream URL (which proxies
// PHP's /auth/google/url) and bounce the browser there. After
// Google auth, PHP redirects to its /auth/google/callback which
// processes the code and is expected to bounce back to a frontend
// URL with the session token in a query param.
//
// Until that final redirect-to-frontend step is wired on PHP we
// hide the button by default. Set NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=1
// on Vercel to opt in once the PHP team configures the redirect.
import { useState } from 'react';

const ENABLED = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === '1';

export const GoogleSignInButton: React.FC<{ next: string }> = ({ next }) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!ENABLED) return null;

  const onClick = async () => {
    setError(null);
    setBusy(true);
    try {
      const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');
      const res = await fetch(`${base}/v1/customer/google/url`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const body = (await res.json()) as { url?: string };
      if (!body.url) throw new Error('No Google URL returned');
      // Remember where to send the user after the round-trip.
      try {
        sessionStorage.setItem('sinaitaxi:googleNext', next);
      } catch { /* private mode — ignore */ }
      window.location.href = body.url;
    } catch (err) {
      setBusy(false);
      setError((err as Error).message);
    }
  };

  return (
    <div className="space-y-3 mb-4">
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        className="w-full flex items-center justify-center gap-3 rounded-full bg-white border border-ink-200 hover:border-ink-400 disabled:opacity-60 px-4 py-3 text-sm font-semibold text-ink-900 transition shadow-sm"
        aria-label="Continue with Google">
        <GoogleGlyph />
        {busy ? 'Redirecting…' : 'Continue with Google'}
      </button>
      {error ? (
        <p className="text-xs text-red-700 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      ) : null}
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-ink-400">
        <span className="flex-1 h-px bg-ink-100" />
        <span>or use email</span>
        <span className="flex-1 h-px bg-ink-100" />
      </div>
    </div>
  );
};

const GoogleGlyph: React.FC = () => (
  <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-11.3 8 12 12 0 1 1 8-21l5.7-5.6A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5Z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8A12 12 0 0 1 24 12c3 0 5.7 1.2 7.8 3l5.7-5.6A20 20 0 0 0 6.3 14.7Z" />
    <path fill="#4CAF50" d="M24 44a20 20 0 0 0 13.6-5.3l-6.3-5.3a12 12 0 0 1-17.7-6.4l-6.6 5A20 20 0 0 0 24 44Z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.4l6.3 5.3A19.8 19.8 0 0 0 44 24c0-1.2-.1-2.4-.4-3.5Z" />
  </svg>
);
