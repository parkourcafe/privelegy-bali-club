# Other Bali - iOS App Store Launch Setup

Date: 2026-07-12
Status: Capacitor iOS wrapper scaffolded; App Store Connect account setup still manual.

## What Is In The Repo Now

- Capacitor v8 config: `capacitor.config.ts`
- iOS project: `ios/App/App.xcodeproj`
- Bundle ID: `com.otherbali.app`
- Display name: `Other Bali`
- App icon source: `public/icon-512.png`
- iOS app icon asset: `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`
- Native privacy manifest: `ios/App/App/PrivacyInfo.xcprivacy`
- Local fallback shell: `ios-web/index.html` and `ios-web/offline.html`
- Live app URL loaded by the wrapper: `https://www.otherbali.com`

## Important App Review Risk

This first wrapper loads the live Other Bali web app because the product depends on Next.js server routes and Supabase-backed data. Capacitor supports external URL loading, but its own config docs mark `server.url` as intended for live-reload style development, not as the ideal production architecture.

Before final App Store submission, review the app on device and keep the traveller flow strongly app-like:

- first screen shows the day builder and curated map experience;
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

## Privacy Answers Draft

Tracking:

- No, unless advertising/data-broker sharing is added later.

Data linked to the user:

- None for tourist account identity, because tourists do not create accounts.

Data not linked to the user:

- Identifiers: anonymous `bp_guest` httpOnly cookie/device reference.
- Usage Data: page/card opens, district opens, directions clicks, reservation handoff clicks, offer redemption events.
- Diagnostics: Vercel/native crash diagnostics only if enabled in the submitted build.

Data not collected:

- Contact info from tourists by default.
- Payment information from tourists.
- Precise location, camera, microphone, contacts, photos, health, financial info.

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

P0 - App Store Connect app record must be created manually or through App Store Connect API credentials.

P0 - Real iPhone smoke test is still required.

P1 - App Store screenshots are not prepared.

P1 - Final privacy labels must be confirmed against the actual submitted native build.

P1 - Because this wrapper loads `https://www.otherbali.com`, App Review risk remains if Apple treats it as a repackaged website. Add native-only value or a bundled app-like shell before final submission if review feedback requires it.
