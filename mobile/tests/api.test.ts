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
