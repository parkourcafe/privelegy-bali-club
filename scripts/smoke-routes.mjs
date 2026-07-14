#!/usr/bin/env node

import {
  fetchWithSameOriginRedirects,
  parseAllowedPreviewHosts,
  protectionBypassForTarget,
} from "./preview-target-policy.mjs";

const baseInput = process.env.BASE_URL ?? process.argv.find((arg) => arg.startsWith("http"));
if (!baseInput) {
  console.error("BASE_URL is required (for example https://preview.example.test)");
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

const coreRoutes = [
  "/",
  "/places",
  "/plan",
  "/bali",
  "/guides",
  "/privacy",
  "/privacy/choices",
  "/terms",
  "/support",
  "/api/health/live",
  "/api/health/ready",
  "/api/mobile/v1/config",
  "/api/mobile/v1/bootstrap",
];
const failures = [];
const visited = new Map();
const configuredHosts = parseAllowedPreviewHosts(process.env.PREVIEW_ALLOWED_HOSTS);
const configuredProtectionBypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const protectionBypass = protectionBypassForTarget({
  secret: configuredProtectionBypass,
  hostname: base.hostname,
  allowedHosts: configuredHosts,
});
if (configuredProtectionBypass && !protectionBypass) {
  console.warn("Protection bypass withheld: target is not trusted for secret-bearing requests");
}

function textMatch(html, pattern) {
  return pattern.test(html.replace(/\s+/g, " "));
}

function internalLinks(html) {
  const links = new Set();
  for (const match of html.matchAll(/href=["']([^"'#]+)["']/gi)) {
    try {
      const url = new URL(match[1], base);
      if (url.origin === base.origin && !url.pathname.startsWith("/_next/")) {
        links.add(`${url.pathname}${url.search}`);
      }
    } catch {}
  }
  return [...links];
}

async function fetchRoute(path, { requireH1 = false } = {}) {
  if (visited.has(path)) return visited.get(path);
  const url = new URL(path, base);
  let result;
  try {
    const response = await fetchWithSameOriginRedirects(url, {
      headers: {
        "user-agent": "OtherBaliLaunchSmoke/1.0",
        ...(protectionBypass
          ? { "x-vercel-protection-bypass": protectionBypass }
          : {}),
      },
      signal: AbortSignal.timeout(15_000),
    });
    const body = await response.text();
    result = {
      path,
      status: response.status,
      body,
      finalUrl: response.url,
      contentType: response.headers.get("content-type") ?? "",
      etag: response.headers.get("etag"),
      schemaVersion: response.headers.get("x-other-bali-schema-version"),
    };
    if (response.status >= 500) failures.push(`${path}: server error ${response.status}`);
    if (response.status >= 400) failures.push(`${path}: unexpected status ${response.status}`);
    if (requireH1 && !textMatch(body, /<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/i)) {
      failures.push(`${path}: missing H1`);
    }
  } catch (error) {
    result = {
      path,
      status: 0,
      body: "",
      finalUrl: url.href,
      contentType: "",
      etag: null,
      schemaVersion: null,
    };
    failures.push(`${path}: request failed (${error instanceof Error ? error.message : "unknown"})`);
  }
  visited.set(path, result);
  return result;
}

for (const route of coreRoutes) {
  await fetchRoute(route, { requireH1: !route.startsWith("/api/") });
}

function apiJson(path) {
  const result = visited.get(path);
  if (!result || result.status !== 200) return null;
  if (!/^application\/json(?:\s*;|$)/i.test(result.contentType)) {
    failures.push(`${path}: expected application/json, got ${result.contentType || "missing content-type"}`);
    return null;
  }
  try {
    return JSON.parse(result.body);
  } catch {
    failures.push(`${path}: invalid JSON response`);
    return null;
  }
}

const livePayload = apiJson("/api/health/live");
if (livePayload && !(
  livePayload.ok === true
  && livePayload.status === "live"
  && typeof livePayload.release === "string"
)) failures.push("/api/health/live: invalid live contract");

const readyPayload = apiJson("/api/health/ready");
if (readyPayload && !(
  readyPayload.ok === true
  && readyPayload.status === "ready"
  && typeof readyPayload.release === "string"
)) failures.push("/api/health/ready: dependency is not ready or contract is invalid");

function isIsoTimestamp(value) {
  return typeof value === "string"
    && Number.isFinite(Date.parse(value))
    && new Date(value).toISOString() === value;
}

function validateMobileEnvelope(path, payload, expectedDataKeys) {
  if (!payload) return;
  const dataKeys = payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)
    ? Object.keys(payload.data).sort()
    : [];
  if (
    payload.schemaVersion !== 1
    || !isIsoTimestamp(payload.updatedAt)
    || JSON.stringify(Object.keys(payload).sort()) !== JSON.stringify(["data", "schemaVersion", "updatedAt"])
    || JSON.stringify(dataKeys) !== JSON.stringify([...expectedDataKeys].sort())
  ) failures.push(`${path}: invalid versioned mobile envelope`);

  const result = visited.get(path);
  if (result?.schemaVersion !== "1") failures.push(`${path}: missing schema-version response header`);
  if (!result?.etag || !/^(?:W\/)?"[^"]+"$/.test(result.etag)) failures.push(`${path}: missing strong/weak quoted ETag`);
}

const mobileConfigPayload = apiJson("/api/mobile/v1/config");
validateMobileEnvelope(
  "/api/mobile/v1/config",
  mobileConfigPayload,
  ["config", "consentVersion", "minimumSupportedApiVersion"],
);
if (mobileConfigPayload && !(
  mobileConfigPayload.data?.config?.canonicalOrigin === "https://www.otherbali.com"
  && mobileConfigPayload.data?.minimumSupportedApiVersion === 1
  && typeof mobileConfigPayload.data?.consentVersion === "string"
)) failures.push("/api/mobile/v1/config: invalid public config contract");

const mobileBootstrapPayload = apiJson("/api/mobile/v1/bootstrap");
validateMobileEnvelope(
  "/api/mobile/v1/bootstrap",
  mobileBootstrapPayload,
  ["config", "consentVersion", "districts", "minimumSupportedApiVersion", "routes", "venues"],
);
if (mobileBootstrapPayload && !(
  mobileBootstrapPayload.data?.config?.canonicalOrigin === "https://www.otherbali.com"
  && mobileBootstrapPayload.data?.minimumSupportedApiVersion === 1
  && Array.isArray(mobileBootstrapPayload.data?.districts)
  && Array.isArray(mobileBootstrapPayload.data?.venues)
  && Array.isArray(mobileBootstrapPayload.data?.routes)
)) failures.push("/api/mobile/v1/bootstrap: invalid bootstrap data contract");

for (const path of ["/api/mobile/v1/config", "/api/mobile/v1/bootstrap"]) {
  const etag = visited.get(path)?.etag;
  if (!etag) continue;
  try {
    const response = await fetchWithSameOriginRedirects(new URL(path, base), {
      headers: {
        "if-none-match": etag,
        "user-agent": "OtherBaliLaunchSmoke/1.0",
        ...(protectionBypass ? { "x-vercel-protection-bypass": protectionBypass } : {}),
      },
      signal: AbortSignal.timeout(15_000),
    });
    await response.body?.cancel();
    if (response.status !== 304) failures.push(`${path}: If-None-Match expected 304, got ${response.status}`);
  } catch (error) {
    failures.push(`${path}: ETag revalidation failed (${error instanceof Error ? error.message : "unknown"})`);
  }
}

for (const missingPath of [
  "/places/other-bali-smoke-missing-venue",
  "/route/other-bali-smoke-missing-route",
]) {
  try {
    const response = await fetchWithSameOriginRedirects(new URL(missingPath, base), {
      headers: {
        "user-agent": "OtherBaliLaunchSmoke/1.0",
        ...(protectionBypass
          ? { "x-vercel-protection-bypass": protectionBypass }
          : {}),
      },
      signal: AbortSignal.timeout(15_000),
    });
    await response.body?.cancel();
    if (response.status !== 404) failures.push(`${missingPath}: expected real 404, got ${response.status}`);
  } catch (error) {
    failures.push(`${missingPath}: 404 check failed (${error instanceof Error ? error.message : "unknown"})`);
  }
}

const plannerQuery = "/plan?m=morning";
const plannerResult = await fetchRoute(plannerQuery, { requireH1: true });
if (plannerResult.status === 200 && !plannerResult.finalUrl.includes("m=morning")) {
  failures.push(`${plannerQuery}: planner query was not preserved`);
}

const home = visited.get("/")?.body ?? "";
for (const legalPath of ["/privacy", "/support"]) {
  if (!internalLinks(home).some((href) => href.split("?", 1)[0] === legalPath)) {
    failures.push(`/: missing internal link to ${legalPath}`);
  }
}

for (const [path, result] of visited) {
  if (path.startsWith("/api/") || !result.body) continue;
  const canonical = result.body.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
    ?? result.body.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  if (!canonical) failures.push(`${path}: missing canonical link`);
  else if (new URL(canonical[1], base).hostname !== "www.otherbali.com") {
    failures.push(`${path}: canonical host is not www.otherbali.com`);
  }
}

const crawlCandidates = [...new Set(
  [...visited.values()].flatMap((result) => internalLinks(result.body)),
)]
  .filter((path) => !path.startsWith("/admin") && !path.startsWith("/partner") && !path.startsWith("/onboard"))
  .slice(0, 40);

for (const path of crawlCandidates) await fetchRoute(path);

const allDiscoveredLinks = [...new Set(
  [...visited.values()].flatMap((result) => internalLinks(result.body)),
)];
for (const [label, pattern] of [
  ["venue detail", /^\/places\/[^/?#]+/],
  ["route detail", /^\/route\/[^/?#]+/],
]) {
  const path = allDiscoveredLinks.find((candidate) => pattern.test(candidate));
  if (!path) failures.push(`discovery: no ${label} link found`);
  else await fetchRoute(path, { requireH1: true });
}

const report = {
  baseUrl: base.origin,
  checked: visited.size,
  statuses: Object.fromEntries([...visited].map(([path, value]) => [path, value.status])),
  failures,
};
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exit(1);
