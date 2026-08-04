# Other Bali — Intent OS Phase 2 Read-only Closure Handoff

Date: 2026-07-28
Scope: read-only closure after Internal Intent Audit v1.0.
Production changes: **NONE**.

## STATUS

**PARTIAL / CODE-AND-SMOKE VERIFIED; LIVE PRODUCTION RUNTIME UNKNOWN.**

This phase verified the application-to-RPC boundary and existing static tests. It did not connect to the live Supabase project and did not deploy or modify any production artifact.

## API/RPC closure

### Save

- Route: `app/api/save/route.ts`
- Data mapping: `lib/data.ts:1235-1277`
- UI: `components/SaveButton.tsx`
- RPC path: `set_saved_place` through `serviceClient()`.
- Publication guard: `getVenueWithPerk()` + `isPublicReadyVenue()` before save-on.
- State model: desired-state write (`saved: boolean`), idempotent retry behavior documented in route.
- Verification: static boundary test PASS.

### Trip add/move/reorder

- Route: `app/api/trip/route.ts`
- Data mapping: `lib/data.ts:1283-1345`
- UI: `components/AddToTripButton.tsx`, `components/TripPlanner.tsx`
- RPC paths: `saved_trip_for`, `upsert_trip_place`, `move_trip_place`, `reorder_trip_place` through `serviceClient()`.
- Publication guard: `isPublicReadyVenue()` before add/move.
- Boundary: browser roles are revoked; service role is granted in migrations.
- Verification: `scripts/wave1-trip-boundary.test.mjs` **14/14 PASS**.

### Share list / shared trip

- Create route: `app/api/list/route.ts`
- Data mapping: `lib/data.ts:1361-1405`
- Create operations use `serviceClient()`.
- Shared-list read fallback uses `anonClient()` for `shared_list_slugs`; shared-trip read uses service client first and legacy slug-only fallback second.
- Published venue filtering preserves caller order and removes non-published slugs.
- Verification: static boundary test PASS.

### Analytics / event taxonomy

- Route: `app/api/event/route.ts`
- Parser: `lib/actions/event-safety.ts`
- Compatibility boundary: `lib/actions/event-compat.ts`
- Storage: `lib/actions/event-store.ts`
- Migration contract: `supabase/migrations/0056_saved_place_trip_extension.sql`, `0058_shortlist_generated_event.sql`
- Consent: without `CONSENT_COOKIE=granted`, route returns `{ok:true, skipped:"no-consent"}` and does not mint guest identity.
- Storage: six additive event types use `log_event_v2`; other allowlisted events use legacy `log_event`; missing v2 codes fall back to legacy.
- Verification: `bash scripts/wave2-event-db-smoke.sh` **PASS** in isolated local test database. This is not evidence of production event delivery.

## Static test results

| Check | Result | Meaning |
|---|---:|---|
| `node --test scripts/wave1-trip-boundary.test.mjs` | **14/14 PASS** | save/trip/share migration and route contract is internally consistent |
| `bash scripts/wave2-event-db-smoke.sh` | **PASS** | event RPC allowlist/grants work in isolated smoke DB |
| TypeScript route syntax checks for save/trip/event/list | **PASS** | no syntax error in inspected routes |
| `node --test scripts/wave2-product-boundary.test.mjs` | **17 PASS / 3 FAIL** | pre-existing source/test drift remains |

The product-boundary failures include assertions for `StartYourShortlist` and venue pilot copy that do not match current source text. They were not changed because this task is audit-only. The full failing output is from the test command, not a new production diagnosis.

## Confirmed runtime-facing conclusions

1. Save/trip/share writes are intentionally server-side service-role operations; browser roles are not granted direct execution of protected RPCs.
2. The API routes perform public publication checks before write operations.
3. Shared reads have compatibility fallbacks for older slug-only rows.
4. Event collection is consent-gated and allowlisted.
5. The isolated smoke database proves migration-level behavior, not deployed Supabase state.

## Remaining unknowns

1. Whether the production database has all migrations applied in the expected order.
2. Whether production `service_role` can execute every current RPC signature.
3. Whether production `log_event_v2` exists; application fallback handles missing codes but live delivery is unverified.
4. Current production event counts, error rates and consent distribution.
5. Current live DB population of intent-support fields.
6. Current production route behavior after deployment.
7. Exact count reconciliation between shadow intent registry, page registry and file-system routes was not completed because the automated count command timed out awaiting approval; no count is invented here.

## Registry closure

The shadow registry is still not a complete governance source of truth:

- `docs/seo/os/intent-registry.json` declares intent keys, owners, conflicts and publication rules.
- `docs/seo/os/page-registry.json` contains route-type entries, many with `intent_id: null` and `os_gate_status: shadow_unreviewed`.
- `lib/intents.ts` is the runtime SEO job vocabulary used to match venue `jobs`.
- Several route/config surfaces are not represented by a canonical `internal_intent_id` in the shadow registry.

Therefore the registry status remains:

```text
DOCS_ONLY / SHADOW GOVERNANCE
```

It must not be treated as proof that all current routes have one approved intent owner.

## OWNER_DECISIONS_REQUIRED

1. Approve canonical intent vocabulary and aliases.
2. Decide whether shadow registry becomes the governance source of truth.
3. Approve reconciliation of Plan moments, catalogue moments, missions, scenarios and SEO jobs.
4. Decide whether source/test drift is in scope for a separate implementation task.
5. Authorize live read-only Supabase verification before any claim about deployed RPC/migration state.
6. Authorize live analytics read-only inspection before reporting event health.

## No production changes

- No code edited.
- No database written.
- No migration applied.
- No route or SEO page changed.
- No deploy performed.
- No venue cleanup performed.

## Handoff

STATUS: PARTIAL / CODE-AND-SMOKE VERIFIED; LIVE UNKNOWN
FILES_CREATED: `docs/audits/OTHER_BALI_INTENT_OS_PHASE2_CLOSURE_2026-07-28.md`
FILES_CHANGED: audit artifact only
SOURCES_REVIEWED: save/trip/list/event API routes, data RPC mappings, migrations, boundary tests, event compatibility/store layer, shadow registries
UNRESOLVED_ISSUES: production migration/runtime state, event delivery/counts, live field coverage, registry count reconciliation, source/test drift
OWNER_DECISIONS_REQUIRED: six decisions above
QUALITY_SCORE: 84/100 for code/RPC audit; not a production readiness score
RECOMMENDED_NEXT_STEP: owner approves registry model, then perform explicitly authorized live read-only Supabase/runtime verification
