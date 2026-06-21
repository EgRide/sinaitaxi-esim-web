// Chrome for the customer-facing site (everything outside /admin).
// Floating Nav + footer; admin lives in its own group with its own
// layout so the dashboard never leaks public nav.
//
// Two persistent UI bits sit at the layout level so they render on
// every page (except the routes their own components opt out of):
//   • CarTransferBanner — dismissible top promo cross-selling
//     Sinai Taxi's ride product. Suppressed on /orders + /account
//     so we don't poach attention mid-checkout.
//   • WhatsAppFab       — floating "Need help? Chat with us" pill
//     bottom-right, opens wa.me with a prefilled message.
import { Nav } from '@/components/Nav';
import { SiteFooter } from '@/components/SiteFooter';
import { AccountBadge } from '@/components/AccountBadge';
import { WhatsAppFab } from '@/components/WhatsAppFab';
import { CarTransferBanner } from '@/components/CarTransferBanner';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CarTransferBanner />
      <Nav accountSlot={<AccountBadge />} />
      <main className="pt-20">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  );
}
