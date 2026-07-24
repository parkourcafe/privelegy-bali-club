# Other Bali Wave 3 Discovery — 2026-07-22

Scope: T8 Canggu Now, T10 Plan navigation and missing content, Chope-607 staged-candidates pipeline.

## Sources checked

| Source | Evidence | Status |
|---|---|---|
| Repository operating rules | `AGENTS.md`; `Other_Bali_Master_Architecture.md` | confirmed |
| Audit correction addendum | `/Users/msnigmatullaeva/Downloads/OTHERBALI_FABLE_AUDIT_CORRECTIONS_V1.1.md` | confirmed external input |
| Chope product audit | `/Users/msnigmatullaeva/Downloads/CHOPE_TO_OTHER_BALI_PRODUCT_AUDIT_2026-07-21.md` | confirmed external input |
| Chope insert draft | `/Users/msnigmatullaeva/Downloads/insert_chope_candidates.sql` | confirmed external input; not applied |
| Current Canggu hub | `app/canggu/page.tsx` | confirmed |
| Navigation registry | `lib/navigation.ts`, `components/GlobalHeader.tsx`, `components/MobileNav.tsx`, `lib/navigation.test.ts` | confirmed |
| Route engine | `app/route/[slug]/page.tsx`, `lib/data.ts`, `lib/seed.ts`, `supabase/migrations/0007_routes.sql`, `0048_ubud_culture_day_route.sql`, `0049_bangli_karangasem_excursion_routes.sql` | confirmed |
| Staged-candidates precedent | `data/data-ops/kora-leads/README.md`, `scripts/data-ops-compiler-core.mjs`, `scripts/data-ops-import-core.mjs` | confirmed |

## T8 — Canggu Now

| Statement | Repository evidence | Status | Required action |
|---|---|---|---|
| `/canggu` exists and is an editorial district hub | `app/canggu/page.tsx` | confirmed | preserve existing page structure |
| Existing `/canggu` has no scenario-first "What do you want to do in Canggu now?" entry | `app/canggu/page.tsx` contains hero, shortlist, top-picks, guide sections; no T8 scenario entry | confirmed gap | add compact scenario block |
| "Open now" must not be shown without verified structured hours | `AGENTS.md`; audit correction 6 | confirmed rule | use "Fits this moment" only |
| Canggu moment matching can use editorial tags, category and existing guides/routes | `Venue` fields in `lib/types.ts`; `lib/data.ts` route fallback uses jobs/vibe/practical tags | confirmed | avoid inferred hours or booking claims |

## T10 — Plan navigation and missing content

| Statement | Repository evidence | Status | Required action |
|---|---|---|---|
| Desktop header has a Plan Bali dropdown but no single-tap Plan action | `lib/navigation.ts` `NAV_GROUPS.plan`; `NAV_ACTIONS` only Explore/Saved | partially_confirmed gap | add `/plan` as persistent desktop action if tests allow |
| Mobile bottom nav already has Plan | `components/MobileNav.tsx` `TABS` includes Plan | confirmed implemented | preserve |
| Route engine already exists | `app/route/[slug]/page.tsx`; `routes`/`route_stops` migrations | confirmed implemented | extend existing route records only |
| Existing routes include first day, cafe/work, sunset, Ubud and excursions | `lib/seed.ts`; `supabase/migrations/0007`, `0048`, `0049` | confirmed | do not duplicate first-day/sunset route unless needed |
| Bali rainy day exists as an editorial guide | `lib/guides.ts` slug `bali-rainy-day`; `app/bali-rainy-day/page.tsx` | confirmed | no new Bali-wide rainy guide |
| Canggu without-scooter content exists only inside guide copy, not as a standalone Canggu page | `lib/guides.ts` contains a Canggu section; no `app/canggu-without-a-scooter/page.tsx` | confirmed gap | create standalone editorial page |
| Explicit Bali 3-day and 5-day itinerary routes are absent | no `app/bali-itinerary-3-days/page.tsx` or `app/bali-itinerary-5-days/page.tsx` | confirmed gap | create focused editorial pages |
| Canggu food route and Canggu rainy-day route are absent | route records only cover first-day/cafe-work/sunset-run in Canggu | confirmed gap | add route records through existing route engine |
| Route detail currently resolves stops from `getVenuesList()` only | `lib/data.ts:1189` | confirmed fragile area | use published venue catalogue for route resolution |

## Chope-607 staged pipeline

| Statement | Evidence | Status | Required action |
|---|---|---|---|
| KORA leads are staged outside compiler batches and explicitly forbidden to publish | `data/data-ops/kora-leads/README.md` | confirmed precedent | reuse staged-lead pattern |
| Existing data-ops importer has production guardrails | `scripts/data-ops-import-core.mjs` rejects known production ref for staging apply | confirmed | do not create a production importer |
| Full 607-row Chope source is not present in inspected repository files | repository search for Chope-607/source file found none | confirmed limitation | document missing source; build mapping/dry-run around available test sample |
| Downloads contain `insert_chope_candidates.sql` with 12 candidate inserts into `venues` | `/Users/msnigmatullaeva/Downloads/insert_chope_candidates.sql` | confirmed external input | do not apply directly; convert concept into staged mapping only |
| Chope candidates must not auto-publish | user brief; Chope audit; architecture guardrails | confirmed rule | every dry-run row remains draft/review and publication-blocked |

## Decisions for implementation

- Add T8 as a small Canggu hub module, not a redesign.
- Add a desktop `/plan` action because mobile already has Plan and desktop only has a dropdown.
- Add only missing T10 materials: explicit 3-day/5-day pages, Canggu without-scooter page, and missing Canggu food/rainy route records.
- Treat existing `/route/sunset-run` as the Canggu sunset route; do not create a duplicate sunset route.
- Prepare Chope mapping and a dry-run harness/report; do not run the downloaded SQL against production or local DB as a publication/import path.
