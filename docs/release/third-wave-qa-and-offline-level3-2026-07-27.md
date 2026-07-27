# Other Bali — third-wave QA and Offline Level 3 decision

Date: 2026-07-27  
Timezone: Asia/Makassar  
Release baseline: `origin/main` at `ae6b5087abaf7d3f7f03ffc5a93379862d3787ee`  
Native release: iOS 1.0 (5), Android 1.0.0 (4)

## Decision

Status: **GO WITH LIMITATIONS** for the already published light native shell and
Offline Levels 1–2. **NO-GO** for advertising or activating Offline Level 3.

Offline Level 3 is part of the approved third-wave architecture. Mapbox is the
recommended implementation provider, subject to a credentialed Bali spike. The
existing fail-closed state must remain in production until every provider gate
below passes.

Google Maps remains the online external navigation handoff. Google Routes is
not selected as the Offline Level 3 engine because its content-caching policy
does not support the required durable offline route/map pack model.

## Scenario evidence

Result labels are `PASS`, `BLOCKED`, `NOT CHECKED`; confidence is stated
explicitly.

| Scenario | Result | Confidence | Evidence / limitation |
|---|---|---|---|
| iPhone install and launch | PASS | verified | Physical iPhone 16 Pro Max accepted and launched the development-signed `com.otherbali.app` 1.0 (5); the process remained alive during the launch observation. |
| Airplane/offline truth | PASS at contract level; physical rerun BLOCKED | automated verified / device not checked | Cached content is used; live opening, traffic and travel time are never claimed offline. The user also observed the light offline fallback. The iPhone is no longer visible to CoreDevice, so the complete physical-device route was not rerun for this report. |
| Location denied | PASS | automated verified | `location denial preserves the manual-area product path`; no precise position is stored by the selection flow. |
| Maps handoff and return | PASS | automated verified | Navigation session records `away → returned`, restores Other Bali state, and persists no coordinates or Maps URL. The provider owns route guidance. |
| Restart / position restoration | PASS | automated verified | Capacitor Preferences persist the selected surface, detail/route state, scroll position, discovery index and navigation session with serialized writes and recovery from interrupted writes. |
| Cache integrity and bounds | PASS | automated verified | IDs and public snapshots are parsed defensively and bounded; corrupt entries are discarded individually; route snapshots are capped at 100; stale/live claims are separated. |
| Offline mutation replay | PASS | automated verified | Mutations require bounded idempotency keys and replay exactly once; conflicts remain explicit. |
| Memory | BLOCKED | not checked on current release device | Requires an attached physical device and Instruments Allocations/Leaks trace across Discover → Today → Trip → Companion → Maps → return. |
| Battery | BLOCKED | not checked on current release device | Requires an attached physical device and Instruments Power Profiler trace with location and map usage. |
| Cache size on device | BLOCKED for Level 3 | not applicable before provider pack | Levels 1–2 use bounded Preferences data. Tile-pack size, eviction and removal UI cannot be measured before the credentialed provider pack exists. |
| Current Android store build on real hardware | BLOCKED | not checked | No Android device is attached. Earlier Android evidence belongs to an older artifact and is not substituted for version code 4. |

Automated command:

```text
npm run test:v12:integration
42 tests passed, 0 failed

node --import tsx --test scripts/mobile-storage.test.ts \
  mobile/tests/adaptive-companion.test.ts \
  mobile/tests/offline-bali.test.ts \
  lib/contracts/errors-v1.2.test.ts \
  lib/journey/journey.test.ts \
  lib/integrations/routing-provider.test.ts
35 tests passed, 0 failed
```

## Provider spike decision

### Recommended: Mapbox

Mapbox is the only evaluated candidate that matches the required product shape:

- downloadable map regions and explicit pack removal/progress;
- offline turn-by-turn routing and rerouting;
- shared tile storage for maps and navigation;
- iOS and Android SDK parity;
- an MAU/trip-based commercial model that can be measured before rollout.

The recommendation is **conditional**, not provider acceptance. The following
official sources define the current basis:

- Maps SDK pricing: <https://www.mapbox.com/pricing>
- Android Navigation pricing: <https://docs.mapbox.com/android/navigation/guides/pricing/>
- Android offline navigation: <https://docs.mapbox.com/android/navigation/guides/advanced/offline/>
- iOS offline regions: <https://docs.mapbox.com/ios/maps/examples/offline-manager/>
- iOS Navigation offline routing: <https://docs.mapbox.com/ios/navigation/guides/>
- Telemetry and required user opt-out: <https://www.mapbox.com/telemetry>

### Rejected for Level 3 engine: Google Routes

Google Maps remains useful for online external handoff, but Google Routes is
not compatible with the intended durable offline pack because caching is
restricted and routed content displayed on a map must follow Google display
and attribution rules.

- Routes policies: <https://developers.google.com/maps/documentation/routes/policies>
- Routes billing: <https://developers.google.com/maps/documentation/routes/usage-and-billing>
- Google Maps Platform pricing: <https://developers.google.com/maps/billing-and-pricing/pricing>

## Gates before Mapbox can be accepted

1. Owner creates or designates a Mapbox organization and billing account.
2. Create a URL/app-restricted public runtime token and a separate secret
   downloads token; neither may be committed to Git.
3. Run Bali route-quality tests for car, walking and motorbike expectations
   across Ubud, Canggu/Seminyak, Uluwatu, Sanur and at least one inter-area
   corridor. Unsupported modes must be labelled honestly.
4. Measure Today, Trip, Area and Route Corridor pack sizes at the chosen zoom
   range on both iOS and Android.
5. Verify download, pause/resume, update, expiry, removal, storage-pressure and
   app-upgrade behavior.
6. Verify airplane-mode map, GPS dot, saved stops, cached route geometry,
   next-stop guidance and offline search.
7. Verify telemetry disclosure and the required opt-out in both native apps.
8. Run memory and Power Profiler/Android energy traces on physical devices.
9. Only after all gates pass may the production manifest change from
   `blocked_pending_acceptance` to `available`.

## Required implementation after credentials exist

- Native Mapbox Maps and Navigation adapters behind the existing provider
  interface.
- Today, Trip, Area and Route Corridor pack manager with size estimate,
  progress, freshness, update and removal.
- Offline index for saved places/stops and bounded public search.
- Cached route geometry, legs and next-stop guidance without live traffic or
  “open now” claims.
- Exactly-once sync queue and visible conflict handling.
- Storage controls and telemetry opt-out.
- Real-device iOS and Android acceptance matrix.

Until those steps are complete, the existing “Offline Level 3 — Not activated”
UI and fail-closed API/runtime behavior are correct and must not be removed.
