# saas-starter

Template for launching a micro SaaS. **Don't build products in this repo.** On GitHub, click **Use this template** and create a new repo for each product.

**Stack:** React 19 + Vite + TypeScript + Tailwind v4 + shadcn/ui · Express 5 · Postgres + Drizzle · Better Auth (email/password + optional Google) · Stripe subscriptions · Resend email

## What's included
- Landing page with features + pricing (all text in `client/src/config.ts`)
- Sign up / log in / sign out, protected dashboard
- Stripe Checkout, Customer Portal, webhook that syncs subscription status to the DB
- `requireAuth` middleware for your own API routes
- Dark mode by default, one-line rebrand via `--primary` in `client/src/index.css`
- Single-service deploy: in production Express serves the built React app

## Local setup
```bash
npm install
cp .env.example .env          # fill in DATABASE_URL and BETTER_AUTH_SECRET at minimum
npm run db:push               # creates tables
npm run dev                   # app: http://localhost:5173  ·  API: http://localhost:3000
```
Stripe webhooks locally: `stripe listen --forward-to localhost:3000/api/stripe/webhook` and paste the `whsec_...` into `.env`.

## Starting a new product (checklist)
1. **Use this template**, then create a new repo (ideally in its own GitHub org if it might be sold).
2. Edit `client/src/config.ts` (name, tagline, features, plans) and the `<title>` in `client/index.html`.
3. Change `--primary` in `client/src/index.css`.
4. New Stripe product + price, then set `STRIPE_PRICE_PRO_MONTHLY`.
5. Add your tables at the bottom of `server/src/db/schema.ts`, then run `npm run db:push`.
6. Add API routes in `server/src/index.ts` (use `requireAuth`), and build the UI in `client/src/pages/Dashboard.tsx`.
7. Check if a user is paid on the server: query the `subscription` table (`status` is `active` or `trialing`).

## Deploy (Railway or Render)
- Add a Postgres database, then set every variable from `.env.example`.
- Set `NODE_ENV=production`, and set `APP_URL` and `BETTER_AUTH_URL` to your public URL (same domain).
- Build: `npm ci && npm run build` · Start: `npm start` (Railway reads `railway.json`, which also runs `db:push`).
- Stripe dashboard: add a webhook pointing to `https://yourdomain.com/api/stripe/webhook` with these events:
  `checkout.session.completed`, `customer.subscription.created|updated|deleted`.
- Google login (optional): set the redirect URI to `https://yourdomain.com/api/auth/callback/google`.

## Improving the template
Generic improvements (better auth screens, new UI components) go **here**, so future products get them. Products already created don't get the changes, and that's intentional.
