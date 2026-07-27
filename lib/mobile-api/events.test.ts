import assert from "node:assert/strict";
import Module from "node:module";
import test from "node:test";
import type { SupabaseClient } from "@supabase/supabase-js";

const moduleRuntime = Module as unknown as {
  _load(request: string, parent: unknown, isMain: boolean): unknown;
};
const originalModuleLoad = moduleRuntime._load;
moduleRuntime._load = function loadForServerTest(request, parent, isMain) {
  if (request === "server-only") return {};
  return originalModuleLoad.call(this, request, parent, isMain);
};

const eventsModule = import("./events");

type QueryCall = {
  method: "from" | "select" | "eq" | "gt" | "order" | "limit";
  args: unknown[];
};

function eventStoreClient(result: { data: unknown[] | null; error: unknown }) {
  const calls: QueryCall[] = [];
  const query = {
    select(...args: unknown[]) {
      calls.push({ method: "select", args });
      return query;
    },
    eq(...args: unknown[]) {
      calls.push({ method: "eq", args });
      return query;
    },
    gt(...args: unknown[]) {
      calls.push({ method: "gt", args });
      return query;
    },
    order(...args: unknown[]) {
      calls.push({ method: "order", args });
      return query;
    },
    limit(...args: unknown[]) {
      calls.push({ method: "limit", args });
      return Promise.resolve(result);
    },
  };
  const client = {
    from(...args: unknown[]) {
      calls.push({ method: "from", args });
      return query;
    },
  } as unknown as SupabaseClient;
  return { calls, client };
}

test("configured event store returns published not-expired lifecycle reconciliation records", async () => {
  const { getActiveMobileEvents } = await eventsModule;
  const now = new Date("2026-08-01T08:00:00.000Z");
  const { calls, client } = eventStoreClient({
    data: [{
      id: "occurrence-1",
      event_id: "event-1",
      title: "Sunset session",
      venue_slug: "sample-cafe",
      area: "Sanur",
      starts_at: "2026-08-01T10:00:00.000Z",
      ends_at: "2026-08-01T12:00:00.000Z",
      status: "scheduled",
      cancellation_reason: null,
      last_verified_at: "2026-07-31T10:00:00.000Z",
      expires_at: "2026-08-01T12:30:00.000Z",
    }, {
      id: "occurrence-2",
      event_id: "event-2",
      title: "Cancelled beach session",
      venue_slug: null,
      area: "Sanur",
      starts_at: "2026-08-01T13:00:00.000Z",
      ends_at: "2026-08-01T15:00:00.000Z",
      status: "cancelled",
      cancellation_reason: "Venue closure",
      last_verified_at: "2026-08-01T07:30:00.000Z",
      expires_at: "2026-08-01T16:00:00.000Z",
    }],
    error: null,
  });

  assert.deepEqual(
    await getActiveMobileEvents(now, () => client),
    [{
      id: "occurrence-1",
      eventId: "event-1",
      title: "Sunset session",
      venueSlug: "sample-cafe",
      area: "Sanur",
      startsAt: "2026-08-01T10:00:00.000Z",
      endsAt: "2026-08-01T12:00:00.000Z",
      status: "scheduled",
      cancellationReason: null,
      lastVerifiedAt: "2026-07-31T10:00:00.000Z",
      expiresAt: "2026-08-01T12:30:00.000Z",
    }, {
      id: "occurrence-2",
      eventId: "event-2",
      title: "Cancelled beach session",
      venueSlug: null,
      area: "Sanur",
      startsAt: "2026-08-01T13:00:00.000Z",
      endsAt: "2026-08-01T15:00:00.000Z",
      status: "cancelled",
      cancellationReason: "Venue closure",
      lastVerifiedAt: "2026-08-01T07:30:00.000Z",
      expiresAt: "2026-08-01T16:00:00.000Z",
    }],
  );
  assert.deepEqual(calls, [
    { method: "from", args: ["v12_event_occurrences"] },
    {
      method: "select",
      args: ["id,event_id,title,venue_slug,area,starts_at,ends_at,status,cancellation_reason,last_verified_at,expires_at"],
    },
    { method: "eq", args: ["publication_status", "published"] },
    { method: "gt", args: ["expires_at", now.toISOString()] },
    { method: "order", args: ["starts_at", { ascending: true }] },
    { method: "limit", args: [100] },
  ]);
});

test("missing event store and failed event query are distinct unavailable failures", async () => {
  const {
    getActiveMobileEvents,
    MobileEventStoreUnavailableError,
  } = await eventsModule;
  const now = new Date("2026-08-01T08:00:00.000Z");
  await assert.rejects(
    () => getActiveMobileEvents(now, () => null),
    (error: unknown) => {
      assert.ok(error instanceof MobileEventStoreUnavailableError);
      assert.equal(error.reason, "client_unavailable");
      return true;
    },
  );

  const { client } = eventStoreClient({
    data: null,
    error: { code: "42P01", message: "relation does not exist" },
  });
  await assert.rejects(
    () => getActiveMobileEvents(now, () => client),
    (error: unknown) => {
      assert.ok(error instanceof MobileEventStoreUnavailableError);
      assert.equal(error.reason, "query_failed");
      return true;
    },
  );
});

test("a healthy empty event table remains a successful empty result", async () => {
  const { getActiveMobileEvents } = await eventsModule;
  const { client } = eventStoreClient({ data: [], error: null });
  assert.deepEqual(
    await getActiveMobileEvents(
      new Date("2026-08-01T08:00:00.000Z"),
      () => client,
    ),
    [],
  );
});
