'use client';

// Bento-style feature grid — large mixed-size cards on desktop,
// stacked on mobile. Six features pulled from the value props:
// instant activation, transparent pricing, global coverage,
// secure payments, top-up support, single-tap install.
import { motion } from 'framer-motion';
import {
  Zap,
  Globe2,
  ShieldCheck,
  Receipt,
  Smartphone,
  RefreshCcw,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant activation',
    body: 'eSIM is ready before your flight boards. Plan activates the second you land.',
    span: 'md:col-span-2',
    accent: 'from-brand-500/15 to-transparent',
  },
  {
    icon: Globe2,
    title: '200+ destinations',
    body: 'Coverage on every continent, with the same wholesale rates a major carrier pays.',
    span: '',
    accent: 'from-accent-400/15 to-transparent',
  },
  {
    icon: ShieldCheck,
    title: 'Stripe-secured',
    body: 'PCI-DSS Level 1 payments. We never touch your card details.',
    span: '',
    accent: 'from-green-400/15 to-transparent',
  },
  {
    icon: Receipt,
    title: 'Transparent pricing',
    body: 'One price. No surcharges. No "international" fees layered at checkout.',
    span: '',
    accent: 'from-brand-400/15 to-transparent',
  },
  {
    icon: Smartphone,
    title: 'Single-tap install',
    body: 'Scan the QR code from the receipt or tap "Install eSIM" if you\'re already on the device.',
    span: '',
    accent: 'from-purple-400/15 to-transparent',
  },
  {
    icon: RefreshCcw,
    title: 'Top up anytime',
    body: 'Need more data? Buy a refill in the app — no need to swap eSIMs mid-trip.',
    span: 'md:col-span-2',
    accent: 'from-brand-500/15 to-transparent',
  },
];

export const WhyUs: React.FC = () => (
  <section id="why" className="relative">
    <div className="absolute inset-0 bg-gradient-to-b from-ink-50/50 via-white to-white" />
    <div className="relative mx-auto max-w-6xl px-6 py-24 lg:py-32">
      <div className="max-w-2xl">
        <span className="chip mb-4">Why us</span>
        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tightest leading-tight">
          The travel data layer
          <br />
          built like a product.
        </h2>
        <p className="mt-4 text-lg text-ink-600 leading-relaxed">
          Same instant-install eSIM the airlines push, wrapped in a
          checkout that won't waste your time. No SIM swap, no
          roaming charges, no surprises.
        </p>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-5">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            className={`relative overflow-hidden rounded-3xl border border-ink-100 bg-white p-7 ${f.span}`}>
            <span
              aria-hidden
              className={`pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gradient-to-br ${f.accent} blur-3xl`}
            />
            <div className="relative">
              <div className="h-11 w-11 grid place-items-center rounded-2xl bg-ink-900 text-white">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-bold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-600 leading-relaxed">{f.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
