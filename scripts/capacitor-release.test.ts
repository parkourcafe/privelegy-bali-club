import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createCapacitorConfig } from "../capacitor.config";

test("Capacitor Release uses only the bundled local shell with logging disabled", () => {
  const config = createCapacitorConfig({});
  assert.equal(config.webDir, "ios-web");
  assert.equal(config.loggingBehavior, "none");
  assert.equal(config.server, undefined);
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
  assert.match(packageJson.scripts["ios:archive:dry"], /mobile:build.*mobile:sync.*--archive/);
  const buildScript = readFileSync(new URL("./build-mobile-shell.mjs", import.meta.url), "utf8");
  const releaseGuard = readFileSync(new URL("./ios-release-core.mjs", import.meta.url), "utf8");
  assert.match(buildScript, /sourceInputs/);
  assert.match(buildScript, /sourceHash/);
  assert.match(buildScript, /package-lock\.json/);
  assert.match(releaseGuard, /ios-web is stale relative to mobile\/shared source/);
  assert.match(releaseGuard, /built app contains a stale mobile shell manifest/);
});

test("native bridge plugins are exact and Preferences has its required privacy reason", () => {
  const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
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
      "@capacitor/app": "8.1.0",
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
});
