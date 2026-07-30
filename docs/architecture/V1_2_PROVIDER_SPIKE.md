# v1.2 routing, maps and navigation provider spike

Status: **conditional / fail-closed**  
Reviewed: 2026-07-27  
Production-safe now: coordinate-specific Google Maps universal URL handoff only

This is a documentation and adapter-boundary spike, not provider acceptance.
No credentialed API was called and no Bali route-quality claim is inferred from
global coverage tables. Prices and limits change; re-check the linked provider
pages immediately before a commercial commitment.

## Decision

| Provider | Safe use now | Blocked use | Status |
| --- | --- | --- | --- |
| Google Maps URLs | External directions handoff. No API key required. | None implied: the returned route, ETA and traffic remain Google Maps UI truth. | **AVAILABLE** |
| Google Routes API | None in production yet. | ETA, matrix, traffic-aware routes and polylines need billing, server credentials, quotas, attribution/privacy UI and Bali acceptance tests. | **UNKNOWN-BLOCKED** |
| Mapbox Maps / Navigation SDK | None in production yet. | Embedded/offline maps and navigation need account/token setup, native SDK integration, telemetry control, attribution, storage budget and device/route acceptance. | **UNKNOWN-BLOCKED** |
| Grab | Ordinary user-selected use of the installed Grab app is outside this adapter. | No public consumer ride deep-link/API contract was verified, so Other Bali must not construct ride quotes, bookings, ETAs or destination handoffs. | **UNKNOWN-BLOCKED** |

`ExternalDirectionsOnlyRouteService` is therefore the production-safe Phase 1
adapter. Estimate, traffic, matrix, embedded navigation and offline capability
calls fail with `ROUTE_PROVIDER_UNAVAILABLE`; they never return guessed values.

## Google findings

- Maps URLs are universal web/app links, require `api=1`, have a 2,048-character
  limit, and require no API key. Directions accept coordinate origin and
  destination plus `driving`, `walking`, `bicycling`, `two-wheeler`, or
  `transit`. Indonesia is listed for two-wheeler routing. The adapter maps
  Other Bali `scooter` to `two-wheeler`, not generic driving.
  [Maps URLs](https://developers.google.com/maps/documentation/urls/get-started)
  · [two-wheeler coverage](https://developers.google.com/maps/documentation/routes/coverage-two-wheeled)
- Routes API requires billing and API key/OAuth. Compute Routes is billed per
  query and Route Matrix per element, with Basic/Advanced/Preferred SKU
  selection based on requested features. The documented default limits are
  3,000 Compute Routes QPM and 3,000 matrix EPM, but project quotas and current
  prices must be checked in Cloud Console before enablement.
  [usage and billing](https://developers.google.com/maps/documentation/routes/usage-and-billing)
- Google restricts caching of most Routes API content (place IDs are an explicit
  exception). Routes content on a non-Google map has attribution requirements;
  an Other Bali offline pack must not persist Google route responses as its own
  durable route database.
  [Routes policies and attribution](https://developers.google.com/maps/documentation/routes/policies)

Google Routes remains a credible **online estimate** candidate, not an approved
offline map/navigation solution. A server-only proxy, restricted credential,
field mask, cost limit, privacy disclosure and attribution design are mandatory.

## Mapbox findings

- Current mobile Maps SDKs support user-selected offline regions through style
  packs and tile regions. Offline resources do not refresh automatically; the
  app must expose download progress, size, refresh and delete controls. Current
  Android documentation records a cumulative 750 tile-pack constraint.
  [offline overview](https://docs.mapbox.com/android/maps/guides/offline/)
  · [offline data management](https://docs.mapbox.com/android/maps/guides/offline/manage-offline-data/)
- Current Navigation SDK documentation describes online/offline routing and
  rerouting. That makes Mapbox the strongest technical candidate for roadmap
  Levels 3–4, but it does not prove Bali route quality or product fitness.
  [Android offline navigation](https://docs.mapbox.com/android/navigation/guides/advanced/offline/)
  · [iOS Navigation SDK](https://docs.mapbox.com/ios/navigation/guides/)
- Mapbox maps require visible wordmark/attribution. Its mobile SDK sends
  location/usage telemetry by default and requires an individual opt-out path;
  this needs product/privacy review before SDK initialization.
  [Android Maps SDK conditions](https://docs.mapbox.com/android/maps/guides/)
- Maps and Navigation have separate usage/billing concepts. Navigation offers
  metered-trip and MAU options; initializing both maps and navigation can incur
  both categories. Use the live calculator with expected MAU/trips immediately
  before selection.
  [Navigation pricing guide](https://docs.mapbox.com/android/navigation/guides/pricing/)
  · [live pricing](https://www.mapbox.com/pricing)

Mapbox acceptance needs native proof-of-concepts on representative low/mid/high
Android and iOS devices, a bounded Bali pack-size matrix, airplane-mode
navigation, expiry/refresh behavior, battery/thermal measurements and route
review by a Bali operator.

## Grab findings

Grab publicly confirms consumer transport availability in Bali, including
GrabCar and GrabBike, and documents Bali-specific airport booking behavior.
Those facts establish market presence, not an integration contract.
[Bali service statement](https://www.grab.com/id/en/press/business/grab-bekerja-sama-dengan-kophrindo-untuk-meningkatkan-pengalaman-berkendara-para-wisatawan-di-bandara-internasional-i-gusti-ngurah-rai-bali/)
· [Bali airport advance-booking terms](https://www.grab.com/id/terms-policies/advance-booking-terms/)

The official sources reviewed did not expose a stable public consumer ride
deep-link schema or routing/quote API suitable for Other Bali. Until Grab gives
written partner documentation and test credentials, show at most neutral copy
such as “Open your ride app”; do not generate `grab://` links, fares, pickup
claims, booking states, or inferred availability.

## Required acceptance gates

1. Owner chooses the commercial candidate and billing account.
2. Legal/privacy review covers terms, caching, attribution, location retention,
   telemetry/consent and deletion.
3. Credentials are stored server-side or in the provider-approved native
   mechanism, scoped by app/domain/API and excluded from logs.
4. Automated adapter contract tests pass for no-path, timeout, quota, malformed
   response, unavailable network and credential rejection.
5. A Bali field set covering south Bali, Ubud, north/east, Nusa Penida and
   scooter/car/walk is reviewed against real journeys. Provider coverage is not
   a substitute for this test.
6. iOS/Android parity, accessibility, attribution, storage, battery, refresh,
   delete and airplane-mode evidence is attached.
7. Cost alerts, hard quotas, kill switch, external Google Maps fallback and
   rollback are rehearsed before production enablement.

Until every applicable gate passes, `ROUTING_PROVIDER_CAPABILITIES` must remain
blocked for Google Routes, Mapbox and Grab.
