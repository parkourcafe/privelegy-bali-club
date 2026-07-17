# Other Bali 1.0 release line

Status: release candidate in progress. This is the canonical evidence ledger;
it is not a claim that signed artifacts were submitted or published.

## Canonical line

- Branch: `release/other-bali-1.0`
- Production integration base: `0cca444b09c1b76308d2722aca2f9ab0949ffef8`
- Web/API origin: `https://www.otherbali.com`
- iOS: `com.otherbali.app`, version `1.0`, build `4`, minimum iOS 15
- Android: `com.otherbali.app`, version `1.0.0`, version code `2`, minimum API 24, target API 36
- Native shell: the same bundled Capacitor `Places / Routes / Saved` product on iOS and Android

The superseded `android-twa/` wrapper has been removed from this release branch.
The old `loop/05-release-integration` branch is not a release source; it
conflicts with the current native product, production pages and migration
history.

## Production API and database

No database migration is required for the 1.0 mobile catalogue. The API reads
the production `venues`, `districts`, `routes`, `route_stops` and `plan_entries`
structures already used by the website. Do not apply the old `0035`–`0041`
migration series as part of this release.

Verified against production source `0cca444b09c1`:

- `/api/mobile/v1/bootstrap`: HTTP 200, schema 1, 89 venues, 15 districts, 3 routes
- `/api/mobile/v1/config`: HTTP 200
- `/api/health/live`: HTTP 200
- `/api/health/ready`: HTTP 200
- `/.well-known/apple-app-site-association`: HTTP 200 JSON
- `/.well-known/assetlinks.json`: intentionally absent until final store signing certificates exist

Mobile/config/health requests are identity-free and do not mint `bp_guest`.
The current release patch extends the same exact-path exemption to AASA and
Digital Asset Links responses.

## Implemented release boundaries

- Versioned, bounded, read-only `/api/mobile/v1` contracts with public DTOs.
- Bundled catalogue, network state, local saves and timestamped offline copies.
- Exact deep links for `/places/*` and `/route/*`.
- Native share, Android hardware Back, and controlled external Maps/site handoffs.
- AASA source plus iOS `applinks:www.otherbali.com` entitlement.
- Capacitor Android 8 with target SDK 36, cleartext disabled, backup disabled,
  and only `INTERNET`/network-state permissions.
- Separate fail-closed Google Play upload and RuStore app-signing inputs.
- Fail-closed `assetlinks.json` generator requiring final Play app-signing and
  RuStore app-signing SHA-256 fingerprints; placeholders/debug fingerprints are rejected.
- Native privacy manifest: tracking false; Coarse Location, Product Interaction,
  and Other Diagnostic Data declared as linked and used for App Functionality;
  Capacitor Preferences `UserDefaults` reason `CA92.1` retained. These
  conservative declarations cover Vercel's short-lived operational request logs.

## Local and device evidence

- Node 22 / Java 21 / Gradle 8.14.3 / Android SDK 36 toolchain.
- Gradle distribution and wrapper checksums match the official Gradle 8.14.3 checksums.
- `npm test`, TypeScript, ESLint and Next production build are release gates.
- Final local gate run: 86 Node tests pass; TypeScript passes; ESLint has
  zero errors (one pre-existing Next `<img>` warning); the 95-page Next
  production build passes.
- Unsigned iOS Release simulator build passes, including the Xcode-integrated
  release-shell and privacy-manifest preflight.
- Android lint, unit tests, instrumented-test assembly and `assemblePlayDebug`
  pass; the final Gradle run completed 601 tasks successfully.
- Both store signing checks fail closed when protected credentials are absent.
- Debug APK package inspection: `com.otherbali.app`, version code 2, target 36,
  min 24, no sensitive permissions. `apksigner` confirms that this candidate
  uses only the Android Debug certificate and is not a production artifact.
- Connected Samsung SM-A075F / Android 16: catalogue, place details, routes,
  saves, persistence, warm/cold deep links, Share, Back, Google Maps, Privacy,
  offline relaunch and online recovery passed on the final debug candidate.
  Saved place and route state also survived the in-place candidate update and
  relaunch; a fresh online catalogue refresh completed afterwards.
- The old iPhone build 3 remains installed; clean-install testing of build 4 is
  pending explicit permission and a valid signed candidate.

## Remaining release gates

1. With owner approval, enable Apple Associated Domains for the App ID,
   regenerate profiles and obtain a valid Apple Distribution signing path.
2. With owner approval, create and securely back up a dedicated Google Play
   upload key and a dedicated RuStore app-signing key.
3. Enroll in Play App Signing, record its final app-signing certificate, generate
   `assetlinks.json` with the Play and RuStore final fingerprints, deploy it and
   verify HTTPS 200/no redirect/no cookie.
4. Produce signed IPA, Play AAB and RuStore APK artifacts; verify identities,
   entitlements, signatures and SHA-256 checksums.
5. Clean-install and test those exact signed artifacts on the physical iPhone
   and Samsung.
6. Capture final screenshots from those binaries and finalize privacy/listing
   declarations. Submission/publication remains a separate explicit approval.
