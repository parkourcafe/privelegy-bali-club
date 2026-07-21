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
typecheck and a production build pass. Migration 0056 was applied to production
after explicit approval. A rollback-only production smoke exposed Supabase's
separate `extensions` search path for `gen_random_bytes`; migration 0057 fixed
the share-ID generator without widening the SECURITY DEFINER search path.
After separate approval, 0057 was applied and the complete rollback-only
production smoke passed. All three Vercel branch deployments completed
successfully. Narrow-window visual QA of `/` and `/me` found that the higher-z
mobile navigation covered the consent actions. The banner now sits above the
navigation until the shared 1360 px desktop breakpoint; both actions were
visible and `Essential only` dismissed the dialog on the rebuilt preview.
Venue-detail interaction remains a post-deploy check because preview data
guards intentionally return 404 rather than connect to production Supabase.

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
- Migration 0057 replaces the extension-dependent shared-list ID generator
  with PostgreSQL's built-in `gen_random_uuid()` while preserving the fixed
  SECURITY DEFINER search path and service-role-only grant.
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
- Mobile consent actions remain visible above the persistent bottom navigation
  and retain native button interaction.

## Tests and commands

| Check | Result |
|---|---|
| `npm run test:wave1` | 45/45 passed |
| Existing `npm test` suite | 220/220 passed |
| `npm run typecheck` | passed |
| `npm run lint` | passed with one pre-existing `no-img-element` warning in partner photo review |
| `npm run build` | passed; 148 pages generated; `/api/trip` present |
| `npm run test:wave1:db` | passed against disposable PostgreSQL 17; migration, grants, publication status, retry order, reorder and both share formats verified |
| Vercel branch checks | all three deployments completed successfully |
| Production migrations | 0056 and 0057 applied to `bali-privilege`; migration history verified |
| Production transaction smoke | passed Save, day assignment, retry position, reorder and share snapshot; rolled back with no retained test data |
| Supabase Advisors | no Wave 1 security WARN; fail-closed RLS and two non-blocking performance INFO notices documented |
| `git diff --check` | passed |
| Local HTTP `/` and `/me` | 200 with expected Wave 1 content |
| Invalid Save and trip-day requests | 400 |
| Narrow-window visual/mobile smoke | `/` and `/me` passed on rebuilt preview; consent actions visible and dismissible; no horizontal overflow |

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

1. Review the Wave 1 commits without deploying.
2. Back up and verify the target Supabase project and migration history.
3. **Complete:** apply `0056_saved_place_trip_extension.sql` before rollout.
4. **Complete:** apply `0057_shared_trip_id_portability.sql` and verify all RPC
   grants: only `service_role` may execute them.
5. **Complete at the database boundary:** smoke-test desired-state Save, add to
   day, retry, reorder and sharing in production inside a rolled-back
   transaction. Route-level smoke remains post-deploy because preview service
   clients intentionally reject production credentials.
6. **Complete for preview-accessible routes:** narrow-window `/` and `/me`,
   native controls, consent dismissal and bottom-navigation coexistence passed.
   Venue detail remains a route-level post-deploy check because preview data
   isolation intentionally returns 404.
7. Deploy the application only after steps 3-6 pass.
8. Monitor API error rates and keep the legacy shared-list fallback during the
   rolling deployment.

## Deferred and not claimed

- Login recovery/merge is not implemented because the repository has no
  tourist-auth architecture. Anonymous state recovery after clearing cookies
  remains impossible by design.
- Migrations 0056 and 0057 are present in the target Supabase project. The
  complete rollback-only smoke left no test data and Supabase Advisors were
  reviewed. Route-level production smoke remains a post-deploy gate.
- No production deployment was performed.
- T4-T10 and the Chope pipeline were not started.
