import assert from "node:assert/strict";
import test from "node:test";
import type { MobileVenue } from "../../lib/mobile-api/contracts";

Object.assign(globalThis, {
  __MOBILE_API_ORIGIN__: "https://mobile-api.test",
  __MOBILE_SHELL_VERSION__: "test-shell",
});

interface MobileFeedCard {
  venue: MobileVenue;
  reasonShown: string;
  whyThisPlace: string;
  skipIf: string | null;
  tags: string[];
  freshness: string;
}

interface MobileFeedResult {
  updatedAt: string;
  page: {
    items: MobileFeedCard[];
    nextCursor: string | null;
    end: boolean;
  };
}

type ApiModule = typeof import("../src/api") & {
  parseMobileFeedResponse?: (value: unknown) => MobileFeedResult;
  fetchDiscoveryFeed?: (
    request: {
      district: string;
      category: string;
      limit: number;
      cursor: string | null;
    },
    signal?: AbortSignal,
  ) => Promise<MobileFeedResult>;
  MOBILE_API_TIMEOUT_MS: number;
  MobileApiTimeoutError: new () => Error;
};

const apiPromise = import("../src/api") as Promise<ApiModule>;
const originalFetch = globalThis.fetch;

function installFetch(mockFetch: typeof fetch): () => void {
  globalThis.fetch = mockFetch;
  return () => {
    globalThis.fetch = originalFetch;
  };
}

const venue: MobileVenue = {
  id: "place-a",
  slug: "place-a",
  name: "Place A",
  category: "cafe",
  district: "sanur",
  subarea: "beach",
  photoUrl: "https://images.example.com/place-a.jpg",
  bestFor: "Calm mornings",
  isSponsored: false,
  fullAddress: "1 Beach Road",
  mapsUrl: "https://www.google.com/maps/place/Place+A",
  officialUrl: "https://place-a.example.com",
  instagramUrl: "https://www.instagram.com/place_a",
  priceLabel: "$$",
  whatToOrder: "Coffee",
  whyItsHere: "A calm morning stop.",
  notFor: "Late nights.",
  practicalTags: ["outdoor seating"],
  vibes: ["calm"],
};

const envelope = {
  schemaVersion: 1,
  updatedAt: "2026-07-28T08:00:00.000Z",
  data: {
    page: {
      items: [{
        venue,
        reasonShown: "Included for calm mornings.",
        whyThisPlace: "A calm morning stop.",
        skipIf: "You need a late-night venue.",
        tags: ["sanur", "cafe", "calm"],
        freshness: "Guide snapshot · 2026-07-28T08:00:00.000Z",
      }],
      nextCursor: "eyJ2IjoxLCJvZmZzZXQiOjF9",
      end: false,
    },
  },
};

test("mobile feed parser validates the shared envelope, full venue truth and cursor lifecycle", async () => {
  const api = await apiPromise;
  assert.equal(typeof api.parseMobileFeedResponse, "function");
  const result = api.parseMobileFeedResponse!(envelope);

  assert.equal(result.updatedAt, envelope.updatedAt);
  assert.deepEqual(result.page.items[0]?.venue, venue);
  assert.deepEqual(result.page.items[0], envelope.data.page.items[0]);
  assert.equal(result.page.nextCursor, envelope.data.page.nextCursor);
  assert.equal(result.page.end, false);
});

test("mobile feed parser rejects duplicate identities and invalid lifecycle or cursor fields", async () => {
  const api = await apiPromise;
  assert.equal(typeof api.parseMobileFeedResponse, "function");
  const parse = api.parseMobileFeedResponse!;
  const card = envelope.data.page.items[0]!;
  const invalidPayloads = [
    {
      ...envelope,
      data: {
        page: {
          ...envelope.data.page,
          items: [card, { ...card, reasonShown: "duplicate" }],
        },
      },
    },
    { ...envelope, updatedAt: "not-a-timestamp" },
    {
      ...envelope,
      data: { page: { ...envelope.data.page, nextCursor: null, end: false } },
    },
    {
      ...envelope,
      data: { page: { ...envelope.data.page, nextCursor: "still-more", end: true } },
    },
    {
      ...envelope,
      data: { page: { ...envelope.data.page, nextCursor: "../unsafe", end: false } },
    },
    {
      ...envelope,
      data: { page: { ...envelope.data.page, nextCursor: "x".repeat(501), end: false } },
    },
    {
      ...envelope,
      data: {
        page: {
          ...envelope.data.page,
          items: [{ ...card, freshness: "", tags: ["x".repeat(121)] }],
        },
      },
    },
  ];

  for (const payload of invalidPayloads) {
    assert.throws(() => parse(payload), /feed|cursor|lifecycle|timestamp|bounded|duplicate/i);
  }
});

test("fetchDiscoveryFeed sends exact encoded filters through the mobile timeout gateway", async () => {
  const api = await apiPromise;
  assert.equal(typeof api.fetchDiscoveryFeed, "function");
  let requestUrl: URL | null = null;
  let requestSignal: AbortSignal | null | undefined;
  const restoreFetch = installFetch((async (input, init) => {
    requestUrl = new URL(String(input));
    requestSignal = init?.signal;
    return new Response(JSON.stringify(envelope), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch);

  try {
    const result = await api.fetchDiscoveryFeed!({
      district: "nusa-islands",
      category: "beach_club",
      limit: 1,
      cursor: "opaque_Cursor-2",
    });
    const capturedRequestUrl = requestUrl as URL | null;
    assert.ok(capturedRequestUrl);
    assert.equal(capturedRequestUrl.origin, "https://mobile-api.test");
    assert.equal(capturedRequestUrl.pathname, "/api/mobile/v1/feed");
    assert.deepEqual([...capturedRequestUrl.searchParams.entries()], [
      ["district", "nusa-islands"],
      ["category", "beach_club"],
      ["limit", "1"],
      ["cursor", "opaque_Cursor-2"],
    ]);
    assert.ok(requestSignal);
    assert.equal(result.page.items[0]?.venue.id, "place-a");
  } finally {
    restoreFetch();
  }
});

test("fetchDiscoveryFeed rejects a 400 error response and aborts a stalled request at the shared deadline", async (t) => {
  const api = await apiPromise;
  assert.equal(typeof api.fetchDiscoveryFeed, "function");
  let restoreFetch = installFetch((async () => new Response(JSON.stringify({
    schemaVersion: 1,
    updatedAt: "2026-07-28T08:00:00.000Z",
    error: {
      code: "invalid_request",
      message: "The request is invalid.",
    },
  }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  })) as typeof fetch);

  try {
    await assert.rejects(
      api.fetchDiscoveryFeed!({
        district: "../sanur",
        category: "cafe",
        limit: 2,
        cursor: null,
      }),
      /400/,
    );
  } finally {
    restoreFetch();
  }

  t.mock.timers.enable({ apis: ["setTimeout"] });
  let requestSignal: AbortSignal | null | undefined;
  restoreFetch = installFetch((async (_input, init) => {
    requestSignal = init?.signal;
    return await new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener(
        "abort",
        () => reject(new DOMException("The operation was aborted.", "AbortError")),
        { once: true },
      );
    });
  }) as typeof fetch);

  try {
    const request = api.fetchDiscoveryFeed!({
      district: "sanur",
      category: "cafe",
      limit: 2,
      cursor: null,
    });
    t.mock.timers.tick(api.MOBILE_API_TIMEOUT_MS);
    await assert.rejects(request, api.MobileApiTimeoutError);
    assert.equal(requestSignal?.aborted, true);
  } finally {
    restoreFetch();
  }
});
