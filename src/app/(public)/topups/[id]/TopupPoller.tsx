'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Database } from 'lucide-react';
import { api, type TopupDetail } from '@/lib/api';
import { fmtPrice } from '@/lib/price';

export const TopupPoller: React.FC<{ initial: TopupDetail }> = ({ initial }) => {
  const [topup, setTopup] = useState(initial);

  useEffect(() => {
    if (topup.status !== 'pending') return;
    let cancelled = false;
    const id = setInterval(async () => {
      try {
        const next = await api.topup(topup.id);
        if (cancelled) return;
        setTopup(next);
        if (next.status !== 'pending') clearInterval(id);
      } catch {
        /* swallow */
      }
    }, 3000);
    return () => { cancelled = true; clearInterval(id); };
  }, [topup.id, topup.status]);

  if (topup.status === 'pending') {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-brand-500 border-t-transparent" />
        <h1 className="text-xl font-bold">Activating your top-up…</h1>
        <p className="text-sm text-ink-600 text-center max-w-sm">
          Your payment went through. We're attaching the new data
          to your eSIM. This usually takes a few seconds.
        </p>
      </div>
    );
  }

  if (topup.status === 'fulfillment_failed') {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-xl font-bold text-red-900">Top-up failed</h1>
        <p className="text-sm text-red-800 mt-2">
          Your payment was received but the top-up couldn't be
          attached to your eSIM. Our team has been notified and
          will contact you at <strong>{topup.email}</strong> with
          a full refund or alternative.
        </p>
        <p className="text-xs text-red-700 mt-3">Reference: {topup.id}</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700">
        <CheckCircle2 className="h-4 w-4" /> Top-up active
      </span>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
        {topup.package.isUnlimited ? 'Unlimited data' : topup.package.data} added
      </h1>
      <p className="text-sm text-ink-700 mt-1">
        Your eSIM now has fresh data attached. Receipt sent to{' '}
        <strong>{topup.email}</strong>.
      </p>

      <div className="mt-5 grid sm:grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4">
          <div className="text-xs uppercase tracking-wider text-ink-500 font-semibold">Data added</div>
          <div className="mt-1 flex items-center gap-1.5 text-xl font-extrabold tracking-tight">
            <Database className="h-4 w-4 text-ink-500" />
            {topup.package.isUnlimited ? 'Unlimited' : topup.package.data}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4">
          <div className="text-xs uppercase tracking-wider text-ink-500 font-semibold">Validity</div>
          <div className="mt-1 flex items-center gap-1.5 text-xl font-extrabold tracking-tight">
            <Clock className="h-4 w-4 text-ink-500" />
            {topup.package.validity} days
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-ink-600">
        <span>Total charged</span>
        <span className="font-bold">{fmtPrice(topup.retailPrice, topup.currency)}</span>
      </div>

      <Link
        href={`/orders/${topup.parentOrderId}`}
        className="mt-6 inline-flex items-center justify-center w-full rounded-2xl bg-ink-900 text-white font-semibold py-3 hover:bg-ink-800 transition">
        Back to your eSIM
      </Link>
    </div>
  );
};
