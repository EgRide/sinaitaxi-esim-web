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

// ── Register ───────────────────────────────────────────────────
//
// Forwards to /v1/customer/register, which proxies sinaitaxi PHP's
// /signup. On success we mint the session cookies and redirect to
// `next` (same flow as login). On edge cases:
//   • upstream returns 422 → surface the first validation error
//   • upstream creates the user but doesn't return a token → we
//     redirect the customer to /login with their email pre-filled
//     so they only have to type the password once.
export type RegisterState = { error?: string };

export const registerAction = async (
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> => {
  const firstName = String(formData.get('firstName') ?? '').trim();
  const lastName = String(formData.get('lastName') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const phoneNumber = String(formData.get('phoneNumber') ?? '').trim();
  const countryId = String(formData.get('countryId') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '/account');

  if (!firstName) return { error: 'Enter your first name.' };
  if (!lastName) return { error: 'Enter your last name.' };
  if (!email) return { error: 'Enter your email.' };
  if (!phoneNumber) return { error: 'Enter your phone number.' };
  if (password.length < 8) return { error: 'Password must be at least 8 characters.' };

  let res: Response;
  try {
    res = await fetch(`${customerApiBase()}/v1/customer/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phoneNumber,
        // Forward country only when the form collected it.
        ...(countryId ? { countryId } : {}),
        password,
      }),
      cache: 'no-store',
    });
  } catch (err) {
    return { error: `Could not reach the server: ${(err as Error).message}` };
  }

  const body = (await res.json().catch(() => ({}))) as {
    token?: string | null;
    user?: unknown;
    message?: string;
    needsLogin?: boolean;
    email?: string;
  };

  if (res.status === 409) return { error: 'An account with this email already exists.' };
  if (res.status === 400) return { error: body.message ?? 'Please check the form and try again.' };
  if (!res.ok) return { error: body.message ?? `Sign up failed (${res.status}).` };

  if (body.needsLogin) {
    // Sinaitaxi created the account but didn't hand us a session
    // token. Send the user to /login with the email pre-filled so
    // they only have to enter their password once.
    redirect(`/login?email=${encodeURIComponent(body.email ?? email)}&next=${encodeURIComponent(next)}`);
  }

  if (!body.token) return { error: 'Unexpected response from server.' };

  const cookieStore = await cookies();
  const cookieOpts = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours, matches login
  };
  cookieStore.set(CUSTOMER_TOKEN_COOKIE, body.token, cookieOpts);
  cookieStore.set(CUSTOMER_USER_COOKIE, JSON.stringify(body.user ?? {}), cookieOpts);
  redirect(next);
};

// ── Google sign-in ───────────────────────────────────────────────
//
// Called from the GSI button on /login. Receives Google's ID token,
// forwards to our /v1/customer/google proxy (which verifies it
// against Google's tokeninfo + relays to sinaitaxi PHP), then sets
// the same cookies as login/register. We don't redirect from here
// because the client-side button needs to call router.push itself
// to keep the GSI iframe state clean — instead we return success
// and let the client navigate.
export type GoogleSignInState = { error?: string };

export const googleSignInAction = async (
  payload: { idToken: string; next: string },
): Promise<GoogleSignInState> => {
  if (!payload.idToken) return { error: 'Missing Google sign-in credential.' };

  let res: Response;
  try {
    res = await fetch(`${customerApiBase()}/v1/customer/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: payload.idToken }),
      cache: 'no-store',
    });
  } catch (err) {
    return { error: `Could not reach the server: ${(err as Error).message}` };
  }

  if (res.status === 401) return { error: 'Google sign-in could not be verified.' };
  if (res.status === 501) return { error: 'Google sign-in is not available yet — please use email + password.' };
  if (!res.ok) return { error: `Sign in failed (${res.status}).` };

  const body = (await res.json().catch(() => ({}))) as { token?: string; user?: unknown };
  if (!body.token) return { error: 'Unexpected response from server.' };

  const cookieStore = await cookies();
  const cookieOpts = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  };
  cookieStore.set(CUSTOMER_TOKEN_COOKIE, body.token, cookieOpts);
  cookieStore.set(CUSTOMER_USER_COOKIE, JSON.stringify(body.user ?? {}), cookieOpts);
  return {};
};
