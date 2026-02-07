# Aureate — Precious Metals Marketplace

A modern, secure web app for buying and selling **gold, silver, platinum, and palladium** with escrow-style checkout, live spot prices, and role-based dashboards.

## Tech stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes, Prisma ORM
- **Database:** PostgreSQL
- **Auth:** NextAuth.js (credentials + optional OAuth)
- **Payments:** Stripe (Payment Intents, webhooks)
- **Charts:** Recharts

## Getting started

### 1. Environment

```bash
cp .env.example .env
```

Edit `.env`:

- `DATABASE_URL` — PostgreSQL connection string (e.g. Vercel Postgres, Neon, local)
- `NEXTAUTH_URL` — `http://localhost:3000` (dev) or your production URL
- `NEXTAUTH_SECRET` — run `openssl rand -base64 32`
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — from Stripe Dashboard
- Optional: `METALS_API_KEY` / `METALS_API_URL` for live spot price feed

### 2. Database

```bash
npm run db:generate
npm run db:migrate
```

### 3. Seed spot prices (optional)

To show spot prices and charts, insert sample data:

```sql
INSERT INTO "SpotPrice" (id, metal, "priceUsd", currency, "fetchedAt") VALUES
  (gen_random_uuid(), 'GOLD', 2650.50, 'USD', now()),
  (gen_random_uuid(), 'SILVER', 31.20, 'USD', now()),
  (gen_random_uuid(), 'PLATINUM', 980.00, 'USD', now()),
  (gen_random_uuid(), 'PALLADIUM', 1050.00, 'USD', now());
```

Or implement a cron/API job that fetches from a metals API (e.g. metals.live, goldapi.io) and upserts into `SpotPrice`.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Stripe webhook (production)

Point Stripe webhook to `POST /api/webhooks/stripe` and subscribe to `payment_intent.succeeded`. Use the signing secret in `STRIPE_WEBHOOK_SECRET`.

## User roles

- **Buyer** — Browse, purchase, confirm delivery, open disputes
- **Seller** — Create listings, ship orders, receive payouts
- **Admin** — Users, listings, orders, disputes, analytics (`/admin`)

To promote a user to admin, update the DB: `UPDATE "User" SET role = 'ADMIN' WHERE email = '...';`

## Project structure

- `prisma/schema.prisma` — Database schema
- `src/app/api/` — API routes (auth, listings, orders, spot-prices, webhooks)
- `src/app/(auth)/auth/` — Sign in / sign up
- `src/app/listings/` — Marketplace and product detail
- `src/app/checkout/` — Checkout (Stripe)
- `src/app/dashboard/` — User dashboard (orders, wallet, listings)
- `src/app/admin/` — Admin panel
- `src/components/` — Reusable UI and feature components
- `src/lib/` — DB client, auth config, auth helpers

## Escrow flow

1. Buyer pays via Stripe → `payment_intent.succeeded` webhook sets order to **PAID_ESCROW**
2. Seller adds tracking and marks shipped → **SELLER_SHIPPING** / **SHIPPED**
3. Buyer confirms delivery → **COMPLETED** (funds released to seller in full implementation via Stripe Connect or payouts)
4. Platform fee (2%) is stored per order; revenue is tracked in admin analytics

## TODOs (advanced)

- [ ] Embed Stripe Payment Element on checkout page for card payment
- [ ] OAuth providers (Google/GitHub) in NextAuth
- [ ] Live metals API integration and cron for spot price cache
- [ ] Stripe Connect for seller payouts
- [ ] Email notifications (order created, shipped, delivered)
- [ ] Dispute resolution UI (admin notes, resolve for buyer/seller)
- [ ] Reviews after completed orders
- [ ] Image upload (e.g. S3/Uploadthing) instead of URL-only listings

## License

Private / use as needed.
# pmmv1
# pmmv1
# pmmv1
# pmmv1
