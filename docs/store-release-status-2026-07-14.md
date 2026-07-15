# Other Bali Store Release Status

Date: 2026-07-15
Branch: `app/store-release-foundation`

## Executive Status

Neither store build is ready for public submission yet.

| Surface | Current state | Release blocker |
| --- | --- | --- |
| Production web/PWA | Deployed and functional | Support mailbox is not operational; offline mode is intentionally disabled |
| Apple App Store | Native scaffold builds and launches in iPhone Simulator; team, opaque icon, branded launch screen and privacy manifest are configured | Xcode account login/provisioning, bundled-shell architecture decision, archive/TestFlight/device QA and screenshots |
| RuStore | TWA project builds debug and unsigned release APKs; no sensitive permissions | Offline/native value, production keystore, Digital Asset Links, signed AAB/APK, device/alpha QA and screenshots |
| Store metadata | English App Store and Russian RuStore drafts prepared | Legal owner fields, age rating, account access and final screenshots |

## Verified Work

- Production deployment: `https://www.otherbali.com`.
- `/privacy`, `/privacy/choices`, `/support` and `/terms` return successfully.
- Google Analytics does not load because the production enable flag is absent.
- iOS App Store icon is 1024x1024 RGB PNG without alpha.
- iOS launch screen uses Other Bali branding rather than the Capacitor default.
- iOS privacy manifest reflects guide leads, venue photo onboarding, anonymous
  guest references, consent evidence and product interaction.
- Xcode 26.3 and the iOS 26.3 runtime are installed. The project builds and
  launches successfully on an iPhone 17 Pro simulator.
- Team `K436CPPGU2`, automatic signing, bundle ID `com.otherbali.app`, version
  `1.0` and build `1` are configured.
- Android Studio 2026.1.1, OpenJDK 17 and Android SDK/Build Tools are installed.
- Android package ID is `com.otherbali.app`; debug and unsigned release builds pass.
- Android release manifest requests no location, notification, camera, contacts,
  microphone, advertising or payment permission. The only generated permission
  is the app-scoped AndroidX dynamic-receiver permission.
- App Store and RuStore listing copy, review notes and screenshot shot list are
  in `docs/store-submission-package.md`.

## Architecture Blocker

The requested change from production `server.url` to a fully bundled local
Capacitor app is **not implemented**. The master architecture says PWA-first and
explicitly says the existing Capacitor project is not permission for a native
rewrite. The current Next.js application depends on server routes, Supabase SSR
and server-rendered data; bundling day builder, places, routes, saves and sharing
locally would require a new client data/cache architecture, not a config edit.

Before that work starts, the architecture must explicitly choose one path:

1. **PWA/TWA first:** restore a versioned, tested service worker and provide
   useful offline access to key public/saved content, then keep native shells
   thin.
2. **Bundled native shell:** amend the master architecture and scope a client
   data layer, offline persistence, sync/conflict rules and native navigation.

Submitting the current remote-only shell has high review risk. Apple requires
value beyond a repackaged website, and RuStore says a simple online wrapper is
likely to fail moderation.

## Machine / Account Blockers

- Current Mac: macOS 15.6.1, Apple silicon.
- App Store submissions since 2026-04-28 require Xcode 26 or later.
- Xcode 26.3 is the newest compatible release for macOS 15.6.1 and satisfies
  that requirement. Newer Xcode 26.4+ requires macOS Tahoe 26.2.
- Xcode 26.3 and an iOS 26.3 Simulator runtime are installed.
- A valid Apple Development certificate exists for team `K436CPPGU2`.
- Xcode is not signed into that team locally, so automatic signing cannot obtain
  the provisioning profile for `com.otherbali.app`; archive currently stops at
  `No Account for Team`.
- RuStore Console access is not available in the repository.
- `otherbali.com` has no MX records. `hello@otherbali.com` and
  `support@otherbali.com` therefore cannot receive mail yet.

## Next Release Sequence

1. Owner signs into team `K436CPPGU2` once in Xcode Settings > Accounts and
   completes 2FA. The agent then creates, validates and uploads the archive.
2. Owner selects a real mail provider/inbox; configure `hello@` and `support@`,
   then test incoming and outgoing delivery.
3. Approve one of the two architecture paths above and implement the required
   offline/native value.
4. Create and back up Apple signing credentials and the Android release
   keystore. Publish only the release certificate fingerprint in Digital Asset
   Links.
5. Run iPhone/TestFlight and physical Android/RuStore-alpha QA.
6. Capture final screenshots from those tested builds, complete store privacy
   and age declarations, then submit.
