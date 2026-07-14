# Other Bali — App Store release readiness

Date: 2026-07-14
Status: **bundled-shell foundation only; not TestFlight or App Store ready**.

Final local 2026-07-14 evidence: Mobile build/sync and portable iOS config verification passed. Full Simulator Release was unavailable because full Xcode is not selected; strict readiness remains red with the five documented signing/Associated Domains/AASA/native-map blockers.

## Current product truth

The iOS target no longer opens the production website as its primary UI. It bundles a local React/Capacitor shell from `ios-web/` and reads strict public data from `/api/mobile/v1/*`.

The implemented shell currently provides:

- public Places, Routes and Saved surfaces;
- a last-successful bootstrap cache with an explicit offline state and timestamp;
- locally saved venue and route IDs;
- a validated full public venue-detail snapshot for saved places;
- current route-stop detail loaded from the versioned public API;
- a validated stored Google Maps handoff only when venue detail supplies it, without claiming exact routing when the URL is search/generic;
- Preferences-backed state restoration with safe migration from the prior WebView store;
- native Network status, Share sheet and controlled Browser/AppLauncher HTTPS handoffs;
- strict local cold/warm deep-link parsing for canonical place and route URLs;
- no login, tourist payment, GA tag, ad SDK or cross-app tracking code.

It does **not** currently provide the web planner/day builder, native MapKit routes, production Universal Links, confirmed offers, live availability, offline booking or background sync. App Store copy and screenshots must not imply those features. Local deep-link handlers are not production Universal Link evidence without the signed entitlement and production AASA.

## Technical release boundary

- Bundle ID: `com.otherbali.app`.
- Minimum target remains iOS 15.0.
- First release is configured iPhone-only until iPad QA exists.
- Release Capacitor config has no `server.url` and disables bridge debug logging.
- `mobile:build` records a source hash; `ios:verify` rejects stale `ios-web` output, and a built app must contain the same manifest/assets.
- The current privacy manifest includes the Preferences/UserDefaults `CA92.1` required reason; its empty tracking/data declarations remain provisional until the built binary/dependencies and App Store privacy report are reviewed.

## Commands

```bash
npm run mobile:build
npm run mobile:sync
npm run ios:verify -- --config-only
npm run ios:verify
npm run ios:native-readiness
npm run ios:archive:dry
```

`ios:archive:dry` rebuilds and synchronizes the shell before attempting an unsigned archive. A green config-only check is not an Xcode build, device test, archive, TestFlight upload or App Review result.

## App Store metadata boundary

Stable candidate values:

- Name: `Other Bali`
- Bundle ID: `com.otherbali.app`
- Primary category: Travel
- Price: Free
- In-App Purchases: None
- Support URL: `https://www.otherbali.com/support`
- Privacy Policy URL: `https://www.otherbali.com/privacy`
- Marketing URL: `https://www.otherbali.com`

Age rating, privacy labels, storefronts, DSA/trader answers, final description, keywords, screenshots, review contact and review notes remain owner/App Store Connect decisions. Use `docs/launch/data-inventory.md` as engineering input, not as a submitted legal answer.

## Review-notes draft boundary

Only after native readiness and device QA are complete, a factual draft may explain that the app works without login; Places and Routes refresh over the network; saved public venue details can reopen from the last validated snapshot; Google Maps is an external user-initiated handoff; and the app does not confirm a booking. Do not direct a reviewer to a day builder, native map, deep link or offer flow until that exact submitted binary contains and passes those flows.

## Blocking evidence

- Apple Developer Team/signing and App Store Connect record.
- Associated Domains entitlement, production AASA with exact Team ID, and signed-device warm/cold Universal Link evidence.
- Native MapKit route experience.
- Full current Xcode Simulator Release and archive evidence.
- Built binary/dependency privacy scan and approved App Store privacy answers.
- Real-device and TestFlight matrix, including offline/return-to-app behavior.
- Real screenshots and final metadata matching the submitted binary.

The strict machine-readable blocker list is produced by `npm run ios:native-readiness`; detailed evidence limits are in `docs/ios-native-readiness.md` and `docs/launch/manual-blockers.md`.
