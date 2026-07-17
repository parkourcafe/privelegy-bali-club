import assert from "node:assert/strict";
import test from "node:test";
import { checkMobileReadiness } from "./health";
import { publicReleaseId } from "./release-id";

test("public release IDs never expose arbitrary deployment metadata", () => {
  assert.equal(publicReleaseId("7257da7d18b7a6121e1b19d6aa7f204ea202ff5c"), "7257da7d18b7");
  assert.equal(publicReleaseId("not-a-commit"), "local");
  assert.equal(publicReleaseId(""), "local");
});

test("mobile readiness preserves bounded dependency results", async () => {
  assert.deepEqual(
    await checkMobileReadiness(50, async () => ({ ready: true })),
    { ready: true },
  );
  assert.deepEqual(
    await checkMobileReadiness(50, async () => ({ ready: false, reason: "empty_catalog" })),
    { ready: false, reason: "empty_catalog" },
  );
  assert.deepEqual(
    await checkMobileReadiness(50, async () => {
      throw new Error("database unavailable");
    }),
    { ready: false, reason: "dependency_unavailable" },
  );
});

test("mobile readiness times out instead of hanging health polling", async () => {
  const result = await checkMobileReadiness(5, () => new Promise(() => undefined));
  assert.deepEqual(result, { ready: false, reason: "timeout" });
});
