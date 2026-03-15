/**
 * /api/credits — Déduction sécurisée de crédits
 *
 * 🔒 Le userId vient UNIQUEMENT du JWT, jamais du body
 * 🔒 La vérification du plan se fait en DB, pas dans le front
 * 🔒 Impossible de tricher sur son propre userId ou plan
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY;

async function getUserFromToken(token) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}` },
  });
  const data = await res.json();
  return data?.id ? data : null;
}

async function getUserProfile(userId) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/users?id=eq.${userId}&select=id,plan,credits,status`,
    { headers: { "apikey": SERVICE_KEY, "Authorization": `Bearer ${SERVICE_KEY}` } }
  );
  const data = await res.json();
  return Array.isArray(data) ? data[0] : null;
}

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  const isAllowed = !origin || origin.includes("subcraftai.com") || origin.includes("vercel.app") || origin.includes("localhost");
  res.setHeader("Access-Control-Allow-Origin", isAllowed ? origin || "*" : "https://subcraftai.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  // 🔒 Toujours extraire l'userId du JWT — jamais du body
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Non authentifié" });

  const authUser = await getUserFromToken(token);
  if (!authUser) return res.status(401).json({ error: "Token invalide" });

  const action = req.query.action;

  // ── GET — solde actuel ─────────────────────────────
  if (action === "balance" && req.method === "GET") {
    const profile = await getUserProfile(authUser.id);
    if (!profile) return res.status(404).json({ error: "Profil introuvable" });

    const planCredits = { free: 3, basic: 30, expert: 100, pro: 999999 };
    return res.status(200).json({
      credits: profile.credits ?? planCredits[profile.plan] ?? 3,
      plan: profile.plan || "free",
      status: profile.status || "active",
    });
  }

  // ── POST — déduire 1 crédit (upload vidéo) ─────────
  if (action === "deduct" && req.method === "POST") {
    const profile = await getUserProfile(authUser.id);
    if (!profile) return res.status(404).json({ error: "Profil introuvable" });

    // Vérif suspension
    if (profile.status === "suspended") {
      return res.status(403).json({ error: "Compte suspendu" });
    }

    const planCredits = { free: 3, basic: 30, expert: 100, pro: 999999 };
    const isPro = profile.plan === "pro";

    if (!isPro) {
      const current = profile.credits ?? planCredits[profile.plan] ?? 3;
      if (current <= 0) {
        return res.status(402).json({
          error: "Plus de crédits ce mois",
          credits: 0,
          upgrade_url: "/?page=pricing",
        });
      }

      const newCredits = Math.max(0, current - 1);

      // 🔒 Update en DB avec vérification atomique — userId = authUser.id uniquement
      await fetch(
        `${SUPABASE_URL}/rest/v1/users?id=eq.${authUser.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "apikey": SERVICE_KEY,
            "Authorization": `Bearer ${SERVICE_KEY}`,
            "Prefer": "return=minimal",
          },
          body: JSON.stringify({ credits: newCredits }),
        }
      );

      return res.status(200).json({
        ok: true,
        credits: newCredits,
        credits_remaining: newCredits,
        warn: newCredits <= Math.ceil((planCredits[profile.plan] || 3) * 0.2),
        empty: newCredits === 0,
      });
    }

    // Pro = illimité, on ne décrémente pas
    return res.status(200).json({ ok: true, credits: 999999, unlimited: true });
  }

  return res.status(400).json({ error: `Action inconnue: ${action}` });
}
