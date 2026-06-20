// Inline checkout within an expanded package card. Two stages:
//   1. EMAIL  — collect email, hit /v1/checkout, receive Stripe
//               PaymentIntent client secret.
//   2. PAYING — render Stripe Elements PaymentElement, confirm,
//               then redirect to /orders/{id} for the fulfilment
//               poller.
'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { ShieldCheck, Mail, ArrowRight, Lock } from 'lucide-react';
import { api, type CustomerPackage } from '@/lib/api';
import { cn } from '@/lib/cn';
import { fmtPrice } from '@/lib/price';

interface Props { pkg: CustomerPackage; }

let _stripe: Promise<Stripe | null> | null = null;
const stripePromise = (): Promise<Stripe | null> => {
  if (_stripe) return _stripe;
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) { _stripe = Promise.resolve(null); return _stripe; }
  _stripe = loadStripe(key);
  return _stripe;
};

export const CheckoutForm: React.FC<Props> = ({ pkg }) => {
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await api.checkout({ packageId: pkg.id, email });
      setOrderId(res.orderId);
      setClientSecret(res.clientSecret);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const elementsOptions = useMemo(
    () => clientSecret
      ? { clientSecret, appearance: { theme: 'stripe' as const, variables: { colorPrimary: '#1E5EFF', borderRadius: '12px' } } }
      : undefined,
    [clientSecret],
  );

  if (clientSecret && orderId) {
    return (
      <Elements stripe={stripePromise()} options={elementsOptions}>
        <PaymentStep orderId={orderId} pkg={pkg} />
      </Elements>
    );
  }

  return (
    <form onSubmit={onStart} className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-bold uppercase tracking-wide text-ink-500">
          Email for receipt + eSIM
        </span>
        <div className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white pl-3 pr-1 py-1 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition">
          <Mail className="h-4 w-4 text-ink-400" />
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 bg-transparent py-2 text-sm focus:outline-none"
          />
        </div>
      </label>
      <button
        type="submit"
        disabled={busy}
        className={cn(
          'btn-primary !py-3 !px-5 disabled:bg-ink-300',
        )}>
        {busy ? 'Preparing…' : (
          <>
            Continue · {fmtPrice(pkg.retailPrice, pkg.currency)}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
      {error ? (
        <p className="sm:col-span-2 mt-1 text-xs text-red-700 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      ) : null}
      <p className="sm:col-span-2 mt-1 inline-flex items-center gap-1.5 text-xs text-ink-500">
        <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
        Stripe-secured · We never store card details
      </p>
    </form>
  );
};

const PaymentStep: React.FC<{ orderId: string; pkg: CustomerPackage }> = ({ orderId, pkg }) => {
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
      confirmParams: { return_url: `${window.location.origin}/orders/${orderId}` },
      redirect: 'if_required',
    });
    setSubmitting(false);
    if (result.error) {
      setError(result.error.message ?? 'Payment failed.');
      return;
    }
    router.push(`/orders/${orderId}`);
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
        {submitting ? 'Processing…' : (
          <>
            <Lock className="h-4 w-4" />
            Pay {fmtPrice(pkg.retailPrice, pkg.currency)}
          </>
        )}
      </button>
    </form>
  );
};
