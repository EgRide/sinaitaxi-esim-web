'use client';

// Top-of-page promo cross-selling Sinai Taxi's car-transfer
// product to eSIM customers. Travellers buying data are travellers
// — so the conversion logic writes itself.
//
// Rules:
//   • Dismissible — once closed, hide for 14 days (localStorage).
//   • Suppressed on /orders/* and the checkout step inside
//     /destinations/[code] so we don't poach attention from
//     someone halfway through paying for an eSIM.
//   • Suppressed inside the account dashboard.
//   • Server-rendered fallback would push CLS; we render only
//     after hydration to avoid jank.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Car, X, ArrowRight } from 'lucide-react';

const DISMISS_KEY = 'sinaitaxi:transferBannerDismissedAt';
const DISMISS_TTL_MS = 14 * 24 * 60 * 60 * 1000;
const HIDDEN_PREFIXES = ['/orders', '/admin', '/account', '/topups'];

export const CarTransferBanner: React.FC = () => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (HIDDEN_PREFIXES.some(p => pathname?.startsWith(p))) {
      setVisible(false);
      return;
    }
    try {
      const raw = localStorage.getItem(DISMISS_KEY);
      const ts = raw ? Number(raw) : 0;
      if (!Number.isFinite(ts) || Date.now() - ts > DISMISS_TTL_MS) {
        setVisible(true);
      }
    } catch {
      // Private mode or storage disabled — show the banner anyway.
      setVisible(true);
    }
  }, [pathname]);

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch { /* noop */ }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="relative bg-gradient-to-r from-brand-700 via-brand-600 to-accent-500 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2 sm:py-2.5 flex items-center gap-3">
        <span className="grid place-items-center w-7 h-7 rounded-lg bg-white/15 flex-shrink-0">
          <Car className="h-4 w-4" />
        </span>
        <p className="text-xs sm:text-sm leading-snug flex-1 min-w-0">
          <span className="font-extrabold">Need a ride too?</span>{' '}
          <span className="text-white/85 hidden sm:inline">
            Book your airport &amp; hotel transfers with Sinai Taxi —
          </span>
          <span className="text-white/85 sm:hidden">Sinai Taxi car transfers —</span>{' '}
          <span className="font-semibold">trusted by 10,000+ travellers.</span>
        </p>
        <Link
          href="https://sinaitaxi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white text-brand-700 px-3 py-1 text-xs font-bold hover:bg-white/90 transition flex-shrink-0">
          Book a ride
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="https://sinaitaxi.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Book a ride"
          className="sm:hidden inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-brand-700 hover:bg-white/90 transition flex-shrink-0">
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss banner"
          className="grid place-items-center w-7 h-7 rounded-full hover:bg-white/15 transition flex-shrink-0">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
