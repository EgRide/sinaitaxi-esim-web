// Chrome for the customer-facing site (everything outside /admin).
// Floating Nav + footer; admin lives in its own group with its own
// layout so the dashboard never leaks public nav.
//
// • WhatsAppFab — floating "Need help? Chat with us" pill
//   bottom-right, opens wa.me with a prefilled message.
//
// CarTransferBanner is intentionally NOT rendered right now — it
// was overlapping the floating Nav in the current layout, so we
// pulled it until we ship a proper sticky-top variant that the Nav
// can sit below. Bring it back as needed once the layout flow is
// fixed.
import { Nav } from '@/components/Nav';
import { SiteFooter } from '@/components/SiteFooter';
import { AccountBadge } from '@/components/AccountBadge';
import { WhatsAppFab } from '@/components/WhatsAppFab';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav accountSlot={<AccountBadge />} />
      <main className="pt-20">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  );
}
