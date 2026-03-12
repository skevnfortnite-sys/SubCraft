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
  const isAllowed = !origin || origin.includes("subcraftai.com") || origin.includes("vercel.app") || origin.includes("netlify.app");
  res.setHeader("Access-Control-Allow-Origin", isAllowed ? origin || "*" : "https://subcraftai.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  const action = req.query.action;

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
      `${SUPABASE_URL}/rest/v1/users?select=plan,created_at`,
      { headers: supabaseHeaders() }
    );
    const users = await usersRes.json();

    const planPrices = { free: 0, basic: 12, expert: 18, pro: 30 };
    const mrr = Array.isArray(users) ? users.reduce((a, u) => a + (planPrices[u.plan] || 0), 0) : 0;
    const total = Array.isArray(users) ? users.length : 0;
    const paying = Array.isArray(users) ? users.filter(u => u.plan !== "free").length : 0;

    return res.status(200).json({
      total_users: total,
      paying_users: paying,
      mrr,
      arr: mrr * 12,
    });
  }

  // ── UPDATE — modifie un utilisateur ───────────────
  if (action === "update" && req.method === "POST") {
    const { userId, plan, credits } = req.body || {};
    if (!userId) return res.status(400).json({ error: "userId requis" });

    await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
      method: "PATCH",
      headers: supabaseHeaders(),
      body: JSON.stringify({ plan, credits }),
    });
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

  return res.status(400).json({ error: `Action inconnue: ${action}` });
}
