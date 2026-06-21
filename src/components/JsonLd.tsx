// Server-rendered JSON-LD blocks. Inlined as a <script> tag with
// `type="application/ld+json"` so Google + Bing + Yandex + AI
// crawlers can parse the structured data without running JS.
//
// We expose a tiny <JsonLd> wrapper plus a `schemas` factory with
// every shape we use across the site.

const SITE = 'https://esim.sinaitaxi.com';
const ORG_ID = `${SITE}#org`;
const SERVICE_ID = `${SITE}#esim-service`;

interface JsonLdProps {
  data: object | object[];
}
export const JsonLd: React.FC<JsonLdProps> = ({ data }) => (
  <script
    type="application/ld+json"
    // dangerouslySetInnerHTML is intentional and safe — the data
    // is a controlled object, not user input.
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

export const schemas = {
  // ── Organization — appears in knowledge panels + AI answers ──
  organization: () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Sinai Taxi eSIM',
    alternateName: ['Sinai Taxi eSIM Marketplace', 'sinaitaxi eSIM'],
    url: SITE,
    logo: `${SITE}/logo.png`,
    description:
      'Sinai Taxi eSIM is a global eSIM marketplace covering 200+ destinations. Pay in EUR, install one QR code, land already connected. No SIM swap, no roaming charges.',
    sameAs: [
      'https://sinaitaxi.com',
      'https://apps.apple.com/app/sinai-taxi',
      'https://play.google.com/store/apps/details?id=com.sinaitaxi',
    ],
    parentOrganization: {
      '@type': 'Organization',
      name: 'Sinai Taxi',
      url: 'https://sinaitaxi.com',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'sales@sinaitaxi.com',
      availableLanguage: ['English', 'Arabic'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EG',
      addressRegion: 'South Sinai',
    },
  }),

  // ── Website + sitelinks search box ──────────────────────────
  website: () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE}#website`,
    url: SITE,
    name: 'Sinai Taxi eSIM',
    description:
      'Buy an eSIM for any country in 60 seconds. 200+ destinations, EUR pricing, instant activation.',
    inLanguage: 'en',
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }),

  // ── Service — the eSIM marketplace itself ───────────────────
  service: (params: { countryCount: number; lowestEur: number }) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': SERVICE_ID,
    name: 'Sinai Taxi eSIM — Global travel data plans',
    description:
      'Prepaid travel eSIM marketplace. Choose a country, pay in EUR, scan a QR code, get online instantly. Plans include standard data tiers and unlimited options.',
    provider: { '@id': ORG_ID },
    serviceType: 'eSIM activation',
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide',
      description: `${params.countryCount}+ destinations across every populated continent`,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: params.lowestEur.toFixed(2),
      offerCount: params.countryCount,
      availability: 'https://schema.org/InStock',
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'International travellers',
    },
  }),

  // ── FAQ — eligible for rich-snippet expansion in SERPs ──────
  faq: (items: { question: string; answer: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(i => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: i.answer,
      },
    })),
  }),

  // ── Breadcrumb — every drill-down page should have one ─────
  breadcrumbs: (crumbs: { name: string; url: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  }),

  // ── Per-country Product schema — used on /destinations/[code]
  countryProduct: (params: {
    countryCode: string;
    countryName: string;
    packageCount: number;
    lowestEur: number;
    cheapestPackageData?: string;
    cheapestPackageDays?: number;
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Travel eSIM for ${params.countryName}`,
    description: `${params.packageCount} prepaid travel data plans for ${params.countryName}. Pay in EUR, instant QR-code activation, no roaming charges.`,
    brand: { '@id': ORG_ID },
    category: 'Travel data eSIM',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '120',
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: params.lowestEur.toFixed(2),
      offerCount: params.packageCount,
      availability: 'https://schema.org/InStock',
      seller: { '@id': ORG_ID },
      ...(params.cheapestPackageData ? {
        eligibleQuantity: {
          '@type': 'QuantitativeValue',
          value: params.cheapestPackageData,
          unitText: 'data',
        },
      } : {}),
      ...(params.cheapestPackageDays ? {
        deliveryLeadTime: {
          '@type': 'QuantitativeValue',
          minValue: 0,
          maxValue: 5,
          unitCode: 'MIN',
        },
        priceValidUntil: new Date(Date.now() + params.cheapestPackageDays * 86_400_000).toISOString().slice(0, 10),
      } : {}),
    },
  }),
};
