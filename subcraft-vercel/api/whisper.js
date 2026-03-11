/**
 * /api/whisper — Proxy sécurisé vers OpenAI Whisper (transcription)
 *
 * Clé : OPENAI_API_KEY dans Vercel Environment Variables
 * ✅ Limite taille fichier (25 MB max comme Whisper l'exige)
 * ✅ Valide le type MIME avant envoi
 * ✅ Rate limiting par IP
 */

export const config = {
  api: {
    bodyParser: false, // on gère le multipart nous-mêmes
  },
};

import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import FormData from "form-data";

const rateLimitMap = new Map();
const RATE_LIMIT = 10;      // transcriptions max
const RATE_WINDOW = 60_000; // par minute

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, reset: now + RATE_WINDOW };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + RATE_WINDOW; }
  entry.count++;
  rateLimitMap.set(ip, entry);
  return { ok: entry.count <= RATE_LIMIT };
}

const ALLOWED_TYPES = [
  "audio/mpeg", "audio/mp4", "audio/wav", "audio/webm",
  "video/mp4", "video/webm", "video/quicktime",
];
const MAX_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export default async function handler(req, res) {
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

  // Rate limit
  const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || "unknown";
  if (!checkRateLimit(ip).ok) {
    return res.status(429).json({ error: "Trop de requêtes. Réessaie dans une minute." });
  }

  // Parse multipart
  const form = new IncomingForm({ maxFileSize: MAX_SIZE_BYTES });
  let files, fields;
  try {
    [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, f, fi) => err ? reject(err) : resolve([f, fi]));
    });
  } catch (err) {
    if (err.code === 1009) return res.status(413).json({ error: "Fichier trop lourd (max 25 MB)" });
    return res.status(400).json({ error: "Impossible de lire le fichier" });
  }

  const file = files?.file?.[0] || files?.file;
  if (!file) return res.status(400).json({ error: "Aucun fichier reçu (champ: file)" });

  // Valide le type MIME
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return res.status(415).json({
      error: `Format non supporté (${file.mimetype}). Acceptés : MP4, MP3, WAV, WEBM`,
    });
  }

  // Appel Whisper
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Configuration serveur manquante" });

  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(file.filepath), {
      filename: file.originalFilename || "audio.mp4",
      contentType: file.mimetype,
    });
    formData.append("model", "whisper-1");
    formData.append("language", fields.language?.[0] || "fr");
    formData.append("response_format", "verbose_json"); // inclut les timestamps
    formData.append("timestamp_granularities[]", "segment");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    // Nettoie le fichier temp
    fs.unlink(file.filepath, () => {});

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Erreur Whisper",
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("[whisper proxy]", err.message);
    fs.unlink(file?.filepath, () => {});
    return res.status(502).json({ error: "Impossible de joindre l'API Whisper" });
  }
}
