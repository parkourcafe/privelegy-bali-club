# Uluwatu wellness cluster decision v1 — 2026-09-02

Pipeline phase 4 for the wellness topic only. Does not amend
`ULUWATU_UNIFIED_CLUSTER_DECISION_V1.md` (2026-07-23); that document remains the
decision source for food, sunset, stay and itinerary, none of which are touched
here. Evidence: `ULUWATU_WELLNESS_INTENT_MAP_2026-09-02.md`.

## Decision

| Field | Value |
| --- | --- |
| Topic | Yoga & pilates studios in Uluwatu |
| Status | **P0_CREATE** |
| Canonical URL | `/uluwatu/yoga-pilates` |
| Primary intent | Choose an Uluwatu yoga or pilates studio to drop into |
| User decision | Which studio, at what drop-in price, on what timetable |
| Publication gate | **BLOCKED — evidence not closed.** See gates below. |

`P0` on demand and on competitive thinness: 400+ measured impressions on the
category tail, currently answered only by venue cards at positions 68–87, in a
niche where our own adjacent pages already reach 18–29.

`/uluwatu/yoga-wellness` was considered as the slug for symmetry with
`/ubud/best-yoga-wellness`. Rejected: "wellness" pulls in spa and massage, which
is a different user decision with its own query family, and one URL owns one
intent. Spa stays available as a separate later topic.

## Overlap and cannibalization

| Existing URL | Relationship | Action |
| --- | --- | --- |
| `/uluwatu` (pillar) | Parent; owns base-fit only | Add child link |
| `/ubud/best-yoga-wellness` | Different district | None |
| `/best-spas-in-bali` | Bali-wide spa, different subject | None |
| `/places/*` yoga & pilates cards | Currently absorbing the category query | Become spokes; the new page links down to them |

No existing URL owns this intent, so this is a create, not a merge. The venue
cards are not retired — they remain the entity layer and keep their own
navigational queries.

## Status of the other two wellness topics

| Topic | Status | Reason |
| --- | --- | --- |
| Day spas & massage in Uluwatu | **HOLD** | Demand is present (`spring spa uluwatu` 484 impressions, `karma spa uluwatu` 255) but it is navigational to named venues. No category-query evidence yet. |
| Gyms & drop-in fitness | **HOLD** | Same shape: `rite gym` 248, `bambu fitness` 265 are venue names. Revisit when a category tail appears. |

Both are HOLD, not REJECT. Neither blocks the P0 above.

## Gates before implementation

Implementation may not start until all four close. Phase 6 implements only
draft-ready pages.

1. **Venue evidence.** Drop-in price, class timetable and a verification date
   per studio, sourced per `otherbali-venue-record-standard` and accepted per
   `otherbali-data-ops-run`. Requires database access, which this session does
   not have. A page listing studios without prices repeats the failure it is
   meant to fix — the whole reason `/sanur/resort-day-passes` converts at
   position 6 is that it carries the numbers.
2. **Entity resolution.** `/places/reform-pilates-bali`,
   `/places/reform-uluwatu` and `/places/reform-pilates-bingin` all surface for
   the same two queries. Confirm whether these are three studios or duplicate
   records before any of them is listed. This is the same duplicate class the
   September audit flagged elsewhere (Hotel Indigo, Merah Putih, Sa'Mesa).
3. **Live SERP check.** Blocked in this environment by network policy. Needed to
   confirm the competing page type and that the tail is genuinely thin rather
   than dominated by a booking platform.
4. **Claim ledger.** Rows at `READY_FOR_CODEX_DRAFT` for every public number.

## Implementation shape, once unblocked

Follows `otherbali-guide-page-standard`. Uluwatu children are hand-authored
Server Components using `components/GuideBlocks` (`VenuePicks`,
`VenueItemListSchema`, `PlaceLink`, `FaqBlock`) — see
`app/uluwatu/best-restaurants/page.tsx`. Not the Ubud registry pattern.

Required: unique metadata, self-canonical `/uluwatu/yoga-pilates`, visible
breadcrumbs, one `BreadcrumbList` via `<Breadcrumbs>`, `ItemList` limited to
what renders, `FAQPage` only for visible content, a last-checked date derived
from real `last_verified_at` values, reciprocal links to `/uluwatu` and the
venue cards, and registration in `lib/pillars.ts` so the sitemap cannot drift.

## Measurement

Baseline recorded 2026-09-02: category tail at positions 46–63, zero clicks.
Target is the band the same template reaches in Jimbaran and Ubud, 16–18.
Re-measure at 4 and 8 weeks from publication, not sooner.
