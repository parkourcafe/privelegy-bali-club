# Other Bali Phase 1 Release-Blocker Acceptance Report

Date: 2026-07-22  
Branch: `codex/otherbali-phase1-release-blockers-2026-07-22`  
Scope: Phase 1 release-blocker repair only. Phase 2 role consolidation and `/plan` redesign were not started.

## Executive verdict

Phase 1 implementation draft is complete locally and ready for PR preview verification.

Local production-build checks pass for the confirmed route, link, sitemap, focus-style and build/test blockers. One limitation remains local-only: `/route/*` pages no longer throw `DYNAMIC_SERVER_USAGE`, but the local production server has no Supabase environment and intentionally does not load fixture venue/route data outside development. Route content must be verified on the Vercel preview with configured data.

## Phase 0 artifacts

The accepted Phase 0 artifacts were copied into:

- `OTHERBALI_PHASE0_REVIEW_BASELINE_2026-07-22/`

Zip created:

- `OTHERBALI_PHASE0_REVIEW_BASELINE_2026-07-22.zip`

These files were left untracked and are not included in the Phase 1 implementation commit.

## Changed files

| File | Change | Reason |
|---|---|---|
| `app/uluwatu/layout.tsx` | Removed all-or-nothing DB completeness `notFound()` gate for the static Uluwatu subtree. | Fixed confirmed 404s on `/uluwatu/*` while keeping individual venue cards/links gated by existing public data helpers. |
| `app/route/[slug]/page.tsx` | Added `dynamic = "force-dynamic"`. | Fixed production `DYNAMIC_SERVER_USAGE` 500 class on route pages. |
| `lib/homepage.ts` | Repointed `Plan 3 / 5 / 7 days` to `/how-many-days-in-bali`, Uluwatu area to `/uluwatu`, and Bali without scooter to `/how-to-get-around-bali`. | Fixed incorrect Plan, Uluwatu and Bali-without-scooter homepage links without redesigning `/plan`. |
| `lib/navigation.ts` | Repointed shared Uluwatu area nav to `/uluwatu`; removed `/collections` from Eat & Drink nav. | Fixed incorrect Uluwatu nav link and removed unfinished empty collections hub from public navigation. |
| `app/sitemap.ts` | Includes `/collections` hub only when `liveCollectionSlugs()` is non-empty. | Preserves `/collections` URL but stops promoting an empty hub from crawl surfaces. |
| `app/globals.css` | Added global `:focus-visible` fallback for common interactive elements. | Ensures visible focus for interactive controls beyond homepage-specific classes. |
| `scripts/wave1-home-boundary.test.mjs` | Updated expected trip-length scenario target to `/how-many-days-in-bali`; retained hero Plan CTA `/plan`. | Regression coverage for corrected Plan link semantics. |

## Required route matrix

Local production server: `next start -p 3017` after `npm run build`.

| Route | Local status | Evidence |
|---|---:|---|
| `/uluwatu` | 200 | H1: `The Uluwatu guide` |
| `/uluwatu/48-hours` | 200 | H1: `48 hours in Uluwatu` |
| `/uluwatu/beach-clubs-sunset` | 200 | H1: `Beach clubs & sunset, compared` |
| `/uluwatu/best-brunch` | 200 | H1: `Best brunch in Uluwatu` |
| `/uluwatu/best-restaurants` | 200 | H1: `Best restaurants in Uluwatu` |
| `/uluwatu/date-night-restaurants` | 200 | H1: `Date night, separated properly` |
| `/uluwatu/resort-pool-day-passes` | 200 | H1: `Uluwatu clifftop pool day passes` |
| `/route/cafe-work` | 200 local fallback | No longer 500 / no `DYNAMIC_SERVER_USAGE`; content requires configured Supabase route data. |
| `/route/canggu-rainy-day` | 200 local fallback | No longer 500 / no `DYNAMIC_SERVER_USAGE`; content requires configured Supabase route data. |
| `/route/first-day` | 200 local fallback | No longer 500 / no `DYNAMIC_SERVER_USAGE`; content requires configured Supabase route data. |
| `/route/sunset-run` | 200 local fallback | No longer 500 / no `DYNAMIC_SERVER_USAGE`; content requires configured Supabase route data. |
| `/places` | 200 | H1: `Explore Bali`; no unrecoverable empty marker in local HTML. |
| `/plan` | 200 | H1: `Your Canggu day`; no unrecoverable empty marker in local HTML. |
| `/my-day` | 200 | H1: `Build my day in Bali`; no unrecoverable empty marker in local HTML. |
| `/collections` | 200 preserved URL | Empty hub no longer promoted in nav/sitemap when no live collection slugs exist. |

## Real route/source evidence

- `first-day`, `cafe-work`, `sunset-run`: `supabase/migrations/0007_routes.sql`
- `canggu-rainy-day`: `supabase/migrations/0059_wave3_canggu_routes.sql`
- Route page implementation: `app/route/[slug]/page.tsx`
- Route data loader: `lib/data.ts` (`getRoutes`, `getRoute`, `resolveRouteStops`)

No invented sample slugs were used for the required route checks.

## Link validation

Homepage internal links were extracted from rendered local production HTML and fetched with `redirect: "manual"`. All internal homepage links returned 200, including:

- `/uluwatu`
- `/how-many-days-in-bali`
- `/how-to-get-around-bali`
- `/plan`
- `/places`
- `/my-day`

## Sitemap/public navigation

Observed local sitemap:

- `/uluwatu` included.
- `/collections` not included when `liveCollectionSlugs()` is empty.
- `/collections/*` not included when no live collection slugs exist.

Shared nav:

- `Areas → Uluwatu & the Bukit` now points to `/uluwatu`.
- Empty `/collections` hub removed from Eat & Drink public nav.

## Accessibility / focus

Implemented a global visible `:focus-visible` fallback in `app/globals.css` for:

- `a`
- `button`
- `summary`
- `input`
- `select`
- `textarea`
- `[role="button"]`

Local repo does not include Playwright, Puppeteer, Lighthouse, or axe browser runner. `axe-core` exists but no existing browser integration is installed. No new dependency was added in Phase 1. Full axe verification should run on CI/preview if configured.

## Commands run

| Command | Result |
|---|---|
| `npm run typecheck` | PASS |
| `npm run lint` | PASS with one pre-existing warning in `app/partner/venues/[venue]/[section]/PhotoReviewPanel.tsx` for `<img>`. |
| `npm run build` | PASS |
| `npm run test:wave1` | PASS, 46/46 |
| Local HTTP route matrix | PASS for Uluwatu and required page shells; route content preview verification still required with configured Supabase. |
| Homepage internal-link validation | PASS, all extracted internal homepage links returned 200. |

## Pre-existing / environment limitations

- Local production server has no `.env.local` and no configured Supabase anon environment. Because fixture fallback is intentionally disabled outside development, local `/route/*` pages cannot render route stops here even after the `DYNAMIC_SERVER_USAGE` fix. Preview must verify content with real configured data.
- Browser-based axe and keyboard/focus automation are not available in the current repo dependencies. Static focus fallback was added; full browser verification is pending preview/CI tooling.
- Lint warning in partner photo review is unrelated to Phase 1 and was not changed.

## Release status

Do not deploy production.

Next required step:

1. Commit Phase 1 changes only.
2. Push branch.
3. Open PR.
4. Verify Vercel preview:
   - `/route/cafe-work`
   - `/route/canggu-rainy-day`
   - `/route/first-day`
   - `/route/sunset-run`
   - `/places`
   - `/plan`
   - `/my-day`
   - homepage internal links
   - axe/focus if preview tooling permits.
