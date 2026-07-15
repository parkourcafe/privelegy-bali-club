# Other Bali Android / RuStore Release

Date: 2026-07-14
Status: TWA wrapper scaffolded; debug and unsigned release builds pass; store
release blocked on offline/native value, production signing, physical-device QA
and RuStore Console access.

## Architecture

The Android project is in `android-twa/` and follows the master architecture's
PWA-first path. It uses a Trusted Web Activity for
`https://www.otherbali.com/`, package ID `com.otherbali.app`, min SDK 21 and no
payments, notifications, geolocation or sensitive Android permissions.

The wrapper is not yet ready for store submission. RuStore says a simple online
site wrapper is likely to fail moderation and expects independent/offline value
or a meaningful native capability. Other Bali's service worker is currently an
intentional cache-purge kill switch after a previous stale-cache incident.
Reintroducing versioned, tested offline access is a product/release requirement,
not a packaging checkbox.

## Local Toolchain

- Android Studio: installed in `/Applications/Android Studio.app`.
- JDK: Homebrew OpenJDK 17 at `/opt/homebrew/opt/openjdk@17`.
- Android SDK: `/Users/msnigmatullaeva/Library/Android/sdk`.
- Installed SDK components: Platform 36, Build Tools 36.0.0, Platform Tools.

For command-line builds:

```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"
cd android-twa
./gradlew assembleDebug
```

## Release Signing

The production keystore must never be committed. The project expects:

- local file: `android-twa/release-key.jks` (gitignored);
- alias: `other-bali-release`;
- passwords held by the owner in a password manager, not in Git or chat.

Create it in Android Studio with **Build > Generate Signed Bundle / APK >
Create new**, then make at least two encrypted backups. Use the same certificate
for every RuStore update.

After the release certificate exists:

1. Export its SHA-256 fingerprint.
2. Add a production `public/.well-known/assetlinks.json` for
   `com.otherbali.app` and that release fingerprint.
3. Deploy and verify the Digital Asset Links endpoint over HTTPS.
4. Build the signed AAB/APK and verify its certificate matches the asset link.

Do not publish a debug fingerprint in the production asset-links file.

## Remaining QA

- Define and ship the approved offline/native value before moderation.
- Test TWA verification, cold launch, offline state, back navigation, external
  Maps/WhatsApp handoffs, file picker, privacy choices, saves and sharing on a
  physical Android device.
- Inspect the merged release manifest for permissions.
- Produce a signed AAB/APK; Android lint and the unsigned release build already
  pass locally.
- Create the RuStore developer/app record, privacy declaration, screenshots and
  Russian listing metadata.
