'use client';

// Top-up flow: pick a package → confirm → Stripe Elements modal.
// The Stripe Elements provider is created once we have a
// clientSecret from the /v1/topup-checkout endpoint.
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Database, Clock, ChevronRight, ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import { api, type TopupPackage } from '@/lib/api';
import { cn } from '@/lib/cn';
import { fmtPrice } from '@/lib/price';
import { PolicyAgreement } from '@/app/(public)/destinations/[code]/CheckoutForm';

interface Props {
  orderId: string;
  packages: TopupPackage[];
}

let _stripeP: Promise<Stripe | null> | null = null;
const stripeP = () => {
  if (!_stripeP) {
    const k = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!k) throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY not set');
    _stripeP = loadStripe(k);
  }
  return _stripeP;
};

export const TopupPicker: React.FC<Props> = ({ orderId, packages }) => {
  const [selectedId, setSelectedId] = useState<string | null>(packages[0]?.id ?? null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [topupId, setTopupId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Same agreement gate as the main checkout — the customer must
  // accept Terms + Refund Policy before we hit /v1/topup-checkout.
  const [agreed, setAgreed] = useState(false);

  // Order by price ascending — feels right for upsell context.
  const sorted = useMemo(
    () => [...packages].sort((a, b) => a.retailPrice - b.retailPrice),
    [packages],
  );

  const onChoose = async () => {
    if (!selectedId) return;
    if (!agreed) {
      setError('Please accept the Terms of Service and Refund Policy to continue.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await api.topupCheckout({ orderId, packageId: selectedId });
      setClientSecret(res.clientSecret);
      setTopupId(res.topupId);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (clientSecret && topupId) {
    return (
      <div className="mt-8 rounded-3xl bg-white border border-ink-100 shadow-soft p-6">
        <button
          onClick={() => { setClientSecret(null); setTopupId(null); }}
          className="text-sm text-ink-500 hover:text-ink-900 inline-flex items-center gap-1.5 mb-4">
          <ArrowLeft className="h-3.5 w-3.5" />
          Change package
        </button>
        <Elements
          stripe={stripeP()}
          options={{ clientSecret, appearance: { theme: 'stripe' } }}>
          <PayStep topupId={topupId} />
        </Elements>
        <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          Stripe-secured · We never store card details
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-3">
      {sorted.map(pkg => (
        <button
          key={pkg.id}
          onClick={() => setSelectedId(pkg.id)}
          className={cn(
            'w-full text-left rounded-3xl border bg-white p-5 transition',
            'flex items-center justify-between gap-4',
            selectedId === pkg.id
              ? 'border-brand-500 ring-4 ring-brand-100 shadow-soft'
              : 'border-ink-100 hover:border-ink-300',
          )}>
          <div className="min-w-0">
            <div className="font-bold tracking-tight">{pkg.title}</div>
            <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
              <li className="inline-flex items-center gap-1">
                <Database className="h-3.5 w-3.5" />
                {pkg.isUnlimited ? 'Unlimited' : pkg.data}
              </li>
              <li className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {pkg.validity} days
              </li>
            </ul>
            {pkg.shortInfo ? (
              <p className="mt-1 text-xs text-ink-400 line-clamp-2">{pkg.shortInfo}</p>
            ) : null}
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-extrabold tracking-tighter">
              {fmtPrice(pkg.retailPrice, pkg.currency)}
            </div>
            <div className="text-xs text-brand-500 font-semibold inline-flex items-center gap-0.5">
              {selectedId === pkg.id ? 'Selected' : 'Select'}
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </button>
      ))}

      {error ? (
        <p className="text-xs text-red-700 bg-red-50 rounded-2xl px-4 py-3">{error}</p>
      ) : null}

      <PolicyAgreement agreed={agreed} onChange={setAgreed} />

      <button
        onClick={onChoose}
        disabled={!selectedId || busy || !agreed}
        className="w-full rounded-2xl bg-ink-900 text-white font-semibold py-3.5 hover:bg-ink-800 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed">
        {busy ? 'Preparing…' : 'Continue to payment'}
      </button>
    </div>
  );
};

const PayStep: React.FC<{ topupId: string }> = ({ topupId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError(null);
    setSubmitting(true);
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/topups/${topupId}` },
      redirect: 'if_required',
    });
    setSubmitting(false);
    if (result.error) {
      setError(result.error.message ?? 'Payment failed.');
      return;
    }
    router.push(`/topups/${topupId}`);
  };

  return (
    <form onSubmit={onPay} className="flex flex-col gap-4">
      <PaymentElement />
      {error ? (
        <p className="text-xs text-red-700 bg-red-50 rounded-2xl px-4 py-3">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="rounded-2xl bg-ink-900 text-white font-semibold py-3.5 hover:bg-ink-800 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-wait inline-flex items-center justify-center gap-2">
        <Lock className="h-4 w-4" />
        {submitting ? 'Processing…' : 'Pay now'}
      </button>
    </form>
  );
};
