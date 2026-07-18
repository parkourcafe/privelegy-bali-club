# Other Bali 1.0 release line

Status: release candidate in progress. This is the canonical evidence ledger;
it is not a claim that signed artifacts were submitted or published.

## Canonical line

- Branch: `release/other-bali-1.0`
- Last independently verified production integration: `7aa58bf93087c999f332ef0dfd2b8f42a78723d1`
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

The mobile API contract entered production at `0cca444b09c1`. The live endpoints
were reverified on 18 July 2026 at `7aa58bf93087`; both health endpoints
identified that exact production release during the verification:

- `/api/mobile/v1/bootstrap`: HTTP 200, schema 1, 89 venues, 15 districts, 3 routes
- `/api/mobile/v1/config`: HTTP 200
- `/api/health/live`: HTTP 200
- `/api/health/ready`: HTTP 200
- `/.well-known/apple-app-site-association`: HTTP 200 JSON
- `/.well-known/assetlinks.json`: HTTP 200 JSON with the shared Android
  app-signing fingerprint `78:DE:94:…:A6:BA`

Mobile/config/health requests are identity-free and do not mint `bp_guest`.
AASA and Digital Asset Links are also live on exact paths without redirects or
cookies.

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
- Fail-closed post-build verification requires the final IPA, Play AAB and
  RuStore APK together; validates signatures, identities, versions, SDKs,
  permissions, entitlements, privacy manifests and the bundled shell, then
  writes commit/source-hash-bound `release-artifacts.json` and `SHA256SUMS`.
- Signed iOS archive/export is implemented but action-time guarded; it refuses
  to run without an explicit authorization phrase, a clean tree and a valid
  Apple Development identity. Xcode enforces team `KB7VPWHTTM` during archive,
  and the final verifier requires an Apple Distribution-signed IPA for that team.
- Native privacy manifest: tracking false; Coarse Location, Product Interaction,
  and Other Diagnostic Data declared as linked and used for App Functionality;
  Capacitor Preferences `UserDefaults` reason `CA92.1` retained. These
  conservative declarations cover Vercel's short-lived operational request logs.

## Local and device evidence

- Node 22 / Java 21 / Gradle 8.14.3 / Android SDK 36 toolchain.
- Gradle distribution and wrapper checksums match the official Gradle 8.14.3 checksums.
- `npm test`, TypeScript, ESLint and Next production build are release gates.
- Final local gate run: 105 Node tests pass; TypeScript passes; ESLint has
  zero errors (one pre-existing Next `<img>` warning); the 99-page Next
  production build passes.
- Unsigned iOS Release simulator build passes, including the Xcode-integrated
  release-shell and privacy-manifest preflight.
- The optional iOS archive CI gate is manual-only, so it does not consume a
  macOS runner until an authorized release operator explicitly starts it.
- Android lint, unit tests, instrumented-test assembly and `assemblePlayDebug`
  pass; the final Gradle run completed 601 tasks successfully.
- Both store signing checks fail closed when protected credentials are absent.
- A separate Play upload key and a shared Android app-signing/RuStore key are
  stored outside Git with passwords in macOS Keychain. The signed Play AAB is
  SHA-256 `460ab8ae…abb8f2`; the signed RuStore APK is
  `7934db53…60a7d7`. Their signatures, embedded release configuration,
  package, versions and SDK contract pass.
- Store-asset validation passes for the final-size Apple, Google Play and
  RuStore icons plus the Google Play 1024 x 500 feature graphic. Five Android
  1080 x 1920 screenshots were captured from the exact signed RuStore APK on
  the Samsung and contain no alpha channel. iPhone screenshots remain pending.
- Connected Samsung SM-A075F / Android 16: catalogue, place details, routes,
  saves, persistence, warm/cold deep links, Share, Back, Google Maps, Privacy,
  offline relaunch and online recovery passed after a clean install of the
  exact signed RuStore APK. The APK pulled back from the device matched
  `7934db53…60a7d7`; machine-readable evidence is in
  `docs/release/device-matrix.json`.
- Xcode automatic signing has already proven the local archive/export path with
  an Apple Distribution-signed build-4 IPA, `get-task-allow=false` and exact
  `applinks:www.otherbali.com`. That temporary artifact predates the final
  mobile-shell patch; the canonical guarded script must reproduce it from the
  clean merged commit under `artifacts/release/ios`.
- No physical iPhone is currently connected, so destructive clean-install QA
  and the five 6.9-inch screenshots remain pending.

## Remaining release gates

Owner-only facts and action-time permissions are consolidated in
`docs/release/owner-release-inputs.md`; secrets and identity documents must not
be committed.

1. Merge the signing/screenshot evidence PR, deploy that exact commit and
   reverify production health/bootstrap/config plus AASA and Digital Asset Links.
2. Run the authorized guarded iOS build from the clean merged commit and pass
   the combined IPA/AAB/APK release verifier.
3. Connect the physical iPhone, remove any old `com.otherbali.app` installation,
   clean-install build 4, run the full device matrix and capture the five exact
   App Store screenshots.
4. Wait for Google to unblock owner verification. Only then create the Play app,
   configure Play App Signing with the prepared upload/distribution keys and
   complete any required device verification or 12-tester/14-day closed test.
5. Complete the owner-verified legal, privacy, age-rating and contact fields in
   `docs/release/owner-release-inputs.md`. Submission/publication remains a
   separate explicit approval and is not part of this release-preparation run.
