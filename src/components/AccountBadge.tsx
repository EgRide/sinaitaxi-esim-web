// Server component that renders either a "Sign in" pill (when no
// customer cookie is present) or an avatar circle linking to the
// account page. Slotted into the main Nav via the `accountSlot`
// prop so the client-side Nav stays decoupled from auth state.
import Link from 'next/link';
import { customerUser } from '@/lib/customer-auth';

const initials = (user: { firstName: string | null; lastName: string | null; email: string }): string => {
  const f = (user.firstName ?? '').trim().charAt(0);
  const l = (user.lastName ?? '').trim().charAt(0);
  const initial = (f + l).toUpperCase();
  if (initial) return initial;
  return (user.email ?? '?').charAt(0).toUpperCase();
};

export const AccountBadge: React.FC = async () => {
  const user = await customerUser();
  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 text-white text-xs font-bold px-3.5 py-1.5 hover:bg-ink-700 transition">
        Sign in
      </Link>
    );
  }
  return (
    <Link
      href="/account"
      aria-label="Open account"
      className="inline-flex items-center gap-2 rounded-full bg-white border border-ink-200 hover:border-brand-300 hover:shadow-soft transition pl-1 pr-3 py-1">
      <span className="grid place-items-center w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white text-xs font-extrabold">
        {initials(user)}
      </span>
      <span className="text-xs font-semibold text-ink-900 hidden sm:inline">
        Account
      </span>
    </Link>
  );
};
