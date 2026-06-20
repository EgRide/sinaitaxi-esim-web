// Server-only admin API helpers. Everything in this file runs in
// the Next.js server runtime — we read the admin_token cookie and
// forward it as a Bearer header to the Fastify backend.
//
// We deliberately keep this thin: a Bearer token lives in an
// httpOnly cookie set on login; layout-level auth guards every
// /admin/* route by checking for the cookie's presence and the
// `/v1/admin/stats` 401 response shape.
import { cookies } from 'next/headers';

const apiBase = (): string => {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL;
  if (!url) throw new Error('API base URL not configured');
  return url.replace(/\/$/, '');
};

export const ADMIN_COOKIE = 'admin_token';

export interface AdminStats {
  range: 'today' | '7d' | '30d' | 'all';
  currency: string;
  orders: number;
  revenue: number;
  wholesaleUsd: number;
  commission: number;
  avgOrderValue: number;
  pending: number;
  failed: number;
}

export interface AdminOrder {
  id: string;
  email: string;
  status: 'pending' | 'fulfilled' | 'fulfillment_failed';
  currency: string;
  retailPrice: number;
  wholesalePriceUsd: number;
  commission: number;
  quantity: number;
  airaloOrderId: string | null;
  createdAt: string;
  fulfilledAt: string | null;
  package: { data: string; validity: number; country: string };
}

export interface AdminOrdersResponse {
  currency: string;
  data: AdminOrder[];
}

export interface AiraloBalance {
  accounts: { name?: string; amount: number; currency: string }[];
  total: number;
  primaryCurrency: string;
  fetchedAt: string;
}

export interface PricingSettings {
  commissionPct: number;
  minCommissionEur: number;
  usdToEur: number;
  displayCurrency: string;
}

const token = async (): Promise<string | null> => {
  const c = await cookies();
  return c.get(ADMIN_COOKIE)?.value ?? null;
};

const adminFetch = async <T>(path: string): Promise<T | null> => {
  const t = await token();
  if (!t) return null;
  const res = await fetch(`${apiBase()}${path}`, {
    headers: { Authorization: `Bearer ${t}` },
    cache: 'no-store',
  });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json() as Promise<T>;
};

export const adminApi = {
  hasToken: async (): Promise<boolean> => (await token()) !== null,
  stats: (range: AdminStats['range']): Promise<AdminStats | null> =>
    adminFetch<AdminStats>(`/v1/admin/stats?range=${range}`),
  orders: (range: AdminStats['range'], status: 'all' | 'pending' | 'fulfilled' | 'fulfillment_failed', limit = 50): Promise<AdminOrdersResponse | null> =>
    adminFetch<AdminOrdersResponse>(`/v1/admin/orders?range=${range}&status=${status}&limit=${limit}`),
  balance: (): Promise<AiraloBalance | null> =>
    adminFetch<AiraloBalance>('/v1/admin/balance'),
  settings: (): Promise<PricingSettings | null> =>
    adminFetch<PricingSettings>('/v1/admin/settings'),
};

export const adminApiBase = apiBase;

// Authenticated mutator. Forwards the cookie's Bearer token. Used
// by server actions like updateSettingsAction.
export const adminPatch = async <T>(path: string, body: unknown): Promise<{ ok: true; data: T } | { ok: false; error: string }> => {
  const t = await token();
  if (!t) return { ok: false, error: 'Not authenticated' };
  const res = await fetch(`${apiBase()}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) {
    let msg = `PATCH ${path} → ${res.status}`;
    try { msg = (await res.json()).message ?? msg; } catch { /* ignore */ }
    return { ok: false, error: msg };
  }
  return { ok: true, data: await res.json() as T };
};
