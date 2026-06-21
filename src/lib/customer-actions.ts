'use server';

// Server actions for customer auth — login, logout, and a soft
// redirect helper used by gated checkout.
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  CUSTOMER_TOKEN_COOKIE,
  CUSTOMER_USER_COOKIE,
  customerApiBase,
} from '@/lib/customer-auth';

export type LoginState = { error?: string };

export const loginAction = async (
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> => {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '/account');
  if (!email) return { error: 'Enter your email.' };
  if (!password) return { error: 'Enter your password.' };

  let res: Response;
  try {
    res = await fetch(`${customerApiBase()}/v1/customer/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });
  } catch (err) {
    return { error: `Could not reach the server: ${(err as Error).message}` };
  }
  if (res.status === 401) return { error: 'Wrong email or password.' };
  if (res.status === 400) return { error: 'Invalid email or password format.' };
  if (!res.ok) return { error: `Login failed (${res.status}).` };

  const body = (await res.json()) as { token?: string; user?: unknown };
  if (!body.token) return { error: 'Unexpected response from server.' };

  const cookieStore = await cookies();
  const cookieOpts = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  };
  cookieStore.set(CUSTOMER_TOKEN_COOKIE, body.token, cookieOpts);
  cookieStore.set(CUSTOMER_USER_COOKIE, JSON.stringify(body.user ?? {}), cookieOpts);
  redirect(next);
};

export const logoutCustomerAction = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_TOKEN_COOKIE);
  cookieStore.delete(CUSTOMER_USER_COOKIE);
  redirect('/');
};
