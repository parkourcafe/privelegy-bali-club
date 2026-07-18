import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  RELEASE_CONTRACT,
  assertAndroidMetadata,
  assertIosMetadata,
  assertReleaseCertificate,
  normalizeFingerprint,
  parseAaptBadging,
  parseAaptPermissions,
  parseApksignerOutput,
  parseBundletoolManifest,
  parseCodesignDetails,
  parseJarSignerOutput,
  parseKeytoolCertificate,
} from "./release-artifacts-core.mjs";

const fingerprint = "11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00";
const normalizedFingerprint = fingerprint.replaceAll(":", "");

const aaptBadging = `package: name='com.otherbali.app' versionCode='2' versionName='1.0.0' platformBuildVersionName='16' platformBuildVersionCode='36' compileSdkVersion='36' compileSdkVersionCodename='16'
minSdkVersion:'24'
targetSdkVersion:'36'
uses-permission: name='android.permission.INTERNET'
uses-permission: name='android.permission.ACCESS_NETWORK_STATE'
uses-permission: name='com.otherbali.app.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION'
application-label:'Other Bali'
`;

const bundletoolManifest = `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  android:compileSdkVersion="36"
  android:versionCode="2"
  android:versionName="1.0.0"
  package="com.otherbali.app">
  <uses-sdk android:minSdkVersion="24" android:targetSdkVersion="36" />
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
  <uses-permission android:name="com.otherbali.app.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION" />
  <application android:debuggable="false" />
</manifest>`;

function validIosEvidence() {
  const applicationIdentifier = "KB7VPWHTTM.com.otherbali.app";
  return {
    info: {
      CFBundleIdentifier: "com.otherbali.app",
      CFBundleShortVersionString: "1.0",
      CFBundleVersion: "4",
      MinimumOSVersion: "15.0",
      DTPlatformName: "iphoneos",
      DTSDKName: "iphoneos26.5",
      UIDeviceFamily: [1],
      CAPACITOR_DEBUG: false,
    },
    entitlements: {
      "application-identifier": applicationIdentifier,
      "beta-reports-active": true,
      "com.apple.developer.associated-domains": ["applinks:www.otherbali.com"],
      "com.apple.developer.team-identifier": "KB7VPWHTTM",
      "get-task-allow": false,
      "keychain-access-groups": [applicationIdentifier],
    },
    profile: {
      UUID: "00000000-1111-2222-3333-444444444444",
      Name: "Other Bali App Store",
      TeamIdentifier: ["KB7VPWHTTM"],
      ExpirationDate: "2030-01-01T00:00:00.000Z",
      Entitlements: {
        "application-identifier": applicationIdentifier,
        "com.apple.developer.associated-domains": ["applinks:www.otherbali.com"],
        "com.apple.developer.team-identifier": "KB7VPWHTTM",
        "get-task-allow": false,
      },
    },
    codesign: {
      identifier: "com.otherbali.app",
      teamIdentifier: "KB7VPWHTTM",
      signature: "size=9999",
      authorities: [
        "Apple Distribution: Other Bali (KB7VPWHTTM)",
        "Apple Worldwide Developer Relations Certification Authority",
        "Apple Root CA",
      ],
    },
    now: new Date("2029-01-01T00:00:00.000Z"),
  };
}

test("release contract pins all store identities, versions, SDKs, and permissions", () => {
  assert.deepEqual(RELEASE_CONTRACT, {
    appId: "com.otherbali.app",
    appleTeamId: "KB7VPWHTTM",
    iosVersion: "1.0",
    iosBuild: "4",
    iosMinimumVersion: "15.0",
    associatedDomains: ["applinks:www.otherbali.com"],
    androidVersion: "1.0.0",
    androidVersionCode: "2",
    androidMinSdk: "24",
    androidTargetSdk: "36",
    androidCompileSdk: "36",
    androidPermissions: [
      "android.permission.ACCESS_NETWORK_STATE",
      "android.permission.INTERNET",
      "com.otherbali.app.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION",
    ],
  });
});

test("aapt2 parsers accept only the pinned non-debug RuStore contract", () => {
  const badging = parseAaptBadging(aaptBadging);
  assert.equal(assertAndroidMetadata(badging, "fixture APK"), true);
  assert.deepEqual(parseAaptPermissions(`package: com.otherbali.app
uses-permission: name='android.permission.INTERNET'
uses-permission: name='android.permission.ACCESS_NETWORK_STATE'
permission: name='com.otherbali.app.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION' protectionLevel='signature'
uses-permission: name='com.otherbali.app.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION'
`), {
    uses: [...RELEASE_CONTRACT.androidPermissions],
    declared: [{
      name: "com.otherbali.app.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION",
      protectionLevel: "signature",
    }],
  });
  assert.throws(
    () => assertAndroidMetadata(parseAaptBadging(`${aaptBadging}application-debuggable\n`), "fixture APK"),
    /must not be debuggable/,
  );
  assert.throws(
    () => assertAndroidMetadata(parseAaptBadging(`${aaptBadging}uses-permission: name='android.permission.CAMERA'\n`), "fixture APK"),
    /permissions must exactly equal/,
  );
});

test("bundletool manifest parser enforces Play identity and SDK contract", () => {
  const parsed = parseBundletoolManifest(bundletoolManifest);
  assert.equal(assertAndroidMetadata(parsed, "fixture AAB"), true);
  assert.throws(
    () => assertAndroidMetadata(parseBundletoolManifest(bundletoolManifest.replace('android:targetSdkVersion="36"', 'android:targetSdkVersion="35"')), "fixture AAB"),
    /target SDK must equal 36/,
  );
});

test("Android signature parsers distinguish release signatures and approved fingerprints", () => {
  const apkSignature = parseApksignerOutput(`Verifies
Verified using v1 scheme (JAR signing): true
Verified using v2 scheme (APK Signature Scheme v2): true
Verified using v3 scheme (APK Signature Scheme v3): true
Signer #1 certificate DN: CN=Other Bali Release, O=Other Bali
Signer #1 certificate SHA-256 digest: ${fingerprint}
`);
  assert.equal(apkSignature.v1, true);
  assert.equal(apkSignature.v2, true);
  assert.deepEqual(apkSignature.fingerprints, [normalizedFingerprint]);
  assert.equal(assertReleaseCertificate({
    fingerprint: apkSignature.fingerprints[0],
    subject: apkSignature.subjects[0],
    expectedFingerprint: fingerprint,
    label: "fixture APK",
  }), true);
  assert.throws(() => assertReleaseCertificate({
    fingerprint,
    subject: "CN=Android Debug, O=Android",
    expectedFingerprint: fingerprint,
    label: "fixture APK",
  }), /forbidden debug/);

  const keytool = parseKeytoolCertificate(`Owner: CN=Other Bali Play Upload, O=Other Bali
Certificate fingerprints:
         SHA256: ${fingerprint}
`);
  assert.equal(keytool.fingerprint, normalizedFingerprint);
  assert.match(keytool.owner, /Play Upload/);
  assert.deepEqual(parseJarSignerOutput(`  s = signature was verified
  ? = unsigned entry
jar verified.
`), { verified: true, hasUnsignedEntries: false, hasSignatureErrors: false });
  assert.equal(parseJarSignerOutput(" ? rogue.bin\njar verified.\n").hasUnsignedEntries, true);
});

test("codesign and iOS metadata parsers require Apple Distribution and fail closed", () => {
  const details = parseCodesignDetails(`Executable=/tmp/App
Identifier=com.otherbali.app
Authority=Apple Distribution: Other Bali (KB7VPWHTTM)
Authority=Apple Worldwide Developer Relations Certification Authority
TeamIdentifier=KB7VPWHTTM
Signature size=9999
`);
  assert.equal(details.identifier, "com.otherbali.app");
  assert.equal(details.teamIdentifier, "KB7VPWHTTM");
  assert.match(details.authorities[0], /^Apple Distribution/);
  assert.equal(assertIosMetadata(validIosEvidence()), true);
  const wildcardProfileGrant = validIosEvidence();
  wildcardProfileGrant.profile.Entitlements["com.apple.developer.associated-domains"] = ["*"];
  assert.equal(assertIosMetadata(wildcardProfileGrant), true);

  const debug = validIosEvidence();
  debug.entitlements["get-task-allow"] = true;
  assert.throws(() => assertIosMetadata(debug), /get-task-allow must be false/);

  const development = validIosEvidence();
  development.codesign.authorities[0] = "Apple Development: Developer (KB7VPWHTTM)";
  assert.throws(() => assertIosMetadata(development), /not signed by an Apple Distribution/);

  const permission = validIosEvidence();
  permission.info.NSCameraUsageDescription = "Camera";
  assert.throws(() => assertIosMetadata(permission), /unapproved privacy permissions/);

  const wrongDomain = validIosEvidence();
  wrongDomain.profile.Entitlements["com.apple.developer.associated-domains"] = ["applinks:preview.example"];
  assert.throws(() => assertIosMetadata(wrongDomain), /does not authorize the exact associated domain/);
});

test("fingerprints are normalized and malformed values fail closed", () => {
  assert.equal(normalizeFingerprint(fingerprint), normalizedFingerprint);
  assert.throws(() => normalizeFingerprint("debug"), /must be a SHA-256 fingerprint/);
});

test("signed iOS build command uses cloud-managed distribution signing and a local App Store export", async () => {
  const [script, exportOptions] = await Promise.all([
    readFile(new URL("./build-ios-release.sh", import.meta.url), "utf8"),
    readFile(new URL("../ios/App/ExportOptions.plist", import.meta.url), "utf8"),
  ]);
  assert.match(script, /YES_I_HAVE_ACTION_TIME_AUTHORIZATION/);
  const guardIndex = script.indexOf('if [[ "${OTHER_BALI_ALLOW_SIGNING:-}" != "${AUTHORIZATION_PHRASE}" ]]');
  const provisioningIndex = script.indexOf("xcodebuild \\");
  assert.ok(guardIndex >= 0 && provisioningIndex > guardIndex);
  assert.match(script, /CODE_SIGN_STYLE=Automatic/);
  assert.match(script, /CODE_SIGN_IDENTITY=Apple Development/);
  assert.doesNotMatch(script, /CODE_SIGN_IDENTITY=Apple Distribution/);
  const realisticIdentityFixture = '  1) AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA "Apple Development: Release Operator (A1B2C3D4E5)"';
  const identityMarker = script.match(/grep -F '([^']+)'/)?.[1];
  assert.equal(identityMarker, '"Apple Development:');
  assert.equal(realisticIdentityFixture.includes(identityMarker), true);
  assert.equal(realisticIdentityFixture.includes("(KB7VPWHTTM)"), false);
  assert.equal(script.match(/-allowProvisioningUpdates/g)?.length, 2);
  assert.doesNotMatch(script, /upload-app|notarytool|altool|iTMSTransporter/);
  assert.match(exportOptions, /<key>destination<\/key>\s*<string>export<\/string>/);
  assert.doesNotMatch(exportOptions, /<key>destination<\/key>\s*<string>upload<\/string>/);
  assert.match(exportOptions, /<string>app-store-connect<\/string>/);
  assert.match(exportOptions, /<string>KB7VPWHTTM<\/string>/);
  assert.match(exportOptions, /<string>com\.otherbali\.app<\/string>/);
});
