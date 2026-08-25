# Bali Massage & Spa harvest + menu snapshots — 2026-08-25

Collected with Firecrawl from each venue's **own website** (never an aggregator,
never review platforms — guardrail #2). Every row carries its `source_url`.

## How to apply — ORDER MATTERS

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
