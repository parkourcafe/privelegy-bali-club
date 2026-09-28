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

// T-OB-05: the second 360 px pass found these below 44 px. Logo, footer links
// and breadcrumbs are excluded on purpose — sizing them is an owner decision.
test("link forms of .chip and .topline honour the 44 px minimum", () => {
  assert.match(ruleBody("a.chip"), /display:\s*inline-flex/);
  assert.ok(minHeightPx("a.topline") >= 44, "a.topline is below 44 px");
  assert.ok(minHeightPx(".ob-site-nav a") >= 44, ".ob-site-nav a is below 44 px");
});

test("tap targets found at 32–40 px on /my-day, /places and / are 44 px", () => {
  const cases = [
    ["components/my-day/DayBuilderForm.tsx", /min-h-11 items-center gap-1\.5[^"]*"\s*>\s*📍/],
    ["app/places/PlacesView.tsx", /inline-flex min-h-11 items-center rounded-full[^"]*"\s*>\s*All \{section\.total\} →/],
    ["app/places/page.tsx", /inline-flex min-h-11 items-center[^"]*"\s*>\s*Need a trip plan\? →/],
    ["app/page.tsx", /min-h-11 items-center[^"]*"\s*>\s*Explore Bali areas →/],
    ["app/page.tsx", /min-h-11 items-center[^"]*"\s*>\s*See all Bali plans →/],
    ["components/SimilarPlaces.tsx", /button-secondary min-h-11/],
    ["components/landing/LandingChrome.tsx", /h-11 w-11 items-center justify-center rounded-full/],
    ["components/PropertySubmissionForm.tsx", /min-h-11 rounded-full px-4/],
    ["app/partner/page.tsx", /inline-flex min-h-11 items-center/],
  ];
  for (const [file, pattern] of cases) {
    assert.match(readFileSync(file, "utf8"), pattern, `${file} lost its 44 px target`);
  }
  for (const file of ["components/my-day/DayBuilderForm.tsx", "components/SimilarPlaces.tsx", "components/PropertySubmissionForm.tsx", "app/partner/page.tsx"]) {
    assert.doesNotMatch(readFileSync(file, "utf8"), /\bmin-h-(8|9|10)\b/, `${file} still has a sub-44 px min-h`);
  }
});
