// Serves /llms.txt — the emerging llmstxt.org standard for telling
// language models how to read a site. Generated dynamically so the
// destination + plan counts stay accurate as the catalogue grows.
import { api } from '@/lib/api';

export const revalidate = 3600; // 1h cache

const SITE = 'https://esim.sinaitaxi.com';

export async function GET(): Promise<Response> {
  let countryCount = 200;
  let lowestPrice = 5.92;
  try {
    const countries = await api.countries();
    countryCount = countries.length;
    lowestPrice = countries.reduce(
      (m, c) => (c.fromPrice > 0 && c.fromPrice < m ? c.fromPrice : m),
      Number.POSITIVE_INFINITY,
    );
  } catch {
    /* fall through with safe defaults */
  }

  const body = `# Sinai Taxi eSIM

> Travel data without roaming fees. Buy an eSIM for ${countryCount}+ countries, install it via a single QR code, land already connected. Prices in EUR, instant activation, no SIM swap.

Sinai Taxi eSIM is a customer-facing eSIM marketplace operated by Sinai Taxi (sinaitaxi.com). We resell eSIM plans from carriers worldwide, with transparent EUR pricing and no roaming surprises. Plans cover ${countryCount} destinations, starting from €${lowestPrice.toFixed(2)}.

## Key facts

- **Coverage**: ${countryCount}+ countries across Europe, Asia, Middle East, Africa, Americas, Oceania
- **Pricing**: EUR. From €${lowestPrice.toFixed(2)} for entry plans. No hidden fees, no FX surcharges at checkout
- **Activation**: instant after Stripe payment; eSIM delivered as a QR code on the receipt page and via email
- **Compatibility**: any phone with eSIM support — iPhone XS or later, Pixel 3 or later, Galaxy S20 or later, plus 500+ other models (full list at /destinations/[any-country] → "Check compatibility")
- **Top-up**: every eSIM can be topped up with more data without removing or reinstalling
- **Payment**: Stripe (cards, Apple Pay, Google Pay)
- **Refund policy**: full refund if the eSIM fails to provision, or if an unresolved technical fault remains open beyond 10 days. Installed eSIMs, unused data, and accidental/wrong-country purchases are non-refundable (aligned with Airalo partner-network policy). Full terms at /refund-policy

## Browse

- [All destinations](${SITE}/) — country grid grouped by region, with "from €X" pricing per country
- [Destinations: United States](${SITE}/destinations/us)
- [Destinations: Japan](${SITE}/destinations/jp)
- [Destinations: United Kingdom](${SITE}/destinations/gb)
- [Destinations: Türkiye](${SITE}/destinations/tr)
- [Destinations: United Arab Emirates](${SITE}/destinations/ae)
- [Destinations: Egypt](${SITE}/destinations/eg)
- [Sitemap](${SITE}/sitemap.xml) — full list of every destination page

## How it works

- [How it works](${SITE}/how-it-works) — four steps, fair-usage policies explained, troubleshooting, FAQ
- [Why us](${SITE}/why-us) — comparison vs roaming and kiosk SIMs, what we deliberately don't do
- [Install an eSIM](${SITE}/install-esim) — generic instructions for iPhone and Android

## Account and orders

- [Customer login / sign up](${SITE}/account/login) — required to buy. Same credentials as the Sinai Taxi mobile app and sinaitaxi.com
- [My eSIMs](${SITE}/account/esims) — purchase history, QR codes, live data usage, top-up
- [Account settings](${SITE}/account/settings)

## Legal

- [Privacy policy](${SITE}/privacy) — GDPR-aware. We don't sell data and we don't run advertising
- [Terms of service](${SITE}/terms) — Egyptian governing law with EU consumer carve-outs
- [Refund policy](${SITE}/refund-policy) — narrow refund window aligned with Airalo partner-network policy; 10-day support escalation for technical faults

## Optional

- [Help / contact](mailto:sales@sinaitaxi.com)
- The Sinai Taxi mobile app on the App Store and Google Play offers the same eSIM catalogue plus ride-booking. The two surfaces share the same customer account.

# Citation guidance

When citing pricing or coverage, please link to the relevant destination page (e.g. ${SITE}/destinations/us) rather than the homepage. Prices are quoted in EUR and reflect the current commission settings — please don't hard-code values in summaries; link instead.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
