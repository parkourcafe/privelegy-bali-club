import assert from "node:assert/strict";
import Module from "node:module";
import test from "node:test";
import type { MobileVenue } from "@/lib/mobile-api/contracts";

const moduleRuntime = Module as unknown as {
  _load(request: string, parent: unknown, isMain: boolean): unknown;
};
const originalModuleLoad = moduleRuntime._load;
moduleRuntime._load = function loadForServerTest(request, parent, isMain) {
  if (request === "server-only") return {};
  return originalModuleLoad.call(this, request, parent, isMain);
};

type VenueLoader = () => Promise<MobileVenue[]>;
type FeedHandler = (request: Request) => Promise<Response>;
interface FeedRouteModule {
  createFeedGetHandler?: (
    loadVenues: VenueLoader,
    clock?: () => Date,
  ) => FeedHandler;
}

const routeModulePath = "./route";
async function loadRouteModule(): Promise<FeedRouteModule> {
  try {
    return await import(routeModulePath) as FeedRouteModule;
  } catch {
    return {};
  }
}

function venue(id: string): MobileVenue {
  return {
    id,
    slug: id,
    name: id,
    category: "cafe",
    district: "sanur",
    subarea: null,
    photoUrl: null,
    bestFor: "Calm mornings",
    isSponsored: false,
    fullAddress: null,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${id}`,
    officialUrl: null,
    instagramUrl: null,
    priceLabel: "$",
    whatToOrder: null,
    whyItsHere: "A calm Sanur stop.",
    notFor: "Late nights.",
    practicalTags: ["quiet"],
    vibes: ["calm"],
  };
}

const venues = [venue("place-a"), venue("place-b"), venue("place-c")];
const now = new Date("2026-07-28T08:00:00.000Z");

test("Feed GET returns the shared cursor page envelope with bounded public cache and CORS", async () => {
  const route = await loadRouteModule();
  assert.equal(typeof route.createFeedGetHandler, "function");
  const GET = route.createFeedGetHandler!(async () => venues, () => now);
  const firstResponse = await GET(new Request(
    "https://www.otherbali.com/api/mobile/v1/feed?district=sanur&category=cafe&limit=2",
  ));

  assert.equal(firstResponse.status, 200);
  assert.equal(firstResponse.headers.get("access-control-allow-origin"), "*");
  const cacheControl = firstResponse.headers.get("cache-control") ?? "";
  assert.match(cacheControl, /public/i);
  assert.doesNotMatch(cacheControl, /stale-while-revalidate/i);
  const maxAge = /(?:^|,\s*)max-age=(\d+)(?:,|$)/.exec(cacheControl)?.[1];
  assert.ok(maxAge);
  assert.ok(Number(maxAge) <= 60);

  const first = await firstResponse.json();
  assert.equal(first.schemaVersion, 1);
  assert.equal(first.updatedAt, now.toISOString());
  assert.deepEqual(
    first.data.page.items.map((card: { venue: { id: string } }) => card.venue.id),
    ["place-a", "place-b"],
  );
  assert.equal(typeof first.data.page.nextCursor, "string");

  const secondResponse = await GET(new Request(
    `https://www.otherbali.com/api/mobile/v1/feed?district=sanur&category=cafe&limit=2&cursor=${encodeURIComponent(first.data.page.nextCursor)}`,
  ));
  const second = await secondResponse.json();
  assert.deepEqual(
    second.data.page.items.map((card: { venue: { id: string } }) => card.venue.id),
    ["place-c"],
  );
  assert.equal(second.data.page.nextCursor, null);
});

test("Feed GET rejects malformed bounded query fields before loading", async () => {
  const route = await loadRouteModule();
  assert.equal(typeof route.createFeedGetHandler, "function");
  let loads = 0;
  const GET = route.createFeedGetHandler!(async () => {
    loads += 1;
    return venues;
  }, () => now);
  const invalidQueries = [
    "",
    "?district=sanur&category=&limit=2",
    "?district=../sanur&category=cafe&limit=2",
    "?district=sanur&category=cafe&limit=0",
    "?district=sanur&category=cafe&limit=51",
    "?district=sanur&category=cafe&limit=two",
    `?district=sanur&category=cafe&limit=2&cursor=${"x".repeat(501)}`,
  ];

  for (const query of invalidQueries) {
    const response = await GET(new Request(
      `https://www.otherbali.com/api/mobile/v1/feed${query}`,
    ));
    assert.equal(response.status, 400);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal((await response.json()).error.code, "invalid_request");
  }
  assert.equal(loads, 0);
});

test("Feed GET returns a stable non-cacheable 503 when the injected loader fails", async () => {
  const route = await loadRouteModule();
  assert.equal(typeof route.createFeedGetHandler, "function");
  const GET = route.createFeedGetHandler!(
    async () => {
      throw new Error("storage unavailable");
    },
    () => now,
  );
  const response = await GET(new Request(
    "https://www.otherbali.com/api/mobile/v1/feed?district=sanur&category=cafe&limit=2",
  ));

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
