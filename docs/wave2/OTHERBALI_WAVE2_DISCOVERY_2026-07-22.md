# Other Bali Wave 2 Discovery — 2026-07-22

## Scope

This wave covers only T4 QuickDecision, T5 Start your shortlist, T6
`/for-venues`, and evidence-led T7 product/content hygiene. T8–T10 and the
Chope pipeline remain out of scope.

## Repository facts

| Task | Repository evidence | Status before Wave 2 | Confirmed gap |
|---|---|---|---|
| T4 | `app/places/[slug]/page.tsx` renders `The quick read`; `lib/venue-completeness.ts` gates `whatToOrder` | Partially implemented | The compact decision block does not consistently expose Why go, What to order, and a practical note together. |
| T5 | `app/canggu/page.tsx`, `app/ubud/page.tsx`, `app/uluwatu/page.tsx`, `app/sanur/page.tsx`, `app/seminyak/page.tsx` render category lists | Missing as a distinct pilot | No three-choice starter block explains why each place fits, its moment, audience, and primary next action. |
| T6 | `app/for-venues/page.tsx`, `components/VenueSubmissionForm.tsx`, `/api/venue-submission` | Mostly implemented | The page lacks a concrete measurement list and still describes possible post-trial charging despite the principal's monetization freeze. |
| T7 | Existing lint, build, accessibility conventions, metadata and publication tests | Partial | Wave 2 needs regression boundaries for truthful decision copy, the five-page pilot, monetization freeze, canonical metadata and accessible controls. |

## Winning rules

- Repository data and publication gates remain authoritative implementation
  evidence; no recommendation copy is invented.
- QuickDecision may use only existing editorial/evidence fields. It must not
  infer booking difficulty, opening state, wait time, dress code or reservation
  need from a CTA.
- The shortlist pilot reuses published `VenueWithPerk` records and does not
  create a second recommendation engine or new data entity.
- Until 2026-09-21, monetization is `reserved — monetization decision pending
  after 2-month pilot`; no paid offer is shown publicly and organic order does
  not depend on payment.
- No new product table or content schema is required. The existing bounded
  analytics RPC needs an allowlist-only migration for `shortlist_generated`.

## Planned verification

- Focused unit/boundary tests for QuickDecision projection and shortlist
  selection.
- Static route assertions for all five pilot pages and `/for-venues`.
- Existing test suite, lint, typecheck and production build.
- Narrow mobile and accessibility smoke for the changed public surfaces.
