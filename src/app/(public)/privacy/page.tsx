import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { LegalLayout, type LegalSection } from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'Privacy policy · Sinai Taxi eSIM',
  description:
    'How Sinai Taxi eSIM collects, uses, and protects your data. Built around three principles: ask for only what we need, keep it for as little as possible, and never sell it.',
};

const TOC: LegalSection[] = [
  { id: 'principles',    title: '1. Our principles' },
  { id: 'data-we-collect', title: '2. What data we collect' },
  { id: 'how-we-use',    title: '3. How we use it' },
  { id: 'third-parties', title: '4. Third parties' },
  { id: 'cookies',       title: '5. Cookies & local storage' },
  { id: 'retention',     title: '6. Data retention' },
  { id: 'your-rights',   title: '7. Your rights (GDPR)' },
  { id: 'transfers',     title: '8. International transfers' },
  { id: 'security',      title: '9. Security' },
  { id: 'children',      title: '10. Children' },
  { id: 'changes',       title: '11. Changes to this policy' },
  { id: 'contact',       title: '12. Contact us' },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy policy"
        title="We ask for only what we need."
        subtitle="No account creation. No marketing database. Your email gets your receipt; your card details stay with Stripe. That's most of the policy in two sentences — the rest is detail."
        effectiveDate="20 June 2026"
      />

      <LegalLayout toc={TOC}>
        <Section id="principles" title="1. Our principles">
          <p>
            Privacy policies are usually written to protect the
            company. We've written ours to be honest. Three rules
            we hold ourselves to:
          </p>
          <ol>
            <li>
              <strong>Ask for the minimum.</strong> We only collect
              data we genuinely need to deliver an eSIM to you.
              No account creation, no phone number, no marketing
              questionnaire.
            </li>
            <li>
              <strong>Keep it briefly.</strong> Operational data
              (orders, receipts) is retained while it's useful
              for support and tax. Everything else is purged on
              a defined schedule, listed below.
            </li>
            <li>
              <strong>Never sell it.</strong> We have never sold
              customer data to anyone and we have no commercial
              interest in starting. There are no advertising
              trackers on this site.
            </li>
          </ol>
        </Section>

        <Section id="data-we-collect" title="2. What data we collect">
          <h3>From you, directly</h3>
          <ul>
            <li>
              <strong>Email address.</strong> Required at checkout
              so we can send the QR code receipt and provide
              support. We don't add it to a marketing list.
            </li>
            <li>
              <strong>Order details.</strong> Which plan you bought,
              which country it's for, the price, and the date.
            </li>
            <li>
              <strong>Payment confirmation.</strong> Whether the
              charge succeeded. Stripe sends us this; we never see
              your card number, CVV, or billing address.
            </li>
          </ul>

          <h3>Automatically, when you browse</h3>
          <ul>
            <li>
              <strong>Technical logs.</strong> Standard web server
              logs (IP, browser, page URL, timestamp) for security
              and abuse-prevention purposes. Retained for 30 days,
              then deleted.
            </li>
            <li>
              <strong>Functional storage.</strong> A single cookie
              keeps you signed into the team dashboard when
              applicable. No advertising or tracking cookies.
            </li>
          </ul>

          <h3>From our network partner</h3>
          <ul>
            <li>
              <strong>eSIM identifiers.</strong> After purchase,
              the network partner returns the ICCID and QR code
              for your eSIM. These are stored against your order
              so we can re-issue the QR if you lose it, and so
              you can top up later.
            </li>
            <li>
              <strong>Usage snapshots.</strong> When you load your
              receipt page, we fetch your live data usage and days
              remaining from the network partner. We don't log
              what websites you visit — only the aggregate "X MB of
              Y MB used" figure.
            </li>
          </ul>
        </Section>

        <Section id="how-we-use" title="3. How we use it">
          <p>
            Every piece of data above is used for one of three
            purposes:
          </p>
          <ul>
            <li>
              <strong>Service delivery.</strong> Sending your QR
              code, fulfilling top-ups, showing your usage on the
              receipt page.
            </li>
            <li>
              <strong>Customer support.</strong> When you email us
              about an order, we use your order data to investigate.
            </li>
            <li>
              <strong>Legal compliance.</strong> Tax records,
              fraud-prevention checks, and responding to lawful
              requests from authorities.
            </li>
          </ul>
          <p>
            We do not use your data for advertising. We do not
            profile you. We do not share your email with anyone
            outside the processors listed below.
          </p>
        </Section>

        <Section id="third-parties" title="4. Third parties">
          <p>
            We rely on three external services to operate Sinai
            Taxi eSIM. Each one is independently certified and
            receives only the data they need.
          </p>
          <h3>Stripe (payments)</h3>
          <p>
            Stripe processes every payment on our site. They are
            PCI-DSS Level 1 certified — the highest tier in
            card-data security. Stripe sees your card details,
            billing address, and the order amount; we see only
            the charge ID and whether it succeeded. Stripe's privacy
            policy lives at{' '}
            <a href="https://stripe.com/privacy" target="_blank" rel="noreferrer">stripe.com/privacy</a>.
          </p>

          <h3>Airalo Partner API (network partner)</h3>
          <p>
            Airalo is our wholesale eSIM provider. We send them
            your order details (which plan, which country, an
            anonymous order reference) so they can provision the
            eSIM. They do not receive your email or any payment
            information. Airalo's policy lives at{' '}
            <a href="https://www.airalo.com/privacy-policy" target="_blank" rel="noreferrer">airalo.com/privacy-policy</a>.
          </p>

          <h3>Vercel & Railway (hosting)</h3>
          <p>
            Our website is hosted on Vercel and our backend on
            Railway. Both are SOC 2 Type II certified. Server logs
            transit these providers as a normal part of HTTP
            request handling.
          </p>
        </Section>

        <Section id="cookies" title="5. Cookies & local storage">
          <p>
            This site uses one functional cookie: <code>admin_token</code>,
            an httpOnly session cookie for team members logged
            into the internal dashboard. It is not set for
            regular customers and does not appear on the
            public-facing site.
          </p>
          <p>
            We do not use any of the following: advertising
            cookies, tracking pixels, analytics that fingerprint
            visitors, social-media share buttons that ping back
            to their host, or third-party scripts beyond Stripe.js
            on the checkout page (required to render Stripe
            Elements securely).
          </p>
        </Section>

        <Section id="retention" title="6. Data retention">
          <ul>
            <li>
              <strong>Order records:</strong> retained for 7 years
              for tax and accounting purposes (mandatory under
              Egyptian commercial law).
            </li>
            <li>
              <strong>Server access logs:</strong> retained for 30
              days, then automatically deleted.
            </li>
            <li>
              <strong>Email correspondence:</strong> retained for 2
              years from the date of last contact, then deleted.
            </li>
            <li>
              <strong>Stripe / Airalo data:</strong> subject to each
              provider's own retention policy.
            </li>
          </ul>
        </Section>

        <Section id="your-rights" title="7. Your rights (GDPR)">
          <p>
            If you are an EU/EEA or UK resident, the General Data
            Protection Regulation grants you the following rights
            over your personal data. We honour all of them
            regardless of where you live.
          </p>
          <ul>
            <li>
              <strong>Right of access (Art. 15).</strong> Ask us
              what we hold about you. We'll send a complete export
              within 30 days, free of charge.
            </li>
            <li>
              <strong>Right to rectification (Art. 16).</strong>
              Ask us to correct inaccurate data.
            </li>
            <li>
              <strong>Right to erasure (Art. 17).</strong> Ask us
              to delete your data, subject to legal retention
              periods (e.g. tax records).
            </li>
            <li>
              <strong>Right to restrict processing (Art. 18).</strong>
              Ask us to pause processing while a dispute is open.
            </li>
            <li>
              <strong>Right to data portability (Art. 20).</strong>
              Ask us to send your data to another provider in a
              machine-readable format.
            </li>
            <li>
              <strong>Right to object (Art. 21).</strong> Object to
              processing for direct marketing — we don't do
              direct marketing, but the right exists if it ever
              changes.
            </li>
          </ul>
          <p>
            To exercise any of these rights, email{' '}
            <a href="mailto:sales@sinaitaxi.com">sales@sinaitaxi.com</a>
            {' '}with the subject line "Data request". You may also
            lodge a complaint with your national supervisory
            authority if you believe we've mishandled your data.
          </p>
        </Section>

        <Section id="transfers" title="8. International transfers">
          <p>
            Sinai Taxi is based in Egypt. Our backend runs on
            Railway servers in the European Union; our website
            runs on Vercel's global CDN; our payment processor
            (Stripe) and network partner (Airalo) operate
            internationally with appropriate safeguards.
          </p>
          <p>
            Where data crosses borders into jurisdictions not
            covered by an EU Commission adequacy decision, we
            rely on Standard Contractual Clauses (SCCs) with
            each processor to protect your data.
          </p>
        </Section>

        <Section id="security" title="9. Security">
          <p>
            We protect your data using industry-standard measures:
          </p>
          <ul>
            <li>
              All site traffic is encrypted in transit with TLS 1.3.
            </li>
            <li>
              Payment data never reaches our servers — Stripe
              handles it directly via tokenisation.
            </li>
            <li>
              Database access is restricted to a small number of
              authorised employees, all logged.
            </li>
            <li>
              Secrets (API keys, tokens) are stored in
              hardware-backed key vaults, not in source code.
            </li>
          </ul>
          <p>
            No system is perfectly secure. If we ever experience a
            breach affecting your data, we will notify you and
            the relevant supervisory authority within 72 hours,
            as required by GDPR.
          </p>
        </Section>

        <Section id="children" title="10. Children">
          <p>
            Sinai Taxi eSIM is not directed at children under 16.
            We do not knowingly collect data from anyone under 16.
            If you believe a child has provided data to us, please
            contact us and we'll delete it.
          </p>
        </Section>

        <Section id="changes" title="11. Changes to this policy">
          <p>
            We will update this policy when our practices change
            or when the law requires it. The "Effective" date at
            the top of this page always shows the latest version.
            Material changes (e.g. adding a new processor) will
            be highlighted at the top of the page for at least 30
            days.
          </p>
        </Section>

        <Section id="contact" title="12. Contact us">
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
