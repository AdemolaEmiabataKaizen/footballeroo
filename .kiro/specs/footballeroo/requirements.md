# Footballeroo — Requirements Spec

#[[file:../../README.md]]

---

## Overview

This document expands the seed user stories into formal, testable requirements using the **EARS** (Easy Approach to Requirements Syntax) pattern. Each requirement is tagged with a priority (P0 = must-have for demo, P1 = must-have for MVP, P2 = future).

---

## REQ-1: Live Football Menu Generation

**User Story:** As a football fan, I want the menu to reflect tonight's match so my order fits the occasion.

### REQ-1.1 — Cultural signal (EARS: Event-driven)

> **When** a live football fixture is active or scheduled for today, **the system shall** retrieve the nationalities of both teams and generate menu items drawing from the cuisines of those countries.

**Acceptance Criteria:**
- [ ] AC1: Given a fixture "Italy vs. Spain" is scheduled today, the generated menu contains at least 3 dishes associated with Italian cuisine and at least 3 dishes associated with Spanish cuisine.
- [ ] AC2: Given multiple fixtures on the same day, the menu includes cultural dishes for every playing nation.
- [ ] AC3: Given no fixture is scheduled today, the system falls back to a "World Kitchen" default menu using trending or popular global dishes.
- [ ] AC4: Cuisine-to-country mappings cover all 48 FIFA World Cup 2026 participating nations.

**Priority:** P0 (demo)

---

### REQ-1.2 — Emotional signal / Mood Food (EARS: Event-driven)

> **When** a match result is known (win/loss/draw), **the system shall** adjust the menu mood — celebration food for a winning team's fans, comfort food for the losing team's fans.

**Acceptance Criteria:**
- [ ] AC1: Given Team A has just won, dishes tagged "celebration" (e.g. rich, indulgent, shareable) are promoted for users who follow Team A.
- [ ] AC2: Given Team B has just lost, dishes tagged "comfort" (e.g. warm, hearty, nostalgic) are promoted for users who follow Team B.
- [ ] AC3: Given a draw, a "fusion" mood blending both cuisines is applied.
- [ ] AC4: Mood transitions happen within 5 minutes of a match result being confirmed.

**Priority:** P1 (MVP)

---

## REQ-2: AI Dish Creation & Visualisation

**User Story:** As a user, I want to describe or request a dish and see a unique photo and recipe for it, so I can try something genuinely new.

### REQ-2.1 — Dish generation from prompt (EARS: User-initiated)

> **When** a user submits a dish description (text or voice), **the system shall** generate a unique dish concept including name, description, ingredient list, and preparation summary.

**Acceptance Criteria:**
- [ ] AC1: Given a user types "spicy Brazilian street food with cheese", the system returns a named dish with ingredients and a short recipe within 10 seconds.
- [ ] AC2: The generated dish respects the user's stored dietary restrictions (e.g. no pork, vegan).
- [ ] AC3: Generated dishes only use ingredients currently available in stock (or clearly marked as "special order").

**Priority:** P0 (demo)

---

### REQ-2.2 — AI food image generation (EARS: Event-driven)

> **When** a dish concept is generated or displayed on the menu, **the system shall** produce a photorealistic, appetising food image unique to that dish.

**Acceptance Criteria:**
- [ ] AC1: Each generated dish has an accompanying image rendered within 15 seconds of dish creation.
- [ ] AC2: Images are visually consistent in style (lighting, plating, angle) across the menu.
- [ ] AC3: Images do not contain text, watermarks, or unrealistic artefacts.
- [ ] AC4: The image accurately represents the described ingredients and cuisine style.

**Priority:** P0 (demo — this is the "wow moment")

---

## REQ-3: Dish Customisation

**User Story:** As a user, I want to customise an existing dish (swap ingredients, change portion), so it suits my taste.

### REQ-3.1 — Ingredient swap (EARS: User-initiated)

> **When** a user selects an existing dish and requests an ingredient substitution, **the system shall** regenerate the dish with the substitution applied, updating the image, recipe, and price accordingly.

**Acceptance Criteria:**
- [ ] AC1: Given a user swaps "chicken" for "tofu" in a dish, the updated dish reflects tofu in the name/description, recipe, image, and price.
- [ ] AC2: The system warns the user if the substitution is flagged by the Taste Officer as a poor combination.
- [ ] AC3: Substitution options are limited to in-stock ingredients.

**Priority:** P1 (MVP)

---

### REQ-3.2 — Portion control (EARS: User-initiated)

> **When** a user changes the portion size of a dish, **the system shall** recalculate ingredients, price, and nutritional info proportionally.

**Acceptance Criteria:**
- [ ] AC1: Available portion sizes: Small, Regular, Large, Sharing.
- [ ] AC2: Price scales proportionally (±20% for small/large, +80% for sharing).
- [ ] AC3: Nutritional information updates to match the selected portion.

**Priority:** P2 (future)

---

## REQ-4: Taste Officer (Safety Gate)

**User Story:** As an adventurous user, I want reassurance that a wild combination won't taste awful, so I'm willing to experiment.

### REQ-4.1 — Taste validation (EARS: Event-driven)

> **When** the generation engine produces a dish (whether system-generated or user-requested), **the system shall** pass it through the Taste Officer for validation before displaying it to the user.

**Acceptance Criteria:**
- [ ] AC1: Each dish receives a taste-confidence score (0–100). Dishes scoring below 40 are rejected and regenerated.
- [ ] AC2: Dishes scoring 40–70 are shown with a "bold choice" badge and a brief note explaining the flavour profile.
- [ ] AC3: Dishes scoring above 70 are shown without qualification.
- [ ] AC4: The Taste Officer considers known flavour-pairing rules (e.g. sweet + salty = good; fish + chocolate = bad unless justified).

**Priority:** P0 (demo — lightweight LLM critic)

---

## REQ-5: Personalised Recommendations

**User Story:** As a returning user, I want recommendations shaped by my history and dietary needs, so I spend less time choosing.

### REQ-5.1 — User profile & preferences (EARS: Ubiquitous)

> **The system shall** maintain a user profile storing dietary restrictions, favourite teams, cuisine preferences, and order history.

**Acceptance Criteria:**
- [ ] AC1: Users can set dietary restrictions during onboarding (vegan, vegetarian, halal, gluten-free, allergies).
- [ ] AC2: Users can select one or more favourite football teams.
- [ ] AC3: Order history is retained and accessible to the user.
- [ ] AC4: Preferences can be updated at any time from the profile page.

**Priority:** P1 (MVP)

---

### REQ-5.2 — Recommendation engine (EARS: Event-driven)

> **When** a user opens the menu, **the system shall** rank and surface dishes based on their profile, past orders, and current football context.

**Acceptance Criteria:**
- [ ] AC1: The top 3 recommended dishes are personalised (not the same for all users).
- [ ] AC2: Recommendations never include items that violate the user's dietary restrictions.
- [ ] AC3: Recommendations factor in the user's favourite team's current match context.
- [ ] AC4: A "surprise me" option generates a single recommended dish with one tap.

**Priority:** P1 (MVP)

---

## REQ-6: Stock-Aware Menu

**User Story:** As the operator, I want the menu to favour surplus stock and avoid scarce items, so waste is reduced and orders are fulfillable.

### REQ-6.1 — Stock constraint on generation (EARS: Ubiquitous)

> **The system shall** only generate or display dishes whose ingredients are available in sufficient stock to fulfil at least one order.

**Acceptance Criteria:**
- [ ] AC1: If an ingredient's stock falls below the minimum threshold, dishes requiring that ingredient are removed or regenerated.
- [ ] AC2: Surplus stock items are weighted higher in the generation engine, increasing the likelihood they appear in generated dishes.
- [ ] AC3: Stock levels are checked at the point of dish generation and again at order confirmation.

**Priority:** P1 (MVP)

---

### REQ-6.2 — Admin stock dashboard & alerts (EARS: Event-driven)

> **When** stock for any ingredient drops below a configurable threshold, **the system shall** notify the admin via the dashboard and optional push/email alert.

**Acceptance Criteria:**
- [ ] AC1: Admin can set low-stock thresholds per ingredient.
- [ ] AC2: Alerts are sent within 1 minute of threshold breach.
- [ ] AC3: The dashboard shows a real-time overview: items in surplus (green), adequate (amber), low (red).
- [ ] AC4: End-of-day automated report summarises stock consumed, remaining, and suggested reorder quantities.

**Priority:** P1 (MVP)

---

## REQ-7: Voice & Image Ordering

**User Story (implied):** As a user, I want to explore the menu and place orders using voice commands or by uploading a food image.

### REQ-7.1 — Voice menu exploration (EARS: User-initiated)

> **When** a user activates voice mode and speaks a command, **the system shall** interpret the intent and respond with relevant menu information or actions.

**Acceptance Criteria:**
- [ ] AC1: Supported intents: browse menu, ask about a dish, request a recommendation, place an order, customise a dish.
- [ ] AC2: Voice recognition accuracy ≥ 90% for supported commands in English.
- [ ] AC3: Response latency ≤ 3 seconds from end of utterance to system response.
- [ ] AC4: The system confirms the interpreted intent before executing destructive actions (placing an order).

**Priority:** P1 (MVP)

---

### REQ-7.2 — Image-based ordering (EARS: User-initiated)

> **When** a user uploads a photo of food, **the system shall** identify the dish (or closest match) and offer to add it to the order or generate a similar dish.

**Acceptance Criteria:**
- [ ] AC1: The system identifies the primary dish in the image with ≥ 80% confidence.
- [ ] AC2: If an exact match exists on the current menu, it is suggested directly.
- [ ] AC3: If no exact match exists, the system generates a "closest match" dish and presents it for approval.
- [ ] AC4: Users receive feedback within 5 seconds of image upload.

**Priority:** P2 (future)

---

## REQ-8: Ordering & Checkout

### REQ-8.1 — Cart and order flow (EARS: User-initiated)

> **When** a user adds one or more dishes to their cart and proceeds to checkout, **the system shall** calculate the total, confirm delivery details, and place the order.

**Acceptance Criteria:**
- [ ] AC1: Cart displays itemised dishes with individual and total prices.
- [ ] AC2: Users can modify quantity or remove items before confirming.
- [ ] AC3: Delivery address is pre-filled from user profile (editable).
- [ ] AC4: Order confirmation provides an estimated delivery time.
- [ ] AC5: Order is recorded in user history and stock is decremented.

**Priority:** P1 (MVP)

---

## Summary: Priority Matrix

| Priority | Requirements | Scope |
|----------|-------------|-------|
| **P0 (Demo)** | REQ-1.1, REQ-2.1, REQ-2.2, REQ-4.1 | Football→menu, dish generation, image generation, taste gate |
| **P1 (MVP)** | REQ-1.2, REQ-3.1, REQ-5.1, REQ-5.2, REQ-6.1, REQ-6.2, REQ-7.1, REQ-8.1 | Mood food, customisation, profiles, recommendations, stock, voice, ordering |
| **P2 (Future)** | REQ-3.2, REQ-7.2 | Portions, image-based ordering |

---

*This requirements spec is the source of truth for acceptance criteria. All design and implementation work should trace back to these REQs.*
