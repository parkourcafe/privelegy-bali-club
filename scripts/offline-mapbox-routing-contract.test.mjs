import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const definitionsUrl = new URL(
  "../plugins/offline-mapbox/dist/esm/index.d.ts",
  import.meta.url,
);
const androidPluginUrl = new URL(
  "../plugins/offline-mapbox/android/src/main/java/com/otherbali/offlinemapbox/OfflineMapboxPlugin.java",
  import.meta.url,
);
const androidMapUrl = new URL(
  "../plugins/offline-mapbox/android/src/main/java/com/otherbali/offlinemapbox/OfflineMapActivity.java",
  import.meta.url,
);
const iosPluginUrl = new URL(
  "../plugins/offline-mapbox/ios/Sources/OfflineMapboxPlugin/OfflineMapboxPlugin.swift",
  import.meta.url,
);

function requires(source, pattern, message) {
  assert.ok(pattern.test(source), message);
}

function forbids(source, pattern, message) {
  assert.equal(pattern.test(source), false, message);
}

test("public native plugin contract exposes typed route and route-aware open", async () => {
  const definitions = await readFile(definitionsUrl, "utf8");

  requires(
    definitions,
    /\broute\s*\(\s*(?:options|request)\s*:\s*\{[\s\S]{0,900}\bregionId\b[\s\S]{0,900}\bversion\b[\s\S]{0,900}\bprofile\b[\s\S]{0,900}\borigin\b[\s\S]{0,900}\bdestination\b[\s\S]{0,900}\}\s*\)\s*:\s*Promise</,
    "OfflineMapbox public types must expose a typed route request",
  );
  requires(
    definitions,
    /\bopen\s*\(\s*(?:options|request)\s*:\s*\{[\s\S]{0,1200}\bregionId\b[\s\S]{0,1200}\b(?:geometry|routeGeometry)\b[\s\S]{0,1200}\bdestinationLabel\b[\s\S]{0,1200}\}\s*\)/,
    "OfflineMapbox.open must accept route geometry and a destination label",
  );
});

test("Android retains onboard routing while iOS preserves a fail-closed route bridge", async () => {
  const [android, ios] = await Promise.all([
    readFile(androidPluginUrl, "utf8"),
    readFile(iosPluginUrl, "utf8"),
  ]);

  requires(android, /@PluginMethod[\s\S]{0,200}\broute\s*\(/, "Android plugin route method is missing");
  requires(ios, /CAPPluginMethod\s*\(\s*name:\s*"route"/, "iOS route bridge method is missing");
  requires(ios, /@objc\s+func\s+route\s*\(/, "iOS route implementation is missing");
  requires(android, /put\s*\(\s*"onboardRouting"\s*,\s*true\s*\)/, "Android must not advertise onboard routing before route exists");
  requires(ios, /"onboardRouting"\s*:\s*false/, "iOS must advertise onboard routing as unavailable");
  requires(
    android,
    /MapboxNavigation(?:Provider)?/,
    "Android route methods must use the onboard Mapbox routing provider",
  );
  requires(
    ios,
    /func\s+route\s*\([^)]*\)\s*\{\s*call\.reject\s*\(\s*"offline_mapbox_unavailable"\s*\)/s,
    "iOS route must reject because the SDK is not shipped",
  );
  forbids(ios, /^\s*import\s+(?:Mapbox\w*|Turf)\b/m, "iOS must not import the removed SDK");
  forbids(
    android,
    /https?:\/\//i,
    "Android offline routing must not call an HTTP route URL",
  );
});

test("Android list returns actual resource metrics while iOS list stays empty", async () => {
  const [android, ios] = await Promise.all([
    readFile(androidPluginUrl, "utf8"),
    readFile(iosPluginUrl, "utf8"),
  ]);

  requires(android, /["']version["']/, "Android list must return the persisted pack version");
  requires(android, /completedResourceCount/, "Android list must return actual completed resource count");
  requires(android, /completedResourceSize/, "Android list must return actual completed bytes");
  requires(android, /requiredResourceCount/, "Android list must return actual required resource count");
  forbids(
    android,
    /pack\s*\(\s*(?:id|regionId)\s*,\s*1\s*,\s*1\s*,\s*1\s*\)/,
    "Android list still returns 1-byte placeholder metrics",
  );
  requires(
    ios,
    /func\s+list\s*\([^)]*\)\s*\{\s*call\.resolve\s*\(\s*\[\s*"packs"\s*:\s*\[\s*\]\s*\]\s*\)/s,
    "iOS list must return no packs",
  );
  forbids(ios, /completedResourceCount|completedResourceSize|requiredResourceCount/, "iOS must not synthesize pack metrics");
});

test("Android downloaded map renders route context while iOS open remains unavailable", async () => {
  const [androidPlugin, androidMap, ios] = await Promise.all([
    readFile(androidPluginUrl, "utf8"),
    readFile(androidMapUrl, "utf8"),
    readFile(iosPluginUrl, "utf8"),
  ]);

  for (const [platform, source] of [["Android plugin", androidPlugin], ["Android map", androidMap]]) {
    requires(source, /(?:geometry|routeGeometry)/, `${platform} does not carry route geometry`);
    requires(source, /destinationLabel/, `${platform} does not carry the next-stop label`);
  }
  requires(
    androidMap,
    /(?:LineLayer|PolylineAnnotation|GeoJsonSource)/,
    "Android downloaded map does not draw the route line",
  );
  requires(
    androidMap,
    /(?:TextView|PointAnnotation|SymbolLayer)/,
    "Android downloaded map does not render the destination label",
  );
  requires(
    ios,
    /func\s+open\s*\([^)]*\)\s*\{\s*call\.reject\s*\(\s*"offline_mapbox_unavailable"\s*\)/s,
    "iOS open must fail closed without the SDK",
  );
  forbids(ios, /PolylineAnnotation|LineLayer|GeoJSONSource|UILabel|PointAnnotation|SymbolLayer/);
});
