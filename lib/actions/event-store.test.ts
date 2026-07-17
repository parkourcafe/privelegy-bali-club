import test from "node:test";
import assert from "node:assert/strict";
import type {
  EventRpcClient,
  EventRpcResult,
  LegacyLogEventArgs,
  LogEventV2Args,
} from "./event-compat";
import type { EventStoreInput } from "./event-store";

const eventStore = (await import(
  new URL("./event-store.ts", import.meta.url).href
)) as typeof import("./event-store");
const { storeEvent } = eventStore;

function input(): EventStoreInput {
  return {
    type: "action_handoff",
    guestRef: "g_testguest123456",
    venueSlug: "fixture-venue",
    payload: {
      action: "delivery",
      provider: "gojek",
      capabilityId: "capability-123",
      venueSlug: "fixture-venue",
    },
    source: null,
  };
}

type RpcResponse = EventRpcResult | Error;
type RpcCall = {
  name: "log_event_v2" | "log_event";
  args: LogEventV2Args | LegacyLogEventArgs;
};

function rpcClient(responses: RpcResponse[]): {
  calls: RpcCall[];
  client: EventRpcClient;
} {
  const calls: RpcCall[] = [];
  const rpc = async (
    name: "log_event_v2" | "log_event",
    args: LogEventV2Args | LegacyLogEventArgs
  ): Promise<EventRpcResult> => {
    calls.push({ name, args });
    const response = responses.shift();
    if (response instanceof Error) throw response;
    return response ?? { error: null };
  };

  return {
    calls,
    client: { rpc } as EventRpcClient,
  };
}

test("writes the typed log_event_v2 shape", async () => {
  const { client, calls } = rpcClient([{ error: null }]);

  const result = await storeEvent(client, input());

  assert.deepEqual(calls, [
    {
      name: "log_event_v2",
      args: {
        p_type: "action_handoff",
        p_guest_ref: "g_testguest123456",
        p_venue_slug: "fixture-venue",
        p_source: null,
        p_payload: {
          action: "delivery",
          provider: "gojek",
          capabilityId: "capability-123",
          venueSlug: "fixture-venue",
        },
      },
    },
  ]);
  assert.deepEqual(result, { stored: true, version: "v2" });
});

test("sends preserved events directly to legacy so v2 cannot drop them", async () => {
  const { client, calls } = rpcClient([{ error: null }]);

  const result = await storeEvent(client, {
    type: "reservation_click",
    guestRef: "g_testguest123456",
    venueSlug: "fixture-venue",
    payload: null,
    source: null,
  });

  assert.deepEqual(calls, [
    {
      name: "log_event",
      args: {
        p_type: "reservation_click",
        p_guest_ref: "g_testguest123456",
        p_venue_slug: "fixture-venue",
        p_source: null,
      },
    },
  ]);
  assert.deepEqual(result, { stored: true, version: "legacy" });
});

test("falls back once to legacy only when v2 is missing", async () => {
  for (const code of ["PGRST202", "42883"]) {
    const { client, calls } = rpcClient([
      { error: { code } },
      { error: null },
    ]);

    const result = await storeEvent(client, input());

    assert.deepEqual(calls[1], {
      name: "log_event",
      args: {
        p_type: "action_handoff",
        p_guest_ref: "g_testguest123456",
        p_venue_slug: "fixture-venue",
        p_source: null,
      },
    });
    assert.equal(calls.length, 2);
    assert.deepEqual(result, { stored: true, version: "legacy" });
  }
});

test("never falls back for permission, validation, or network errors", async () => {
  for (const response of [
    { error: { code: "42501" } },
    { error: { code: "22023" } },
    new Error("network down"),
  ]) {
    const { client, calls } = rpcClient([response]);

    const result = await storeEvent(client, input());

    assert.equal(calls.length, 1);
    assert.equal(result.stored, false);
    assert.equal(result.version, "v2");
  }
});

test("stamps the guest's first-touch source onto both rpc shapes", async () => {
  // v2 path (action event) carries the source
  const v2 = rpcClient([{ error: null }]);
  await storeEvent(v2.client, { ...input(), source: "villa_canggu_01" });
  assert.equal(
    (v2.calls[0].args as LogEventV2Args).p_source,
    "villa_canggu_01"
  );

  // legacy path (preserved event) carries the source too
  const legacy = rpcClient([{ error: null }]);
  await storeEvent(legacy.client, {
    type: "reservation_click",
    guestRef: "g_testguest123456",
    venueSlug: "fixture-venue",
    payload: null,
    source: "meta_au",
  });
  assert.equal(legacy.calls[0].name, "log_event");
  assert.equal(
    (legacy.calls[0].args as LegacyLogEventArgs).p_source,
    "meta_au"
  );
});

test("reports a legacy write failure without retrying", async () => {
  const { client, calls } = rpcClient([
    { error: { code: "PGRST202" } },
    { error: { code: "42501" } },
  ]);

  const result = await storeEvent(client, input());

  assert.equal(calls.length, 2);
  assert.deepEqual(result, { stored: false, version: "legacy" });
});
