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
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Lock, LogIn } from 'lucide-react';
import { api, type CustomerPackage } from '@/lib/api';
import { cn } from '@/lib/cn';
import { fmtPrice } from '@/lib/price';

export interface CheckoutUser {
  id: string;
  email: string;
  fullName?: string | null;
}

interface Props {
  pkg: CustomerPackage;
  /** Signed-in customer. `null` triggers the "Sign in to buy" gate. */
  user: CheckoutUser | null;
  /** Path to come back to after login (`/destinations/[code]`). */
  loginNext: string;
}

let _stripe: Promise<Stripe | null> | null = null;
const stripePromise = (): Promise<Stripe | null> => {
  if (_stripe) return _stripe;
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) { _stripe = Promise.resolve(null); return _stripe; }
  _stripe = loadStripe(key);
  return _stripe;
};

export const CheckoutForm: React.FC<Props> = ({ pkg, user, loginNext }) => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setBusy(true);
    try {
      const res = await api.checkout({
        packageId: pkg.id,
        email: user.email,
        customerId: user.id,
      });
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

  // Not signed in → show login gate instead of the email form.
  if (!user) {
    return (
      <div className="rounded-2xl border border-brand-100 bg-brand-50/50 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid place-items-center w-10 h-10 rounded-2xl bg-white border border-brand-200 flex-shrink-0">
            <LogIn className="h-4 w-4 text-brand-600" />
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-ink-900">Sign in to buy this eSIM</h3>
            <p className="text-sm text-ink-600 mt-1">
              Same account as the Sinai Taxi mobile app. Sign in so we can
              email you the QR code, save it under <strong>My eSIMs</strong>,
              and let you top it up later.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/login?next=${encodeURIComponent(loginNext)}`}
                className="btn-primary !py-2.5 !px-4 !text-sm">
                <LogIn className="h-4 w-4" />
                Sign in to continue
              </Link>
              <a
                href="https://sinaitaxi.com/register"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary !py-2.5 !px-4 !text-sm">
                Create an account
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onStart} className="space-y-3">
      <div className="rounded-2xl border border-ink-100 bg-ink-50/40 px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-wide text-ink-500">
            Signed in as
          </div>
          <div className="font-semibold text-ink-900 truncate">
            {user.fullName || user.email}
          </div>
        </div>
        <Link
          href={`/login?next=${encodeURIComponent(loginNext)}`}
          className="text-xs font-semibold text-ink-500 hover:text-ink-900 whitespace-nowrap">
          Switch account
        </Link>
      </div>

      <button
        type="submit"
        disabled={busy}
        className={cn('btn-primary !w-full !py-3.5 disabled:bg-ink-300')}>
        {busy ? 'Preparing…' : (
          <>
            Continue · {fmtPrice(pkg.retailPrice, pkg.currency)}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      {error ? (
        <p className="text-xs text-red-700 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      ) : null}

      <p className="inline-flex items-center gap-1.5 text-xs text-ink-500">
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
