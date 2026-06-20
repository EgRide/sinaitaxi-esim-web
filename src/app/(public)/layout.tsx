// Chrome for the customer-facing site (everything outside /admin).
// Floating Nav + footer; admin lives in its own group with its own
// layout so the dashboard never leaks public nav.
import { Nav } from '@/components/Nav';
import { SiteFooter } from '@/components/SiteFooter';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="pt-20">{children}</main>
      <SiteFooter />
    </>
  );
}
