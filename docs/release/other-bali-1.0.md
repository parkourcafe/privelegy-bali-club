# Other Bali 1.0 release line

Status: release candidate in progress. This is the canonical evidence ledger;
it is not a claim that signed artifacts were submitted or published.

## Canonical line

- Branch: `release/other-bali-1.0`
- Signed-artifact source commit: `9d1e854f863354b2955a4573186ff868dee24cab`
- Last merged production integration: `b287fea91b11e15fccd056b268b419eef7c6ebbb`
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

The mobile API contract entered production at `0cca444b09c1`. The last merged
production baseline was reverified on 18 July 2026 at
`b287fea91b11e15fccd056b268b419eef7c6ebbb`; both health endpoints identified
that production integration. The candidate in this release branch still
requires the same live checks after its merge and production deployment:

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
- The current full gate run passed 111 Node tests, TypeScript, ESLint with zero
  errors (one pre-existing image-optimization warning), the 103-page Next
  production build and the complete unsigned iOS Release simulator verifier.
- Unsigned iOS Release simulator build passes, including the Xcode-integrated
  release-shell and privacy-manifest preflight.
- The optional iOS archive CI gate is manual-only, so it does not consume a
  macOS runner until an authorized release operator explicitly starts it.
- Android lint, unit tests, instrumented-test assembly and `assemblePlayDebug`
  pass; both signed store variants also built and passed the artifact verifier.
- Both store signing checks fail closed when protected credentials are absent.
- A separate Play upload key and a shared Android app-signing/RuStore key are
  stored outside Git with passwords in macOS Keychain. The current Play AAB is
  upload-key-signed (`d756f75f…555be`) and the current RuStore APK is signed by
  the shared app-signing key (`72982a07…8c00`). Their exact signatures,
  package/version/SDK contract and bundled source hash were verified together
  with the IPA by `mobile:release:verify`.
- Store-asset validation passes for the final-size Apple, Google Play and
  RuStore icons plus the Google Play 1024 x 500 feature graphic. Both five-shot
  marketing sets pass exact dimension, opacity, source-hash and per-file hash
  validation.
- Samsung SM-A075F / Android 16 passed a clean install of the exact current
  RuStore APK. Catalogue, details, routes, saved-state persistence, ordinary
  warm/cold HTTPS deep links, Share cancellation, Back, Google Maps, Privacy,
  offline relaunch, online recovery and crash-log review passed. The installed
  base APK was pulled back and matched `72982a07…8c00` byte-for-byte. The
  device's old user-level Disabled link preference survived uninstall and was
  explicitly re-enabled after the domain association itself verified; this is
  recorded without hiding it in `docs/release/device-matrix.json`. The exact
  five Android store captures are separately frozen by per-file hashes in a
  signed-device capture record bound to the same APK, source and QA matrix.
- The current build-4 Apple Distribution IPA (`2996fdb0…b09c`) passed the
  combined verifier with `get-task-allow=false`, the correct team/profile and
  exactly `applinks:www.otherbali.com`. It has not been uploaded.
- Earlier physical-iPhone work applied to a superseded pre-layout archive and
  is not release evidence for the current IPA. Exact current physical-iPhone
  visual QA remains pending because the devices are presently unavailable.
- Five App Store marketing screenshots were captured from a clean install of
  the same verified release shell in an iPhone 17 Pro Max / iOS 26.3
  Simulator. They are exact `1320 x 2868`, opaque 8-bit RGB PNGs and pass the
  store-package validator. Save-state persistence also passed a terminate and
  relaunch check. This simulator evidence is recorded separately and does not
  mark the Apple Distribution IPA as device-tested.

## Remaining release gates

Owner-only facts and action-time permissions are consolidated in
`docs/release/owner-release-inputs.md`; secrets and identity documents must not
be committed.

1. Merge the current release revision, deploy production and repeat
   health/bootstrap/config plus AASA and Digital Asset Links checks.
2. Complete the remaining visual iPhone device matrix. The five App Store
   screenshots are ready from the verified Simulator source, but development-
   signed physical-device QA must remain distinct from the Apple Distribution
   IPA unless a TestFlight upload is separately authorized and tested.
3. Wait for Google to unblock owner verification. Only then create the Play app,
   configure Play App Signing with the prepared upload/distribution keys and
   complete any required device verification or 12-tester/14-day closed test.
4. Create and verify an independent encrypted off-device backup of both Android
   private keys; the protected local copies and Keychain passwords are not a
   sufficient disaster-recovery backup by themselves.
5. Complete the owner-verified legal, privacy, age-rating and contact fields in
   `docs/release/owner-release-inputs.md`. Submission/publication remains a
   separate explicit approval and is not part of this release-preparation run.
