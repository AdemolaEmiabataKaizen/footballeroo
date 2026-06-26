# Footballeroo — Deployment Guide (Option C: All Vercel)

## Architecture

```
┌─────────────────────────────────┐
│        Vercel (Frontend)        │
│  Next.js App + API Routes       │
│  - Pages (SSR/ISR)              │
│  - /api/* (Serverless Functions)│
└──────────────┬──────────────────┘
               │
     ┌─────────┴─────────┐
     │                    │
     ▼                    ▼
┌──────────┐      ┌──────────────┐
│  Vercel  │      │   Upstash    │
│ Postgres │      │    Redis     │
│          │      │  (cache +    │
│ (DB)     │      │   pub/sub)   │
└──────────┘      └──────────────┘
```

---

## Step-by-Step Deployment

### Prerequisites

- [Vercel account](https://vercel.com/signup) (GitHub-connected)
- [Upstash account](https://upstash.com) (free tier)
- [OpenAI API key](https://platform.openai.com/api-keys) (optional — app works without it)

---

### Step 1: Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo: `ThamuGurungKaizen/footballeroo`
3. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/web`
   - **Build Command:** `cd ../.. && npm run build --workspace=@footballeroo/web`
   - **Install Command:** `cd ../.. && npm install`
   - **Output Directory:** `.next`
4. Click **Deploy**

---

### Step 2: Add Vercel Postgres

1. In your Vercel project dashboard, go to **Storage** tab
2. Click **Create** → **Postgres**
3. Choose a region (e.g. `iad1` for US East)
4. This automatically adds `POSTGRES_*` env vars to your project

---

### Step 3: Add Upstash Redis

1. Go to [console.upstash.com](https://console.upstash.com)
2. Create a new Redis database (free tier)
3. Copy the **REST URL** and **Token**
4. In Vercel project settings → **Environment Variables**, add:
   - `UPSTASH_REDIS_REST_URL` = your Upstash REST URL
   - `UPSTASH_REDIS_REST_TOKEN` = your Upstash token
   - `REDIS_URL` = your Upstash Redis URL (redis://...)

---

### Step 4: Set Environment Variables

In Vercel → Settings → Environment Variables, add:

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | (auto from Vercel Postgres) | Yes |
| `NEXTAUTH_SECRET` | Generate: `openssl rand -base64 32` | Yes |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Yes |
| `REDIS_URL` | Upstash Redis URL | Yes |
| `OPENAI_API_KEY` | Your OpenAI key | Optional (fallback mode without) |
| `GOOGLE_CLIENT_ID` | Google OAuth ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | Optional |
| `MOCK_FOOTBALL_DATA` | `true` | Yes (for demo) |

---

### Step 5: Run Database Migrations

After first deploy, run migrations via Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Pull env vars locally
vercel env pull .env.local

# Run Prisma migrations
npx prisma migrate deploy --schema=packages/database/prisma/schema.prisma

# Seed the database
npx tsx packages/database/prisma/seed.ts
```

---

### Step 6: Verify

Visit your deployed URL:
- **Home:** `https://your-app.vercel.app`
- **Menu:** `https://your-app.vercel.app/menu`
- **Profile:** `https://your-app.vercel.app/profile`

---

## Alternative: Deploy API Separately (Recommended for WebSocket support)

Since Vercel serverless functions don't support WebSocket, for real-time match updates:

1. Deploy the Express API to **Railway** or **Render** (free tier)
2. Set `NEXT_PUBLIC_API_URL` in Vercel to point to the Railway API URL
3. WebSocket connections go directly to Railway

```bash
# On Railway:
# Root directory: apps/api
# Start command: npm run start
# Build command: npm run build
```

---

## Quick Local Demo (Alternative)

If you just want to demo locally:

```bash
cd footballeroo
./scripts/setup.sh   # Starts Docker, installs deps, migrates, seeds
npm run dev          # Frontend :3000, API :4000
```

Visit `http://localhost:3000` — full demo working!

---

## Demo Script

For the best demo experience:

1. **Open the menu page** — shows the match-day banner + AI-generated dishes
2. **Click a dish** — shows the detail modal with image, ingredients, taste score
3. **Click "Surprise Me"** — generates a unique dish on the fly
4. **Visit Profile** — set dietary restrictions, pick favourite teams
5. **Return to menu** — dishes are now personalised (filtered + ranked)
6. **Run a match simulation** (via API):
   ```bash
   curl -X POST http://localhost:4000/api/simulate/matchday
   ```
   Watch the menu regenerate with new dishes based on the match result!

---

## Costs (Estimated)

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Vercel | 100GB bandwidth, serverless | More than enough for demo |
| Vercel Postgres | 256MB storage | Sufficient for demo |
| Upstash Redis | 10K commands/day | Fine for demo traffic |
| OpenAI | Pay-as-you-go | ~$0.01-0.05 per menu generation |
| DALL-E 3 | ~$0.04 per image | ~$0.32 per full menu (8 images) |

**Total for demo: ~$0-5/month** (mostly OpenAI if used)
