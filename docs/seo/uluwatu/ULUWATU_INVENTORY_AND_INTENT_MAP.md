# Uluwatu inventory and intent map

Checked: 2026-07-23 WITA

## Existing public routes

| URL | Current role | Canonical/registry observation |
|---|---|---|
| `/uluwatu` | district pillar | canonical district owner; sitemap via `lib/pillars.ts` |
| `/uluwatu/best-restaurants` | broad dining comparison | existing canonical child |
| `/uluwatu/best-brunch` | brunch and coffee | existing canonical child |
| `/uluwatu/beach-clubs-sunset` | district beach-club sunset choice | intent-registry owner; competes only if scope leaks into Bali-wide sunset |
| `/uluwatu/date-night-restaurants` | date-night dining | narrower occasion child |
| `/uluwatu/48-hours` | two-day itinerary | owns 48-hour planning intent |
| `/uluwatu/resort-pool-day-passes` | resort pool/day-pass comparison | route exists but operational claims are not evidence-ready |
| `/uluwatu-sunset-kecak` | temple/Kecak sunset activity | preserve as activity intent; not district owner |
| `/canggu-vs-uluwatu` | cross-area comparison | comparison only |
| `/where-to-watch-sunset-in-bali` | Bali-wide sunset comparison | links down; must not duplicate district list |
| `/best-beach-clubs-in-bali` | Bali-wide beach-club comparison | island-level owner |

All inspected Uluwatu pages use static Next.js metadata and Server Component HTML. Breadcrumbs point to `/uluwatu`. `app/sitemap.ts` emits pillar children from `lib/pillars.ts`; the pool-pass route is emitted through the resort-F&B registry. The original homepage area card incorrectly linked to `/uluwatu-sunset-kecak`; the P0 implementation corrects it to `/uluwatu`.

## Live qualitative intent map

| Query cluster | User job | Observed result type | Repository owner / disposition |
|---|---|---|---|
| Uluwatu guide / things to do | understand the area and plan | destination guides, neighbourhood tables, FAQs | `/uluwatu` — update |
| where to stay / best area | choose a micro-area | area comparisons and hotel guides | HOLD standalone until differentiated evidence; merge overview into pillar |
| beaches / swimming / access | choose a beach by conditions | listicles, maps, community discussions | HOLD: field/Maps/safety gaps |
| surf / beginner surf | choose break or instruction | specialist surf pages | HOLD: condition-dependent safety and field evidence |
| temple / Kecak | plan the cultural visit | exact-match guides and FAQs | `/uluwatu-sunset-kecak` — P1 update; operational facts HOLD |
| getting around / without scooter | choose transport | practical guides and community discussions | HOLD standalone; safe planning caveat may live on pillar |
| beach clubs / sunset / nightlife | choose venue and atmosphere | commercial roundups and venue pages | `/uluwatu/beach-clubs-sunset` — update after volatile refresh |
| restaurants | choose where to eat | large roundups and venue pages | `/uluwatu/best-restaurants` — update after claim refresh |
| family / accessibility | test suitability | family guides and discussions | MERGE into relevant pages; strong claims HOLD |
| 1–3 day itinerary | sequence the district | editorial itineraries | `/uluwatu/48-hours` — existing owner |
| wellness / coworking | plan a longer stay | venue lists and nomad guides | HOLD pending demand and field evidence |

## Cannibalization boundaries

- Pillar owns area selection, scope and navigation.
- Best restaurants owns broad dining selection; date night owns a two-person occasion.
- Bali-wide sunset and beach-club pages compare areas; the Uluwatu child compares venues within the district.
- Temple/Kecak activity remains separate from commercial sunset venues.
- Public `uluwatu` and internal `uluwatu-bukit` are aliases, not two district identities.

Evidence labels: repository observations are `EXTRACTED`; query clustering and gaps are `INTERPRETED`; exact rank and search volume are `UNVERIFIED` and must not be claimed.
