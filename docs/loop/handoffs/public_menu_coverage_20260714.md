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

## Production state at handoff

Code and SQL are ready for release, but this handoff does not claim that the
new migration has run in production. The remaining operator sequence is:

1. commit and deploy the application release;
2. run the complete migration SQL once in the Supabase SQL Editor;
3. require the final confirmation row to report `ok=true`, `1`, `126`, `127`;
4. verify anonymous counts and representative full/partial pages;
5. record the production deployment and final SHA.
