import assert from "node:assert/strict";
import test from "node:test";
import { rawCookieValues } from "./http-cookie";

test("raw cookie parsing preserves duplicate names so callers can fail closed", () => {
  assert.deepEqual(rawCookieValues(
    "a=1; __Host-token=first; __Host-token=second; other=x=y",
    "__Host-token",
  ), ["first", "second"]);
  assert.deepEqual(rawCookieValues(null, "__Host-token"), []);
});
