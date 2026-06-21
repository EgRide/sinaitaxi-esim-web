import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Globe2, Search, Wallet, QrCode, ChevronRight,
  Sparkles, Smartphone, Wifi, AlertTriangle,
} from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { JsonLd, schemas } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'How it works · From booking to connected in 60 seconds',
  description:
    'Pick a country, choose a plan, pay with Stripe, scan one QR code — your phone connects to a local network the moment you land. No SIM swap, no roaming charges.',
  alternates: { canonical: '/how-it-works' },
};

// Same FAQ content shown on the page — duplicated as data so we
// can emit it both as visible HTML <details> and as schema.
const FAQ_ITEMS = [
  {
    question: 'Can I keep my home number while using a travel eSIM?',
    answer: 'Yes. Your home SIM stays active for calls and texts; the travel eSIM handles data. WhatsApp, iMessage and banking 2FA continue to work on your home number.',
  },
  {
    question: 'What happens if I don’t use all my data?',
    answer: 'Data does not roll over after the validity window ends. Pick a plan that matches your trip length and usage — most travellers find 5–10 GB plenty for a week of maps, social media and the occasional video call.',
  },
  {
    question: 'Can I top up if I run out?',
    answer: 'Yes. Open your order receipt, scroll to "Top up this eSIM", pick a refill plan and pay. The top-up attaches to the same eSIM with no reinstall.',
  },
  {
    question: 'Do I need to remove the eSIM when I get home?',
    answer: 'No. Switch it off in Settings — it stays installed silently. Next time you travel to the same country you can reuse it (if validity remains) or top it up. Modern phones can hold 8+ eSIM profiles.',
  },
  {
    question: 'Why is Sinai Taxi cheaper than carrier roaming?',
    answer: 'Roaming bundles are profit centres for your home carrier. We buy the same wholesale data Airalo negotiates directly with 600+ carriers worldwide and pass most of the saving on.',
  },
  {
    question: 'Is my payment safe?',
    answer: 'Yes. Stripe processes every payment with PCI-DSS Level 1 security. Sinai Taxi never sees or stores your card number — only Stripe does.',
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd data={schemas.faq(FAQ_ITEMS)} />
      <JsonLd data={schemas.breadcrumbs([
        { name: 'Home', url: 'https://esim.sinaitaxi.com/' },
        { name: 'How it works', url: 'https://esim.sinaitaxi.com/how-it-works' },
      ])} />
      <PageHero
        eyebrow="60 seconds, four taps"
        title="Travel data, the way it should be."
        subtitle="No more queuing at airport SIM kiosks. No more €60 roaming bills. Buy a Sinai Taxi eSIM at home, install it before you board, and the second your plane lands your phone is already online."
      />

      {/* Quick navigation chips */}
      <section className="border-y border-ink-100 bg-ink-50/40">
        <div className="mx-auto max-w-5xl px-6 py-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold uppercase tracking-wider text-ink-500 mr-2">Jump to</span>
          {[
            ['#steps',        'The four steps'],
            ['#what-is-esim', 'What is an eSIM?'],
            ['#install',      'Install & activate'],
            ['#troubleshoot', 'Troubleshooting'],
            ['#faq',          'FAQ'],
          ].map(([href, label]) => (
            <Link key={href} href={href}
              className="rounded-full bg-white border border-ink-200 hover:border-brand-300 hover:text-ink-900 transition px-3 py-1 font-semibold text-ink-600">
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* Four steps */}
      <section id="steps" className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center mb-12">
          <span className="chip mb-4">The process</span>
          <h2 className="text-4xl font-extrabold tracking-tightest">
            Four steps. About a minute total.
          </h2>
          <p className="mt-4 text-lg text-ink-600 max-w-2xl mx-auto">
            We've stripped everything that doesn't matter. Search,
            pick, pay, scan — that's it. No app to download, no
            account to create, no waiting for a physical SIM in
            the mail.
          </p>
        </div>

        <ol className="grid md:grid-cols-2 gap-5">
          <Step
            n={1}
            icon={<Search className="h-5 w-5" />}
            title="Search your destination"
            body="Type the country you're flying to — Japan, US, Türkiye, anywhere — and we'll show every plan we offer there in one tidy list. No upsells, no fake discounts, no fake countdown timers. Just real options at real prices."
            tip="Travelling to multiple countries? Look for the regional plans (Europe-wide, Asia-Pacific) on the country card."
          />
          <Step
            n={2}
            icon={<Wallet className="h-5 w-5" />}
            title="Pick a plan that fits the trip"
            body="Three things to decide: how many days you'll be there, how much data you'll use, and whether unlimited is worth the premium. We split the catalogue into Unlimited and Standard tabs so you don't have to scroll past plans you'd never buy."
            tip="Heavy on maps + video calls? Unlimited is usually worth it. A weekend trip checking emails? A 1–3 GB Standard plan is plenty."
          />
          <Step
            n={3}
            icon={<Wifi className="h-5 w-5" />}
            title="Pay with Stripe in one go"
            body="Apple Pay, Google Pay, or any major card. Stripe handles the entire transaction, which means PCI-DSS Level 1 security and we never see your card number. The price you see is the price you pay — no booking fees, no taxes added at checkout, no surprises."
            tip="If you're in the EU, payments are SCA-protected and your bank may ask you to confirm via app — that's expected."
          />
          <Step
            n={4}
            icon={<QrCode className="h-5 w-5" />}
            title="Scan the QR code, you're done"
            body="The receipt page shows your QR code instantly (and we email it too). On iPhone, open the camera and point at the QR — tap the banner. On Android, open Settings → Mobile Network → Add eSIM. Install it now, activate it the moment you land."
            tip="Save the QR to your camera roll before you fly. If you lose your phone signal, you'll still have it offline."
          />
        </ol>

        <div className="mt-14 text-center">
          <Link href="/" className="btn-primary">
            <Globe2 className="h-4 w-4" />
            Browse destinations
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* What is an eSIM? */}
      <section id="what-is-esim" className="bg-ink-50/40 border-y border-ink-100">
        <div className="mx-auto max-w-5xl px-6 py-20 grid lg:grid-cols-[1fr_1.2fr] gap-10 items-start">
          <div>
            <span className="chip mb-4">The basics</span>
            <h2 className="text-4xl font-extrabold tracking-tightest leading-tight">
              An eSIM is the SIM card,
              <br />
              <span className="text-brand-600">just built into your phone.</span>
            </h2>
          </div>
          <div className="space-y-4 text-ink-700 leading-relaxed">
            <p>
              For thirty years, getting your phone on a foreign network meant
              physically swapping out a tiny plastic chip. Find a shop. Buy
              the SIM. Pop the tray, lose the chip in your hotel room, eject
              the new one. Three failure modes before you've checked Google
              Maps once.
            </p>
            <p>
              <strong className="text-ink-900">An eSIM is software.</strong> Every
              iPhone since the XS and most flagship Androids since 2019 have
              a small embedded chip that can hold up to 8 carrier profiles
              at once. Installing a Sinai Taxi eSIM means writing one of
              those profiles to your phone — no plastic, no eject pin, no
              kiosk.
            </p>
            <p>
              Your normal SIM (or eSIM) stays untouched. WhatsApp keeps
              ringing your home number; you just get cheap local data
              alongside it. When the trip ends, switch the travel eSIM off
              in Settings and forget about it until next time.
            </p>
            <div className="rounded-2xl border border-brand-100 bg-brand-50/50 px-4 py-3 text-sm text-brand-900">
              <strong>Not sure your phone supports eSIM?</strong> Open any
              country page on Sinai Taxi and hit{' '}
              <span className="inline-flex items-center gap-1 font-semibold">
                <Smartphone className="h-3.5 w-3.5" /> Check compatibility
              </span>{' '}
              under any plan. We carry the official Airalo device list (500+
              models) so you can confirm yours in seconds.
            </div>
          </div>
        </div>
      </section>

      {/* Install & activate */}
      <section id="install" className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center mb-12">
          <span className="chip mb-4">Setup</span>
          <h2 className="text-4xl font-extrabold tracking-tightest">
            Installing the eSIM
          </h2>
          <p className="mt-4 text-lg text-ink-600 max-w-2xl mx-auto">
            We pull the exact step-by-step from Airalo's official
            instructions and translate them per phone model. Here's
            the general flow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <InstallCol
            title="On iPhone"
            steps={[
              'Open Settings → Cellular (or Mobile Data).',
              'Tap "Add eSIM" or "Add Cellular Plan".',
              'Choose "Use QR code" and scan the code from your receipt.',
              'Name the line "Travel" so you can tell it apart from your home line.',
              'Set the new line as your Data line. Keep your home line for calls and texts.',
            ]}
          />
          <InstallCol
            title="On Android (Samsung, Pixel, Xiaomi, etc.)"
            steps={[
              'Open Settings → Connections → SIM manager (or Mobile Network → Add eSIM).',
              'Tap "Add mobile plan" → "Scan carrier QR code".',
              'Scan the code from your receipt.',
              'Confirm activation and rename the line "Travel" for clarity.',
              'Toggle the new line as your default for Mobile Data.',
            ]}
          />
        </div>

        <div className="mt-10 rounded-3xl bg-ink-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-5">
          <span className="grid place-items-center w-12 h-12 rounded-2xl bg-white/10 flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-accent-400" />
          </span>
          <div className="flex-1">
            <h3 className="text-xl font-bold tracking-tight">
              Install it before you fly — activate it when you land.
            </h3>
            <p className="mt-2 text-white/75 leading-relaxed">
              Validity on most plans starts the moment data is first
              used, not the moment you bought the eSIM. So install the
              QR while you're still on hotel Wi-Fi, then keep the line
              switched off until you're at the gate or just landed.
              You'll get the full validity window of your plan.
            </p>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section id="troubleshoot" className="bg-ink-50/40 border-y border-ink-100">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="text-center mb-12">
            <span className="chip mb-4">When it doesn't just work</span>
            <h2 className="text-4xl font-extrabold tracking-tightest">
              Troubleshooting
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <Trouble
              symptom='"No service" after landing'
              fix="Toggle airplane mode off and on. If still nothing, go to Settings → Cellular → tap your travel line → make sure Data Roaming is ON for that line specifically. Yes, even though it's a local eSIM."
            />
            <Trouble
              symptom="Apps work but maps and browsing don't"
              fix="Your home line is probably your default for Mobile Data. Settings → Cellular → Mobile Data → pick the travel line. Calls and SMS stay on your home line."
            />
            <Trouble
              symptom="QR code says 'already used'"
              fix="An eSIM profile can only be installed once. If you accidentally removed it, contact us — we'll re-issue. Don't try to scan the same QR twice on a different phone."
            />
            <Trouble
              symptom="Slower than expected on Unlimited plans"
              fix="Most Unlimited plans have a fair-usage policy — typically full speed up to 3 GB/day, throttled after. We surface the exact policy on every Unlimited plan card before you buy."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
        <div className="text-center mb-10">
          <span className="chip mb-4">FAQ</span>
          <h2 className="text-4xl font-extrabold tracking-tightest">
            Common questions
          </h2>
        </div>
        <dl className="space-y-3">
          <Faq
            q="Can I keep my home number while using a travel eSIM?"
            a="Yes — that's the whole point. Your home SIM (or eSIM) stays active for calls and texts; the travel eSIM handles data. WhatsApp, iMessage, banking 2FA — all still work as normal."
          />
          <Faq
            q="What happens if I don't use all my data?"
            a="Data doesn't roll over after the validity window ends. Pick a plan that matches your trip length and usage — most travellers find 5–10 GB plenty for a one-week trip with maps + social media + the occasional video call."
          />
          <Faq
            q="Can I top up if I run out?"
            a="Yes. Open your order receipt, scroll to 'Top up this eSIM', pick a refill plan, and pay. Top-up adds fresh data to the same eSIM — no reinstall needed."
          />
          <Faq
            q="Do I need to remove the eSIM when I get home?"
            a="No. Just switch it off in Settings — it'll stay installed silently. Next time you travel to the same country you can reuse it (if validity hasn't expired) or top it up. Most modern phones can hold 8+ eSIM profiles."
          />
          <Faq
            q="Why is Sinai Taxi cheaper than carrier roaming?"
            a="Roaming bundles are profit centres for your home carrier — you're paying retail for the carrier's relationship with the foreign network. We buy the same wholesale data Airalo negotiates directly with 600+ carriers worldwide and pass most of the saving on."
          />
          <Faq
            q="Is my payment safe?"
            a="Yes. We use Stripe — PCI-DSS Level 1, the highest tier — to process every payment. Sinai Taxi never sees or stores your card number; only Stripe does. You can verify the lock icon and Stripe-issued certificate on every checkout page."
          />
        </dl>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-4xl font-extrabold tracking-tightest">
            Ready when you are.
          </h2>
          <p className="mt-4 text-white/75 max-w-xl mx-auto">
            Pick a country, install your eSIM, board the plane.
            One less thing to worry about.
          </p>
          <Link href="/" className="btn-primary mt-8 !bg-white !text-ink-900 hover:!bg-ink-100">
            <Globe2 className="h-4 w-4" />
            Browse 200+ destinations
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

const Step: React.FC<{
  n: number;
  icon: React.ReactNode;
  title: string;
  body: string;
  tip: string;
}> = ({ n, icon, title, body, tip }) => (
  <li className="rounded-3xl border border-ink-100 bg-white p-7 hover:shadow-soft transition">
    <div className="flex items-center gap-3 mb-4">
      <span className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
        {icon}
      </span>
      <span className="text-xs font-bold tracking-widest uppercase text-brand-600">
        Step {n}
      </span>
    </div>
    <h3 className="text-xl font-bold tracking-tight">{title}</h3>
    <p className="mt-2 text-ink-600 leading-relaxed">{body}</p>
    <p className="mt-4 text-sm rounded-2xl bg-brand-50 border border-brand-100 px-3 py-2 text-brand-900">
      <Sparkles className="inline h-3.5 w-3.5 mr-1 text-brand-500" />
      <strong>Tip:</strong> {tip}
    </p>
  </li>
);

const InstallCol: React.FC<{ title: string; steps: string[] }> = ({ title, steps }) => (
  <div className="rounded-3xl border border-ink-100 bg-white p-6">
    <h3 className="text-lg font-bold tracking-tight mb-4">{title}</h3>
    <ol className="space-y-3">
      {steps.map((s, i) => (
        <li key={i} className="flex gap-3 text-sm text-ink-700">
          <span className="flex-shrink-0 grid place-items-center w-6 h-6 rounded-full bg-ink-900 text-white text-xs font-bold">
            {i + 1}
          </span>
          <span className="leading-snug pt-0.5">{s}</span>
        </li>
      ))}
    </ol>
  </div>
);

const Trouble: React.FC<{ symptom: string; fix: string }> = ({ symptom, fix }) => (
  <div className="rounded-3xl border border-ink-100 bg-white p-5">
    <div className="text-sm font-bold text-amber-700 mb-1">{symptom}</div>
    <p className="text-sm text-ink-700 leading-relaxed">{fix}</p>
  </div>
);

const Faq: React.FC<{ q: string; a: string }> = ({ q, a }) => (
  <details className="group rounded-2xl border border-ink-100 bg-white open:shadow-soft transition">
    <summary className="list-none cursor-pointer px-5 py-4 flex items-center justify-between gap-4 font-bold text-ink-900">
      <span>{q}</span>
      <ChevronRight className="h-4 w-4 text-ink-400 transition-transform group-open:rotate-90 flex-shrink-0" />
    </summary>
    <p className="px-5 pb-5 text-ink-700 leading-relaxed">{a}</p>
  </details>
);
