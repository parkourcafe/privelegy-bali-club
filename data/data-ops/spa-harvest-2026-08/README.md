# Bali Massage & Spa harvest + menu snapshots — 2026-08-25

Collected with Firecrawl from each venue's **own website** (never an aggregator,
never review platforms — guardrail #2). Every row carries its `source_url`.

## Yoga / fitness / beauty prices (2026-08-25 evening)

**`ALL_own_yoga_fitness_beauty.sql`** — 36 price/schedule snapshots attached
to venues **already published on the site** (yoga classes, gym memberships,
salon prices). No new venue records here — every target venue_slug already
existed, so there was no domain-matching or district-mapping step, just a
price list attached to a known page. Same idempotent apply, dry-run already
done as a single row with rollback.

Of 132 candidate venues (yoga/fitness/beauty with a website and no menu yet),
17 were dropped because the scraped page's own venue name didn't match the
target (a shared-domain mix-up, or in one case a hijacked gym domain now
redirecting to an unrelated gambling site — the model's own relevance check
caught it before any data reached this file), 69 had fewer than 3 priced
items to publish, and 1 had every item at an identical price (a package total
misread as a per-item price, same class of bug as the spa harvest).

## Wave 2 (2026-08-25 afternoon) — apply these first if you have not yet

Wave 1 below (`new_venue_cards.sql`, `ALL_spa.sql`, `food_*.sql`) was already
applied. This second harvest expanded sub-area discovery in Ubud, Seminyak,
Uluwatu and Nusa Dua, plus a name-targeted search seeded from TripAdvisor's
directory listing for Nusa Dua (names only — no ratings collected or stored,
per guardrail #2; each name was then searched for its own official site).

**`new_venue_cards_wave2.sql`** — 311 new venue records.
**`ALL_spa_wave2.sql`** — 153 spa price lists onto existing venue pages.

Same idempotency and application order as wave 1: cards first, then prices.
Both were dry-run against production as a single row with `rollback` before
this file was written.

By district, added on top of wave 1 (see `bali_spa_harvest_report.md` for the
full merged base): Ubud +76, Canggu +47, the Bukit +41, Seminyak +32, Nusa Dua
+31, Legian +22, Sanur +14, Jimbaran +11, east Bali +10. Ubud now clears 100+
combined with what was already live; Nusa Dua reaches the low 50s — short of
the 100 target, and not a budget problem: Nusa Dua is a resort enclave of
roughly 25-30 hotel spas plus a few dozen independent salons, many without
their own website, which this method cannot source without inventing facts.

### Three bugs found and fixed while building this batch

1. **Wrong page won when a domain hosted more than one business.** The
   builder picked between a domain's scraped pages by item count, not
   relevance — a 124-item sushi menu at `111resorts.com` outranked the
   32-item spa menu on the same site, and the card was about to publish
   under the restaurant's name. Fixed: the page the model itself flagged as
   a spa/wellness page always wins, regardless of item count.
2. **A page's own location was overridden by the search query's target.**
   When a venue's scraped area didn't match a Bali district (a Westin
   actually in San Diego, two real massage studios actually in Phuket), the
   old code fell back to the *discovery* area — the place the search was
   *aimed at* — and nearly published them under `jimbaran` and `sidemen`.
   Fixed: a venue's own stated area now has to either confirm Bali or reject
   the card; it no longer falls back to the search target.
3. **Two Houston, TX massage studios** matched a keyword-only search
   ("massage Kedewatan price list") and nearly published as Ubud venues.
   Added a US-address guard.

## How to apply wave 1 — ORDER MATTERS

Run in the Supabase SQL editor, **in this order**. Each file is idempotent: a
re-run inserts nothing, because every statement is guarded on "this row does
not already exist".

### 1. `new_venue_cards.sql` — 257 new spa/wellness venue records

**This must run first.** Of the 139 spa price lists in step 2, only 32 belong
to venues already on the site; the other 107 attach to venues this file
creates. Run it second and those 107 silently insert nothing.

### 2. `ALL_spa.sql` — 124 spa price lists

Attaches each list to its venue, matched by website domain **and category**, so
a hotel domain shared by a restaurant, a spa and a gym resolves to the spa.

**A venue may hold only one public menu.** `menus_one_public_per_venue_idx` is
unique on `venue_slug` where status is `source_snapshot` or `published` — the
kind is irrelevant. A venue that already carries a food menu therefore cannot
also carry a spa list, so the guard skips it. Of the 124 statements, 105 insert,
18 are skipped for that reason and 1 has no matching venue.

15 collected lists are deliberately not here — a wrong price is worse than no
price:

| Dropped | Why |
|---|---|
| 6 | source URL is `http://`, and this run could not confirm the site serves `https`. Rewriting the scheme would assert unverified evidence. |
| 5 | every item carried one identical price — a package total misread as per-item prices (Andre Bali Spa: manicure, facial and foot massage all at 850,000 IDR). |
| 3 | the "source" was a social app or document host (Lemon8 returned five identical "60 min massage" rows at different prices — someone's roundup of several spas). |
| 1 | captured from the site's Chinese page; the public product is English. |

### Already applied on 2026-08-25

`food_00.sql` … `food_09.sql` — 241 food menus, 6 495 items. Kept for the
record; re-running them is harmless but pointless.

### Two production rules these files work around

`validate_source_snapshot_transition()` (in no migration in this repo) refuses
`status = 'source_snapshot'` unless the menu already has sections **and**
items, and refuses any item carrying dietary tags, allergen tags,
`partner_recommended`, `editorial_pick` or an editorial note. A data-modifying
CTE cannot see its own inserts, so each file inserts the menu as `draft`, adds
sections and items, then promotes every draft it created in a final `update`,
scoped by `created_at >= <run timestamp>` so it cannot touch a pre-existing
draft. `menus_source_snapshot_marker_check` also forbids
`source_snapshot_published_at` on a draft, which is why the marker is set only
in that promotion step.

`menus_venue_slug_version_key` is unique on `(venue_slug, version)` across all
kinds, so a venue that already has a food menu needs the next version for its
spa list — the files compute `max(version) + 1` rather than hardcoding 1.

## What the snapshots claim, and what they do not

- `completeness = 'partial'` — these are **highlights**, not a full verified
  menu. The UI labels them that way and links to the source.
- `verified_at` stays NULL: nobody has checked these against the venue yet.
  `captured_at` is the date the page was read.
- `expires_at` is 90 days out. A stale snapshot stops rendering by itself.

## Data files

These CSVs and the report are the **merged research base after wave 2**
(waves 1+2 combined, not wave 2 alone) — use them for coverage numbers, not
the wave-1 counts quoted above.

| File | What it is |
|---|---|
| `bali_spa_venues.csv` | 423 venues: identity, contacts, booking provider, flags |
| `bali_spa_services.csv` | 6 791 services with duration, price, `price_raw`, source |
| `bali_spa_sources.csv` | venue ↔ evidence URL |
| `bali_spa_review_queue.csv` | ambiguous records for a human |
| `bali_spa_excluded.csv` | candidates rejected, each with a reason |
| `marketplace_opportunity.csv` | venues: prices published, no online booking |
| `price_distribution.csv` | min / median / max per area for benchmark treatments |
| `booking_market_share.csv` | booking systems and digital maturity |
| `most_common_services.csv` | most frequent normalized service names |
| `bali_spa_harvest_report.md` | the full harvest report, incl. by-district rollup |

## Not collected, on purpose

No ratings and no review counts. Republishing review-derived data from Google,
TripAdvisor or a booking platform breaches guardrail #2 and the platforms'
terms. Venue pages link out to Google Maps instead, where the traveller reads
the reviews at their source.
