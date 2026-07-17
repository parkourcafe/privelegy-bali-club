# Other Bali iOS — App Review readiness

> **SUPERSEDED — DO NOT SUBMIT.** This readiness record is for retired build 2.
> The current candidate is iOS 1.0 (4); use
> `docs/release/other-bali-1.0.md` and `docs/store-submission-package.md`.

Date: 2026-07-16
Candidate: `1.0 (2)`
App Store Connect ID: `6791214357`

## Ready

- Release archive and App Store IPA are signed for
  `KB7VPWHTTM.com.otherbali.app`.
- Build `1.0 (2)` uploaded successfully with upload identifier
  `af6510e9-bb72-45e4-9eef-15d52f22aa7c`.
- Apple processed build `1.0 (2)`, TestFlight installed it on the paired
  physical iPhone, and device inspection confirms bundle version `2`.
- IPA SHA-256 is
  `6f2a05e42d9558c34edfde5505bfe9d28bbb4d6d562339abf6b2051045ecbad3`.
- No non-exempt encryption is declared.
- App-only mood, district, duration, saved plan, saved places and native share
  surfaces are present.
- All five 6.9-inch App Store screenshots were regenerated in one clean
  simulator run from a `1.0 (2)` binary and are 1320 × 2868 PNG.
- The Share Sheet uses a public HTTPS fallback for recipients without the app.
- The shared page validates inputs, contains no PII and is marked `noindex`.
- Build 1 physical-iPhone evidence confirms local persistence across
  termination and relaunch.
- Build 2 physical-iPhone evidence confirms the installed candidate is
  `1.0 (2)` and that its saved plan and three saved-place references survive a
  real terminate/relaunch cycle byte-for-byte.
- The release branch is merged at
  `2e7e30d9309ed34abee6a4011eea2f618aff11c9`; the production shared-plan URL
  returns HTTP 200 with a `noindex` robots directive.

## Must pass before App Review submission

- Physical iPhone Share Sheet opens and shows the HTTPS fallback.
- Physical iPhone restores the latest plan with networking disabled. Local
  persistence across termination is proven for build 2; the networking-disabled
  part still needs the final manual smoke check.
- Privacy, age rating, content rights, export compliance, support/review
  contact and review notes are complete in App Store Connect.
- `support@otherbali.com` is confirmed as a working review contact, or another
  monitored support address is entered.

## Release boundary

- Do not upload a different binary under build number 2.
- Do not select build 1 for final review after the build 2 share fix.
- Do not merge around required CI/review protection.
- Do not click the final App Review submission control without a separate,
  explicit founder confirmation.
