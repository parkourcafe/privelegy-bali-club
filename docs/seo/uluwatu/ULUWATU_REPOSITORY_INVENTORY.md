# Uluwatu repository inventory — 2026-07-23

## [EXTRACTED] Existing public owners

| Canonical | Current role | Registry owner |
| --- | --- | --- |
| `/uluwatu` | Broad district pillar | none |
| `/uluwatu/best-restaurants` | Restaurant selection | none |
| `/uluwatu/best-brunch` | Brunch selection | none |
| `/uluwatu/beach-clubs-sunset` | Sunset beach-club selection | active |
| `/uluwatu/date-night-restaurants` | Occasion-specific restaurants | none |
| `/uluwatu/48-hours` | Ordered two-day itinerary | none |
| `/uluwatu/resort-pool-day-passes` | Resort pool access | none |
| `/uluwatu-sunset-kecak` | Temple/Kecak route | none |
| `/canggu-vs-uluwatu` | Bilateral area comparison | none |

`lib/pillars.ts` emits the pillar and five core children into `app/sitemap.ts`. The resort page is emitted through the resort-F&B registry. `app/uluwatu/layout.tsx` can return 404 for the whole subtree when required venue data is absent, despite stable sitemap entries.

## [INTERPRETED] Risks

- The pillar currently mixes base fit with food, sunset and itinerary intent.
- `/48-hours` and `/uluwatu-sunset-kecak` need explicit ordered-itinerary versus temple-route ownership.
- Restaurants and date night are parent versus occasion-specific owners.
- The layout-level venue gate is an indexability risk and needs a separate architecture fix; it is not changed by this district content task.

## [UNVERIFIED]

Current GSC query-to-page performance and production DB completeness were unavailable.
