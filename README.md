# Footballeroo

**Working title:** Footballeroo (brand) · "Mood Food" (core feature)  
**Status:** deployed  
**Live URL:** http://production-footballeroo-alb-2107404732.us-east-1.elb.amazonaws.com  
**Built with:** Kiro (spec-driven development)

---

## 1. Concept

Footballeroo is a Deliveroo-style food delivery service for London where the menu is not fixed. It is generated and continuously remixed in real time from three signals — live football, the user's own tastes, and current stock — then served as a highly visual catalogue that users can browse, customise, or use to invent an entirely new dish.

The defining feature, **"Mood Food,"** matches food to the mood and cultural context of the live football moment.

### What it solves

- **Save time** — no scrolling endless static menus; the system surfaces relevant dishes.
- **A novel AI real-time food experience** — the menu reacts to live events.
- **Accessibility** — visual-first browsing, voice and image ordering.
- **Recommendation** — dishes tailored to taste, occasion, and what's actually available.

---

## 2. The football → food mechanic

This is the feature that makes the product Footballeroo rather than a generic food app. Live fixtures and results become food signals in two ways:

- **Cultural** — the cuisines of whichever teams are currently playing (e.g. Italy vs. Spain leans Italian/Spanish). Any country's teams are in scope.
- **Emotional ("mood")** — celebration food after a win, comfort food after a loss.

These signals are blended with user preferences and — critically — with stock state (surplus or scarcity), so excess inventory is quietly turned into appealing, themed dishes.

---

## 3. Components

| Component | Role | Key sub-parts |
|-----------|------|---------------|
| Research agent | Gathers raw inspiration signals | Live football, world cuisines, trends, events, cached imagery |
| User profile & behaviour agent | Captures and learns user context | Taste, dietary needs, favourite teams, order history, browse/rating behaviour |
| Resource handling (supply chain) | Reality check — constrains and informs the menu | Stock tracker, demand predictor, historic data |
| Generation engine | The brain — fuses signals into dish ideas | Menu generator + customiser |
| Taste officer | Safeguard — enables safe adventurousness | Validates that bold/stock-driven combinations will actually taste good before they're shown |
| AI image + recipe generator | The hero output | Produces a unique food photo + an attractive recipe for each dish |
| Visual menu | The user-facing surface | Browse, customise, create, and order |

### Data flow (the dish-generation pipeline)

```
Live football  ┐
User profile   ├──▶ Generation engine ──▶ Taste officer ──▶ AI image + recipe ──▶ Visual menu ──┐
Stock levels   ┘                                                                                │
      ▲                                                                                          │
      └──────────────────────────── order feedback (updates stock + profile) ───────────────────┘
```

---

## 4. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS, Framer Motion |
| Backend API | Express.js, Socket.io (real-time) |
| Database | PostgreSQL 16 (via Prisma ORM) |
| AI/Agents | OpenAI (generation engine, taste officer, DALL-E image gen) |
| Monorepo | Turborepo, npm workspaces |
| Language | TypeScript throughout |

---

## 5. Project Structure

```
footballeroo/
├── apps/
│   ├── api/          # Express API server (port 4000)
│   └── web/          # Next.js frontend (port 3000)
├── packages/
│   ├── database/     # Prisma schema, migrations, client
│   └── shared/       # Shared types and utilities
├── infrastructure/   # CloudFormation template
├── scripts/          # Deployment and setup scripts
└── .kiro/            # Kiro specs and agent config
```

---

## 6. Infrastructure & Deployment

### Architecture decisions

The application is deployed on **AWS (us-east-1)** using a single EC2 instance behind an Application Load Balancer. This approach was chosen over ECS/Fargate because:

- **No Docker dependency** — simplifies the build and deploy pipeline
- **WebSocket support** — Socket.io for real-time football event streaming works natively with a long-running Node.js process
- **Cost-effective for demo** — a single `t3.small` handles both the API and frontend
- **Simpler debugging** — SSM Session Manager gives direct access to the instance

### AWS resources (managed by CloudFormation)

| Resource | Purpose |
|----------|---------|
| VPC + 2 public/2 private subnets | Network isolation |
| Application Load Balancer | Routes `/api/*` and `/socket.io/*` → API (4000), everything else → Web (3000) |
| EC2 instance (t3.small) | Runs API + Web via PM2 |
| RDS PostgreSQL (db.t4g.micro) | Application database |
| S3 Bucket | Stores AI-generated food images |
| IAM Role + Instance Profile | Grants EC2 access to S3 and SSM |

### Deploying

Prerequisites: AWS CLI configured, required env vars set.

```bash
export DB_PASSWORD="your-db-password"
export JWT_SECRET="your-jwt-secret"
export NEXTAUTH_SECRET="your-nextauth-secret"
export OPENAI_API_KEY="sk-..."          # optional
export FOOTBALL_API_KEY="..."           # optional

./scripts/deploy.sh deploy-infra
```

To connect to the instance:

```bash
./scripts/deploy.sh ssh
```

---

## 7. Local Development

### Prerequisites

- Node.js 18+
- PostgreSQL (or use a managed instance)
- npm

### Setup

```bash
# Install dependencies
npm install

# Copy environment file and fill in values
cp .env.example .env

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Start development servers (API + Web)
npm run dev
```

The web app will be available at `http://localhost:3000` and the API at `http://localhost:4000`.

---

## 8. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret for signing auth tokens |
| `NEXTAUTH_SECRET` | Yes | NextAuth.js session encryption |
| `NEXTAUTH_URL` | Yes | Base URL of the web app |
| `OPENAI_API_KEY` | No* | Powers generation engine, taste officer, and image generation |
| `FOOTBALL_API_KEY` | No* | Live football data from football-data.org |
| `MOCK_FOOTBALL_DATA` | No | Set `"true"` to use mocked fixture data |
| `GOOGLE_CLIENT_ID` | No | Google OAuth sign-in |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth sign-in |
| `AWS_S3_BUCKET` | No | S3 bucket for generated food images |
| `AWS_REGION` | No | AWS region for S3 |
| `REDIS_URL` | No | Redis for caching (optional in dev) |

*Required for AI features to work. The app runs without them but agents won't generate content.

---

## 9. User Stories

1. As a football fan, I want the menu to reflect tonight's match so my order fits the occasion.
2. As a user, I want to describe or request a dish and see a unique photo and recipe for it, so I can try something genuinely new.
3. As a user, I want to customise an existing dish (swap ingredients, change portion), so it suits my taste.
4. As an adventurous user, I want reassurance that a wild combination won't taste awful, so I'm willing to experiment.
5. As a returning user, I want recommendations shaped by my history and dietary needs, so I spend less time choosing.
6. As the operator, I want the menu to favour surplus stock and avoid scarce items, so waste is reduced and orders are fulfillable.

---

## 10. Open Decisions

- **Live-football data source** — real fixtures/results API vs. mocked match data for the demo.
- **Image generation** — which model produces the food pics; how to keep them appetising and visually consistent.
- **Taste officer design** — rules layer, LLM critic scoring combinations, or both.
- **Custom order fulfilment** — is "ordering" a custom dish real or simulated in the demo, given a generated dish has no real supply chain yet.

---

*Built with Kiro — spec-driven development.*
