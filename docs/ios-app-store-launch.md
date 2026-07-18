# Other Bali - iOS App Store Launch Setup

> **SUPERSEDED — historical audit only.** This document describes the retired
> build-2/day-builder shell and must not be used for release 1.0 (4). The
> canonical current product, evidence and store copy are in
> `docs/release/other-bali-1.0.md` and `docs/store-submission-package.md`.

Date: 2026-07-14
Status: bundled Capacitor app shell implemented; App Store Connect account and
Apple signing setup remain manual.

## What Is In The Repo Now

- Capacitor v8 config: `capacitor.config.ts`
- iOS project: `ios/App/App.xcodeproj`
- Bundle ID: `com.otherbali.app`
- Display name: `Other Bali`
- App icon asset: 1024x1024 opaque PNG, full-square artwork; the platform applies its own mask
- iOS app icon asset: `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`
- Native privacy manifest: `ios/App/App/PrivacyInfo.xcprivacy`
- Local app shell: `ios-web/index.html`, `ios-web/app-shell.js`, and `ios-web/offline.html`
- Full catalogue handoff: `https://www.otherbali.com`
- Custom deep-link scheme: `otherbali://`
- Capacitor plugins: App and Share

## Important App Review Risk

The bundled shell owns the first-run and offline experience. It hands off to the
live Other Bali web app for current catalogue data because the public product
depends on Next.js server routes and Supabase-backed data; Capacitor no longer
uses `server.url` for the app launch.

The bundled first screen now provides the app-only value; before final App Store
submission, review it on device and keep the traveller flow strongly app-like:

- first screen shows the mood/district/duration day builder;
- last plan and saved-place references remain available offline;
- Share uses the native system sheet where available;
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
- Age Rating: complete the current questionnaire truthfully; the catalogue includes bars, beach clubs and alcohol references, so do not assume `4+`.
- Price: Free
- In-App Purchases: None
- Support URL: `https://www.otherbali.com/support`
- Privacy Policy URL: `https://www.otherbali.com/privacy`
- Marketing URL: `https://www.otherbali.com`

## Privacy Answers Draft

Tracking:

- No, unless advertising/data-broker sharing is added later.

Use the code-aligned answer matrix in `docs/store-privacy-declarations.md`.
It covers the optional guide contact form, venue photo onboarding, anonymous
guest reference, consent evidence, product interactions and optional travel
preferences. Tracking remains `No`.

## Manual Apple Account Steps

1. Free at least 35 GB, then download Xcode 26.3 from Apple Developer Downloads.
   Xcode 26.3 is compatible with this Mac's macOS 15.6.1 and meets the current
   Xcode 26+ App Store upload requirement.
2. In Apple Developer, create/register App ID `com.otherbali.app`.
3. In App Store Connect, create the iOS app record with the values above.
4. In Xcode, open `ios/App/App.xcodeproj`.
5. Select the `App` target, then Signing & Capabilities.
6. Choose the Apple Developer Team.
7. Confirm Bundle Identifier is `com.otherbali.app`.
8. Confirm Version `1.0` and Build `1`.
9. Run on an iPhone simulator and a real iPhone.
10. Archive from Xcode.
11. Upload to App Store Connect.
12. Fill privacy labels and review notes.
13. Attach screenshots.
14. Submit for TestFlight first, then App Review.

## Review Notes Draft

`Other Bali is a free curated Bali travel guide. No account is required. Open the app, choose how you want the day to feel, browse filtered places across Bali, open directions, or view confirmed offers where available. The app does not charge travellers and does not sell digital content. Venue monetization, if any, happens outside the traveller experience and is based on confirmed seated reservations through partner systems.`

No demo account is required.

## Local Commands

```bash
npm run mobile:sync
npm run mobile:open:ios
npm run mobile:run:ios
```

## Remaining Blockers

P0 - Apple Developer Team ID/signing is not configured in the repo.

P0 - Xcode 26.3 is not installed and current free disk space is insufficient.

P0 - App Store Connect app record must be created manually or through App Store Connect API credentials.

P0 - Real iPhone smoke test is still required.

P1 - App Store screenshots are not prepared.

P1 - Final privacy labels must be confirmed against the actual submitted native build.

P1 - `support@otherbali.com` cannot be declared operational until the domain has
working MX records and the mailbox/forward is tested end to end.

P1 - Because this wrapper loads `https://www.otherbali.com`, App Review risk remains if Apple treats it as a repackaged website. Add native-only value or a bundled app-like shell before final submission if review feedback requires it.
