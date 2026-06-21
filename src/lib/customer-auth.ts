// Server-only customer auth helpers. Mirrors the admin-auth shape
// but uses a separate cookie (`customer_token`) so admins and
// customers can never collide.
//
// The user object returned by the backend on login is stashed into
// a second httpOnly cookie (`customer_user`) so server components
// can render display info (name, email) without hitting the API
// again on every request.
import { cookies } from 'next/headers';

export const CUSTOMER_TOKEN_COOKIE = 'customer_token';
export const CUSTOMER_USER_COOKIE = 'customer_user';

export interface CustomerUser {
  id: string | number | null;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  phoneNumber: string | null;
  countryCode: string | number | null;
}

const apiBase = (): string => {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL;
  if (!url) throw new Error('NEXT_PUBLIC_API_BASE_URL not configured');
  return url.replace(/\/$/, '');
};

export const customerToken = async (): Promise<string | null> => {
  const c = await cookies();
  return c.get(CUSTOMER_TOKEN_COOKIE)?.value ?? null;
};

export const customerUser = async (): Promise<CustomerUser | null> => {
  const c = await cookies();
  const raw = c.get(CUSTOMER_USER_COOKIE)?.value;
  if (!raw) return null;
  try { return JSON.parse(raw) as CustomerUser; } catch { return null; }
};

export const isCustomerSignedIn = async (): Promise<boolean> => {
  return (await customerToken()) !== null;
};

interface CustomerApiHistory {
  orders: Array<{
    id: string;
    status: 'pending' | 'fulfilled' | 'fulfillment_failed' | 'cancelled';
    email: string;
    quantity: number;
    currency: string;
    retailPrice: number;
    /** ISO 3166 alpha-2 of the destination country the customer
     *  selected at checkout. May be null on orders placed before
     *  this column existed — fall back to package.countries[0]. */
    selectedCountryCode: string | null;
    fulfilledAt: string | null;
    createdAt: string;
    package: {
      data: string;
      validity: number;
      title: string;
      countries: { code: string; name: string }[];
      currency: string;
      retailPrice: number;
    };
    iccid: string | null;
  }>;
  topups: Array<{
    id: string;
    parentOrderId: string;
    iccid: string;
    status: 'pending' | 'fulfilled' | 'fulfillment_failed' | 'cancelled';
    currency: string;
    retailPrice: number;
    fulfilledAt: string | null;
    createdAt: string;
    package: { data: string; validity: number; title: string };
  }>;
}

// Read-only history for the signed-in customer. Returns null when
// they're not signed in so callers can render the public empty
// state cleanly.
export const fetchMyEsims = async (): Promise<CustomerApiHistory | null> => {
  const user = await customerUser();
  if (!user?.id) return null;
  const res = await fetch(`${apiBase()}/v1/my-esims?customerId=${encodeURIComponent(String(user.id))}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json() as Promise<CustomerApiHistory>;
};

export const customerApiBase = apiBase;
