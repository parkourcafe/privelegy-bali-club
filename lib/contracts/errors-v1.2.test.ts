import assert from "node:assert/strict";
import test from "node:test";
import { V12_ERROR_CODES, V12_ERROR_CONTRACTS } from "./errors-v1.2";

test("every required v1.2 error has a stable complete fallback contract", () => {
  assert.equal(V12_ERROR_CODES.length, 19);
  assert.deepEqual(Object.keys(V12_ERROR_CONTRACTS).sort(), [...V12_ERROR_CODES].sort());
  for (const code of V12_ERROR_CODES) {
    const contract = V12_ERROR_CONTRACTS[code];
    assert.ok(contract.httpStatus >= 200 && contract.httpStatus < 600, `${code} HTTP status`);
    assert.ok(contract.fallback.length >= 12, `${code} fallback`);
    assert.ok(["info", "warning", "error"].includes(contract.severity), `${code} severity`);
  }
});

test("truth and safety failures never retry into a fake success", () => {
  for (const code of [
    "PLACE_NOT_ROUTE_READY",
    "ACTION_NOT_VERIFIED",
    "ACTION_LINK_BROKEN",
    "ROUTE_NO_PATH",
    "EVENT_EXPIRED",
    "EVENT_CANCELLED",
    "DEEP_LINK_INVALID",
  ] as const) {
    assert.equal(V12_ERROR_CONTRACTS[code].retryable, false, code);
  }
});

test("location denial preserves the manual-area product path", () => {
  assert.match(V12_ERROR_CONTRACTS.LOCATION_PERMISSION_DENIED.fallback, /manual area/i);
});

