// Single source of truth for talking to the eSIM API on Railway.
//
// Same shape lives in:
//   • Next.js server components (running in Node on Vercel / locally)
//   • Next.js client components (running in the browser)
//   • Future: the React Native app
//
// We re-declare the response types here rather than importing
// from the API package so the website stays decoupled from the
// API repo's internal types. When the contract changes, update
// here AND the API together.

export interface Country {
  code: string;
  name: string;
  packageCount: number;
  /** Cheapest retail price across all packages serving this country. */
  fromPrice: number;
  currency: string;
}

export interface CustomerPackage {
  id: string;
  slug: string;
  type: 'local' | 'regional' | 'global';
  currency: string;
  retailPrice: number;
  data: string;
  validity: number;
  voice?: number | null;
  text?: number | null;
  countries: { code: string; name: string }[];
  title: string;
  shortInfo?: string | null;
  planType?: string | null;
  hasFairUsagePolicy?: boolean;
  fairUsagePolicy?: string | null;
  activationPolicy?: string | null;
  operatorName?: string | null;
  isRoaming?: boolean | null;
  operatorInfo?: string[];
  otherInfo?: string | null;
  imageUrl?: string | null;
}

export interface CheckoutResponse {
  orderId: string;
  clientSecret: string;
}

export interface OrderDetail {
  id: string;
  status: 'pending' | 'fulfilled' | 'fulfillment_failed';
  email: string;
  quantity: number;
  currency: string;
  retailPrice: number;
  fulfilledAt: string | null;
  package: CustomerPackage;
  airalo: unknown;
}

export interface InstallationSteps {
  steps: Record<string, string>;
  qr_code_url?: string;
  qr_code_data?: string;
  smdp_address_and_activation_code?: string;
  apn_type?: string;
  apn_value?: string | null;
  is_roaming?: boolean | null;
}
export interface DeviceInstructions {
  model: string | null;
  version: string | null;
  installation_via_qr_code: InstallationSteps;
  installation_manual: InstallationSteps;
  network_setup: InstallationSteps;
}
export interface InstallInstructions {
  iccid: string;
  language: string;
  data: {
    data?: {
      instructions: {
        language: string;
        ios: DeviceInstructions[];
        android: DeviceInstructions[];
      };
    };
  };
}

export interface UsageSnapshot {
  iccid: string;
  data: {
    data?: {
      remaining: number;
      total: number;
      expired_at: string;
      is_unlimited: boolean;
      status: string;
      remaining_voice?: number;
      remaining_text?: number;
      total_voice?: number;
      total_text?: number;
    };
  };
}

export interface TopupPackage {
  id: string;
  type: string;
  currency: string;
  retailPrice: number;
  data: string;
  validity: number;
  isUnlimited: boolean;
  title: string;
  shortInfo: string | null;
}

export interface TopupCheckoutResponse {
  topupId: string;
  clientSecret: string;
}

export interface CompatibleDevice {
  os: string;
  brand: string;
  name: string;
}

export interface TopupDetail {
  id: string;
  parentOrderId: string;
  iccid: string;
  email: string;
  status: 'pending' | 'fulfilled' | 'fulfillment_failed';
  currency: string;
  retailPrice: number;
  fulfilledAt: string | null;
  package: TopupPackage;
}

const base = (): string => {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) throw new Error('NEXT_PUBLIC_API_BASE_URL not configured');
  return url.replace(/\/$/, '');
};

const get = async <T,>(path: string): Promise<T> => {
  const res = await fetch(`${base()}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    // Vercel's data cache holds the response for 30s before
    // re-fetching from Railway. Matches the backend's own
    // /v1/countries cache TTL — admin /settings changes
    // propagate to the public site within 30s.
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  const body = (await res.json()) as { data: T };
  return body.data;
};

const post = async <T,>(path: string, payload: unknown): Promise<T> => {
  const res = await fetch(`${base()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json()).message ?? ''; } catch { /* ignore */ }
    throw new Error(detail || `POST ${path} → ${res.status}`);
  }
  return res.json() as Promise<T>;
};

export const api = {
  countries: (): Promise<Country[]> => get<Country[]>('/v1/countries'),
  packages: (code: string): Promise<CustomerPackage[]> =>
    get<CustomerPackage[]>(`/v1/countries/${encodeURIComponent(code)}/packages`),
  checkout: (payload: { packageId: string; email: string; quantity?: number; customerId?: string }) =>
    post<CheckoutResponse>('/v1/checkout', payload),
  // Stale-sensitive endpoints — receipts poll until fulfilled,
  // usage updates in real time, so we never cache them.
  order: async (id: string): Promise<OrderDetail> => {
    const res = await fetch(`${base()}/v1/orders/${encodeURIComponent(id)}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`GET /v1/orders/${id} → ${res.status}`);
    return res.json() as Promise<OrderDetail>;
  },
  installInstructions: async (id: string, lang = 'en'): Promise<InstallInstructions | null> => {
    const res = await fetch(`${base()}/v1/orders/${encodeURIComponent(id)}/install?lang=${lang}`, {
      cache: 'no-store',
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GET /v1/orders/${id}/install → ${res.status}`);
    return res.json() as Promise<InstallInstructions>;
  },
  usage: async (id: string): Promise<UsageSnapshot | null> => {
    const res = await fetch(`${base()}/v1/orders/${encodeURIComponent(id)}/usage`, {
      cache: 'no-store',
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GET /v1/orders/${id}/usage → ${res.status}`);
    return res.json() as Promise<UsageSnapshot>;
  },
  topupPackages: async (orderId: string): Promise<{ iccid: string; currency: string; data: TopupPackage[] } | null> => {
    const res = await fetch(`${base()}/v1/orders/${encodeURIComponent(orderId)}/topups`, {
      cache: 'no-store',
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GET /v1/orders/${orderId}/topups → ${res.status}`);
    return res.json();
  },
  topupCheckout: (payload: { orderId: string; packageId: string }) =>
    post<TopupCheckoutResponse>('/v1/topup-checkout', payload),
  compatibleDevices: (): Promise<CompatibleDevice[]> =>
    get<CompatibleDevice[]>('/v1/compatible-devices'),
  topup: async (id: string): Promise<TopupDetail> => {
    const res = await fetch(`${base()}/v1/topups/${encodeURIComponent(id)}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`GET /v1/topups/${id} → ${res.status}`);
    return res.json() as Promise<TopupDetail>;
  },
};
