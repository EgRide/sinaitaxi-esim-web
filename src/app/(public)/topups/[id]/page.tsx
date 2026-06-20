// Top-up receipt — polls /v1/topups/:id until status leaves
// "pending". Mirrors the order receipt page but simpler since
// there's no QR / install — the eSIM is already installed.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { TopupPoller } from './TopupPoller';

type Params = Promise<{ id: string }>;

export const metadata = { title: 'Top-up receipt' };

export default async function TopupReceipt({ params }: { params: Params }) {
  const { id } = await params;
  let initial;
  try { initial = await api.topup(id); }
  catch { notFound(); }
  return (
    <section className="mx-auto max-w-2xl px-6 py-10">
      <Link
        href={`/orders/${initial.parentOrderId}`}
        className="inline-flex items-center gap-2 text-sm text-ink-600 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Back to your eSIM
      </Link>
      <div className="mt-6">
        <TopupPoller initial={initial} />
      </div>
    </section>
  );
}
