/**
 * /api/whisper — Transcription via OpenAI Whisper
 *
 * ✅ Accepte vidéos jusqu'à 300 MB
 * ✅ Extrait automatiquement l'audio avec FFmpeg (MP3 ~3-5MB)
 * ✅ Envoie uniquement l'audio à Whisper (limite 25MB respectée)
 * ✅ Supprime les fichiers temporaires après traitement
 */

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

import { IncomingForm } from "formidable";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import FormData from "form-data";
import ffmpegStatic from "ffmpeg-static";

const execAsync = promisify(exec);
const MAX_VIDEO_BYTES = 300 * 1024 * 1024; // 300 MB

const ALLOWED_TYPES = [
  "audio/mpeg", "audio/mp4", "audio/wav", "audio/webm",
  "video/mp4", "video/webm", "video/quicktime", "video/x-msvideo",
  "video/mpeg", "video/x-matroska",
];

const rateLimitMap = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, reset: now + 60_000 };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + 60_000; }
  entry.count++;
  rateLimitMap.set(ip, entry);
  return entry.count <= 15;
}

async function extractAudio(inputPath) {
  const outputPath = inputPath + "_audio.mp3";
  const cmd = `"${ffmpegStatic}" -i "${inputPath}" -vn -acodec mp3 -ab 32k -ar 16000 -ac 1 -y "${outputPath}"`;
  await execAsync(cmd, { timeout: 120_000 });
  return outputPath;
}

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

  const form = new IncomingForm({ maxFileSize: MAX_VIDEO_BYTES, keepExtensions: true });
  let files, fields;
  try {
    [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, f, fi) => err ? reject(err) : resolve([f, fi]));
    });
  } catch (err) {
    if (err.code === 1009) return res.status(413).json({ error: "Fichier trop lourd (max 300 MB)" });
    return res.status(400).json({ error: "Impossible de lire le fichier" });
  }

  const file = files?.file?.[0] || files?.file;
  if (!file) return res.status(400).json({ error: "Aucun fichier reçu" });

  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return res.status(415).json({ error: `Format non supporté : ${file.mimetype}` });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Clé OpenAI manquante" });

  let audioPath = null;
  try {
    const isVideo = file.mimetype.startsWith("video/");
    if (isVideo) {
      audioPath = await extractAudio(file.filepath);
    } else {
      audioPath = file.filepath;
    }

    const audioSize = fs.statSync(audioPath).size;
    if (audioSize > 24 * 1024 * 1024) {
      return res.status(413).json({ error: "Vidéo trop longue — max ~30 minutes." });
    }

    const formData = new FormData();
    formData.append("file", fs.createReadStream(audioPath), {
      filename: "audio.mp3",
      contentType: "audio/mpeg",
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
    console.error("[whisper]", err.message);
    return res.status(502).json({ error: "Erreur : " + err.message });
  } finally {
    try { if (file?.filepath) fs.unlinkSync(file.filepath); } catch {}
    try { if (audioPath && audioPath !== file?.filepath) fs.unlinkSync(audioPath); } catch {}
  }
}
