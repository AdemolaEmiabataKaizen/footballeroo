# Footballeroo — Implementation Tasks

#[[file:requirements.md]]
#[[file:design.md]]

---

## Overview

Tasks are organised into **phases**, each delivering a shippable increment. Within each phase, tasks are ordered by dependency. Each task references the requirement(s) it satisfies and the design component it implements.

---

## Phase 0: Project Scaffolding & Infrastructure

> **Goal:** A running monorepo with dev tooling, CI, and deployable skeleton apps.

| # | Task | Description | Traces to |
|---|------|-------------|-----------|
| 0.1 | Initialise Turborepo monorepo | Create monorepo with `apps/web`, `apps/api`, `packages/shared` structure. Configure TypeScript, ESLint, Prettier. | Design §3 |
| 0.2 | Set up Next.js frontend | Next.js 14 App Router in `apps/web`. Tailwind CSS + shadcn/ui. Basic layout with placeholder pages (Home, Menu, Profile, Cart). | Design §2.8 |
| 0.3 | Set up Express API server | Node.js + Express in `apps/api`. TypeScript, basic health check endpoint, CORS config. | Design §2 (API Gateway) |
| 0.4 | Database setup (PostgreSQL + Prisma) | Prisma schema with initial models: User, Order, StockItem, Dish, Fixture. Docker Compose for local Postgres + Redis. | Design §3, Data Layer |
| 0.5 | Redis setup | Redis client utility. Pub/Sub helper for event bus. Cache helper with TTL support. | Design §3 |
| 0.6 | Auth scaffolding | NextAuth.js with Google OAuth + credentials provider. JWT session strategy. Protected route middleware. | Design §2.5, §6 |
| 0.7 | CI/CD pipeline | GitHub Actions: lint, type-check, test, build. Preview deploys on PR (Vercel). | Design §3 |
| 0.8 | Environment & secrets config | `.env.example` for all services. Secret management docs. Local dev setup script. | — |

### Deliverable:
- [ ] Monorepo builds and deploys (frontend on Vercel, API on Railway)
- [ ] Database migrations run successfully
- [ ] Auth flow works end-to-end (sign up, sign in, protected routes)

---

## Phase 1: Football Service & Data Layer (P0 Demo)

> **Goal:** Live football data flows into the system and is available to downstream services.

| # | Task | Description | Traces to |
|---|------|-------------|-----------|
| 1.1 | Create FIFA World Cup 2026 mock dataset | JSON fixtures for all 48 teams, group stage schedule (June 11 – July 19, 2026). Include team→country→cuisine mappings. | REQ-1.1 AC4, Design §2.1 |
| 1.2 | Build Football Service | Service that reads fixtures, determines today's matches, exposes `GET /api/fixtures/today`. Emits events on match state changes. | REQ-1.1, Design §2.1 |
| 1.3 | Country→cuisine mapping table | Seed database/JSON with 48 countries mapped to cuisine tags (3–5 tags per country). Admin-editable. | REQ-1.1 AC4, Design §2.1 |
| 1.4 | Event bus integration | Football Service emits `match.scheduled`, `match.started`, `match.ended` to Redis Pub/Sub. Generation Engine subscribes. | Design §4.1 |
| 1.5 | Match simulation mode | Dev tool: simulate match progression (kick-off → goals → final whistle) on demand for testing real-time flows. | Demo support |

### Deliverable:
- [ ] `GET /api/fixtures/today` returns today's matches with team/cuisine data
- [ ] Events fire correctly on match state transitions
- [ ] Simulation mode allows rapid testing of the full match lifecycle

---

## Phase 2: Generation Engine & Taste Officer (P0 Demo)

> **Goal:** The system generates scored, validated dish concepts from football + stock signals.

| # | Task | Description | Traces to |
|---|------|-------------|-----------|
| 2.1 | Stock Service (basic) | CRUD for stock items. Seed with 50+ common ingredients. Expose `GET /api/admin/stock` and internal `getAvailableIngredients()`. | REQ-6.1, Design §2.6 |
| 2.2 | Generation Engine — prompt design | Design and iterate on the LLM system prompt. Input: cuisine tags, mood, stock, user prefs. Output: structured JSON dish array. | REQ-2.1, Design §2.2 |
| 2.3 | Generation Engine — service implementation | Express route `POST /api/menu/generate`. Gathers context (fixtures + stock + optional user), calls OpenAI, returns dish candidates. | REQ-2.1, Design §2.2 |
| 2.4 | Taste Officer — rules layer | Implement blacklist of known bad pairings. Pre-filter dish candidates before LLM scoring. | REQ-4.1, Design §2.3 |
| 2.5 | Taste Officer — LLM critic | Secondary OpenAI call that scores each dish (0–100). Returns score + reasoning + warnings. | REQ-4.1 AC1-AC4, Design §2.3 |
| 2.6 | Generation pipeline orchestration | Wire together: event trigger → context gather → generate → taste score → filter → cache approved dishes in Redis. | Design §4.1 |
| 2.7 | Menu composition endpoint | `GET /api/menu` — serves the current live menu from Redis cache. Includes dish metadata, scores, mood tags. | REQ-1.1, Design §2.2 |

### Deliverable:
- [ ] Given a match event, system generates 6–12 dish concepts within 10 seconds
- [ ] Taste Officer scores and filters — rejected dishes are replaced
- [ ] `GET /api/menu` returns the live themed menu

---

## Phase 3: AI Image Generation (P0 Demo)

> **Goal:** Every approved dish gets a unique, appetising photorealistic image.

| # | Task | Description | Traces to |
|---|------|-------------|-----------|
| 3.1 | Image Service setup | Service wrapper around DALL-E 3 API. Accepts dish description → returns image URL. Style prompt suffix for consistency. | REQ-2.2, Design §2.4 |
| 3.2 | Image storage & CDN | Upload generated images to S3. Serve via CloudFront. Index by dish ID. | Design §2.4 |
| 3.3 | Integration with generation pipeline | After Taste Officer approval, trigger image generation. Attach image URL to dish record before publishing to menu. | REQ-2.2 AC1, Design §4.1 |
| 3.4 | Fallback & error handling | If image generation fails or times out (>15s), assign a curated stock photo by cuisine tag. Log failure for retry. | REQ-2.2, Design §2.4 |
| 3.5 | Image quality validation | Basic checks: image returned, correct dimensions, no error responses. Manual review process for style consistency. | REQ-2.2 AC2-AC3 |

### Deliverable:
- [ ] Each generated dish displays a unique AI-generated food image
- [ ] Images are visually consistent and appetising
- [ ] Fallback works gracefully when generation fails

---

## Phase 4: Visual Menu Frontend (P0 Demo)

> **Goal:** Users see a beautiful, real-time menu that updates with live football context.

| # | Task | Description | Traces to |
|---|------|-------------|-----------|
| 4.1 | Menu page — dish card grid | Responsive grid of dish cards. Each card: image, name, cuisine tag, mood badge, price, "Add to cart" button. | Design §2.8 |
| 4.2 | Match context banner | Top banner showing today's fixtures, scores, and which cuisines are active. Updates in real-time. | REQ-1.1 |
| 4.3 | Dish detail modal/page | Expanded view: full image, recipe, ingredients, taste score badge ("bold choice" for 40–70), customise button. | REQ-2.1, REQ-4.1 AC2 |
| 4.4 | Real-time menu updates (WebSocket) | Connect to backend WebSocket. When menu changes (new match event triggers regeneration), animate dish cards in/out. | Design §2.8, §4.1 |
| 4.5 | Mood transitions | When a match result comes in, animate the UI mood shift (colour palette, banner message, promoted dishes change). | REQ-1.2 |
| 4.6 | Mobile optimisation | Ensure menu is thumb-friendly on mobile. Bottom sheet for dish detail. Sticky cart summary bar. | Design §2.8 |
| 4.7 | Loading & empty states | Skeleton loaders during generation. "No matches today" fallback with World Kitchen menu. | REQ-1.1 AC3 |

### Deliverable:
- [ ] Beautiful visual menu renders with AI-generated dish images
- [ ] Menu updates live when match events occur
- [ ] Works smoothly on mobile and desktop

---

## Phase 5: User Profiles & Recommendations (P1 MVP)

> **Goal:** Returning users get personalised, dietary-aware recommendations.

| # | Task | Description | Traces to |
|---|------|-------------|-----------|
| 5.1 | User profile page | Profile UI: dietary restrictions, favourite teams, cuisine preferences, delivery addresses. Edit and save. | REQ-5.1, Design §2.5 |
| 5.2 | Onboarding flow | First-login wizard: set dietary needs, pick favourite teams, select cuisine interests. Skippable. | REQ-5.1 AC1-AC2 |
| 5.3 | Profile-aware generation | Pass user profile to Generation Engine. Dishes filtered by dietary restrictions. Favourite team's cuisine weighted higher. | REQ-5.2 AC2-AC3 |
| 5.4 | Recommendation ranking | Top 3 personalised dishes highlighted on menu. Based on: order history similarity, cuisine preference match, team context. | REQ-5.2 AC1 |
| 5.5 | "Surprise me" feature | Button/voice command that generates a single personalised dish recommendation. One-tap add to cart. | REQ-5.2 AC4 |
| 5.6 | Order history page | List of past orders with dish images, dates, re-order button. | REQ-5.1 AC3, REQ-8.1 AC5 |

### Deliverable:
- [ ] Users can set and update dietary/team/cuisine preferences
- [ ] Menu is personalised — top recommendations differ per user
- [ ] "Surprise me" generates a unique personalised dish

---

## Phase 6: Stock Management & Admin (P1 MVP)

> **Goal:** Stock constrains the menu in real-time; admin has visibility and control.

| # | Task | Description | Traces to |
|---|------|-------------|-----------|
| 6.1 | Admin dashboard — stock view | Table/grid of all stock items. Colour-coded: green (surplus), amber (adequate), red (low). Inline edit. | REQ-6.2 AC3 |
| 6.2 | Low-stock alerts | When stock drops below threshold, emit `stock.low` event. Trigger admin notification (in-app + email via SendGrid). | REQ-6.2 AC1-AC2 |
| 6.3 | Surplus-driven generation | Generation Engine weights surplus ingredients higher. Dishes featuring surplus stock get a subtle "good value" badge. | REQ-6.1 AC2 |
| 6.4 | Stock depletion on order | When an order is confirmed, decrement ingredient quantities. Re-check thresholds. | REQ-6.1 AC3, REQ-8.1 AC5 |
| 6.5 | End-of-day stock report | Scheduled job (11 PM daily): summarise stock consumed, remaining, reorder suggestions. Email to admin. | REQ-6.2 AC4 |
| 6.6 | Admin menu override | Admin can pin, remove, or replace dishes on the live menu. Override persists until next generation cycle or manual clear. | Design §2.2 |

### Deliverable:
- [ ] Admin sees real-time stock status with alerts
- [ ] Menu automatically avoids low-stock ingredients
- [ ] Daily stock report delivered to admin

---

## Phase 7: Voice Interface (P1 MVP)

> **Goal:** Users can explore the menu and place orders using voice commands.

| # | Task | Description | Traces to |
|---|------|-------------|-----------|
| 7.1 | Voice UI component | Microphone button. Visual feedback (listening indicator, transcript display). Push-to-talk and hands-free modes. | REQ-7.1, Design §2.7 |
| 7.2 | Speech-to-text integration | Web Speech API integration. Capture transcript, handle interim/final results, error states. | REQ-7.1, Design §2.7 |
| 7.3 | Intent parsing service | `POST /api/voice/intent` — sends transcript to LLM for intent classification. Returns `{intent, entities, response}`. | REQ-7.1 AC1, Design §2.7 |
| 7.4 | Voice handlers — browse & recommend | Handle intents: "What's on the menu?", "Tell me about [dish]", "Recommend something". Return spoken + visual response. | REQ-7.1 AC1 |
| 7.5 | Voice handlers — order & customise | Handle intents: "Add [dish] to cart", "Make it spicy", "Remove the nuts". Confirm before cart modification. | REQ-7.1 AC1, AC4 |
| 7.6 | Text-to-speech response | Speak the system's response using SpeechSynthesis API. Configurable voice/speed. Mute option. | Design §2.7 |
| 7.7 | Voice UX polish | Conversation context (multi-turn). Error recovery ("I didn't catch that"). Help command listing capabilities. | REQ-7.1 AC2 |

### Deliverable:
- [ ] Users can browse menu, ask about dishes, and add to cart via voice
- [ ] Accuracy ≥ 90% for supported intents
- [ ] Response latency ≤ 3 seconds

---

## Phase 8: Ordering & Checkout (P1 MVP)

> **Goal:** Users can complete an order with delivery details and confirmation.

| # | Task | Description | Traces to |
|---|------|-------------|-----------|
| 8.1 | Cart state management | Client-side cart (Zustand/Context). Add, remove, modify quantity. Persist across page navigation. Sync with server for stock validation. | REQ-8.1 AC1-AC2 |
| 8.2 | Cart UI | Slide-out cart panel. Itemised list with images, quantities, prices. Subtotal, delivery fee, total. | REQ-8.1 AC1 |
| 8.3 | Checkout page | Delivery address (pre-filled from profile, editable). Order summary. Confirm button. | REQ-8.1 AC3 |
| 8.4 | Order placement API | `POST /api/orders` — validates stock, creates order record, decrements stock, returns confirmation with estimated delivery time. | REQ-8.1 AC4-AC5, Design §5 |
| 8.5 | Order confirmation page | Success page with order number, estimated time, dish images. Option to track (stub for demo). | REQ-8.1 AC4 |
| 8.6 | Payment integration (stub) | Stripe Elements UI for card input. In demo mode, always succeeds. Real payment processing for production. | REQ-8.1 |

### Deliverable:
- [ ] Users can add dishes to cart, checkout, and receive confirmation
- [ ] Stock is decremented on order
- [ ] Order appears in user's history

---

## Phase 9: Dish Customisation (P1 MVP)

> **Goal:** Users can modify generated dishes before ordering.

| # | Task | Description | Traces to |
|---|------|-------------|-----------|
| 9.1 | Customisation UI | "Customise" button on dish detail. Shows ingredient list with swap/remove options. Available substitutions from stock. | REQ-3.1, Design §2.2 |
| 9.2 | Customisation API | `POST /api/menu/customise` — accepts dish ID + modifications. Regenerates dish with constraints. Returns updated dish + new image. | REQ-3.1 AC1 |
| 9.3 | Taste Officer re-validation | Customised dish is re-scored. Warn user if score drops below 70 ("this is a bold choice"). Block if below 40. | REQ-3.1 AC2, REQ-4.1 |
| 9.4 | Price recalculation | Ingredient swaps adjust price based on cost difference. Display old vs. new price. | REQ-3.1 AC1 |
| 9.5 | Customisation history | Save user's customisations to profile for future recommendations. "Your creations" section. | REQ-5.1 |

### Deliverable:
- [ ] Users can swap ingredients in any dish
- [ ] Customised dish gets new image and updated price
- [ ] Taste Officer validates customisations

---

## Phase 10: Polish, Testing & Launch Prep

> **Goal:** Production-ready quality, performance, and reliability.

| # | Task | Description | Traces to |
|---|------|-------------|-----------|
| 10.1 | End-to-end testing | Playwright tests for critical user journeys: browse → customise → order. API integration tests. | All REQs |
| 10.2 | Performance optimisation | Image lazy loading, menu prefetch, Redis cache tuning. Target: menu load < 500ms. | Design §6 |
| 10.3 | Error handling & resilience | Graceful degradation: if LLM fails → show cached menu. If image gen fails → fallback photo. Circuit breakers. | Design §6 |
| 10.4 | Accessibility audit | Screen reader testing. Keyboard navigation. ARIA labels. Colour contrast. Voice interface as accessibility feature. | REQ-7.1 |
| 10.5 | Security hardening | Input sanitisation. Rate limiting. CSRF protection. Dependency audit. Secrets rotation. | Design §6 |
| 10.6 | Monitoring & alerting | Sentry for errors. PostHog for analytics. Uptime monitoring. LLM cost tracking dashboard. | Design §3 |
| 10.7 | Demo preparation | Seed compelling match data for demo day. Curate stock for interesting dishes. Prepare demo script and talking points. | Demo |

### Deliverable:
- [ ] All critical paths tested and resilient
- [ ] Performance targets met
- [ ] Demo runs smoothly end-to-end

---

## Dependency Graph (Phase-level)

```
Phase 0 (Scaffolding)
    │
    ├──→ Phase 1 (Football Service)
    │         │
    │         └──→ Phase 2 (Generation + Taste) ──→ Phase 3 (Images) ──→ Phase 4 (Visual Menu)
    │
    ├──→ Phase 5 (Profiles) ──────────────────────────────────────────→ Phase 9 (Customisation)
    │
    ├──→ Phase 6 (Stock/Admin)
    │
    ├──→ Phase 7 (Voice)
    │
    └──→ Phase 8 (Ordering)
                                                                          │
                                                          All ──→ Phase 10 (Polish)
```

**Critical path for demo (P0):** Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4

---

## Estimated Timeline (solo developer or small team)

| Phase | Estimated Duration | Cumulative |
|-------|-------------------|------------|
| Phase 0: Scaffolding | 2–3 days | Week 1 |
| Phase 1: Football Service | 2–3 days | Week 1 |
| Phase 2: Generation + Taste | 4–5 days | Week 2 |
| Phase 3: Image Generation | 2–3 days | Week 2–3 |
| Phase 4: Visual Menu | 4–5 days | Week 3 |
| **Demo-ready (P0)** | — | **~3 weeks** |
| Phase 5: Profiles | 3–4 days | Week 4 |
| Phase 6: Stock/Admin | 3–4 days | Week 4–5 |
| Phase 7: Voice | 4–5 days | Week 5 |
| Phase 8: Ordering | 3–4 days | Week 5–6 |
| Phase 9: Customisation | 3–4 days | Week 6 |
| Phase 10: Polish | 3–5 days | Week 7 |
| **MVP-ready (P1)** | — | **~7 weeks** |

---

*Each phase's deliverables serve as acceptance gates. Do not proceed to the next phase until the current phase's deliverables are verified.*
