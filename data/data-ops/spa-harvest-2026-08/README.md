# Bali Massage & Spa harvest + menu snapshots — 2026-08-25

Collected with Firecrawl from each venue's **own website** (never an aggregator,
never review platforms — guardrail #2). Every row carries its `source_url`.

## How to apply

Run in the Supabase SQL editor, in this order. Each file is idempotent: a
re-run inserts nothing, because every statement is guarded on "this venue does
not already have a menu of this kind".

1. `food_00.sql` … `food_09.sql` — **241 food menus**, 6 495 items.
2. `spa_00.sql` … `spa_04.sql` — **108 spa price lists** onto venues we already
   publish, matched by website domain.
3. `new_venue_cards.sql` — **198 new spa/wellness venue records**.

### Why each menu is inserted as a draft first

`validate_source_snapshot_transition()` (production trigger, in no migration in
this repo) refuses `status = 'source_snapshot'` unless the menu already has
sections **and** items, and refuses any item carrying dietary tags, allergen
tags, `partner_recommended`, `editorial_pick` or an editorial note. A
data-modifying CTE cannot see its own inserts, so each file inserts the menu as
`draft`, adds sections and items, then promotes every draft it created in a
final `update`. That promotion is scoped by `created_at >= <run timestamp>`, so
it cannot touch a pre-existing draft.

`menus_source_snapshot_marker_check` also forbids `source_snapshot_published_at`
on a draft, which is why the marker is set only in the promotion step.

## What the snapshots claim, and what they do not

- `completeness = 'partial'` — these are **highlights**, not a full verified
  menu. The UI labels them that way and links to the source.
- `verified_at` stays NULL: nobody has checked these against the venue yet.
  `captured_at` is the date the page was read.
- `expires_at` is 90 days out. A stale snapshot stops rendering by itself.

## Data files

| File | What it is |
|---|---|
| `bali_spa_venues.csv` | 250 venues: identity, contacts, booking provider, flags |
| `bali_spa_services.csv` | 4 032 services with duration, price, `price_raw`, source |
| `bali_spa_sources.csv` | venue ↔ evidence URL |
| `bali_spa_review_queue.csv` | 27 ambiguous records for a human |
| `bali_spa_excluded.csv` | 171 candidates rejected, each with a reason |
| `marketplace_opportunity.csv` | 27 venues: prices published, no online booking |
| `price_distribution.csv` | min / median / max per area for benchmark treatments |
| `booking_market_share.csv` | booking systems and digital maturity |
| `bali_spa_harvest_report.md` | the full harvest report |

## Not collected, on purpose

No ratings and no review counts. Republishing review-derived data from Google,
TripAdvisor or a booking platform breaches guardrail #2 and the platforms'
terms. Venue pages link out to Google Maps instead, where the traveller reads
the reviews at their source.
