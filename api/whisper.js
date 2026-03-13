/**
 * /api/whisper — Edge Runtime (pas de limite de taille)
 */

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Clé OpenAI manquante" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Récupère le formData directement
    const formData = await req.formData();
    const file = formData.get("file");
    const language = formData.get("language") || "fr";

    if (!file) {
      return new Response(JSON.stringify({ error: "Aucun fichier reçu" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Recrée un FormData pour OpenAI
    const openaiForm = new FormData();
    openaiForm.append("file", file);
    openaiForm.append("model", "whisper-1");
    openaiForm.append("language", language);
    openaiForm.append("response_format", "verbose_json");
    openaiForm.append("timestamp_granularities[]", "segment");
    openaiForm.append("temperature", "0");
    // Prompt anti-hallucination — évite les faux textes générés par Whisper
    openaiForm.append("prompt", "Transcris uniquement les paroles prononcées dans cette vidéo. Ne génère pas de texte si il n'y a pas de voix claire.");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: openaiForm,
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || "Erreur Whisper" }), {
        status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Erreur : " + err.message }), {
      status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}
