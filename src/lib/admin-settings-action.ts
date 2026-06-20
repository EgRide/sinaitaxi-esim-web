'use server';

// Server action used by /admin/settings to persist commission %
// + minimum commission floor. The action runs in the Next.js
// server runtime, forwards the cookie token to the Fastify
// backend, and revalidates the admin pages on success so the
// new pricing is reflected immediately.
import { revalidatePath } from 'next/cache';
import { adminPatch } from './admin';

export type SettingsState = { ok?: true; error?: string };

export const updateSettingsAction = async (
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> => {
  const commissionPctRaw = Number(formData.get('commissionPct'));
  const minCommissionEurRaw = Number(formData.get('minCommissionEur'));

  if (!Number.isFinite(commissionPctRaw) || commissionPctRaw < 0 || commissionPctRaw > 200) {
    return { error: 'Commission % must be between 0 and 200.' };
  }
  if (!Number.isFinite(minCommissionEurRaw) || minCommissionEurRaw < 0 || minCommissionEurRaw > 100) {
    return { error: 'Minimum commission must be between 0 and 100 EUR.' };
  }

  const result = await adminPatch('/v1/admin/settings', {
    commissionPct: commissionPctRaw / 100, // form input is in %, API takes decimal
    minCommissionEur: minCommissionEurRaw,
  });
  if (!result.ok) return { error: result.error };

  revalidatePath('/admin/settings');
  revalidatePath('/admin');
  return { ok: true };
};
