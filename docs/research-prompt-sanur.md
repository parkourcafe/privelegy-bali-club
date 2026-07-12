# Other Bali — Sanur research prompt (deep-research, verified)

Paste this into your deep-research tool. It is built so the output drops
straight into the SEO spokes (`/bali/sanur/[intent]`) via a migration, with no
reshaping. Same shape as the Ubud/Seminyak brunch packages.

---

## Role & objective

You are a local-verification researcher for **Other Bali**, a free trip-planning
guide that recommends places by *the moment they suit*, not by star rating.
Produce a **verified, publish-oriented package for Sanur** covering several
distinct "jobs" a traveller has, so we can build decision-pages like
"Best breakfast in Sanur" and "Best local food in Sanur".

Deliver `revise`-grade honesty: verify with live sources, and where a fact
cannot be confirmed, write `unverified` — never guess.

## District boundary (strict — controls duplicates)

Include only **Sanur** (Denpasar Selatan, the beachfront strip and its lanes):
Pantai Sanur, the Sanur boardwalk, Jl. Danau Tamblingan, Jl. Danau Poso,
Pantai Karang, Pantai Mertasari, Jl. Cemara / Semawang, Batu Jimbar.
**Exclude** Denpasar city proper, Serangan, Benoa/Tanjung Benoa, Nusa Dua,
and the Nusa islands. If a venue markets itself as "Sanur" but its address is
outside this strip, exclude it and say why.

> **Sanur is an EAST-coast, SUNRISE town.** Do not build a "best sunset" angle
> for Sanur — sunrise breakfast / beachfront morning is the real strength.

## Intents to cover (map to these EXACT slugs)

Cover the 3–5 intents below that Sanur genuinely supports. Each recommended
venue must be tagged with one or more of these **canonical job slugs** (use the
slug verbatim — this is our controlled vocabulary; anything else is discarded):

| Intent | job slug | Sanur angle |
|---|---|---|
| Brunch / breakfast | `brunch_after_surf` | beachfront & boardwalk breakfast, specialty coffee |
| Local food / warung | `local_food_calm` | Sanur warungs, seafood, calm authentic meals |
| Family dinner | `family_early_dinner` | relaxed, kid-friendly, early |
| Date night | `date_night_special` | beachfront / romantic dinner |
| Special occasion | `special_occasion` | standout / celebratory meal |
| Work-friendly café | `quiet_work_cafe` | wifi, laptop-friendly, calm |
| Groups / sharing | `group_dinner_share` | big table, sharing |

(Do **not** use `sunset_drinks_view` for Sanur. `just_landed_easy_dinner` is
deprioritised — skip unless clearly strong.)

**Publishing gate:** only report an intent as "publishable" if you can verify
**≥ 4 venues** that genuinely fit it. Below that, list what you found and mark it
`thin — not enough for a page`.

## Selection method

Rank by fit-to-moment, not stars. For each candidate verify, from official
sources first: current name, exact Sanur sub-area, open status, official website
or official social account, opening hours, category, and a signature-dish /
what-to-order signal. Exclude venues you cannot cleanly verify. Prefer a shorter,
higher-confidence list over padding.

## HARD content guardrails (the output must already comply)

1. **No Google review data.** Do not include Google/TripAdvisor star ratings or
   review counts in the copy we publish. You may use them privately to sanity-
   check, but they must NOT appear in the per-venue publishable fields below.
2. **No quality warnings / anti-lists.** Never write "overrated", "mixed
   feedback", "avoid", "don't order X". Downsides may appear **only** as
   *fit-context* — WHO/WHEN a place doesn't suit — in the `not_for` field
   (e.g. "not for a quiet table — it runs busy").
3. **No scraped review text.** Google Maps only for factual checks (existence,
   map URL, address, hours, website).
4. **Prices as a band**, not a live menu: e.g. `$$ · breakfast ~70–120K`.
5. **English only.** Verified facts only; mark gaps `unverified`, don't invent.

## Required output

### A. Research summary
Boundary interpretation, candidate funnel (reviewed → verified → included /
excluded, with one-line exclusion reasons), and overall confidence.

### B. Per-venue records — the fields we import (most important section)
For every included venue, give EXACTLY these fields, ready for our database:

| field | notes |
|---|---|
| `name` | official current name |
| `area` | Sanur sub-area (e.g. "Jl. Danau Tamblingan", "Sanur Beach / boardwalk") |
| `address` | street address |
| `category` | one of: cafe, restaurant, warung, bar, beach_club, spa, surf |
| `gmaps_url` | a `https://www.google.com/maps/search/?api=1&query=...&query_place_id=...` link |
| `price_anchor` | band, e.g. `$$ · mains ~80–150K` |
| `what_to_order` | 3–5 signature items, semicolon-separated |
| `why_its_here` | 1–2 factual sentences; answer-first, no hype |
| `best_for` | WHO/WHEN it suits (semicolon-separated) |
| `not_for` | WHO/WHEN it doesn't suit — fit-context only, no quality warning |
| `jobs` | 1–4 canonical slugs from the table above |

### C. Content brief (per publishable intent)
Primary + supporting queries, title tag, meta description, H1, FAQ (3–4 Q&A
grounded in real facts), internal-link suggestions.

### D. Final article(s)
One publishable English article per publishable intent (answer-first verdict →
who it's for → ranked picks with what-to-order + price + best/not-for → FAQ →
last-verified).

### E. Evidence ledger + QA status
Source per venue (official / second platform), verified date, and a final
`publish` / `revise` status with the exact gaps blocking publish.

---

**When done, send me the package.** I'll validate every `jobs` slug against the
9-word vocabulary, filter anything that slipped past the guardrails, and turn the
per-venue records (section B) into a ready migration — exactly as with the Ubud
(`0019`) and Seminyak (`0020`) brunch imports.
