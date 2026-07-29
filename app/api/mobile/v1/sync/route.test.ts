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

interface SyncRouteModule {
  POST?: (request: Request) => Promise<Response>;
  OPTIONS?: (request: Request) => Response;
}

const routeModulePath = "./route";
async function loadRouteModule(): Promise<SyncRouteModule> {
  try {
    return await import(routeModulePath) as SyncRouteModule;
  } catch {
    return {};
  }
}

function request(
  method: "POST" | "OPTIONS",
  origin = "capacitor://localhost",
  guestRef = "g_0123456789abcdef",
) {
  return new Request("https://www.otherbali.com/api/mobile/v1/sync", {
    method,
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      "Idempotency-Key": "sync-route-test-1",
      "X-Other-Bali-Guest": guestRef,
    },
    body: method === "POST"
      ? JSON.stringify({
          entityType: "saved",
          entityId: "milk-and-madu",
          operation: "save",
          payload: {
            entityType: "place",
            entityId: "milk-and-madu",
          },
        })
      : undefined,
  });
}

test("sync preflight allows the durable guest header only for exact mobile origins", async () => {
  const route = await loadRouteModule();
  assert.equal(typeof route.OPTIONS, "function");
  for (const origin of [
    "capacitor://localhost",
    "http://localhost",
    "https://localhost",
  ]) {
    const response = route.OPTIONS!(request("OPTIONS", origin));
    assert.equal(response.status, 204);
    assert.equal(response.headers.get("access-control-allow-origin"), origin);
    assert.equal(response.headers.get("access-control-allow-credentials"), "true");
    assert.match(
      response.headers.get("access-control-allow-headers") ?? "",
      /X-Other-Bali-Guest/i,
    );
  }
  assert.equal(
    route.OPTIONS!(request("OPTIONS", "https://evil.example")).status,
    403,
  );
});

test("sync rejects a malformed guest reference before reaching storage and keeps CORS", async () => {
  const route = await loadRouteModule();
  assert.equal(typeof route.POST, "function");
  const response = await route.POST!(
    request("POST", "capacitor://localhost", "guest-not-valid"),
  );
  assert.equal(response.status, 400);
  assert.equal(
    response.headers.get("access-control-allow-origin"),
    "capacitor://localhost",
  );
  assert.match(
    response.headers.get("access-control-allow-headers") ?? "",
    /X-Other-Bali-Guest/i,
  );
  assert.equal((await response.json()).error.code, "INVALID_REQUEST");
});
