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

test("native Mapbox plugins default telemetry off and advertise routing only with a public native route bridge", async () => {
  const [ios, android] = await Promise.all([
    readFile(iosPluginUrl, "utf8"),
    readFile(androidPluginUrl, "utf8"),
  ]);

  assert.match(android, /@PluginMethod[\s\S]{0,200}\broute\s*\(/);
  assert.match(ios, /CAPPluginMethod\s*\(\s*name:\s*"route"/);
  assert.match(ios, /@objc\s+func\s+route\s*\(/);
  assert.match(android, /put\s*\(\s*"onboardRouting"\s*,\s*true\s*\)/);
  assert.match(ios, /"onboardRouting"\s*:/);
  assert.match(`${android}\n${ios}`, /MapboxNavigation(?:Provider)?/);

  assert.match(ios, /(?:public\s+override|override\s+public)\s+func\s+load\s*\(\s*\)/);
  assert.match(ios, /object\s*\(\s*forKey:\s*"offline-mapbox\.telemetry-enabled"\s*\)/);
  assert.match(ios, /bool\s*\(\s*forKey:\s*"offline-mapbox\.telemetry-enabled"\s*\)/);
  assert.match(ios, /MGLMapboxMetricsEnabled/);
  assert.match(
    ios,
    /object\s*\(\s*forKey:\s*"offline-mapbox\.telemetry-enabled"\s*\)[\s\S]{0,500}bool\s*\(\s*forKey:\s*"offline-mapbox\.telemetry-enabled"\s*\)[\s\S]{0,300}false/,
  );

  assert.match(android, /(?:protected|public)\s+void\s+load\s*\(\s*\)/);
  assert.match(android, /contains\s*\(\s*"telemetry-enabled"\s*\)/);
  assert.match(android, /getBoolean\s*\(\s*"telemetry-enabled"\s*,\s*false\s*\)/);
  assert.match(android, /setUserTelemetryRequestState\s*\(/);
});

test("iOS Mapbox availability is token-gated without eager navigation provider initialization", async () => {
  const ios = await readFile(iosPluginUrl, "utf8");

  assert.match(
    ios,
    /\bvar\s+\w*(?:navigation|routing)\w*\s*:\s*MapboxNavigationProvider\s*\?(?:\s*=\s*nil)?/i,
    "MapboxNavigationProvider must be optional so plugin construction is safe without an access token",
  );
  assert.doesNotMatch(
    ios,
    /\b(?:lazy\s+)?(?:let|var)\s+\w*(?:navigation|routing)\w*\s*(?::\s*MapboxNavigationProvider\s*\??)?\s*=\s*MapboxNavigationProvider\s*\(/i,
    "MapboxNavigationProvider must not be initialized by a stored-property initializer",
  );
  assert.match(
    ios,
    /object\s*\(\s*forInfoDictionaryKey:\s*"MBXAccessToken"\s*\)[\s\S]{0,800}trimmingCharacters\s*\(\s*in:\s*\.whitespacesAndNewlines\s*\)[\s\S]{0,800}!\s*\w+\.isEmpty[\s\S]{0,500}hasPrefix\s*\(\s*"pk\."\s*\)[\s\S]{0,1800}MapboxNavigationProvider\s*\(/,
    "a trimmed, nonblank public MBXAccessToken must be validated before constructing MapboxNavigationProvider",
  );

  const capability = swiftFunction(ios, "capability");
  assert.match(
    capability,
    /(?:token|provider|available|configured)/i,
    "capability must derive Mapbox availability from token-backed configuration",
  );
  for (const key of ["available", "mapTiles", "onboardRouting"]) {
    assert.match(capability, new RegExp(`"${key}"\\s*:`), `capability must report ${key}`);
    assert.doesNotMatch(
      capability,
      new RegExp(`"${key}"\\s*:\\s*(?:true|false)\\b`),
      `capability.${key} must reflect runtime token availability instead of a constant`,
    );
  }
});

test("iOS Mapbox calls degrade safely when MBXAccessToken is missing or blank", async () => {
  const ios = await readFile(iosPluginUrl, "utf8");
  const list = swiftFunction(ios, "list");

  assert.match(
    list,
    /(?:guard|if)[\s\S]{0,350}(?:token|provider|available|configured)[\s\S]{0,700}call\.resolve\s*\(\s*\[\s*"packs"\s*:\s*\[\s*\]\s*\]\s*\)/i,
    "list must resolve with an empty packs array when Mapbox is unavailable",
  );

  for (const name of ["download", "route", "open"]) {
    const method = swiftFunction(ios, name);
    assert.match(
      method,
      /(?:guard|if)[\s\S]{0,400}(?:token|provider|available|configured)[\s\S]{0,900}call\.reject\s*\([\s\S]{0,220}"offline_mapbox_unavailable"/i,
      `${name} must reject cleanly with offline_mapbox_unavailable when Mapbox is unavailable`,
    );
  }

  const remove = swiftFunction(ios, "remove");
  assert.match(
    remove,
    /"offline-mapbox\.\s*\\\(\s*(?:id|regionId)\s*\)"/,
    "remove must address the persisted offline-mapbox.<id> preference",
  );
  const preferenceCleanupAt = remove.search(/removeObject\s*\(\s*forKey\s*:/);
  assert.ok(
    preferenceCleanupAt >= 0,
    "remove must delete persisted region preferences even when Mapbox is unavailable",
  );
  const availabilityGateAt = remove.search(
    /(?:guard|if)[^\n]{0,240}(?:token|provider|available|configured)/i,
  );
  assert.ok(
    availabilityGateAt < 0 || preferenceCleanupAt < availabilityGateAt,
    "remove must clean preferences before any Mapbox availability gate",
  );
  assert.match(remove, /call\.resolve\s*\(/, "remove must still resolve after local preference cleanup");
});

test("privacy policy truthfully keeps Mapbox unavailable and telemetry disabled for this release", async () => {
  const privacy = await readFile(privacyUrl, "utf8");

  assert.match(privacy, /Mapbox/i);
  assert.match(privacy, /offline map/i);
  assert.match(privacy, /location/i);
  assert.match(privacy, /(?:unavailable|blocked)[\s\S]{0,500}telemetry is disabled/i);
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
