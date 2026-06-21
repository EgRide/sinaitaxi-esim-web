import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Smartphone, QrCode, Settings, Wifi, ChevronRight,
  Apple, CheckCircle2, AlertCircle, Globe2,
} from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { JsonLd, schemas } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'How to install an eSIM · iPhone & Android step-by-step',
  description:
    'Complete eSIM installation guide for iPhone and Android. QR code scan, manual entry, and network setup — with troubleshooting for the most common issues travellers hit.',
  alternates: { canonical: '/install-esim' },
};

const INSTALL_FAQ = [
  {
    question: 'Which iPhones support eSIM?',
    answer: 'iPhone XS, XS Max, XR and every model after. iPhones bought in the US since the iPhone 14 are eSIM-only (no physical SIM tray). Older iPhones such as the iPhone X, 8, and 7 do not support eSIM and need a physical travel SIM instead.',
  },
  {
    question: 'Which Android phones support eSIM?',
    answer: 'Most flagships since 2019: Samsung Galaxy S20 series and later, Pixel 3 and later, OnePlus 11/12, Xiaomi 13/14, Huawei P40 and later (where Google services are present). Not all regional variants ship with eSIM enabled — for example, some Samsung Galaxy phones sold in Hong Kong, China and India do not have eSIM hardware.',
  },
  {
    question: 'How long does activation take?',
    answer: 'Installation itself takes about 60 seconds. Activation on the foreign network happens automatically when you switch on the line at your destination — usually within 1–3 minutes of landing and turning off airplane mode.',
  },
  {
    question: 'I scanned the QR code but nothing happens',
    answer: 'On iPhone, open the camera app first, point at the QR code, and tap the yellow banner that appears at the top. Direct scanning from inside Settings sometimes fails. On Android, you may need to open Settings → Mobile network → Add eSIM → Scan QR before scanning.',
  },
  {
    question: 'My phone says "No service" after landing',
    answer: 'Toggle airplane mode off and on. Then go to Settings → Cellular → tap your travel line → make sure Data Roaming is enabled FOR THAT LINE specifically. Yes, you need data roaming on even though it is a local eSIM.',
  },
  {
    question: 'Can I use the eSIM on more than one device?',
    answer: 'No. An eSIM profile can only be installed on one device. The QR code is single-use. If you accidentally remove the profile, contact support and we will re-issue.',
  },
];

export default function InstallEsimPage() {
  return (
    <>
      <JsonLd data={schemas.faq(INSTALL_FAQ)} />
      <JsonLd data={schemas.breadcrumbs([
        { name: 'Home', url: 'https://esim.sinaitaxi.com/' },
        { name: 'Install an eSIM', url: 'https://esim.sinaitaxi.com/install-esim' },
      ])} />

      <PageHero
        eyebrow="eSIM setup guide"
        title="How to install your eSIM."
        subtitle="Sixty seconds, one QR code, two ways to do it. This is the universal guide — your specific receipt page also shows model-specific instructions pulled directly from the carrier."
      />

      {/* Quick chips */}
      <section className="border-y border-ink-100 bg-ink-50/40">
        <div className="mx-auto max-w-5xl px-6 py-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold uppercase tracking-wider text-ink-500 mr-2">Jump to</span>
          {[
            ['#iphone',         '🍎 iPhone'],
            ['#android',        '🤖 Android'],
            ['#post-install',   'After install'],
            ['#troubleshoot',   'Troubleshoot'],
            ['#faq',            'FAQ'],
          ].map(([href, label]) => (
            <Link key={href} href={href}
              className="rounded-full bg-white border border-ink-200 hover:border-brand-300 hover:text-ink-900 transition px-3 py-1 font-semibold text-ink-600">
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* When to install */}
      <section className="bg-ink-900 text-white">
        <div className="mx-auto max-w-5xl px-6 py-10 flex flex-col sm:flex-row items-start gap-5">
          <span className="grid place-items-center w-12 h-12 rounded-2xl bg-white/10 flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-accent-400" />
          </span>
          <div className="flex-1">
            <h2 className="text-xl font-bold tracking-tight">
              Install <strong className="text-accent-400">before</strong> you fly. Activate <strong className="text-accent-400">when</strong> you land.
            </h2>
            <p className="mt-2 text-white/75 leading-relaxed">
              Most plans start their validity countdown the moment data is
              first used — not the moment you buy. Install the QR code while
              you&apos;re still on Wi-Fi at home, then keep the travel line
              switched off until you&apos;re at the gate or just landed.
              You&apos;ll get the full validity window.
            </p>
          </div>
        </div>
      </section>

      {/* iPhone */}
      <section id="iphone" className="mx-auto max-w-5xl px-6 py-20">
        <div className="flex items-center gap-3 mb-8">
          <span className="grid place-items-center w-12 h-12 rounded-2xl bg-ink-900 text-white">
            <Apple className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tightest">On iPhone</h2>
            <p className="text-ink-500 text-sm mt-1">iPhone XS or later, running iOS 16+</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Method
            icon={<QrCode className="h-5 w-5" />}
            title="Scan the QR code (recommended)"
            steps={[
              'Open the receipt page on a second device (or print the QR).',
              'On the iPhone you want to install on, open Settings → Cellular (or Mobile Data).',
              'Tap "Add eSIM" — choose "Use QR code".',
              'Point the camera at the QR. iOS detects it in 1–2 seconds.',
              'Confirm the carrier name and tap Continue. Label this line "Travel" so it doesn’t get confused with your home line.',
              'Set the travel line as your Mobile Data line. Keep your home line for calls and texts.',
            ]}
          />
          <Method
            icon={<Settings className="h-5 w-5" />}
            title="Manual entry (if QR fails)"
            steps={[
              'Settings → Cellular → Add eSIM → Use QR Code → "Enter Details Manually".',
              'On your receipt page, expand the "Show activation code" section. Copy the SM-DP+ address and activation code.',
              'Paste both into the iPhone fields exactly as shown — they are case-sensitive.',
              'Tap Next and confirm. Label and assign the line as above.',
            ]}
          />
        </div>
      </section>

      {/* Android */}
      <section id="android" className="bg-ink-50/40 border-y border-ink-100">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="grid place-items-center w-12 h-12 rounded-2xl bg-ink-900 text-white">
              <Smartphone className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tightest">On Android</h2>
              <p className="text-ink-500 text-sm mt-1">Samsung, Pixel, Xiaomi, OnePlus, Motorola, etc.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Method
              icon={<QrCode className="h-5 w-5" />}
              title="Scan the QR code"
              steps={[
                'Settings → Connections (or Network) → SIM manager OR Mobile network → Add eSIM.',
                'Wait briefly while the phone searches for a carrier — eventually it offers "Scan carrier QR code".',
                'Tap Scan and point at the QR.',
                'Confirm the carrier name. Rename the profile "Travel".',
                'Toggle the new line as the default for Mobile Data.',
              ]}
            />
            <Method
              icon={<Settings className="h-5 w-5" />}
              title="Manual entry / different brands"
              steps={[
                'On Pixel: Settings → Network & internet → SIMs → Download a SIM instead.',
                'On Samsung: Settings → Connections → SIM manager → Add eSIM → "Enter activation code".',
                'On Xiaomi: Settings → SIMs & mobile networks → Add eSIM → "Don’t have a QR code?".',
                'Paste the SM-DP+ address and activation code from your receipt.',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Post-install */}
      <section id="post-install" className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center mb-12">
          <span className="chip mb-4">After installation</span>
          <h2 className="text-4xl font-extrabold tracking-tightest">
            One last setup pass when you land.
          </h2>
          <p className="mt-4 text-lg text-ink-600 max-w-2xl mx-auto">
            The eSIM is installed but inactive in your home country.
            These steps activate it the moment you arrive.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <Step
            n={1}
            icon={<Wifi className="h-5 w-5" />}
            title="Turn airplane mode on, then off"
            body="Forces the phone to scan for the local network — picks up the travel eSIM&apos;s carrier in 30–60 seconds."
          />
          <Step
            n={2}
            icon={<Smartphone className="h-5 w-5" />}
            title="Verify the travel line is your data line"
            body="Settings → Cellular / Mobile Network → Mobile Data → pick the travel line. Calls and SMS stay on your home line."
          />
          <Step
            n={3}
            icon={<Globe2 className="h-5 w-5" />}
            title="Enable data roaming on the travel line"
            body="Yes, even though it&apos;s a local eSIM. Settings → tap the travel line → Data Roaming → ON. This is the single biggest source of &quot;no service&quot; tickets."
          />
          <Step
            n={4}
            icon={<CheckCircle2 className="h-5 w-5" />}
            title="Test"
            body="Open a maps app — if a tile loads without Wi-Fi, you&apos;re connected. Apps that were already running may need a restart to switch to mobile data."
          />
        </div>
      </section>

      {/* Troubleshooting */}
      <section id="troubleshoot" className="bg-ink-50/40 border-y border-ink-100">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="text-center mb-12">
            <span className="chip mb-4">When it doesn&apos;t just work</span>
            <h2 className="text-4xl font-extrabold tracking-tightest">Troubleshooting</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <Trouble symptom="QR code won't scan" fix="On iPhone, scan from the standalone Camera app and tap the banner — not from inside Settings. On Android, only scan from the eSIM picker (Settings path above)." />
            <Trouble symptom='"This code is no longer valid"' fix="An eSIM profile can only be installed once. If you accidentally removed it from a device, the QR is dead — contact us and we'll re-issue. Don't try to re-scan." />
            <Trouble symptom="No service after landing" fix="Toggle airplane mode. Then enable Data Roaming on the travel line specifically (it's a separate toggle per line, not a global setting)." />
            <Trouble symptom="Slower than expected" fix="If you bought an Unlimited plan, check the fair-usage policy on the plan card — most are full speed up to 1–3 GB/day, then throttled." />
            <Trouble symptom="iPhone keeps using my home line for data" fix="Settings → Cellular → Mobile Data → select the travel line. Also turn off &quot;Allow Mobile Data Switching&quot; if you want to force the travel line." />
            <Trouble symptom="Can't make calls from the travel line" fix="Most travel eSIMs are data-only by design. Use WhatsApp / FaceTime / Signal for calls. Your home number still works for incoming calls and SMS." />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
        <div className="text-center mb-10">
          <span className="chip mb-4">FAQ</span>
          <h2 className="text-4xl font-extrabold tracking-tightest">Common questions</h2>
        </div>
        <dl className="space-y-3">
          {INSTALL_FAQ.map(({ question, answer }) => (
            <details key={question} className="group rounded-2xl border border-ink-100 bg-white open:shadow-soft transition">
              <summary className="list-none cursor-pointer px-5 py-4 flex items-center justify-between gap-4 font-bold text-ink-900">
                <span>{question}</span>
                <ChevronRight className="h-4 w-4 text-ink-400 transition-transform group-open:rotate-90 flex-shrink-0" />
              </summary>
              <p className="px-5 pb-5 text-ink-700 leading-relaxed">{answer}</p>
            </details>
          ))}
        </dl>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-4xl font-extrabold tracking-tightest">
            Ready when you are.
          </h2>
          <p className="mt-4 text-white/75">
            Pick a destination and we&apos;ll get you online.
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

const Method: React.FC<{ icon: React.ReactNode; title: string; steps: string[] }> = ({ icon, title, steps }) => (
  <div className="rounded-3xl border border-ink-100 bg-white p-6">
    <div className="flex items-center gap-2.5 mb-4">
      <span className="grid place-items-center w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
        {icon}
      </span>
      <h3 className="text-lg font-bold tracking-tight">{title}</h3>
    </div>
    <ol className="space-y-2.5">
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

const Step: React.FC<{ n: number; icon: React.ReactNode; title: string; body: string }> = ({ n, icon, title, body }) => (
  <div className="rounded-3xl border border-ink-100 bg-white p-7">
    <div className="flex items-center gap-3 mb-4">
      <span className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
        {icon}
      </span>
      <span className="text-xs font-bold tracking-widest uppercase text-brand-600">Step {n}</span>
    </div>
    <h3 className="text-xl font-bold tracking-tight">{title}</h3>
    <p className="mt-2 text-ink-600 leading-relaxed">{body}</p>
  </div>
);

const Trouble: React.FC<{ symptom: string; fix: string }> = ({ symptom, fix }) => (
  <div className="rounded-3xl border border-ink-100 bg-white p-5">
    <div className="text-sm font-bold text-amber-700 mb-1">{symptom}</div>
    <p className="text-sm text-ink-700 leading-relaxed">{fix}</p>
  </div>
);
