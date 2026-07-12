# Other Bali — SEO + AEO strategy (multi-district)

Grounded in real Supabase data (2026-07-12). Method: topical-authority
hub-and-spoke + programmatic pages from our own venue data + AEO for AI answer
engines. **No invented search volumes** — priority is derived from our real
venue density (where we can actually build strong pages) and known Bali
tourist query shapes; replace the heuristic with Google Search Console demand
once Windsor.ai is authorized.

## The core problem

Districts today exist only as query params (`/places?district=X`). Google
collapses/ignores filter params — we have nothing to rank for "best brunch in
Canggu". Fix: a crawlable, server-rendered URL tree with unique content per
district and per intent, plus structured data.

## 0. Data prerequisites (blockers — do first)

1. **Normalize `jobs` slugs.** They are stored in BOTH `snake_case` and
   `kebab-case` for the same job (`date_night_special` AND
   `date-night-special`). This splits pages/filters. Pick one canonical form
   (recommend snake, matches earlier migrations) and migrate. One-off data
   migration, founder-applied.
2. **Backfill `jobs` for Canggu (98 venues) and Ubud (27) — both have ZERO.**
   These are our two highest-value districts (deep district + next-deep). Their
   hub pages ship without jobs, but intent spokes — the long-tail engine —
   can't generate until tagged.
3. Confirm `area` coverage per venue (sub-area drives finer long-tail:
   "brunch Batu Bolong", "Berawa cafes").

## 1. Keyword / topical-authority map

Hub-and-spoke per district. **Hub** = `/bali/[district]` (broad head term,
e.g. "where to eat in Canggu"). **Spokes** = `/bali/[district]/[intent]` and
top `/bali/[district]/[category]` (long-tail, higher intent). Every spoke
links up to its hub and laterally to siblings + the same intent in
neighbouring districts.

### Intent taxonomy (from `jobs`, normalized) → target query shapes
| Canonical intent | URL slug | Query shapes (real long-tail) | Venues (merged) |
|---|---|---|---|
| Brunch / breakfast | `brunch` | best brunch in {area}, {area} breakfast, brunch after surf {area} | ~15 |
| Date night | `date-night` | romantic dinner {area}, date night {area} | ~38 |
| Sunset drinks/dinner | `sunset` | sunset dinner {area}, best sunset spot {area}, sunset drinks {area} | ~23 |
| Family dinner | `family` | family restaurants {area}, kid-friendly restaurants {area} | ~26 |
| Group / sharing | `groups` | group dinner {area}, best places for a group {area} | ~32 |
| Special occasion | `special-occasion` | fine dining {area}, special occasion restaurant {area} | ~28 |
| Work-friendly café | `work-cafe` | work-friendly cafes {area}, wifi cafe {area}, digital nomad cafe {area} | ~12 |
| Local food / warung | `local-food` | best warung {area}, local food {area}, cheap eats {area} | ~11 |

(`just-landed-easy-dinner` deprioritized — weak query.)

### Category facets (from `category`) → also high Bali volume
`cafes` ("best cafes Canggu"), `beach-clubs` ("Canggu beach clubs",
"Seminyak beach clubs"), `restaurants`, `warungs`, `bars`, `spas`, `surf`.
Ship categories as a second spoke type **after** intents, only where density
warrants (avoid thin pages: min ~4 venues to publish a spoke).

### District hub priority (real venue density)
| District | Venues | Jobs tagged | Tier |
|---|---|---|---|
| Canggu | 98 | 0 ⚠️ | Hub now, spokes after backfill |
| Seminyak | 56 | 22 | **Tier 1 — hub + spokes now** |
| Sanur | 54 | 6 | Hub now, spokes need more tags |
| Uluwatu & Bukit | 36 | 25 | **Tier 1 — hub + spokes now** |
| Jimbaran | 29 | 16 | **Tier 1 — hub + spokes now** |
| Nusa Dua | 28 | 13 | Tier 1 — hub + spokes now |
| Ubud | 27 | 0 ⚠️ | Hub now, spokes after backfill |
| kuta-legian, sidemen, amed, munduk, lovina, nusa-islands, gili-islands, lombok | ~1 each | — | Thin — keep as planning cards only until density grows (don't publish thin hubs) |

Publishing gate: **hub needs ≥ ~8 venues; a spoke needs ≥ ~4.** Below that it's
a thin page that drags topical authority — leave it as a planning card.

## 2. URL architecture + internal linking

```
/                         cinematic landing (funnel)
/bali/[district]          HUB — "Where to eat & go in {District}"
/bali/[district]/[intent] SPOKE — "Best {intent} in {District}"
/bali/[district]/[category] SPOKE (phase 3) — "Best {category} in {District}"
/place/[slug]             venue page (phase 3) — Restaurant schema
/plan  /places  /route/*  existing tool surfaces (kept)
```

Linking mesh (this is what builds authority):
- **Hub → all its spokes** (intent + category grid) and → its top venues.
- **Spoke → hub** (breadcrumb + "More in {District}") and → sibling intents.
- **Lateral cluster:** each intent spoke links the same intent in the 2–3
  nearest districts ("Prefer Seminyak? Best brunch in Seminyak").
- **Homepage "Around Bali" section → hubs** (`/bali/X`, not the query param).
- **Canonicalize** `/places?district=X…` → the matching hub/spoke, so the tool
  doesn't dilute the ranking page.
- Breadcrumbs everywhere: Home › Bali › {District} › {Intent}.

Duplicate-content guard (15 structurally similar pages): unique editorial
intro per page (the founder's briefs), different venue sets, district-specific
FAQ. Uniqueness comes naturally from the intent × district matrix.

## 3. On-page templates

**Hub `/bali/canggu`**
- `<title>`: "Where to Eat & Go in Canggu — Other Bali"; meta desc from intro.
- H1 + 100–150w real editorial intro (brief). Answer-first opening sentence.
- Grid: sections by intent & category, 3–6 venues each (name, area, vibe,
  price_anchor, what_to_order). Links to every spoke.
- FAQ (3–4 Q) → FAQPage JSON-LD. Breadcrumb JSON-LD. ItemList JSON-LD.
- Unique OG image (Higgsfield, per district). Self-canonical.

**Spoke `/bali/canggu/brunch`**
- `<title>`: "Best Brunch in Canggu — Other Bali". H1 matches.
- Answer-first intro ("Brunch in Canggu clusters around Batu Bolong and
  Berawa — here are 8, with what to order and prices."), then editorial.
- Ranked venue list: `why_its_here` as the pick rationale, `what_to_order`,
  `price_anchor`, `best_for`/`not_for`, `area`, vibe tags, actions (reserve/
  directions/offer — reuse VenueCard `actionMode="full"`).
- Up-link to hub + sibling intents + same intent in nearest districts.
- JSON-LD: ItemList→ListItem→Restaurant, BreadcrumbList, FAQPage. Self-canonical.

**Venue `/place/[slug]` (phase 3)**
- Restaurant JSON-LD (name, address, servesCuisine, `priceRange` from
  price_anchor, url, sameAs gmaps). what_to_order, reserve CTA, map.

Tech (all Next.js, no plugin): `generateStaticParams` from Supabase for all
valid district/intent combos (respect the publishing gate), `generateMetadata`
per route, ISR revalidate, sitemap enumerates every published hub/spoke,
robots already allows `/`.

## 4. AEO (rank in ChatGPT / Perplexity / Google AI Overviews)

Half of "where to eat in {area}" now resolves in AI answers. Same content
work, tuned to be machine-extractable:
- **Answer-first, quotable opening** on every page (AI engines lift the first
  direct sentence). Specific, factual, no hype.
- **Consistent structured attributes** per venue (name · area · what to order ·
  price · best-for) — extractable lists beat prose.
- **FAQPage schema** with natural-language Q&A that mirrors real questions
  ("Is Canggu good for families?", "Where's the best sunset in Uluwatu?").
- **Entity consistency**: same venue/area/district naming everywhere + JSON-LD
  → clean knowledge-graph signal. Our normalized data does this.
- **Server-rendered** (we already SSR) so AI fetchers see full content, not an
  empty JS shell. Add `llms.txt` pointing at the hub index.
- Our anti-hype, real-price-anchor editorial is a genuine AEO advantage:
  specific verifiable facts are exactly what answer engines prefer to cite.
- Google AI Overviews draw from top organic + schema → the technical SEO above
  serves AEO directly; no separate build.

## 5. Prioritized rollout

**Phase 0 (data, founder):** normalize `jobs`; backfill Canggu + Ubud jobs;
verify `area`.

**Phase 1 (ship immediately — no jobs needed):** 7 district **hub** pages
(all districts ≥ 8 venues), `generateMetadata` + canonical + ItemList/
Breadcrumb JSON-LD, sitemap enumerates hubs, homepage "Around Bali" →
`/bali/X`, canonicalize `/places?district=` → hub. This alone opens
island-wide head-term ranking.

**Phase 2 (intent spokes where tagged now):** Seminyak, Uluwatu, Jimbaran,
Nusa Dua — the long-tail engine, ~4–6 spokes each.

**Phase 2.5 (after Canggu/Ubud backfill):** their intent spokes — highest
value (deepest districts, most venues, and where money lives).

**Phase 3:** category spokes (`cafes`, `beach-clubs`), venue pages
`/place/[slug]` with Restaurant schema, FAQPage everywhere, `llms.txt`.

**Measurement loop (once Windsor.ai/GSC is on):** track impressions/clicks/
position per `/bali/*`; optimize "striking distance" (pos 5–15) pages; mine
GSC query variants into new spokes; kill/merge thin pages.

## What needs the founder
- Apply the two data migrations (jobs normalize + Canggu/Ubud backfill).
- Authorize **Windsor.ai** connector (claude.ai settings) to unlock Google
  Search Console — turns the density-heuristic priority above into real-demand
  priority.
- Editorial briefs (the "Best brunch in Seminyak/Canggu" ones already in
  progress) become the per-page intros.
