# Other Bali - iOS App Store Launch Setup

Date: 2026-07-15
Status: Capacitor iOS wrapper builds and runs in Simulator; App Store archive is
blocked only on Xcode account login/provisioning plus the remaining product QA.

## What Is In The Repo Now

- Capacitor v8 config: `capacitor.config.ts`
- iOS project: `ios/App/App.xcodeproj`
- Bundle ID: `com.otherbali.app`
- Display name: `Other Bali`
- App icon asset: 1024x1024 opaque PNG, full-square artwork; the platform applies its own mask
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

1. In Xcode 26.3, sign in under Settings > Accounts and select team
   `K436CPPGU2`; complete owner 2FA if requested.
2. Open `ios/App/App.xcodeproj` and allow automatic signing to create/download
   the provisioning profile for `com.otherbali.app`.
3. Confirm Version `1.0` and Build `1`.
4. Create and validate the archive, then upload it to App Store Connect.
5. Run TestFlight on a real iPhone.
6. Fill privacy labels and review notes, attach final screenshots, and submit
   the tested build to App Review.

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

Resolved - Team ID `K436CPPGU2`, automatic signing, bundle ID, version and build
are configured in the repo.

Resolved - Xcode 26.3 and iOS 26.3 Simulator are installed; the app builds and
launches on an iPhone 17 Pro simulator.

P0 - Xcode has no signed-in account for team `K436CPPGU2`, so it cannot create
or download the provisioning profile. Owner login/2FA is required once locally.

P0 - App Store Connect app record must be created manually or through App Store Connect API credentials.

P0 - Real iPhone smoke test is still required.

P1 - App Store screenshots are not prepared.

P1 - Final privacy labels must be confirmed against the actual submitted native build.

P1 - `support@otherbali.com` cannot be declared operational until the domain has
working MX records and the mailbox/forward is tested end to end.

P1 - Because this wrapper loads `https://www.otherbali.com`, App Review risk remains if Apple treats it as a repackaged website. Add native-only value or a bundled app-like shell before final submission if review feedback requires it.
