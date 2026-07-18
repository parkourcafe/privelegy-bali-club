# Other Bali Android release

Date: 2026-07-18

Status: the current Play upload-key-signed AAB and RuStore app-signing-key APK
were rebuilt from source commit `9d1e854f863354b2955a4573186ff868dee24cab`
and passed the combined release-artifact verifier. The exact RuStore APK also
passed clean-install Samsung QA. Digital Asset Links are deployed. Google Play
enrolment remains blocked by the owner's pending identity appeal.

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

Use two keys with different responsibilities:

1. **Shared Android app-signing key** signs every RuStore APK and is supplied to
   Play App Signing during enrolment as Google's distribution key. Keeping the
   same final signer permits an installed build to be updated from either store.
2. **Google Play upload key** signs only the AAB uploaded to Play. Google verifies
   that upload signature and then signs distributed APKs with the shared
   app-signing key.

If the owner deliberately lets Google generate a different Play app-signing
key, Play and RuStore installations cannot update over one another. Record that
decision before enrolment; changing it later is constrained by each store's key
upgrade rules. The current RuStore signing inputs represent the shared
app-signing key.

No keystore, password or signing secret belongs in Git, chat, screenshots or a
store listing. Create keys only after owner approval, store passwords in a
password manager/macOS Keychain and keep at least two encrypted key backups.

The approved shared app-signing key and separate Play upload key are stored
outside Git with `0700` directory and `0600` file permissions; their passwords
are stored in macOS Keychain. Only one local private-key copy of each key has
been verified so far. An independent encrypted off-device backup is still a
release-owner gate.

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

After the IPA, AAB and APK all exist, set `BUNDLETOOL_JAR` to an official
executable `bundletool-all` JAR and run:

```bash
export BUNDLETOOL_JAR='/secure/release-tools/bundletool-all.jar'
npm run mobile:release:verify
```

The post-build verifier requires all three artifacts together. It checks the
Play AAB's JAR signer against `OTHER_BALI_PLAY_UPLOAD_CERT_SHA256`, the RuStore
APK signer against `OTHER_BALI_RUSTORE_APP_SIGNING_SHA256`, package/version/SDK,
permissions, embedded Capacitor configuration and every bundled shell file. It
also verifies the signed IPA, then writes atomic `release-artifacts.json` and
`SHA256SUMS` evidence tied to the exact clean Git commit and mobile source hash.

## Digital Asset Links

Do not publish the debug certificate or the Google Play **upload** certificate.
The production statement must contain:

- the final Google Play **app-signing** SHA-256 certificate from Play Console;
- the final RuStore APK signing SHA-256 certificate.

Export the two **public** X.509 certificates as PEM or DER files. These files do
not contain private keys and are safe to retain as release evidence. Then run:

```bash
export OTHER_BALI_PLAY_APP_SIGNING_CERT_FILE='/secure/release-evidence/play-app-signing.der'
export OTHER_BALI_RUSTORE_APP_SIGNING_CERT_FILE='/secure/release-evidence/rustore-app-signing.pem'
npm run android:assetlinks
```

The generator parses both certificates, verifies current validity, rejects an
Android Debug subject, computes their SHA-256 fingerprints, deduplicates the
shared signer and writes `public/.well-known/assetlinks.json`. Deploy it and
verify HTTP 200, `application/json`, no redirect and no cookie before signed
deep-link QA.

## Samsung signed-release evidence

On SM-A075F / Android 16, the current signed RuStore release APK passed:

- cold launch and production catalogue bootstrap;
- venue detail and external Google Maps handoff;
- route detail;
- saving a detailed venue and route for offline use;
- persistence across force-stop/relaunch;
- native Share chooser, including normal cancellation;
- Android hardware Back from detail and exit from root;
- warm and cold ordinary HTTPS deep links after the domain association verified;
- offline relaunch with cached route/venue data and recovery after networking returned;
- Privacy custom-tab handoff.

The package was first removed and then installed from the current release APK.
The installed base APK was pulled back from the device and matched
`72982a07956cf88c60dc66930b7329ccf667e8acbaaba4315c450d26bf7d8c00`
byte-for-byte. No app crash appeared in the crash buffer. This long-lived test
device retained a prior user-level Disabled link preference across uninstall;
the domain association itself was verified, then the preference was explicitly
set to Enabled before the ordinary cold/warm HTTPS link cases. Google Play
distributed-build QA remains pending until the owner account is verified and
Play App Signing can be configured.
