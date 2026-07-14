import assert from "node:assert/strict";
import test from "node:test";
import {
  deleteGuestData,
  emptyGuestDataExport,
  exportGuestData,
  recordGuestConsent,
  type PrivacyRpcClient,
  type PrivacyRpcResult,
} from "./server-rpc";

function clientWith(
  response: PrivacyRpcResult,
  calls: Array<{ name: string; args: Record<string, unknown> }> = [],
): PrivacyRpcClient {
  return {
    rpc(name, args) {
      calls.push({ name, args });
      return Promise.resolve(response);
    },
  };
}

test("consent helper sends the versioned state and nullable GuestRef exactly once", async () => {
  const calls: Array<{ name: string; args: Record<string, unknown> }> = [];
  const ok = await recordGuestConsent(clientWith({
    data: { ok: true, state: "analytics_allowed", recorded: true },
    error: null,
  }, calls), {
    state: "analytics_allowed",
    version: "2026-07-14",
    guestRef: "g_1234567890abcdef",
    userAgent: "test-agent",
  });
  assert.equal(ok, true);
  assert.deepEqual(calls, [{
    name: "record_guest_consent",
    args: {
      p_state: "analytics_allowed",
      p_consent_version: "2026-07-14",
      p_guest_ref: "g_1234567890abcdef",
      p_user_agent: "test-agent",
    },
  }]);
});

test("privacy RPC helpers fail closed on transport and malformed payloads", async () => {
  const throwing: PrivacyRpcClient = {
    rpc() {
      throw new Error("offline");
    },
  };
  assert.equal(await recordGuestConsent(throwing, {
    state: "essential_only",
    version: "2026-07-14",
    guestRef: null,
    userAgent: null,
  }), false);
  assert.equal(await exportGuestData(
    clientWith({ data: { ok: true, version: 1, data: {} }, error: null }),
    "g_1234567890abcdef",
  ), null);
  assert.equal(await deleteGuestData(
    clientWith({ data: { ok: true, status: "different" }, error: null }),
    "g_1234567890abcdef",
  ), false);
});

test("export and deletion helpers accept only their versioned generic contracts", async () => {
  const exported = emptyGuestDataExport();
  assert.deepEqual(await exportGuestData(
    clientWith({ data: exported, error: null }),
    "g_1234567890abcdef",
  ), exported);
  assert.equal(await deleteGuestData(
    clientWith({ data: { ok: true, status: "completed" }, error: null }),
    "g_1234567890abcdef",
  ), true);
});

test("empty export has stable arrays and never creates identity", () => {
  assert.deepEqual(emptyGuestDataExport(), {
    ok: true,
    version: 1,
    data: {
      identity: null,
      consents: [],
      events: [],
      redemptions: [],
      savedPlaces: [],
      sharedLists: [],
    },
  });
});
