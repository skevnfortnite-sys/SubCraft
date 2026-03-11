# SubCraft — Proxy API Vercel

Ce dossier contient les 3 fonctions serverless qui font le pont entre ton
app SubCraft et les APIs externes. Les clés ne sont **jamais** dans le code.

---

## 📁 Structure

```
api/
  anthropic.js   → proxy vers Anthropic Claude (emojis IA, traduction, chat support)
  whisper.js     → proxy vers OpenAI Whisper (transcription vidéo)
  stripe.js      → proxy vers Stripe (paiements, abonnements, webhooks)
vercel.json      → config timeouts et headers de sécurité
package.json     → dépendances npm
```

---

## 🚀 Déploiement (15 minutes)

### Étape 1 — Créer le projet sur Vercel

1. Va sur https://vercel.com → **New Project**
2. Choisis **"Import Git Repository"** ou **"Browse"** pour uploader ce dossier
3. Laisse tout par défaut → **Deploy**

### Étape 2 — Ajouter les variables d'environnement

Dans Vercel : **Settings → Environment Variables**

Ajoute ces variables (une par une) :

| Variable | Où trouver la valeur |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |
| `OPENAI_API_KEY` | platform.openai.com → API Keys |
| `STRIPE_SECRET_KEY` | dashboard.stripe.com → Developers → API Keys → Secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks → ton endpoint → Signing secret |
| `STRIPE_PRICE_BASIC_MONTHLY` | Stripe → Products → Basic → Price ID (ex: price_1ABC...) |
| `STRIPE_PRICE_BASIC_YEARLY` | idem |
| `STRIPE_PRICE_EXPERT_MONTHLY` | idem |
| `STRIPE_PRICE_EXPERT_YEARLY` | idem |
| `STRIPE_PRICE_PRO_MONTHLY` | idem |
| `STRIPE_PRICE_PRO_YEARLY` | idem |
| `NEXT_PUBLIC_BASE_URL` | https://subcraftai.com |

### Étape 3 — Configurer le webhook Stripe

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. URL : `https://TON-PROJET.vercel.app/api/stripe?action=webhook`
3. Events à écouter :
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copie le **Signing secret** → colle dans `STRIPE_WEBHOOK_SECRET` sur Vercel

### Étape 4 — Mettre à jour ton app SubCraft

Dans `subcraft-v9.jsx`, remplace chaque appel API :

**AVANT (dangereux — clé visible) :**
```js
fetch("https://api.anthropic.com/v1/messages", {
  headers: { "x-api-key": "sk-ant-..." }, // ❌ visible dans F12
  body: ...
})
```

**APRÈS (sécurisé — clé invisible) :**
```js
fetch("/api/anthropic", {   // ✅ passe par ton proxy
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ model, messages, system, max_tokens })
})
```

Les 3 remplacements à faire dans subcraft-v9.jsx :
- `https://api.anthropic.com/v1/messages` → `/api/anthropic`
- Upload vidéo → `/api/whisper`
- Checkout → `/api/stripe?action=create-checkout`

---

## 🔒 Sécurité en place

- ✅ Clés uniquement dans les variables d'env Vercel (chiffrées au repos)
- ✅ CORS restreint à subcraftai.com
- ✅ Rate limiting : 30 req/min (Anthropic), 10 req/min (Whisper)
- ✅ Validation du body avant envoi
- ✅ Limite de taille : 25 MB fichiers, 20 000 chars texte
- ✅ Headers de sécurité HTTP (X-Frame-Options, XSS Protection...)
- ✅ Signature Stripe vérifiée sur chaque webhook (empêche les faux paiements)

---

## 🧪 Tester en local

```bash
npm install -g vercel
vercel dev
# Ton app tourne sur http://localhost:3000
# Les fonctions sur http://localhost:3000/api/...
```

Pour les variables locales, crée un fichier `.env.local` (jamais commité sur Git) :
```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-proj-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
