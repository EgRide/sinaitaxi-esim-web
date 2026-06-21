'use client';

// Floating glass nav that morphs on scroll. Transparent over the
// hero, opaque white pill below. Same affordance Airalo + Linear
// use — keeps the brand quiet on first paint and tightens as the
// user scrolls into content.
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe2, Menu, X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface NavProps {
  /** Server-rendered auth slot — "Sign in" pill or account avatar. */
  accountSlot?: React.ReactNode;
}

export const Nav: React.FC<NavProps> = ({ accountSlot }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-3 left-0 right-0 z-50 px-3 sm:px-6">
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'mx-auto max-w-6xl flex items-center justify-between gap-4',
          'rounded-full pl-5 pr-2 py-2 transition-all duration-300',
          scrolled
            ? 'bg-white/85 backdrop-blur-xl shadow-soft border border-ink-100'
            : 'bg-white/40 backdrop-blur-md border border-white/40',
        )}>
        <Link href="/" className="flex items-center gap-2 group">
          <BrandMark />
          <span className="font-extrabold tracking-tighter text-lg">
            Sinai<span className="text-brand-500">Taxi</span>
            <span className="ml-1.5 text-ink-500 text-sm font-semibold">eSIM</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-ink-600">
          <Link href="/" className="hover:text-ink-900">Destinations</Link>
          <Link href="/how-it-works" className="hover:text-ink-900">How it works</Link>
          <Link href="/why-us" className="hover:text-ink-900">Why us</Link>
          <a href="https://sinaitaxi.com" target="_blank" rel="noreferrer" className="hover:text-ink-900">
            Sinai Taxi
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {accountSlot}
          <button
            onClick={() => setOpen(v => !v)}
            className="md:hidden rounded-full bg-white border border-ink-200 h-9 w-9 grid place-items-center"
            aria-label="Open menu">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </motion.div>

      {/* Mobile menu sheet */}
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mx-auto max-w-6xl mt-2 rounded-3xl border border-ink-200 bg-white p-4 shadow-soft">
          <ul className="flex flex-col gap-1 text-sm font-medium">
            <li><Link href="/" onClick={() => setOpen(false)} className="block py-2">Destinations</Link></li>
            <li><Link href="/how-it-works" onClick={() => setOpen(false)} className="block py-2">How it works</Link></li>
            <li><Link href="/why-us" onClick={() => setOpen(false)} className="block py-2">Why us</Link></li>
            <li><Link href="/install-esim" onClick={() => setOpen(false)} className="block py-2">Install an eSIM</Link></li>
            <li><Link href="/account" onClick={() => setOpen(false)} className="block py-2">My account</Link></li>
            <li><a href="https://sinaitaxi.com" target="_blank" rel="noreferrer" className="block py-2">Sinai Taxi</a></li>
          </ul>
        </motion.div>
      ) : null}
    </div>
  );
};

const BrandMark: React.FC = () => (
  // Tiny mark — a stacked SIM-card silhouette in the brand blue.
  <span className="grid place-items-center w-9 h-9 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow">
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path d="M9 13h6M9 17h6M9 9h3" />
    </svg>
  </span>
);
