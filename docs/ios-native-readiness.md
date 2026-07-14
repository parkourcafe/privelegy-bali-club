# iOS native-readiness boundary

Date: 2026-07-14

The repository now has a bundled local Capacitor shell, saved venue-detail and ordered route-detail views that can reopen bounded validated public snapshots from Capacitor Preferences, controlled native HTTPS handoffs, native network status/share, Release configuration checks, and an unsigned Simulator Release workflow. Saved IDs and snapshots commit together as one record per kind; same-key writes are serialized. Existing bounded WebView `localStorage` values migrate only after a successful Preferences write, and an unreadable authoritative/migration store blocks writes with retry instead of being treated as empty. Online venue detail comes from `/api/mobile/v1/venues/[slug]`; its stored Maps handoff is presented neutrally and is not claimed to be turn-by-turn navigation. Online route detail comes from `/api/mobile/v1/routes/[slug]`; saving a loaded route persists the ordered stops and source timestamp. If a required full snapshot is absent offline, the UI keeps only available compact information and withholds an unsupported directions surrogate.

`npm run ios:verify -- --config-only` verifies the portable bundled-shell boundary. On macOS, `npm run ios:verify` also builds the unsigned Simulator Release, inspects the built `App.app`, scans its linked binary dependencies with `otool`, and records embedded frameworks/privacy manifests in `artifacts/ios/privacy-evidence.json`.

The exact official Capacitor 8 App, AppLauncher, Browser, Network, Preferences and Share plugins are now declared, synced and used by the local shell. The local URL router validates only exact canonical `/places/[slug]` and `/route/[slug]` URLs and wires both cold `App.getLaunchUrl()` and warm `appUrlOpen` paths. This is local handler evidence only, not proof that production Universal Links reach the app.

`npm run ios:native-readiness` remains an intentionally strict native-capability gate. It must remain red until every external/product blocker below is implemented and evidenced:

- `signing_team_missing`;
- `associated_domains_not_linked`;
- `associated_domains_missing`;
- `aasa_missing`;
- `native_map_missing`.

In operational terms, those blockers require the following evidence:

- add a verified Apple Developer Team ID, `App/App.entitlements`, the `applinks:www.otherbali.com` associated domain, and a production `apple-app-site-association` file containing the real `TEAMID.com.otherbali.app` identifier;
- deploy and validate the production AASA response, then prove cold/warm Universal Links on a signed device;
- implement and test the required native MapKit route surface; the current controlled exact-venue Google Maps handoff is not MapKit;
- exercise Network, Preferences, Share, Browser/AppLauncher, deep links, maps, foreground/background return, minimum iOS, current iOS, and a real signed device build.

The current `PrivacyInfo.xcprivacy` declares the Preferences/UserDefaults required-reason API with reason `CA92.1`; tracking, collected-data types and tracking domains remain empty. Those declarations are provisional only. They are not treated as proof about all compiled Capacitor/Swift dependencies. The post-build evidence scan and App Store privacy report must be reviewed against actual SDKs and real-device behavior before privacy labels or compliance are declared complete.

The saved venue and route surfaces store only bounded public DTO snapshots and source timestamps. They do not store identity. Live availability, offline booking, native maps, production Universal Links, provider routing/travel times, and background sync are not claimed.

## Final local verification (2026-07-14)

`mobile:build`, `mobile:sync`, `ios:verify -- --config-only` and the portable preflight portion of `ios:verify` passed on the final source. Full Simulator Release did not run because `xcode-select` points to Command Line Tools rather than full Xcode. The strict readiness rerun returned exactly the same five blocker codes listed above and exited red by design; no signing, archive, real-device, TestFlight or App Store claim is made.
