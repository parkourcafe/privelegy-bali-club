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
`npm run store:package:verify` during preparation; it lists every pending signed
screenshot and owner/legal field without failing. Run
`npm run store:package:verify:strict` only as the final upload gate. It cannot
pass until both screenshot sets are tied to exact signed-artifact SHA-256 values
that match `artifacts/release/evidence/release-artifacts.json`, every referenced
artifact is still present with the same hash, and every owner input is marked
complete. The iPhone set is tied to the IPA; the shared Android listing set is
tied to the signed RuStore APK. The release-artifact report independently proves
that the Play AAB contains the same canonical shell.

The five Android screenshots are final-size captures from the exact signed and
device-tested RuStore APK recorded in `package-manifest.json` and
`docs/release/device-matrix.json`. The five iPhone screenshots remain pending a
clean install of the final signed iOS 1.0 (4) IPA. Follow
`docs/store-submission-package.md`; never substitute debug QA screenshots as
listing artwork.

`archive/ios-build-2-day-builder/` contains historical screenshots from the
retired build 2/day-builder product. They are retained only as audit evidence
and must never be uploaded for the current Places / Routes / Saved release.
