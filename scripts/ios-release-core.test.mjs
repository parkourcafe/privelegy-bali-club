import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { copyFile, mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import test from "node:test";
import {
  iosMapSdkBuiltArtifactFailures,
  iosMapSdkSourceFailures,
  privacyManifestEvidence,
} from "./ios-release-core.mjs";

const execFileAsync = promisify(execFile);
const sourceManifest = path.resolve("ios/App/App/PrivacyInfo.xcprivacy");

function assertPreferencesDeclaration(evidence) {
  assert.deepEqual(evidence?.missingKeys, []);
  assert.equal(evidence?.userDefaultsReasonCA921, true);
  assert.deepEqual(evidence?.collectedDataTypes, [
    "NSPrivacyCollectedDataTypeCoarseLocation",
    "NSPrivacyCollectedDataTypeDeviceID",
    "NSPrivacyCollectedDataTypeOtherDiagnosticData",
    "NSPrivacyCollectedDataTypeOtherUserContent",
    "NSPrivacyCollectedDataTypeProductInteraction",
  ]);
  assert.equal(evidence?.collectedDataTypesExact, true);
  assert.equal(evidence?.status, "declared-values-require-review");
}

test("privacy evidence reads the source XML manifest", async () => {
  assertPreferencesDeclaration(
    await privacyManifestEvidence(sourceManifest, "PrivacyInfo.xcprivacy"),
  );
});

test(
  "privacy evidence decodes the binary manifest emitted by Xcode",
  { skip: process.platform !== "darwin" },
  async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "otherbali-privacy-"));
    const binaryManifest = path.join(directory, "PrivacyInfo.xcprivacy");
    try {
      await copyFile(sourceManifest, binaryManifest);
      await execFileAsync("/usr/bin/plutil", ["-convert", "binary1", binaryManifest]);
      assertPreferencesDeclaration(
        await privacyManifestEvidence(binaryManifest, "PrivacyInfo.xcprivacy"),
      );
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  },
);

test("iOS source keeps the local bridge but contains no vendor SDK or token plumbing", async () => {
  const files = {
    pluginPackage: "plugins/offline-mapbox/Package.swift",
    pluginSource: "plugins/offline-mapbox/ios/Sources/OfflineMapboxPlugin/OfflineMapboxPlugin.swift",
    infoPlist: "ios/App/App/Info.plist",
    packageResolution: "ios/App/App.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved",
    syncedPackage: "ios/App/CapApp-SPM/Package.swift",
    releaseScript: "scripts/build-ios-release.sh",
    releaseVerifier: "scripts/verify-ios-release.mjs",
  };
  const source = Object.fromEntries(await Promise.all(
    Object.entries(files).map(async ([key, file]) => [key, await readFile(path.resolve(file), "utf8")]),
  ));
  assert.deepEqual(iosMapSdkSourceFailures(source), []);

  assert.match(
    iosMapSdkSourceFailures({
      ...source,
      pluginPackage: `${source.pluginPackage}\n.package(url: "https://github.com/mapbox/mapbox-maps-ios", from: "1.0.0")`,
    }).join("\n"),
    /depends on a Mapbox or Turf product/,
  );
  assert.match(
    iosMapSdkSourceFailures({
      ...source,
      pluginSource: `${source.pluginSource}\nimport MapboxMaps`,
    }).join("\n"),
    /imports or references a Mapbox or Turf SDK module/,
  );
  assert.match(
    iosMapSdkSourceFailures({
      ...source,
      infoPlist: `${source.infoPlist}\n<key>MBXAccessToken</key>`,
    }).join("\n"),
    /access-token plumbing/,
  );
  assert.match(
    iosMapSdkSourceFailures({
      ...source,
      packageResolution: JSON.stringify({
        pins: [{
          identity: "mapbox-maps-ios",
          location: "https://github.com/mapbox/mapbox-maps-ios.git",
        }],
      }),
    }).join("\n"),
    /vendor SDK pin/,
  );
  assert.match(
    iosMapSdkSourceFailures({
      ...source,
      packageResolution: "{",
    }).join("\n"),
    /missing or invalid JSON/,
  );
  assert.match(
    iosMapSdkSourceFailures({
      ...source,
      syncedPackage: source.syncedPackage.replace(
        /\.product\s*\(\s*name:\s*"OtherBaliOfflineMapbox"\s*,\s*package:\s*"OtherBaliOfflineMapbox"\s*\),?/,
        "",
      ),
    }).join("\n"),
    /retain the local OtherBaliOfflineMapbox bridge registration/,
  );
});

test("built artifact gate allows the local bridge and rejects every vendor SDK shape", () => {
  assert.deepEqual(iosMapSdkBuiltArtifactFailures({
    info: { CFBundleIdentifier: "com.otherbali.app" },
    embeddedFrameworks: ["Frameworks/OtherBaliOfflineMapbox.framework"],
    embeddedBundles: ["OtherBaliOfflineMapbox.bundle"],
    embeddedManifests: [{ path: "PrivacyInfo.xcprivacy", bytes: 1 }],
    linkedLibraries: ["@rpath/OtherBaliOfflineMapbox.framework/OtherBaliOfflineMapbox"],
    binaryStrings: "OfflineMapboxPlugin",
  }), []);

  for (const artifact of [
    "Frameworks/MapboxMaps.framework",
    "Frameworks/MapboxCommon.framework",
    "Frameworks/MapboxCoreMaps.framework",
    "Frameworks/MapboxNavigationCore.framework",
    "Frameworks/MapboxNavigationNative.framework",
    "Frameworks/MapboxDirections.framework",
    "Frameworks/Turf.framework",
    "MapboxMaps.bundle",
    "MapboxNavigation.bundle/PrivacyInfo.xcprivacy",
  ]) {
    assert.match(
      iosMapSdkBuiltArtifactFailures({ embeddedFrameworks: [artifact] }).join("\n"),
      /Mapbox or Turf SDK artifact/,
      artifact,
    );
  }
  assert.match(
    iosMapSdkBuiltArtifactFailures({
      linkedLibraries: ["@rpath/MapboxMaps.framework/MapboxMaps"],
    }).join("\n"),
    /Mapbox or Turf SDK artifact/,
  );
  assert.match(
    iosMapSdkBuiltArtifactFailures({ info: { MBXAccessToken: "pk.example" } }).join("\n"),
    /access-token material/,
  );
  assert.match(
    iosMapSdkBuiltArtifactFailures({ binaryStrings: "_$s10MapboxMaps0B4ViewC" }).join("\n"),
    /SDK\/token marker/,
  );
});
