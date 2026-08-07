import test from "node:test";
import assert from "node:assert/strict";
import {
  resolveGuestAttributionSource,
  type GuestSourceReader,
} from "./guest-source";

type ReaderCalls = { bound: string[]; active: string[] };

function reader(
  behaviour: {
    bound?: string | null | Error;
    active?: boolean | Error;
  } = {}
): { reader: GuestSourceReader; calls: ReaderCalls } {
  const calls: ReaderCalls = { bound: [], active: [] };
  return {
    calls,
    reader: {
      async boundSource(guestRef) {
        calls.bound.push(guestRef);
        if (behaviour.bound instanceof Error) throw behaviour.bound;
        return behaviour.bound ?? null;
      },
      async isActiveSource(source) {
        calls.active.push(source);
        if (behaviour.active instanceof Error) throw behaviour.active;
        return behaviour.active ?? false;
      },
    },
  };
}

test("resolves a bound source that is still active", async () => {
  const { reader: r, calls } = reader({ bound: "villa_canggu_01", active: true });

  assert.equal(
    await resolveGuestAttributionSource(r, "g_testguest123456"),
    "villa_canggu_01"
  );
  assert.deepEqual(calls.bound, ["g_testguest123456"]);
  assert.deepEqual(calls.active, ["villa_canggu_01"]);
});

test("drops a deactivated source instead of letting log_event discard the event", async () => {
  // log_event returns early on a source that is not active, which would delete
  // the funnel row rather than store it unattributed. Deactivating a placement
  // must stop crediting it, never stop counting its guests.
  const { reader: r } = reader({ bound: "villa_retired_09", active: false });

  assert.equal(await resolveGuestAttributionSource(r, "g_testguest123456"), null);
});

test("returns null for an unbound guest without checking the source table", async () => {
  const { reader: r, calls } = reader({ bound: null });

  assert.equal(await resolveGuestAttributionSource(r, "g_testguest123456"), null);
  assert.deepEqual(calls.active, []);
});

test("returns null for an empty guest ref without reading anything", async () => {
  const { reader: r, calls } = reader({ bound: "villa_canggu_01", active: true });

  assert.equal(await resolveGuestAttributionSource(r, ""), null);
  assert.deepEqual(calls, { bound: [], active: [] });
});

test("a failing read leaves the event unattributed rather than throwing", async () => {
  for (const behaviour of [
    { bound: new Error("guest_refs unreachable") },
    { bound: "villa_canggu_01", active: new Error("attribution_sources unreachable") },
  ]) {
    const { reader: r } = reader(behaviour);
    assert.equal(await resolveGuestAttributionSource(r, "g_testguest123456"), null);
  }
});
