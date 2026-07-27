import assert from "node:assert/strict";
import test from "node:test";
import { getOfflineBaliManifest } from "./route";
import { parseOfflineBaliManifest } from "@/lib/journey/offline-bali";

test("production Offline Bali endpoint remains fail-closed until provider gates pass", () => {
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
