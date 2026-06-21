'use client';

// Floating WhatsApp button — anchors bottom-right on every public
// page, opens a wa.me chat to the support line with a prefilled
// first message so the user doesn't have to think about how to
// frame the question. Hidden on admin/account paths where the
// signed-in surface already has direct support channels and the
// FAB would just clutter the dashboard.
//
// Phone format note: wa.me requires the country code without `+`
// or spaces. +441908380111 → 441908380111.
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const PHONE = '441908380111';
const PREFILL = 'I need help with Esim';

// Routes where we suppress the FAB. Admin lives in its own
// chrome, the order detail page is mid-fulfillment (less
// noise = better), and the checkout form needs the focus.
const HIDDEN_PREFIXES = ['/admin', '/account'];

export const WhatsAppFab: React.FC = () => {
  const pathname = usePathname();
  // Don't render at all during SSR — the button is purely
  // promotional and the wa.me link doesn't need to be in the
  // initial HTML for SEO.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  if (HIDDEN_PREFIXES.some(p => pathname?.startsWith(p))) return null;

  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(PREFILL)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Sinai Taxi eSIM support on WhatsApp"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 group"
    >
      <span className="absolute inset-0 -m-1 rounded-full bg-emerald-500/30 animate-ping" />
      <span className="relative grid place-items-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7"
          aria-hidden="true"
        >
          <path d="M19.05 4.91A10 10 0 0 0 4.5 19.13L3 22.5l3.45-1.5A10 10 0 1 0 19.05 4.91Zm-7 16.3a8 8 0 0 1-4.07-1.12l-.29-.17-2.42 1.06.72-2.36-.19-.3a8 8 0 1 1 6.25 2.89Zm4.4-5.94c-.24-.12-1.42-.7-1.64-.78s-.38-.12-.54.12-.62.78-.76.94-.28.18-.52.06a6.55 6.55 0 0 1-1.93-1.19 7.27 7.27 0 0 1-1.34-1.66c-.14-.24 0-.37.1-.49s.24-.28.36-.42a1.74 1.74 0 0 0 .24-.4.44.44 0 0 0 0-.42c-.06-.12-.54-1.3-.74-1.78s-.4-.4-.54-.4h-.46a.88.88 0 0 0-.64.3 2.69 2.69 0 0 0-.84 2 4.69 4.69 0 0 0 1 2.49 10.78 10.78 0 0 0 4.12 3.64c.58.25 1 .4 1.4.52a3.35 3.35 0 0 0 1.55.1 2.55 2.55 0 0 0 1.66-1.17 2.06 2.06 0 0 0 .14-1.17c-.06-.1-.22-.16-.46-.28Z" />
        </svg>
      </span>
      <span className="absolute right-16 top-1/2 -translate-y-1/2 hidden sm:block whitespace-nowrap rounded-xl bg-ink-900 text-white text-xs font-semibold px-3 py-2 opacity-0 group-hover:opacity-100 transition pointer-events-none">
        Need help? Chat with us
      </span>
    </a>
  );
};
