# Other Bali store assets

Canonical listing assets for release 1.0:

- `app-store-icon-1024.png`: Apple App Store icon, 1024 × 1024.
- `app-icon-1024.png`: canonical high-resolution icon source.
- `google-play-icon-512.png`: Google Play listing icon, 512 × 512, 32-bit
  RGBA PNG with an alpha channel.
- `google-play-feature-graphic-1024x500.png`: Google Play feature graphic,
  1024 × 500; generated from the adjacent canonical SVG source.
- `rustore-icon-512.png`: RuStore listing icon, 512 × 512.

Run `npm run store:assets:verify` before upload. The validator checks exact PNG
dimensions, enforces each store's alpha-channel rule and prints SHA-256
evidence for the listing package.

`package-manifest.json` is the canonical readiness inventory. Run
`npm run store:package:verify` during preparation; it fails on invalid or stale
artifact, device and screenshot evidence while reporting owner/legal fields as
pending. Run `npm run store:package:verify:strict` only as the final upload
gate; strict mode also fails every pending owner input. Neither command may pass
for the current candidate until new screenshots have explicit provenance,
required device evidence is complete and every referenced signed artifact is
present with the same hash. The release-artifact report independently proves
when the IPA, Play AAB and RuStore APK contain the same canonical shell.

The Android and iPhone screenshot files currently in this directory are
historical captures from an older source/build. Their hashes remain frozen as
audit evidence, but both sets are marked `stale` in the manifest and must not be
uploaded. After the new signed candidate is built and device-tested, recapture
the Android set from the exact clean-installed RuStore APK and bind it to a new
signed-device sidecar. Recapture the iPhone set from the verified current
source and record Simulator provenance separately from physical iPhone/
TestFlight QA. Follow `docs/store-submission-package.md`; never substitute
unrelated or stale debug QA screenshots as listing artwork.

`archive/ios-build-2-day-builder/` contains historical screenshots from the
retired build 2/day-builder product. They are retained only as audit evidence
and must never be uploaded for the current Places / Routes / Saved release.
