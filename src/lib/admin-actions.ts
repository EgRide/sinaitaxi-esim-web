'use server';

// Server actions for the admin login + logout flow. Login proxies
// through our Fastify backend, which in turn calls the sinaitaxi
// PHP admin login endpoint. Same credentials as sinaitaxi.com.
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE, adminApiBase } from '@/lib/admin';

export type LoginState = { error?: string };

export const loginAction = async (
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> => {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  if (!email) return { error: 'Enter your email.' };
  if (!password) return { error: 'Enter your password.' };

  let res: Response;
  try {
    res = await fetch(`${adminApiBase()}/v1/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });
  } catch (err) {
    return { error: `Could not reach the API: ${(err as Error).message}` };
  }

  if (res.status === 401) return { error: 'Not an admin, or wrong password.' };
  if (res.status === 400) return { error: 'Invalid email or password format.' };
  if (!res.ok) return { error: `Login failed (${res.status}).` };

  const body = (await res.json()) as { token?: string };
  if (!body.token) return { error: 'Unexpected response from API.' };

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, body.token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/admin',
    maxAge: 60 * 60 * 8, // 8 hours
  });
  redirect('/admin');
};

export const logoutAction = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect('/admin/login');
};
