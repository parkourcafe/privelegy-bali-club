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

type GuestResolver = () => Promise<ExistingGuestRefResolution>;
type GuestEraser = (guestRef: string) => Promise<GuestErasureResult>;
interface ForgetRouteModule {
  createWebPrivacyForgetHandler?: (
    resolveGuest: GuestResolver,
    eraseGuest: GuestEraser,
  ) => () => Promise<Response>;
}

const routeModulePath = "./route";
async function loadRouteModule(): Promise<ForgetRouteModule> {
  try {
    return await import(routeModulePath) as ForgetRouteModule;
  } catch {
    return {};
  }
}

test("web forget removes v1.2 state before unlinking the browser", async () => {
  const route = await loadRouteModule();
  assert.equal(typeof route.createWebPrivacyForgetHandler, "function");
  let erasedRef: string | null = null;
  const POST = route.createWebPrivacyForgetHandler!(
    async () => ({ ref: "g_0123456789abcdef", invalid: false }),
    async (ref) => {
      erasedRef = ref;
      return {
        ok: true,
        deleted: true,
        retainedRedemptions: 1,
        retainedConsents: 1,
      };
    },
  );

  const response = await POST();
  assert.equal(response.status, 200);
  assert.equal(erasedRef, "g_0123456789abcdef");
  const setCookie = response.headers.get("set-cookie") ?? "";
  assert.match(setCookie, /bp_guest=/);
  assert.match(setCookie, /bp_consent=/);
  assert.match(setCookie, /Max-Age=0/i);
  assert.deepEqual(await response.json(), {
    ok: true,
    deleted: true,
    retained: {
      scope: [
        "a bare revoked pseudonymous guest reference and erasure timestamp retained indefinitely to prevent replay",
        "existing redemption proof detached from the installation reference and retained for partner proof, accounting, and applicable legal needs",
        "corresponding granted redemption consent evidence with device-specific fields removed",
      ],
      redemptionRecords: 1,
      correspondingConsentRecords: 1,
    },
  });
});

test("web forget is idempotent when the browser has no guest cookie", async () => {
  const route = await loadRouteModule();
  assert.equal(typeof route.createWebPrivacyForgetHandler, "function");
  let erasures = 0;
  const POST = route.createWebPrivacyForgetHandler!(
    async () => ({ ref: null, invalid: false }),
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

  const response = await POST();
  assert.equal(response.status, 200);
  assert.equal(erasures, 0);
  assert.equal((await response.json()).deleted, false);
});

test("web forget preserves the reference when server deletion is not confirmed", async () => {
  const route = await loadRouteModule();
  assert.equal(typeof route.createWebPrivacyForgetHandler, "function");
  const POST = route.createWebPrivacyForgetHandler!(
    async () => ({ ref: "g_0123456789abcdef", invalid: false }),
    async () => ({
      ok: false,
      deleted: false,
      retainedRedemptions: 0,
      retainedConsents: 0,
      error: "privacy_store_unavailable",
    }),
  );

  const response = await POST();
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("set-cookie"), null);
  assert.equal((await response.json()).ok, false);
});
