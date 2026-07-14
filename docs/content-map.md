# Other Bali — content map

The full picture of what content the site has, where it lives, and how it links
together. Snapshot: 2026-07-13.

## At a glance

| Layer | Count | Indexable | Source of truth |
|---|---|---|---|
| District pillars | 6 | yes | `lib/pillars.ts` + `app/<district>/` |
| Pillar child guides | 23 | yes | `lib/pillars.ts` + `app/<district>/<child>/` |
| Trip scenarios | 4 | yes | `lib/scenarios.ts` |
| Long-form guides (SEO/AEO) | 14 | yes | `lib/guides.ts` + routes |
| Venue pages (`/places/[slug]`) | ~283 | decision-ready only | Supabase + `lib/publication.ts` |
| Programmatic hubs/spokes (`/bali/*`) | dynamic | yes | `lib/data.ts` |
| Tool surfaces | — | mixed | `/plan`, `/places`, `/route/*` |

Everything above is enumerated in `app/sitemap.ts` and pointed at by
`app/llms.txt` (for AI answer engines).

---

## 1. District pillars (6) — the deep district guides

Hand-crafted, own their district, excluded from the programmatic `/bali` hubs.

- **/canggu** — Surf mornings, café work, sunset beach clubs
  - /canggu/best-restaurants · /canggu/work-friendly-cafes · /canggu/best-spas · /canggu/beach-clubs-sunset
- **/uluwatu** — Cliff-edge sunsets, surf, dinners with a view
  - /uluwatu/best-restaurants · /uluwatu/best-brunch · /uluwatu/beach-clubs-sunset · /uluwatu/date-night-restaurants · /uluwatu/48-hours
- **/ubud** — Jungle mornings, rice-terrace calm, slow dinners
  - /ubud/best-restaurants · /ubud/best-cafes-coffee · /ubud/best-yoga-wellness
- **/sanur** — A calm, walkable, sunrise base
  - /sanur/best-hotels · /sanur/things-to-do · /sanur/best-restaurants · /sanur/cafes-and-bars · /sanur/spas-wellness
- **/seminyak** — Dining, sunset beach clubs, Bali's densest spa scene
  - /seminyak/best-restaurants · /seminyak/beach-clubs-sunset · /seminyak/cafes-coffee · /seminyak/spas-salons-wellness
- **/nusa-dua** — Calm resort beaches, fine dining, big resort spas
  - /nusa-dua/best-restaurants · /nusa-dua/spas-wellness

**23 child guides total.**

## 2. Trip scenarios (4) — landing pages by trip situation

Static `ContentPage`-style routes that funnel into a filtered `/places` brief.

- /first-time-in-bali · /bali-for-a-month · /romantic-bali · /bali-retreat-reset

## 3. Long-form guides (14) — top-of-funnel SEO/AEO articles

Written to `docs/content-style.md`. Each carries Article + BreadcrumbList +
FAQPage JSON-LD (+ ItemList on the venue-list pages), self-canonical, in the
sitemap. New this session.

**Reference (1):** /where-to-stay-in-bali

**Planning (5):** /how-many-days-in-bali · /bali-itinerary-7-days ·
/bali-itinerary-10-days · /best-time-to-visit-bali · /how-to-get-around-bali

**Comparisons & audience (6):** /best-area-to-stay-in-bali-for-couples ·
/best-area-to-stay-in-bali-for-families · /canggu-vs-uluwatu ·
/seminyak-vs-canggu · /bali-on-a-budget · /bali-for-digital-nomads

**Island-wide lists (2, data-driven):** /best-beach-clubs-in-bali ·
/best-coffee-in-bali

## 4. Venue pages — `/places/[slug]`

One page per venue. A page is `index,follow` (and enters the sitemap) only when
the venue passes the decision-ready bar (why-it's-here + best-for + price/order);
Uluwatu is gated by the evidence registry instead. Thin/unverified rows stay
noindex.

Decision-ready / indexable by district (2026-07-13):

| District | Indexable venue pages |
|---|---|
| Canggu | 85 |
| Ubud | 55 |
| Seminyak | 51 |
| Sanur | 29 |
| Uluwatu & Bukit | 24 (registry) |
| Nusa Dua | 23 |
| Jimbaran | 16 |
| **Total** | **~283** |

## 5. Programmatic hubs & spokes — `/bali/*`

The lightweight ranking layer for districts **without** a hand-crafted pillar
(e.g. Jimbaran). `/bali` index → `/bali/[district]` hubs → `/bali/[district]/[intent]`
spokes ("best {intent} in {district}"). Generated from venue data, gated by
density (hub ≥ 8 venues, spoke ≥ 4). Pillared districts are excluded so the two
layers don't compete.

## 6. Tool surfaces (not primarily SEO)

- **/plan** — the Canggu day builder (the working tool).
- **/places** — the Bali-wide catalogue with filters; district-filtered views
  canonicalize onto the matching hub so they don't compete for ranking.
- **/route/[slug]** — curated routes (BreadcrumbList + ItemList JSON-LD).

## 7. How it all links (the mesh that builds authority)

- Guides → up to the district pillars and across to sibling guides/scenarios.
- Pillars → their child guides and their top venue pages.
- Child guides → their venue pages and back up to the pillar.
- Island-wide lists (beach clubs, coffee) → venue pages across every district.
- Scenarios → a filtered `/places` brief.
- Homepage + `/bali` index → the pillars.

## What's intentionally NOT built (to avoid duplicate/competing pages)

Top-30 topics already covered elsewhere were deliberately skipped: per-district
"best restaurants / cafés / spas" (pillar children), "yoga in Ubud"
(/ubud/best-yoga-wellness), "first time in Bali" and "romantic Bali"
(scenarios), and a 4-way district comparison (covered by /where-to-stay-in-bali).

## Where the counts come from
- Pillars/children: `lib/pillars.ts`
- Scenarios: `lib/scenarios.ts`
- Guides: `lib/guides.ts`
- Venue indexability: `lib/publication.ts` (`isVenueIndexable`) over Supabase `venues`
- Everything indexable is enumerated in `app/sitemap.ts`.
