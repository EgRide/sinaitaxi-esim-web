'use client';

// Polls /v1/orders/:id every 3s until status leaves "pending".
// Renders three layouts depending on status:
//   • pending             — spinner + "Confirming payment…"
//   • fulfilled           — QR + Airalo's localized install steps + usage
//   • fulfillment_failed  — error panel with support contact
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Database,
  Clock,
  Smartphone,
  QrCode,
  Settings,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { api, type OrderDetail, type InstallInstructions, type UsageSnapshot, type DeviceInstructions } from '@/lib/api';
import { cn } from '@/lib/cn';

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

  if (order.status === 'pending') return <Pending />;
  if (order.status === 'fulfillment_failed') return <Failed order={order} />;
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

const Fulfilled: React.FC<{ order: OrderDetail }> = ({ order }) => {
  const sim = extractSims(order.airalo)[0];
  const [instructions, setInstructions] = useState<InstallInstructions | null>(null);
  const [usage, setUsage] = useState<UsageSnapshot | null>(null);

  useEffect(() => {
    // Fetch once on mount — instructions don't change.
    api.installInstructions(order.id).then(setInstructions).catch(() => {});
    // Usage refreshes on each tab focus + initial mount.
    const fetchUsage = () => api.usage(order.id).then(setUsage).catch(() => {});
    fetchUsage();
    const onFocus = () => fetchUsage();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [order.id]);

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
          {sim?.iccid ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-ink-100 font-mono text-[11px] text-ink-500">
              ICCID {sim.iccid.slice(-10)}
            </span>
          ) : null}
        </div>
      </div>

      {/* Live usage card */}
      {usage?.data?.data ? <UsageCard usage={usage} /> : null}

      {/* QR + install instructions */}
      <InstallCard order={order} sim={sim} instructions={instructions} />

      {/* Top-up CTA */}
      {sim?.iccid ? (
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
const UsageCard: React.FC<{ usage: UsageSnapshot }> = ({ usage }) => {
  const u = usage.data.data;
  if (!u) return null;
  const usedMb = u.total - u.remaining;
  const pct = u.total > 0 ? Math.min(100, Math.round((usedMb / u.total) * 100)) : 0;
  const daysLeft = u.expired_at ? Math.max(0, Math.ceil((new Date(u.expired_at).getTime() - Date.now()) / 86400000)) : null;

  return (
    <div className="rounded-3xl bg-white border border-ink-100 shadow-soft p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-9 h-9 rounded-2xl bg-brand-50 text-brand-700">
            <Activity className="h-4.5 w-4.5" />
          </span>
          <h2 className="font-bold tracking-tight">Live usage</h2>
        </div>
        <span className={cn(
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border',
          u.status === 'ACTIVE'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-ink-50 border-ink-200 text-ink-600',
        )}>
          {u.status}
        </span>
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
const InstallCard: React.FC<{
  order: OrderDetail;
  sim: Sim | undefined;
  instructions: InstallInstructions | null;
}> = ({ sim, instructions }) => {
  const inst = instructions?.data?.data?.instructions;
  const [platform, setPlatform] = useState<'ios' | 'android'>(() => detectPlatform());
  const devices: DeviceInstructions[] = inst ? inst[platform] : [];
  const device = devices[0];
  const [method, setMethod] = useState<'qr' | 'manual' | 'apn'>('qr');

  const qrUrl = sim?.qrcode_url ?? device?.installation_via_qr_code?.qr_code_url;

  return (
    <div className="rounded-3xl bg-white border border-ink-100 shadow-soft p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-9 h-9 rounded-2xl bg-brand-50 text-brand-700">
            <Smartphone className="h-4.5 w-4.5" />
          </span>
          <h2 className="font-bold tracking-tight">Install your eSIM</h2>
        </div>
        <div className="inline-flex bg-ink-100 rounded-full p-1">
          {(['ios', 'android'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={cn(
                'px-3.5 py-1 text-xs font-semibold rounded-full transition',
                platform === p ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500',
              )}>
              {p === 'ios' ? 'iPhone' : 'Android'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* QR */}
        <div className="rounded-2xl bg-ink-50 border border-ink-100 p-5 flex flex-col items-center">
          {qrUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrUrl} alt="eSIM QR code" className="w-44 h-44 object-contain rounded-xl bg-white p-2" />
          ) : (
            <div className="w-44 h-44 grid place-items-center text-xs text-ink-500 bg-white rounded-xl">
              QR unavailable
            </div>
          )}
          <p className="text-xs text-ink-600 mt-3 text-center">
            Scan with your phone's <strong>camera</strong> while the device is connected to Wi-Fi.
          </p>
          {device?.installation_via_qr_code?.smdp_address_and_activation_code ? (
            <details className="mt-3 w-full text-xs">
              <summary className="cursor-pointer text-ink-500 hover:text-ink-900">
                Show activation code
              </summary>
              <code className="block mt-2 break-all rounded-lg bg-white border border-ink-100 px-3 py-2 font-mono text-[11px]">
                {device.installation_via_qr_code.smdp_address_and_activation_code}
              </code>
            </details>
          ) : null}
        </div>

        {/* Steps */}
        <div>
          <div className="inline-flex gap-1.5 mb-4">
            {[
              { key: 'qr', label: 'QR install', icon: <QrCode className="h-3.5 w-3.5" /> },
              { key: 'manual', label: 'Manual', icon: <Settings className="h-3.5 w-3.5" /> },
              { key: 'apn', label: 'Network setup', icon: <Activity className="h-3.5 w-3.5" /> },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setMethod(t.key as 'qr' | 'manual' | 'apn')}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition',
                  method === t.key
                    ? 'bg-ink-900 text-white border-ink-900'
                    : 'bg-white text-ink-600 border-ink-200 hover:border-ink-400',
                )}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          {device ? (
            <StepsList steps={stepsFor(device, method)} />
          ) : (
            <FallbackSteps />
          )}
        </div>
      </div>
    </div>
  );
};

const StepsList: React.FC<{ steps: Record<string, string> | undefined }> = ({ steps }) => {
  const entries = steps ? Object.entries(steps).sort(([a], [b]) => Number(a) - Number(b)) : [];
  if (entries.length === 0) return <FallbackSteps />;
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

const FallbackSteps: React.FC = () => (
  <ol className="space-y-2.5 text-sm text-ink-700">
    <li className="flex gap-3">
      <span className="flex-shrink-0 grid place-items-center w-6 h-6 rounded-full bg-ink-900 text-white text-xs font-bold">1</span>
      <span>Open Settings → Cellular / Mobile Data.</span>
    </li>
    <li className="flex gap-3">
      <span className="flex-shrink-0 grid place-items-center w-6 h-6 rounded-full bg-ink-900 text-white text-xs font-bold">2</span>
      <span>Tap "Add eSIM" or "Add cellular plan".</span>
    </li>
    <li className="flex gap-3">
      <span className="flex-shrink-0 grid place-items-center w-6 h-6 rounded-full bg-ink-900 text-white text-xs font-bold">3</span>
      <span>Scan the QR code on the left.</span>
    </li>
    <li className="flex gap-3">
      <span className="flex-shrink-0 grid place-items-center w-6 h-6 rounded-full bg-ink-900 text-white text-xs font-bold">4</span>
      <span>When you arrive at your destination, enable data roaming on the new plan.</span>
    </li>
  </ol>
);

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

interface Sim {
  qrcode?: string;
  qrcode_url?: string;
  iccid?: string;
}
const extractSims = (raw: unknown): Sim[] => {
  const node = raw as Record<string, unknown> | undefined;
  if (!node) return [];
  const direct = (node.sims ?? node.data) as Sim[] | { sims?: Sim[] } | undefined;
  if (Array.isArray(direct)) return direct;
  if (direct && typeof direct === 'object' && 'sims' in direct && Array.isArray(direct.sims)) {
    return direct.sims;
  }
  return [];
};
