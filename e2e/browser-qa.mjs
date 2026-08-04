// Real-browser QA for the date-night modifier refinement (Intent OS pilot OB-CAN-0011).
//
// Why this exists alongside e2e/date-night-modifiers.test.ts: that suite asserts
// server-rendered HTML over fetch, which cannot see whether the client filter
// actually hides cards. The refinement hides non-matching venues with a CSS
// attribute selector, so only a real engine that applies styles and runs
// hydration can prove it works. This script drives Chromium and clicks.
//
// Data is the seeded fixture set (NEXT_PUBLIC_TEST_MODE=1), not live Supabase —
// so this verifies the FILTER, not the live venue counts.
//
// Run: node e2e/browser-qa.mjs   (expects a server already on $BASE)

import { chromium } from "playwright-core";

const BASE = process.env.E2E_BASE_URL || "http://localhost:3000";
// The repo's pinned @playwright/test wants a browser revision this image does
// not carry; the image ships a full Chromium instead. Launch that explicitly
// rather than downloading (PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD is set here).
const EXECUTABLE = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium";

const results = [];
let failures = 0;

function check(name, pass, detail = "") {
  results.push({ name, pass, detail });
  if (!pass) failures++;
  const mark = pass ? "PASS" : "FAIL";
  console.log(`[${mark}] ${name}${detail ? ` — ${detail}` : ""}`);
}

/** Cards actually visible to the user, i.e. not hidden by the injected CSS. */
async function visibleCards(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll("[data-refine-grid] > [data-refine]")].filter(
      (el) => getComputedStyle(el).display !== "none"
    ).length
  );
}

async function allCards(page) {
  return page.evaluate(
    () => document.querySelectorAll("[data-refine-grid] > [data-refine]").length
  );
}

/** Chip text carries a trailing count span; read it as a number. */
async function chipCount(page, label) {
  return page.evaluate((lbl) => {
    const a = [...document.querySelectorAll("a")].find((x) =>
      x.textContent.trim().startsWith(lbl)
    );
    if (!a) return null;
    const m = a.textContent.match(/(\d+)\s*$/);
    return m ? Number(m[1]) : null;
  }, label);
}

async function chipExists(page, label) {
  return page.evaluate(
    (lbl) => [...document.querySelectorAll("a")].some((x) => x.textContent.trim().startsWith(lbl)),
    label
  );
}

const browser = await chromium.launch({
  executablePath: EXECUTABLE,
  args: ["--no-sandbox", "--disable-gpu"],
});

// Console and page errors are collected per page and asserted at the end, so a
// late-firing hydration warning still fails the run.
const consoleErrors = [];
const pageErrors = [];

const ctx = await browser.newContext();
const page = await ctx.newPage();
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});
page.on("pageerror", (e) => pageErrors.push(e.message));

// ---------------------------------------------------------------- Ubud ----

await page.goto(`${BASE}/bali/ubud/date-night`, { waitUntil: "networkidle" });

check("Ubud page renders (h1 present)", (await page.locator("h1").count()) > 0);
check(
  "Ubud shows the 'Narrow it down' heading",
  await page.locator("#refine-heading").isVisible()
);

check("Ubud offers 'Special occasion'", await chipExists(page, "Special occasion"));
check("Ubud offers 'Sunset view'", await chipExists(page, "Sunset view"));

const soCount = await chipCount(page, "Special occasion");
check("'Special occasion' count is 4", soCount === 4, `got ${soCount}`);

const svCount = await chipCount(page, "Sunset view");
check("'Sunset view' count is 2", svCount === 2, `got ${svCount}`);

check(
  "Ubud does NOT offer 'Quiet' (no evidence in this district)",
  !(await chipExists(page, "Quiet"))
);
check(
  "Ubud does NOT offer 'Secluded' (no field evidences it anywhere)",
  !(await chipExists(page, "Secluded"))
);

const ubudTotal = await allCards(page);
check("Ubud renders 9 venue cards", ubudTotal === 9, `got ${ubudTotal}`);

// --- interaction: Special occasion ---------------------------------------

await page.locator("a", { hasText: /^Special occasion/ }).first().click();
await page.waitForFunction(
  () =>
    [...document.querySelectorAll("[data-refine-grid] > [data-refine]")].filter(
      (el) => getComputedStyle(el).display !== "none"
    ).length === 4,
  null,
  { timeout: 5000 }
).catch(() => {});

let vis = await visibleCards(page);
check("Selecting 'Special occasion' narrows to 4 visible cards", vis === 4, `got ${vis}`);
check(
  "URL carries ?refine=special-occasion",
  page.url().includes("refine=special-occasion"),
  page.url()
);
check(
  "Selecting does not duplicate cards in the DOM",
  (await allCards(page)) === 9,
  `DOM cards ${await allCards(page)}`
);

// --- interaction: clear via Any ------------------------------------------

await page.locator("a", { hasText: /^Any$/ }).first().click();
await page.waitForFunction(
  () =>
    [...document.querySelectorAll("[data-refine-grid] > [data-refine]")].filter(
      (el) => getComputedStyle(el).display !== "none"
    ).length === 9,
  null,
  { timeout: 5000 }
).catch(() => {});

vis = await visibleCards(page);
check("Clearing via 'Any' restores all 9 cards", vis === 9, `got ${vis}`);
check("URL no longer carries a refine param", !page.url().includes("refine="), page.url());

// --- interaction: Sunset view --------------------------------------------

await page.locator("a", { hasText: /^Sunset view/ }).first().click();
await page.waitForFunction(
  () =>
    [...document.querySelectorAll("[data-refine-grid] > [data-refine]")].filter(
      (el) => getComputedStyle(el).display !== "none"
    ).length === 2,
  null,
  { timeout: 5000 }
).catch(() => {});

vis = await visibleCards(page);
check("Selecting 'Sunset view' narrows to 2 visible cards", vis === 2, `got ${vis}`);

await page.locator("a", { hasText: /^Any$/ }).first().click();
await page.waitForFunction(
  () =>
    [...document.querySelectorAll("[data-refine-grid] > [data-refine]")].filter(
      (el) => getComputedStyle(el).display !== "none"
    ).length === 9,
  null,
  { timeout: 5000 }
).catch(() => {});
vis = await visibleCards(page);
check("Clearing 'Sunset view' restores all 9 cards", vis === 9, `got ${vis}`);

// --- accessibility: touch target -----------------------------------------

const box = await page.locator("a", { hasText: /^Special occasion/ }).first().boundingBox();
check(
  "Chip touch target is at least 44px tall",
  box !== null && box.height >= 44,
  box ? `${Math.round(box.height)}px` : "no box"
);

// --- hand-edited query string is inert ------------------------------------

await page.goto(`${BASE}/bali/ubud/date-night?refine=quiet`, { waitUntil: "networkidle" });
vis = await visibleCards(page);
check(
  "Unavailable modifier in the URL cannot empty the page (shows all 9)",
  vis === 9,
  `got ${vis}`
);

await page.goto(`${BASE}/bali/ubud/date-night?refine=nonsense`, { waitUntil: "networkidle" });
vis = await visibleCards(page);
check("Unknown modifier in the URL is ignored (shows all 9)", vis === 9, `got ${vis}`);

// ------------------------------------------------------------ Uluwatu ----

await page.goto(`${BASE}/bali/uluwatu-bukit/date-night`, { waitUntil: "networkidle" });

check("Uluwatu offers 'Quiet'", await chipExists(page, "Quiet"));
const qCount = await chipCount(page, "Quiet");
check("'Quiet' count is 7", qCount === 7, `got ${qCount}`);

const uluTotal = await allCards(page);
check("Uluwatu renders 7 venue cards", uluTotal === 7, `got ${uluTotal}`);

await page.locator("a", { hasText: /^Quiet/ }).first().click();
await page.waitForFunction(
  () =>
    [...document.querySelectorAll("[data-refine-grid] > [data-refine]")].filter(
      (el) => getComputedStyle(el).display !== "none"
    ).length === 7,
  null,
  { timeout: 5000 }
).catch(() => {});

vis = await visibleCards(page);
check("Selecting 'Quiet' keeps all 7 matching cards visible", vis === 7, `got ${vis}`);
check("URL carries ?refine=quiet", page.url().includes("refine=quiet"), page.url());

await page.locator("a", { hasText: /^Any$/ }).first().click();
await page.waitForFunction(
  () =>
    [...document.querySelectorAll("[data-refine-grid] > [data-refine]")].filter(
      (el) => getComputedStyle(el).display !== "none"
    ).length === 7,
  null,
  { timeout: 5000 }
).catch(() => {});
vis = await visibleCards(page);
check("Clearing 'Quiet' restores all 7 cards", vis === 7, `got ${vis}`);

// -------------------------------------------------- errors and hydration --

const hydration = [...consoleErrors, ...pageErrors].filter((t) =>
  /hydrat|did not match|server HTML/i.test(t)
);

check("No page errors (Playwright pageerror count is 0)", pageErrors.length === 0,
  pageErrors.slice(0, 3).join(" | "));
check("No blocking console errors", consoleErrors.length === 0,
  consoleErrors.slice(0, 3).join(" | "));
check("No hydration mismatch reported", hydration.length === 0,
  hydration.slice(0, 2).join(" | "));

await browser.close();

console.log(`\n${results.length - failures}/${results.length} checks passed`);
process.exit(failures === 0 ? 0 : 1);
