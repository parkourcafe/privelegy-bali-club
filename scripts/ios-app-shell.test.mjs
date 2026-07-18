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
  assert.equal(JSON.parse(manifest).apiOrigin, "https://www.otherbali.com");
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
  assert.match(project, /CURRENT_PROJECT_VERSION = 4/);
  assert.match(project, /DEVELOPMENT_TEAM = KB7VPWHTTM/);
  assert.match(project, /CODE_SIGN_IDENTITY = "Apple Distribution"/);
  assert.match(plist, /<string>otherbali<\/string>/);
  assert.match(entitlements, /applinks:www\.otherbali\.com/);
  const aasa = JSON.parse(aasaText);
  assert.deepEqual(aasa.applinks.details[0].appIDs, ["KB7VPWHTTM.com.otherbali.app"]);
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
