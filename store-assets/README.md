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
pass until screenshots have explicit provenance, required device evidence is
complete, every referenced artifact is still present with the same hash, and
every owner input is marked complete. The iPhone marketing set is captured in
the 6.9-inch Simulator and tied to the verified canonical mobile-shell source
hash; it does not claim physical-device or IPA provenance. The Android listing
set must be recaptured and rebound after every new signed RuStore APK. The
release-artifact report independently proves when the IPA, Play AAB and RuStore
APK contain the same canonical shell.

The current Android screenshots are historical until the newly signed APK is
clean-installed and recaptured; `package-manifest.json` therefore keeps that
set pending. The five iPhone screenshots are final-size
captures from a clean iPhone 17 Pro Max Simulator install of the same verified
release source. Physical iPhone/TestFlight QA remains a separate gate and is
not implied by these marketing images. Follow `docs/store-submission-package.md`;
never substitute unrelated or stale debug QA screenshots as listing artwork.

`archive/ios-build-2-day-builder/` contains historical screenshots from the
retired build 2/day-builder product. They are retained only as audit evidence
and must never be uploaded for the current Places / Routes / Saved release.
