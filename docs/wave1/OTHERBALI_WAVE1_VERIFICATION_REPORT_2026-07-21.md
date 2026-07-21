# Other Bali Wave 1 Verification Report

Date: 2026-07-21  
Branch: `codex/otherbali-wave1-t1-t2-t3-t9-2026-07-21`  
Scope: T1, T2, T3 and T9 only

## Executive verdict

The repository gaps recorded in
`OTHERBALI_WAVE1_GAP_ANALYSIS_2026-07-21.md` have been implemented without
creating a second planning or identity system. T9 extends the existing
anonymous `saved_places` model. The editorial plan and route entities remain
read-only, Bali-wide venue coverage remains intact, Canggu remains the
active-deep district, and no paid product was activated.

Application code, focused tests, the complete existing test suite, lint,
typecheck and a production build pass. Migration 0056 has not been applied to
production. Browser-based visual QA could not be completed because the local
browser-control runtime was unavailable; HTTP production-render and
keyboard-native control contracts were checked instead. This is a documented
pre-deployment gate, not a claimed pass.

## Task verification

| Task | Before | Repository evidence | Action | After | Verification |
|---|---|---|---|---|---|
| T1 Home | Promise and planner existed, but the required six starts and explicit entrance hierarchy did not; paid-arrival claims conflicted with the freeze | `app/page.tsx`, `components/landing/DayIntentBuilder.tsx` | Added two traveller-first entrances and a subdued venue entrance; linked all six existing scenario routes; removed paid-arrival claims | Home supports planning before travel and decisions in Bali without becoming a catalogue | `scripts/wave1-home-boundary.test.mjs`; local `/` returned 200 and contained all entrance labels |
| T2 Save | Anonymous cookie-backed toggle existed, but writes were non-idempotent and input/publication validation was incomplete | `app/api/save/route.ts`, `components/SaveButton.tsx`, migration 0019 | Added desired-state Save, strict slug validation, published/active venue gate and visible failure feedback | Retries cannot invert the desired state; guest identity remains an httpOnly cookie | Wave 1 unit/boundary tests; invalid runtime request returned 400 |
| T3 Venue completeness | Several fields existed in data but were omitted or rendered without evidence; empty practical blocks were possible | `app/places/[slug]/page.tsx`, `components/VenueCard.tsx`, `components/menu/menu-model.ts` | Added evidence gate for `what_to_order`, verified-date fallback, price-anchor/practical-tag fallbacks, empty-block suppression and safe currency handling | Only present, supported facts render; unknown numeric currency is hidden rather than made precise | `lib/venue-completeness.test.ts`, `components/menu/menu-model.test.ts` |
| T9 Add to trip | Saves were a flat list; no day, order, move, delete or ordered shared snapshot existed | `saved_places`, `shared_lists`, `/me`, `/list/[slug]` | Additively extended saves with day/order; added day assignment, move, accessible reorder, delete, Maps and ordered sharing | One anonymous shortlist/trip system supports the required operations; legacy slug-only links remain readable | `lib/trip.test.ts`, `scripts/wave1-trip-boundary.test.mjs`; build exposes `/api/trip` |

## Architecture and security facts

- No tourist account or localStorage identity was introduced.
- `bp_guest` remains the anonymous httpOnly identity boundary.
- No `trips` or `trip_items` table was created.
- Migration 0056 only adds `day_number` and `position` to
  `saved_places`, plus an ordered `trip_entries` snapshot to
  `shared_lists`.
- Trip mutations validate venue slug, active status and published status.
- Advisory transaction locks serialize mutations for one guest.
- All seven new `SECURITY DEFINER` RPCs set a fixed `search_path`, revoke
  execution from `PUBLIC`, `anon` and `authenticated`, and grant execution
  only to `service_role`.
- Shared private links are resolved server-side; no privileged key is exposed
  to the browser.
- Old `venue_slugs` shared-list rows remain supported with their original
  order.
- Google Maps remains the navigation owner through the existing tracked link.
- Save and route additions emit consent-gated, bounded, PII-free growth events;
  analytics failure never blocks the functional mutation.

## Tests and commands

| Check | Result |
|---|---|
| `npm run test:wave1` | 43/43 passed |
| Existing `npm test` suite | 220/220 passed |
| `npm run typecheck` | passed |
| `npm run lint` | passed with one pre-existing `no-img-element` warning in partner photo review |
| `npm run build` | passed; 148 pages generated; `/api/trip` present |
| `git diff --check` | passed |
| Local HTTP `/` and `/me` | 200 with expected Wave 1 content |
| Invalid Save and trip-day requests | 400 |
| Browser visual/mobile smoke | blocked by unavailable browser-control runtime |

The build downloaded `public/scenes/venues-story.mp4` and regenerated
`ios-web/build-manifest.json`; both generated changes were removed from the
Wave 1 diff.

## Preserved behavior

- Existing editorial `plan_entries` and `route_stops` were not made
  user-writable.
- Existing mobile Capacitor saved-state implementation was not silently
  replaced.
- Publication and indexability gates were not weakened.
- Existing public venue routes outside Canggu were not removed or restricted.
- Partner/admin permissions, perks, QR/redemption and action handoffs were not
  redesigned.
- Monetization schema was not deleted, but the homepage no longer advertises a
  live paid-arrival model. Organic order remains editorial.

## Deployment sequence

1. Review and merge the Wave 1 commits without deploying.
2. Back up and verify the target Supabase project and migration history.
3. Apply `0056_saved_place_trip_extension.sql` before application rollout.
4. Verify the seven RPC grants: only `service_role` may execute them.
5. Smoke-test desired-state Save, add to day, move, reorder, delete and sharing
   on a preview deployment with real published venues.
6. Complete mobile-width (320/375/430 px) and keyboard/accessibility visual QA.
7. Deploy the application only after steps 3-6 pass.
8. Monitor API error rates and keep the legacy shared-list fallback during the
   rolling deployment.

## Deferred and not claimed

- Login recovery/merge is not implemented because the repository has no
  tourist-auth architecture. Anonymous state recovery after clearing cookies
  remains impossible by design.
- Migration 0056 has not been executed against local or production Supabase in
  this session, so live SQL behavior and advisors remain a deployment gate.
- No production deployment was performed.
- T4-T10 and the Chope pipeline were not started.
