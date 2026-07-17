# Other Bali Android release

Date: 2026-07-18

Status: Capacitor candidate implemented and debug-tested on the connected
Samsung. Store-signed AAB/APK and verified Digital Asset Links remain blocked
on owner-approved production key creation.

## Canonical architecture

- Source project: `android/`
- Bundled shell: `ios-web/`, generated from `mobile/`
- Package: `com.otherbali.app`
- Version: `1.0.0` (`versionCode 2`)
- Minimum/target: API 24 / API 36
- Runtime: Capacitor Android 8.4.1
- Product: `Places / Routes / Saved`, identical to the iOS mobile shell

The superseded `android-twa/` experiment was removed from the canonical release
branch so it cannot be built or uploaded accidentally.
The current app has independent native/offline value and does not open the
website as its main interface.

## Toolchain and debug build

- Node 22 or newer (`.nvmrc` and `package.json#engines`)
- Java 21 (Android Studio JBR is supported)
- Android SDK/target 36
- Gradle 8.14.3; distribution and wrapper checksums are pinned

```bash
npm ci
npm run android:debug
```

The copied web assets and generated Capacitor configuration are gitignored.
Always run `mobile:build` and `cap sync android` before Gradle packaging; the
package scripts do this automatically.

## Store signing model

Two credentials are deliberately separate:

1. **Google Play upload key** signs the AAB uploaded to Play. Google Play App
   Signing then signs the distributed APKs with the Play app-signing certificate.
2. **RuStore app-signing key** signs the APK distributed by RuStore and must be
   retained for every future RuStore update.

No keystore, password or signing secret belongs in Git, chat, screenshots or a
store listing. Create keys only after owner approval, store passwords in a
password manager/macOS Keychain and keep at least two encrypted key backups.

Protected Google Play inputs:

- `OTHER_BALI_PLAY_UPLOAD_STORE_FILE`
- `OTHER_BALI_PLAY_UPLOAD_STORE_PASSWORD`
- `OTHER_BALI_PLAY_UPLOAD_KEY_ALIAS`
- `OTHER_BALI_PLAY_UPLOAD_KEY_PASSWORD`
- `OTHER_BALI_PLAY_UPLOAD_CERT_SHA256`

Protected RuStore inputs:

- `OTHER_BALI_RUSTORE_STORE_FILE`
- `OTHER_BALI_RUSTORE_STORE_PASSWORD`
- `OTHER_BALI_RUSTORE_KEY_ALIAS`
- `OTHER_BALI_RUSTORE_KEY_PASSWORD`
- `OTHER_BALI_RUSTORE_APP_SIGNING_SHA256`

Build commands:

```bash
npm run android:release:play
npm run android:release:rustore
```

The Play task produces `bundlePlayRelease`; the RuStore task produces
`assembleRustoreRelease`. Both fail closed when any protected input is absent
or the configured keystore file does not exist.

## Digital Asset Links

Do not publish the debug certificate or the Google Play **upload** certificate.
The production statement must contain:

- the final Google Play **app-signing** SHA-256 certificate from Play Console;
- the final RuStore APK signing SHA-256 certificate.

After both are known:

```bash
export OTHER_BALI_PLAY_APP_SIGNING_SHA256='AA:...'
export OTHER_BALI_RUSTORE_APP_SIGNING_SHA256='BB:...'
npm run android:assetlinks
```

The generator validates two complete SHA-256 fingerprints, deduplicates a
shared signer and writes `public/.well-known/assetlinks.json`. Deploy it and
verify HTTP 200, `application/json`, no redirect and no cookie before signed
deep-link QA.

## Current Samsung evidence

On SM-A075F / Android 16, the current debug candidate passed:

- cold launch and production catalogue bootstrap;
- venue detail and external Google Maps handoff;
- route detail and opening a route stop;
- saving a detailed venue and route for offline use;
- persistence across force-stop/relaunch and app update;
- native Share chooser, including normal cancellation;
- Android hardware Back from detail and exit from root;
- warm and cold explicit deep links;
- offline relaunch with cached route/venue data and recovery after networking returned;
- Privacy custom-tab handoff.

This is preliminary debug evidence. Repeat the full matrix on the exact
RuStore-signed APK and Play-distributed internal-test build after Digital Asset
Links is deployed.
