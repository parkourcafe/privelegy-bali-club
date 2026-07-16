# iOS app-only discovery — 2026-07-15

Branch: `loop/10-ios-app-shell`

## Findings before the change

- `capacitor.config.ts` used `server.url = https://www.otherbali.com`, so the
  native target opened a remote WebView rather than a bundled app surface.
- `ios-web/index.html` immediately redirected to the remote site; the existing
  `offline.html` only offered a retry link.
- The bundle identifier is already `com.otherbali.app`; Xcode uses automatic
  signing, but no `DEVELOPMENT_TEAM` is committed, so signing remains a local
  Apple-account step.
- The native target is iOS 15+, uses the Other Bali launch/icon assets, and
  already forwards URL opens through Capacitor's `ApplicationDelegateProxy`.
- The repository already has deterministic moment slugs in `lib/moments.ts`
  and public `/plan`/district routes. The bundled shell can link to those
  routes without copying venue data or inventing menu/availability facts.

## App-only slice in this branch

- bundled first screen: mood, district, duration, then a day-plan summary;
- on-device plan and saved-place references (no identity, auth token, or PII);
- last plan remains available when offline;
- Capacitor App deep-link listener and `otherbali://plan` / `otherbali://place`
  routes;
- Capacitor Share bridge with Web Share/copy fallback;
- remote full catalogue remains an explicit external handoff at
  `https://www.otherbali.com`.

## Verification boundary

This change does not add a booking engine, delivery flow, location permission,
analytics SDK, account requirement, or native copy of the public venue database.
Apple signing, a signed Archive, and physical-device/TestFlight review still
require the founder's Apple Developer team and local Xcode credentials.
