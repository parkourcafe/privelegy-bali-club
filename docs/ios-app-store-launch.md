# Other Bali - iOS App Store Launch Setup

Date: 2026-07-12
Status: bundled local-shell foundation implemented; native capability, signing, and App Store Connect work remains.

## What Is In The Repo Now

- Capacitor v8 config: `capacitor.config.ts`
- iOS project: `ios/App/App.xcodeproj`
- Bundle ID: `com.otherbali.app`
- Display name: `Other Bali`
- App icon source: `public/icon-512.png`
- iOS app icon asset: `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`
- Native privacy manifest: `ios/App/App/PrivacyInfo.xcprivacy`
- Bundled local shell: `ios-web/index.html`, hashed local assets, and `ios-web/offline.html`
- Production Capacitor config has no `server.url` and disables Release logging
- Exact Capacitor 8 App, AppLauncher, Browser, Network, Preferences and Share plugins
- Local canonical place/route handlers for cold and warm app-link events; production Universal Links are not yet claimed

## Important App Review Risk

The first foundation slice is a bundled local shell backed by the versioned public mobile API. Saved venues retain a validated timestamped public detail snapshot and its stored Maps handoff; search/generic URLs are not described as exact routing. A failed detail fetch falls back to the compact summary without inventing directions. The complete native capability set is not implemented yet.

Before final App Store submission, review the app on device and keep the traveller flow strongly app-like. The current shell shows Places, Routes and Saved; it does not yet contain the web day builder or a native map:

- first screen shows the real bundled Places/Routes/Saved experience;
- no "beta" language;
- no empty catalogue state;
- no tourist payment;
- no account requirement;
- support and privacy links work;
- app remains useful beyond being a plain website wrapper.

## App Store Connect Values

Create a new app record with:

- Platform: iOS
- Name: `Other Bali`
- Primary language: English
- Bundle ID: `com.otherbali.app`
- SKU: `other-bali-ios`
- User Access: Full Access
- Category: Travel
- Age Rating: expected `4+`, assuming no unrestricted web browsing, alcohol-focused content, UGC, or mature venue content is added.
- Price: Free
- In-App Purchases: None
- Support URL: `https://www.otherbali.com/support`
- Privacy Policy URL: `https://www.otherbali.com/privacy`
- Marketing URL: `https://www.otherbali.com`

## Privacy answers — engineering input only

The current native shell does not use the web GuestRef/event/redemption APIs and has no GA or ad SDK. It stores public cache/saved UI state only on device through Capacitor Preferences; prior bounded WebView values migrate without being uploaded. The privacy manifest declares the Preferences/UserDefaults `CA92.1` reason. Network/provider logs may still include IP, user agent, path, time and status. Final collected/linked/diagnostics answers require the built dependency scan, provider-account evidence and App Store review against `docs/launch/data-inventory.md`; do not submit the old “anonymous/not linked” assumption.

## Manual Apple Account Steps

1. In Apple Developer, create/register App ID `com.otherbali.app`.
2. In App Store Connect, create the iOS app record with the values above.
3. In Xcode, open `ios/App/App.xcodeproj`.
4. Select the `App` target, then Signing & Capabilities.
5. Choose the Apple Developer Team.
6. Confirm Bundle Identifier is `com.otherbali.app`.
7. Confirm Version `1.0` and Build `1`.
8. Run on an iPhone simulator and a real iPhone.
9. Archive from Xcode.
10. Upload to App Store Connect.
11. Fill privacy labels and review notes.
12. Attach screenshots.
13. Submit for TestFlight first, then App Review.

## Review Notes Draft

`Other Bali is a free curated Bali guide. No account is required. The submitted app lets a reviewer browse public Places and Routes, save a place or route, reopen a previously loaded saved venue detail from the local snapshot, and make a user-initiated handoff to the venue's validated Google Maps URL when available. Public guide refresh requires a network connection. Other Bali does not confirm bookings or sell digital content.`

No demo account is required.

## Local Commands

```bash
npm run mobile:build
npm run mobile:sync
npm run ios:verify -- --config-only
npm run ios:verify
npm run ios:archive:dry
npm run ios:native-readiness
npm run mobile:open:ios
npm run mobile:run:ios
```

## Remaining Blockers

P0 - Apple Developer Team ID/signing is not configured in the repo.

P0 - App Store Connect app record must be created manually or through App Store Connect API credentials.

P0 - Real iPhone smoke test is still required.

P1 - App Store screenshots are not prepared.

P1 - Final privacy labels must be confirmed against the actual submitted native build.

P0 - Associated domains/AASA with the real Team ID, signed-device Universal Link evidence, native MapKit route UI, and their remaining tests are blocked as listed in `docs/ios-native-readiness.md`.

P0 - The app privacy-manifest declaration (including UserDefaults `CA92.1`) remains provisional until a built dependency/binary scan, App Store privacy report, and real-device behavior review are complete.
