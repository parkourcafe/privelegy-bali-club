import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

// AGENTS.md §7: mobile action targets are at least 44–46 px and no
// horizontal-scroll UI may hide required choices. These are the tap targets a
// 360 px Playwright pass (T-OB-03, 2026-09-28) measured below 44 px.
const css = readFileSync("app/globals.css", "utf8");

function ruleBody(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`(?:^|\\n)${escaped}\\s*\\{([^}]*)\\}`));
  assert.ok(match, `missing CSS rule ${selector}`);
  return match[1];
}

function minHeightPx(selector) {
  const m = ruleBody(selector).match(/min-height:\s*(\d+)px/);
  assert.ok(m, `${selector} has no px min-height`);
  return Number(m[1]);
}

test("interactive controls keep a 44 px minimum tap height", () => {
  for (const selector of [
    ".quiet-link",
    ".chip",
    ".criteria-chip",
    ".criteria-clear",
    ".lead-form .check-pill",
    ".ob-compact-link",
    ".decision-moments button, .decision-view-toggle button",
  ]) {
    assert.ok(minHeightPx(selector) >= 44, `${selector} is below 44 px`);
  }
});

test("consent banner buttons are 44 px (min-h-11), not 40 px", () => {
  const banner = readFileSync("components/ConsentBanner.tsx", "utf8");
  assert.doesNotMatch(banner, /min-h-10/);
  assert.equal((banner.match(/min-h-11 rounded-full/g) ?? []).length, 2);
});

test("Plan moment picker wraps on phones instead of scrolling sideways", () => {
  const mobile = css.match(/@media \(max-width: 640px\) \{\s*\.moment-strip \{([^}]*)\}/);
  assert.ok(mobile, "missing phone rule for .moment-strip");
  assert.match(mobile[1], /display:\s*grid/);
  assert.match(mobile[1], /overflow-x:\s*visible/);
});
