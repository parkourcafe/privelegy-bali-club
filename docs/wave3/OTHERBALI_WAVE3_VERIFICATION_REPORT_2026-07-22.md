# Other Bali Wave 3 Verification Report — 2026-07-22

Branch: `codex/otherbali-wave3-t8-t10-chope-2026-07-22`
Scope: T8 Canggu Now, T10 Plan navigation and missing content, Chope-607 pipeline preparation.

## Executive verdict

Wave 3 is implemented locally and verified. No production deployment, PR merge, production Supabase mutation, or Chope publication was performed in this step.

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
| Fix route stop fragility | `lib/data.ts` resolves route stops from `getPublishedVenues()` and filters by district | done |
| Bali in 3 days | `lib/guides.ts`; `app/bali-itinerary-3-days/page.tsx` | done |
| Bali in 5 days | `lib/guides.ts`; `app/bali-itinerary-5-days/page.tsx` | done |
| Canggu food route | `supabase/migrations/0059_wave3_canggu_routes.sql`; fallback stages in `lib/data.ts` | done locally; production migration not applied |
| Canggu sunset route | Existing `/route/sunset-run` confirmed; no duplicate route created | preserved |
| Canggu rainy-day route | `supabase/migrations/0059_wave3_canggu_routes.sql`; fallback stages in `lib/data.ts` | done locally; production migration not applied |
| Canggu without a scooter | `lib/guides.ts`; `app/canggu-without-a-scooter/page.tsx` | done |

## Chope-607 pipeline

| Requirement | Evidence | Result |
|---|---|---|
| Use staged-candidates pattern, not direct publishing | `CHOPE_607_PIPELINE_MAPPING.md`; `data/data-ops/chope-607/sample-candidates.json` | done |
| Prepare mapping schema | `CHOPE_607_PIPELINE_MAPPING.md` | done |
| Run dry run | `node scripts/chope-607-dry-run.mjs` | done |
| Show counts by state | `CHOPE_607_DRY_RUN_REPORT.md`; `data/data-ops/chope-607/dry-run-output.json` | done |
| Prove no automatic publication | dry-run output: 5 processed, 0 publishable, all `draft`/`dedup_pending` | done |
| Do not import descriptions/photos/ratings | mapping excludes Chope description/photos/ratings | done |
| Do not apply downloaded SQL | `/Users/msnigmatullaeva/Downloads/insert_chope_candidates.sql` was inspected only | done |

## Source limitation

The full 607-row Chope source file was not found in the repository or inspected Downloads paths. The available artifact is a 12-row SQL draft in Downloads. The dry-run uses a controlled five-row sample derived from that artifact and explicitly keeps every candidate non-publishable.

## Verification commands

| Command | Result |
|---|---|
| `node scripts/chope-607-dry-run.mjs` | pass; `total=5`, `publishable=0` |
| `npm run test:wave3` | pass; 5/5 |
| `npm run typecheck` | pass |
| `npm run lint` | pass with one pre-existing warning in `app/partner/venues/[venue]/[section]/PhotoReviewPanel.tsx` about `<img>` |
| `npm run build` | pass; generated 151 static pages and includes `/bali-itinerary-3-days`, `/bali-itinerary-5-days`, `/canggu-without-a-scooter` |
| `npm test` | pass; 225/225 after Wave 3 test was added to the main suite |

## Deferred / needs approval

- Apply `supabase/migrations/0059_wave3_canggu_routes.sql` to production Supabase only after explicit approval.
- Open PR and deploy production only after explicit merge/deploy approval.
- Run full 607-row Chope dry-run when the actual source file is provided or located.
