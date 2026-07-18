import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createCapacitorConfig } from "../capacitor.config";

test("Capacitor Release uses only the bundled local shell with logging disabled", () => {
  const config = createCapacitorConfig({});
  assert.equal(config.webDir, "ios-web");
  assert.equal(config.loggingBehavior, "none");
  assert.equal(config.server, undefined);
  assert.deepEqual(config.plugins?.SystemBars, { style: "DARK" });
});

test("Capacitor development server is opt-in and private-network only", () => {
  const config = createCapacitorConfig({ CAPACITOR_DEV_SERVER_URL: "http://127.0.0.1:5173" });
  assert.deepEqual(config.server, {
    url: "http://127.0.0.1:5173",
    cleartext: true,
    errorPath: "offline.html",
  });
  assert.equal(config.loggingBehavior, "debug");

  assert.throws(
    () => createCapacitorConfig({ CAPACITOR_DEV_SERVER_URL: "https://www.otherbali.com" }),
    /loopback or private-network/,
  );
  assert.throws(
    () => createCapacitorConfig({ CAPACITOR_DEV_SERVER_URL: "http://192.168.1.10:5173/path" }),
    /origin without a path/,
  );
});

test("iOS verification rejects stale source and archive command rebuilds then syncs", () => {
  const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  assert.match(packageJson.scripts["ios:archive:dry"], /mobile:build.*mobile:sync:ios.*--archive/);
  const buildScript = readFileSync(new URL("./build-mobile-shell.mjs", import.meta.url), "utf8");
  const releaseGuard = readFileSync(new URL("./ios-release-core.mjs", import.meta.url), "utf8");
  const xcodeProject = readFileSync(
    new URL("../ios/App/App.xcodeproj/project.pbxproj", import.meta.url),
    "utf8",
  );
  const xcodePreflight = readFileSync(new URL("./xcode-release-preflight.sh", import.meta.url), "utf8");
  assert.match(buildScript, /sourceInputs/);
  assert.match(buildScript, /sourceHash/);
  assert.match(buildScript, /capacitor\.config\.ts/);
  assert.match(buildScript, /package-lock\.json/);
  assert.match(releaseGuard, /ios-web is stale relative to mobile\/shared source/);
  assert.match(releaseGuard, /built app contains a stale mobile shell manifest/);
  assert.match(releaseGuard, /inspectBundledShellCopy/);
  assert.match(releaseGuard, /"generated iOS shell"/);
  assert.match(xcodeProject, /Verify Release Shell/);
  assert.match(xcodeProject, /xcode-release-preflight\.sh/);
  assert.match(xcodePreflight, /CONFIGURATION.*Release/);
  assert.match(xcodePreflight, /verify-ios-release\.mjs --config-only/);
});

test("mobile shell consumes Capacitor safe-area variables with browser fallbacks", () => {
  const [styles, offline] = [
    readFileSync(new URL("../mobile/src/styles.css", import.meta.url), "utf8"),
    readFileSync(new URL("../mobile/public/offline.html", import.meta.url), "utf8"),
  ];
  for (const source of [styles, offline]) {
    assert.match(source, /var\(--safe-area-inset-top,\s*env\(safe-area-inset-top\)\)/);
    assert.match(source, /var\(--safe-area-inset-bottom,\s*env\(safe-area-inset-bottom\)\)/);
  }
});

test("large iPhones stack card actions instead of crushing route titles", () => {
  const styles = readFileSync(new URL("../mobile/src/styles.css", import.meta.url), "utf8");
  assert.match(styles, /@media\s*\(max-width:\s*520px\)/);
  assert.match(styles, /\.card\s*\{[^}]*flex-direction:\s*column/);
  assert.match(styles, /\.card-actions\s*\{[^}]*width:\s*100%/);
});

test("native bridge plugins and privacy declarations match the approved release scope", () => {
  const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(packageJson.dependencies["@capacitor/core"], "8.4.1");
  assert.equal(packageJson.dependencies["@capacitor/ios"], "8.4.1");
  assert.equal(packageJson.dependencies["@capacitor/android"], "8.4.1");
  assert.deepEqual(
    Object.fromEntries([
      "@capacitor/app",
      "@capacitor/app-launcher",
      "@capacitor/browser",
      "@capacitor/network",
      "@capacitor/preferences",
      "@capacitor/share",
    ].map((name) => [name, packageJson.dependencies[name]])),
    {
      "@capacitor/app": "8.1.1",
      "@capacitor/app-launcher": "8.0.1",
      "@capacitor/browser": "8.0.3",
      "@capacitor/network": "8.0.1",
      "@capacitor/preferences": "8.0.1",
      "@capacitor/share": "8.0.1",
    },
  );
  const privacy = readFileSync(new URL("../ios/App/App/PrivacyInfo.xcprivacy", import.meta.url), "utf8");
  assert.match(privacy, /NSPrivacyAccessedAPICategoryUserDefaults/);
  assert.match(privacy, /<string>CA92\.1<\/string>/);
  for (const type of [
    "NSPrivacyCollectedDataTypeCoarseLocation",
    "NSPrivacyCollectedDataTypeProductInteraction",
    "NSPrivacyCollectedDataTypeOtherDiagnosticData",
  ]) {
    assert.match(privacy, new RegExp(`<string>${type}<\\/string>`));
  }
  const storePrivacy = readFileSync(
    new URL("../docs/store-privacy-declarations.md", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(storePrivacy, /Does the app collect data\? \*\*No\*\*/i);
  assert.match(storePrivacy, /Never answer[\s\S]*Data Not\s+Collected/);
});
