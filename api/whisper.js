/**
 * /api/whisper — Proxy vers OpenAI Whisper
 * L'audio est extrait côté navigateur avant envoi → max ~5MB
 */

export const config = {
  api: { bodyParser: false },
};

import { IncomingForm } from "formidable";
import fs from "fs";
import FormData from "form-data";

const rateLimitMap = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, reset: now + 60_000 };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + 60_000; }
  entry.count++;
  rateLimitMap.set(ip, entry);
  return entry.count <= 15;
}

const ALLOWED_TYPES = [
  "audio/mpeg","audio/mp4","audio/wav","audio/webm","audio/ogg",
  "video/mp4","video/webm","video/quicktime",
];

export default async function handler(req, res) {
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

  const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || "unknown";
  if (!checkRateLimit(ip)) return res.status(429).json({ error: "Trop de requêtes." });

  const form = new IncomingForm({ maxFileSize: 25 * 1024 * 1024, keepExtensions: true });
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
  if (!file) return res.status(400).json({ error: "Aucun fichier reçu" });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Clé OpenAI manquante" });

  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(file.filepath), {
      filename: file.originalFilename || "audio.webm",
      contentType: file.mimetype || "audio/webm",
    });
    formData.append("model", "whisper-1");
    formData.append("language", fields.language?.[0] || "fr");
    formData.append("response_format", "verbose_json");
    formData.append("timestamp_granularities[]", "segment");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, ...formData.getHeaders() },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || "Erreur Whisper" });
    return res.status(200).json(data);

  } catch (err) {
    return res.status(502).json({ error: "Erreur : " + err.message });
  } finally {
    try { fs.unlinkSync(file.filepath); } catch {}
  }
}
