'use client';

// Hero — deep-navy gradient backdrop with a subtle grid, animated
// orb in the top-right, large display headline, search bar, and
// a floating "phone mockup" card on desktop that shows a sample
// activated eSIM. 2026-grade entrance — staggered fade + lift,
// no carousel, no auto-rotate, single message.
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import type { Country } from '@/lib/api';
import { CountrySearch } from '@/components/CountrySearch';
import { Flag } from '@/components/Flag';

interface Props {
  countries: Country[];
}

const fade = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
};

export const Hero: React.FC<Props> = ({ countries }) => (
  <section className="relative overflow-hidden">
    {/* Backdrop layers — navy gradient, subtle radial bloom, and
        a grid that fades into the bottom. Stacked z-order keeps
        them behind the content. */}
    <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800" />
    <div
      aria-hidden
      className="absolute inset-0 opacity-50"
      style={{
        backgroundImage:
          'radial-gradient(circle at 90% -10%, rgba(83,136,255,0.55), transparent 50%), radial-gradient(circle at 10% 110%, rgba(245,166,35,0.18), transparent 45%)',
      }}
    />
    <div
      aria-hidden
      className="absolute inset-0 [background-size:60px_60px] opacity-[0.07]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
        maskImage: 'linear-gradient(180deg, black 30%, transparent 95%)',
      }}
    />

    {/* Content */}
    <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-28 lg:pt-28 lg:pb-36 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">
      <div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 backdrop-blur px-3 py-1.5 text-xs font-medium text-white/85">
          <Sparkles className="h-3.5 w-3.5 text-accent-400" />
          {countries.length}+ destinations · Travel-ready in 60 seconds
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tightest text-white leading-[1.02]">
          Travel data,
          <br />
          <span className="bg-gradient-to-r from-brand-100 via-white to-brand-300 bg-clip-text text-transparent">
            without the roaming.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-6 max-w-xl text-lg text-white/75 leading-relaxed">
          Buy an eSIM for any country in 60 seconds. Scan one QR code, land
          connected. No SIM swap, no roaming charges, no surprises.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mt-8">
          <CountrySearch countries={countries} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70">
          <span className="inline-flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent-400" /> Activates instantly
          </span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent-400" /> Stripe-secured
          </span>
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent-400" /> 200+ countries
          </span>
        </motion.div>
      </div>

      {/* Floating phone-shaped card — shows the "activated" eSIM
          state. Subtle floaty bounce + 3D tilt courtesy of CSS. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
        animate={{ opacity: 1, scale: 1, rotate: -3 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:block relative"
        style={{ perspective: '1200px' }}>
        <div
          className="animate-floaty rounded-[2.5rem] bg-white/8 backdrop-blur-xl border border-white/15 p-3 shadow-glow"
          style={{ transform: 'rotateY(-8deg) rotateX(4deg)' }}>
          <div className="rounded-[2rem] bg-white p-5 w-72">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-ink-400">
              <span>Sinai Taxi eSIM</span>
              <span className="text-green-600">● Active</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Flag code="JP" size="xl" />
              <div>
                <div className="font-bold text-ink-900">Japan</div>
                <div className="text-xs text-ink-500">3 GB · 30 days</div>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-ink-900 p-3 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-white">
                <QrMark />
              </div>
              <div className="text-[11px] text-white/70">
                Scan with your phone to install. Activation on first use.
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 text-center text-[10px] uppercase tracking-wide text-ink-500">
              <Pill label="Coverage" value="JP" />
              <Pill label="Speed"    value="4G/5G" />
              <Pill label="Top up"   value="Yes" />
            </div>
          </div>
        </div>
        <span aria-hidden className="absolute -inset-10 -z-10 rounded-full bg-brand-500/20 blur-3xl" />
      </motion.div>
    </div>
  </section>
);

const Pill: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="py-2">
    <div className="text-ink-400 text-[9px]">{label}</div>
    <div className="text-ink-900 text-xs font-bold mt-0.5">{value}</div>
  </div>
);

const QrMark = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
    <path d="M3 3h7v7H3V3zm2 2v3h3V5H5zm9-2h7v7h-7V3zm2 2v3h3V5h-3zM3 14h7v7H3v-7zm2 2v3h3v-3H5zm9 0h2v2h-2v-2zm2-2h2v2h-2v-2zm2 2h3v2h-3v-2zm-4 4h2v2h-2v-2zm2 0h3v2h-3v-2zm2-4h2v2h-2v-2z" />
  </svg>
);
