import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const iosPluginUrl = new URL(
  "../plugins/offline-mapbox/ios/Sources/OfflineMapboxPlugin/OfflineMapboxPlugin.swift",
  import.meta.url,
);
const androidPluginUrl = new URL(
  "../plugins/offline-mapbox/android/src/main/java/com/otherbali/offlinemapbox/OfflineMapboxPlugin.java",
  import.meta.url,
);
const iosPackageUrl = new URL("../plugins/offline-mapbox/Package.swift", import.meta.url);
const iosResolutionUrl = new URL(
  "../ios/App/App.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved",
  import.meta.url,
);
const iosInfoUrl = new URL("../ios/App/App/Info.plist", import.meta.url);
const privacyUrl = new URL("../app/privacy/page.tsx", import.meta.url);
const workflowUrl = new URL("../.github/workflows/ci.yml", import.meta.url);
const appUrl = new URL("../mobile/src/App.tsx", import.meta.url);

function swiftFunction(source, name) {
  const signature = new RegExp(`\\bfunc\\s+${name}\\s*\\(`).exec(source);
  assert.ok(signature, `iOS OfflineMapboxPlugin.${name} is missing`);

  const bodyStart = source.indexOf("{", signature.index);
  assert.notEqual(bodyStart, -1, `iOS OfflineMapboxPlugin.${name} has no body`);

  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(signature.index, index + 1);
  }

  assert.fail(`iOS OfflineMapboxPlugin.${name} has an unterminated body`);
}

test("Android retains native Mapbox routing and default-off telemetry while iOS retains only the public bridge", async () => {
  const [ios, android] = await Promise.all([
    readFile(iosPluginUrl, "utf8"),
    readFile(androidPluginUrl, "utf8"),
  ]);

  assert.match(android, /@PluginMethod[\s\S]{0,200}\broute\s*\(/);
  assert.match(ios, /CAPPluginMethod\s*\(\s*name:\s*"route"/);
  assert.match(ios, /@objc\s+func\s+route\s*\(/);
  assert.match(android, /put\s*\(\s*"onboardRouting"\s*,\s*true\s*\)/);
  assert.match(android, /MapboxNavigation(?:Provider)?/);

  assert.match(android, /(?:protected|public)\s+void\s+load\s*\(\s*\)/);
  assert.match(android, /contains\s*\(\s*"telemetry-enabled"\s*\)/);
  assert.match(android, /getBoolean\s*\(\s*"telemetry-enabled"\s*,\s*false\s*\)/);
  assert.match(android, /setUserTelemetryRequestState\s*\(/);
});

test("iOS bridge is an SDK-free, permanently unavailable Capacitor stub", async () => {
  const [ios, packageManifest, resolution, info] = await Promise.all([
    readFile(iosPluginUrl, "utf8"),
    readFile(iosPackageUrl, "utf8"),
    readFile(iosResolutionUrl, "utf8"),
    readFile(iosInfoUrl, "utf8"),
  ]);

  assert.match(ios, /^\s*import\s+Capacitor\s*$/m);
  assert.doesNotMatch(ios, /^\s*import\s+(?:Mapbox\w*|Turf)\b/m);
  assert.doesNotMatch(
    ios,
    /\b(?:MapboxCommon|MapboxCoreMaps|MapboxMaps|MapboxNavigation\w*|MapboxDirections|Turf|MBXAccessToken|MGLMapboxMetricsEnabled)\b/,
  );
  assert.doesNotMatch(packageManifest, /github\.com\/mapbox|\.product\s*\(\s*name:\s*"(?:Mapbox|Turf)/i);
  const pins = JSON.parse(resolution).pins;
  assert.equal(
    pins.some((pin) => /(?:mapbox|turf)/i.test(`${pin.identity} ${pin.location}`)),
    false,
  );
  assert.doesNotMatch(info, /MBXAccessToken|MAPBOX_ACCESS_TOKEN/);
  assert.match(info, /NSLocationWhenInUseUsageDescription/);

  const capability = swiftFunction(ios, "capability");
  for (const key of [
    "available",
    "mapTiles",
    "gpsOnDownloadedMap",
    "onboardRouting",
    "telemetryOptOutAvailable",
  ]) {
    assert.match(capability, new RegExp(`"${key}"\\s*:\\s*false\\b`));
  }
  assert.match(capability, /"provider"\s*:\s*"mapbox"/);
  assert.match(capability, /"maxDeviceBytes"\s*:\s*0\b/);
});

test("iOS unavailable methods fail closed without state or provider work", async () => {
  const ios = await readFile(iosPluginUrl, "utf8");
  const list = swiftFunction(ios, "list");

  assert.match(
    list,
    /call\.resolve\s*\(\s*\[\s*"packs"\s*:\s*\[\s*\]\s*\]\s*\)/,
    "list must resolve with an empty packs array",
  );

  for (const name of ["download", "route", "open"]) {
    const method = swiftFunction(ios, name);
    assert.match(
      method,
      /call\.reject\s*\(\s*"offline_mapbox_unavailable"\s*\)/,
      `${name} must reject cleanly with offline_mapbox_unavailable`,
    );
    assert.doesNotMatch(method, /call\.resolve|Task\s*\{|UserDefaults|provider/i);
  }

  const remove = swiftFunction(ios, "remove");
  assert.match(
    remove,
    /guard\s+let\s+regionId\s*=\s*call\.getString\s*\(\s*"regionId"\s*\)/,
    "remove must validate regionId before resolving",
  );
  assert.match(remove, /call\.reject\s*\(\s*"region_id_required"\s*\)/);
  assert.match(remove, /call\.resolve\s*\(/);
  assert.doesNotMatch(remove, /UserDefaults|provider/i);

  const telemetry = swiftFunction(ios, "setTelemetryConsent");
  assert.match(telemetry, /call\.resolve\s*\(/);
  assert.doesNotMatch(telemetry, /getBool|UserDefaults|MGLMapboxMetricsEnabled|telemetry-enabled/);
});

test("privacy policy states that iOS omits the SDK while Android remains gated", async () => {
  const privacy = await readFile(privacyUrl, "utf8");

  assert.match(privacy, /Mapbox/i);
  assert.match(privacy, /offline map/i);
  assert.match(privacy, /location/i);
  assert.match(privacy, /iOS[\s\S]{0,300}(?:does not include|without)[\s\S]{0,200}Mapbox/i);
  assert.match(privacy, /Android[\s\S]{0,400}(?:gated|blocked)/i);
  assert.match(privacy, /Android[\s\S]{0,500}telemetry[\s\S]{0,120}(?:disabled|off)/i);
  assert.doesNotMatch(
    privacy,
    /If you choose an offline map download[\s\S]{0,500}Mapbox processes/i,
  );
  assert.doesNotMatch(privacy, /(?:Mapbox|offline)[\s\S]{0,120}(?:routing is live|live onboard routing)/i);
});

test("the mobile App delegates download state transitions to the capability-gated runtime", async () => {
  const app = await readFile(appUrl, "utf8");
  assert.match(
    app,
    /import\s*\{[\s\S]{0,300}downloadOfflineRegionIfAvailable[\s\S]{0,300}\}\s*from\s*"\.\/offline-runtime"/,
  );
  const downloadCallbackAt = app.indexOf("const downloadOfflineRegion");
  const removeCallbackAt = app.indexOf("const removeOfflineRegion", downloadCallbackAt);
  assert.ok(downloadCallbackAt >= 0 && removeCallbackAt > downloadCallbackAt);
  const callback = app.slice(downloadCallbackAt, removeCallbackAt);
  assert.match(callback, /downloadOfflineRegionIfAvailable\s*\(/);
  assert.doesNotMatch(callback, /defaultOfflineMapRuntime\.download\s*\(/);
});

test("Android CI injects the protected downloads token and fails before Gradle without exposing it", async () => {
  const workflow = await readFile(workflowUrl, "utf8");
  const androidJobAt = workflow.indexOf("\n  android:");
  const iosJobAt = workflow.indexOf("\n  ios-archive:");
  assert.ok(androidJobAt >= 0 && iosJobAt > androidJobAt);
  const androidJob = workflow.slice(androidJobAt, iosJobAt);

  assert.match(
    androidJob,
    /MAPBOX_DOWNLOADS_TOKEN:\s*\$\{\{\s*secrets\.MAPBOX_DOWNLOADS_TOKEN\s*\}\}/,
  );
  const preflightAt = androidJob.search(
    /(?:Verify|Confirm|Require|Check)[^\n]*(?:Mapbox|downloads token)/i,
  );
  const gradleAt = androidJob.indexOf("./gradlew");
  assert.ok(preflightAt >= 0 && gradleAt > preflightAt);
  const preflight = androidJob.slice(preflightAt, gradleAt);
  assert.match(preflight, /MAPBOX_DOWNLOADS_TOKEN/);
  assert.match(preflight, /(?:-z|:\?)/);
  assert.doesNotMatch(
    androidJob,
    /(?:echo|printf)[^\n]*(?:\$MAPBOX_DOWNLOADS_TOKEN|\$\{MAPBOX_DOWNLOADS_TOKEN)|set\s+-x/i,
  );
});
