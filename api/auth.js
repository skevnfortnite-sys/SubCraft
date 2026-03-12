/**
 * /api/auth — Authentification via Supabase
 *
 * Actions :
 *   signup  → créer un compte
 *   login   → se connecter
 *   logout  → se déconnecter
 *   me      → récupérer le profil utilisateur
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || SUPABASE_KEY;

const headers = {
  "Content-Type": "application/json",
  "apikey": SERVICE_KEY,
  "Authorization": `Bearer ${SERVICE_KEY}`,
};

async function supabase(path, method = "GET", body = null, token = null) {
  const h = { ...headers };
  if (token) h["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers: h,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return res.json();
}

export default async function handler(req, res) {
  // CORS
  // Accepte toutes les origines Vercel + domaine custom
  const origin = req.headers.origin || "";
  const isAllowed = !origin || 
    origin.includes("subcraftai.com") || 
    origin.includes("vercel.app") ||
    origin.includes("netlify.app") ||
    origin.includes("localhost");
  res.setHeader("Access-Control-Allow-Origin", isAllowed ? origin || "*" : "https://subcraftai.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  const action = req.query.action;

  // ── SIGNUP ─────────────────────────────────────────
  if (action === "signup" && req.method === "POST") {
    const { email, password, name } = req.body || {};
    if (!email || !password || !name) {
      return res.status(400).json({ error: "email, password et name requis" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Mot de passe trop court (8 min)" });
    }

    // Créer l'utilisateur via l'API Admin Supabase (contourne le rate limit email)
    const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SERVICE_KEY,
        "Authorization": `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: { name },
      }),
    });
    const authData = await authRes.json();
    console.log("Supabase signup response:", JSON.stringify(authData));

    if (authData.error || authData.msg) {
      return res.status(400).json({ error: authData.error?.message || authData.msg || "Erreur inscription" });
    }

    const userId = authData.id || authData.user?.id;
    const token = authData.access_token || "session-required";

    // Insère le profil manuellement au cas où le trigger échoue
    if (userId) {
      const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SERVICE_KEY,
          "Authorization": `Bearer ${SERVICE_KEY}`,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({ id: userId, email, name, plan: "free", credits: 3 }),
      });
      console.log("Insert user status:", insertRes.status);
    }

    return res.status(200).json({
      user: { id: userId, email, name, plan: "free", credits: 3 },
      token,
    });
  }

  // ── LOGIN ──────────────────────────────────────────
  if (action === "login" && req.method === "POST") {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email et password requis" });
    }

    const authRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SERVICE_KEY,
        "Authorization": `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({ email, password }),
    });
    const authData = await authRes.json();

    if (authData.error || authData.error_code) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const userId = authData.user?.id;

    // Récupérer le profil avec la clé service
    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/users?id=eq.${userId}&select=*`,
      { headers: {
        "Content-Type": "application/json",
        "apikey": SERVICE_KEY,
        "Authorization": `Bearer ${SERVICE_KEY}`,
      }}
    );
    const profiles = await profileRes.json();
    const profile = Array.isArray(profiles) ? profiles[0] : {};

    return res.status(200).json({
      user: {
        id: userId,
        email: authData.user?.email || email,
        name: profile?.name || email.split("@")[0],
        plan: profile?.plan || "free",
        credits: profile?.credits ?? 3,
      },
      token: authData.access_token,
    });
  }

  // ── ME (profil) ────────────────────────────────────
  if (action === "me" && req.method === "GET") {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Token manquant" });

    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}` },
    });
    const userData = await userRes.json();
    if (!userData.id) return res.status(401).json({ error: "Token invalide" });

    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/users?id=eq.${userData.id}&select=*`,
      { headers: { ...headers, Authorization: `Bearer ${token}` } }
    );
    const profiles = await profileRes.json();
    const profile = profiles[0] || {};

    return res.status(200).json({
      user: {
        id: userData.id,
        email: userData.email,
        name: profile.name,
        plan: profile.plan || "free",
        credits: profile.credits ?? 3,
      },
    });
  }

  return res.status(400).json({ error: `Action inconnue: ${action}` });
}
