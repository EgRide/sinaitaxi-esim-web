// Post-checkout — order status. Server-fetches once, then the
// client component polls every 3s until the order moves out of
// "pending" (Stripe webhook → Airalo order placement on the
// API). Once fulfilled, we render the QR code + activation
// instructions from Airalo's order response.
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { OrderPoller } from './OrderPoller';

type Params = Promise<{ id: string }>;

export default async function OrderPage({ params }: { params: Params }) {
  const { id } = await params;
  let initial: Awaited<ReturnType<typeof api.order>>;
  try {
    initial = await api.order(id);
  } catch {
    notFound();
  }
  return (
    <section className="mx-auto max-w-2xl px-6 py-10">
      <OrderPoller initial={initial} />
    </section>
  );
}
