import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { aasaDetailsForApplication } from "./ios-native-readiness-core.mjs";
import { nativeReadinessFailures } from "./ios-release-core.mjs";

const root = new URL("../", import.meta.url);
const load = (path) => readFile(new URL(path, root), "utf8");

test("iOS ships the bundled catalogue shell instead of a remote wrapper", async () => {
  const [index, config, manifest] = await Promise.all([
    load("ios-web/index.html"),
    load("capacitor.config.ts"),
    load("ios-web/build-manifest.json"),
  ]);
  assert.match(index, /id="root"/);
  assert.match(index, /\.\/assets\/app-/);
  assert.doesNotMatch(index, /window\.location\.(?:replace|assign)|<iframe/i);
  assert.doesNotMatch(config, /url:\s*["']https:\/\/www\.otherbali\.com/);
  const buildManifest = JSON.parse(manifest);
  assert.equal(buildManifest.apiOrigin, "https://www.otherbali.com");
  const appAsset = buildManifest.assets.find((asset) => /\.\/assets\/app-.+\.js$/.test(asset));
  assert.ok(appAsset, "mobile build manifest is missing the application bundle");
  const appBundle = await load(`ios-web/${appAsset.slice(2)}`);
  assert.match(appBundle, /Discover Bali together/);
  assert.match(appBundle, /The right place for the moment you(?:’|\\u2019)re in\./);
  assert.match(appBundle, /Resident-curated places, routes and plans for every Bali moment\./);
  assert.match(appBundle, /Less searching\. More Bali\./);
});

test("the native catalogue supports bootstrap, durable saves, deep links and share", async () => {
  const [app, api, storage, runtime] = await Promise.all([
    load("mobile/src/App.tsx"),
    load("mobile/src/api.ts"),
    load("mobile/src/storage.ts"),
    load("mobile/src/native-runtime.ts"),
  ]);
  assert.match(api, /\/api\/mobile\/v1\/bootstrap/);
  assert.match(storage, /Preferences/);
  assert.match(app, /startDeepLinkMonitoring/);
  assert.match(runtime, /AppLauncher\.openUrl/);
  assert.match(runtime, /Share\.share/);
});

test("the iOS target and AASA have the exact production identity and next build number", async () => {
  const [plist, project, entitlements, aasaText] = await Promise.all([
    load("ios/App/App/Info.plist"),
    load("ios/App/App.xcodeproj/project.pbxproj"),
    load("ios/App/App/App.entitlements"),
    load("public/.well-known/apple-app-site-association"),
  ]);
  assert.match(project, /PRODUCT_BUNDLE_IDENTIFIER = com\.otherbali\.app/);
  assert.match(project, /CURRENT_PROJECT_VERSION = 7/);
  assert.match(project, /DEVELOPMENT_TEAM = KB7VPWHTTM/);
  assert.match(project, /\/\* Release \*\/ = \{[^}]*buildSettings = \{[^}]*CODE_SIGN_IDENTITY = "Apple Development";[^}]*\};\s*name = Release;\s*\};/);
  assert.doesNotMatch(project, /CODE_SIGN_IDENTITY = "Apple Distribution"/);
  assert.match(plist, /<string>otherbali<\/string>/);
  assert.doesNotMatch(plist, /MBXAccessToken|MAPBOX_ACCESS_TOKEN/);
  assert.match(
    plist,
    /<key>NSLocationWhenInUseUsageDescription<\/key>\s*<string>[^<]+<\/string>/,
  );
  assert.match(entitlements, /applinks:www\.otherbali\.com/);
  const aasa = JSON.parse(aasaText);
  assert.deepEqual(aasa.applinks.details[0].appIDs, ["KB7VPWHTTM.com.otherbali.app"]);
});

test("iOS keeps the local OfflineMapbox bridge without resolving the vendor SDK", async () => {
  const [configText, syncedPackage, pluginPackage, resolutionText] = await Promise.all([
    load("ios/App/App/capacitor.config.json"),
    load("ios/App/CapApp-SPM/Package.swift"),
    load("plugins/offline-mapbox/Package.swift"),
    load("ios/App/App.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved"),
  ]);
  const config = JSON.parse(configText);
  assert.ok(config.packageClassList.includes("OfflineMapboxPlugin"));
  assert.match(
    syncedPackage,
    /\.package\s*\(\s*name:\s*"OtherBaliOfflineMapbox"\s*,\s*path:\s*"\.\.\/\.\.\/\.\.\/plugins\/offline-mapbox"\s*\)/,
  );
  assert.match(
    syncedPackage,
    /\.product\s*\(\s*name:\s*"OtherBaliOfflineMapbox"\s*,\s*package:\s*"OtherBaliOfflineMapbox"\s*\)/,
  );
  assert.doesNotMatch(pluginPackage, /github\.com\/mapbox|\.product\s*\(\s*name:\s*"(?:Mapbox|Turf)/i);
  const resolution = JSON.parse(resolutionText);
  assert.equal(
    resolution.pins.some((pin) => /(?:mapbox|turf)/i.test(`${pin.identity} ${pin.location}`)),
    false,
  );
});

test("AASA routes and iOS release blockers stay bound to the exact application", () => {
  const aasa = {
    applinks: {
      details: [
        { appIDs: ["KB7VPWHTTM.com.otherbali.app"], components: [{ "/": "/places/*" }] },
        { appIDs: ["OTHERTEAM.other.app"], components: [{ "/": "/route/*" }] },
      ],
    },
  };
  const matching = aasaDetailsForApplication(aasa, "KB7VPWHTTM.com.otherbali.app");
  assert.equal(matching.length, 1);
  assert.doesNotMatch(JSON.stringify(matching), /route/);
  assert.deepEqual(nativeReadinessFailures({
    blockers: [{ code: "aasa_routes_missing", message: "missing exact routes" }],
  }), ["native readiness aasa_routes_missing: missing exact routes"]);
});
