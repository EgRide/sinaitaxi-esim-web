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
  const countryCode = String(formData.get('countryCode') ?? '').trim().toUpperCase();
  const phoneCountryCode = String(formData.get('phoneCountryCode') ?? '').replace(/^\+/, '').trim();
  const phoneNumber = String(formData.get('phoneNumber') ?? '').trim();
  // When the "WhatsApp = phone" checkbox is on, the form doesn't
  // render the WA inputs — we mirror them server-side instead.
  const waSame = formData.get('whatsappSameAsPhone') === '1';
  const whatsappCountryCode = waSame
    ? phoneCountryCode
    : String(formData.get('whatsappCountryCode') ?? '').replace(/^\+/, '').trim();
  const whatsappNumber = waSame
    ? phoneNumber
    : String(formData.get('whatsappNumber') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '/account');

  if (!firstName) return { error: 'Enter your first name.' };
  if (!lastName) return { error: 'Enter your last name.' };
  if (!email) return { error: 'Enter your email.' };
  if (!countryCode || countryCode.length !== 2) return { error: 'Select your country.' };
  if (!phoneCountryCode) return { error: 'Enter your phone country code.' };
  if (!phoneNumber) return { error: 'Enter your phone number.' };
  if (!whatsappCountryCode || !whatsappNumber) {
    return { error: 'Enter your WhatsApp number or tick "same as phone".' };
  }
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
        countryCode,
        phoneCountryCode,
        phoneNumber,
        whatsappCountryCode,
        whatsappNumber,
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

// ── Forgot password ──────────────────────────────────────────────
//
// Customer enters their email; we ask sinaitaxi PHP to send the
// reset email. PHP returns success regardless of whether the
// account exists (to avoid user enumeration), so we render the
// same "Check your inbox" confirmation either way.

export type ForgetPasswordState = { error?: string; sent?: boolean; email?: string };

export const forgetPasswordAction = async (
  _prev: ForgetPasswordState,
  formData: FormData,
): Promise<ForgetPasswordState> => {
  const email = String(formData.get('email') ?? '').trim();
  if (!email) return { error: 'Enter your email.' };

  let res: Response;
  try {
    res = await fetch(`${customerApiBase()}/v1/customer/forget-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      cache: 'no-store',
    });
  } catch (err) {
    return { error: `Could not reach the server: ${(err as Error).message}` };
  }
  if (res.status === 400) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    return { error: body.message ?? 'Please enter a valid email.' };
  }
  if (!res.ok) return { error: `Could not request reset (${res.status}).` };
  return { sent: true, email };
};

// ── Reset password ───────────────────────────────────────────────
//
// Step 2 of the flow. Customer arrived from the email link with a
// `?code=…` in the URL and chose a new password; we forward to
// sinaitaxi /reset-password through the API proxy.

export type ResetPasswordState = { error?: string; ok?: boolean };

export const resetPasswordAction = async (
  _prev: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> => {
  const code = String(formData.get('code') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const confirm = String(formData.get('confirm') ?? '');

  if (!code) return { error: 'This reset link is missing its code. Please request a new one.' };
  if (password.length < 8) return { error: 'Password must be at least 8 characters.' };
  if (password !== confirm) return { error: 'Passwords do not match.' };

  let res: Response;
  try {
    res = await fetch(`${customerApiBase()}/v1/customer/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, password }),
      cache: 'no-store',
    });
  } catch (err) {
    return { error: `Could not reach the server: ${(err as Error).message}` };
  }
  if (res.status === 400) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    return { error: body.message ?? 'Please check the form and try again.' };
  }
  if (!res.ok) return { error: `Reset failed (${res.status}).` };
  return { ok: true };
};

// ── Google sign-in ───────────────────────────────────────────────
//
// The Google flow is a server-side redirect handled by sinaitaxi
// PHP:
//   1. Web → GoogleSignInButton fetches /v1/customer/google/url
//   2. API proxies sinaitaxi /auth/google/url → returns OAuth URL
//   3. Browser is redirected to Google → user authenticates
//   4. Google redirects back to PHP /auth/google/callback
//   5. PHP exchanges the code and (planned) redirects the browser
//      to a frontend URL with the session token in a query param
//
// Step 5 isn't fully wired yet — until PHP is configured to bounce
// back to esim.sinaitaxi.com with the token, the GoogleSignInButton
// hides itself behind NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED so the
// surface stays clean.
//
// Once the redirect-with-token piece lands, the catcher page will
// live at /login/google-complete and call a small server action
// to persist the cookies — we'll add it here at that point.
