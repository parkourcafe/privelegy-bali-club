import assert from "node:assert/strict";
import test from "node:test";
import {
  checkReadiness,
  publicReleaseId,
  releaseIdentityConfigured,
  type ReadinessClient,
  type ServiceReadinessClient,
} from "./health";

function publicClient(result: {
  count: number | null;
  error: { message: string } | null;
}): ReadinessClient {
  return { from: () => ({ select: async () => result }) };
}

function serviceClient(result: { data: unknown; error: { message: string } | null }): ServiceReadinessClient {
  return { rpc: async () => result };
}

test("readiness fails closed when configuration or either dependency is absent", async () => {
  const publicOk = publicClient({ count: 7, error: null });
  const serviceOk = serviceClient({
    data: { ok: true, version: 2, schemaRevision: "0041" },
    error: null,
  });
  assert.deepEqual(await checkReadiness(null, serviceOk, true), {
    ready: false,
    reason: "not_configured",
  });
  assert.deepEqual(await checkReadiness(publicOk, null, true), {
    ready: false,
    reason: "not_configured",
  });
  assert.deepEqual(await checkReadiness(publicOk, serviceOk, false), {
    ready: false,
    reason: "not_configured",
  });
});

test("readiness requires both public data and the service-only release schema probe", async () => {
  const publicOk = publicClient({ count: 7, error: null });
  const serviceOk = serviceClient({
    data: { ok: true, version: 2, schemaRevision: "0041" },
    error: null,
  });
  assert.deepEqual(await checkReadiness(publicOk, serviceOk, true), { ready: true });
  assert.deepEqual(await checkReadiness(
    publicClient({ count: null, error: { message: "private detail" } }),
    serviceOk,
    true,
  ), { ready: false, reason: "dependency_unavailable" });
  assert.deepEqual(await checkReadiness(
    publicOk,
    serviceClient({ data: null, error: { message: "bad service key" } }),
    true,
  ), { ready: false, reason: "dependency_unavailable" });
  assert.deepEqual(await checkReadiness(
    publicOk,
    serviceClient({ data: { ok: false }, error: null }),
    true,
  ), { ready: false, reason: "dependency_unavailable" });
  for (const emptyOrMalformedCount of [0, null, -1, 1.5]) {
    assert.deepEqual(await checkReadiness(
      publicClient({ count: emptyOrMalformedCount, error: null }),
      serviceOk,
      true,
    ), { ready: false, reason: "dependency_unavailable" });
  }
  for (const staleOrMalformedProbe of [
    true,
    { ok: true },
    { ok: true, version: 1, schemaRevision: "0040" },
    { ok: true, version: 2, schemaRevision: "0040" },
    { ok: true, version: 3, schemaRevision: "0041" },
  ]) {
    assert.deepEqual(await checkReadiness(
      publicOk,
      serviceClient({ data: staleOrMalformedProbe, error: null }),
      true,
    ), { ready: false, reason: "dependency_unavailable" });
  }
});

test("release readiness requires a valid current GuestRef signing secret", () => {
  assert.equal(releaseIdentityConfigured("x".repeat(32)), true);
  assert.equal(releaseIdentityConfigured("short"), false);
});

test("public release id is bounded and rejects arbitrary environment text", () => {
  assert.equal(publicReleaseId("98c7c74aeade2a026a00ad8eeb64d255301ca082"), "98c7c74aeade");
  assert.equal(publicReleaseId("secret-or-branch-name"), "local");
});
