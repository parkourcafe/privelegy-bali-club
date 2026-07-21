# Other Bali Wave 2 Verification Report — 2026-07-22

## Executive verdict

The confirmed T4–T7 gaps are implemented on a dedicated branch by reusing the
existing venue, publication, editorial and analytics architecture. No paid
ranking, opening-hours claim, parallel recommendation engine or new public data
was added. Automated verification passes. Migration 0058 is unapplied and the
branch is undeployed pending explicit approval.

## T4–T7 status

| Task | Before | Repository evidence | Action | After | Verification |
|---|---|---|---|---|---|
| T4 QuickDecision | Venue detail had a partial quick-read block. | `app/places/[slug]/page.tsx`, `lib/venue-completeness.ts` | Added an evidence-only decision projection. | Best for, Not for, Why go, What to order, Practical note and Reservations appear only when supplied. Menu items remain evidence-gated; booking claims are never inferred from a CTA. | Unit/boundary tests, full suite, typecheck, build |
| T5 Start your shortlist | Five district pages had lists but no decision starter. | Canggu, Ubud, Uluwatu, Sanur and Seminyak page modules | Added one shared three-choice block with why, moment, audience and a primary place action. | Pilot hides without decision-ready candidates; ordering is stable and payment-independent. | Unit/boundary tests, lint, typecheck, build |
| T6 `/for-venues` | Existing page lacked a concrete results list and described possible post-trial charging. | `app/for-venues/page.tsx` and the existing submission flow | Added bounded metrics, corrected intake/review wording and applied the monetization freeze. | Pilot is free through 21 September 2026; no automatic charge; monetization reserved; organic order not for sale; metrics are intent signals, not guarantees. | Boundary tests, internal-link scan, lint, typecheck, build |
| T7 Hygiene | Copy and regression boundaries were inconsistent around intake, publication and monetization. | Changed public routes and existing metadata/accessibility conventions | Corrected claims and added product boundary tests. | No empty shortlist, invented operational claims or paid-placement promise; changed routes retain canonicals. | 220/220 existing tests; 11/11 Wave 2 tests; build |

## Changed implementation

- `lib/quick-decision.ts` and tests
- `lib/start-shortlist.ts`, `components/StartYourShortlist.tsx` and tests
- Venue detail plus the five pilot district pages
- `app/for-venues/page.tsx`
- Bounded `shortlist_generated` analytics allowlist and tests
- `supabase/migrations/0058_shortlist_generated_event.sql`
- Wave 2 product and disposable-database smoke scripts

## Analytics and database boundary

`shortlist_generated` uses the existing consent-gated page-view mechanism with
a bounded page subject and no venue-list or personal payload. Migration 0058
only extends the existing `log_event` allowlist, preserves fixed `search_path`,
revokes public/anon/authenticated execution and grants only `service_role`.
It passed a disposable PostgreSQL 17 smoke test and has **not** been applied to
production.

## Verification

| Command | Result |
|---|---|
| `npm test` | PASS — 220 tests |
| `npm run test:wave2` | PASS — 11 tests |
| `npm run test:wave2:db` | PASS |
| `npm run lint` | PASS — 0 errors, 1 pre-existing warning |
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
| `git diff --check` | PASS |

The warning is pre-existing raw `<img>` use in
`app/partner/venues/[venue]/[section]/PhotoReviewPanel.tsx`; it was not changed.

## Preserved boundaries

- Publication/completeness gates and Bali-wide venue coverage are unchanged.
- No Open now, waiting-time, dress-code or inferred booking claim was added.
- Save/Add-to-trip, partner/admin, perks, QR, sitemap and canonical behavior stay
  in the existing architecture.
- Commercial entities remain inactive. T8–T10 and Chope were not started.

## Preview boundary and release sequence

Local HTTP smoke was limited by missing published district data, and the in-app
browser runtime failed to start; no screenshot-based result is claimed. All three
Vercel previews deployed successfully, but deployment protection redirects the
preview URLs to Vercel login, so unauthenticated visual and keyboard smoke cannot
be claimed before merge.

1. Push branch and obtain green CI/preview checks.
2. Complete preview smoke.
3. With explicit approval, apply migration 0058 and verify its grants/event.
4. With separate explicit approval, merge and deploy.
5. Verify the same surfaces and bounded event in production.
