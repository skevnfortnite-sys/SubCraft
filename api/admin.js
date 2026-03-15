/**
 * /api/admin — API Admin (données réelles Supabase)
 * 
 * Actions :
 *   users     → liste tous les utilisateurs
 *   stats     → stats globales (MRR, total users, etc)
 *   update    → met à jour un utilisateur
 *   delete    → supprime un utilisateur
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

function supabaseHeaders() {
  return {
    "Content-Type": "application/json",
    "apikey": SERVICE_KEY,
    "Authorization": `Bearer ${SERVICE_KEY}`,
  };
}

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  const isAllowed = !origin || origin.includes("subcraftai.com") || origin.includes("vercel.app") || origin.includes("netlify.app") || origin.includes("localhost");
  res.setHeader("Access-Control-Allow-Origin", isAllowed ? origin || "*" : "https://subcraftai.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  const action = req.query.action;

  // ── AUTH : actions publiques cron (pas de token requis) ──
  const CRON_ACTIONS = ["reset-credits", "trigger-j3"];
  const isCron = CRON_ACTIONS.includes(action);
  const cronSecret = req.headers["x-vercel-cron-signature"] || req.headers["x-cron-secret"];

  if (!isCron) {
    // Actions admin → vérifier JWT + email admin
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Non authentifié" });

    try {
      const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { "apikey": process.env.SUPABASE_ANON_KEY, "Authorization": `Bearer ${token}` },
      });
      const userData = await userRes.json();
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "kevin.nedzvedsky@gmail.com";
      if (!userData?.email || userData.email !== ADMIN_EMAIL) {
        return res.status(403).json({ error: "Accès refusé — admin uniquement" });
      }
    } catch {
      return res.status(401).json({ error: "Token invalide" });
    }
  }

  // ── USERS — liste tous les utilisateurs ────────────
  if (action === "users" && req.method === "GET") {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/users?select=*&order=created_at.desc`,
      { headers: supabaseHeaders() }
    );
    const users = await response.json();
    return res.status(200).json({ users: Array.isArray(users) ? users : [] });
  }

  // ── STATS — KPIs globaux ───────────────────────────
  if (action === "stats" && req.method === "GET") {
    const usersRes = await fetch(
      `${SUPABASE_URL}/rest/v1/users?select=plan,status,created_at`,
      { headers: supabaseHeaders() }
    );
    const users = await usersRes.json();

    const planPrices = { free: 0, basic: 12, expert: 18, pro: 30 };
    const arr = Array.isArray(users) ? users : [];
    const mrr = arr.reduce((a, u) => a + (planPrices[u.plan] || 0), 0);
    const total = arr.length;
    const paying = arr.filter(u => u.plan && u.plan !== "free").length;
    const suspended = arr.filter(u => u.status === "suspended").length;
    const free = arr.filter(u => !u.plan || u.plan === "free").length;
    const proCount = arr.filter(u => u.plan === "pro").length;
    const expertCount = arr.filter(u => u.plan === "expert").length;
    const basicCount = arr.filter(u => u.plan === "basic").length;

    // Nouveaux users ce mois
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = arr.filter(u => u.created_at && new Date(u.created_at) >= startOfMonth).length;

    return res.status(200).json({
      total_users: total,
      paying_users: paying,
      free_users: free,
      suspended_users: suspended,
      pro_users: proCount,
      expert_users: expertCount,
      basic_users: basicCount,
      new_this_month: newThisMonth,
      conversion_rate: total > 0 ? Math.round((paying / total) * 100) : 0,
      mrr,
      arr: mrr * 12,
    });
  }

  // ── UPDATE — modifie un utilisateur ───────────────
  if (action === "update" && req.method === "POST") {
    const { userId, plan, credits, status, name } = req.body || {};
    if (!userId) return res.status(400).json({ error: "userId requis" });

    const updateData = {};
    if (plan !== undefined) updateData.plan = plan;
    if (credits !== undefined) updateData.credits = credits >= 999999 ? 999999 : credits;
    if (name !== undefined) updateData.name = name;
    if (status !== undefined) updateData.status = status;

    const res2 = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
      method: "PATCH",
      headers: { ...supabaseHeaders(), "Prefer": "return=minimal" },
      body: JSON.stringify(updateData),
    });
    console.log(`[admin] update user ${userId}:`, updateData, "status:", res2.status);
    return res.status(200).json({ updated: true });
  }

  // ── DELETE — supprime un utilisateur ──────────────
  if (action === "delete" && req.method === "POST") {
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ error: "userId requis" });

    // Supprime le profil
    await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
      method: "DELETE",
      headers: supabaseHeaders(),
    });

    // Supprime ses vidéos
    await fetch(`${SUPABASE_URL}/rest/v1/videos?user_id=eq.${userId}`, {
      method: "DELETE",
      headers: supabaseHeaders(),
    });

    return res.status(200).json({ deleted: true });
  }

  // ── RESET CRÉDITS — remet les crédits selon le plan ──
  if (action === "reset-credits" && req.method === "POST") {
    const planCredits = { free: 3, basic: 30, expert: 100, pro: 999999 };
    const usersRes = await fetch(`${SUPABASE_URL}/rest/v1/users?select=id,plan`, { headers: supabaseHeaders() });
    const allUsers = await usersRes.json();
    if (!Array.isArray(allUsers)) return res.status(500).json({ error: "Erreur DB" });

    let count = 0;
    for (const u of allUsers) {
      const credits = planCredits[u.plan?.toLowerCase()] ?? 3;
      await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${u.id}`, {
        method: "PATCH",
        headers: { ...supabaseHeaders(), "Prefer": "return=minimal" },
        body: JSON.stringify({ credits }),
      });
      count++;
    }
    return res.status(200).json({ ok: true, count });
  }

  // ── IMPERSONATION — token temporaire pour un user ────
  if (action === "impersonate" && req.method === "POST") {
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ error: "userId requis" });

    // Crée un token Supabase pour cet user via Admin API
    const r = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SERVICE_KEY,
        "Authorization": `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({ expiresIn: 3600 }), // 1h
    });
    const data = await r.json();
    if (!data.access_token) {
      // Fallback: utilise la clé service directement (moins sécurisé, mais fonctionne)
      const loginRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/generate_link`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": SERVICE_KEY, "Authorization": `Bearer ${SERVICE_KEY}` },
        body: JSON.stringify({ type: "magiclink", email: (await (await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}&select=email`, { headers: supabaseHeaders() })).json())[0]?.email }),
      });
      return res.status(501).json({ error: "Impersonation non disponible dans cette version de Supabase" });
    }
    return res.status(200).json({ token: data.access_token });
  }

  // ── TRIGGER J+3 — envoie emails aux users sans upload ─
  if (action === "trigger-j3" && req.method === "POST") {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://sub-craft-fxea.vercel.app";
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

    // Users inscrits il y a 3+ jours
    const usersRes = await fetch(
      `${SUPABASE_URL}/rest/v1/users?created_at=lt.${threeDaysAgo}&select=id,email,name`,
      { headers: supabaseHeaders() }
    );
    const oldUsers = await usersRes.json();
    if (!Array.isArray(oldUsers)) return res.status(500).json({ error: "Erreur DB" });

    // Vidéos existantes
    const videosRes = await fetch(`${SUPABASE_URL}/rest/v1/videos?select=user_id`, { headers: supabaseHeaders() });
    const videos = await videosRes.json();
    const usersWithVideos = new Set((Array.isArray(videos) ? videos : []).map(v => v.user_id));

    const eligible = oldUsers.filter(u => !usersWithVideos.has(u.id));
    let count = 0;
    for (const u of eligible) {
      await fetch(`${baseUrl}/api/email?action=j3-reminder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: u.email, name: u.name }),
      });
      count++;
    }
    return res.status(200).json({ ok: true, sent: count > 0, count });
  }

  // ── SAVE SETTINGS — bannière + maintenance ────────────
  if (action === "save-settings" && req.method === "POST") {
    const { banner, maintenance } = req.body || {};
    // Stocke dans une table settings (key/value) — crée si besoin
    const settings = [
      { key: "banner_active", value: String(banner?.active || false) },
      { key: "banner_text", value: banner?.text || "" },
      { key: "banner_color", value: banner?.color || "#7c3aed" },
      { key: "maintenance_active", value: String(maintenance?.active || false) },
      { key: "maintenance_message", value: maintenance?.message || "" },
    ];
    for (const s of settings) {
      await fetch(`${SUPABASE_URL}/rest/v1/settings`, {
        method: "POST",
        headers: { ...supabaseHeaders(), "Prefer": "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(s),
      });
    }
    return res.status(200).json({ ok: true });
  }

  return res.status(400).json({ error: `Action inconnue: ${action}` });
}
