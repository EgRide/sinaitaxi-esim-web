// Top-up picker. Server-fetches the list of compatible top-up
// packages for the order's eSIM and renders them as a selection.
// The actual checkout (Stripe Elements + payment) lives in the
// client-side TopupPicker component.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Zap } from 'lucide-react';
import { api } from '@/lib/api';
import { TopupPicker } from './TopupPicker';

type Params = Promise<{ id: string }>;

export const metadata = { title: 'Top up your eSIM' };

export default async function TopupPage({ params }: { params: Params }) {
  const { id } = await params;

  const [order, topups] = await Promise.all([
    api.order(id).catch(() => null),
    api.topupPackages(id).catch(() => null),
  ]);

  if (!order) notFound();
  if (order.status !== 'fulfilled') {
    // Can't top up an eSIM that hasn't been provisioned yet.
    return (
      <section className="mx-auto max-w-2xl px-6 py-16">
        <Link href={`/orders/${id}`} className="inline-flex items-center gap-2 text-sm text-ink-600 hover:text-ink-900">
          <ArrowLeft className="h-4 w-4" /> Back to your order
        </Link>
        <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <h1 className="text-xl font-bold text-amber-900">Not ready for top-up yet</h1>
          <p className="text-sm text-amber-800 mt-2">
            Your eSIM hasn't been activated. Once it's installed and
            in use, this page will show the compatible top-up
            packages.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <Link href={`/orders/${id}`} className="inline-flex items-center gap-2 text-sm text-ink-600 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Back to your order
      </Link>
      <div className="mt-4 flex items-center gap-3">
        <span className="grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow text-white">
          <Zap className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Top up your eSIM</h1>
          <p className="text-sm text-ink-500">
            Same eSIM, more data — no reinstall needed.
          </p>
        </div>
      </div>

      {!topups || topups.data.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-ink-100 bg-white p-8 text-center">
          <p className="text-sm text-ink-600">
            No top-up packages are available for this eSIM right now.
            Please check back later or contact support.
          </p>
        </div>
      ) : (
        <TopupPicker orderId={id} packages={topups.data} />
      )}
    </section>
  );
}
