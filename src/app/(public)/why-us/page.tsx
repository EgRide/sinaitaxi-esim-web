import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Zap, Globe2, Receipt, ShieldCheck, RefreshCcw, Smartphone,
  Sparkles, ChevronRight, Check, X, MinusCircle, Heart, Award,
} from 'lucide-react';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Why Sinai Taxi eSIM · The travel data layer, built like a product',
  description:
    'Eight reasons travellers pick Sinai Taxi eSIM over carrier roaming, kiosk SIMs, or older eSIM providers — instant activation, transparent pricing, Stripe-secured payments, and 200+ destinations.',
};

export default function WhyUsPage() {
  return (
    <>
      <PageHero
        eyebrow="Why us"
        title="The travel data layer, built like a product."
        subtitle="There are dozens of eSIM resellers. Most of them treat the user like a number in a funnel — opaque pricing, generic emails, buggy QR codes. We built Sinai Taxi the way we'd want it ourselves: zero friction, honest pricing, and the most polished checkout in the category."
      />

      {/* Top differentiators */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-12">
          <span className="chip mb-4">What we believe</span>
          <h2 className="text-4xl font-extrabold tracking-tightest">
            Eight things we got right.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Card
            icon={<Zap className="h-5 w-5" />}
            title="Instant activation"
            body="Buy, scan, connect — usually inside 60 seconds. We don't queue your order in a batch system or wait for human approval. The Stripe webhook fires, our backend places the order with the network partner, and the QR appears on your receipt within seconds."
          />
          <Card
            icon={<Globe2 className="h-5 w-5" />}
            title="200+ destinations"
            body="Every continent. From single-country plans for a weekend in Lisbon to multi-region plans covering all of Europe or all of Asia-Pacific. The country list grows automatically as our network partner adds coverage."
          />
          <Card
            icon={<Receipt className="h-5 w-5" />}
            title="Transparent pricing in EUR"
            body="The price you see is the price you pay. No service fees layered on at checkout. No fake discounts. No tip prompt. We display everything in euros up front so EU travellers don't get caught by silent FX margins."
          />
          <Card
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Stripe-secured payments"
            body="PCI-DSS Level 1, the highest tier in payment security. Sinai Taxi never sees or stores card numbers — Stripe handles every transaction end to end. Apple Pay, Google Pay, all major cards. SCA-protected for EU customers."
          />
          <Card
            icon={<Smartphone className="h-5 w-5" />}
            title="Real install instructions, in your language"
            body="Our receipt page doesn't just show a QR code. It pulls the exact step-by-step install instructions for your phone model — iPhone or Android — and translates them to your language. No guesswork."
          />
          <Card
            icon={<RefreshCcw className="h-5 w-5" />}
            title="Top up without reinstalling"
            body="Run low mid-trip? Open the receipt, hit Top up, pick a refill plan, pay. The new data attaches to your existing eSIM — no need to scan a new QR, no second profile cluttering your settings."
          />
          <Card
            icon={<Heart className="h-5 w-5" />}
            title="Built by people who travel"
            body="Every screen on this site was designed by people who've cursed at a roaming bill in an airport bathroom. We made the things we wished existed: a compatibility checker on every plan, live data usage on your receipt, an obvious top-up button. No dark patterns."
          />
          <Card
            icon={<Award className="h-5 w-5" />}
            title="Same network as the airlines"
            body="Behind the scenes we're powered by the same wholesale network the airlines use to push eSIMs to passengers mid-flight. You get carrier-grade quality wrapped in a checkout that actually respects your time."
          />
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-ink-50/40 border-y border-ink-100">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="text-center mb-10">
            <span className="chip mb-4">Side by side</span>
            <h2 className="text-4xl font-extrabold tracking-tightest">
              How we compare.
            </h2>
            <p className="mt-4 text-lg text-ink-600 max-w-2xl mx-auto">
              An honest look at the three options every traveller
              considers — and where each one wins or loses.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-ink-100 bg-white shadow-soft">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-ink-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left font-semibold px-5 py-4">&nbsp;</th>
                  <th className="text-center font-bold px-5 py-4 bg-brand-50 text-brand-900">
                    Sinai Taxi eSIM
                  </th>
                  <th className="text-center font-semibold px-5 py-4">Carrier roaming</th>
                  <th className="text-center font-semibold px-5 py-4">Kiosk SIM card</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                <CompareRow label="Setup before flying"        a="yes" b="yes" c="no" />
                <CompareRow label="Cost vs home network"       a="80% less" b="full price" c="60% less" />
                <CompareRow label="No SIM swap or eject pin"   a="yes" b="yes" c="no" />
                <CompareRow label="Keep your home number"      a="yes" b="yes" c="partial" />
                <CompareRow label="Pay in EUR (no FX surprise)" a="yes" b="depends" c="no" />
                <CompareRow label="Instant top-up mid-trip"    a="yes" b="depends" c="no" />
                <CompareRow label="Refund if it doesn't work"  a="yes" b="rare" c="no" />
                <CompareRow label="QR code re-issuable"        a="yes" b="n/a" c="no" />
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-xs text-ink-500 text-center max-w-2xl mx-auto">
            Cost comparison based on representative travel data
            plans across major EU and US carriers (Vodafone,
            Verizon, Orange, T-Mobile) versus equivalent Sinai
            Taxi plans, October 2025.
          </p>
        </div>
      </section>

      {/* The "what we don't do" section */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-10 items-start">
          <div>
            <span className="chip mb-4">Anti-features</span>
            <h2 className="text-4xl font-extrabold tracking-tightest leading-tight">
              What we
              <br />
              <span className="text-brand-600">don&apos;t</span> do.
            </h2>
            <p className="mt-4 text-ink-600">
              Saying yes to everything is how products get worse.
              Here&apos;s what we&apos;ve deliberately left out.
            </p>
          </div>
          <ul className="space-y-3">
            <NotDo>
              <strong>No account required.</strong> Just an email for
              the receipt. We don&apos;t want your phone number, your
              date of birth, or your shoe size. We&apos;re not building
              a marketing database.
            </NotDo>
            <NotDo>
              <strong>No mobile app to install.</strong> Your phone
              has a browser. That&apos;s enough. The receipt page works
              offline once you&apos;ve loaded it.
            </NotDo>
            <NotDo>
              <strong>No fake countdown timers.</strong> No &quot;3 people are
              viewing this plan&quot; toasts. No exit-intent pop-ups.
              No urgency theatre. The price is the price.
            </NotDo>
            <NotDo>
              <strong>No subscription traps.</strong> Every plan is a
              one-time purchase. Top-ups are explicit, not auto-renewing.
            </NotDo>
            <NotDo>
              <strong>No 24-step onboarding.</strong> Search, pick,
              pay, scan. If we can shave a step, we shave it.
            </NotDo>
          </ul>
        </div>
      </section>

      {/* Founders' note */}
      <section className="bg-ink-50/40 border-y border-ink-100">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <span className="chip mb-4">A note from the team</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tightest leading-tight">
            We built this because we got tired of being a customer.
          </h2>
          <div className="mt-6 space-y-4 text-ink-700 leading-relaxed text-lg">
            <p>
              Sinai Taxi started in transportation. We&apos;ve been
              moving travellers around the Sinai peninsula for years,
              and the same friction kept coming up at every airport
              pickup: a passenger steps off the plane, opens the
              ride app, and watches the spinner go nowhere because
              their data plan is dead. Then comes the €40 roaming
              bill the next morning.
            </p>
            <p>
              That problem isn&apos;t unique to Egypt — it&apos;s
              every airport, on every continent, every day. So we
              built Sinai Taxi eSIM as a <strong>global eSIM
              marketplace</strong> covering <strong>200+ destinations</strong>{' '}
              from Tokyo to São Paulo, Cape Town to Reykjavík. Whether
              you&apos;re flying into JFK, Heathrow, Changi, or Cairo,
              you can land already online.
            </p>
            <p>
              Our principle is simple: one focused product that does
              one thing well — get you connected in a new country
              without the friction. No app, no account, no upsell.
              Find a country, pick a plan, scan a QR, go.
            </p>
            <p>
              If something feels off — a bad price, a confusing flow,
              a plan that doesn&apos;t activate — tell us. We read every
              email at{' '}
              <a href="mailto:sales@sinaitaxi.com" className="font-semibold text-brand-600 hover:text-brand-700">
                sales@sinaitaxi.com
              </a>
              {' '}and we ship fixes the same week.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-4xl font-extrabold tracking-tightest">
            Let&apos;s get you online.
          </h2>
          <p className="mt-4 text-white/75">
            Pick a destination. We&apos;ll handle the rest.
          </p>
          <Link href="/" className="btn-primary mt-8 !bg-white !text-ink-900 hover:!bg-ink-100">
            <Globe2 className="h-4 w-4" />
            Browse destinations
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

const Card: React.FC<{ icon: React.ReactNode; title: string; body: string }> = ({ icon, title, body }) => (
  <div className="rounded-3xl border border-ink-100 bg-white p-6 hover:shadow-soft hover:border-brand-200 transition">
    <span className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
      {icon}
    </span>
    <h3 className="mt-4 text-lg font-bold tracking-tight">{title}</h3>
    <p className="mt-2 text-sm text-ink-600 leading-relaxed">{body}</p>
  </div>
);

const CompareRow: React.FC<{ label: string; a: string; b: string; c: string }> = ({ label, a, b, c }) => (
  <tr>
    <td className="px-5 py-3 font-medium text-ink-700">{label}</td>
    <Cell value={a} highlight />
    <Cell value={b} />
    <Cell value={c} />
  </tr>
);

const Cell: React.FC<{ value: string; highlight?: boolean }> = ({ value, highlight }) => {
  const isYes  = value === 'yes';
  const isNo   = value === 'no';
  const isMaybe = value === 'partial' || value === 'depends' || value === 'rare' || value === 'n/a';
  return (
    <td className={`px-5 py-3 text-center ${highlight ? 'bg-brand-50/40' : ''}`}>
      {isYes ? (
        <Check className="inline h-5 w-5 text-emerald-600" />
      ) : isNo ? (
        <X className="inline h-5 w-5 text-red-500" />
      ) : isMaybe ? (
        <span className="inline-flex items-center gap-1 text-xs text-ink-500">
          <MinusCircle className="h-3.5 w-3.5" /> {value}
        </span>
      ) : (
        <span className="text-sm font-semibold text-ink-800">{value}</span>
      )}
    </td>
  );
};

const NotDo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex gap-3 text-base text-ink-700 leading-relaxed">
    <Sparkles className="h-4 w-4 text-brand-500 flex-shrink-0 mt-1.5" />
    <span>{children}</span>
  </li>
);
