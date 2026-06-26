# Footballeroo

**Working title:** Footballeroo (brand) · "Mood Food" (core feature)  
**Status:** concept / pre-spec  
**Intended build tool:** Kiro (spec-driven)

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

## 4. User stories (seed set)

1. As a football fan, I want the menu to reflect tonight's match so my order fits the occasion.
2. As a user, I want to describe or request a dish and see a unique photo and recipe for it, so I can try something genuinely new.
3. As a user, I want to customise an existing dish (swap ingredients, change portion), so it suits my taste.
4. As an adventurous user, I want reassurance that a wild combination won't taste awful, so I'm willing to experiment.
5. As a returning user, I want recommendations shaped by my history and dietary needs, so I spend less time choosing.
6. As the operator, I want the menu to favour surplus stock and avoid scarce items, so waste is reduced and orders are fulfillable.

---

## 5. The demo: wow moment

Everything funnels toward one moment: a user describes or requests a dish (or the system proposes one off a live result), and a unique, never-seen-before food photo appears alongside an appetising recipe — vetted by the taste officer.

### Suggested demo scope (keep the supporting systems light):

- Live football and stock can be small mocked datasets feeding real prompts.
- The taste officer can start as a lightweight LLM critic scoring combinations.
- The generated image + recipe is the part that should genuinely shine on screen.

---

## 6. Open decisions (resolve before/within Kiro spec)

- **Live-football data source** — real fixtures/results API vs. mocked match data for the demo.
- **Image generation** — which model produces the food pics; how to keep them appetising and visually consistent.
- **Taste officer design** — rules layer, LLM critic scoring combinations, or both.
- **Custom order fulfilment** — is "ordering" a custom dish real or simulated in the demo, given a generated dish has no real supply chain yet.
- **Naming** — recommendation: keep Footballeroo as the brand; use Mood Food as the feature/tagline, not the product name.

---

## 7. Next steps

1. Decide demo scope vs. full-vision scope.
2. Resolve the open decisions above.
3. Use this document to seed Kiro's requirements / design / tasks docs.

---

*Built with Kiro — spec-driven development.*
