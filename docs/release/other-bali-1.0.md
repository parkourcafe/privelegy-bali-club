# Other Bali 1.0 release line

Status: release candidate in progress. This is the canonical evidence ledger;
it is not a claim that signed artifacts were submitted or published.

## Canonical line

- Branch: `release/other-bali-1.0`
- Production integration base: `83a3353a535baa263d3a7d44fdc65a23838bb108`
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
were reverified after integrating current `main` (`83a3353a535b`); Vercel reports
the active production deployment as `dpl_7sK57Jga4ySBsCtE5jBYqyKXYMJU`, but does
not expose its Git commit through the available read-only CLI response:

- `/api/mobile/v1/bootstrap`: HTTP 200, schema 1, 89 venues, 15 districts, 3 routes
- `/api/mobile/v1/config`: HTTP 200
- `/api/health/live`: HTTP 200
- `/api/health/ready`: HTTP 200
- `/.well-known/apple-app-site-association`: HTTP 200 JSON
- `/.well-known/assetlinks.json`: intentionally absent until final store signing certificates exist

Mobile/config/health requests are identity-free and do not mint `bp_guest`.
The current release patch extends the same exact-path exemption to AASA and
Digital Asset Links responses. That AASA/Digital Asset Links exemption is not
live until the release patch is merged and deployed with owner authorization.

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
  to run without an explicit authorization phrase, a clean tree and an Apple
  Distribution identity for team `KB7VPWHTTM`.
- Native privacy manifest: tracking false; Coarse Location, Product Interaction,
  and Other Diagnostic Data declared as linked and used for App Functionality;
  Capacitor Preferences `UserDefaults` reason `CA92.1` retained. These
  conservative declarations cover Vercel's short-lived operational request logs.

## Local and device evidence

- Node 22 / Java 21 / Gradle 8.14.3 / Android SDK 36 toolchain.
- Gradle distribution and wrapper checksums match the official Gradle 8.14.3 checksums.
- `npm test`, TypeScript, ESLint and Next production build are release gates.
- Final local gate run: 102 Node tests pass; TypeScript passes; ESLint has
  zero errors (one pre-existing Next `<img>` warning); the 95-page Next
  production build passes.
- Unsigned iOS Release simulator build passes, including the Xcode-integrated
  release-shell and privacy-manifest preflight.
- The optional iOS archive CI gate is manual-only, so it does not consume a
  macOS runner until an authorized release operator explicitly starts it.
- Android lint, unit tests, instrumented-test assembly and `assemblePlayDebug`
  pass; the final Gradle run completed 601 tasks successfully.
- Both store signing checks fail closed when protected credentials are absent.
- Store-asset validation passes for the final-size Apple, Google Play and
  RuStore icons plus the Google Play 1024 x 500 feature graphic; final device
  screenshots remain intentionally pending signed-device QA.
- Debug APK package inspection: `com.otherbali.app`, version code 2, target 36,
  min 24, no sensitive permissions. `apksigner` confirms that this candidate
  uses only the Android Debug certificate and is not a production artifact.
- Connected Samsung SM-A075F / Android 16: catalogue, place details, routes,
  saves, persistence, warm/cold deep links, Share, Back, Google Maps, Privacy,
  offline relaunch and online recovery passed on the final debug candidate.
  Saved place and route state also survived the in-place candidate update and
  relaunch; a fresh online catalogue refresh completed afterwards.
- Machine-readable preliminary evidence is recorded in
  `docs/release/device-matrix.json`: the APK pulled back from the installed app
  exactly matched SHA-256 `3ab51166…dabf98`. The ledger explicitly marks this
  as debug/in-place evidence and keeps all signed clean-install rows pending.
- The old iPhone build 3 remains installed; clean-install testing of build 4 is
  pending explicit permission and a valid signed candidate.

## Remaining release gates

Owner-only facts and action-time permissions are consolidated in
`docs/release/owner-release-inputs.md`; secrets and identity documents must not
be committed.

1. With owner approval, create/merge the release PR, deploy the exact release
   commit, and reverify mobile bootstrap/config/health plus AASA on production.
2. With owner approval, enable Apple Associated Domains for the App ID,
   regenerate profiles and obtain a valid Apple Distribution signing path.
3. With owner approval, create and securely back up a dedicated Google Play
   upload key and a shared Android app-signing key for RuStore distribution and
   Play App Signing enrolment. A store-specific Play distribution key is an
   explicit owner choice because it prevents cross-store updates.
4. Enroll in Play App Signing, export both final public certificates, generate
   `assetlinks.json` with the Play and RuStore final fingerprints, deploy it and
   verify HTTPS 200/no redirect/no cookie.
5. Produce signed IPA, Play AAB and RuStore APK artifacts; verify identities,
   entitlements, signatures and SHA-256 checksums.
6. Clean-install and test those exact signed artifacts on the physical iPhone
   and Samsung.
7. Capture final screenshots from those binaries and finalize privacy/listing
   declarations. Submission/publication remains a separate explicit approval.
