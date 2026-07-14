import assert from "node:assert/strict";
import test from "node:test";
import type {
  EventV3RpcClient,
  EventRpcResult,
  LogEventV3Args,
  SourceScanRpcClient,
} from "./event-compat";
import {
  storeRateLimitedEvent,
  storeRateLimitedSourceScan,
} from "./event-rate-limit";

const input = {
  type: "landing_open" as const,
  guestRef: "g_testguest123456",
  venueSlug: null,
  payload: null,
};

function clientWith(result: EventRpcResult | Error) {
  const calls: Array<{ name: string; args: LogEventV3Args }> = [];
  const client = {
    async rpc(name: string, args: LogEventV3Args) {
      calls.push({ name, args });
      if (result instanceof Error) throw result;
      return result;
    },
  } as EventV3RpcClient;
  return { client, calls };
}

test("uses the atomic v3 RPC without client-controlled rate parameters", async () => {
  const { client, calls } = clientWith({ data: { ok: true, event_id: "event-1" }, error: null });
  assert.deepEqual(await storeRateLimitedEvent(client, input), { status: "stored" });
  assert.deepEqual(calls, [{
    name: "log_event_v3",
    args: {
      p_type: "landing_open",
      p_guest_ref: "g_testguest123456",
      p_venue_slug: null,
      p_source: null,
      p_payload: null,
    },
  }]);
  assert.equal("p_window_seconds" in calls[0].args, false);
  assert.equal("p_max_events" in calls[0].args, false);
});

test("maps the safe v3 rate-limit and consent outcomes", async () => {
  const limited = clientWith({
    data: { ok: false, error: "rate_limited", retry_after_seconds: 12.2 },
    error: null,
  });
  assert.deepEqual(await storeRateLimitedEvent(limited.client, input), {
    status: "rate_limited",
    retryAfterSeconds: 13,
  });

  const consent = clientWith({
    data: { ok: false, error: "analytics_consent_required" },
    error: null,
  });
  assert.deepEqual(await storeRateLimitedEvent(consent.client, input), {
    status: "consent_required",
  });
});

test("server source scan uses v3 with an exact source and no client payload", async () => {
  const calls: Array<{ name: string; args: { p_guest_ref: string; p_source: string } }> = [];
  const client = {
    async rpc(name: "capture_source_scan", args: { p_guest_ref: string; p_source: string }) {
      calls.push({ name, args });
      return { data: { ok: true, event_id: "source-event" }, error: null };
    },
  } satisfies SourceScanRpcClient;
  assert.deepEqual(await storeRateLimitedSourceScan(client, {
    guestRef: "g_testguest123456",
    source: "villa_01",
  }), { status: "stored" });
  assert.deepEqual(calls, [{
    name: "capture_source_scan",
    args: {
      p_guest_ref: "g_testguest123456",
      p_source: "villa_01",
    },
  }]);
});

test("fails closed without exposing RPC, validation, or network details", async () => {
  for (const response of [
    { data: null, error: { code: "PGRST202" } },
    { data: { ok: false, error: "internal_table_name" }, error: null },
    new Error("database host and secret details"),
  ]) {
    const { client } = clientWith(response);
    assert.deepEqual(await storeRateLimitedEvent(client, input), { status: "unavailable" });
  }
});
