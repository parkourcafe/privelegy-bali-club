import assert from "node:assert/strict";
import test from "node:test";
import { getOfflineBaliManifest } from "./route";
import { parseOfflineBaliManifest } from "@/lib/journey/offline-bali";

test("production Offline Bali endpoint remains fail-closed without the acceptance flag", () => {
  const manifest = parseOfflineBaliManifest(
    getOfflineBaliManifest(new Date("2026-07-27T00:00:00.000Z")),
  );
  assert.equal(manifest.providerStatus, "blocked_pending_acceptance");
  assert.deepEqual(manifest.regions, []);
  assert.deepEqual(manifest.capabilities, {
    mapTiles: false,
    gpsOnDownloadedMap: false,
    onboardRouting: false,
  });
});

test("the provider flag alone cannot bypass the physical-device acceptance gate", () => {
  const manifest = parseOfflineBaliManifest(
    getOfflineBaliManifest(new Date("2026-07-27T00:00:00.000Z"), true, false),
  );
  assert.equal(manifest.providerStatus, "blocked_pending_acceptance");
  assert.deepEqual(manifest.regions, []);
  assert.deepEqual(manifest.capabilities, {
    mapTiles: false,
    gpsOnDownloadedMap: false,
    onboardRouting: false,
  });
});

test("accepted Offline Bali endpoint exposes only bounded Mapbox packs", () => {
  const manifest = parseOfflineBaliManifest(
    getOfflineBaliManifest(new Date("2026-07-27T00:00:00.000Z"), true, true),
  );
  assert.equal(manifest.providerStatus, "available");
  assert.deepEqual(manifest.regions.map((region) => region.id), [
    "south-bali",
    "ubud-central",
    "north-bali",
    "east-bali",
    "nusa-penida",
  ]);
  assert.ok(manifest.regions.every((region) => region.coverageRef.startsWith("mapbox:bbox:")));
  assert.ok(manifest.regions.every((region) => region.estimatedBytes <= 250_000_000));
  assert.deepEqual(manifest.capabilities, {
    mapTiles: true,
    gpsOnDownloadedMap: true,
    onboardRouting: true,
  });
});
