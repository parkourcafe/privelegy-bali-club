# Other Bali Wave 3 Verification Report — 2026-07-22

Branch: `codex/otherbali-wave3-t8-t10-chope-2026-07-22`
Scope: T8 Canggu Now, T10 Plan navigation and missing content, Chope-607 pipeline preparation.

## Executive verdict

Wave 3 has been implemented, merged and production-deployed. Production Supabase migration `0059` was applied after explicit approval. The full Chope-607 source was later provided and processed as a local dry-run only; no Chope production writes or publication were performed.

## T8 — Canggu Now

| Requirement | Evidence | Result |
|---|---|---|
| Add scenario entry above existing `/canggu` content | `components/CangguNow.tsx`; mounted in `app/canggu/page.tsx` before `StartYourShortlist` | done |
| Include required entries | `scripts/wave3-product-boundary.test.mjs` checks all 12 labels | done |
| Near me fallback if geolocation is unavailable | `Near me` links to existing `/my-day` with fallback copy to Canggu areas; no forced geolocation dependency | done |
| Do not show current-open claim | UI uses `Fits this moment`; test rejects `Open now` | done |
| Base moment matching on editorial/scenario surfaces | Links use existing guides/routes/query surfaces; no inferred hours or booking difficulty | done |

## T10 — Plan navigation and missing content

| Requirement | Evidence | Result |
|---|---|---|
| Check existing Plan navigation before changing | discovery doc records mobile Plan exists and desktop lacks single-tap Plan | done |
| Add Plan if insufficiently visible | `lib/navigation.ts` adds `/plan` to `NAV_ACTIONS` | done |
| Preserve existing mobile navigation | `components/MobileNav.tsx` unchanged; test confirms Plan remains | done |
| Do not create a new route engine | existing `app/route/[slug]` + `lib/data.ts` retained | done |
| Fix route stop fragility | `lib/data.ts` resolves published venue-backed stops while preserving standalone editorial RouteStops such as beaches/viewpoints | done |
| Bali in 3 days | `lib/guides.ts`; `app/bali-itinerary-3-days/page.tsx` | done |
| Bali in 5 days | `lib/guides.ts`; `app/bali-itinerary-5-days/page.tsx` | done |
| Canggu food route | `supabase/migrations/0059_wave3_canggu_routes.sql`; fallback stages in `lib/data.ts` | done; production migration `0059` applied after approval |
| Canggu sunset route | Existing `/route/sunset-run` confirmed; no duplicate route created | preserved |
| Canggu rainy-day route | `supabase/migrations/0059_wave3_canggu_routes.sql`; fallback stages in `lib/data.ts` | done; production migration `0059` applied after approval |
| Canggu without a scooter | `lib/guides.ts`; `app/canggu-without-a-scooter/page.tsx` | done |

## Chope-607 pipeline

| Requirement | Evidence | Result |
|---|---|---|
| Use staged-candidates pattern, not direct publishing | `CHOPE_607_PIPELINE_MAPPING.md`; `data/data-ops/chope-607/sample-candidates.json` | done |
| Prepare mapping schema | `CHOPE_607_PIPELINE_MAPPING.md` | done |
| Run dry run | `node scripts/chope-607-dry-run.mjs /Users/msnigmatullaeva/Downloads/chope_bali_venues_full.csv data/data-ops/chope-607/dry-run-output-full.json` | done |
| Show counts by state | `CHOPE_607_DRY_RUN_REPORT.md`; `data/data-ops/chope-607/dry-run-output-full.json` | done |
| Prove no automatic publication | dry-run output: 607 processed, 0 publishable, all `draft`/`dedup_pending` | done |
| Do not import descriptions/photos/ratings | mapping excludes Chope description/photos/ratings | done |
| Do not apply downloaded SQL | `/Users/msnigmatullaeva/Downloads/insert_chope_candidates.sql` was inspected only | done |

## Full source note

The full 607-row Chope source file is available at `/Users/msnigmatullaeva/Downloads/chope_bali_venues_full.csv` and has been processed as a local dry-run only. A separate 12-row direct-insert artifact remains unsuitable for production import because those candidates still require manual verification.

## Verification commands

| Command | Result |
|---|---|
| `node scripts/chope-607-dry-run.mjs /Users/msnigmatullaeva/Downloads/chope_bali_venues_full.csv data/data-ops/chope-607/dry-run-output-full.json` | pass; `total=607`, `publishable=0` |
| `npm run test:wave3` | pass; 5/5 |
| `npm run typecheck` | pass |
| `npm run lint` | pass with one pre-existing warning in `app/partner/venues/[venue]/[section]/PhotoReviewPanel.tsx` about `<img>` |
| `npm run build` | pass; generated 151 static pages and includes `/bali-itinerary-3-days`, `/bali-itinerary-5-days`, `/canggu-without-a-scooter` |
| `npm test` | pass; 225/225 after Wave 3 test was added to the main suite |

## Deferred / needs approval

- DB-aware Chope dedup against the production venue catalogue.
- Any production candidate import or mutation.
- Any promotion from `dedup_pending` to import/publish-ready.
- PR #178 triage remains separate.
