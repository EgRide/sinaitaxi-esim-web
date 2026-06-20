# sinaitaxi-esim-web

Customer-facing eSIM marketplace + team dashboard at **esim.sinaitaxi.com**. Talks to the Fastify backend (`sinaitaxi-esim-api`) over HTTPS.

## Stack
- Next.js 15 (App Router, Server Components, React 19)
- Tailwind CSS + Geist font
- Stripe Elements / PaymentElement
- React Query for client state on the receipt + admin pages

## Local development

```bash
cp .env.local.example .env.local
# fill in pk_test_… in NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
npm install
npm run dev          # http://localhost:3000
```

The website expects the eSIM API at `http://localhost:4000`. Start that in the sibling repo first:
```bash
cd ../sinaitaxi-esim-api && npm run dev
```

## Pages

| Path                     | What it does                                       |
|--------------------------|----------------------------------------------------|
| `/`                      | Hero + country grid (server-rendered)              |
| `/destinations/[code]`   | Packages for a country + inline checkout           |
| `/orders/[id]`           | Receipt — polls until fulfilled, shows QR + install|
| `/orders/[id]/topup`     | Top-up picker for an existing eSIM                 |
| `/topups/[id]`           | Top-up receipt                                     |
| `/how-it-works`          | Marketing — install steps + FAQ                    |
| `/why-us`                | Marketing — comparison table + diff'rs             |
| `/privacy`, `/terms`     | Legal (GDPR-aware templates — get reviewed)        |
| `/admin/login`           | SSO against sinaitaxi PHP admin                    |
| `/admin`                 | Team dashboard — orders, revenue, commission       |
| `/admin/orders`          | Full orders table                                  |
| `/admin/settings`        | Commission % + minimum floor settings              |

## Deploying to Vercel

This repo is a vanilla Next.js project — Vercel auto-detects everything.

1. Push to GitHub.
2. Vercel → **Add New → Project** → import the repo.
3. **Environment Variables** (Production + Preview + Development):
   - `NEXT_PUBLIC_API_BASE_URL` → `https://api-esim.sinaitaxi.com`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → `pk_live_…`
4. **Deploy**.
5. **Settings → Domains** → add `esim.sinaitaxi.com` and follow the CNAME instruction.

That's it. No `vercel.json` needed.

## Notes

- The Stripe **secret** key never lives in this repo. It's server-side only, on the API (Railway).
- Admin login (`/admin/login`) federates against `https://api.sinaitaxi.com/admin/v1/dashboard/login`. Customers and admins share the same sinaitaxi credentials — no separate account.
- Pricing currency is EUR; the API does the USD → EUR conversion before responses leave the backend.
