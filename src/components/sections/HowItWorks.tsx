'use client';

// Three-step explainer. Numbered cards with subtle motion on
// scroll. Same affordance Airalo + Linear use to anchor first-
// time visitors. No fluff — pick / pay / scan.
import { motion } from 'framer-motion';
import { MapPin, CreditCard, ScanLine } from 'lucide-react';

const STEPS = [
  {
    icon: MapPin,
    title: 'Pick a destination',
    body: 'Browse 200+ countries and pick the plan that fits your trip — by data, by duration, or by price.',
  },
  {
    icon: CreditCard,
    title: 'Pay with card or Apple Pay',
    body: 'Stripe-secured checkout in under 30 seconds. Your eSIM lands in your inbox before you leave the page.',
  },
  {
    icon: ScanLine,
    title: 'Scan and go',
    body: 'Open your phone\'s Settings → Add eSIM, scan the QR code, and you\'re connected the moment you land.',
  },
];

export const HowItWorks: React.FC = () => (
  <section id="how" className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
    <div className="max-w-2xl">
      <span className="chip mb-4">How it works</span>
      <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tightest leading-tight">
        Three taps from search to signal.
      </h2>
      <p className="mt-4 text-lg text-ink-600 leading-relaxed">
        Skip the airport SIM kiosk. Skip the roaming bill. Get the
        plan you need before you board.
      </p>
    </div>

    <div className="mt-12 grid md:grid-cols-3 gap-5">
      {STEPS.map((step, i) => (
        <motion.div
          key={step.title}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl border border-ink-100 bg-white p-7 overflow-hidden">
          <span className="absolute -top-2 right-5 text-[110px] font-extrabold text-ink-100 leading-none select-none">
            {i + 1}
          </span>
          <div className="relative">
            <div className="h-11 w-11 grid place-items-center rounded-2xl bg-brand-50 text-brand-500">
              <step.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-xl font-bold tracking-tight">{step.title}</h3>
            <p className="mt-2 text-sm text-ink-600 leading-relaxed">{step.body}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);
