import express, { Router } from "express";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db, schema } from "../db/index.js";
import { env } from "../env.js";
import { requireAuth } from "../middleware/requireAuth.js";

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null;

function needStripe(): Stripe {
  if (!stripe) throw new Error("STRIPE_SECRET_KEY is not set");
  return stripe;
}

async function getOrCreateCustomer(userId: string, email: string, name: string) {
  const existing = await db.query.subscription.findFirst({ where: eq(schema.subscription.userId, userId) });
  if (existing) return existing.stripeCustomerId;
  const customer = await needStripe().customers.create({ email, name, metadata: { userId } });
  await db.insert(schema.subscription).values({ userId, stripeCustomerId: customer.id });
  return customer.id;
}

async function syncSubscription(sub: Stripe.Subscription) {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const item = sub.items.data[0];
  const periodEnd = item?.current_period_end;
  await db
    .update(schema.subscription)
    .set({
      stripeSubscriptionId: sub.id,
      status: sub.status,
      priceId: item?.price.id ?? null,
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
      updatedAt: new Date(),
    })
    .where(eq(schema.subscription.stripeCustomerId, customerId));
}

// ---- Webhook (needs the RAW body — mounted before express.json) ----
export const stripeWebhook = Router();
stripeWebhook.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  let event: Stripe.Event;
  try {
    event = needStripe().webhooks.constructEvent(req.body, req.headers["stripe-signature"] as string, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature failed:", (err as Error).message);
    return res.status(400).send("Bad signature");
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await syncSubscription(event.data.object);
      break;
    case "checkout.session.completed": {
      const s = event.data.object;
      if (s.subscription) {
        const sub = await needStripe().subscriptions.retrieve(s.subscription as string);
        await syncSubscription(sub);
      }
      break;
    }
  }
  res.json({ received: true });
});

// ---- Authenticated billing API ----
export const billing = Router();
billing.use(requireAuth);

billing.get("/status", async (req, res) => {
  const sub = await db.query.subscription.findFirst({ where: eq(schema.subscription.userId, req.session!.user.id) });
  const active = sub?.status === "active" || sub?.status === "trialing";
  res.json({ plan: active ? "pro" : "free", status: sub?.status ?? "none", currentPeriodEnd: sub?.currentPeriodEnd ?? null });
});

billing.post("/checkout", async (req, res) => {
  const { user } = req.session!;
  const customer = await getOrCreateCustomer(user.id, user.email, user.name);
  const session = await needStripe().checkout.sessions.create({
    mode: "subscription",
    customer,
    line_items: [{ price: env.STRIPE_PRICE_PRO_MONTHLY, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${env.APP_URL}/dashboard?upgraded=1`,
    cancel_url: `${env.APP_URL}/dashboard`,
  });
  res.json({ url: session.url });
});

billing.post("/portal", async (req, res) => {
  const { user } = req.session!;
  const customer = await getOrCreateCustomer(user.id, user.email, user.name);
  const portal = await needStripe().billingPortal.sessions.create({ customer, return_url: `${env.APP_URL}/dashboard` });
  res.json({ url: portal.url });
});
