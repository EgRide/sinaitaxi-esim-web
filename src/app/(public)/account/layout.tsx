// Account section chrome — vertical nav sidebar on desktop,
// horizontal scroller on mobile. Layout-level auth guard pushes
// signed-out visitors to /account/login.
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { User, Settings, Smartphone, LogOut } from 'lucide-react';
import { customerUser, isCustomerSignedIn } from '@/lib/customer-auth';
import { logoutCustomerAction } from '@/lib/customer-actions';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  if (!(await isCustomerSignedIn())) redirect('/login?next=/account');
  const user = await customerUser();
  const displayName =
    user?.fullName?.trim() ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() ||
    user?.email ||
    'Account';

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tightest">
          {displayName}
        </h1>
        {user?.email ? (
          <p className="text-sm text-ink-500 mt-1">{user.email}</p>
        ) : null}
      </header>

      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        {/* Sidebar nav */}
        <aside>
          <nav className="lg:sticky lg:top-24 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            <NavLink href="/account" icon={<User className="h-4 w-4" />}>Profile</NavLink>
            <NavLink href="/account/esims" icon={<Smartphone className="h-4 w-4" />}>My eSIMs</NavLink>
            <NavLink href="/account/settings" icon={<Settings className="h-4 w-4" />}>Settings</NavLink>
            <form action={logoutCustomerAction} className="mt-2 lg:mt-4">
              <button
                type="submit"
                className="w-full inline-flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-600 hover:bg-red-50 hover:text-red-700 transition whitespace-nowrap">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}

const NavLink: React.FC<{ href: string; icon: React.ReactNode; children: React.ReactNode }> = ({ href, icon, children }) => (
  <Link
    href={href}
    className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-700 hover:bg-ink-50 hover:text-ink-900 transition whitespace-nowrap">
    {icon}
    {children}
  </Link>
);
