import assert from "node:assert/strict";
import test from "node:test";
import { formatMenuPrice } from "./menu-model";

test("formatMenuPrice preserves source price text and formats known currencies", () => {
  assert.equal(formatMenuPrice(85000, "IDR", " Rp 85k++ "), "Rp 85k++");
  assert.match(formatMenuPrice(85000, "IDR") ?? "", /85[,.]?000/);
  assert.match(formatMenuPrice(1250, "USD") ?? "", /12\.50/);
});

test("formatMenuPrice suppresses unsupported or ambiguous numeric prices", () => {
  assert.equal(formatMenuPrice(85000, "NOT_A_CURRENCY"), null);
  assert.equal(formatMenuPrice(Number.NaN, "IDR"), null);
  assert.equal(formatMenuPrice(85000, ""), null);
});
