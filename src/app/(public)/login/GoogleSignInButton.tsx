'use client';

// Google Identity Services button (https://developers.google.com/identity/gsi/web).
// Loaded straight off Google's CDN so we don't need an npm dep —
// the script exposes window.google.accounts.id with prompt + button
// helpers. Clicking the rendered button opens Google's One Tap UI;
// once the user picks an account we get back an ID token, POST it
// to /v1/customer/google, and on success redirect to `next`.
//
// Gated behind NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID — if the env var
// is missing the button is hidden, so the surface stays clean
// while the Google Cloud Console project is still being set up.
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { googleSignInAction, type GoogleSignInState } from '@/lib/customer-actions';

interface GsiPromptNotification {
  isDisplayed?: () => boolean;
  isNotDisplayed?: () => boolean;
  isSkippedMoment?: () => boolean;
}

interface GsiClient {
  accounts: {
    id: {
      initialize: (cfg: {
        client_id: string;
        callback: (resp: { credential: string }) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
        use_fedcm_for_prompt?: boolean;
      }) => void;
      renderButton: (
        el: HTMLElement,
        options: { theme?: string; size?: string; width?: number; text?: string; shape?: string; logo_alignment?: string },
      ) => void;
      prompt: (cb?: (n: GsiPromptNotification) => void) => void;
      disableAutoSelect: () => void;
    };
  };
}
declare global {
  interface Window { google?: GsiClient }
}

const GSI_SRC = 'https://accounts.google.com/gsi/client';

export const GoogleSignInButton: React.FC<{ next: string }> = ({ next }) => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) return;
    // Load the GSI script once per page lifetime. Re-entrancy is
    // handled by Google's own loader — calling the source URL
    // twice is a no-op after first load.
    if (typeof window === 'undefined') return;
    if (window.google?.accounts?.id) { setScriptReady(true); return; }
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GSI_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => setScriptReady(true));
      return;
    }
    const s = document.createElement('script');
    s.src = GSI_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => setScriptReady(true);
    s.onerror = () => setError('Could not load Google Sign-In');
    document.head.appendChild(s);
  }, [clientId]);

  useEffect(() => {
    if (!scriptReady || !clientId || !buttonRef.current || !window.google) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (resp) => {
        if (!resp.credential) return;
        const result: GoogleSignInState = await googleSignInAction({ idToken: resp.credential, next });
        if (result.error) {
          setError(result.error);
          return;
        }
        // Server action already wrote the session cookies; just
        // navigate the customer onward.
        router.push(next);
        router.refresh();
      },
      auto_select: false,
      cancel_on_tap_outside: true,
      use_fedcm_for_prompt: true,
    });
    // Render the official Google button — full width to match
    // the rest of the form.
    const width = Math.min(420, buttonRef.current.offsetWidth || 380);
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      width,
      text: 'continue_with',
      logo_alignment: 'left',
    });
  }, [scriptReady, clientId, next, router]);

  if (!clientId) return null;

  return (
    <div className="space-y-4 mb-4">
      <div ref={buttonRef} className="flex justify-center" />
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
