/**
 * /api/stripe — Proxy sécurisé Stripe
 *
 * Clés dans Vercel Environment Variables :
 *   STRIPE_SECRET_KEY       → sk_live_... (ou sk_test_... en dev)
 *   STRIPE_WEBHOOK_SECRET   → whsec_...
 *
 * Routes disponibles (passées dans ?action=...) :
 *   create-checkout  → crée une session Stripe Checkout
 *   webhook          → vérifie et traite les webhooks Stripe
 *   portal           → ouvre le portail de facturation client
 */

import Stripe from 'stripe';

const PRICE_IDS = {
  basic_monthly:  process.env.STRIPE_PRICE_BASIC_MONTHLY  || "price_1T9rqoEPK1a79r1P48fndZcd",
  basic_yearly:   process.env.STRIPE_PRICE_BASIC_YEARLY   || "price_1T9s2GEPK1a79r1PUei8TZk4",
  expert_monthly: process.env.STRIPE_PRICE_EXPERT_MONTHLY || "price_1T9rrPEPK1a79r1PpWclhLu2",
  expert_yearly:  process.env.STRIPE_PRICE_EXPERT_YEARLY  || "price_1T9s1OEPK1a79r1PLGhHBlGL",
  pro_monthly:    process.env.STRIPE_PRICE_PRO_MONTHLY    || "price_1T9rrsEPK1a79r1PEqSQPtaG",
  pro_yearly:     process.env.STRIPE_PRICE_PRO_YEARLY     || "price_1T9s0GEPK1a79r1PM9hkWc5Y",
};

// Lit le body brut depuis la requête (compatible Vercel serverless)
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", chunk => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export const config = { api: { bodyParser: false } };

async function createCheckout(req, res, stripe) {
  let body;
  try {
    const raw = await getRawBody(req);
    body = JSON.parse(raw.toString());
  } catch { return res.status(400).json({ error: "Body invalide" }); }

  const { planId, yearly, email, userId, successUrl, cancelUrl } = body;
  const priceKey = `${planId}_${yearly ? "yearly" : "monthly"}`;
  const priceId = PRICE_IDS[priceKey];
  if (!priceId) return res.status(400).json({ error: `Plan inconnu : ${priceKey}` });

  const baseUrl = "https://sub-craft-fxea.vercel.app";
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      ...(email ? { customer_email: email } : {}),
      metadata: { userId: userId || "guest", planId, yearly: String(yearly) },
      success_url: successUrl || `${baseUrl}/?payment=success&plan=${planId}`,
      cancel_url: cancelUrl || `${baseUrl}/?payment=cancel`,
    });
    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function handleWebhook(req, res, stripe) {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return res.status(500).json({ error: "STRIPE_WEBHOOK_SECRET manquant" });

  let event;
  try {
    const raw = await getRawBody(req);
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch (err) {
    return res.status(400).json({ error: `Webhook invalide: ${err.message}` });
  }

  const updateUserPlan = async (userId, plan) => {
    const creditsMap = { free: 3, basic: 30, expert: 100, pro: 999999 };
    await fetch(`${process.env.SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "apikey": process.env.SUPABASE_SERVICE_KEY,
        "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ plan, credits: creditsMap[plan] ?? 3 }),
    });
  };

  switch (event.type) {
    case "checkout.session.completed": {
      const { userId, planId } = event.data.object.metadata;
      await updateUserPlan(userId, planId);
      break;
    }
    case "customer.subscription.deleted": {
      const userId = event.data.object.metadata?.userId;
      if (userId) await updateUserPlan(userId, "free");
      break;
    }
  }
  return res.status(200).json({ received: true });
}

async function createPortal(req, res, stripe) {
  let body;
  try {
    const raw = await getRawBody(req);
    body = JSON.parse(raw.toString());
  } catch { return res.status(400).json({ error: "Body invalide" }); }

  const { customerId } = body;
  if (!customerId) return res.status(400).json({ error: "customerId requis" });
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: "https://sub-craft-fxea.vercel.app",
    });
    return res.status(200).json({ url: session.url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export default async function handler(req, res) {
  // CORS
  const allowedOrigins = [
    "https://subcraftai.com",
    "https://www.subcraftai.com",
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ].filter(Boolean);
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return res.status(500).json({ error: "STRIPE_SECRET_KEY manquant" });

  const stripe = new Stripe(secretKey, { apiVersion: "2024-04-10" });
  const action = req.query.action;

  if (action === "create-checkout") return createCheckout(req, res, stripe);
  if (action === "webhook")         return handleWebhook(req, res, stripe);
  if (action === "portal")          return createPortal(req, res, stripe);

  return res.status(400).json({ error: `Action inconnue: ${action}` });
}
