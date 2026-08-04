# Other Bali v1.2 P0 closure verification

Date: 2026-07-28
Branch: `codex/v12-p0-closure`

## Closed in code

- Mobile sync removes a queued mutation only after an exact `applied`
  acknowledgement for the same idempotency key.
- Retry and version-conflict responses retain the durable local queue.
- Migration `0064_v12_sync_apply.sql` applies typed Saved, Today, Trip,
  Visited, and Note state, returns stable entity versions, and keeps an ordered
  pull cursor.
- Sync idempotency keys are bound to the exact request. Matching legacy
  `accepted` rows are reconciled; changed replays fail closed.
- Event storage unavailability returns a typed `503` with `no-store`; a healthy
  empty event table remains `200` with `events: []`.
- Mapbox activation requires both provider enablement and physical-device
  acceptance. Native plugins continue to report `onboardRouting: false`.
- Native Mapbox telemetry initializes disabled. The privacy policy discloses
  offline map and location processing and the absence of current onboard
  routing.
- Android CI receives the Mapbox downloads token only in the preflight and
  Gradle steps. The repository secret exists; its value was never printed or
  written to the repository.

## Verification completed

- `npm run test:v12:integration`: 78 passed.
- `npm test`: 302 passed.
- `npm run lint`: zero errors; one pre-existing `no-img-element` warning.
- `npx tsc --noEmit --incremental false`: passed.
- `npm run build`: passed with 153 generated pages.
- Android `lint test assemblePlayDebug`: passed with the downloads token read
  directly from macOS Keychain.
- iOS release preflight and source privacy-manifest checks passed. The unsigned
  archive did not reach compilation because Xcode remained in the upstream
  Mapbox Navigation Swift-package fetch; the bounded local attempt was stopped
  and must be repeated in the macOS CI/archive gate.
- Clean PostgreSQL 17 rehearsal:
  - applied `0061_v12_runtime_persistence.sql`;
  - applied `0063_v12_event_occurrences.sql`;
  - applied `0064_v12_sync_apply.sql`;
  - exercised Save, exact replay, version conflict, event Add to Today, and Trip
    replace through `v12_runtime_mutate`;
  - verified canonical and typed state rows.

## Production gates that remain closed

- The Supabase CLI account visible in this environment does not contain the
  production project `egkdapqwkfprtyqvvnso`. Production migration ledger
  reconciliation and application of `0063`/`0064` therefore cannot be asserted
  from this credential context.
- `OFFLINE_MAPBOX_DEVICE_ACCEPTANCE_PASSED` must remain unset/false until native
  offline routing exists and the physical iOS/Android acceptance matrix passes.
- Event population from Telegram remains paused by owner decision. No event is
  invented to make the feed non-empty.
