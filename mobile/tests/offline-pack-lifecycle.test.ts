import assert from "node:assert/strict";
import test from "node:test";
import type { OfflinePackState } from "../../lib/journey/offline-bali";
import {
  reconcileOfflinePackStates,
  removeOfflineRegionSafely,
  type OfflineMapRuntime,
} from "../src/offline-runtime";

interface NativeOfflinePack {
  regionId: string;
  version: string;
  completedResourceCount: number;
  completedResourceSize: number;
  requiredResourceCount: number;
  progress: number;
}

type ListableOfflineMapRuntime = OfflineMapRuntime & {
  list(): Promise<NativeOfflinePack[]>;
};

function runtimeWithList(
  packs: NativeOfflinePack[],
  onRemove: (regionId: string) => Promise<void> = async () => {},
): ListableOfflineMapRuntime {
  return {
    async capability() {
      return { available: true, provider: "mapbox", reason: null };
    },
    async download() {
      throw new Error("not used");
    },
    async remove(regionId) {
      await onRemove(regionId);
    },
    async open() {
      return false;
    },
    async list() {
      return packs;
    },
  };
}

const durablePacks: OfflinePackState[] = [
  {
    regionId: "ubud-central",
    version: "2026-06",
    status: "ready",
    progress: 1,
    downloadedBytes: 1_000,
    totalBytes: 1_000,
    updatedAt: "2026-07-01T00:00:00.000Z",
    lastError: null,
  },
  {
    regionId: "south-bali",
    version: "2026-07",
    status: "ready",
    progress: 1,
    downloadedBytes: 2_000,
    totalBytes: 2_000,
    updatedAt: "2026-07-01T00:00:00.000Z",
    lastError: null,
  },
];

test("startup reconciliation trusts a validated native list and persists the reconciled lifecycle", async () => {
  const calls: string[] = [];
  const runtime = runtimeWithList([
    {
      regionId: "ubud-central",
      version: "2026-07",
      completedResourceCount: 20,
      completedResourceSize: 777,
      requiredResourceCount: 20,
      progress: 1,
    },
    {
      regionId: "east-bali",
      version: "2026-08",
      completedResourceCount: 30,
      completedResourceSize: 888,
      requiredResourceCount: 30,
      progress: 1,
    },
  ]);

  const reconciled = await reconcileOfflinePackStates({
    runtime,
    packs: durablePacks,
    now: () => new Date("2026-07-28T08:00:00.000Z"),
    publish: (packs) => {
      calls.push(`publish:${packs.map((pack) => `${pack.regionId}:${pack.status}`).join(",")}`);
    },
    persist: async (packs) => {
      calls.push(`persist:${packs.map((pack) => `${pack.regionId}:${pack.status}`).join(",")}`);
    },
  });

  assert.deepEqual(
    reconciled.map((pack) => pack.regionId),
    ["ubud-central", "south-bali", "east-bali"],
  );
  assert.deepEqual(reconciled[0], {
    regionId: "ubud-central",
    version: "2026-07",
    status: "ready",
    progress: 1,
    downloadedBytes: 777,
    totalBytes: 777,
    updatedAt: "2026-07-28T08:00:00.000Z",
    lastError: null,
  });
  assert.notEqual(reconciled[1]?.status, "ready");
  assert.equal(reconciled[1]?.lastError, "native_pack_missing");
  assert.deepEqual(reconciled[2], {
    regionId: "east-bali",
    version: "2026-08",
    status: "ready",
    progress: 1,
    downloadedBytes: 888,
    totalBytes: 888,
    updatedAt: "2026-07-28T08:00:00.000Z",
    lastError: null,
  });
  assert.deepEqual(calls, [
    "publish:ubud-central:ready,south-bali:failed,east-bali:ready",
    "persist:ubud-central:ready,south-bali:failed,east-bali:ready",
  ]);

  for (const invalidNativePacks of [
    [
      {
        regionId: "ubud-central",
        version: "2026-07",
        completedResourceCount: 1,
        completedResourceSize: 100,
        requiredResourceCount: 1,
        progress: 1,
      },
      {
        regionId: "ubud-central",
        version: "2026-07",
        completedResourceCount: 1,
        completedResourceSize: 100,
        requiredResourceCount: 1,
        progress: 1,
      },
    ],
    [{
      regionId: "../unsafe",
      version: "",
      completedResourceCount: 1,
      completedResourceSize: -1,
      requiredResourceCount: 1,
      progress: 1,
    }],
  ]) {
    await assert.rejects(
      reconcileOfflinePackStates({
        runtime: runtimeWithList(invalidNativePacks),
        packs: durablePacks,
        publish: () => {
          throw new Error("must not publish invalid native packs");
        },
        persist: async () => {
          throw new Error("must not persist invalid native packs");
        },
      }),
      /duplicate|invalid|native.*pack/i,
    );
  }
});

test("removal durably enters deleting before native removal and keeps a failed state on error", async () => {
  const successCalls: string[] = [];
  const success = await removeOfflineRegionSafely({
    runtime: runtimeWithList([], async (regionId) => {
      successCalls.push(`native:${regionId}`);
    }),
    regionId: "ubud-central",
    packs: [durablePacks[0]!],
    now: () => new Date("2026-07-28T08:00:00.000Z"),
    publish: (packs) => {
      successCalls.push(`publish:${packs[0]?.status ?? "absent"}`);
    },
    persist: async (packs) => {
      successCalls.push(`persist:${packs[0]?.status ?? "absent"}`);
    },
  });
  assert.deepEqual(success, { outcome: "removed", packs: [] });
  assert.deepEqual(successCalls, [
    "publish:deleting",
    "persist:deleting",
    "native:ubud-central",
    "publish:absent",
    "persist:absent",
  ]);

  const failedCalls: string[] = [];
  const failed = await removeOfflineRegionSafely({
    runtime: runtimeWithList([], async (regionId) => {
      failedCalls.push(`native:${regionId}`);
      throw new Error("native removal failed");
    }),
    regionId: "ubud-central",
    packs: [durablePacks[0]!],
    now: () => new Date("2026-07-28T08:00:00.000Z"),
    publish: (packs) => {
      failedCalls.push(`publish:${packs[0]?.status ?? "absent"}`);
    },
    persist: async (packs) => {
      failedCalls.push(`persist:${packs[0]?.status ?? "absent"}`);
    },
  });
  assert.equal(failed.outcome, "failed");
  assert.equal(failed.packs[0]?.regionId, "ubud-central");
  assert.equal(failed.packs[0]?.status, "failed");
  assert.equal(failed.packs[0]?.lastError, "remove_failed");
  assert.deepEqual(failedCalls, [
    "publish:deleting",
    "persist:deleting",
    "native:ubud-central",
    "publish:failed",
    "persist:failed",
  ]);
});
