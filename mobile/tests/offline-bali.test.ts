import assert from "node:assert/strict";
import test from "node:test";
import {
  offlineBaliCanNavigate,
  parseOfflineBaliManifest,
  parseOfflinePackStates,
} from "../../lib/journey/offline-bali";
import { getOfflineMapCapability, type OfflineMapRuntime } from "../src/offline-runtime";

const blockedManifest = {
  schemaVersion: 1,
  updatedAt: "2026-07-27T00:00:00.000Z",
  providerStatus: "blocked_pending_acceptance",
  capabilities: {
    mapTiles: false,
    gpsOnDownloadedMap: false,
    onboardRouting: false,
  },
  regions: [],
  reason: "Provider acceptance is not complete.",
};

test("blocked Offline Bali manifest fails closed and cannot advertise regions", () => {
  const manifest = parseOfflineBaliManifest(blockedManifest);
  assert.equal(manifest.providerStatus, "blocked_pending_acceptance");
  assert.equal(offlineBaliCanNavigate(manifest, undefined), false);
  assert.throws(() => parseOfflineBaliManifest({
    ...blockedManifest,
    regions: [{
      id: "ubud",
      name: "Ubud",
      coverageRef: "provider:ubud",
      version: "1",
      styleVersion: "1",
      estimatedBytes: 1_000,
      expiresAt: "2026-08-27T00:00:00.000Z",
    }],
  }), /cannot advertise capabilities/);
});

test("Level 3 navigation needs a current ready pack and every offline capability", () => {
  const manifest = parseOfflineBaliManifest({
    ...blockedManifest,
    providerStatus: "available",
    capabilities: { mapTiles: true, gpsOnDownloadedMap: true, onboardRouting: true },
    regions: [{
      id: "ubud",
      name: "Ubud",
      coverageRef: "provider:ubud",
      version: "2026-07",
      styleVersion: "1",
      estimatedBytes: 1_000,
      expiresAt: "2099-08-27T00:00:00.000Z",
    }],
    reason: null,
  });
  const [pack] = parseOfflinePackStates([{
    regionId: "ubud",
    version: "2026-07",
    status: "ready",
    progress: 1,
    downloadedBytes: 1_000,
    totalBytes: 1_000,
    updatedAt: "2026-07-27T00:00:00.000Z",
    lastError: null,
  }]);
  assert.equal(offlineBaliCanNavigate(manifest, pack), true);
  assert.equal(offlineBaliCanNavigate(manifest, { ...pack!, status: "stale" }), false);
});

test("native runtime does not claim availability without a configured provider", async () => {
  const misleading = {
    async capability() { return { available: true, provider: null, reason: null }; },
  } as unknown as OfflineMapRuntime;
  assert.deepEqual(await getOfflineMapCapability(misleading), {
    available: false,
    provider: null,
    reason: "provider_unavailable",
  });
});
