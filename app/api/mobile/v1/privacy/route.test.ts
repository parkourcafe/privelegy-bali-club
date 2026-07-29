import assert from "node:assert/strict";
import Module from "node:module";
import test from "node:test";
import type { ExistingGuestRefResolution } from "@/lib/guest-server";
import type { GuestErasureResult } from "@/lib/mobile-privacy";

const moduleRuntime = Module as unknown as {
  _load(request: string, parent: unknown, isMain: boolean): unknown;
};
const originalModuleLoad = moduleRuntime._load;
moduleRuntime._load = function loadForServerTest(request, parent, isMain) {
  if (request === "server-only") return {};
  return originalModuleLoad.call(this, request, parent, isMain);
};

type GuestResolver = (request: Request) => Promise<ExistingGuestRefResolution>;
type GuestEraser = (guestRef: string) => Promise<GuestErasureResult>;
type DeleteHandler = (request: Request) => Promise<Response>;
interface PrivacyRouteModule {
  createMobilePrivacyDeleteHandler?: (
    resolveGuest: GuestResolver,
    eraseGuest: GuestEraser,
  ) => DeleteHandler;
  OPTIONS?: (request: Request) => Response;
}

const routeModulePath = "./route";
async function loadRouteModule(): Promise<PrivacyRouteModule> {
  try {
    return await import(routeModulePath) as PrivacyRouteModule;
  } catch {
    return {};
  }
}

function request(
  origin = "capacitor://localhost",
  guestRef = "g_0123456789abcdef",
) {
  return new Request("https://www.otherbali.com/api/mobile/v1/privacy", {
    method: "DELETE",
    headers: {
      Origin: origin,
      "X-Other-Bali-Guest": guestRef,
    },
  });
}

test("mobile privacy OPTIONS allows only exact Capacitor origins and the guest header", async () => {
  const route = await loadRouteModule();
  assert.equal(typeof route.OPTIONS, "function");

  for (const origin of [
    "capacitor://localhost",
    "http://localhost",
    "https://localhost",
  ]) {
    const response = route.OPTIONS!(request(origin));
    assert.equal(response.status, 204);
    assert.equal(response.headers.get("access-control-allow-origin"), origin);
    assert.equal(response.headers.get("access-control-allow-credentials"), "true");
    assert.match(
      response.headers.get("access-control-allow-headers") ?? "",
      /X-Other-Bali-Guest/i,
    );
    assert.equal(
      response.headers.get("access-control-allow-methods"),
      "DELETE, OPTIONS",
    );
  }

  assert.equal(route.OPTIONS!(request("https://evil.example")).status, 403);
  assert.equal(route.OPTIONS!(request("https://localhost.evil.example")).status, 403);
});

test("mobile guest resolution accepts only the exact pseudonymous header shape", async () => {
  const guestServer = await import("@/lib/guest-server");
  assert.equal(
    guestServer.readMobileGuestRef(request()),
    "g_0123456789abcdef",
  );
  assert.equal(
    guestServer.readMobileGuestRef(request("capacitor://localhost", "guest-123")),
    null,
  );
  assert.equal(
    guestServer.readMobileGuestRef(
      new Request("https://www.otherbali.com/api/mobile/v1/privacy"),
    ),
    undefined,
  );

  assert.deepEqual(await guestServer.resolveGuestRef(request()), {
    ref: "g_0123456789abcdef",
    created: false,
  });
  await assert.rejects(
    () => guestServer.resolveGuestRef(
      request("capacitor://localhost", "g_0123456789abcdef-extra"),
    ),
    { name: "InvalidGuestRefError" },
  );

  assert.deepEqual(
    await guestServer.resolveMobilePrivacyGuestRef(
      new Request("https://www.otherbali.com/api/mobile/v1/privacy", {
        headers: { Cookie: "bp_guest=g_0123456789abcdef" },
      }),
    ),
    { ref: null, invalid: true },
    "mobile deletion must not fall back to a WebView cookie",
  );
});

test("mobile privacy DELETE confirms server erasure before clearing the cookie", async () => {
  const route = await loadRouteModule();
  assert.equal(typeof route.createMobilePrivacyDeleteHandler, "function");
  let erasedRef: string | null = null;
  const DELETE = route.createMobilePrivacyDeleteHandler!(
    async (incoming) => ({
      ref: incoming.headers.get("X-Other-Bali-Guest"),
      invalid: false,
    }),
    async (guestRef) => {
      erasedRef = guestRef;
      return {
        ok: true,
        deleted: true,
        retainedRedemptions: 2,
        retainedConsents: 1,
      };
    },
  );

  const response = await DELETE(request());
  assert.equal(response.status, 200);
  assert.equal(erasedRef, "g_0123456789abcdef");
  assert.equal(
    response.headers.get("access-control-allow-origin"),
    "capacitor://localhost",
  );
  assert.equal(response.headers.get("access-control-allow-credentials"), "true");
  assert.match(response.headers.get("set-cookie") ?? "", /bp_guest=/);
  assert.match(response.headers.get("set-cookie") ?? "", /Max-Age=0/i);
  assert.deepEqual(await response.json(), {
    ok: true,
    deleted: true,
    retained: {
      scope: [
        "a bare revoked pseudonymous guest reference and erasure timestamp retained indefinitely to prevent replay",
        "existing redemption proof detached from the installation reference and retained for partner proof, accounting, and applicable legal needs",
        "corresponding granted redemption consent evidence with device-specific fields removed",
      ],
      redemptionRecords: 2,
      correspondingConsentRecords: 1,
    },
  });
});

test("mobile privacy DELETE is idempotent after the guest reference is tombstoned", async () => {
  const route = await loadRouteModule();
  assert.equal(typeof route.createMobilePrivacyDeleteHandler, "function");
  const DELETE = route.createMobilePrivacyDeleteHandler!(
    async () => ({ ref: "g_0123456789abcdef", invalid: false }),
    async () => ({
      ok: true,
      deleted: true,
      retainedRedemptions: 0,
      retainedConsents: 0,
    }),
  );

  const response = await DELETE(request("https://localhost"));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).deleted, true);
  assert.match(response.headers.get("set-cookie") ?? "", /Max-Age=0/i);
});

test("mobile privacy DELETE never erases for a missing guest or untrusted origin", async () => {
  const route = await loadRouteModule();
  assert.equal(typeof route.createMobilePrivacyDeleteHandler, "function");
  let erasures = 0;
  let resolutions = 0;
  const DELETE = route.createMobilePrivacyDeleteHandler!(
    async () => {
      resolutions += 1;
      return { ref: null, invalid: true };
    },
    async () => {
      erasures += 1;
      return {
        ok: true,
        deleted: true,
        retainedRedemptions: 0,
        retainedConsents: 0,
      };
    },
  );

  const invalidGuest = await DELETE(request());
  assert.equal(invalidGuest.status, 400);
  assert.equal(erasures, 0);
  assert.equal(invalidGuest.headers.get("set-cookie"), null);

  const untrusted = await DELETE(request("https://evil.example"));
  assert.equal(untrusted.status, 403);
  assert.equal(resolutions, 1, "origin is rejected before guest resolution");
  assert.equal(erasures, 0);
  assert.equal(untrusted.headers.get("set-cookie"), null);
});

test("mobile privacy DELETE does not claim success or clear identity after storage failure", async () => {
  const route = await loadRouteModule();
  assert.equal(typeof route.createMobilePrivacyDeleteHandler, "function");
  const DELETE = route.createMobilePrivacyDeleteHandler!(
    async () => ({ ref: "g_0123456789abcdef", invalid: false }),
    async () => ({
      ok: false,
      deleted: false,
      retainedRedemptions: 0,
      retainedConsents: 0,
      error: "privacy_store_unavailable",
    }),
  );

  const response = await DELETE(request("http://localhost"));
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("set-cookie"), null);
  const payload = await response.json();
  assert.equal(payload.ok, false);
  assert.match(payload.error.message, /could not be confirmed/i);
});
