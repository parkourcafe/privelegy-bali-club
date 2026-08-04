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
type DecisionHandler = (request: Request) => Promise<Response>;
interface DecisionRouteModule {
  createDecisionPostHandler?: (
    loadVenues: VenueLoader,
    clock?: () => Date,
  ) => DecisionHandler;
}

const routeModulePath = "./route";
async function loadRouteModule(): Promise<DecisionRouteModule> {
  try {
    return await import(routeModulePath) as DecisionRouteModule;
  } catch {
    return {};
  }
}

function venue(
  id: string,
  overrides: Partial<MobileVenue> = {},
): MobileVenue {
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
    vibes: ["calm", "family", "morning"],
    ...overrides,
  };
}

const venues: MobileVenue[] = [
  venue("family-morning"),
  venue("sunset-date", {
    priceLabel: "$$$",
    whyItsHere: "Premium sunset dinner for couples.",
    notFor: "A low budget.",
    vibes: ["sunset", "couple", "dinner"],
  }),
  venue("quiet-backup", {
    priceLabel: "$$",
    whyItsHere: "A quiet mid-range alternative.",
    vibes: ["quiet", "solo"],
  }),
];
const now = new Date("2026-07-28T08:00:00.000Z");
const context = {
  area: "sanur",
  company: "family",
  moment: "calm_morning",
  budget: "budget",
  ending: "early",
};

function decisionRequest(
  body: unknown = { context },
  idempotencyKey: string | null = "decision-request-1",
): Request {
  const headers = new Headers({
    "Content-Type": "application/json",
    Origin: "capacitor://localhost",
    "X-Other-Bali-Guest": "g_0123456789abcdef",
  });
  if (idempotencyKey !== null) headers.set("Idempotency-Key", idempotencyKey);
  return new Request("https://www.otherbali.com/api/mobile/v1/decisions", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

test("Decision POST maps the shared server decision to the current mobile result shape", async () => {
  const route = await loadRouteModule();
  assert.equal(typeof route.createDecisionPostHandler, "function");
  const POST = route.createDecisionPostHandler!(async () => venues, () => now);
  const response = await POST(decisionRequest());

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(
    response.headers.get("access-control-allow-origin"),
    "capacitor://localhost",
  );
  assert.equal(response.headers.get("access-control-allow-credentials"), "true");
  assert.match(
    response.headers.get("access-control-allow-headers") ?? "",
    /X-Other-Bali-Guest/i,
  );
  const payload = await response.json();
  assert.equal(payload.schemaVersion, 1);
  assert.equal(payload.updatedAt, now.toISOString());
  assert.deepEqual(payload.data.result.bestFit, {
    placeId: "family-morning",
    name: "family-morning",
    why: "A calm Sanur stop. Compared using your calm_morning, budget budget and family context.",
    notIdealIf: "Late nights.",
  });
  assert.equal(payload.data.result.backup.placeId, "quiet-backup");
  assert.equal(payload.data.result.contrast.placeId, "sunset-date");
  assert.equal(payload.data.result.emptyStateReason, null);
  assert.doesNotMatch(JSON.stringify(payload), /isSponsored|sponsor|paid/i);
});

test("Decision POST requires an exact bounded context and Idempotency-Key before loading", async () => {
  const route = await loadRouteModule();
  assert.equal(typeof route.createDecisionPostHandler, "function");
  let loads = 0;
  const POST = route.createDecisionPostHandler!(async () => {
    loads += 1;
    return venues;
  }, () => now);
  const requests = [
    decisionRequest({ context }, null),
    decisionRequest({ context }, "x".repeat(161)),
    decisionRequest([]),
    decisionRequest({}),
    decisionRequest({ context: { ...context, company: "" } }),
    decisionRequest({ context: { ...context, area: "../sanur" } }),
    decisionRequest({ context: { ...context, ending: "x".repeat(121) } }),
    decisionRequest({ context: { ...context, debug: "not-allowed" } }),
    decisionRequest({ context, extra: true }),
  ];

  for (const request of requests) {
    const response = await POST(request);
    assert.equal(response.status, 400);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal((await response.json()).error.code, "invalid_request");
  }
  assert.equal(loads, 0);
});

test("Decision POST returns a stable non-cacheable 503 when the injected loader fails", async () => {
  const route = await loadRouteModule();
  assert.equal(typeof route.createDecisionPostHandler, "function");
  const POST = route.createDecisionPostHandler!(
    async () => {
      throw new Error("storage unavailable");
    },
    () => now,
  );
  const response = await POST(decisionRequest());

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
