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

test("both native plugins expose onboard route capability only with native route implementation", async () => {
  const [android, ios] = await Promise.all([
    readFile(androidPluginUrl, "utf8"),
    readFile(iosPluginUrl, "utf8"),
  ]);

  requires(android, /@PluginMethod[\s\S]{0,200}\broute\s*\(/, "Android plugin route method is missing");
  requires(ios, /CAPPluginMethod\s*\(\s*name:\s*"route"/, "iOS route bridge method is missing");
  requires(ios, /@objc\s+func\s+route\s*\(/, "iOS route implementation is missing");
  requires(android, /put\s*\(\s*"onboardRouting"\s*,\s*true\s*\)/, "Android must not advertise onboard routing before route exists");
  requires(ios, /"onboardRouting"\s*:\s*true/, "iOS must not advertise onboard routing before route exists");
  requires(
    `${android}\n${ios}`,
    /MapboxNavigation(?:Provider)?/,
    "native route methods must use the onboard Mapbox routing provider",
  );
  forbids(
    `${android}\n${ios}`,
    /https?:\/\//i,
    "native offline routing must not call an HTTP route URL",
  );
});

test("native list returns persisted version and actual resource metrics without placeholders", async () => {
  const [android, ios] = await Promise.all([
    readFile(androidPluginUrl, "utf8"),
    readFile(iosPluginUrl, "utf8"),
  ]);

  for (const [platform, source] of [["Android", android], ["iOS", ios]]) {
    requires(source, /["']version["']/, `${platform} list must return the persisted pack version`);
    requires(source, /completedResourceCount/, `${platform} list must return actual completed resource count`);
    requires(source, /completedResourceSize/, `${platform} list must return actual completed bytes`);
    requires(source, /requiredResourceCount/, `${platform} list must return actual required resource count`);
  }
  forbids(
    android,
    /pack\s*\(\s*(?:id|regionId)\s*,\s*1\s*,\s*1\s*,\s*1\s*\)/,
    "Android list still returns 1-byte placeholder metrics",
  );
  forbids(
    ios,
    /"completedResourceCount"\s*:\s*1[\s\S]{0,200}"completedResourceSize"\s*:\s*1[\s\S]{0,200}"requiredResourceCount"\s*:\s*1/,
    "iOS list still returns 1-byte placeholder metrics",
  );
});

test("downloaded map open receives and renders route geometry with a next-stop label", async () => {
  const [androidPlugin, androidMap, ios] = await Promise.all([
    readFile(androidPluginUrl, "utf8"),
    readFile(androidMapUrl, "utf8"),
    readFile(iosPluginUrl, "utf8"),
  ]);

  for (const [platform, source] of [
    ["Android plugin", androidPlugin],
    ["Android map", androidMap],
    ["iOS", ios],
  ]) {
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
    /(?:PolylineAnnotation|LineLayer|GeoJSONSource)/,
    "iOS downloaded map does not draw the route line",
  );
  requires(
    ios,
    /(?:UILabel|PointAnnotation|SymbolLayer)/,
    "iOS downloaded map does not render the destination label",
  );
});
