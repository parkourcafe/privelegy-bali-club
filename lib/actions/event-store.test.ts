import test from "node:test";
import assert from "node:assert/strict";
import type {
  EventRpcClient,
  EventRpcResult,
  LegacyLogEventArgs,
  LogEventV2Args,
} from "./event-compat";
import { storeEvent, type EventStoreInput } from "./event-store";

function input(): EventStoreInput {
  return {
    type: "action_handoff",
    guestRef: "g_testguest123456",
    venueSlug: "fixture-venue",
    source: null,
    payload: {
      action: "delivery",
      provider: "gojek",
      capabilityId: "capability-123",
      venueSlug: "fixture-venue",
    },
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
    source: null,
    payload: null,
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

test("carries the guest's attribution source on both RPC versions", async () => {
  const v2 = rpcClient([{ error: null }]);
  await storeEvent(v2.client, { ...input(), source: "villa_canggu_01" });
  assert.equal(v2.calls[0].name, "log_event_v2");
  assert.equal(v2.calls[0].args.p_source, "villa_canggu_01");

  // Preserved events skip v2 entirely — they must not lose the source on the
  // way to log_event, which is the leg every funnel step above actually takes.
  const legacy = rpcClient([{ error: null }]);
  await storeEvent(legacy.client, {
    type: "direction_click",
    guestRef: "g_testguest123456",
    venueSlug: "fixture-venue",
    source: "villa_canggu_01",
    payload: null,
  });
  assert.deepEqual(legacy.calls, [
    {
      name: "log_event",
      args: {
        p_type: "direction_click",
        p_guest_ref: "g_testguest123456",
        p_venue_slug: "fixture-venue",
        p_source: "villa_canggu_01",
      },
    },
  ]);
});

test("keeps the source across the v2-missing fallback to legacy", async () => {
  const { client, calls } = rpcClient([{ error: { code: "PGRST202" } }, { error: null }]);

  await storeEvent(client, { ...input(), source: "villa_canggu_01" });

  assert.equal(calls.length, 2);
  assert.equal(calls[1].args.p_source, "villa_canggu_01");
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
