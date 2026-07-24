#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { robotsAllowsPath } from "./t0-indexability-core.mjs";
import {
  buildShadowPageRegistry,
  diffSitemapAndRegistry,
  inspectHtmlDocument,
  mergePageRegistryAnnotations,
  normalizeOrigin,
  parseSitemapLocations,
  validateIndexableHtmlInspection,
  validateEvidenceRegistry,
  validateApprovedPageEvidence,
  validateIntentRegistry,
  validateMonthlyDecisionLog,
  validatePageRegistry,
  validateRedirectRegistry,
} from "./seo-os-core.mjs";

const DEFAULT_ORIGIN = "https://www.otherbali.com";
const DEFAULT_PAGE_REGISTRY = "docs/seo/os/page-registry.json";
const DEFAULT_INTENT_REGISTRY = "docs/seo/os/intent-registry.json";
const DEFAULT_EVIDENCE_REGISTRY = "docs/seo/os/evidence-registry.json";
const DEFAULT_REDIRECT_REGISTRY = "docs/seo/os/redirect-registry.json";
const DEFAULT_DECISION_LOG = "docs/seo/os/monthly-decision-log.json";

const AUDIT_USER_AGENTS = Object.freeze({
  generic: "OtherBali-SEO-OS/1.0",
  browser: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36",
  googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
});

function parseArgs(argv) {
  const [command = "check", ...rest] = argv;
  const options = {
    command,
    origin: DEFAULT_ORIGIN,
    output: DEFAULT_PAGE_REGISTRY,
    pageRegistry: DEFAULT_PAGE_REGISTRY,
    intentRegistry: DEFAULT_INTENT_REGISTRY,
    evidenceRegistry: DEFAULT_EVIDENCE_REGISTRY,
    redirectRegistry: DEFAULT_REDIRECT_REGISTRY,
    decisionLog: DEFAULT_DECISION_LOG,
    allowDrift: false,
    approveDrift: false,
  };
  for (const argument of rest) {
    if (argument.startsWith("--origin=")) options.origin = argument.slice("--origin=".length);
    else if (argument.startsWith("--output=")) options.output = argument.slice("--output=".length);
    else if (argument.startsWith("--page-registry=")) {
      options.pageRegistry = argument.slice("--page-registry=".length);
    } else if (argument.startsWith("--intent-registry=")) {
      options.intentRegistry = argument.slice("--intent-registry=".length);
    } else if (argument.startsWith("--evidence-registry=")) {
      options.evidenceRegistry = argument.slice("--evidence-registry=".length);
    } else if (argument.startsWith("--redirect-registry=")) {
      options.redirectRegistry = argument.slice("--redirect-registry=".length);
    } else if (argument.startsWith("--decision-log=")) {
      options.decisionLog = argument.slice("--decision-log=".length);
    } else if (argument === "--allow-drift") options.allowDrift = true;
    else if (argument === "--approve-drift") options.approveDrift = true;
    else throw new Error(`Unknown option: ${argument}`);
  }
  if (!["audit", "check", "snapshot", "validate"].includes(command)) {
    throw new Error(`Unknown command: ${command}`);
  }
  return options;
}

async function readJson(path) {
  return JSON.parse(await readFile(resolve(path), "utf8"));
}

function configuredOrigin(value) {
  const normalizedOrigin = normalizeOrigin(value);
  if (normalizedOrigin !== DEFAULT_ORIGIN) {
    throw new Error(`This pilot is restricted to ${DEFAULT_ORIGIN}`);
  }
  return normalizedOrigin;
}

async function fetchSitemap(origin) {
  const normalizedOrigin = configuredOrigin(origin);
  const sitemapUrl = `${normalizedOrigin}/sitemap.xml`;
  const response = await fetch(sitemapUrl, {
    headers: { "user-agent": "OtherBali-SEO-OS/1.0" },
    redirect: "manual",
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`Sitemap returned HTTP ${response.status}`);
  if (new URL(response.url).origin !== normalizedOrigin) {
    throw new Error("Sitemap response escaped the configured origin");
  }
  const parsed = parseSitemapLocations(await response.text(), { expectedOrigin: normalizedOrigin });
  return { sitemapUrl, ...parsed };
}

async function snapshot(options) {
  const sitemap = await fetchSitemap(options.origin);
  if (sitemap.duplicates.length || sitemap.foreignOrigins.length) {
    throw new Error("Refusing to snapshot a sitemap with duplicate URLs or foreign origins");
  }
  const freshRegistry = buildShadowPageRegistry({
    locations: sitemap.locations,
    sourceSitemap: sitemap.sitemapUrl,
  });
  let existingRegistry = null;
  try {
    existingRegistry = await readJson(options.output);
  } catch (error) {
    if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") throw error;
  }
  if (existingRegistry) {
    const existingErrors = validatePageRegistry(existingRegistry);
    if (existingErrors.length) {
      throw new Error(`Existing registry is invalid:\n${existingErrors.join("\n")}`);
    }
    const drift = diffSitemapAndRegistry(sitemap.locations, existingRegistry);
    const driftCount = drift.added_since_snapshot.length + drift.removed_since_snapshot.length;
    if (driftCount > 0 && !options.approveDrift) {
      throw new Error(
        `Refusing to replace an existing snapshot with ${driftCount} changed URL(s) without --approve-drift`,
      );
    }
  }
  const registry = mergePageRegistryAnnotations(freshRegistry, existingRegistry);
  const errors = validatePageRegistry(registry);
  if (errors.length) throw new Error(`Generated registry is invalid:\n${errors.join("\n")}`);
  const output = resolve(options.output);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(registry, null, 2)}\n`, "utf8");
  return { ok: true, operation: "snapshot", output, counts: registry.counts };
}

async function readRegistries(options) {
  const [pageRegistry, intentRegistry, evidenceRegistry, redirectRegistry, decisionLog] = await Promise.all([
    readJson(options.pageRegistry),
    readJson(options.intentRegistry),
    readJson(options.evidenceRegistry),
    readJson(options.redirectRegistry),
    readJson(options.decisionLog),
  ]);
  return { pageRegistry, intentRegistry, evidenceRegistry, redirectRegistry, decisionLog };
}

function registryErrors({ pageRegistry, intentRegistry, evidenceRegistry, redirectRegistry, decisionLog }) {
  const pageErrors = validatePageRegistry(pageRegistry);
  const intentErrors = validateIntentRegistry(intentRegistry, pageRegistry);
  const evidenceErrors = validateEvidenceRegistry(evidenceRegistry, pageRegistry);
  const approvalEvidenceErrors = validateApprovedPageEvidence(pageRegistry, evidenceRegistry);
  const redirectErrors = validateRedirectRegistry(redirectRegistry, pageRegistry);
  const decisionErrors = validateMonthlyDecisionLog(decisionLog, pageRegistry);
  return [
    ...pageErrors,
    ...intentErrors,
    ...evidenceErrors,
    ...approvalEvidenceErrors,
    ...redirectErrors,
    ...decisionErrors,
  ];
}

async function validate(options) {
  const registries = await readRegistries(options);
  const errors = registryErrors(registries);
  return {
    ok: errors.length === 0,
    operation: "validate",
    registry_entries: {
      pages: registries.pageRegistry.entries.length,
      intents: registries.intentRegistry.entries.length,
      evidence_claims: registries.evidenceRegistry.entries.length,
      evidence_page_reviews: registries.evidenceRegistry.page_reviews.length,
      redirects: registries.redirectRegistry.entries.length,
      monthly_decisions: registries.decisionLog.entries.length,
    },
    errors,
  };
}

async function check(options) {
  const [sitemap, registries] = await Promise.all([
    fetchSitemap(options.origin),
    readRegistries(options),
  ]);
  const { pageRegistry } = registries;
  const errors = registryErrors(registries);
  if (sitemap.duplicates.length) {
    errors.push(`live sitemap contains ${sitemap.duplicates.length} duplicate URL(s)`);
  }
  if (sitemap.foreignOrigins.length) {
    errors.push(`live sitemap contains ${sitemap.foreignOrigins.length} foreign origin URL(s)`);
  }
  const diff = diffSitemapAndRegistry(sitemap.locations, pageRegistry);
  const drift = diff.added_since_snapshot.length + diff.removed_since_snapshot.length;
  const ok = errors.length === 0 && (options.allowDrift || drift === 0);
  return {
    ok,
    operation: "check",
    live_sitemap_count: sitemap.locations.length,
    snapshot_count: pageRegistry.entries.filter((entry) => entry.sitemap_included === true).length,
    tombstone_count: pageRegistry.entries.filter((entry) => entry.sitemap_included === false).length,
    duplicate_sitemap_urls: sitemap.duplicates,
    foreign_sitemap_origins: sitemap.foreignOrigins,
    errors,
    ...diff,
  };
}

async function mapWithConcurrency(values, limit, mapper) {
  const results = new Array(values.length);
  let cursor = 0;
  async function worker() {
    while (cursor < values.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(values[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, () => worker()));
  return results;
}

async function audit(options) {
  const [sitemap, pageRegistry, intentRegistry] = await Promise.all([
    fetchSitemap(options.origin),
    readJson(options.pageRegistry),
    readJson(options.intentRegistry),
  ]);
  const registryErrors = [
    ...validatePageRegistry(pageRegistry),
    ...validateIntentRegistry(intentRegistry, pageRegistry),
  ];
  if (registryErrors.length) {
    throw new Error(`Refusing to audit invalid registries:\n${registryErrors.join("\n")}`);
  }
  const allowedOrigin = configuredOrigin(options.origin);
  const sitemapUrls = new Set(sitemap.locations);
  const knownUrls = new Set(pageRegistry.entries.map((entry) => entry.sitemap_url));
  const urls = [...new Set(
    intentRegistry.entries
      .filter((entry) => entry.status === "active" && entry.indexable === true)
      .map((entry) => entry.owner_url),
  )];
  for (const url of urls) {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || parsed.origin !== allowedOrigin || parsed.username || parsed.password) {
      throw new Error(`Refusing to audit URL outside ${allowedOrigin}: ${url}`);
    }
  }

  const robotsByAgent = new Map();
  for (const [uaName, userAgent] of Object.entries(AUDIT_USER_AGENTS)) {
    const response = await fetch(`${allowedOrigin}/robots.txt`, {
      headers: { "user-agent": userAgent },
      redirect: "manual",
      signal: AbortSignal.timeout(30_000),
    });
    if (response.status !== 200 || new URL(response.url).origin !== allowedOrigin) {
      throw new Error(`robots.txt failed for ${uaName}: HTTP ${response.status}`);
    }
    robotsByAgent.set(uaName, await response.text());
  }

  const checks = [];
  for (const [uaName, userAgent] of Object.entries(AUDIT_USER_AGENTS)) {
    const uaChecks = await mapWithConcurrency(urls, 4, async (url) => {
      try {
        const response = await fetch(url, {
          headers: { "user-agent": userAgent },
          redirect: "manual",
          signal: AbortSignal.timeout(30_000),
        });
        const html = await response.text();
        const headers = Object.fromEntries(response.headers.entries());
        const inspection = inspectHtmlDocument({
          url,
          finalUrl: response.url || url,
          status: response.status,
          headers,
          html,
        });
        const failures = validateIndexableHtmlInspection(inspection);
        if (!sitemapUrls.has(url)) failures.push("absent from live sitemap");
        if (!knownUrls.has(url)) failures.push("absent from page registry");
        if (!robotsAllowsPath(robotsByAgent.get(uaName), new URL(url).pathname, userAgent)) {
          failures.push("blocked by robots.txt");
        }
        return { url, user_agent: uaName, ok: failures.length === 0, failures, ...inspection };
      } catch (error) {
        return {
          url,
          user_agent: uaName,
          ok: false,
          failures: [error instanceof Error ? error.message : String(error)],
        };
      }
    });
    checks.push(...uaChecks);
  }

  const failed = checks.filter((entry) => !entry.ok);
  const parityFailures = [];
  for (const url of urls) {
    const urlChecks = checks.filter((entry) => entry.url === url && entry.ok);
    if (urlChecks.length !== Object.keys(AUDIT_USER_AGENTS).length) continue;
    for (const field of ["content_fingerprint"]) {
      const values = new Set(urlChecks.map((entry) => entry[field]));
      if (values.size > 1) parityFailures.push({ url, field, values: [...values] });
    }
  }
  return {
    ok: urls.length > 0 && failed.length === 0 && parityFailures.length === 0,
    operation: "audit",
    audited_urls: urls.length,
    user_agents: Object.keys(AUDIT_USER_AGENTS),
    total_checks: checks.length,
    passed_checks: checks.length - failed.length,
    failed_checks: failed.length,
    failures: failed,
    parity_failures: parityFailures,
    checks,
  };
}

try {
  const options = parseArgs(process.argv.slice(2));
  const report = options.command === "snapshot"
    ? await snapshot(options)
    : options.command === "audit"
      ? await audit(options)
      : options.command === "validate"
        ? await validate(options)
        : await check(options);
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exitCode = 1;
} catch (error) {
  console.error(JSON.stringify({
    ok: false,
    fatal: error instanceof Error ? error.message : String(error),
  }, null, 2));
  process.exitCode = 1;
}
