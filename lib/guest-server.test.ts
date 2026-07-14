import assert from "node:assert/strict";
import test from "node:test";
import { isGuestRef } from "./guest-ref-proof";

test("guest references accept only the issued fixed-length shape", () => {
  assert.equal(isGuestRef("g_Abcdefghijklmno1"), true);
  assert.equal(isGuestRef("g_short"), false);
  assert.equal(isGuestRef(`g_${"a".repeat(17)}`), false);
  assert.equal(isGuestRef("attacker-controlled"), false);
});
