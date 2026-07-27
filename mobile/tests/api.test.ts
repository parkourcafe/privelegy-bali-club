import assert from "node:assert/strict";
import test from "node:test";

Object.assign(globalThis, {
  __MOBILE_API_ORIGIN__: "https://mobile-api.test",
  __MOBILE_SHELL_VERSION__: "test-shell",
});

type ApiModule = typeof import("../src/api") & {
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

function abortError(): DOMException {
  return new DOMException("The operation was aborted.", "AbortError");
}

test("mobile API deadline aborts a stalled bootstrap request with a typed timeout", async (t) => {
  const api = await apiPromise;
  assert.equal(api.MOBILE_API_TIMEOUT_MS, 12_000);
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let requestSignal: AbortSignal | null | undefined;
  const restoreFetch = installFetch((async (_input, init) => {
    assert.ok(init?.signal);
    requestSignal = init.signal;
    return await new Promise<Response>((_resolve, reject) => {
      init.signal?.addEventListener("abort", () => reject(abortError()), { once: true });
    });
  }) as typeof fetch);

  try {
    const request = api.fetchBootstrap();
    t.mock.timers.tick(api.MOBILE_API_TIMEOUT_MS);
    await assert.rejects(request, (error: unknown) => {
      assert.ok(error instanceof api.MobileApiTimeoutError);
      assert.equal((error as Error).name, "MobileApiTimeoutError");
      return true;
    });
    assert.ok(requestSignal);
    assert.equal(requestSignal.aborted, true);
  } finally {
    restoreFetch();
  }
});

test("mobile API deadline also bounds response JSON decoding and parsing", async (t) => {
  const api = await apiPromise;
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let markJsonStarted: (() => void) | undefined;
  const jsonStarted = new Promise<void>((resolve) => {
    markJsonStarted = resolve;
  });
  const restoreFetch = installFetch((async () => ({
    ok: true,
    status: 200,
    json: async () => {
      markJsonStarted?.();
      return await new Promise<never>(() => undefined);
    },
  }) as unknown as Response) as typeof fetch);

  try {
    const request = api.fetchVenueDetail("sample-cafe");
    await jsonStarted;
    t.mock.timers.tick(api.MOBILE_API_TIMEOUT_MS);
    await assert.rejects(request, api.MobileApiTimeoutError);
  } finally {
    restoreFetch();
  }
});

test("an external abort remains an AbortError instead of becoming a timeout", async () => {
  const api = await apiPromise;
  const restoreFetch = installFetch((async (_input, init) => {
    assert.ok(init?.signal);
    return await new Promise<Response>((_resolve, reject) => {
      init.signal?.addEventListener("abort", () => reject(abortError()), { once: true });
    });
  }) as typeof fetch);
  const controller = new AbortController();

  try {
    const request = api.fetchVenueDetail("sample-cafe", controller.signal);
    controller.abort();
    await assert.rejects(request, (error: unknown) => {
      assert.ok(error instanceof DOMException);
      assert.equal(error.name, "AbortError");
      assert.equal(error instanceof api.MobileApiTimeoutError, false);
      return true;
    });
  } finally {
    restoreFetch();
  }
});

test("a successful route response is parsed and clears its deadline timer", async () => {
  const api = await apiPromise;
  const routeEnvelope = {
    schemaVersion: 1,
    updatedAt: "2026-07-18T00:00:00.000Z",
    data: {
      route: {
        id: "quiet-ubud",
        slug: "quiet-ubud",
        title: "Quiet Ubud",
        subtitle: null,
        stopCount: 1,
        stops: [{
          position: 1,
          venue: {
            id: "sample-cafe",
            slug: "sample-cafe",
            name: "Sample Cafe",
            category: "cafe",
            district: "ubud",
            subarea: null,
            photoUrl: null,
            bestFor: null,
            isSponsored: false,
          },
        }],
      },
    },
  };
  const restoreFetch = installFetch((async () => new Response(JSON.stringify(routeEnvelope), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  })) as typeof fetch);
  const originalClearTimeout = globalThis.clearTimeout;
  let clearedTimers = 0;
  globalThis.clearTimeout = ((timer: ReturnType<typeof setTimeout>) => {
    clearedTimers += 1;
    originalClearTimeout(timer);
  }) as typeof clearTimeout;

  try {
    const result = await api.fetchRouteDetail("quiet-ubud");
    assert.equal(result.data.route.slug, "quiet-ubud");
    assert.equal(result.data.route.stops[0]?.venue.name, "Sample Cafe");
    assert.equal(clearedTimers, 1);
  } finally {
    globalThis.clearTimeout = originalClearTimeout;
    restoreFetch();
  }
});

test("shared decision response is bounded and preserves server order", async () => {
  const api = await apiPromise;
  const result = api.parseDecisionResponse({
    schemaVersion: 1,
    data: {
      ok: true,
      result: {
        bestFit: { placeId: "first-place", name: "First", why: "Fit", notIdealIf: null },
        backup: { placeId: "second-place", name: "Second", why: null, notIdealIf: "Late" },
        contrast: null,
        emptyStateReason: null,
      },
    },
  });
  assert.equal(result.bestFit?.placeId, "first-place");
  assert.equal(result.backup?.placeId, "second-place");
  assert.equal(result.contrast, null);
  assert.throws(() => api.parseDecisionResponse({
    data: { result: { bestFit: { placeId: "../unsafe", name: "Unsafe" } } },
  }));
});

test("mobile decision uses the shared runtime through the credentialed mobile gateway", async () => {
  const api = await apiPromise;
  let requestUrl = "";
  let requestInit: RequestInit | undefined;
  const restoreFetch = installFetch((async (input, init) => {
    requestUrl = String(input);
    requestInit = init;
    return new Response(JSON.stringify({
      data: {
        ok: true,
        result: { bestFit: null, backup: null, contrast: null, emptyStateReason: "none" },
      },
    }), { status: 201, headers: { "Content-Type": "application/json" } });
  }) as typeof fetch);
  try {
    await api.createDecision({ area: "sanur", moment: "local_food_calm" });
    assert.equal(requestUrl, "https://mobile-api.test/api/mobile/v1/decisions");
    assert.equal(requestInit?.method, "POST");
    assert.equal(requestInit?.credentials, "include");
    assert.match(String(requestInit?.body), /"area":"sanur"/);
    assert.ok(new Headers(requestInit?.headers).get("Idempotency-Key"));
  } finally {
    restoreFetch();
  }
});

test("What’s On response validates event lifecycle and uses the mobile gateway", async () => {
  const api = await apiPromise;
  const event = {
    id: "occurrence-1",
    eventId: "event-1",
    title: "Sunset session",
    venueSlug: "sample-cafe",
    area: "Sanur",
    startsAt: "2026-08-01T10:00:00.000Z",
    endsAt: "2026-08-01T12:00:00.000Z",
    lastVerifiedAt: "2026-07-31T10:00:00.000Z",
    expiresAt: "2026-08-01T12:30:00.000Z",
  };
  const restoreFetch = installFetch((async (input) => {
    assert.equal(String(input), "https://mobile-api.test/api/mobile/v1/events");
    return new Response(JSON.stringify({
      schemaVersion: 1,
      updatedAt: "2026-07-31T10:00:00.000Z",
      data: { events: [event] },
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  }) as typeof fetch);
  try {
    assert.equal((await api.fetchEvents()).events[0]?.title, "Sunset session");
    assert.throws(() => api.parseEventsResponse({
      updatedAt: "2026-07-31T10:00:00.000Z",
      data: { events: [{ ...event, endsAt: event.startsAt }] },
    }), /lifecycle/);
  } finally {
    restoreFetch();
  }
});

test("sync push returns the raw acknowledgement required for safe queue settlement", async () => {
  const api = await apiPromise;
  const mutation = {
    idempotencyKey: "sync-acknowledgement-1",
    entityType: "saved" as const,
    entityId: "sample-cafe",
    operation: "save",
    payload: { entityType: "place", entityId: "sample-cafe" },
    baseVersion: null,
    createdAt: "2026-07-28T10:00:00.000Z",
  };
  const acknowledgement = {
    ok: true,
    status: "applied",
    idempotencyKey: mutation.idempotencyKey,
    serverVersion: "2",
  };
  const restoreFetch = installFetch((async (input, init) => {
    assert.equal(String(input), "https://mobile-api.test/api/mobile/v1/sync");
    assert.equal(init?.method, "POST");
    assert.equal(
      new Headers(init?.headers).get("Idempotency-Key"),
      mutation.idempotencyKey,
    );
    return new Response(JSON.stringify({ data: acknowledgement }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch);

  try {
    assert.deepEqual(await api.pushSyncMutation(mutation), acknowledgement);
  } finally {
    restoreFetch();
  }
});
