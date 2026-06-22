import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { LegalLayout, type LegalSection } from '@/components/LegalLayout';

// Refund policy for the Sinai Taxi eSIM marketplace. The policy is
// aligned with our upstream network partner's (Airalo) refund stance
// — we cannot honour a claim that Airalo would not honour, since we
// pay Airalo the wholesale cost regardless. The 10-day support
// window mirrors Airalo's published policy.
export const metadata: Metadata = {
  title: 'Refund policy · Sinai Taxi eSIM',
  description:
    'When you can get a refund on a Sinai Taxi eSIM, when you cannot, and how to request one. Aligned with Airalo Partner network policy.',
};

const TOC: LegalSection[] = [
  { id: 'summary',        title: 'At a glance' },
  { id: 'eligible',       title: '1. When you are eligible for a refund' },
  { id: 'not-eligible',   title: '2. When you are not eligible' },
  { id: 'request',        title: '3. How to request a refund' },
  { id: 'timeline',       title: '4. Timeline & method' },
  { id: 'partial',        title: '5. Partial refunds & credits' },
  { id: 'consumer',       title: '6. Statutory consumer rights' },
  { id: 'contact',        title: '7. Contact us' },
];

export default function RefundPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Refund policy"
        title="Refunds — straight answer."
        subtitle="eSIMs are digital wholesale goods. Once the eSIM is installed on your device, it is treated as consumed — which is why our refund policy is narrow. Here is exactly when we will refund you, and when we cannot."
        effectiveDate="22 June 2026"
      />

      <LegalLayout toc={TOC}>
        <Section id="summary" title="At a glance">
          <p>
            <strong>Short version.</strong> We do <em>not</em> refund
            accidental purchases or unused data once an eSIM has been
            installed on a device. You <em>are</em> eligible for a
            refund if you cannot use the service because of a
            technical fault on our network partner&apos;s end and the
            support team cannot resolve it within 10 days of your
            first report.
          </p>
          <p>
            This policy mirrors our upstream provider (Airalo Partner
            network). We are a reseller — we cannot honour a claim
            that Airalo would not honour, because we pay Airalo the
            wholesale cost of every eSIM whether you use it or not.
          </p>
        </Section>

        <Section id="eligible" title="1. When you are eligible for a refund">
          <p>You qualify for a <strong>full refund</strong> if any of the following applies:</p>
          <ul>
            <li>
              <strong>Provisioning failed.</strong> The payment was
              charged but our network partner failed to issue an eSIM
              (you will see <em>fulfillment failed</em> on the order
              page). Refunds in this case are automatic — issued back
              to your original payment method within 5 business days,
              no action required from you.
            </li>
            <li>
              <strong>Unresolved technical fault.</strong> You
              installed the eSIM, you cannot use the service because
              of a technical fault on our network partner&apos;s
              side, you opened a support case with us, and the case
              has not been resolved within <strong>10 days</strong>
              {' '}of your first report.
            </li>
          </ul>
          <p>
            Examples of qualifying technical faults include: a QR code
            we issued cannot be installed on a supported device even
            after re-issuance; the eSIM activates but never receives
            a carrier signal in the destination country; a confirmed
            network outage in the destination country that lasts
            longer than the eSIM&apos;s validity window.
          </p>
        </Section>

        <Section id="not-eligible" title="2. When you are not eligible">
          <p>
            We <strong>cannot</strong> refund an eSIM in the following
            situations. These are the same exclusions Airalo applies
            on its own retail platform.
          </p>
          <ul>
            <li>
              <strong>Accidental purchase</strong> — you bought the
              wrong country, the wrong validity, or the wrong data
              size. Check the destination flag and plan summary
              before tapping <em>Pay</em>.
            </li>
            <li>
              <strong>Unused data</strong> — the eSIM has been
              installed on a device, even if you did not use the
              entire data allowance, or did not connect at all after
              installing. Installation is the trigger; once installed
              the eSIM is considered consumed.
            </li>
            <li>
              <strong>Device compatibility</strong> — your phone
              turned out not to support eSIM, or is carrier-locked.
              Use the <em>Check compatibility</em> tool on the
              install page <strong>before</strong> buying.
            </li>
            <li>
              <strong>Plan expired</strong> — the eSIM&apos;s
              validity period ended before you used it. Validity
              starts when the eSIM first attaches to a carrier
              network in the destination country.
            </li>
            <li>
              <strong>Fair-usage throttling</strong> — speeds were
              reduced on an Unlimited plan after the fair-usage
              threshold was reached. The threshold is disclosed on
              every Unlimited plan card before purchase.
            </li>
            <li>
              <strong>Local regulatory issues</strong> — the
              destination country has restricted eSIM use after you
              bought (for example a new sanctions or roaming rule).
              Airalo geofences these where possible; if a plan is
              withdrawn before activation, you will be refunded under
              §1 above.
            </li>
            <li>
              <strong>Suspected fraud or policy violation</strong> —
              if we or our network partner suspect chargeback abuse,
              account sharing, resale, or use of the eSIM for spam or
              illegal traffic.
            </li>
          </ul>
        </Section>

        <Section id="request" title="3. How to request a refund">
          <p>To request a refund or open a support case:</p>
          <ol>
            <li>
              Email{' '}
              <a href="mailto:sales@sinaitaxi.com">sales@sinaitaxi.com</a>
              {' '}from the address on the original order.
            </li>
            <li>
              Include your <strong>order reference</strong> (the
              short ID at the top of the receipt page,
              format <code>ord_xxxxxxxx</code>).
            </li>
            <li>
              Describe the problem in plain language. If it is a
              connectivity issue, please include: the destination
              country, your device model and operating system
              version, and a screenshot of the eSIM status page on
              your device.
            </li>
          </ol>
          <p>
            We acknowledge every support email within
            <strong> 1 business day</strong>. For technical faults
            we open a ticket with our network partner the same day
            and keep you informed by reply email.
          </p>
        </Section>

        <Section id="timeline" title="4. Timeline & method">
          <p>
            Approved refunds are issued back to the{' '}
            <strong>original payment method</strong> (the card or
            wallet used at checkout). We cannot redirect a refund to
            a different card or to a bank transfer.
          </p>
          <ul>
            <li>
              <strong>Automatic refunds</strong> (fulfilment failed) —
              within 5 business days of the failure.
            </li>
            <li>
              <strong>Approved support refunds</strong> — within
              5–10 business days of approval. The delay depends on
              your card issuer; we cannot speed this up beyond
              issuing the refund instruction to Stripe.
            </li>
            <li>
              <strong>Currency.</strong> Refunds are issued in EUR
              (the currency you were charged in). If your card was
              denominated in a different currency, your card issuer
              re-converts the refund; small FX differences are
              outside our control.
            </li>
          </ul>
        </Section>

        <Section id="partial" title="5. Partial refunds & credits">
          <p>
            We <strong>do not issue partial refunds</strong> for
            unused data on an installed eSIM. Top-ups remain the
            recommended path if you under-estimated your data needs —
            visit your receipt page to add data to the existing eSIM
            without a new install.
          </p>
          <p>
            We do not currently offer store credit in lieu of a cash
            refund. If a refund is approved, it is paid back to your
            original payment method.
          </p>
        </Section>

        <Section id="consumer" title="6. Statutory consumer rights">
          <p>
            Nothing in this Refund Policy limits the rights granted
            to you under mandatory consumer-protection law in your
            country of residence.
          </p>
          <p>
            If you are an <strong>EU/EEA consumer</strong>, the
            14-day right of withdrawal under Directive 2011/83/EU
            does not apply to fully performed digital services that
            you have given express prior consent to begin (Article
            16(m)). Installing the eSIM constitutes such consent.
            However, your statutory remedies for non-conformity of a
            digital service (Directive 2019/770) remain available.
          </p>
        </Section>

        <Section id="contact" title="7. Contact us">
          <p>
            For all refund or support requests:
          </p>
          <p>
            Sinai Taxi<br />
            71-75 Shelton Street, Covent Garden<br />
            London WC2H 9JQ, United Kingdom<br />
            Email: <a href="mailto:sales@sinaitaxi.com">sales@sinaitaxi.com</a><br />
            WhatsApp: <a href="https://wa.me/441908380111" target="_blank" rel="noreferrer">+44 1908 380111</a><br />
            Website: <a href="https://esim.sinaitaxi.com">esim.sinaitaxi.com</a>
          </p>
          <p>
            Full legal agreement: see our{' '}
            <a href="/terms">Terms of service</a>.
          </p>
        </Section>
      </LegalLayout>
    </>
  );
}

const Section: React.FC<{ id: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => (
  <section id={id}>
    <h2>{title}</h2>
    {children}
  </section>
);
