import assert from "node:assert/strict";
import Module from "node:module";
import test from "node:test";

const moduleRuntime = Module as unknown as {
  _load(request: string, parent: unknown, isMain: boolean): unknown;
};
const originalModuleLoad = moduleRuntime._load;
moduleRuntime._load = function loadForServerTest(request, parent, isMain) {
  if (request === "server-only") return {};
  return originalModuleLoad.call(this, request, parent, isMain);
};

const eventsModule = import("@/lib/mobile-api/events");
const routeModule = import("./route");

const now = new Date("2026-08-01T08:00:00.000Z");

test("events route returns a stable typed 503 without caching unavailable storage", async () => {
  const { MobileEventStoreUnavailableError } = await eventsModule;
  const { createEventsGetHandler } = await routeModule;
  const GET = createEventsGetHandler(
    async () => {
      throw new MobileEventStoreUnavailableError("query_failed");
    },
    () => now,
  );

  const response = await GET();
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), {
    schemaVersion: 1,
    updatedAt: now.toISOString(),
    error: {
      code: "temporarily_unavailable",
      message: "The service is temporarily unavailable.",
    },
  });
});

test("events route distinguishes a healthy empty table from unavailable storage", async () => {
  const { createEventsGetHandler } = await routeModule;
  const GET = createEventsGetHandler(async () => [], () => now);
  const response = await GET();

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    schemaVersion: 1,
    updatedAt: now.toISOString(),
    data: { events: [] },
  });
});

test("successful event truth has a bounded cache and no stale-while-revalidate window", async () => {
  const { createEventsGetHandler } = await routeModule;
  const GET = createEventsGetHandler(async () => [], () => now);
  const response = await GET();
  const cacheControl = response.headers.get("cache-control") ?? "";

  assert.doesNotMatch(cacheControl, /stale-while-revalidate/i);
  const maxAge = /(?:^|,\s*)max-age=(\d+)(?:,|$)/.exec(cacheControl)?.[1];
  assert.ok(maxAge, `expected an explicit max-age policy, got ${cacheControl}`);
  assert.ok(Number(maxAge) <= 60, `event truth must expire within 60s, got ${cacheControl}`);
});
