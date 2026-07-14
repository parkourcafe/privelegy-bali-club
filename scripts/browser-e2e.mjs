#!/usr/bin/env node

import { constants as fsConstants } from "node:fs";
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import axe from "axe-core";
import puppeteer from "puppeteer-core";

const baseInput = process.env.BASE_URL;
if (!baseInput) {
  console.error("BASE_URL is required (for example http://127.0.0.1:3108)");
  process.exit(2);
}

const base = new URL(baseInput);
if (!/^https?:$/.test(base.protocol) || base.username || base.password) {
  console.error("BASE_URL must be an HTTP(S) origin without credentials");
  process.exit(2);
}
base.pathname = "/";
base.search = "";
base.hash = "";

const artifactDirectory = path.resolve(
  process.env.ARTIFACT_DIR ?? "artifacts/browser-e2e",
);
const expectedVenuePath = normalizedOptionalPath(process.env.E2E_VENUE_PATH);
const expectedRoutePath = normalizedOptionalPath(process.env.E2E_ROUTE_PATH);
const requireDataBackedFlows = process.env.E2E_REQUIRE_DATA === "1";
const browserCookieNames = {
  consent: "__Host-ob_consent",
  guest: "__Host-bp_guest",
  guestProof: "__Host-bp_guest_proof",
};
const checks = [];
const failures = [];
const browserSignals = {
  consoleErrors: [],
  expectedConsoleErrors: [],
  pageErrors: [],
  failedRequests: [],
  expectedHttpErrorResponses: [],
  unexpectedHttpErrorResponses: [],
  expectedAbortedPrefetches: [],
  consentedAnalyticsRequests: [],
  automaticAnalyticsRequests: [],
  externalAnalyticsRequests: [],
};
const observedConsoleErrors = [];
const evidence = {
  visited: [],
  accessibility: [],
  axe: [],
  consentResponses: [],
  generatedPlannerHref: null,
  reducedMotion: null,
  dataBackedMode: requireDataBackedFlows,
};
const startedAt = new Date().toISOString();
let browser;
let activePage;

function normalizedOptionalPath(value) {
  if (!value) return null;
  const candidate = value.trim();
  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    throw new Error("E2E venue/route paths must be same-origin absolute paths");
  }
  return candidate;
}

function record(name, pass, detail = undefined) {
  const entry = { name, pass: Boolean(pass) };
  if (detail !== undefined) entry.detail = detail;
  checks.push(entry);
  if (!pass) failures.push(detail ? `${name}: ${detail}` : name);
}

async function executablePath() {
  const candidates = [
    process.env.BROWSER_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/snap/bin/chromium",
  ].filter(Boolean);
  for (const candidate of candidates) {
    try {
      await access(candidate, fsConstants.X_OK);
      return candidate;
    } catch {}
  }
  throw new Error(
    "No Chrome/Chromium executable found. Set BROWSER_PATH; puppeteer-core does not download a browser.",
  );
}

async function waitForServer(timeoutMs = 45_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError = "not attempted";
  while (Date.now() < deadline) {
    try {
      const response = await fetch(new URL("/api/health/live", base), {
        redirect: "manual",
        signal: AbortSignal.timeout(2_000),
      });
      if (response.status < 500) return;
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Production server did not become ready: ${lastError}`);
}

function sameOriginPath(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return url.origin === base.origin ? `${url.pathname}${url.search}` : null;
  } catch {
    return null;
  }
}

function isExternalAnalyticsUrl(rawUrl) {
  try {
    const host = new URL(rawUrl).hostname.toLowerCase();
    return [
      "googletagmanager.com",
      "google-analytics.com",
      "analytics.google.com",
      "doubleclick.net",
    ].some((domain) => host === domain || host.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

function watchPage(page) {
  let explicitAnalyticsProbe = false;
  let consentedAnalyticsPhase = false;
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const location = message.location();
    observedConsoleErrors.push({
      text: message.text(),
      url: location.url || null,
      lineNumber: location.lineNumber ?? null,
      columnNumber: location.columnNumber ?? null,
    });
  });
  page.on("pageerror", (error) => {
    browserSignals.pageErrors.push(error.message);
  });
  page.on("requestfailed", (request) => {
    const failure = {
      method: request.method(),
      path: sameOriginPath(request.url()) ?? request.url(),
      reason: request.failure()?.errorText ?? "unknown",
    };
    const url = new URL(request.url());
    if (
      failure.method === "GET"
      && failure.reason === "net::ERR_ABORTED"
      && url.origin === base.origin
      && url.searchParams.has("_rsc")
    ) {
      // Next.js cancels speculative RSC prefetches when a full browser
      // navigation supersedes them. Keep that evidence, but do not confuse a
      // deliberate cancellation with a network outage.
      browserSignals.expectedAbortedPrefetches.push(failure);
      return;
    }
    browserSignals.failedRequests.push(failure);
  });
  page.on("response", (response) => {
    const status = response.status();
    if (status < 400) return;

    const request = response.request();
    const responseSignal = {
      status,
      method: request.method(),
      path: sameOriginPath(response.url()) ?? response.url(),
      resourceType: request.resourceType(),
    };
    const url = new URL(response.url());
    const expectedMissingVenue = status === 404
      && request.method() === "GET"
      && url.origin === base.origin
      && url.pathname === "/places/other-bali-browser-e2e-missing";
    const expectedUnavailableConsentedAnalytics = status === 503
      && request.method() === "POST"
      && (url.pathname === "/api/event" || url.pathname === "/api/source")
      && consentedAnalyticsPhase;
    const expectedUnavailableConsentFoundation = status === 503
      && request.method() === "POST"
      && !requireDataBackedFlows
      && (url.pathname === "/api/privacy/consent" || url.pathname === "/api/guest/bootstrap");
    const expectedRejectedAnalyticsProbe = status === 403
      && request.method() === "POST"
      && url.pathname === "/api/event"
      && explicitAnalyticsProbe;

    if (
      expectedMissingVenue
      || expectedUnavailableConsentedAnalytics
      || expectedUnavailableConsentFoundation
      || expectedRejectedAnalyticsProbe
    ) {
      browserSignals.expectedHttpErrorResponses.push(responseSignal);
      return;
    }
    browserSignals.unexpectedHttpErrorResponses.push(responseSignal);
  });
  page.on("request", (request) => {
    if (isExternalAnalyticsUrl(request.url())) {
      browserSignals.externalAnalyticsRequests.push({
        method: request.method(),
        url: request.url(),
      });
    }
    const pathName = sameOriginPath(request.url());
    if (pathName === "/api/event" || pathName === "/api/source") {
      const signal = {
        method: request.method(),
        path: pathName,
      };
      if (explicitAnalyticsProbe) return;
      if (consentedAnalyticsPhase) browserSignals.consentedAnalyticsRequests.push(signal);
      else browserSignals.automaticAnalyticsRequests.push(signal);
    }
  });
  return {
    beginConsentedAnalyticsPhase() {
      consentedAnalyticsPhase = true;
    },
    endConsentedAnalyticsPhase() {
      consentedAnalyticsPhase = false;
    },
    beginExplicitAnalyticsProbe() {
      consentedAnalyticsPhase = false;
      explicitAnalyticsProbe = true;
    },
    endExplicitAnalyticsProbe() {
      explicitAnalyticsProbe = false;
    },
  };
}

function classifyConsoleErrors() {
  for (const signal of observedConsoleErrors) {
    const statusMatch = signal.text.match(
      /^Failed to load resource: the server responded with a status of (\d{3})\b/,
    );
    const pathName = signal.url ? sameOriginPath(signal.url) : null;
    const expected = statusMatch && pathName
      ? browserSignals.expectedHttpErrorResponses.some((response) => (
          response.status === Number(statusMatch[1]) && response.path === pathName
        ))
      : false;
    if (expected) browserSignals.expectedConsoleErrors.push(signal);
    else browserSignals.consoleErrors.push(signal);
  }
}

async function goto(page, route, expectedStatus = 200) {
  const response = await page.goto(new URL(route, base).href, {
    waitUntil: ["domcontentloaded", "networkidle2"],
    timeout: 30_000,
  });
  const status = response?.status() ?? 0;
  evidence.visited.push({ route, status, finalUrl: page.url() });
  const accepted = status === expectedStatus || (expectedStatus === 200 && status === 304);
  record(
    `${route} returns ${expectedStatus}`,
    accepted,
    status === 304 ? "browser cache revalidated with 304" : `received ${status}`,
  );
  return response;
}

async function findByText(page, selector, text) {
  const handles = await page.$$(selector);
  for (const handle of handles) {
    const label = await handle.evaluate((element) => element.textContent?.replace(/\s+/g, " ").trim() ?? "");
    if (label.includes(text)) return handle;
    await handle.dispose();
  }
  return null;
}

async function cookiesByName(page) {
  const cookies = await page.browserContext().cookies();
  return Object.fromEntries(cookies.map((cookie) => [cookie.name, cookie.value]));
}

function cookieEvidence(cookies) {
  return JSON.stringify({
    names: Object.keys(cookies).sort(),
    consent: cookies[browserCookieNames.consent] ?? null,
    legacyConsent: cookies.ob_consent === "essential_only"
      ? "essential_only"
      : cookies.ob_consent
        ? "present_untrusted"
        : null,
  });
}

async function accessibilityAudit(page, label, {
  requireSkipLink = true,
  touchTargetSelector = "button, [role='button']",
} = {}) {
  const dom = await page.evaluate(({ requireSkipLink, touchTargetSelector }) => {
    const visible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none"
        && style.visibility !== "hidden"
        && Number(style.opacity) > 0
        && rect.width > 0
        && rect.height > 0;
    };
    const violations = [];
    const lang = document.documentElement.lang.trim().toLowerCase();
    if (lang !== "en") violations.push(`document language is ${lang || "missing"}`);

    const mains = [...document.querySelectorAll("main")].filter(visible);
    if (mains.length !== 1) violations.push(`expected one visible main landmark, found ${mains.length}`);
    const h1s = [...document.querySelectorAll("h1")].filter(visible);
    if (h1s.length !== 1 || !(h1s[0]?.textContent ?? "").trim()) {
      violations.push(`expected one non-empty visible H1, found ${h1s.length}`);
    }

    const ids = new Map();
    for (const element of document.querySelectorAll("[id]")) {
      const id = element.id;
      ids.set(id, (ids.get(id) ?? 0) + 1);
    }
    const duplicateIds = [...ids].filter(([, count]) => count > 1).map(([id]) => id);
    if (duplicateIds.length) violations.push(`duplicate ids: ${duplicateIds.join(", ")}`);

    const imagesWithoutAlt = [...document.querySelectorAll("img")]
      .filter((image) => !image.hasAttribute("alt"))
      .map((image) => image.getAttribute("src") ?? "inline image");
    if (imagesWithoutAlt.length) {
      violations.push(`images without alt: ${imagesWithoutAlt.slice(0, 5).join(", ")}`);
    }

    const positiveTabIndex = [...document.querySelectorAll("[tabindex]")]
      .filter((element) => Number(element.getAttribute("tabindex")) > 0);
    if (positiveTabIndex.length) violations.push(`positive tabindex count: ${positiveTabIndex.length}`);

    const unsafeBlankTargets = [...document.querySelectorAll("a[target='_blank']")]
      .filter((anchor) => {
        const rel = new Set((anchor.getAttribute("rel") ?? "").toLowerCase().split(/\s+/));
        return !rel.has("noopener") && !rel.has("noreferrer");
      });
    if (unsafeBlankTargets.length) {
      violations.push(`target=_blank links without noopener/noreferrer: ${unsafeBlankTargets.length}`);
    }

    const headingLevels = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")]
      .filter(visible)
      .map((heading) => Number(heading.tagName.slice(1)));
    for (let index = 1; index < headingLevels.length; index += 1) {
      if (headingLevels[index] - headingLevels[index - 1] > 1) {
        violations.push(`heading level jumps from H${headingLevels[index - 1]} to H${headingLevels[index]}`);
        break;
      }
    }

    for (const fieldset of document.querySelectorAll("fieldset")) {
      if (!fieldset.querySelector(":scope > legend")) violations.push("fieldset without legend");
    }
    for (const toggle of document.querySelectorAll("[aria-pressed]")) {
      if (!["true", "false"].includes(toggle.getAttribute("aria-pressed") ?? "")) {
        violations.push("aria-pressed must be true or false");
      }
    }

    const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    if (overflow > 1) violations.push(`horizontal overflow: ${overflow}px`);

    const undersizedTargets = [...document.querySelectorAll(touchTargetSelector)]
      .filter(visible)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          label: (element.getAttribute("aria-label") || element.textContent || element.tagName)
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 80),
          width: Math.round(rect.width * 10) / 10,
          height: Math.round(rect.height * 10) / 10,
        };
      })
      .filter(({ width, height }) => width < 44 || height < 44);
    if (undersizedTargets.length) {
      violations.push(`touch targets below 44px: ${JSON.stringify(undersizedTargets.slice(0, 5))}`);
    }

    let skipLink = null;
    const candidates = [...document.querySelectorAll("a[href^='#']")];
    for (const anchor of candidates) {
      const text = (anchor.textContent ?? "").trim().toLowerCase();
      if (text.includes("skip") || anchor.hasAttribute("data-skip-link")) {
        const href = anchor.getAttribute("href") ?? "";
        const id = href.slice(1);
        const target = id ? document.getElementById(id) : null;
        skipLink = { href, hasTarget: Boolean(target), targetContainsMain: Boolean(target?.querySelector("main") || target?.matches("main")) };
        break;
      }
    }
    if (requireSkipLink && !skipLink) violations.push("missing skip link");
    if (requireSkipLink && skipLink && (!skipLink.hasTarget || !skipLink.targetContainsMain)) {
      violations.push(`skip link target is invalid: ${skipLink.href}`);
    }

    return {
      title: document.title,
      lang,
      h1: h1s[0]?.textContent?.replace(/\s+/g, " ").trim() ?? "",
      mainCount: mains.length,
      liveRegionCount: document.querySelectorAll("[aria-live], [role='status'], [role='alert']").length,
      overflow,
      skipLink,
      violations,
    };
  }, { requireSkipLink, touchTargetSelector });

  const session = await page.createCDPSession();
  await session.send("Accessibility.enable");
  const tree = await session.send("Accessibility.getFullAXTree");
  await session.detach();
  const interactiveRoles = new Set([
    "button", "checkbox", "combobox", "link", "listbox", "menuitem",
    "radio", "searchbox", "slider", "spinbutton", "switch", "textbox",
  ]);
  const unnamedInteractive = tree.nodes
    .filter((node) => !node.ignored && interactiveRoles.has(node.role?.value))
    .filter((node) => !(node.name?.value ?? "").trim())
    .map((node) => ({ role: node.role?.value, backendDOMNodeId: node.backendDOMNodeId }));
  if (unnamedInteractive.length) {
    dom.violations.push(`unnamed accessible controls: ${JSON.stringify(unnamedInteractive.slice(0, 5))}`);
  }
  evidence.accessibility.push({
    label,
    url: page.url(),
    axNodeCount: tree.nodes.length,
    ...dom,
  });
  record(`${label} automated accessibility audit`, dom.violations.length === 0, dom.violations.join("; "));
  await axeAudit(page, label);
  return dom;
}

async function axeAudit(page, label) {
  // Inject the exact locked axe runtime into the already-rendered browser
  // document. Running after each material UI state catches issues introduced
  // by hydration and interaction, not only static server HTML.
  await page.evaluate(axe.source);
  const result = await page.evaluate(async () => {
    const axeRuntime = window.axe;
    if (!axeRuntime) throw new Error("axe runtime was not injected");
    return axeRuntime.run(document, {
      resultTypes: ["violations", "incomplete"],
    });
  });
  const compact = (item) => ({
    id: item.id,
    impact: item.impact,
    help: item.help,
    helpUrl: item.helpUrl,
    nodes: item.nodes.slice(0, 10).map((node) => ({
      impact: node.impact,
      target: node.target,
      failureSummary: node.failureSummary,
    })),
  });
  const violations = result.violations.map(compact);
  const incomplete = result.incomplete.map(compact);
  evidence.axe.push({
    label,
    url: page.url(),
    version: axe.version,
    violations,
    incomplete,
  });
  record(
    `${label} axe-core ${axe.version}`,
    violations.length === 0,
    violations.length
      ? violations.map((violation) => `${violation.id} (${violation.impact ?? "unknown"})`).join(", ")
      : `${incomplete.length} incomplete item(s) retained for manual review`,
  );
}

async function assertSkipLinkKeyboard(page, label) {
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    window.scrollTo(0, 0);
  });
  await page.keyboard.press("Tab");
  // The skip link intentionally transitions in over 120ms. Wait for the
  // focused element to reach the viewport before judging its visibility.
  try {
    await page.waitForFunction(() => {
      const element = document.activeElement;
      if (!(element instanceof HTMLElement)) return false;
      const rect = element.getBoundingClientRect();
      return rect.width > 0
        && rect.height > 0
        && rect.top >= 0
        && rect.left >= 0
        && rect.bottom <= innerHeight
        && rect.right <= innerWidth;
    }, { timeout: 1_000 });
  } catch {}
  const focused = await page.evaluate(() => {
    const element = document.activeElement;
    if (!(element instanceof HTMLElement)) return null;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      text: element.textContent?.replace(/\s+/g, " ").trim() ?? "",
      href: element instanceof HTMLAnchorElement ? element.getAttribute("href") : null,
      visible: rect.width > 0
        && rect.height > 0
        && rect.top >= 0
        && rect.left >= 0
        && rect.bottom <= innerHeight
        && rect.right <= innerWidth,
      focusIndicator: style.outlineStyle !== "none"
        || style.boxShadow !== "none"
        || Number.parseFloat(style.borderTopWidth) > 0,
      transform: style.transform,
      rect: { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left },
    };
  });
  const isSkip = Boolean(focused?.href?.startsWith("#") && focused?.text.toLowerCase().includes("skip"));
  record(`${label} skip link is first keyboard stop`, isSkip && focused.visible, JSON.stringify(focused));
  if (!isSkip) return;
  record(`${label} skip link has visible focus`, focused.focusIndicator, JSON.stringify(focused));
  const targetId = focused.href.slice(1);
  await page.keyboard.press("Enter");
  await new Promise((resolve) => setTimeout(resolve, 50));
  const activeId = await page.evaluate(() => document.activeElement?.id ?? "");
  record(`${label} skip link moves focus to content`, activeId === targetId, `focused ${activeId || "nothing"}`);
}

async function corePlannerAndConsent(page) {
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await goto(page, "/");
  await page.waitForSelector("aside[aria-label='Privacy choices']", { visible: true });
  await accessibilityAudit(page, "mobile home with consent", {
    touchTargetSelector: "aside[aria-label='Privacy choices'] button, aside[aria-label='Privacy choices'] a, #day-builder button, #day-builder a",
  });
  await assertSkipLinkKeyboard(page, "mobile home");

  const beforeCookies = await cookiesByName(page);
  record(
    "analytics and functional identity cookies are absent before consent",
    !beforeCookies[browserCookieNames.consent]
      && !beforeCookies[browserCookieNames.guest]
      && !beforeCookies[browserCookieNames.guestProof]
      && !beforeCookies.ob_consent
      && !beforeCookies.bp_guest
      && !beforeCookies.bp_guest_proof,
    cookieEvidence(beforeCookies),
  );

  const essentialButton = await findByText(
    page,
    "aside[aria-label='Privacy choices'] button",
    "Essential only",
  );
  record("consent banner exposes Essential only", Boolean(essentialButton));
  if (essentialButton) {
    const responsePromise = page.waitForResponse((response) => (
      new URL(response.url()).pathname === "/api/privacy/consent"
      && response.request().method() === "POST"
    ));
    await essentialButton.click();
    const response = await responsePromise;
    evidence.consentResponses.push({ action: "essential_only", status: response.status() });
    record("Essential only consent is saved", response.status() === 200, `HTTP ${response.status()}`);
    await page.waitForSelector("aside[aria-label='Privacy choices']", { hidden: true });
  }
  const rejectedCookies = await cookiesByName(page);
  record("Essential only cookie is active", rejectedCookies[browserCookieNames.consent] === "essential_only", cookieEvidence(rejectedCookies));
  record(
    "Essential only does not mint a functional GuestRef",
    !rejectedCookies[browserCookieNames.guest]
      && !rejectedCookies[browserCookieNames.guestProof]
      && !rejectedCookies.bp_guest
      && !rejectedCookies.bp_guest_proof,
    cookieEvidence(rejectedCookies),
  );

  const firstMission = await page.$("#day-builder fieldset:first-of-type button");
  record("planner exposes a mission toggle", Boolean(firstMission));
  if (firstMission) {
    record("planner toggle starts unpressed", await firstMission.evaluate((button) => button.getAttribute("aria-pressed") === "false"));
    await firstMission.click();
    await page.waitForFunction(() => document.querySelector("#day-builder fieldset:first-of-type button")?.getAttribute("aria-pressed") === "true");
    record("planner toggle updates aria-pressed", await firstMission.evaluate((button) => button.getAttribute("aria-pressed") === "true"));
  }
  const liveBrief = await page.$eval("#day-builder [aria-live='polite']", (element) => element.textContent?.replace(/\s+/g, " ").trim() ?? "");
  record("planner announces the changed brief", liveBrief.toLowerCase().includes("first time"), liveBrief);

  const plannerLink = await findByText(page, "#day-builder a", "Show my top 3");
  record("planner exposes shortlist navigation", Boolean(plannerLink));
  if (plannerLink) {
    const href = await plannerLink.evaluate((anchor) => anchor.getAttribute("href") ?? "");
    evidence.generatedPlannerHref = href;
    const generated = new URL(href, base);
    record("planner query contains the explicit mission", generated.searchParams.get("m") === "first-time", href);
    record("planner query contains no hidden district", !generated.searchParams.has("district"), href);
    record("planner query contains no hidden duration", !generated.searchParams.has("dur"), href);
    await goto(page, `${generated.pathname}${generated.search}`);
    record("planner query survives navigation", page.url().includes("m=first-time"), page.url());
    const h1 = await page.$eval("h1", (element) => element.textContent?.trim() ?? "");
    record("planner destination has a descriptive H1", h1 === "Places across Bali", h1);
    const emptyState = await page.evaluate(() => document.body.innerText.includes("Nothing matches that combo yet"));
    const hasDetails = await page.$("a[href^='/places/']:not([href='/places/'])");
    record("production catalogue renders data or a controlled empty state", Boolean(hasDetails) || emptyState, hasDetails ? "venue links present" : "controlled empty state");
    await accessibilityAudit(page, "mobile planner destination", {
      touchTargetSelector: ".filter-panel button, .criteria-row button, .place-card a",
    });
  }

  record("rejecting analytics prevents automatic event/source requests", browserSignals.automaticAnalyticsRequests.length === 0, JSON.stringify(browserSignals.automaticAnalyticsRequests));
  await goto(page, "/places/other-bali-browser-e2e-missing", 404);
  await accessibilityAudit(page, "unknown venue 404", {
    touchTargetSelector: "main a, main button",
  });
}

async function privacyChoices(page, watcher) {
  await goto(page, "/privacy/choices");
  await page.waitForFunction(() => document.body.innerText.includes("Current choice: Essential only"));
  const analyticsSwitch = await page.$("button[role='switch']");
  record("privacy choices exposes an accessible analytics switch", Boolean(analyticsSwitch));
  let analyticsAllowed = false;
  if (analyticsSwitch) {
    record("analytics switch starts off", await analyticsSwitch.evaluate((button) => button.getAttribute("aria-checked") === "false"));
    const actionResponses = [];
    const captureResponse = (response) => {
      const pathname = new URL(response.url()).pathname;
      if (
        response.request().method() === "POST"
        && (pathname === "/api/guest/bootstrap" || pathname === "/api/privacy/consent")
      ) {
        actionResponses.push({ pathname, status: response.status() });
      }
    };
    page.on("response", captureResponse);
    watcher.beginConsentedAnalyticsPhase();
    await analyticsSwitch.click();
    await page.waitForFunction(() => (
      document.body.innerText.includes("Current choice: Allowed")
      || document.body.innerText.includes("Could not save your choice")
    ));
    page.off("response", captureResponse);
    analyticsAllowed = await analyticsSwitch.evaluate((button) => button.getAttribute("aria-checked") === "true");
    evidence.consentResponses.push({ action: "analytics_allowed", responses: actionResponses });

    if (requireDataBackedFlows) {
      record(
        "configured analytics grant writes bootstrap and consent successfully",
        analyticsAllowed
          && actionResponses.some(({ pathname, status }) => pathname === "/api/guest/bootstrap" && status === 200)
          && actionResponses.some(({ pathname, status }) => pathname === "/api/privacy/consent" && status === 200),
        JSON.stringify(actionResponses),
      );
      const allowedCookies = await cookiesByName(page);
      record(
        "configured analytics grant mints an authenticated functional GuestRef",
        Boolean(
          allowedCookies[browserCookieNames.guest]
          && allowedCookies[browserCookieNames.guestProof],
        )
          && allowedCookies[browserCookieNames.consent] === "analytics_allowed",
        cookieEvidence(allowedCookies),
      );
      const persistedStatus = await page.evaluate(async () => {
        const response = await fetch("/api/event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "landing_open" }),
        });
        return response.status;
      });
      record("configured analytics grant persists a consented event", persistedStatus === 200, `HTTP ${persistedStatus}`);
    } else {
      record(
        "analytics opt-in fails closed without the configured identity/data backend",
        !analyticsAllowed,
        JSON.stringify(actionResponses),
      );
    }
    watcher.endConsentedAnalyticsPhase();

    if (analyticsAllowed) {
      await page.setCookie({ name: "_ga", value: "GA1.1.e2e", url: base.origin });
      const responsePromise = page.waitForResponse((response) => (
        new URL(response.url()).pathname === "/api/privacy/consent"
        && response.request().method() === "POST"
      ));
      await analyticsSwitch.click();
      const response = await responsePromise;
      evidence.consentResponses.push({ action: "withdraw", status: response.status() });
      record("analytics withdrawal is saved", response.status() === 200, `HTTP ${response.status()}`);
      await page.waitForFunction(() => document.body.innerText.includes("Choice saved."));
      record("analytics switch reflects withdrawal", await analyticsSwitch.evaluate((button) => button.getAttribute("aria-checked") === "false"));
    }
  }
  const withdrawnCookies = await cookiesByName(page);
  record("withdrawal sets Essential only", withdrawnCookies[browserCookieNames.consent] === "essential_only", cookieEvidence(withdrawnCookies));
  record("withdrawal removes known analytics cookies", !withdrawnCookies._ga, cookieEvidence(withdrawnCookies));

  watcher.beginExplicitAnalyticsProbe();
  const blockedEventStatus = await page.evaluate(async () => {
    const response = await fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "landing_open" }),
    });
    return response.status;
  });
  watcher.endExplicitAnalyticsProbe();
  record("server rejects analytics events after withdrawal", blockedEventStatus === 403, `HTTP ${blockedEventStatus}`);

  const deleteButton = await findByText(page, "button", "Delete my Other Bali data");
  record("privacy choices exposes deletion", Boolean(deleteButton));
  if (deleteButton) {
    await deleteButton.click();
    const confirmButton = await findByText(page, "button", "Yes, permanently delete");
    record("deletion requires explicit confirmation", Boolean(confirmButton));
    if (confirmButton) {
      const responsePromise = page.waitForResponse((response) => (
        new URL(response.url()).pathname === "/api/privacy/delete"
        && response.request().method() === "POST"
      ));
      await confirmButton.click();
      const response = await responsePromise;
      record("deletion is idempotently confirmed", response.status() === 200, `HTTP ${response.status()}`);
      await page.waitForFunction(() => document.body.innerText.includes("Deletion confirmed"));
      const deletedCookies = await cookiesByName(page);
      record(
        "deletion clears functional identity and analytics cookies",
        !deletedCookies[browserCookieNames.guest]
          && !deletedCookies[browserCookieNames.guestProof]
          && !deletedCookies._ga
          && deletedCookies[browserCookieNames.consent] === "essential_only",
        cookieEvidence(deletedCookies),
      );
    }
  }
  await accessibilityAudit(page, "privacy choices after withdrawal", {
    touchTargetSelector: "main button, main a",
  });
}

async function reducedMotionAudit(context) {
  const page = await context.newPage();
  watchPage(page);
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.setCookie({
    name: browserCookieNames.consent,
    value: "essential_only",
    url: base.origin,
    secure: true,
    path: "/",
  });
  await goto(page, "/");
  const motion = await page.evaluate(() => {
    const milliseconds = (value) => value.split(",").reduce((maximum, part) => {
      const unit = part.trim();
      const number = Number.parseFloat(unit) || 0;
      return Math.max(maximum, unit.endsWith("ms") ? number : number * 1000);
    }, 0);
    const offenders = [...document.querySelectorAll("[class*='ob-']")]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      })
      .map((element) => {
        const style = getComputedStyle(element);
        return {
          tag: element.tagName,
          classes: element.className.toString().slice(0, 120),
          animationMs: style.animationName === "none" ? 0 : milliseconds(style.animationDuration),
          transitionMs: style.transitionProperty === "none" ? 0 : milliseconds(style.transitionDuration),
        };
      })
      .filter(({ animationMs, transitionMs }) => animationMs > 10 || transitionMs > 10);
    const activeVideo = [...document.querySelectorAll("video")]
      .some((video) => Boolean(video.currentSrc || video.getAttribute("src")) && !video.paused);
    return { offenders: offenders.slice(0, 10), activeVideo };
  });
  evidence.reducedMotion = motion;
  record("reduced-motion disables meaningful landing animation", motion.offenders.length === 0, JSON.stringify(motion.offenders));
  record("reduced-motion prevents autoplay video", !motion.activeVideo);
  await page.close();
}

async function dataBackedFlows(page) {
  if (requireDataBackedFlows) {
    record("data-backed E2E has an explicit venue path", Boolean(expectedVenuePath));
    record("data-backed E2E has an explicit route path", Boolean(expectedRoutePath));
  }
  if (expectedVenuePath) {
    await goto(page, expectedVenuePath);
    const directions = await findByText(page, "a", "Google Maps")
      ?? await findByText(page, "a", "Directions");
    record("published venue exposes a directions handoff", Boolean(directions));
    const reportForm = await page.evaluate(() => {
      const heading = [...document.querySelectorAll("h2")]
        .find((element) => element.textContent?.trim() === "Report incorrect information");
      const section = heading?.closest("section");
      return {
        present: Boolean(section?.querySelector("form")),
        optionCount: section?.querySelectorAll("select option").length ?? 0,
      };
    });
    record(
      "published venue exposes the bounded six-reason incorrect-info report",
      reportForm.present && reportForm.optionCount === 6,
      JSON.stringify(reportForm),
    );
    await accessibilityAudit(page, "published venue detail", {
      touchTargetSelector: "main button, main a",
    });
  }
  if (expectedRoutePath) {
    await goto(page, expectedRoutePath);
    const venueDetail = await page.$("a[href^='/places/']");
    record("published route links to a venue detail", Boolean(venueDetail));
    const shareButton = await findByText(page, "button", "Share route");
    record("published route exposes share", Boolean(shareButton));
    if (shareButton) {
      await shareButton.click();
      await page.waitForFunction(() => (
        document.body.innerText.includes("Route shared")
        || document.body.innerText.includes("Route link copied")
        || document.body.innerText.includes("Automatic sharing is unavailable")
      ));
      const shareState = await page.evaluate(() => ({
        copied: document.body.innerText.includes("Route link copied"),
        shared: document.body.innerText.includes("Route shared"),
        manual: Boolean(document.querySelector(".route-copy-field input[readonly]")),
      }));
      record(
        "route share reaches a visible device, clipboard or manual fallback",
        shareState.copied || shareState.shared || shareState.manual,
        JSON.stringify(shareState),
      );
    }
    await accessibilityAudit(page, "published route detail", {
      touchTargetSelector: "main button, main a",
    });
  }
  if (requireDataBackedFlows || expectedVenuePath || expectedRoutePath) {
    await filterHistoryFlow(page);
  }
}

async function filterHistoryFlow(page) {
  await goto(page, "/places");
  const filter = await page.$(".chip-row button");
  record(
    "data-backed catalogue exposes a history-aware filter",
    Boolean(filter) || !requireDataBackedFlows,
    filter ? "filter found" : "no fixture/database filter options",
  );
  if (!filter) return;

  const label = await filter.evaluate((button) => button.textContent?.trim() ?? "");
  await filter.click();
  await page.waitForFunction(
    (expected) => [...document.querySelectorAll(".chip-row button")]
      .some((button) => button.textContent?.trim() === expected && button.getAttribute("aria-pressed") === "true"),
    {},
    label,
  );
  const selectedUrl = page.url();
  record("filter selection is reflected in the URL", new URL(selectedUrl).search.length > 1, selectedUrl);

  const selectedFilter = await findByText(page, ".chip-row button", label);
  await selectedFilter?.click();
  await page.waitForFunction(
    (expected) => [...document.querySelectorAll(".chip-row button")]
      .some((button) => button.textContent?.trim() === expected && button.getAttribute("aria-pressed") === "false"),
    {},
    label,
  );
  const clearedUrl = page.url();
  record("clearing a filter updates browser history", clearedUrl !== selectedUrl, `${selectedUrl} -> ${clearedUrl}`);

  await page.evaluate(() => history.back());
  await page.waitForFunction((expected) => location.href === expected, {}, selectedUrl);
  const restoredBack = await page.evaluate((expected) => [...document.querySelectorAll(".chip-row button")]
    .some((button) => button.textContent?.trim() === expected && button.getAttribute("aria-pressed") === "true"), label);
  record("Back restores the selected filter state", restoredBack, page.url());

  await page.evaluate(() => history.forward());
  await page.waitForFunction((expected) => location.href === expected, {}, clearedUrl);
  const restoredForward = await page.evaluate((expected) => [...document.querySelectorAll(".chip-row button")]
    .some((button) => button.textContent?.trim() === expected && button.getAttribute("aria-pressed") === "false"), label);
  record("Forward restores the cleared filter state", restoredForward, page.url());
}

async function saveReport(browserVersion = null) {
  await mkdir(artifactDirectory, { recursive: true });
  const report = {
    schemaVersion: 1,
    baseUrl: base.origin,
    startedAt,
    finishedAt: new Date().toISOString(),
    browserVersion,
    summary: {
      passed: checks.filter((check) => check.pass).length,
      failed: checks.filter((check) => !check.pass).length,
    },
    checks,
    evidence,
    browserSignals,
    failures,
    coverageBoundary: {
      automated: [
        "real Chromium against a production Next.js server",
        `axe-core ${axe.version} violations after rendered interaction states`,
        "mobile home and planner query flow",
        "consent rejection, configured grant persistence, withdrawal enforcement and authenticated delete",
        "unknown venue 404",
        "accessibility tree names, landmarks, headings, skip link, target size, overflow and reduced motion",
      ],
      requiresConfiguredData: [
        "published venue detail, stored Maps handoff and bounded report options",
        "published route detail, venue navigation and share fallback",
        "consented analytics persistence",
        "deletion of an existing server-side guest record",
      ],
      notClaimed: [
        "full WCAG conformance",
        "screen-reader manual QA",
        "Safari, mobile Safari or mobile Chrome device QA",
        "visual contrast and 200% browser zoom review",
        "route-save mutation and shared-list creation against a disposable staging dataset",
        "launching or sending the incorrect-info email",
      ],
    },
  };
  const reportPath = path.join(artifactDirectory, "browser-e2e-report.json");
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(report, null, 2));
  return reportPath;
}

let browserVersion = null;
try {
  await waitForServer();
  const chromePath = await executablePath();
  browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: process.env.CI === "true"
      ? ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
      : [],
  });
  browserVersion = await browser.version();
  const context = await browser.createBrowserContext();
  activePage = await context.newPage();
  const watcher = watchPage(activePage);
  await corePlannerAndConsent(activePage);
  await privacyChoices(activePage, watcher);
  await reducedMotionAudit(context);
  await dataBackedFlows(activePage);

  record(
    "browser emits no automatic analytics outside the allowed-consent phase",
    browserSignals.automaticAnalyticsRequests.length === 0,
    JSON.stringify(browserSignals.automaticAnalyticsRequests),
  );
  record(
    "browser makes no Google Analytics, Tag Manager or DoubleClick requests",
    browserSignals.externalAnalyticsRequests.length === 0,
    JSON.stringify(browserSignals.externalAnalyticsRequests),
  );
  classifyConsoleErrors();
  record("browser has no console errors", browserSignals.consoleErrors.length === 0, JSON.stringify(browserSignals.consoleErrors));
  record("browser has no uncaught page errors", browserSignals.pageErrors.length === 0, JSON.stringify(browserSignals.pageErrors));
  record("browser has no failed requests", browserSignals.failedRequests.length === 0, JSON.stringify(browserSignals.failedRequests));
  record(
    "browser has no unexpected HTTP error responses",
    browserSignals.unexpectedHttpErrorResponses.length === 0,
    JSON.stringify(browserSignals.unexpectedHttpErrorResponses),
  );
  await context.close();
} catch (error) {
  failures.push(error instanceof Error ? error.stack ?? error.message : String(error));
  checks.push({ name: "browser E2E harness completed", pass: false, detail: failures.at(-1) });
  if (activePage) {
    try {
      await mkdir(artifactDirectory, { recursive: true });
      await activePage.screenshot({
        path: path.join(artifactDirectory, "browser-e2e-failure.png"),
        fullPage: true,
      });
    } catch {}
  }
} finally {
  if (browser) await browser.close();
}

await saveReport(browserVersion);
if (failures.length) process.exit(1);
