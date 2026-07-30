import assert from "node:assert/strict";
import test from "node:test";
import {
  parseFeedResumeSnapshot,
  resolveFeedResumeSnapshot,
} from "../src/discovery-model";

const validSnapshot = {
  sessionId: "12345678-1234-1234-1234-123456789abc",
  version: "organic-policy-v2",
  cursor: "cursor-page-2",
  lastSeenEntityId: "place-b",
  position: 1,
  updatedAt: "2026-07-28T08:00:00.000Z",
};

test("cross-session feed resume validates session, version, cursor and last entity", () => {
  const snapshot = parseFeedResumeSnapshot(validSnapshot);
  assert.deepEqual(snapshot, validSnapshot);

  for (const invalid of [
    { ...validSnapshot, sessionId: "not-a-session" },
    { ...validSnapshot, version: "" },
    { ...validSnapshot, cursor: "x".repeat(501) },
    { ...validSnapshot, lastSeenEntityId: "" },
    { ...validSnapshot, position: -1 },
    { ...validSnapshot, updatedAt: "not-a-date" },
  ]) {
    assert.equal(parseFeedResumeSnapshot(invalid), null);
  }

  assert.deepEqual(resolveFeedResumeSnapshot(snapshot!, {
    expectedVersion: "organic-policy-v2",
    candidateIds: ["place-a", "place-b", "place-c"],
  }), {
    status: "restored",
    snapshot,
  });

  assert.deepEqual(resolveFeedResumeSnapshot(snapshot!, {
    expectedVersion: "organic-policy-v3",
    candidateIds: ["place-a", "place-b", "place-c"],
  }), {
    status: "unavailable",
    reason: "version_mismatch",
  });

  assert.deepEqual(resolveFeedResumeSnapshot(snapshot!, {
    expectedVersion: "organic-policy-v2",
    candidateIds: ["place-a", "place-c"],
  }), {
    status: "unavailable",
    reason: "candidate_unavailable",
  });
});
