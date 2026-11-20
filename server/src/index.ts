import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import { env } from "./env.js";
import { billing, stripeWebhook } from "./routes/billing.js";
import { requireAuth } from "./middleware/requireAuth.js";

const app = express();
app.set("trust proxy", 1);

// Order matters: auth + Stripe webhook read the raw body, so they go before express.json()
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use("/api/stripe/webhook", stripeWebhook);
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/billing", billing);

// ---- Your product's API routes go here ----
app.get("/api/me", requireAuth, (req, res) => res.json(req.session!.user));

// In production, Express also serves the built React app (one service to deploy)
if (env.NODE_ENV === "production") {
  const clientDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../client/dist");
  app.use(express.static(clientDist));
  app.get("/{*any}", (_req, res) => res.sendFile(path.join(clientDist, "index.html")));
}

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Server error" });
});

app.listen(env.PORT, () => console.log(`🚀 Server on http://localhost:${env.PORT}`));
