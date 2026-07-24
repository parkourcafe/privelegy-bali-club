# Uluwatu implementation and QA report

Date: 2026-07-23 WITA

Branch: `seo/uluwatu-autonomous-cluster`

## Implemented maintenance slice

- Corrected the homepage Uluwatu area link from `/uluwatu-sunset-kecak` to canonical `/uluwatu`.
- Added explicit intent owners for the existing Uluwatu cluster. No new URL, redirect, sitemap route or schema type was introduced.
- Marked resort pool day-pass ownership `blocked` in SEO OS governance while preserving the pre-existing URL pending a separate production preservation decision.
- No P0 public page was implemented. An attempted pillar cleanup was fully reverted after independent review established that retained legacy page claims also require ledger closure.

## Validation

| Check | Result |
|---|---|
| district CSV schemas, duplicate source/entity/claim IDs and claim-source references | PASS |
| repository skill validation | PASS |
| JSON syntax | PASS |
| SEO OS schema / intent ownership uniqueness | PASS, 20 intents |
| Uluwatu canonical inventory | PASS: six static canonicals plus one computed canonical from `fnbMetadata`; no duplicate owner found |
| `git diff --check` | PASS |
| lint | PASS with one unrelated pre-existing `<img>` warning in partner PhotoReviewPanel |
| typecheck | PASS |
| focused homepage/T0 tests | PASS, 25 tests |
| SEO OS tests + registry validation | PASS, 25 tests plus validator |
| full `npm test` | PASS, 252 tests |
| production build | PASS, Next.js 16.2.10; all seven Uluwatu routes compiled |
| sitemap | PASS by build/registry inspection: pillar and existing children emitted; no new URL |
| robots/noindex | PASS by `app/robots.test.ts` and full suite; no Uluwatu block introduced |
| schema | PASS structurally: existing page components preserved; build and SEO HTML parser tests pass |
| internal links | PASS for changed link and existing pillar/children; homepage now owns canonical district handoff |
| SSR HTML runtime inspection | NOT APPLICABLE to final public diff; clean clone also fails closed without production published-venue Supabase state |
| mobile runtime screenshot | BLOCKED by the same fail-closed data dependency; source inspection confirms existing responsive wrapper (`overflow-x: auto`) and no layout code changed |
| independent claim and SEO review | PASS_WITH_CAVEATS for commit/preview; all public-page drafts HOLD |

The runtime blockers are not treated as passes. Preview QA should still re-run HTML, schema, canonical and 390px rendering against the pushed preview where the deployment environment provides the normal read configuration.

The district validator now requires the core CSV/decision/brief/gate artifacts and validates decision, evidence, publication and Maps vocabularies. Live SERP findings remain qualitative rather than a reproducible rank/volume dataset.

## Safety and unrelated artifacts

`npm test` regenerated `ios-web/build-manifest.json`; it was restored. The build downloaded an untracked scene video; it was removed. No unrelated district file or production action was retained.
