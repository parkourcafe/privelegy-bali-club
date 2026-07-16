# iOS App Store submission discovery — 2026-07-16

Branch: `loop/12-app-store-submission`

## Durable starting state

- Canonical release line: `origin/main` at `7ede050`.
- PR #93 is merged and its CI and Vercel checks passed.
- App Store Connect app: Other Bali, Apple ID `6791214357`.
- Uploaded build: `1.0 (1)`, TestFlight build UUID
  `d1321d49-990a-4fc7-872e-b2cc40142637`.
- Internal group `Founder QA` contains `saidalarust@gmail.com`.
- The paired physical device is an iPhone 16 on iOS 26.3.1.
- TestFlight 4.2.2 is installed on the device.
- Other Bali `1.0 (1)` is installed and launches on the device.
- A physical-device screenshot confirms the bundled app-only mood, district
  and duration builder renders correctly.

## Work completed in this release loop

- Repeated the TestFlight build `1.0 (1)` flow on the paired iPhone 16.
  Screenshots confirm a Golden hour / Ubud / three-day plan, three saved-place
  references and local persistence after terminating and relaunching the app.
- Found a release-blocking share flaw: build 1 sent an
  `otherbali://plan?...` URL that recipients without the app could not open.
- Changed the Share Sheet payload to an HTTPS URL under
  `https://www.otherbali.com/plan/shared`.
- Added a server-rendered, noindex shared-plan page with allow-listed mood,
  district and duration inputs. It exposes no user identity or private plan
  data and routes recipients to current public district/place content.
- Rebuilt and tested the final simulator flow. The Share Sheet now identifies
  `otherbali.com`, and the replacement screenshot is a 1320 × 2868 portrait PNG.
- Synchronized the Capacitor iOS bundle.
- Archived, signed and uploaded build `1.0 (2)`.

## Build 2 evidence

| Evidence | Value |
|---|---|
| Archive | `/private/tmp/OtherBali-1.0-build2-20260716.xcarchive` |
| IPA | `/private/tmp/OtherBali-1.0-build2-export/App.ipa` |
| IPA SHA-256 | `6f2a05e42d9558c34edfde5505bfe9d28bbb4d6d562339abf6b2051045ecbad3` |
| Bundle | `com.otherbali.app` |
| Version/build | `1.0 (2)` |
| Team | `KB7VPWHTTM` |
| Upload time | `2026-07-16T09:30:53Z` |
| Upload identifier | `af6510e9-bb72-45e4-9eef-15d52f22aa7c` |
| Export compliance key | `ITSAppUsesNonExemptEncryption=false` |
| Distribution entitlements | `get-task-allow=false`, `beta-reports-active=true` |
| Upload result | Xcode `Upload succeeded`, no recorded warning or error |

## Remaining verification

1. Confirm build `1.0 (2)` finished Apple processing and assign it to the
   existing `Founder QA` group.
2. Install build 2 on the paired iPhone and repeat Share Sheet and offline
   restore. The build 1 local-persistence checks are complete, but build 2 is
   the submission candidate.
3. Merge/deploy this branch and verify the exact shared-plan HTTPS route in
   production before selecting build 2.
4. Verify App Store Connect privacy, age rating, content-rights, export
   compliance, support/review contact and review-note fields.
5. Keep the final App Review submission as a separately confirmed founder
   action.

## Boundaries

- No tourist-side payments, local booking engine or copied guest PII.
- No new application architecture or public-data model is introduced here.
- Any code correction must be forward-only, focused on the released iOS shell
  and revalidated by lint, typecheck, tests and build.
