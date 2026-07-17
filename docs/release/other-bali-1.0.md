# Other Bali 1.0 release line

Status: release candidate in progress. This file is an evidence ledger, not a
claim that store submission or production rollout is complete.

## Canonical line

- Branch: `release/other-bali-1.0`
- Integration base: `origin/main` at `81542d3`
- Web/API origin: `https://www.otherbali.com`
- iOS: `com.otherbali.app`, version `1.0`, build `4`
- Android: `com.otherbali.app`, version `1.0.0`, version code `1`

The branch is based on current production and selectively adds the mobile/API
closure. It must not be replaced by a mechanical merge of
`loop/05-release-integration`; that branch conflicts with current production
pages, partner work and the migration history.

## Database decision

No database migration is required for the 1.0 mobile catalogue. The public API
uses the production `venues`, `districts`, `routes`, `route_stops` and
`plan_entries` structures that the website already reads. The readiness probe
checks those exact public/RLS reads and refuses readiness for an unavailable
backend or a catalogue with no deliverable venue.

Do not apply the old `0035`–`0041` migration series as part of this release.
Its numeric prefixes collide with current main, and it changes unrelated
privacy, onboarding, partner and photo-review semantics. Any future database
reconciliation requires a read-only production catalogue snapshot, a staging
rehearsal and new forward-only timestamped migrations.

## Implemented release boundaries

- Versioned, bounded, read-only `/api/mobile/v1` contracts with public DTOs.
- Identity-free mobile and health requests; no `bp_guest` cookie is minted for
  these paths.
- `/api/health/live` and bounded `/api/health/ready` endpoints.
- Bundled iOS catalogue with offline saved state, network state, universal-link
  parsing, native share and controlled external Maps/site handoffs.
- Exact venue Maps handoffs only; generated Google Maps searches are not
  presented as verified venue links.
- AASA source and iOS associated-domain entitlement for
  `applinks:www.otherbali.com`.
- Android target SDK 36 and fail-closed release signing configuration.
- Native privacy manifest: no tracking or data collection by the bundled
  read-only app; `UserDefaults` reason `CA92.1` for Capacitor Preferences.

## Local evidence completed

- `npm test`: 70 tests passed.
- `npm run typecheck`: passed.
- `npm run lint`: no errors (one pre-existing `<img>` performance warning).
- `npm run ios:native-readiness`: passed.
- Xcode 26.3 unsigned Release simulator build: passed.
- Android `lint assembleDebug`: passed on SDK 36 / Java 17.
- Android release signing gate: correctly fails when protected keystore inputs
  are absent.

## Remaining release gates

1. Rebase and rerun the full build on the frozen current `origin/main` head.
2. Deploy the exact release candidate to production and verify HTTP 200 plus a
   non-empty mobile bootstrap payload.
3. Enable Associated Domains for the Apple App ID and regenerate/download the
   matching provisioning profile.
4. Create and securely back up the Android app-signing and Play upload keys;
   publish the final certificate fingerprints in `assetlinks.json`.
5. Produce signed IPA, AAB and APK artifacts and record their checksums.
6. Clean-install and test the exact signed candidates on a physical iPhone and
   the connected Samsung.
7. Capture screenshots from those binaries, then finalize store privacy and
   listing declarations. Do not submit or publish without an explicit final
   approval.
