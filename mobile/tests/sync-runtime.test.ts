import assert from "node:assert/strict";
import test from "node:test";
import { type SyncMutation } from "../../lib/journey/offline-sync";
import {
  enqueuePendingSyncMutation,
  flushPendingSyncQueue,
  shouldRestartPendingSyncPump,
  settlePendingSyncMutation,
} from "../src/sync-runtime";

test("coalesces queued Trip replacements while preserving unrelated mutations", () => {
  const saved: SyncMutation = {
    idempotencyKey: "mutation-saved",
    entityType: "saved",
    entityId: "place-1",
    operation: "save",
    payload: { entityType: "place", entityId: "place-1" },
    baseVersion: null,
    createdAt: "2026-07-28T08:00:00.000Z",
  };
  const originalTrip: SyncMutation = {
    idempotencyKey: "mutation-trip-original",
    entityType: "trip_stop",
    entityId: "trip-2",
    operation: "trip_replace",
    payload: { trip: { id: "trip-2", note: "Old" } },
    baseVersion: null,
    createdAt: "2026-07-28T08:01:00.000Z",
  };
  const otherTrip: SyncMutation = {
    idempotencyKey: "mutation-trip-other",
    entityType: "trip_stop",
    entityId: "trip-3",
    operation: "trip_replace",
    payload: { trip: { id: "trip-3", note: "Keep" } },
    baseVersion: null,
    createdAt: "2026-07-28T08:02:00.000Z",
  };
  const latestTrip: SyncMutation = {
    idempotencyKey: "mutation-trip-latest",
    entityType: "trip_stop",
    entityId: "trip-2",
    operation: "trip_replace",
    payload: { trip: { id: "trip-2", note: "Latest" } },
    baseVersion: null,
    createdAt: "2026-07-28T08:03:00.000Z",
  };

  assert.deepEqual(
    enqueuePendingSyncMutation(
      [saved, originalTrip, otherTrip],
      latestTrip,
    ),
    [saved, otherTrip, latestTrip],
  );
});

test("sync pump restarts only for an eligible nonempty queue", () => {
  const eligible = {
    mounted: true,
    pendingCount: 3,
    blocked: false,
    failed: false,
    newWorkArrived: false,
    privacyDeletionActive: false,
  };
  assert.equal(shouldRestartPendingSyncPump(eligible), true);
  assert.equal(shouldRestartPendingSyncPump({ ...eligible, pendingCount: 0 }), false);
  assert.equal(shouldRestartPendingSyncPump({ ...eligible, mounted: false }), false);
  assert.equal(shouldRestartPendingSyncPump({ ...eligible, blocked: true }), false);
  assert.equal(shouldRestartPendingSyncPump({ ...eligible, failed: true }), false);
  assert.equal(
    shouldRestartPendingSyncPump({ ...eligible, failed: true, newWorkArrived: true }),
    true,
  );
  assert.equal(
    shouldRestartPendingSyncPump({ ...eligible, blocked: true, newWorkArrived: true }),
    true,
  );
  assert.equal(
    shouldRestartPendingSyncPump({ ...eligible, privacyDeletionActive: true }),
    false,
  );
});

test("removes only an exactly applied mutation while retaining retries and surfacing conflicts", () => {
  const before: SyncMutation = {
    idempotencyKey: "mutation-before",
    entityType: "saved",
    entityId: "place-1",
    operation: "save",
    payload: { entityType: "place", entityId: "place-1" },
    baseVersion: null,
    createdAt: "2026-07-28T08:00:00.000Z",
  };
  const target: SyncMutation = {
    idempotencyKey: "mutation-target",
    entityType: "trip_stop",
    entityId: "trip-2",
    operation: "trip_replace",
    payload: { trip: { id: "trip-2" } },
    baseVersion: "3",
    createdAt: "2026-07-28T08:01:00.000Z",
  };
  const after: SyncMutation = {
    idempotencyKey: "mutation-after",
    entityType: "visited",
    entityId: "place-3",
    operation: "visited",
    payload: { visitedAt: "2026-07-28T08:02:00.000Z" },
    baseVersion: null,
    createdAt: "2026-07-28T08:02:00.000Z",
  };
  const pending = [before, target, after];

  const applied = settlePendingSyncMutation(pending, target, {
    ok: true,
    status: "applied",
    idempotencyKey: target.idempotencyKey,
    serverVersion: "4",
  });
  assert.deepEqual(applied, { pending: [before, after], conflict: null });

  const retainedResponses: unknown[] = [
    {
      ok: true,
      status: "accepted",
      idempotencyKey: target.idempotencyKey,
      serverVersion: "4",
    },
    {
      ok: true,
      status: "applied",
      idempotencyKey: "different-mutation",
      serverVersion: "4",
    },
    null,
  ];
  for (const response of retainedResponses) {
    const result = settlePendingSyncMutation(pending, target, response);
    assert.deepEqual(result, { pending, conflict: null });
  }

  const conflicted = settlePendingSyncMutation(pending, target, {
    ok: true,
    status: "conflict",
    idempotencyKey: target.idempotencyKey,
    serverVersion: "7",
  });
  assert.deepEqual(conflicted, {
    pending,
    conflict: {
      mutation: target,
      code: "SYNC_VERSION_MISMATCH",
      serverVersion: "7",
    },
  });
});

test("flushes mutations in order and stops with the full remaining queue on the first non-applied settlement", async () => {
  const saved: SyncMutation = {
    idempotencyKey: "mutation-saved",
    entityType: "saved",
    entityId: "place-1",
    operation: "save",
    payload: { entityType: "place", entityId: "place-1" },
    baseVersion: null,
    createdAt: "2026-07-28T08:00:00.000Z",
  };
  const tripStop: SyncMutation = {
    idempotencyKey: "mutation-trip-stop",
    entityType: "trip_stop",
    entityId: "trip-2",
    operation: "trip_replace",
    payload: { trip: { id: "trip-2" } },
    baseVersion: "3",
    createdAt: "2026-07-28T08:01:00.000Z",
  };
  const visited: SyncMutation = {
    idempotencyKey: "mutation-visited",
    entityType: "visited",
    entityId: "place-3",
    operation: "visited",
    payload: { visitedAt: "2026-07-28T08:02:00.000Z" },
    baseVersion: null,
    createdAt: "2026-07-28T08:02:00.000Z",
  };
  const note: SyncMutation = {
    idempotencyKey: "mutation-note",
    entityType: "note",
    entityId: "place-4",
    operation: "note",
    payload: { note: "Window seat" },
    baseVersion: "8",
    createdAt: "2026-07-28T08:03:00.000Z",
  };
  const pending = [saved, tripStop, visited, note];
  const pushed: string[] = [];
  const persisted: SyncMutation[][] = [];

  const conflicted = await flushPendingSyncQueue(
    pending,
    async (mutation) => {
      pushed.push(mutation.idempotencyKey);
      if (mutation === saved) {
        return {
          ok: true,
          status: "applied",
          idempotencyKey: saved.idempotencyKey,
          serverVersion: "1",
        };
      }
      return {
        ok: true,
        status: "conflict",
        idempotencyKey: tripStop.idempotencyKey,
        serverVersion: "7",
      };
    },
    async (remaining) => {
      persisted.push([...remaining]);
    },
  );

  assert.deepEqual(pushed, [saved.idempotencyKey, tripStop.idempotencyKey]);
  assert.deepEqual(persisted, [[tripStop, visited, note]]);
  assert.deepEqual(conflicted, {
    pending: [tripStop, visited, note],
    conflict: {
      mutation: tripStop,
      code: "SYNC_VERSION_MISMATCH",
      serverVersion: "7",
    },
    appliedCount: 1,
  });

  const retryPushes: string[] = [];
  const retryPersists: SyncMutation[][] = [];
  const retried = await flushPendingSyncQueue(
    [visited, note],
    async (mutation) => {
      retryPushes.push(mutation.idempotencyKey);
      return {
        ok: true,
        status: "accepted",
        idempotencyKey: mutation.idempotencyKey,
        serverVersion: "9",
      };
    },
    async (remaining) => {
      retryPersists.push([...remaining]);
    },
  );

  assert.deepEqual(retryPushes, [visited.idempotencyKey]);
  assert.deepEqual(retryPersists, []);
  assert.deepEqual(retried, {
    pending: [visited, note],
    conflict: null,
    appliedCount: 0,
  });
});

test("a healthy sync pass drains every queued mutation instead of stopping after one", async () => {
  const pending: SyncMutation[] = Array.from({ length: 4 }, (_, index) => ({
    idempotencyKey: `mutation-${index + 1}`,
    entityType: "saved",
    entityId: `place-${index + 1}`,
    operation: "save",
    payload: { entityType: "place", entityId: `place-${index + 1}` },
    baseVersion: null,
    createdAt: `2026-07-30T01:0${index}:00.000Z`,
  }));
  const pushed: string[] = [];
  const persistedLengths: number[] = [];

  const result = await flushPendingSyncQueue(
    pending,
    async (mutation) => {
      pushed.push(mutation.idempotencyKey);
      return {
        ok: true,
        status: "applied",
        idempotencyKey: mutation.idempotencyKey,
        serverVersion: "1",
      };
    },
    async (remaining) => {
      persistedLengths.push(remaining.length);
    },
  );

  assert.deepEqual(pushed, pending.map((mutation) => mutation.idempotencyKey));
  assert.deepEqual(persistedLengths, [3, 2, 1, 0]);
  assert.deepEqual(result, {
    pending: [],
    conflict: null,
    appliedCount: 4,
  });
});
