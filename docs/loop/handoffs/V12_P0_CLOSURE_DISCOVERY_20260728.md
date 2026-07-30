# Other Bali v1.2 P0 closure — discovery note

Date: 2026-07-28
Branch: `codex/v12-p0-closure`
Baseline: `origin/main` at merge commit `61ddb8271912b4be26ecdf2f79f08c089e247eb2`

## Scope approved by owner

1. Close P0 runtime sync semantics.
2. Verify and harden EventOccurrence migration/API behavior.
3. Make Mapbox capability, telemetry and privacy claims fail closed.
4. Restore GitHub Actions Android verification using a managed
   `DOWNLOADS:READ` credential.
5. Only after P0 is green, continue Feed/Decision/Trip, Offline Level 3 and
   Integrated Navigation in that order.

## AS-IS findings

- `sync.push` records an accepted mutation but does not apply the user state
  change or evaluate `baseVersion`.
- The mobile client removes a queued mutation after any successful HTTP
  response, so an accepted-but-unapplied mutation can be lost locally.
- `getActiveMobileEvents()` converts a missing table or database error into a
  successful empty event list.
- Production currently returns an empty event list; application of migration
  `0063_v12_event_occurrences.sql` has not been proven by the connected
  production ledger.
- Mapbox Level 3 is correctly disabled in production, but the enabled manifest
  path can claim onboard routing even though both native adapters report it as
  unavailable.
- The privacy page does not yet disclose the Mapbox SDK/location telemetry
  behavior required before activation.
- GitHub Actions main run `30287219898` fails resolving Mapbox Android artifacts
  with HTTP 401 because the repository workflow has no usable secret download
  token.

## Authority conflict

The focused v1.2 specification requests in-app navigation. Master V3.1 and
`AGENTS.md` assign routing, ETA, traffic and turn-by-turn to Google Maps and
forbid a Maps clone without an explicit dated architecture amendment. P0 work
will remain fail closed and will not activate in-app navigation. Before the
Integrated Navigation phase, the owner's current instruction must be recorded
as a dated Decision Log amendment defining the allowed Mapbox boundary.

## Implementation constraints

- Never edit already-applied migrations; add a new migration after ledger
  reconciliation.
- Default deny and service-role-only RPC execution remain mandatory.
- Event/database errors must be observable and must not be represented as an
  authoritative empty result.
- A mutation may leave the local queue only after the server returns
  `status=applied` for the same idempotency key.
- No provider token may be committed, printed or exposed to client JavaScript.
- `OFFLINE_MAPBOX_LEVEL3_ENABLED` remains disabled until device, privacy and
  operational gates pass.

## First vertical slices

1. Server sync mutation outcome: return `applied` only after durable application;
   otherwise return a typed conflict/error.
2. Mobile queue acknowledgement: retain non-applied and conflict mutations.
3. Event read failure: typed 503 response with no stale cache.
4. Mapbox capability truth: native capability is authoritative and routing is
   never inferred from a server flag.
5. CI credential wiring: secret reaches Gradle without entering logs or source.
