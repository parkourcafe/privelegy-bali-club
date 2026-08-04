# Other Bali — Internal Intent OS Audit v1.0

Date: 2026-07-28
Scope: read-only repository, docs, schema/migration and local export review.
Production changes: **NONE**.

## STATUS

**PARTIAL / EVIDENCE-BOUNDED PASS.** The major product surfaces were inspected: governing architecture/Decision Log, `/plan`, `/my-day`, `/places` search/filter, collections, scenarios, routes, venue/detail schema mappings, save/add-to-trip/share flows, analytics taxonomy, sitemap/canonical/robots rules and SEO intent spokes. The audit does not claim live Supabase row verification because no usable live credentials were available. Data support is therefore code/schema-backed, with row-level support marked PARTIAL where a full current DB snapshot is absent.

## Governing conclusion

Other Bali has a real internal intent system, but it is split across several registries and engines rather than governed by one canonical intent registry:

1. `lib/intents.ts` — SEO spoke intents, stored in venue `jobs`.
2. `lib/moments.ts` — older/static Plan moment filters.
3. `lib/catalogue-moments.ts` — `/places` moment chips, token-haystack matching.
4. `lib/trip-missions.ts` — trip-level missions and durations.
5. `lib/scenarios.ts` — editorial scenario pages hand off to `/places`.
6. `lib/collections.ts` — taste/moment collections with publication gates.
7. `lib/day-builder.ts` — `/my-day` answers mapped to collection slots.

This creates confirmed duplicate/conflict candidates: `date-night`, `sunset/golden-hour`, work-friendly/work-session, family, local/calm and special-occasion are represented in more than one vocabulary.

## Internal intent inventory summary

| Intent family | Primary surfaces | Support | Status |
|---|---|---|---|
| Explore/search/filter catalogue | `/places`, `app/places/page.tsx`, `PlacesView.tsx` | PARTIAL | LIVE |
| Today decision / day builder | `/my-day`, `day-builder.ts`, collections | PARTIAL | LIVE |
| Future trip planning | `/plan`, routes, plan entries | PARTIAL | LIVE |
| Moment filtering | Plan moments + catalogue moments | PARTIAL | LIVE/PARTIAL |
| Trip missions/durations | `trip-missions.ts`, `/places?m=&dur=` | PARTIAL | PARTIAL |
| Taste/moment collections | `/collections`, `/collections/[taste]` | PARTIAL | LIVE with gate |
| Scenario editorial handoff | `scenarios.ts`, scenario routes | PARTIAL | LIVE/PARTIAL |
| Venue decision/detail | `/places/[slug]` | PARTIAL | LIVE |
| Save/share/add to trip | SaveButton, AddToTripButton, RPCs | PARTIAL | LIVE/PARTIAL |
| Partner add/claim/onboard | `/for-venues`, `/list-your-property`, partner routes | PARTIAL | LIVE |
| Redemption/offer proof | `/v/[venue]/redeem`, perk/RPC layer | PARTIAL | LIVE for gated deep layer |

## Required field-level conclusions

- Venue identity and publication fields are mapped at the DB boundary in `lib/data.ts`: `id`, `slug`, `name`, `category`, `district`, `address`, `gmaps_url`, `official_url`, `instagram_url`, `status`, `publication_status`, `photo_status`, `area`, `why_its_here`, `best_for`, `not_for`, `practical_tags`, `jobs`, `owner_note`, `wellness_categories`, `last_verified_at`.
- The product can support decision-first copy when `why_its_here` and `best_for` exist. `lib/start-shortlist.ts` explicitly filters for both.
- Moment/intent matching is not uniform: `lib/collections.ts` uses narrow factual fields/jobs; `/places` uses substring token matching over a broader haystack; Plan uses category fallback when jobs are missing.
- Save/add-to-trip/share have schema/RPC support but migration/revocation history means current production application of all later RPCs must remain unresolved without live DB verification.
- Analytics is consent-gated and uses an allowlisted event taxonomy. GA4 is disabled by default; internal `/api/event` is the intended system of record.
- SEO controls are mostly explicit and strong: filtered `/places` views are noindex/follow, district filtered views canonicalize to district hubs, collections publish only after a `10 venues / 3 districts` gate, venue sitemap inclusion uses `isVenueIndexable`, and operational surfaces are disallowed in robots.

## Evidence model

**EXTRACTED** = directly read from repository/docs/schema.
**INTERPRETED** = synthesis across sources.
**UNKNOWN** = requires live DB/runtime proof and is not guessed.

## Files created

- `docs/audits/OTHER_BALI_INTERNAL_INTENT_AUDIT_V1_0.md`
- `docs/audits/OTHER_BALI_INTERNAL_INTENT_INVENTORY_V1_0.csv`
- `docs/audits/OTHER_BALI_INTERNAL_INTENT_DUPLICATE_CONFLICT_REGISTER_V1_0.csv`
- `docs/audits/OTHER_BALI_DATA_SUPPORT_MATRIX_V1_0.csv`
- `docs/audits/OTHER_BALI_INTERNAL_AUDIT_GAPS_AND_OWNER_DECISIONS_V1_0.md`

## Files changed

No production code, routes, database, migrations, SEO pages or content files changed. Only the five read-only audit artifacts above were created.

## Sources reviewed

- `Other_Bali_Master_Architecture.md`
- `docs/canon/OTHER_BALI_DECISION_LOG.md`
- `docs/seo/os/intent-registry.json`
- `docs/seo/os/page-registry.json`
- `lib/intents.ts`
- `lib/moments.ts`
- `lib/catalogue-moments.ts`
- `lib/trip-missions.ts`
- `lib/day-builder.ts`
- `lib/scenarios.ts`
- `lib/collections.ts`
- `lib/start-shortlist.ts`
- `lib/quick-decision.ts`
- `lib/trip.ts`
- `lib/analytics.ts`
- `lib/data.ts`
- `app/places/page.tsx`
- `app/places/PlacesView.tsx`
- `app/my-day/page.tsx`
- `app/plan/page.tsx`
- `app/PlanView.tsx`
- `app/collections/page.tsx`
- `app/collections/[taste]/page.tsx`
- `app/places/[slug]/page.tsx`
- `components/SaveButton.tsx`
- `components/AddToTripButton.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- migrations `0001_init.sql`, `0019_saved_places_and_sharing.sql`, `0056_saved_place_trip_extension.sql`

## UNRESOLVED_ISSUES

1. No canonical single source joins all intent IDs to route, UI, data fields and analytics events.
2. Current row-level population of `venues.jobs`, `vibe_tags`, `practical_tags`, `last_verified_at`, `publication_status` is not fully verified from live DB.
3. `lib/trip-missions.ts` names scenario slugs that are not all present in `SCENARIOS`; this is a confirmed docs/code mismatch for `slow-living`, `family`, `night-out`, and `rainy-day`.
4. Plan and `/places` use different moment registries and different matching semantics.
5. Later save/trip RPCs are revoked from `anon/authenticated` in migration `0056` and granted only to `service_role`; current API route/service-client wiring needs runtime verification.
6. `docs/seo/os/intent-registry.json` is in `mode: shadow`; most entries remain `intent_id: null` and `os_gate_status: shadow_unreviewed`.
7. Full current Supabase inventory and event counts are not available in the local evidence set.

## OWNER_DECISIONS_REQUIRED

1. Choose the governing vocabulary: merge `intents`, Plan `moments`, catalogue `moments`, missions and collections behind one canonical internal ID layer, or explicitly maintain them as separate layers.
2. Decide whether `/plan` and `/my-day` are permanently separate products: future-trip planning versus today decision. Current code says yes, but the shared collection/route engines create overlap.
3. Decide canonical names for duplicate concepts: `date-night`, `special-occasion`, `sunset/golden-hour`, `work-friendly/work-session`, `family/family-easy`, `local/local-and-calm`.
4. Decide whether missing scenario pages in `trip-missions.ts` are deprecated references, planned future pages, or implementation gaps.
5. Decide whether later saved-trip RPCs should be callable through the public API boundary; do not change grants without explicit approval and security review.
6. Decide whether shadow intent registry is an audit-only registry or must become the production governance source.

## QUALITY_SCORE

**78/100 — evidence-backed internal audit, not a live-data certification.**

Deductions: no live DB row proof; no runtime event counts; duplicate vocabularies are documented but not reconciled; some architecture/doc files are too large and registry coverage is incomplete.

## RECOMMENDED_NEXT_STEP

Owner decision first: approve a canonical intent vocabulary and status model. Then perform a separate read-only live DB/runtime verification of the data support matrix and API/RPC grants. Do not start venue cleanup or SEO page changes as a substitute for this governance step.

## Handoff

STATUS: PARTIAL / ACCEPTABLE AS READ-ONLY V1
FILES_CREATED: 5 audit artifacts
FILES_CHANGED: production none
SOURCES_REVIEWED: repository, docs, schema/migrations, local registries
UNRESOLVED_ISSUES: listed above
OWNER_DECISIONS_REQUIRED: listed above
QUALITY_SCORE: 78/100
RECOMMENDED_NEXT_STEP: canonical vocabulary decision, then live DB/runtime verification
