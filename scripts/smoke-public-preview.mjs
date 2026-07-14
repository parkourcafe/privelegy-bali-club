#!/usr/bin/env node

import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

const baseUrl = new URL(process.argv[2] ?? "http://127.0.0.1:3000");
assert.ok(["http:", "https:"].includes(baseUrl.protocol), "Preview URL must use HTTP(S)");

const executablePath = process.env.CHROME_PATH
  ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await puppeteer.launch({ executablePath, headless: true });
const results = [];

async function inspect(path, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  const response = await page.goto(new URL(path, baseUrl), {
    waitUntil: "networkidle2",
    timeout: 30_000,
  });
  assert.ok([200, 304].includes(response?.status()), `${path} must return 200 or 304`);
  const surface = await page.evaluate(() => ({
    title: document.title,
    main: Boolean(document.querySelector("main")),
    width: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
    internalReviewCopy: document.body.innerText.includes("Internal review"),
  }));
  assert.ok(surface.title, `${path} must have a title`);
  assert.ok(surface.main, `${path} must render a main landmark`);
  assert.ok(surface.width <= surface.viewport + 1, `${path} must not overflow horizontally`);
  assert.equal(surface.internalReviewCopy, false, `${path} must not expose internal review copy`);
  assert.deepEqual(pageErrors, [], `${path} must not raise browser exceptions`);
  results.push({ path, viewport: viewport.width, status: response?.status(), width: surface.width });
  await page.close();
}

try {
  for (const viewport of [
    { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    { width: 1440, height: 1000, deviceScaleFactor: 1 },
  ]) {
    for (const path of ["/", "/places", "/bali"]) {
      await inspect(path, viewport);
    }
  }

  const routePage = await browser.newPage();
  for (const path of [
    "/bali/reddit-recommendations",
    "/bali/where-to-stay",
    "/uluwatu",
    "/places/nonexistent-release-audit",
  ]) {
    const response = await routePage.goto(new URL(path, baseUrl), { waitUntil: "domcontentloaded" });
    assert.equal(response?.status(), 404, `${path} must remain unavailable`);
    results.push({ path, status: 404 });
  }
  await routePage.close();

  console.log(JSON.stringify({ ok: true, baseUrl: baseUrl.origin, results }, null, 2));
} finally {
  await browser.close();
}
