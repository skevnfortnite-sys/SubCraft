/**
 * /api/coupons — Gestion des codes promo
 * 
 * GET  ?action=list              → liste tous les coupons
 * GET  ?action=validate&code=XX  → valide un code (public)
 * POST ?action=create            → crée un coupon (admin)
 * POST ?action=delete            → supprime un coupon (admin)
 * POST ?action=increment         → incrémente uses (après checkout)
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

const headers = () => ({
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  const action = req.query.action;

  // ── LISTE tous les coupons (admin) ────────────────────
  if (action === "list" && req.method === "GET") {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/coupons?select=*&order=created_at.desc`,
      { headers: headers() }
    );
    const data = await r.json();
    return res.status(200).json({ coupons: Array.isArray(data) ? data : [] });
  }

  // ── VALIDE un code (utilisé au checkout) ─────────────
  if (action === "validate" && req.method === "GET") {
    const code = (req.query.code || "").toUpperCase().trim();
    if (!code) return res.status(400).json({ error: "Code manquant" });

    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/coupons?code=eq.${code}&select=*`,
      { headers: headers() }
    );
    const data = await r.json();
    const coupon = data?.[0];
    if (!coupon) return res.status(404).json({ error: "Code invalide" });
    if (!coupon.active) return res.status(400).json({ error: "Code désactivé" });
    
    // Vérifie expiration
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return res.status(400).json({ error: "Code expiré" });
    }
    // Vérifie limite d'utilisation
    if (coupon.max_uses && coupon.uses >= coupon.max_uses) {
      return res.status(400).json({ error: "Code épuisé" });
    }

    return res.status(200).json({
      valid: true,
      code: coupon.code,
      discount: coupon.discount,
      type: coupon.type || "percent", // percent ou fixed
      description: coupon.description,
      stripe_coupon_id: coupon.stripe_coupon_id,
    });
  }

  // ── CRÉE un coupon (admin) ───────────────────────────
  if (action === "create" && req.method === "POST") {
    let body;
    try { body = typeof req.body === "string" ? JSON.parse(req.body) : req.body; }
    catch { return res.status(400).json({ error: "Body invalide" }); }

    const { code, discount, type = "percent", description, max_uses, expires_at, stripe_coupon_id } = body;
    if (!code || !discount) return res.status(400).json({ error: "code et discount requis" });

    const r = await fetch(`${SUPABASE_URL}/rest/v1/coupons`, {
      method: "POST",
      headers: { ...headers(), "Prefer": "return=representation" },
      body: JSON.stringify({
        code: code.toUpperCase().trim(),
        discount: Number(discount),
        type,
        description: description || "",
        max_uses: max_uses ? Number(max_uses) : null,
        expires_at: expires_at || null,
        stripe_coupon_id: stripe_coupon_id || null,
        uses: 0,
        active: true,
        created_at: new Date().toISOString(),
      }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(400).json({ error: data?.message || "Erreur création" });
    return res.status(201).json({ coupon: data[0] });
  }

  // ── TOGGLE active / SUPPRIME ─────────────────────────
  if (action === "delete" && req.method === "POST") {
    let body;
    try { body = typeof req.body === "string" ? JSON.parse(req.body) : req.body; }
    catch { return res.status(400).json({ error: "Body invalide" }); }

    const { id } = body;
    if (!id) return res.status(400).json({ error: "id requis" });

    const r = await fetch(`${SUPABASE_URL}/rest/v1/coupons?id=eq.${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    return res.status(200).json({ deleted: true });
  }

  // ── TOGGLE actif/inactif ─────────────────────────────
  if (action === "toggle" && req.method === "POST") {
    let body;
    try { body = typeof req.body === "string" ? JSON.parse(req.body) : req.body; }
    catch { return res.status(400).json({ error: "Body invalide" }); }

    const { id, active } = body;
    const r = await fetch(`${SUPABASE_URL}/rest/v1/coupons?id=eq.${id}`, {
      method: "PATCH",
      headers: { ...headers(), "Prefer": "return=representation" },
      body: JSON.stringify({ active }),
    });
    const data = await r.json();
    return res.status(200).json({ coupon: data[0] });
  }

  // ── INCRÉMENTE uses (après checkout réussi) ──────────
  if (action === "increment" && req.method === "POST") {
    let body;
    try { body = typeof req.body === "string" ? JSON.parse(req.body) : req.body; }
    catch { return res.status(400).json({ error: "Body invalide" }); }

    const { code } = body;
    await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/increment_coupon_uses`,
      {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ coupon_code: code.toUpperCase() }),
      }
    );
    return res.status(200).json({ ok: true });
  }

  return res.status(400).json({ error: `Action inconnue: ${action}` });
}
