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

test("native Mapbox plugins default telemetry off and truthfully deny onboard routing", async () => {
  const [ios, android] = await Promise.all([
    readFile(iosPluginUrl, "utf8"),
    readFile(androidPluginUrl, "utf8"),
  ]);

  assert.match(ios, /"onboardRouting"\s*:\s*false/);
  assert.match(android, /put\("onboardRouting",\s*false\)/);

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

test("privacy policy discloses Mapbox processing and default-off telemetry without claiming routing is live", async () => {
  const privacy = await readFile(privacyUrl, "utf8");

  assert.match(privacy, /Mapbox/i);
  assert.match(privacy, /offline map/i);
  assert.match(privacy, /location/i);
  assert.match(privacy, /process/i);
  assert.match(privacy, /telemetry[\s\S]{0,500}(?:off by default|disabled by default|default-off)/i);
  assert.match(privacy, /(?:choose|choice|consent|turn on|opt in)/i);
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
