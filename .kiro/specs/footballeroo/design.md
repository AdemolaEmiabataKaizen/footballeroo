# Footballeroo — Design Spec

#[[file:requirements.md]]

---

## 1. System Architecture

Footballeroo follows a **modular, event-driven architecture** with clear separation between data ingestion, intelligence (generation), and presentation layers. Services communicate via an internal event bus and REST/WebSocket APIs.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                        │
│                                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────────┐   │
│  │  Web App (Next.js)│  │  Voice Interface │  │  Admin Dashboard             │   │
│  │  - Visual Menu    │  │  - Speech-to-Text│  │  - Stock management          │   │
│  │  - Cart/Checkout  │  │  - Intent Parser │  │  - Menu overrides            │   │
│  │  - User Profile   │  │  - TTS Response  │  │  - Analytics                 │   │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────────┬───────────────┘   │
│           │                      │                            │                   │
└───────────┼──────────────────────┼────────────────────────────┼───────────────────┘
            │                      │                            │
            ▼                      ▼                            ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY (Express / tRPC)                         │
│  - Authentication & rate limiting                                                │
│  - WebSocket connections for real-time menu updates                              │
│  - Request routing to microservices                                              │
└────────────────────────────────────┬────────────────────────────────────────────┘
                                     │
            ┌────────────────────────┼────────────────────────┐
            ▼                        ▼                        ▼
┌───────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐
│  FOOTBALL SERVICE │  │  GENERATION ENGINE    │  │  ORDER SERVICE        │
│                   │  │                       │  │                       │
│  - Fixture fetch  │  │  - Dish generation    │  │  - Cart management    │
│  - Result stream  │  │  - Menu composition   │  │  - Checkout flow      │
│  - Event emit     │  │  - Customisation      │  │  - Order history      │
│  - Match schedule │  │  - Taste Officer gate │  │  - Payment (stub)     │
└────────┬──────────┘  └───────────┬───────────┘  └───────────┬───────────┘
         │                         │                           │
         │              ┌──────────┼──────────┐                │
         │              ▼          ▼          ▼                │
         │  ┌────────────────┐ ┌────────────────┐             │
         │  │ TASTE OFFICER  │ │ IMAGE SERVICE  │             │
         │  │                │ │                │             │
         │  │ - Score combos │ │ - Generate     │             │
         │  │ - Flavour rules│ │   food photos  │             │
         │  │ - LLM critic   │ │ - Style control│             │
         │  └────────────────┘ └────────────────┘             │
         │                                                     │
         ▼                                                     ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                           │
│                                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │  PostgreSQL   │  │  Redis       │  │  S3 / CDN    │  │  Event Bus       │    │
│  │              │  │              │  │              │  │  (Redis Pub/Sub) │    │
│  │  - Users     │  │  - Sessions  │  │  - Generated │  │                  │    │
│  │  - Orders    │  │  - Cache     │  │    images    │  │  - match.started │    │
│  │  - Stock     │  │  - Live menu │  │  - Static    │  │  - match.ended   │    │
│  │  - Dishes    │  │  - Rate limit│  │    assets    │  │  - stock.low     │    │
│  │  - Profiles  │  │              │  │              │  │  - menu.updated  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Design

### 2.1 Football Service

**Responsibility:** Ingest live football data and emit events that trigger menu generation.

| Aspect | Decision |
|--------|----------|
| Data source (demo) | Mocked JSON fixtures simulating FIFA World Cup 2026 schedule |
| Data source (production) | Football-Data.org API or API-Football (RapidAPI) |
| Polling interval | Every 60 seconds during live matches; every 15 minutes otherwise |
| Events emitted | `match.scheduled`, `match.started`, `match.goal`, `match.ended`, `match.result` |
| Country→cuisine mapping | Static lookup table (48 countries → cuisine tags), stored in DB, admin-editable |

**Key data model:**
```typescript
interface Fixture {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  status: 'scheduled' | 'live' | 'finished';
  score?: { home: number; away: number };
  kickoff: DateTime;
  competition: string;
}

interface Team {
  id: string;
  name: string;
  country: string;        // ISO 3166-1 alpha-2
  cuisineTags: string[];  // e.g. ['italian', 'mediterranean']
}
```

**Traces to:** REQ-1.1, REQ-1.2

---

### 2.2 Generation Engine

**Responsibility:** The brain — fuses football signals, user profile, and stock into dish concepts.

| Aspect | Decision |
|--------|----------|
| LLM provider | OpenAI GPT-4o (structured output mode) |
| Prompt strategy | System prompt with cuisine context + stock constraints + user prefs → JSON dish output |
| Output format | Structured JSON: name, description, ingredients[], cuisine, mood, prep_time, tags[] |
| Caching | Generated menus cached in Redis with 30-min TTL; invalidated on match events |
| Customisation | Re-runs generation with user modification as an additional constraint |

**Generation pipeline:**
```
1. Receive trigger (match event OR user request OR scheduled refresh)
2. Gather context:
   - Active fixtures → cuisine tags + mood
   - Stock snapshot → available ingredients + surplus items
   - User profile (if personalised) → dietary, favourites, history
3. Compose LLM prompt with structured output schema
4. Call LLM → receive dish candidates (batch of 6-12)
5. Pass each candidate to Taste Officer for scoring
6. Filter (score ≥ 40) and rank
7. For approved dishes → trigger image generation
8. Publish to menu (Redis + WebSocket push to clients)
```

**Traces to:** REQ-1.1, REQ-1.2, REQ-2.1, REQ-3.1, REQ-6.1

---

### 2.3 Taste Officer

**Responsibility:** Validate that generated dishes will actually taste good.

| Aspect | Decision |
|--------|----------|
| Approach | Hybrid: rules layer + LLM critic |
| Rules layer | Known bad pairings (e.g. fish + chocolate, mint + orange juice) stored as a blacklist |
| LLM critic | Secondary LLM call that scores the dish 0–100 on: flavour coherence, texture balance, cultural authenticity |
| Threshold | < 40 = reject & regenerate; 40–70 = "bold choice" badge; > 70 = approved |
| Performance | Must complete within 3 seconds per dish |

**Scoring prompt structure:**
```
You are a professional chef and food critic. Score this dish 0-100 on:
- Flavour coherence (do the ingredients complement each other?)
- Texture balance (is there variety in mouthfeel?)
- Cultural authenticity (does it respect the cuisine's traditions?)

Dish: {dish_json}

Return: { score: number, reasoning: string, warnings: string[] }
```

**Traces to:** REQ-4.1

---

### 2.4 AI Image Service

**Responsibility:** Generate photorealistic, appetising food images for each dish.

| Aspect | Decision |
|--------|----------|
| Model | DALL-E 3 (or Midjourney API when available) |
| Style consistency | Fixed style prompt suffix: "professional food photography, overhead angle, natural lighting, clean white plate, shallow depth of field" |
| Resolution | 1024×1024 generated, served at multiple sizes via CDN |
| Storage | S3-compatible object store, indexed by dish ID |
| Fallback | If generation fails, use a curated stock photo matched by cuisine tag |

**Traces to:** REQ-2.2

---

### 2.5 User Profile & Behaviour Agent

**Responsibility:** Store, learn, and serve user context.

| Aspect | Decision |
|--------|----------|
| Auth | OAuth 2.0 (Google, Apple) + email/password fallback |
| Profile data | dietary restrictions, favourite teams, cuisine preferences, delivery addresses |
| Behaviour tracking | Orders, ratings, browse time per dish, customisation history |
| Recommendation model | Collaborative filtering (similar users) + content-based (ingredient/cuisine similarity) |
| Privacy | GDPR-compliant; users can export/delete data |

**Data model:**
```typescript
interface UserProfile {
  id: string;
  email: string;
  name: string;
  dietary: DietaryRestriction[];
  favouriteTeams: string[];       // team IDs
  cuisinePreferences: string[];   // cuisine tags ranked
  addresses: Address[];
  createdAt: DateTime;
}

interface OrderHistory {
  userId: string;
  orders: Order[];
  totalOrders: number;
  favouriteDishes: string[];      // dish IDs by frequency
}

type DietaryRestriction = 
  | 'vegan' | 'vegetarian' | 'pescatarian'
  | 'halal' | 'kosher'
  | 'gluten-free' | 'dairy-free' | 'nut-free';
```

**Traces to:** REQ-5.1, REQ-5.2

---

### 2.6 Stock / Inventory Service

**Responsibility:** Track ingredient availability and constrain menu generation.

| Aspect | Decision |
|--------|----------|
| Stock model | Ingredients with quantity, unit, threshold, surplus flag |
| Updates | Manual admin input (MVP); POS integration (future) |
| Surplus logic | If quantity > 150% of daily average usage → mark as surplus → weight higher in generation |
| Low-stock logic | If quantity < threshold → emit `stock.low` event → alert admin + remove from generation pool |
| Demo mode | Pre-seeded stock data with simulated daily depletion |

**Data model:**
```typescript
interface StockItem {
  id: string;
  ingredient: string;
  quantity: number;
  unit: 'kg' | 'litres' | 'units' | 'portions';
  threshold: number;          // low-stock alert level
  avgDailyUsage: number;
  status: 'surplus' | 'adequate' | 'low' | 'out';
  lastUpdated: DateTime;
}
```

**Traces to:** REQ-6.1, REQ-6.2

---

### 2.7 Voice Interface

**Responsibility:** Enable voice-driven menu exploration and ordering.

| Aspect | Decision |
|--------|----------|
| Speech-to-text | Web Speech API (browser-native) for MVP; Whisper API for accuracy upgrade |
| Intent parsing | LLM-based intent classification (not a rigid slot-filling system) |
| Text-to-speech | Browser SpeechSynthesis API (MVP); ElevenLabs for premium voice (future) |
| Supported intents | `browse_menu`, `ask_about_dish`, `recommend`, `add_to_cart`, `customise_dish`, `checkout` |
| Confirmation | Always confirm before placing an order or making payment |

**Intent flow:**
```
User speaks → STT → raw text → LLM intent parser → {intent, entities} → route to handler → response → TTS
```

**Traces to:** REQ-7.1

---

### 2.8 Visual Menu (Frontend)

**Responsibility:** The primary user-facing surface.

| Aspect | Decision |
|--------|----------|
| Framework | Next.js 14+ (App Router) with React Server Components |
| Styling | Tailwind CSS + shadcn/ui components |
| Real-time updates | WebSocket connection for live menu changes during matches |
| Responsiveness | Mobile-first; optimised for phone ordering during match watching |
| Key pages | Home/Menu, Dish Detail, Cart, Checkout, Profile, Order History |
| Animations | Framer Motion for dish card transitions and menu mood shifts |

**Traces to:** REQ-2.2, REQ-3.1, REQ-8.1

---

## 3. Tech Stack Summary

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS, Framer Motion | SSR for SEO, great DX, real-time capable |
| API | Node.js, Express (or tRPC), WebSocket (Socket.io) | JavaScript end-to-end, real-time support |
| LLM | OpenAI GPT-4o (generation, taste, intent) | Best structured output, fast, reliable |
| Image Gen | DALL-E 3 | Integrated with OpenAI, consistent quality |
| Database | PostgreSQL (via Prisma ORM) | Relational integrity for orders/users/stock |
| Cache | Redis | Session, menu cache, pub/sub event bus |
| Storage | AWS S3 + CloudFront CDN | Generated images, static assets |
| Auth | NextAuth.js (OAuth + credentials) | Integrated with Next.js, multiple providers |
| Voice STT | Web Speech API (MVP) / Whisper (upgrade) | Zero-cost MVP, high-accuracy upgrade path |
| Voice TTS | Browser SpeechSynthesis / ElevenLabs | Progressive enhancement |
| Hosting | Vercel (frontend) + Railway/Render (backend) | Fast deploys, good free tiers for demo |
| Monitoring | Sentry (errors) + PostHog (analytics) | Full-stack observability |

---

## 4. Data Flow Diagrams

### 4.1 Menu Generation Flow (match day)

```
                    ┌─────────────┐
                    │  Cron Job   │ (every 60s during match window)
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Football   │──── fetch fixtures/results
                    │  Service    │
                    └──────┬──────┘
                           │ emit: match.started / match.ended
                           ▼
                    ┌─────────────┐
                    │  Event Bus  │
                    │  (Redis)    │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
      ┌──────────┐  ┌──────────┐  ┌──────────┐
      │ Stock    │  │Generation│  │ Notifier │
      │ Service  │  │ Engine   │  │ (admin)  │
      └──────────┘  └────┬─────┘  └──────────┘
              │           │
              │    gather context
              ▼           │
      stock snapshot      │
              │           ▼
              └──→ compose prompt ──→ LLM call ──→ dish candidates
                                                        │
                                                        ▼
                                                 ┌─────────────┐
                                                 │Taste Officer │
                                                 └──────┬──────┘
                                                        │ scored dishes
                                                        ▼
                                                 ┌─────────────┐
                                                 │Image Service │
                                                 └──────┬──────┘
                                                        │ dishes + images
                                                        ▼
                                                 ┌─────────────┐
                                                 │ Redis Cache  │──→ WebSocket push to clients
                                                 │ (live menu)  │
                                                 └─────────────┘
```

### 4.2 User Order Flow

```
User ──→ Browse Menu ──→ Select/Customise Dish ──→ Add to Cart ──→ Checkout
  │                              │                                      │
  │ (voice)                      │ (triggers regeneration               │
  ▼                              │  if customised)                      ▼
Voice Interface ─────────────────┘                              Order Service
                                                                      │
                                                               ┌──────┼──────┐
                                                               ▼      ▼      ▼
                                                          Decrement  Save   Send
                                                           Stock    Order  Confirmation
```

---

## 5. API Design (Key Endpoints)

### Public API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/menu` | Current live menu (cached) | No |
| GET | `/api/menu/dish/:id` | Single dish detail | No |
| POST | `/api/menu/generate` | User-requested custom dish | Yes |
| POST | `/api/menu/customise` | Modify existing dish | Yes |
| GET | `/api/fixtures/today` | Today's matches | No |
| POST | `/api/orders` | Place an order | Yes |
| GET | `/api/orders/history` | User's order history | Yes |
| GET | `/api/profile` | User profile | Yes |
| PUT | `/api/profile` | Update profile | Yes |
| POST | `/api/voice/intent` | Process voice transcript | Yes |

### Admin API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/stock` | Full stock overview | Admin |
| PUT | `/api/admin/stock/:id` | Update stock item | Admin |
| POST | `/api/admin/stock/bulk` | Bulk stock update | Admin |
| GET | `/api/admin/orders` | All orders (filterable) | Admin |
| PUT | `/api/admin/menu/override` | Manual menu adjustment | Admin |
| GET | `/api/admin/analytics` | Dashboard data | Admin |

---

## 6. Security & Non-Functional Considerations

| Concern | Approach |
|---------|----------|
| Authentication | JWT tokens (short-lived access + refresh); OAuth social login |
| Authorization | Role-based: `user`, `admin`; middleware guards on admin routes |
| Rate limiting | 100 req/min per user; generation endpoints limited to 10/min |
| Data privacy | GDPR: consent, data export, right to deletion |
| Performance | Menu load < 500ms (cached); dish generation < 10s; image gen < 15s |
| Scalability | Stateless services behind load balancer; Redis for shared state |
| Availability | 99.5% uptime target; graceful degradation (show cached menu if generation fails) |
| Cost control | LLM calls batched where possible; image generation only for approved dishes |

---

## 7. Open Design Decisions (to resolve during implementation)

| # | Decision | Options | Recommendation |
|---|----------|---------|----------------|
| 1 | Football API for production | Football-Data.org (free tier) vs. API-Football (paid, richer) | Start with mocked data; integrate Football-Data.org for MVP |
| 2 | Image model | DALL-E 3 vs. Midjourney vs. Stable Diffusion | DALL-E 3 (API access, consistent, fast) |
| 3 | Monorepo vs. polyrepo | Turborepo monorepo vs. separate repos | Monorepo (Turborepo) — simpler for small team |
| 4 | Real-time transport | WebSocket (Socket.io) vs. SSE | WebSocket — bidirectional needed for voice |
| 5 | Deployment | Vercel + Railway vs. all-AWS | Vercel + Railway for speed; migrate to AWS if scale demands |

---

*This design spec translates requirements into buildable components. Each component traces back to specific REQs and can be implemented independently.*
