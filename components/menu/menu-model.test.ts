import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { menuActionFixtures } from "@/lib/contracts/menu-action.fixtures";
import MenuItem from "./MenuItem";
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

test("expanded menu item displays every verified allergen", () => {
  const item = {
    ...menuActionFixtures.freshMenu.sections[0].items[0],
    verifiedAllergenTags: ["milk", "eggs", "wheat", "peanuts"],
  };
  const html = renderToStaticMarkup(createElement(MenuItem, { item }));
  for (const tag of item.verifiedAllergenTags) {
    assert.match(html, new RegExp(`Contains: ${tag}`));
  }
});
