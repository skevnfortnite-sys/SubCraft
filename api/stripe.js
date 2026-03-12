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

const Stripe = require("stripe");

// IDs de tes produits Stripe (mis à jour le 11/03/2026)
const PRICE_IDS = {
  basic_monthly:  process.env.STRIPE_PRICE_BASIC_MONTHLY  || "price_1T9rqoEPK1a79r1P48fndZcd",
  basic_yearly:   process.env.STRIPE_PRICE_BASIC_YEARLY   || "price_1T9s2GEPK1a79r1PUei8TZk4",
  expert_monthly: process.env.STRIPE_PRICE_EXPERT_MONTHLY || "price_1T9rrPEPK1a79r1PpWclhLu2",
  expert_yearly:  process.env.STRIPE_PRICE_EXPERT_YEARLY  || "price_1T9s1OEPK1a79r1PLGhHBlGL",
  pro_monthly:    process.env.STRIPE_PRICE_PRO_MONTHLY    || "price_1T9rrsEPK1a79r1PEqSQPtaG",
  pro_yearly:     process.env.STRIPE_PRICE_PRO_YEARLY     || "price_1T9s0GEPK1a79r1PM9hkWc5Y",
};

export const config = {
  api: { bodyParser: false }, // nécessaire pour webhook signature
};

const { buffer } = require("micro");

async function createCheckout(req, res, stripe) {
  // body parsé manuellement pour cette route
  let body;
  try {
    const raw = await buffer(req);
    body = JSON.parse(raw.toString());
  } catch {
    return res.status(400).json({ error: "Body invalide" });
  }

  const { planId, yearly, userEmail, userId } = body;
  const priceKey = `${planId}_${yearly ? "yearly" : "monthly"}`;
  const priceId = PRICE_IDS[priceKey];

  if (!priceId) {
    return res.status(400).json({ error: `Plan inconnu : ${priceKey}` });
  }
  if (!userEmail || !userId) {
    return res.status(400).json({ error: "userEmail et userId requis" });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://subcraftai.com";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: userEmail,
      metadata: { userId, planId, yearly: String(yearly) },
      success_url: `${baseUrl}/dashboard?checkout=success&plan=${planId}`,
      cancel_url:  `${baseUrl}/pricing?checkout=cancelled`,
      subscription_data: {
        metadata: { userId, planId },
        trial_period_days: 0,
      },
      // TVA automatique (requis pour les SaaS en France)
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
    });

    return res.status(200).json({ url: session.url, sessionId: session.id });

  } catch (err) {
    console.error("[stripe checkout]", err.message);
    return res.status(500).json({ error: err.message });
  }
}

async function handleWebhook(req, res, stripe) {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) return res.status(500).json({ error: "STRIPE_WEBHOOK_SECRET manquant" });

  let event;
  try {
    const raw = await buffer(req);
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch (err) {
    console.error("[stripe webhook] Signature invalide:", err.message);
    return res.status(400).json({ error: `Webhook invalide: ${err.message}` });
  }

  // Helper pour mettre à jour Supabase
  const updateUserPlan = async (userId, plan, credits) => {
    const creditsMap = { free: 3, basic: 30, expert: 100, pro: Infinity };
    await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/users?id=eq.${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          plan,
          credits: credits ?? creditsMap[plan] ?? 3,
        }),
      }
    );
    console.log(`✅ Supabase mis à jour — user:${userId} plan:${plan}`);
  };

  // Traitement des événements
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const { userId, planId } = session.metadata;
      console.log(`✅ Paiement réussi — user:${userId} plan:${planId}`);
      await updateUserPlan(userId, planId);
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const userId = sub.metadata?.userId;
      console.log(`⚠️ Abonnement annulé — user:${userId}`);
      await updateUserPlan(userId, "free", 3);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      console.log(`❌ Paiement échoué — customer:${invoice.customer}`);
      // TODO: envoyer email de relance via Brevo
      break;
    }
    default:
      break;
  }

  return res.status(200).json({ received: true });
}

async function createPortal(req, res, stripe) {
  let body;
  try {
    const raw = await buffer(req);
    body = JSON.parse(raw.toString());
  } catch {
    return res.status(400).json({ error: "Body invalide" });
  }

  const { customerId } = body;
  if (!customerId) return res.status(400).json({ error: "customerId requis" });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://subcraftai.com";

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/dashboard`,
    });
    return res.status(200).json({ url: session.url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = async function handler(req, res) {
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
