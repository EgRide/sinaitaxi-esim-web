// Admin shell: side rail + content area. Auth check happens
// inline — if the cookie is missing, redirect to /admin/login.
// The login page lives in a sibling route group (`(admin-auth)`)
// so it doesn't inherit this layout and can render bare.
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LayoutDashboard, ListChecks, LogOut, Calculator } from 'lucide-react';
import { adminApi } from '@/lib/admin';
import { logoutAction } from '@/lib/admin-actions';

export const metadata = { title: 'Team dashboard' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const hasToken = await adminApi.hasToken();
  if (!hasToken) redirect('/admin/login');

  return (
    <div className="min-h-screen bg-ink-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-white border-r border-ink-100">
        <div className="px-6 py-6 border-b border-ink-100">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <span className="grid place-items-center w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 4h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                <path d="M9 13h6M9 17h6M9 9h3" />
              </svg>
            </span>
            <div className="leading-tight">
              <div className="font-extrabold tracking-tight">
                Sinai<span className="text-brand-500">Taxi</span>
              </div>
              <div className="text-[11px] text-ink-500 font-semibold tracking-wider uppercase">
                Team
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm font-medium">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-ink-700 hover:bg-ink-50 hover:text-ink-900 transition">
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-ink-700 hover:bg-ink-50 hover:text-ink-900 transition">
            <ListChecks className="h-4 w-4" />
            Orders
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-ink-700 hover:bg-ink-50 hover:text-ink-900 transition">
            <Calculator className="h-4 w-4" />
            Pricing
          </Link>
        </nav>

        <div className="px-3 py-4 border-t border-ink-100">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-600 hover:bg-ink-50 hover:text-ink-900 transition">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-ink-100 px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="font-extrabold tracking-tight">
          Sinai<span className="text-brand-500">Taxi</span> · Team
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="text-xs font-semibold text-ink-500 hover:text-ink-900">
            Sign out
          </button>
        </form>
      </header>

      <div className="flex-1 min-w-0 md:py-0 pt-14">
        {children}
      </div>
    </div>
  );
}
