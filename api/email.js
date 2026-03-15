/**
 * /api/email — Envoi d'emails via Brevo
 *
 * Actions :
 *   welcome        → email de bienvenue après inscription
 *   payment        → confirmation de paiement
 *   cancel         → abonnement annulé
 */

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL = process.env.BREVO_FROM_EMAIL || "noreply@subcraftai.com";
const FROM_NAME = "SubCraft";

async function sendEmail({ to, subject, html }) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
  return res.json();
}

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  const isAllowed = !origin || origin.includes("subcraftai.com") || origin.includes("vercel.app") || origin.includes("netlify.app");
  res.setHeader("Access-Control-Allow-Origin", isAllowed ? origin || "*" : "https://subcraftai.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  const action = req.query.action;
  const { email, name, plan } = req.body || {};

  if (!email) return res.status(400).json({ error: "email requis" });

  // ── WELCOME ────────────────────────────────────────
  if (action === "welcome") {
    const result = await sendEmail({
      to: email,
      subject: "Bienvenue sur SubCraft ! 🎉",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#02030a;color:#fff;padding:40px;border-radius:16px">
          <div style="text-align:center;margin-bottom:32px">
            <div style="width:64px;height:64px;background:linear-gradient(135deg,#5b6cff,#e83970);border-radius:16px;display:inline-flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:16px">✦</div>
            <h1 style="font-size:28px;margin:0;background:linear-gradient(135deg,#5b6cff,#e83970);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Bienvenue sur SubCraft !</h1>
          </div>
          <p style="color:#a0a0c0;font-size:16px;line-height:1.6">Bonjour <strong style="color:#fff">${name || "Créateur"}</strong>,</p>
          <p style="color:#a0a0c0;font-size:16px;line-height:1.6">Tu viens de rejoindre SubCraft 🎉 Ton compte est activé avec <strong style="color:#5b6cff">3 vidéos gratuites</strong> pour commencer ce mois.</p>
          <div style="background:#0c0d1a;border:1px solid #181928;border-radius:12px;padding:24px;margin:24px 0">
            <h3 style="color:#fff;margin:0 0 16px">Ce que tu peux faire :</h3>
            <ul style="color:#a0a0c0;padding-left:20px;line-height:2">
              <li>🎬 Uploader une vidéo et générer des sous-titres en IA</li>
              <li>🎨 Choisir parmi 28 styles de sous-titres viraux</li>
              <li>🌍 Traduire en 12 langues automatiquement</li>
              <li>🤖 Ajouter des emojis IA pour booster l'engagement</li>
            </ul>
          </div>
          <div style="text-align:center;margin-top:32px">
            <a href="https://sub-craft-fxea.vercel.app" style="background:linear-gradient(135deg,#5b6cff,#e83970);color:#fff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:16px">Commencer à créer →</a>
          </div>
          <p style="color:#505070;font-size:12px;text-align:center;margin-top:32px">SubCraft · 60 rue François Ier, 75008 Paris · <a href="https://sub-craft-fxea.vercel.app" style="color:#5b6cff">subcraftai.com</a></p>
        </div>
      `,
    });
    return res.status(200).json({ sent: true, result });
  }

  // ── PAYMENT CONFIRMATION ───────────────────────────
  if (action === "payment") {
    const planNames = { basic: "Basic", expert: "Expert", pro: "Pro" };
    const planPrices = { basic: "12€", expert: "18€", pro: "30€" };
    const planName = planNames[plan] || plan;
    const planPrice = planPrices[plan] || "";

    const result = await sendEmail({
      to: email,
      subject: `✅ Paiement confirmé — Plan ${planName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#02030a;color:#fff;padding:40px;border-radius:16px">
          <div style="text-align:center;margin-bottom:32px">
            <div style="font-size:48px;margin-bottom:16px">🎉</div>
            <h1 style="font-size:24px;margin:0;color:#fff">Paiement confirmé !</h1>
            <p style="color:#a0a0c0">Bienvenue dans le plan <strong style="color:#5b6cff">${planName}</strong></p>
          </div>
          <div style="background:#0c0d1a;border:1px solid #181928;border-radius:12px;padding:24px;margin:24px 0">
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #181928">
              <span style="color:#a0a0c0">Plan</span>
              <strong style="color:#fff">${planName}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px 0">
              <span style="color:#a0a0c0">Montant</span>
              <strong style="color:#34d399">${planPrice}/mois</strong>
            </div>
          </div>
          <div style="text-align:center;margin-top:32px">
            <a href="https://sub-craft-fxea.vercel.app" style="background:linear-gradient(135deg,#5b6cff,#e83970);color:#fff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:16px">Accéder à mon compte →</a>
          </div>
          <p style="color:#505070;font-size:12px;text-align:center;margin-top:32px">SubCraft · KEVININDUSTRIE SAS · SIRET 932 737 992 00010</p>
        </div>
      `,
    });
    return res.status(200).json({ sent: true, result });
  }

  // ── CANCEL ─────────────────────────────────────────
  if (action === "cancel") {
    const result = await sendEmail({
      to: email,
      subject: "Ton abonnement SubCraft a été annulé",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#02030a;color:#fff;padding:40px;border-radius:16px">
          <h1 style="font-size:22px;color:#fff">Abonnement annulé</h1>
          <p style="color:#a0a0c0;line-height:1.6">Bonjour ${name || ""},<br><br>Ton abonnement SubCraft a bien été annulé. Tu repasses sur le plan gratuit avec 3 vidéos/mois.</p>
          <p style="color:#a0a0c0;line-height:1.6">Tu peux te réabonner à tout moment depuis ton espace.</p>
          <div style="text-align:center;margin-top:32px">
            <a href="https://sub-craft-fxea.vercel.app" style="background:#5b6cff;color:#fff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700">Revenir sur SubCraft</a>
          </div>
        </div>
      `,
    });
    return res.status(200).json({ sent: true, result });
  }

  // ── CREDITS EMPTY ─────────────────────────────────
  if (action === "credits-empty") {
    const result = await sendEmail({
      to: email,
      subject: "⚠️ Tu n'as plus de vidéos disponibles ce mois",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#02030a;color:#fff;padding:40px;border-radius:16px">
          <div style="text-align:center;margin-bottom:32px">
            <div style="font-size:48px;margin-bottom:16px">⚠️</div>
            <h1 style="font-size:24px;margin:0;color:#fff">Tu n'as plus de vidéos ce mois !</h1>
            <p style="color:#a0a0c0">Passe à un plan supérieur pour continuer à créer</p>
          </div>
          <div style="background:#0c0d1a;border:1px solid #e8397022;border-radius:12px;padding:24px;margin:24px 0">
            <p style="color:#a0a0c0;line-height:1.6;margin:0">Bonjour <strong style="color:#fff">${name || "Créateur"}</strong>,<br><br>
            Tu as utilisé toutes tes vidéos ce mois-ci. Pour continuer à créer, passe à un plan supérieur.</p>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin:24px 0">
            <div style="background:#0c0d1a;border:1px solid #22d3ee33;border-radius:12px;padding:16px;text-align:center">
              <div style="font-weight:900;font-size:20px;color:#22d3ee">Basic</div>
              <div style="color:#a0a0c0;font-size:12px;margin:4px 0">30 vidéos/mois</div>
              <div style="font-weight:700;color:#fff">12€/mois</div>
            </div>
            <div style="background:#0c0d1a;border:2px solid #5b6cff;border-radius:12px;padding:16px;text-align:center">
              <div style="font-weight:900;font-size:20px;color:#5b6cff">Expert</div>
              <div style="color:#a0a0c0;font-size:12px;margin:4px 0">100 vidéos/mois</div>
              <div style="font-weight:700;color:#fff">18€/mois</div>
            </div>
            <div style="background:#0c0d1a;border:1px solid #a855f733;border-radius:12px;padding:16px;text-align:center">
              <div style="font-weight:900;font-size:20px;color:#a855f7">Pro</div>
              <div style="color:#a0a0c0;font-size:12px;margin:4px 0">Illimité</div>
              <div style="font-weight:700;color:#fff">30€/mois</div>
            </div>
          </div>
          <div style="text-align:center;margin-top:32px">
            <a href="https://sub-craft-fxea.vercel.app/?page=pricing" style="background:linear-gradient(135deg,#5b6cff,#e83970);color:#fff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:16px">Passer au plan supérieur →</a>
          </div>
          <p style="color:#505070;font-size:12px;text-align:center;margin-top:32px">SubCraft · KEVININDUSTRIE SAS · SIRET 932 737 992 00010</p>
        </div>
      `,
    });
    return res.status(200).json({ sent: true, result });
  }

  return res.status(400).json({ error: `Action inconnue: ${action}` });
}
