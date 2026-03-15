# ✦ SubCraft

> **Sous-titres IA pour YouTube Shorts, TikTok & Instagram Reels**  
> Upload → Transcription Whisper en 10s → 28 styles viraux → Export MP4/SRT

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://sub-craft-fxea.vercel.app)
[![Built with React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3fcf8e?logo=supabase)](https://supabase.com)

---

## 📖 Présentation

SubCraft est un SaaS de génération automatique de sous-titres pour les créateurs de contenu courts. L'IA transcrit ta vidéo en moins de 10 secondes, tu choisis parmi 28 styles viraux inspirés des plus grands créateurs (MrBeast, Captions, TikTok...), et tu exportes directement en MP4 ou SRT — **100% dans le navigateur, sans serveur pour l'export**.

### Fonctionnalités

- 🎙️ **Transcription automatique** via OpenAI Whisper v3 — 99% de précision, 30 langues
- 🎨 **28 styles de sous-titres viraux** — Bold Yellow, Captions, Neon, Highlight, TikTok...
- 🌍 **Traduction en 12 langues** via Claude AI
- 🤖 **Emojis IA** — Claude place les emojis aux bons moments
- 🎬 **Export MP4** avec sous-titres incrustés — 100% navigateur via Canvas + MediaRecorder
- 📄 **Export SRT/ASS** — compatible DaVinci Resolve, Premiere Pro, CapCut
- 💳 **Abonnements Stripe** — plans Free, Basic (12€), Expert (18€), Pro (30€)
- 🔐 **Auth Google OAuth** via Supabase
- 🗑️ **Suppression auto** des vidéos après 24h (RGPD)

---

## 🗂️ Structure du projet

```
SubCraft/
├── src/
│   ├── App.jsx          # Application React complète (SPA)
│   └── main.jsx         # Point d'entrée Vite
├── api/
│   ├── whisper.js       # Transcription OpenAI Whisper (Edge Runtime)
│   ├── anthropic.js     # Proxy Claude AI — emojis, traduction, chat
│   ├── auth.js          # Authentification Supabase + Google OAuth
│   ├── admin.js         # Dashboard admin (protégé JWT)
│   ├── credits.js       # Déduction sécurisée de crédits (JWT-only)
│   ├── stripe.js        # Paiements, webhooks, portail client
│   ├── email.js         # Emails transactionnels via Brevo
│   ├── videos.js        # CRUD vidéos par utilisateur
│   └── coupons.js       # Codes promo
├── public/
│   └── 1.mp4            # Vidéo de démo (hero landing page)
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

---

## 🚀 Déploiement

### Prérequis

- Node.js >= 18
- Compte [Vercel](https://vercel.com)
- Compte [Supabase](https://supabase.com)
- Clé API [OpenAI](https://platform.openai.com)
- Clé API [Anthropic](https://console.anthropic.com)
- Compte [Stripe](https://stripe.com) (pour les paiements)
- Compte [Brevo](https://brevo.com) (pour les emails)

### 1. Cloner le repo

```bash
git clone https://github.com/skevnfortnite-sys/SubCraft.git
cd SubCraft
npm install
```

### 2. Configurer Supabase

Dans ton projet Supabase, crée les tables suivantes :

**Table `users`**
```sql
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  plan text default 'free',
  credits integer default 3,
  status text default 'active',
  stripe_customer_id text,
  referred_by text,
  created_at timestamp with time zone default now()
);

-- Active la sécurité par ligne
alter table users enable row level security;

-- Politique : chaque user ne voit que son propre profil
create policy "Users can view own profile"
  on users for select using (auth.uid() = id);

create policy "Users can update own profile"
  on users for update using (auth.uid() = id);
```

**Table `videos`**
```sql
create table videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  status text default 'processing',
  delete_at timestamp with time zone,
  exported boolean default false,
  created_at timestamp with time zone default now()
);

alter table videos enable row level security;

create policy "Users can manage own videos"
  on videos for all using (auth.uid() = user_id);
```

**Table `coupons`**
```sql
create table coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount integer not null,
  type text default 'percent',
  description text,
  max_uses integer,
  uses integer default 0,
  active boolean default true,
  expires_at timestamp with time zone,
  stripe_coupon_id text,
  created_at timestamp with time zone default now()
);
```

Ensuite, dans **Authentication → Providers**, active **Google OAuth** et configure tes credentials Google Cloud Console.

Dans **Authentication → URL Configuration**, ajoute :
```
https://sub-craft-fxea.vercel.app
```

### 3. Variables d'environnement

Dans **Vercel → Settings → Environment Variables**, ajoute :

| Variable | Description | Où la trouver |
|---|---|---|
| `SUPABASE_URL` | URL de ton projet Supabase | Supabase → Settings → API |
| `SUPABASE_ANON_KEY` | Clé publique Supabase | Supabase → Settings → API |
| `SUPABASE_SERVICE_KEY` | Clé service (admin) Supabase | Supabase → Settings → API → service_role |
| `OPENAI_API_KEY` | Clé API OpenAI (Whisper) | platform.openai.com → API Keys |
| `ANTHROPIC_API_KEY` | Clé API Anthropic (Claude) | console.anthropic.com → API Keys |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe live | Stripe → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe | Stripe → Developers → Webhooks |
| `STRIPE_PRICE_BASIC_MONTHLY` | ID prix Stripe Basic mensuel | Stripe → Products |
| `STRIPE_PRICE_BASIC_YEARLY` | ID prix Stripe Basic annuel | Stripe → Products |
| `STRIPE_PRICE_EXPERT_MONTHLY` | ID prix Stripe Expert mensuel | Stripe → Products |
| `STRIPE_PRICE_EXPERT_YEARLY` | ID prix Stripe Expert annuel | Stripe → Products |
| `STRIPE_PRICE_PRO_MONTHLY` | ID prix Stripe Pro mensuel | Stripe → Products |
| `STRIPE_PRICE_PRO_YEARLY` | ID prix Stripe Pro annuel | Stripe → Products |
| `BREVO_API_KEY` | Clé API Brevo (emails) | app.brevo.com → Settings → API Keys |
| `BREVO_FROM_EMAIL` | Email expéditeur vérifié | `noreply@subcraftai.com` |
| `CRON_SECRET` | Secret pour le cron de nettoyage | Génère une chaîne aléatoire |
| `ADMIN_EMAIL` | Email du compte admin | `kevin.nedzvedsky@gmail.com` |

### 4. Configurer Stripe Webhooks

Dans **Stripe → Developers → Webhooks → Add endpoint** :

- URL : `https://sub-craft-fxea.vercel.app/api/stripe?action=webhook`
- Événements à écouter :
  - `checkout.session.completed`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`

### 5. Déployer sur Vercel

```bash
vercel --prod
```

Ou via GitHub : connecte le repo sur [vercel.com](https://vercel.com) et chaque push sur `main` déclenche un déploiement automatique.

**Paramètres Vercel (Build & Deployment) :**
- Framework Preset : `Vite`
- Build Command : `npm run build`
- Output Directory : `dist`

---

## 💻 Développement local

```bash
npm install
npm run dev
```

L'app tourne sur `http://localhost:5173`.

Pour tester les API localement, tu peux utiliser [Vercel CLI](https://vercel.com/docs/cli) :

```bash
npm i -g vercel
vercel dev
```

Crée un fichier `.env.local` à la racine avec toutes les variables d'environnement listées ci-dessus.

---

## 🛠️ Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 18 + Vite 5 |
| UI | CSS-in-JS inline (zero dépendance UI) |
| Backend | Vercel Serverless Functions (Node.js 18) |
| Base de données | Supabase (PostgreSQL) |
| Auth | Supabase Auth + Google OAuth |
| Transcription | OpenAI Whisper v3 (API) |
| IA | Anthropic Claude Sonnet |
| Paiements | Stripe Checkout + Webhooks |
| Emails | Brevo (ex Sendinblue) |
| Export vidéo | Canvas API + MediaRecorder (100% navigateur) |
| Déploiement | Vercel |

---

## 🔒 Sécurité

- Les crédits sont **déchargés et vérifiés côté serveur** via `/api/credits` — le `userId` est extrait du JWT, jamais du body de la requête
- L'endpoint `/api/admin` vérifie le token JWT et l'email admin avant tout accès
- Les vidéos sont filtrées par `user_id` via RLS Supabase — isolation totale entre utilisateurs
- Les clés API (OpenAI, Anthropic, Stripe) ne sont **jamais exposées** au navigateur — uniquement dans les fonctions serveur Vercel
- CORS restreint aux domaines autorisés
- Rate limiting sur `/api/anthropic` (30 req/min par IP)
- Vidéos supprimées automatiquement après 24h

---

## 📦 Plans tarifaires

| Plan | Prix | Vidéos/mois | Features |
|---|---|---|---|
| **Free** | 0€ | 3 | Transcription, 28 styles, export SRT |
| **Basic** | 12€/mois | 30 | + Export MP4 HD, traduction 12 langues |
| **Expert** | 18€/mois | 100 | + Emojis IA, support prioritaire |
| **Pro** | 30€/mois | Illimité | + API Access, manager dédié |

---

## 📁 API Reference

### `POST /api/whisper`
Transcription audio via OpenAI Whisper.
```
FormData: file (audio/wav), language (string)
Response: { segments: [{ start, end, text }] }
```

### `POST /api/anthropic`
Proxy Claude AI (emojis, traduction, chat support).
```
Body: { model, messages[], system, max_tokens }
Response: { content: [{ type: "text", text }] }
```

### `POST /api/auth?action=signup|login|me`
Authentification et profil utilisateur.

### `POST /api/credits?action=balance|deduct`
Gestion sécurisée des crédits (JWT requis).

### `POST /api/stripe?action=create-checkout|webhook|portal`
Paiements Stripe.

### `POST /api/email?action=welcome|payment|cancel|credits-empty`
Emails transactionnels via Brevo.

---

## 🤝 Contribution

Ce projet est privé — accès réservé à l'équipe SubCraft.

---

## 📄 Licence

© 2026 KEVININDUSTRIE SAS — SIREN 932 737 992  
Tous droits réservés.
