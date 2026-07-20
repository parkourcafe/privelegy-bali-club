# OTHER BALI — RESORT F&B PAGE LIBRARY (resort day passes · hotel brunches · sunset · free beach clubs)
**Built 19 Jul 2026 · 20 self-contained HTML hub pages · all from `OTHER_BALI_RESORT_FNB_MASTER.csv` (235 rows) · 60 JSON-LD blocks, all valid · every internal link resolves.**

Every page is one self-contained `.html` file (inline CSS, light/dark via `prefers-color-scheme`), with an answer-first intro block (for AEO / ChatGPT citation), a priced comparison table, an FAQ, and three JSON-LD blocks (BreadcrumbList + Article + ItemList). **Schema `Offer.price` is emitted only for `[OFFICIAL]`/hotel-direct rows** — a missing price beats a wrong one. File names are prefixed `template_` because they double as the clone source for a dev; drop the prefix when publishing.

## WHAT TO DO WITH THESE 20 FILES (start here)
These are **finished web pages** — not drafts. Each `.html` file is one page of otherbali.com, and its filename already matches the URL it should live at (e.g. `sanur-hotel-brunches.html` → `otherbali.com/sanur/hotel-brunches`). Three ways to use them, cheapest-effort first:

1. **Hand them to whoever runs the website.** The normal path. Give the dev this zip and say: "publish each file at the URL in `00_INDEX.md`." They paste the content into the CMS (WordPress, Webflow, Framer — whatever the site runs on) or drop the files straight in. Tables, prices, FAQ and Google/AI markup are already inside each file — nothing to rebuild.
2. **Preview them yourself first.** Double-click any `.html` file — it opens in your browser and looks exactly as it will on the site (works offline; light/dark auto). Read them and tweak wording before the dev touches anything.
3. **Publish as-is for a fast test.** Each file is fully self-contained, so they can go live on any static host (Netlify, Vercel, Cloudflare Pages) in minutes if you want to test the SEO before the main-site integration.

**One thing must happen before they go public:** the contractor verification pass below (some prices still say `verify`/`[NO DATA]`). Publishing a made-up price is the one real risk — everything else is ready.

## HOW IT MAPS TO THE MONEY MODEL
- **COVERAGE pages** = day passes + island pillars. These are the SEO/AEO traffic magnets. We list them for reach, we take **no cut** — the "no paid placement" line is on every page.
- **SEATED pages** = hotel brunches + sunset clubs + resort restaurants. These are where the money model applies (fixed fee per confirmed seated reservation via the booking rail). Brunch and sunset are the seated productization of this dataset.

## THE LIBRARY (20 pages)

### Island pillars (4) — top of funnel
| Page | URL | Layer |
|---|---|---|
| Bali resort day passes (all districts) | `/bali-resort-day-passes` | COVERAGE |
| Bali hotel Sunday brunches (all districts) | `/bali-hotel-brunches` | SEATED |
| Bali sunset clubs (all districts) | `/bali-sunset-clubs` | SEATED |
| Free beach clubs in Bali (all districts) | `/bali-free-beach-clubs` | COVERAGE |

### Day-pass district hubs (7/7 — COMPLETE) — COVERAGE
| District | URL | Passes | From (adult) |
|---|---|---:|---|
| Nusa Dua | `/nusa-dua/resort-day-passes` | 9 | IDR 150,000 |
| Ubud | `/ubud/jungle-pool-day-passes` | 10 | IDR 150,000 |
| Sanur | `/sanur/resort-day-passes` *(exemplar)* | 6 | IDR 150,000 |
| Jimbaran | `/jimbaran/resort-day-passes` | 6 | IDR 211,750 |
| Seminyak | `/seminyak/beach-club-day-passes` | 5 | IDR 250,000 |
| Uluwatu | `/uluwatu/resort-pool-day-passes` | 6 | IDR 300,000 |
| Canggu | `/canggu/beach-club-day-passes` | 4 | IDR 175,000 |

### Hotel-brunch district hubs (5 — every district with brunch inventory) — SEATED
| District | URL | Brunches | From (adult) |
|---|---|---:|---|
| Nusa Dua | `/nusa-dua/hotel-brunches` *(exemplar)* | 7 | IDR 650,000 |
| Sanur | `/sanur/hotel-brunches` | 5 | IDR 490,000 |
| Ubud | `/ubud/hotel-brunches` | 4 | IDR 400,000 |
| Seminyak | `/seminyak/hotel-brunches` | 4 | IDR 650,000 |
| Jimbaran | `/jimbaran/hotel-brunches` | 3 | IDR 650,000 |

### Sunset district hubs (4 — every sunset-facing district) — SEATED
| District | URL |
|---|---|
| Uluwatu | `/uluwatu/cliff-clubs-sunset` *(exemplar)* |
| Jimbaran | `/jimbaran/sunset-seafood` |
| Seminyak | `/seminyak/sunset-beach-clubs` |
| Canggu | `/canggu/sunset-beach-clubs` |

*(Sanur has no sunset hub by design — it faces sunrise; that honesty note is baked into the sunset pages.)*

## COVERAGE LOGIC — WHY THESE DISTRICTS, NOT OTHERS
- **Day passes: 7/7 districts** — every district has resort pools worth a hub.
- **Brunches: 5 districts** — Uluwatu (0 hotel brunches in data) and Canggu (only COMO Uma) don't yet have enough seated brunch inventory for a standalone hub; roll them up under the island pillar until inventory grows.
- **Sunset: 4 districts** — the west/south-west coast (Uluwatu, Jimbaran, Seminyak, Canggu). Nusa Dua/Sanur/Ubud aren't sunset markets.

## LIBRARY IS CLOSED — no planned pages left
`/bali-free-beach-clubs` (the free-entry beach clubs: Kempinski Reef, Segara Byrd House, Potato Head, FINNS, Single Fin, WooBar…) is now built. Every internal hub link inside the library resolves.

## BEFORE PUBLISHING (what "the contractor closes it" means, in plain terms)
The pages are ready to publish *structurally* — but some cells still say `[NO DATA]`, `verify`, or `reported` because a price couldn't be confirmed at the source yet. "Contractor closes it" = one person spends a day doing four concrete things:

1. **Fill the blanks.** For every `[NO DATA]` / `verify` / `reported` cell, call or WhatsApp the venue (or open its own site) and get the real current price. Priority: à-la-carte restaurant prices and any day pass hidden behind a Klook "load price" wall. Type the confirmed number into the CSV, drop the tag.
2. **Re-check the direct-only list.** Confirm Sanur (all) and Ayodya / Merusaka / Nusa Dua Beach Hotel / Hilton in Nusa Dua still sell *only* direct — that "book direct, not Klook" line is the whole reason our page beats an aggregator.
3. **Verify every `official` price before it becomes a schema price.** A price in `Offer.price` is a promise to Google. If it can't be re-confirmed, delete the schema price (leave the visible text) — a missing price never gets us penalised; a wrong one does.
4. **Swap the placeholder links.** Every `/places/…` link is a stub — point it at the real venue page or booking-rail URL.

None of this needs a strategist — it's phone-and-keyboard verification work. When it's done, publish.
