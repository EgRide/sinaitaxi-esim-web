'use client';

// App Store + Play Store badges. The mobile apps aren't published
// yet — clicking either opens a "Coming soon" sheet with a way to
// register for launch updates instead of erroring on a dead link.
// The badges live in the footer; they're SVG'd inline so we don't
// depend on Apple/Google CDN assets (which have license terms that
// would otherwise apply) and so they tint cleanly with our brand.
import { useState } from 'react';
import { X } from 'lucide-react';

export const AppStoreBadges: React.FC = () => {
  const [open, setOpen] = useState<null | 'ios' | 'android'>(null);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen('ios')}
          className="group inline-flex items-center gap-3 rounded-2xl bg-black/90 hover:bg-black px-4 py-2.5 text-white border border-white/10 transition shadow-sm">
          <AppleGlyph className="h-7 w-7" />
          <span className="text-left leading-tight">
            <span className="block text-[10px] uppercase tracking-widest text-white/70">Coming soon to</span>
            <span className="block text-base font-semibold -mt-0.5">App Store</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => setOpen('android')}
          className="group inline-flex items-center gap-3 rounded-2xl bg-black/90 hover:bg-black px-4 py-2.5 text-white border border-white/10 transition shadow-sm">
          <PlayGlyph className="h-7 w-7" />
          <span className="text-left leading-tight">
            <span className="block text-[10px] uppercase tracking-widest text-white/70">Coming soon on</span>
            <span className="block text-base font-semibold -mt-0.5">Google Play</span>
          </span>
        </button>
      </div>

      {open && <ComingSoonSheet platform={open} onClose={() => setOpen(null)} />}
    </>
  );
};

const ComingSoonSheet: React.FC<{ platform: 'ios' | 'android'; onClose: () => void }> = ({
  platform,
  onClose,
}) => {
  const label = platform === 'ios' ? 'iPhone' : 'Android';
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative max-w-md w-full rounded-3xl bg-white text-ink-900 p-6 sm:p-8 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid place-items-center w-8 h-8 rounded-full hover:bg-ink-100 transition">
          <X className="h-4 w-4" />
        </button>

        <div className="grid place-items-center w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 mb-4">
          {platform === 'ios' ? <AppleGlyph className="h-7 w-7" /> : <PlayGlyph className="h-7 w-7" />}
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight">
          The {label} app is on its way
        </h2>
        <p className="mt-2 text-sm text-ink-600 leading-relaxed">
          We&apos;re putting the final polish on the Sinai Taxi app. In the
          meantime you can buy, install and top up your eSIM right here on
          the website — same prices, same instant activation.
        </p>
        <p className="mt-3 text-xs text-ink-500">
          Want us to email you when it launches? Drop a line to{' '}
          <a href="mailto:sales@sinaitaxi.com" className="font-semibold text-brand-700 hover:underline">
            sales@sinaitaxi.com
          </a>{' '}
          and we&apos;ll add you to the list.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full inline-flex items-center justify-center rounded-2xl bg-ink-900 text-white text-sm font-semibold px-4 py-3 hover:bg-ink-800 transition">
          Continue on the web
        </button>
      </div>
    </div>
  );
};

const AppleGlyph: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M16.5 12.55a4.59 4.59 0 0 1 2.18-3.86 4.7 4.7 0 0 0-3.7-2c-1.56-.16-3.06.91-3.86.91-.81 0-2.03-.89-3.34-.86A4.94 4.94 0 0 0 3.6 9.27c-1.78 3.07-.45 7.62 1.27 10.12.84 1.23 1.84 2.61 3.16 2.56 1.27-.05 1.75-.82 3.28-.82 1.54 0 1.97.82 3.32.79 1.37-.02 2.24-1.25 3.07-2.49a10.95 10.95 0 0 0 1.41-2.85 4.45 4.45 0 0 1-2.61-4.03Zm-2.55-7.36a4.46 4.46 0 0 0 1.04-3.19 4.66 4.66 0 0 0-3 1.56 4.27 4.27 0 0 0-1.07 3.11 3.83 3.83 0 0 0 3.03-1.48Z" />
  </svg>
);

const PlayGlyph: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M3.6 1.8a2 2 0 0 0-1 1.74V20.46a2 2 0 0 0 1 1.74L13.69 12 3.6 1.8Z" fill="#34A853" />
    <path d="M17.55 8.05 14.7 9.7 3.6 1.8a2 2 0 0 1 2.45-.34Z" fill="#EA4335" transform="translate(0,0)" />
    <path d="m14.7 14.3 2.85 1.65 3.5-1.96a2 2 0 0 0 0-3.48L14.7 9.7l-1 1.16Z" fill="#FBBC04" />
    <path d="M3.6 22.2a2 2 0 0 0 2.45.34l11.5-6.59-2.85-1.65Z" fill="#4285F4" />
  </svg>
);
