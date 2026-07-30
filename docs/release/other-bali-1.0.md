# Other Bali 1.0 release line

Date: 2026-07-30
Status: **NO-GO — candidate preparation in progress**

This is the canonical evidence ledger for the current candidate. It does not
claim that an artifact was submitted, published, deployed to production, or
fully tested on physical devices.

## Canonical candidate

- Working branch: `codex/appstore-build6-20260730`
- Last committed baseline before the current privacy patch:
  `f337aa79cc387449a8f0f8d6c776c595e0cb76f1`
- Final candidate commit: **pending**
- Web/API production origin: `https://www.otherbali.com`
- App/package ID: `com.otherbali.app`
- iOS: version `1.0`, build `6`, minimum iOS `15.0`
- Android: version `1.0.0`, version code `4`, minimum API `24`, target/compile
  API `36`
- Native product: bundled Capacitor app with Discover, Decide, Today, Trip,
  What's On, My Bali, saved places/routes, editable multi-day plans,
  local offline state, external Maps handoff, and anonymous cloud sync

The superseded `android-twa/` wrapper and older release/device evidence are not
release sources for this candidate.

## Signed-artifact status

The IPA/AAB/APK currently present on disk were built before the final privacy
and deletion changes. They are **superseded and must not be uploaded**.

In particular, the old IPA with SHA-256 beginning `453eaf85…` contains the old
privacy manifest (`UserID`, `PreciseLocation`, `CoarseLocation`,
`linked=false`, and an Analytics purpose). It is not evidence for the current
source manifest.

Populate this table only after rebuilding from the final committed source and
passing the combined verifier:

| Store | Exact artifact | Bytes | SHA-256 | Status |
| --- | --- | ---: | --- | --- |
| App Store | `artifacts/release/ios/OtherBali.ipa` | pending | pending | rebuild required |
| Google Play | `android/app/build/outputs/bundle/playRelease/app-play-release.aab` | pending | pending | rebuild required |
| RuStore | `android/app/build/outputs/apk/rustore/release/app-rustore-release.apk` | pending | pending | rebuild required |

The final `release-artifacts.json` and `SHA256SUMS` must bind the exact binaries
to the final commit. No earlier hash may be substituted.

## Native permissions and privacy surface

The expected merged Play and RuStore release manifests contain exactly:

- `android.permission.INTERNET`
- `android.permission.ACCESS_COARSE_LOCATION`
- `android.permission.ACCESS_FINE_LOCATION`
- `android.permission.ACCESS_NETWORK_STATE`
- `com.otherbali.app.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`

The app-signature-only dynamic-receiver permission is Android compatibility
plumbing, not a user-data permission. No notification, foreground-service,
Wi-Fi-state, wake-lock, boot, camera, microphone, contacts, or Photos
permission is expected.

Location is user-triggered by **Use my current area**. The app requests a
low-accuracy fix, reduces it locally to a supported Bali area, and does not
persist or transmit raw coordinates in that flow. Manual area selection remains
available after denial. iOS carries the matching When In Use description.

Offline Mapbox downloads and onboard routing remain fail-closed in this
release. No downloadable region is advertised, and native Mapbox telemetry
initializes disabled.

The source `PrivacyInfo.xcprivacy` now declares exactly:

- Coarse Location
- Device ID
- Other User Content
- Product Interaction
- Other Diagnostic Data

Each type is linked, used for App Functionality, and not used for tracking. The
final IPA must be inspected to prove that this source manifest—not the stale
one—is embedded.

## Anonymous sync and deletion

The mobile app generates a random installation-scoped `g_…` reference from 12
cryptographically random bytes, stores it in Capacitor Preferences, displays it
as **Anonymous Guest Reference**, and sends it in
`X-Other-Bali-Guest`. The website uses a separate `bp_guest` httpOnly cookie.

Supabase stores mutable Saved, Today, Trip, Visited and Note state plus bounded
sync metadata. The candidate adds:

- canonical-slug sync and header-only mobile identity;
- exact `{ok:true}` confirmation for destructive deletion;
- a two-step in-app deletion action;
- a personal-write barrier and quarantine so writes cannot race deletion;
- persistent quarantine across relaunch until cleanup completes;
- installation-ID invalidation so an in-flight identity request cannot restore
  the deleted reference;
- server tombstones and write guards so delayed/replayed requests cannot
  recreate erased data;
- deletion of legacy state and all ten v1.2 mutable-state tables;
- minimization and detachment of any required redemption proof;
- a visible support reference and truthful post-uninstall guidance.

After erasure the old reference is a replay-prevention marker only: source and
area are cleared, its creation time is normalized to the erasure time, and
mutable traveller data is removed. If redemption proof exists, it is moved to a
separate internal anchor not returned to the app and no longer linked to the
installation reference.

See `docs/store-privacy-declarations.md` for the exact Apple, Google Play and
RuStore form mapping. Owner/legal confirmation of processor status, retention
criteria, lawful basis and the actual store-console entries remains a release
gate.

## Database and preview evidence

Production migration `0064_v12_sync_apply.sql` was applied explicitly after
read-only dependency checks. A production probe returned the exact HTTP `201`
`applied` acknowledgement required by the client. Production migration
`0065_v12_guest_privacy_erasure.sql` is applied. A controlled live probe on
2026-07-30 verified HTTP `200` deletion, idempotent repeated deletion, and
rejection of a personal-state write attempted after erasure.

The isolated Supabase branch `media-preview-qa` initially exposed real schema
drift: migrations `0019` and `0061`–`0064` were absent. The audit restored those
exact migrations only in preview, then applied/refreshed `0065`.

Preview verification on 2026-07-30 proved:

- the service role can execute erasure while `anon` and `authenticated` cannot;
- one immutable guest tombstone guard and all 15 applicable child write guards
  are installed;
- sequential deletion and repeated deletion pass;
- a late v1.2 write is rejected after deletion;
- a legacy child write is rejected after deletion;
- write-first/delete-second ends with no mutable state;
- delete-first/write-second rejects the delayed write;
- newly erased references normalize their creation timestamp to erasure time.

These checks created only random synthetic tombstones in the preview branch.
They did not access production user data or change production.

## Automated evidence

Latest completed source checks before final native rebuild:

- v1.2 integration: **136/136 passed**
- full repository suite: **349/349 passed**
- SEO registry validation: passed
- TypeScript: passed
- ESLint: 0 errors, one pre-existing `<img>` performance warning
- production Next.js build: passed; `/api/mobile/v1/privacy` is present
- `git diff --check`: passed
- independent privacy/sync source review: **GO**, with no remaining P0/P1
  finding in the reviewed scope

The persistent quarantine, identity invalidation and deferred analytics-load
fixes are included in these results.

## Device and screenshot evidence

The previously tested Samsung APK and all previously exported store binaries
predate the current privacy source. Their successful behavior is historical
diagnostic evidence only.

Current-candidate gates:

- Samsung physical QA: **pending final exact APK**. Required cases include clean
  install, catalogue/bootstrap, Saved/Today/Trip editing, sync queue clearing,
  visible action feedback, offline/recovery, verified app links, privacy
  deletion, ID rotation, post-delete sync and crash/ANR review.
- Google Play-delivered Samsung build: **pending**. A locally signed AAB is not
  evidence of a Play App Signing-delivered install.
- iPhone physical QA: **blocked until the device appears to Xcode**. Simulator
  evidence is supplemental only.
- Store screenshots: **pending recapture** from the exact final UI and artifact.

Do not mark a device entry `passed` until its installed artifact, source
commit, device/OS, clean-install mode, cases, timestamps and evidence pointers
are recorded without device serials or personal data.

## Signing and association gates

- Apple Distribution must remain team `KB7VPWHTTM`,
  `get-task-allow=false`, with exactly `applinks:www.otherbali.com`.
- Play upload certificate:
  `1D:98:F3:8E:7C:F8:AD:F5:3C:E0:AA:F3:D4:F7:4A:F5:DA:E5:55:61:33:2F:CB:35:02:42:CF:9B:C2:26:63:90`.
- RuStore/app-signing certificate:
  `78:DE:94:BB:31:D5:43:F7:46:BE:27:D8:4A:51:2F:54:03:95:15:11:F1:85:10:18:6D:7A:36:99:EE:A6:A6:BA`.
- Live `assetlinks.json` currently covers the RuStore/app-signing certificate.
  Add and verify the final Play App Signing certificate after Google issues it.
- Encrypted off-device recovery of both Android private keys remains an owner
  gate; local protected files and Keychain passwords alone are insufficient.

## Remaining release gates

1. Commit the candidate, push the draft PR and wait for the exact Vercel
   preview. Verify privacy pages, mobile privacy CORS/DELETE, health, ready,
   config, bootstrap and sync against that deployment.
2. Production `0065` deployment and live deletion checks are complete; preserve
   the verified server source and migration state while the native candidates
   are rebuilt.
3. Rebuild and verify the signed IPA/AAB/APK; replace this ledger's pending
   hash table with exact final bytes and regenerate release evidence.
4. Complete physical Samsung QA, then physical iPhone QA when Xcode sees the
   device.
5. Capture and validate fresh App Store, Google Play and RuStore screenshots.
6. Complete owner/legal privacy, processor, retention, age-rating, support,
   DPA and contact fields.
7. Store submission/publication requires separate explicit approval and is not
   authorized by this preparation ledger.
