/**
 * /api/anthropic — Proxy sécurisé vers Anthropic
 *
 * Clé stockée dans : Vercel Dashboard → Settings → Environment Variables
 * Variable : ANTHROPIC_API_KEY
 *
 * ✅ La clé n'est JAMAIS exposée au navigateur
 * ✅ Rate limiting par IP (30 req/min)
 * ✅ Validation du body avant envoi
 * ✅ CORS restreint à ton domaine
 */

// Simple in-memory rate limiter (remplace par Redis en prod haute charge)
const rateLimitMap = new Map();
const RATE_LIMIT = 30;       // requêtes max
const RATE_WINDOW = 60_000;  // par minute (ms)

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, reset: now + RATE_WINDOW };

  if (now > entry.reset) {
    entry.count = 0;
    entry.reset = now + RATE_WINDOW;
  }

  entry.count++;
  rateLimitMap.set(ip, entry);

  return {
    ok: entry.count <= RATE_LIMIT,
    remaining: Math.max(0, RATE_LIMIT - entry.count),
    reset: entry.reset,
  };
}

export default async function handler(req, res) {
  // ── CORS ──────────────────────────────────────────────
  const allowedOrigins = [
    "https://subcraftai.com",
    "https://www.subcraftai.com",
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    // Décommente en dev local :
    // "http://localhost:3000",
  ].filter(Boolean);

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // ── RATE LIMIT ────────────────────────────────────────
  const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || "unknown";
  const rl = checkRateLimit(ip);
  res.setHeader("X-RateLimit-Remaining", rl.remaining);

  if (!rl.ok) {
    return res.status(429).json({
      error: "Trop de requêtes. Réessaie dans une minute.",
      reset: rl.reset,
    });
  }

  // ── VALIDATION ────────────────────────────────────────
  const { model, messages, system, max_tokens } = req.body || {};

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages[] requis" });
  }
  if (messages.length > 50) {
    return res.status(400).json({ error: "Trop de messages (max 50)" });
  }
  // Limite la taille du contenu pour éviter les abus
  const totalChars = messages.reduce((acc, m) =>
    acc + (typeof m.content === "string" ? m.content.length : 0), 0);
  if (totalChars > 20_000) {
    return res.status(400).json({ error: "Contenu trop long (max 20 000 chars)" });
  }

  // ── APPEL ANTHROPIC ───────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[anthropic proxy] ANTHROPIC_API_KEY manquant");
    return res.status(500).json({ error: "Configuration serveur manquante" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model || "claude-sonnet-4-20250514",
        max_tokens: Math.min(max_tokens || 1000, 4000), // cap à 4000
        ...(system ? { system } : {}),
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[anthropic proxy] Erreur upstream:", response.status, data);
      return res.status(response.status).json({
        error: data.error?.message || "Erreur Anthropic",
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("[anthropic proxy] Erreur réseau:", err.message);
    return res.status(502).json({ error: "Impossible de joindre l'API Anthropic" });
  }
}
