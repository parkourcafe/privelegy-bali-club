import assert from "node:assert/strict";
import test from "node:test";
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  cleanUnconsentedPhoto,
  markPhotoUploadStored,
  requestUnconsentedPhotoCleanup,
} from "./photo-submission-reconciliation";

type RpcReply = { data: unknown; error: { message: string } | null };

function mockClient({
  replies,
  removeError = null,
}: {
  replies: RpcReply[];
  removeError?: { message: string } | null;
}) {
  const calls: string[] = [];
  const client = {
    rpc: async (name: string) => {
      calls.push(`rpc:${name}`);
      return replies.shift() ?? { data: null, error: { message: "missing mock" } };
    },
    storage: {
      from: () => ({
        remove: async () => {
          calls.push("storage:remove");
          return { data: null, error: removeError };
        },
      }),
    },
  } as unknown as SupabaseClient;
  return { calls, client };
}

const identity = ["00000000-0000-4000-8000-000000000001", "venue", "venue/id.jpg"] as const;
const digest = "a".repeat(64);

test("upload acknowledgement requires an explicit uploaded state", async () => {
  const accepted = mockClient({
    replies: [{ data: { ok: true, storage_state: "uploaded" }, error: null }],
  });
  assert.equal(await markPhotoUploadStored(accepted.client, ...identity, digest), true);

  const ambiguous = mockClient({
    replies: [{ data: { ok: true, storage_state: "reserved" }, error: null }],
  });
  assert.equal(await markPhotoUploadStored(ambiguous.client, ...identity, digest), false);
});

test("cleanup never touches Storage without an explicit cleanup CAS", async () => {
  const failed = mockClient({
    replies: [{ data: null, error: { message: "network" } }],
  });
  assert.equal(
    await requestUnconsentedPhotoCleanup(failed.client, ...identity, "upload_failed"),
    "deferred",
  );
  assert.deepEqual(failed.calls, ["rpc:request_venue_photo_cleanup"]);

  const consented = mockClient({
    replies: [{ data: { ok: false, error: "consent_recorded" }, error: null }],
  });
  assert.equal(
    await cleanUnconsentedPhoto(consented.client, ...identity, "consent_rejected"),
    "consent_recorded",
  );
  assert.deepEqual(consented.calls, ["rpc:request_venue_photo_cleanup"]);
});

test("ambiguous upload acknowledgement only requests deferred cleanup", async () => {
  const pending = mockClient({
    replies: [{ data: { ok: true, storage_state: "cleanup_pending" }, error: null }],
  });
  assert.equal(
    await requestUnconsentedPhotoCleanup(pending.client, ...identity, "upload_failed"),
    "cleanup_pending",
  );
  assert.deepEqual(pending.calls, ["rpc:request_venue_photo_cleanup"]);
});

test("cleanup confirms object removal before completing the durable state", async () => {
  const removed = mockClient({
    replies: [
      { data: { ok: true, storage_state: "cleanup_pending" }, error: null },
      { data: { ok: true, storage_state: "removed" }, error: null },
    ],
  });
  assert.equal(
    await cleanUnconsentedPhoto(removed.client, ...identity, "state_transition_failed"),
    "removed",
  );
  assert.deepEqual(removed.calls, [
    "rpc:request_venue_photo_cleanup",
    "storage:remove",
    "rpc:complete_venue_photo_cleanup",
  ]);

  const storageFailure = mockClient({
    replies: [{ data: { ok: true, storage_state: "cleanup_pending" }, error: null }],
    removeError: { message: "storage unavailable" },
  });
  assert.equal(
    await cleanUnconsentedPhoto(storageFailure.client, ...identity, "state_transition_failed"),
    "cleanup_pending",
  );
  assert.deepEqual(storageFailure.calls, [
    "rpc:request_venue_photo_cleanup",
    "storage:remove",
  ]);
});

test("already removed cleanup is idempotent and performs no Storage write", async () => {
  const alreadyRemoved = mockClient({
    replies: [{ data: { ok: true, storage_state: "removed" }, error: null }],
  });
  assert.equal(
    await cleanUnconsentedPhoto(alreadyRemoved.client, ...identity, "state_transition_failed"),
    "removed",
  );
  assert.deepEqual(alreadyRemoved.calls, ["rpc:request_venue_photo_cleanup"]);
});
