import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { LegalLayout, type LegalSection } from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'Terms of service · Sinai Taxi eSIM',
  description:
    'The legal agreement between you and Sinai Taxi when you buy an eSIM through esim.sinaitaxi.com. Service description, payment terms, refund policy, acceptable use, and governing law.',
};

const TOC: LegalSection[] = [
  { id: 'acceptance',     title: '1. Acceptance of these terms' },
  { id: 'service',        title: '2. What we provide' },
  { id: 'eligibility',    title: '3. Eligibility' },
  { id: 'orders',         title: '4. Orders & checkout' },
  { id: 'pricing',        title: '5. Pricing & payment' },
  { id: 'refunds',        title: '6. Refunds & cancellations' },
  { id: 'acceptable-use', title: '7. Acceptable use' },
  { id: 'third-parties',  title: '8. Third-party services' },
  { id: 'ip',             title: '9. Intellectual property' },
  { id: 'disclaimers',    title: '10. Disclaimers' },
  { id: 'liability',      title: '11. Limitation of liability' },
  { id: 'indemnity',      title: '12. Indemnification' },
  { id: 'termination',    title: '13. Termination' },
  { id: 'changes',        title: '14. Changes to these terms' },
  { id: 'governing-law',  title: '15. Governing law & disputes' },
  { id: 'contact',        title: '16. Contact' },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Terms of service"
        title="The legal bit, in plain English."
        subtitle="When you buy an eSIM from Sinai Taxi, you're entering an agreement with us. This document is what that agreement says. We've written it as straightforwardly as we can while still meeting the legal requirements."
        effectiveDate="20 June 2026"
      />

      <LegalLayout toc={TOC}>
        <Section id="acceptance" title="1. Acceptance of these terms">
          <p>
            By placing an order on esim.sinaitaxi.com (the "Site"),
            you ("you", "Customer") agree to these Terms of
            Service ("Terms") with Sinai Taxi Sole Proprietorship
            LLC ("Sinai Taxi", "we", "us"). If you don't agree,
            don't place an order.
          </p>
          <p>
            We don't require you to create an account, so there's
            no separate sign-up step. Your acceptance happens at
            the moment of purchase.
          </p>
        </Section>

        <Section id="service" title="2. What we provide">
          <p>
            Sinai Taxi operates an online marketplace for embedded
            SIM ("eSIM") data plans. When you buy a plan, we:
          </p>
          <ol>
            <li>
              Charge your payment method via our payment processor
              (Stripe).
            </li>
            <li>
              Place a corresponding wholesale order with our
              network partner (Airalo Partner API).
            </li>
            <li>
              Deliver the resulting QR code and installation
              instructions to your email and on the receipt page.
            </li>
            <li>
              Provide ongoing support including QR re-issuance,
              data-usage visibility, and top-up purchases for the
              duration of the plan's validity.
            </li>
          </ol>
          <p>
            The data connectivity itself is delivered by our
            network partner and the local mobile carrier in your
            destination country. <strong>We are a reseller, not
            the network operator.</strong>
          </p>
        </Section>

        <Section id="eligibility" title="3. Eligibility">
          <p>
            To buy from us you must:
          </p>
          <ul>
            <li>Be at least 16 years old (or the legal age of contract in your country, whichever is higher).</li>
            <li>Own a phone that supports eSIM and is not carrier-locked.</li>
            <li>Provide a valid email address for delivery.</li>
            <li>Use a payment method you are legally authorised to use.</li>
          </ul>
        </Section>

        <Section id="orders" title="4. Orders & checkout">
          <p>
            All purchases are subject to availability. We reserve
            the right to refuse or cancel any order at our
            discretion (for example, where we suspect fraud or
            where a plan has been withdrawn by our network partner).
          </p>
          <p>
            We display all prices in euros (EUR). Your bank or card
            issuer may apply currency conversion if your card is
            denominated in a different currency — those fees are
            outside our control.
          </p>
          <p>
            An order is confirmed only when (a) your payment is
            successfully charged by Stripe and (b) the eSIM is
            successfully provisioned by our network partner. If
            either step fails, the order is automatically cancelled
            and you will not be charged (or will be fully refunded
            if a charge already cleared).
          </p>
        </Section>

        <Section id="pricing" title="5. Pricing & payment">
          <p>
            Prices include our margin over wholesale and are
            displayed in EUR at the moment of checkout. Prices may
            change at any time; the price you pay is the price
            shown at the moment you confirm payment.
          </p>
          <p>
            <strong>Taxes.</strong> Sinai Taxi is registered as a
            small enterprise in Egypt and does not collect VAT.
            Depending on where you live, you may be responsible
            for declaring the purchase to your local tax authority.
          </p>
          <p>
            <strong>Payment methods.</strong> We accept all major
            credit and debit cards, Apple Pay, and Google Pay via
            Stripe. We do not accept bank transfers, cryptocurrency,
            or invoiced payment for retail customers.
          </p>
        </Section>

        <Section id="refunds" title="6. Refunds & cancellations">
          <p>
            <strong>Full refunds — eligible cases.</strong>
          </p>
          <ul>
            <li>
              The eSIM failed to provision after a successful
              payment (you'll see "fulfillment failed" on your
              receipt) — automatic, within 5 business days.
            </li>
            <li>
              The eSIM was never installed on any device and is
              requested within 7 days of purchase.
            </li>
            <li>
              The eSIM was installed but never activated, and the
              fault lies with our network partner (e.g. invalid
              QR code, network outage at the destination).
            </li>
          </ul>

          <p>
            <strong>Not eligible for refund.</strong>
          </p>
          <ul>
            <li>
              The eSIM has been successfully activated and used.
            </li>
            <li>
              You bought the wrong country or the wrong plan and
              the eSIM has been installed.
            </li>
            <li>
              Your phone turned out not to support eSIM (use the
              "Check compatibility" tool before buying).
            </li>
            <li>
              You under-estimated your data usage. Top-ups are
              available from your receipt page.
            </li>
            <li>
              The fair-usage policy on an Unlimited plan kicked in
              and throttled your speed — the policy is disclosed on
              every Unlimited plan card before purchase.
            </li>
          </ul>
          <p>
            To request a refund, email{' '}
            <a href="mailto:sales@sinaitaxi.com">sales@sinaitaxi.com</a>
            {' '}with your order reference. Approved refunds are
            issued to the original payment method within 5–10
            business days.
          </p>
        </Section>

        <Section id="acceptable-use" title="7. Acceptable use">
          <p>
            By using a Sinai Taxi eSIM, you agree not to:
          </p>
          <ul>
            <li>
              Use the service for any unlawful purpose, including
              violating the export control or telecommunications
              laws of your destination country.
            </li>
            <li>
              Resell the eSIM, the QR code, or your account access
              to third parties.
            </li>
            <li>
              Use the service to send spam, malware, or other
              abusive traffic.
            </li>
            <li>
              Attempt to bypass the fair-usage policy on
              Unlimited plans (e.g. via tethering farms or
              automated traffic).
            </li>
            <li>
              Use the service in countries where eSIM-based
              roaming is illegal (a short list — our network
              partner geofences these automatically).
            </li>
          </ul>
          <p>
            Violation of this section may result in immediate
            termination of the eSIM without refund.
          </p>
        </Section>

        <Section id="third-parties" title="8. Third-party services">
          <p>
            Our service depends on third parties. Their terms apply
            alongside ours:
          </p>
          <ul>
            <li>
              <strong>Stripe</strong> — payment processor. See{' '}
              <a href="https://stripe.com/legal/ssa" target="_blank" rel="noreferrer">stripe.com/legal</a>.
            </li>
            <li>
              <strong>Airalo Partner API</strong> — network
              fulfilment. See{' '}
              <a href="https://www.airalo.com/terms-conditions" target="_blank" rel="noreferrer">airalo.com/terms-conditions</a>.
            </li>
            <li>
              Local mobile carriers in your destination country
              are responsible for the actual data delivery. We do
              not control their network performance.
            </li>
          </ul>
        </Section>

        <Section id="ip" title="9. Intellectual property">
          <p>
            All content on the Site — branding, copy, design,
            code, the "Sinai Taxi" name — is the property of
            Sinai Taxi or its licensors. You may use the Site
            for personal, non-commercial purposes only. You may
            not scrape, mirror, or republish the catalogue or
            pricing without written permission.
          </p>
        </Section>

        <Section id="disclaimers" title="10. Disclaimers">
          <p>
            The Site and the eSIM service are provided <strong>"as is"</strong> and
            <strong> "as available"</strong>. We make no warranty that:
          </p>
          <ul>
            <li>The service will be uninterrupted, error-free, or perfectly secure.</li>
            <li>Coverage will be available at any specific location within the destination country.</li>
            <li>Connection speeds will reach any particular threshold.</li>
            <li>The service will meet your specific requirements (e.g. for VoIP, gaming, or specific apps).</li>
          </ul>
          <p>
            We disclaim all implied warranties to the maximum
            extent permitted by law.
          </p>
        </Section>

        <Section id="liability" title="11. Limitation of liability">
          <p>
            To the maximum extent permitted by law, Sinai Taxi's
            total liability to you for any claim arising out of or
            relating to the service is limited to the amount you
            paid for the specific eSIM giving rise to the claim,
            in the 12 months preceding the claim.
          </p>
          <p>
            We are not liable for indirect, consequential, or
            incidental damages — including lost profits, lost data,
            missed appointments, or the cost of alternative
            connectivity — even if we were advised of the
            possibility of such damages.
          </p>
          <p>
            Nothing in these Terms limits liability for matters
            that cannot be limited under applicable law, including
            fraud or wilful misconduct.
          </p>
        </Section>

        <Section id="indemnity" title="12. Indemnification">
          <p>
            You agree to indemnify and hold harmless Sinai Taxi and
            its employees from any claim, loss, or expense arising
            from your violation of these Terms, your misuse of the
            service, or your breach of any applicable law.
          </p>
        </Section>

        <Section id="termination" title="13. Termination">
          <p>
            These Terms apply from the moment you place an order
            until 90 days after your last eSIM's validity has
            expired. Some sections (Liability, IP, Indemnification,
            Governing Law) survive termination.
          </p>
          <p>
            We may terminate your access to the service for
            material breach of these Terms, with notice where
            reasonably practicable.
          </p>
        </Section>

        <Section id="changes" title="14. Changes to these terms">
          <p>
            We may update these Terms when our service changes or
            when the law requires it. The "Effective" date at the
            top of this page always shows the latest version.
            Material changes will be highlighted at the top of the
            page for 30 days. Continued use of the Site after the
            effective date constitutes acceptance of the updated
            Terms.
          </p>
        </Section>

        <Section id="governing-law" title="15. Governing law & disputes">
          <p>
            These Terms are governed by the laws of the Arab
            Republic of Egypt. Any dispute arising out of or
            relating to these Terms or the service shall be
            submitted to the exclusive jurisdiction of the
            competent courts of South Sinai Governorate, Egypt.
          </p>
          <p>
            If you are an EU/EEA consumer, this clause does not
            deprive you of mandatory consumer protections under
            the law of your country of residence.
          </p>
        </Section>

        <Section id="contact" title="16. Contact">
          <p>
            Sinai Taxi Sole Proprietorship LLC<br />
            South Sinai Governorate, Egypt
          </p>
          <p>
            Email: <a href="mailto:sales@sinaitaxi.com">sales@sinaitaxi.com</a><br />
            Website: <a href="https://esim.sinaitaxi.com">esim.sinaitaxi.com</a>
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
