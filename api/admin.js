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

  // 🔒 Vérification admin — seul kevin.nedzvedsky@gmail.com peut accéder
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Non authentifié" });

  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { "apikey": process.env.SUPABASE_ANON_KEY, "Authorization": `Bearer ${token}` },
  });
  const userData = await userRes.json();
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "kevin.nedzvedsky@gmail.com";
  if (!userData?.email || userData.email !== ADMIN_EMAIL) {
    return res.status(403).json({ error: "Accès refusé" });
  }

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

  return res.status(400).json({ error: `Action inconnue: ${action}` });
}
