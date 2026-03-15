/**
 * /api/videos — Gestion des vidéos par utilisateur
 *
 * 🔒 Chaque utilisateur ne voit QUE ses propres vidéos
 * 🗑️ Suppression automatique après 24h via delete_at
 *
 * Actions :
 *   list    GET  → liste les vidéos de l'utilisateur connecté
 *   create  POST → crée une nouvelle vidéo
 *   update  POST → met à jour le statut/nom d'une vidéo (vérifie ownership)
 *   delete  POST → supprime une vidéo (vérifie ownership)
 *   cleanup POST → supprime les vidéos expirées (appelé par cron)
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // pour le cron

async function getUserFromToken(token) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data?.id ? data : null;
}

function supabaseHeaders(token) {
  return {
    "Content-Type": "application/json",
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${token || SUPABASE_KEY}`,
  };
}

export default async function handler(req, res) {
  // CORS
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

  // ── LIST — vidéos de l'utilisateur connecté ────────
  if (action === "list" && req.method === "GET") {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Non authentifié" });

    const user = await getUserFromToken(token);
    if (!user) return res.status(401).json({ error: "Token invalide" });

    // 🔒 Filtre strictement par user_id + exclut les vidéos expirées
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/videos?user_id=eq.${user.id}&delete_at=gt.${new Date().toISOString()}&order=created_at.desc&select=*`,
      { headers: supabaseHeaders(token) }
    );
    const videos = await response.json();

    return res.status(200).json({ videos: videos || [] });
  }

  // ── CREATE — nouvelle vidéo ────────────────────────
  if (action === "create" && req.method === "POST") {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Non authentifié" });

    const user = await getUserFromToken(token);
    if (!user) return res.status(401).json({ error: "Token invalide" });

    const { name } = req.body || {};
    if (!name) return res.status(400).json({ error: "name requis" });

    // Calcule delete_at = maintenant + 24h
    const deleteAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const response = await fetch(`${SUPABASE_URL}/rest/v1/videos`, {
      method: "POST",
      headers: {
        ...supabaseHeaders(token),
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        user_id: user.id,  // 🔒 toujours l'utilisateur connecté
        name,
        status: "processing",
        delete_at: deleteAt,
        exported: false,
      }),
    });

    const video = await response.json();
    return res.status(201).json({ video: video[0] || video });
  }

  // ── UPDATE — met à jour statut/nom d'une vidéo ────
  if (action === "update" && req.method === "POST") {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Non authentifié" });

    const user = await getUserFromToken(token);
    if (!user) return res.status(401).json({ error: "Token invalide" });

    const { videoId, status, name, exported } = req.body || {};
    if (!videoId) return res.status(400).json({ error: "videoId requis" });

    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (name !== undefined) updateData.name = name;
    if (exported !== undefined) updateData.exported = exported;

    // 🔒 Filtre par user_id — impossible de modifier la vidéo d'un autre
    await fetch(
      `${SUPABASE_URL}/rest/v1/videos?id=eq.${videoId}&user_id=eq.${user.id}`,
      {
        method: "PATCH",
        headers: { ...supabaseHeaders(token), "Prefer": "return=minimal" },
        body: JSON.stringify(updateData),
      }
    );

    return res.status(200).json({ updated: true });
  }

  // ── DELETE — supprime une vidéo ────────────────────
  if (action === "delete" && req.method === "POST") {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Non authentifié" });

    const user = await getUserFromToken(token);
    if (!user) return res.status(401).json({ error: "Token invalide" });

    const { videoId } = req.body || {};
    if (!videoId) return res.status(400).json({ error: "videoId requis" });

    // 🔒 Vérifie que la vidéo appartient à cet utilisateur avant de supprimer
    await fetch(
      `${SUPABASE_URL}/rest/v1/videos?id=eq.${videoId}&user_id=eq.${user.id}`,
      {
        method: "DELETE",
        headers: supabaseHeaders(token),
      }
    );

    return res.status(200).json({ deleted: true });
  }

  // ── CLEANUP — supprime les vidéos expirées (cron) ──
  if (action === "cleanup" && req.method === "POST") {
    // Vérifie le secret cron pour éviter les appels non autorisés
    const cronSecret = req.headers["x-cron-secret"];
    if (cronSecret !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: "Non autorisé" });
    }

    const serviceKey = SUPABASE_SERVICE_KEY || SUPABASE_KEY;
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/videos?delete_at=lt.${new Date().toISOString()}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "apikey": serviceKey,
          "Authorization": `Bearer ${serviceKey}`,
        },
      }
    );

    console.log(`[cleanup] Vidéos expirées supprimées — ${new Date().toISOString()}`);
    return res.status(200).json({ cleaned: true });
  }

  return res.status(400).json({ error: `Action inconnue: ${action}` });
}
