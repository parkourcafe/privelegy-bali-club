# Public menu coverage release candidate — 2026-07-14

## Outcome

This follow-on release makes every structured menu in the reviewed Data Ops
package discoverable without misrepresenting partial extracts as verified full
menus.

- 1 complete, operator-verified menu remains `published` (KYND Community).
- 126 partial official-source extracts use the separate `source_snapshot`
  state and keep `verified_at=null`.
- 127 menus, 165 sections and 881 items are covered by the public menu routes.
- 81 of the 208 reconciled venues still have no structured menu candidate and
  remain future Data Ops work.

## Product surface

- `/menus` lists all fresh public menu records with full-versus-partial labels.
- `/menus/[slug]` lets menu snapshots remain accessible even when the related
  `/places/[slug]` profile is still under review.
- Existing public place pages show their available menu inline.
- Navigation, home, places and sitemap entry points link to the menu library.
- Only verified full menu pages are indexable; freshness-bounded partial pages
  remain `noindex,follow`.

## Safety boundary

- A source snapshot requires an active parent, a safe HTTPS official source,
  at least one item, a 60-day expiry and no verification timestamp.
- Dietary, allergen, partner-recommendation and editorial signals are forbidden
  at the database gate and stripped again by the application mapper.
- Snapshot evidence and child rows are immutable once public.
- Review-only venue rows remain hidden by venue RLS.
- A later verified full menu atomically archives the partial snapshot.
- The exact package activation RPC is service-only, digest/count gated,
  idempotent and runs inside the migration transaction when the reviewed import
  ledger exists.

## Verification evidence

- All repository Node tests: `68/68` passed.
- Focused TypeScript menu tests: `10/10` passed.
- ESLint: passed with zero errors.
- Optimized Next.js production build: passed; `/menus` and `/menus/[slug]` are
  present in the route manifest.
- Current migration applied successfully to isolated PostgreSQL 16.
- Exact-package rehearsal imported `127 / 165 / 881 / 250`, published the full
  KYND menu, activated exactly 126 source snapshots and returned:
  `ok=true`, `verified_full_menus=1`, `partial_source_snapshots=126`,
  `total_public_menus=127`.
- A second migration replay returned the same result.
- Anonymous RLS rehearsal exposed `127 / 165 / 881` menu/section/item rows,
  kept a review-only parent venue hidden, suppressed snapshots after parent
  deactivation, blocked content rewriting and rejected an unverified dietary
  signal.

## Production completion

The application and reviewed source-snapshot migration are live in production.

- Release commit: `eb74912` (`loop/06-public-menu-coverage`).
- Vercel deployment: `dpl_55KpKbwnvS4GdxgPtLwq3T7oaWD5`.
- Public alias: `https://www.otherbali.com`.
- The SQL Editor confirmation row returned `ok=true`,
  `verified_full_menus=1`, `partial_source_snapshots=126` and
  `total_public_menus=127`.
- The successful transaction's live-count gate also confirmed the exact
  reviewed package shape: `127 / 165 / 881` menus/sections/items.
- Post-release HTTP verification checked all 127 unique menu detail routes:
  every route returned `200`, the verified KYND page remained indexable, and
  all 126 partial snapshots carried the source/warning labels and
  `noindex, follow` metadata.
- The production sitemap contains `/menus` and the verified
  `/menus/kynd-community` detail only; no partial snapshot detail is indexed.
