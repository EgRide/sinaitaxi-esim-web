'use client';

// Polls /v1/orders/:id every 3s until status leaves "pending".
// Renders five layouts depending on status:
//   • pending (fresh)     — spinner + "Confirming payment…"
//   • pending (>30min, has client secret) — Resume Payment with Stripe Elements
//   • pending (>30min, no secret) — "Loading your eSIM…" history view
//   • cancelled           — "This order expired" with CTA to start fresh
//   • fulfilled           — QR + Airalo's localized install steps + usage
//   • fulfillment_failed  — error panel with support contact
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  Database,
  Clock,
  Smartphone,
  QrCode,
  Settings,
  Activity,
  ArrowRight,
  Apple,
  Copy,
  CheckCircle2,
  Wifi,
  XCircle,
  RotateCcw,
  Lock,
} from 'lucide-react';
import { api, type OrderDetail, type InstallInstructions, type UsageSnapshot, type DeviceInstructions } from '@/lib/api';
import { cn } from '@/lib/cn';
import { fmtPrice } from '@/lib/price';

export const OrderPoller: React.FC<{ initial: OrderDetail }> = ({ initial }) => {
  const [order, setOrder] = useState(initial);

  useEffect(() => {
    if (order.status !== 'pending') return;
    let cancelled = false;
    const id = setInterval(async () => {
      try {
        const next = await api.order(order.id);
        if (cancelled) return;
        setOrder(next);
        if (next.status !== 'pending') clearInterval(id);
      } catch {
        // Swallow — keep retrying. Spurious failures during
        // poll shouldn't break the UI.
      }
    }, 3000);
    return () => { cancelled = true; clearInterval(id); };
  }, [order.id, order.status]);

  if (order.status === 'fulfillment_failed') return <Failed order={order} />;
  if (order.status === 'cancelled') return <Expired order={order} />;
  // Pending — three sub-states:
  //   1. Fresh checkout (created within last 5 minutes): keep the
  //      original "Confirming your payment…" copy, the webhook is
  //      either about to fire or already fired and DB just hasn't
  //      caught up.
  //   2. Stale + still has a usable Stripe client secret: customer
  //      bounced off the original payment page and came back via
  //      My eSIMs. Render the Resume Payment surface so they can
  //      finish without creating a duplicate order.
  //   3. Stale + no client secret: in-flight processing race we
  //      can't resume. Show the neutral "Loading your eSIM…" view
  //      and keep polling — usually clears within a few seconds.
  if (order.status === 'pending') {
    const ageMs = Date.now() - Date.parse(order.createdAt ?? '');
    const stale = Number.isFinite(ageMs) && ageMs > 5 * 60_000;
    if (!stale) return <Pending />;
    if (order.stripeClientSecret) return <ResumePayment order={order} clientSecret={order.stripeClientSecret} />;
    return <ResumingHistory />;
  }
  return <Fulfilled order={order} />;
};

const Pending = () => (
  <div className="flex flex-col items-center gap-4 py-16">
    <div className="animate-spin h-10 w-10 rounded-full border-4 border-brand-500 border-t-transparent" />
    <h1 className="text-xl font-bold">Confirming your payment…</h1>
    <p className="text-sm text-ink-600 text-center max-w-sm">
      Your eSIM will appear here in a few seconds. You can leave
      this page open — we'll also email the QR code as soon as
      it's ready.
    </p>
  </div>
);

// Shown when the customer revisits a `pending` order from the
// My eSIMs history list. The original Pending copy ("Confirming
// your payment…") is misleading days after checkout, so we make
// it clear they can still complete the payment without scaring
// them about a duplicate charge.
const ResumingHistory = () => (
  <div className="flex flex-col items-center gap-4 py-16">
    <div className="animate-spin h-10 w-10 rounded-full border-4 border-brand-500 border-t-transparent" />
    <h1 className="text-xl font-bold">Loading your eSIM…</h1>
    <p className="text-sm text-ink-600 text-center max-w-sm">
      If this purchase didn&apos;t complete earlier, you&apos;ll be able to
      resume payment in a moment. No charge has been made twice.
    </p>
  </div>
);

const Failed: React.FC<{ order: OrderDetail }> = ({ order }) => (
  <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
    <h1 className="text-xl font-bold text-red-900">Something went wrong</h1>
    <p className="text-sm text-red-800 mt-2">
      Your payment was received but we couldn't activate the eSIM
      with our provider. Our team has been notified and we'll
      contact you at <strong>{order.email}</strong> with the
      activation details (or a full refund).
    </p>
    <p className="text-xs text-red-700 mt-3">Reference: {order.id}</p>
  </div>
);

// Shown when the 59-minute expiry sweep has flipped the order to
// `cancelled` because the customer never finished paying. Stripe
// has been told to cancel the PaymentIntent at the same time, so
// the card isn't held. Customers can simply start a new order.
const Expired: React.FC<{ order: OrderDetail }> = ({ order }) => (
  <div className="rounded-3xl border border-ink-100 bg-white p-6 sm:p-8 text-center">
    <div className="grid place-items-center w-14 h-14 rounded-2xl bg-ink-100 text-ink-500 mx-auto mb-4">
      <XCircle className="h-7 w-7" />
    </div>
    <h1 className="text-2xl font-extrabold tracking-tight">This order expired</h1>
    <p className="text-sm text-ink-600 mt-2 max-w-sm mx-auto leading-relaxed">
      We couldn&apos;t complete the payment within the 60-minute hold window
      so the order was cancelled automatically. No charge was made.
    </p>
    <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
      <Link href="/" className="btn-primary !text-sm">
        Browse destinations
      </Link>
      <Link href="/account/esims" className="btn-secondary !text-sm">
        Back to My eSIMs
      </Link>
    </div>
    <p className="text-[11px] text-ink-400 mt-4">Reference: {order.id}</p>
  </div>
);

// Lazy-init Stripe client. The same pattern as CheckoutForm — kept
// local so this file remains self-contained.
let _stripe: Promise<Stripe | null> | null = null;
const stripePromise = (): Promise<Stripe | null> => {
  if (_stripe) return _stripe;
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) { _stripe = Promise.resolve(null); return _stripe; }
  _stripe = loadStripe(key);
  return _stripe;
};

// Resume Payment — re-mounts Stripe Elements with the original
// clientSecret so the customer can finish a checkout they
// abandoned earlier. We re-use the same PaymentIntent so no new
// order row is created, and the existing receipt_email + metadata
// (orderId, packageId) stay attached so the webhook still fulfills
// correctly when payment completes.
const ResumePayment: React.FC<{ order: OrderDetail; clientSecret: string }> = ({
  order,
  clientSecret,
}) => {
  const options = useMemo(
    () => ({
      clientSecret,
      appearance: {
        theme: 'stripe' as const,
        variables: { colorPrimary: '#1E5EFF', borderRadius: '12px' },
      },
    }),
    [clientSecret],
  );

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-white border border-amber-200 p-5 sm:p-6">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
          Payment pending
        </span>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight">
          Finish your purchase
        </h1>
        <p className="text-sm text-ink-600 mt-2 leading-relaxed">
          We saved your order. You have less than an hour from when
          you started to complete payment — after that the order is
          automatically cancelled. <strong>No charge has been made yet.</strong>
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-ink-100 font-semibold">
            {order.package.data}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-ink-100 font-semibold">
            {order.package.validity} days
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-ink-100 font-bold text-brand-700">
            {fmtPrice(order.retailPrice, order.currency)}
          </span>
        </div>
      </div>

      <div className="rounded-3xl bg-white border border-ink-100 shadow-soft p-5 sm:p-6">
        <Elements stripe={stripePromise()} options={options}>
          <ResumePaymentForm order={order} />
        </Elements>
      </div>

      <p className="text-xs text-ink-500 text-center">
        Want to start over? <Link href="/" className="font-semibold text-brand-700 hover:underline">Browse other plans</Link>
      </p>
    </div>
  );
};

const ResumePaymentForm: React.FC<{ order: OrderDetail }> = ({ order }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError(null);
    setSubmitting(true);
    const result = await stripe.confirmPayment({
      elements,
      // Land back on the same /orders/:id page; the poller will
      // detect status===fulfilled within seconds and swap to the
      // Fulfilled view automatically.
      confirmParams: { return_url: `${window.location.origin}/orders/${order.id}` },
      redirect: 'if_required',
    });
    setSubmitting(false);
    if (result.error) {
      setError(result.error.message ?? 'Payment failed.');
      return;
    }
    // Force a refresh so the poller re-runs and we don't have to
    // wait for the 3s interval.
    window.location.reload();
  };

  return (
    <form onSubmit={onPay} className="flex flex-col gap-4">
      <PaymentElement />
      {error ? (
        <p className="text-xs text-red-700 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={!stripe || submitting}
        className={cn('btn-primary disabled:bg-ink-300')}>
        {submitting ? (
          'Processing…'
        ) : (
          <>
            <Lock className="h-4 w-4" />
            Pay {fmtPrice(order.retailPrice, order.currency)}
          </>
        )}
      </button>
      <p className="inline-flex items-center justify-center gap-1.5 text-xs text-ink-500">
        <RotateCcw className="h-3 w-3" />
        Same order — finishing this completes the original purchase
      </p>
    </form>
  );
};

const Fulfilled: React.FC<{ order: OrderDetail }> = ({ order }) => {
  const [instructions, setInstructions] = useState<InstallInstructions | null>(null);
  const [usage, setUsage] = useState<UsageSnapshot | null>(null);

  const fetchUsage = async () => {
    try {
      const next = await api.usage(order.id);
      setUsage(next);
    } catch { /* ignore — keep last good snapshot */ }
  };
  useEffect(() => {
    // Fetch once on mount — instructions don't change.
    api.installInstructions(order.id).then(setInstructions).catch(() => {});
    // Usage refreshes on each tab focus + initial mount.
    void fetchUsage();
    const onFocus = () => { void fetchUsage(); };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.id]);

  const iccid = instructions?.iccid ?? null;

  return (
    <div className="space-y-6">
      {/* Hero — order summary */}
      <div className="rounded-3xl bg-gradient-to-br from-brand-50 via-white to-accent-50 border border-brand-100 p-6">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
          Activated
        </span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Your eSIM is ready</h1>
        <p className="text-sm text-ink-600 mt-1">
          Receipt + activation instructions sent to <strong>{order.email}</strong>.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-ink-100 font-semibold">
            <Database className="h-3.5 w-3.5 text-ink-500" />
            {order.package.data}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-ink-100 font-semibold">
            <Clock className="h-3.5 w-3.5 text-ink-500" />
            {order.package.validity} days
          </span>
          {iccid ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-ink-100 font-mono text-[11px] text-ink-500">
              ICCID {iccid.slice(-10)}
            </span>
          ) : null}
        </div>
      </div>

      {/* Live usage card */}
      {usage?.data?.data ? <UsageCard usage={usage} onRefresh={fetchUsage} /> : null}

      {/* QR + install instructions */}
      <InstallCard instructions={instructions} />

      {/* Top-up CTA */}
      {iccid ? (
        <Link
          href={`/orders/${order.id}/topup`}
          className="block rounded-3xl bg-ink-900 text-white p-5 hover:bg-ink-800 transition group">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-white/60">
                Running low?
              </div>
              <div className="mt-1 text-xl font-extrabold">Top up this eSIM</div>
              <div className="text-sm text-white/70 mt-0.5">
                Add more data without reinstalling.
              </div>
            </div>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition" />
          </div>
        </Link>
      ) : null}
    </div>
  );
};

// ── Live usage ────────────────────────────────────────────────
const UsageCard: React.FC<{
  usage: UsageSnapshot;
  onRefresh: () => Promise<void> | void;
}> = ({ usage, onRefresh }) => {
  const u = usage.data.data;
  const [refreshing, setRefreshing] = useState(false);
  if (!u) return null;
  const usedMb = u.total - u.remaining;
  const pct = u.total > 0 ? Math.min(100, Math.round((usedMb / u.total) * 100)) : 0;
  const daysLeft = u.expired_at ? Math.max(0, Math.ceil((new Date(u.expired_at).getTime() - Date.now()) / 86400000)) : null;

  const click = async () => {
    setRefreshing(true);
    try { await onRefresh(); } finally { setRefreshing(false); }
  };

  return (
    <div className="rounded-3xl bg-white border border-ink-100 shadow-soft p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-9 h-9 rounded-2xl bg-brand-50 text-brand-700">
            <Activity className="h-4.5 w-4.5" />
          </span>
          <h2 className="font-bold tracking-tight">Live usage</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={click}
            disabled={refreshing}
            aria-label="Refresh usage"
            className="grid place-items-center w-7 h-7 rounded-full hover:bg-ink-100 disabled:opacity-50 transition">
            <RotateCcw className={cn('h-3.5 w-3.5 text-ink-500', refreshing && 'animate-spin')} />
          </button>
          <span className={cn(
            'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border',
            u.status === 'ACTIVE'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-ink-50 border-ink-200 text-ink-600',
          )}>
            {u.status}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-500 font-semibold">Data left</div>
          <div className="text-2xl font-extrabold tracking-tight">
            {u.is_unlimited ? '∞' : fmtMb(u.remaining)}
          </div>
          {!u.is_unlimited ? (
            <div className="text-xs text-ink-400 mt-0.5">of {fmtMb(u.total)}</div>
          ) : null}
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-500 font-semibold">Expires</div>
          <div className="text-2xl font-extrabold tracking-tight">
            {daysLeft != null ? `${daysLeft}d` : '—'}
          </div>
          <div className="text-xs text-ink-400 mt-0.5">
            {u.expired_at ? new Date(u.expired_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
          </div>
        </div>
      </div>
      {!u.is_unlimited && u.total > 0 ? (
        <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              pct < 75 ? 'bg-emerald-500' : pct < 90 ? 'bg-amber-500' : 'bg-red-500',
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      ) : null}
    </div>
  );
};

// ── QR + steps ────────────────────────────────────────────────
//
// Drives the three-method install flow (QR, manual, network setup)
// for the two platforms (iPhone, Android). Source of truth:
//   • QR image — server-rendered base64 PNG from the LPA activation
//     code, with `qrCodeUrl` (Airalo CDN) as a fallback.
//   • Apple universal link — iOS 17.4+ one-tap install. We only show
//     it on the iPhone tab; tapping skips the QR + manual steps.
//   • Step lists — Airalo's localised payload, keyed by platform +
//     method. If Airalo's payload is missing (instructions === null
//     because their API was unreachable when we tried) we fall back
//     to platform-specific generic steps so the user still has a
//     path to activate.
type Method = 'qr' | 'manual' | 'apn';
type Platform = 'ios' | 'android';

const METHODS: Array<{ key: Method; label: string; icon: React.ReactNode }> = [
  { key: 'qr', label: 'QR install', icon: <QrCode className="h-3.5 w-3.5" /> },
  { key: 'manual', label: 'Manual', icon: <Settings className="h-3.5 w-3.5" /> },
  { key: 'apn', label: 'Network setup', icon: <Wifi className="h-3.5 w-3.5" /> },
];

const InstallCard: React.FC<{ instructions: InstallInstructions | null }> = ({ instructions }) => {
  const [platform, setPlatform] = useState<Platform>(() => detectPlatform());
  const [method, setMethod] = useState<Method>('qr');

  // Pull device steps from Airalo's payload. Airalo returns an array
  // per platform; the first entry is the canonical set for the
  // operator. If it's missing we fall back to FallbackSteps below.
  const airaloPayload = instructions?.instructions?.data?.instructions;
  const devices: DeviceInstructions[] = airaloPayload ? airaloPayload[platform] ?? [] : [];
  const device = devices[0];
  const steps = device ? stepsFor(device, method) : undefined;

  // Activation code displayed on the manual + QR cards. Prefer the
  // structured Airalo field if present, else the LPA string we
  // built server-side from sm-dp+ + matching id.
  const activationCode =
    device?.installation_via_qr_code?.smdp_address_and_activation_code ??
    instructions?.lpa ??
    null;

  const qrSrc = instructions?.qrCode ?? instructions?.qrCodeUrl ?? null;

  return (
    <div className="rounded-3xl bg-white border border-ink-100 shadow-soft p-5 sm:p-6">
      {/* Header — section title + iPhone/Android pill */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-9 h-9 rounded-2xl bg-brand-50 text-brand-700">
            <Smartphone className="h-4.5 w-4.5" />
          </span>
          <h2 className="font-bold tracking-tight text-lg">Install your eSIM</h2>
        </div>
        <div role="tablist" aria-label="Platform" className="inline-flex bg-ink-100 rounded-full p-1">
          {(['ios', 'android'] as const).map(p => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={platform === p}
              onClick={() => setPlatform(p)}
              className={cn(
                'px-4 py-1.5 text-xs font-semibold rounded-full transition',
                platform === p ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-900',
              )}>
              {p === 'ios' ? 'iPhone' : 'Android'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-5 sm:gap-6">
        {/* Left column — QR + activation code + iOS one-tap */}
        <div className="space-y-3">
          <div className="rounded-2xl bg-ink-50 border border-ink-100 p-4 flex flex-col items-center">
            {qrSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrSrc}
                alt="eSIM QR code"
                className="w-52 h-52 object-contain rounded-xl bg-white p-2"
              />
            ) : (
              <div className="w-52 h-52 grid place-items-center text-xs text-ink-500 bg-white rounded-xl">
                QR unavailable
              </div>
            )}
            <p className="text-xs text-ink-600 mt-3 text-center leading-relaxed">
              Scan with your phone&apos;s <strong>camera</strong>, then follow the prompt.
              Make sure the device is on <strong>Wi-Fi</strong> first.
            </p>
          </div>

          {/* iOS 17.4+ one-tap install — only renders on iPhone tab */}
          {platform === 'ios' && instructions?.appleInstallUrl ? (
            <a
              href={instructions.appleInstallUrl}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-ink-900 text-white text-sm font-semibold hover:bg-ink-800 transition">
              <span className="flex items-center gap-2">
                <Apple className="h-4 w-4" />
                Install on this iPhone
              </span>
              <ArrowRight className="h-4 w-4" />
            </a>
          ) : null}

          {/* Activation code — collapsible so the QR stays the hero */}
          {activationCode ? <ActivationCode code={activationCode} /> : null}
        </div>

        {/* Right column — method tabs + steps */}
        <div>
          <div role="tablist" aria-label="Install method" className="flex flex-wrap gap-1.5 mb-4">
            {METHODS.map(t => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={method === t.key}
                onClick={() => setMethod(t.key)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition',
                  method === t.key
                    ? 'bg-ink-900 text-white border-ink-900 shadow-sm'
                    : 'bg-white text-ink-600 border-ink-200 hover:border-ink-400 hover:text-ink-900',
                )}>
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {steps && Object.keys(steps).length > 0 ? (
            <StepsList steps={steps} />
          ) : (
            <FallbackSteps platform={platform} method={method} />
          )}

          {/* APN extras — when on Network setup, render the carrier's
              APN value so users can copy/paste into Settings. */}
          {method === 'apn' && device?.network_setup?.apn_value ? (
            <div className="mt-4 rounded-2xl bg-brand-50 border border-brand-100 p-4">
              <div className="text-[11px] uppercase tracking-widest font-bold text-brand-700">APN</div>
              <code className="block mt-1 font-mono text-sm text-ink-900 break-all">
                {device.network_setup.apn_value}
              </code>
              {device.network_setup.apn_type ? (
                <div className="text-xs text-ink-600 mt-1">
                  Type: <span className="font-semibold">{device.network_setup.apn_type}</span>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// Activation code panel — collapsible, with a one-tap copy button.
// Used for both the LPA string (QR install fallback) and the
// sm-dp+ + matching id pair (manual install path).
const ActivationCode: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — user can still long-press to copy */
    }
  };
  return (
    <details className="rounded-2xl bg-white border border-ink-100 group">
      <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between text-xs font-semibold text-ink-700 hover:text-ink-900">
        <span>Activation code (for manual install)</span>
        <span className="text-ink-400 group-open:rotate-180 transition">⌄</span>
      </summary>
      <div className="px-4 pb-3 -mt-1">
        <code className="block break-all rounded-lg bg-ink-50 border border-ink-100 px-3 py-2 font-mono text-[11px] text-ink-900">
          {code}
        </code>
        <button
          type="button"
          onClick={onCopy}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-700 hover:text-ink-900">
          {copied ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy code
            </>
          )}
        </button>
      </div>
    </details>
  );
};

// Renders Airalo's numeric step map sorted by key. The parent gates
// rendering on non-empty steps so the empty-list fallback lives upstream.
const StepsList: React.FC<{ steps: Record<string, string> }> = ({ steps }) => {
  const entries = Object.entries(steps).sort(([a], [b]) => Number(a) - Number(b));
  return (
    <ol className="space-y-2.5">
      {entries.map(([n, text]) => (
        <li key={n} className="flex gap-3 text-sm">
          <span className="flex-shrink-0 grid place-items-center w-6 h-6 rounded-full bg-ink-900 text-white text-xs font-bold">
            {n}
          </span>
          <span className="text-ink-700 leading-snug">{text}</span>
        </li>
      ))}
    </ol>
  );
};

// Used when Airalo's localised payload is missing OR when their steps
// map for the selected method is empty. We hand-roll iPhone vs Android
// variants per method so a customer who lands on Manual or Network
// setup never sees an empty pane.
const FALLBACK_STEPS: Record<Platform, Record<Method, string[]>> = {
  ios: {
    qr: [
      'Open Settings → Cellular (or Mobile Data).',
      'Tap "Add eSIM" → "Use QR Code".',
      "Scan the QR code on the left with your phone's camera.",
      'Label the new plan, e.g. "Travel eSIM".',
      'After landing, enable Data Roaming on this plan.',
    ],
    manual: [
      'Open Settings → Cellular → Add eSIM → Enter Details Manually.',
      'Tap "Show activation code" on the left and copy it.',
      'Paste it as the SM-DP+ address + activation code.',
      'Confirm the plan details, then label it.',
      'Enable Data Roaming when you arrive.',
    ],
    apn: [
      'Settings → Cellular → choose the travel eSIM line.',
      'Tap "Cellular Data Network".',
      'Enter the APN value shown below in the APN field.',
      'Toggle the line on and enable Data Roaming.',
    ],
  },
  android: {
    qr: [
      'Open Settings → Network & Internet → SIMs (or Mobile Network).',
      'Tap "Add eSIM" or "Download a SIM instead".',
      "Scan the QR code on the left with your phone's camera.",
      'Confirm the plan and give it a label.',
      'Enable Roaming on the new plan after you land.',
    ],
    manual: [
      'Settings → Network & Internet → SIMs → Add eSIM.',
      'Choose "Enter manually" (label varies by manufacturer).',
      'Paste the activation code shown on the left.',
      'Confirm and label the plan.',
      'Enable Roaming on this line when abroad.',
    ],
    apn: [
      'Settings → Network & Internet → SIMs → choose the travel eSIM.',
      'Tap "Access Point Names" → "+" to add a new APN.',
      'Use the APN value shown below; leave other fields blank.',
      'Save → set the new APN as active.',
    ],
  },
};

const FallbackSteps: React.FC<{ platform: Platform; method: Method }> = ({ platform, method }) => {
  const list = FALLBACK_STEPS[platform][method];
  return (
    <ol className="space-y-2.5 text-sm text-ink-700">
      {list.map((text, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex-shrink-0 grid place-items-center w-6 h-6 rounded-full bg-ink-900 text-white text-xs font-bold">
            {i + 1}
          </span>
          <span className="leading-snug">{text}</span>
        </li>
      ))}
    </ol>
  );
};

// ── Helpers ───────────────────────────────────────────────────
const stepsFor = (
  device: DeviceInstructions,
  method: 'qr' | 'manual' | 'apn',
): Record<string, string> | undefined => {
  if (method === 'qr') return device.installation_via_qr_code?.steps;
  if (method === 'manual') return device.installation_manual?.steps;
  return device.network_setup?.steps;
};

const detectPlatform = (): 'ios' | 'android' => {
  if (typeof navigator === 'undefined') return 'ios';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('android')) return 'android';
  return 'ios';
};

const fmtMb = (mb: number): string => {
  if (mb >= 1024) return `${(mb / 1024).toFixed(mb >= 10240 ? 0 : 1)} GB`;
  return `${Math.round(mb)} MB`;
};

