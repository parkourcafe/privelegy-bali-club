import { createHash } from "node:crypto";

export const DEFAULT_T0_ORIGIN = "https://www.otherbali.com";

export const T0_USER_AGENTS = Object.freeze([
  Object.freeze({
    id: "browser",
    label: "Browser",
    value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
  }),
  Object.freeze({
    id: "generic_crawler",
    label: "Generic crawler",
    value: "Mozilla/5.0 (compatible; AuditCrawler/1.0; +https://example.com/bot)",
  }),
  Object.freeze({
    id: "googlebot_smartphone",
    label: "Googlebot Smartphone",
    value: "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  }),
]);

const EXPECTATIONS = new Set(["indexable", "not_found"]);
const MIN_USEFUL_TEXT_LENGTH = 200;

function decodeEntities(value) {
  return String(value ?? "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&quot;/gi, "\"")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");
}

function parseAttributes(tag) {
  const attributes = new Map();
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of tag.matchAll(pattern)) {
    const name = match[1].toLowerCase();
    if (name === "link" || name === "meta") continue;
    attributes.set(name, decodeEntities(match[2] ?? match[3] ?? match[4] ?? ""));
  }
  return attributes;
}

function tags(html, name) {
  return [...String(html).matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))]
    .map((match) => parseAttributes(match[0]));
}

function normalizeComparableUrl(value, baseUrl) {
  try {
    const url = new URL(value, baseUrl);
    url.hash = "";
    if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.replace(/\/+$/, "");
    }
    return url.href;
  } catch {
    return null;
  }
}

function extractCanonicals(html, documentUrl) {
  return tags(html, "link")
    .filter((attributes) => (attributes.get("rel") ?? "").toLowerCase().split(/\s+/).includes("canonical"))
    .map((attributes) => normalizeComparableUrl(attributes.get("href"), documentUrl))
    .filter(Boolean);
}

function extractNamedMeta(html, names) {
  const accepted = new Set(names.map((name) => name.toLowerCase()));
  return tags(html, "meta")
    .filter((attributes) => accepted.has((attributes.get("name") ?? "").toLowerCase()))
    .map((attributes) => attributes.get("content") ?? "");
}

function directivePresent(value, directive) {
  const escaped = directive.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[\\s,:])${escaped}(?:$|[\\s,])`, "i").test(value);
}

function robotFlags(values) {
  const value = values.join(",").toLowerCase();
  const none = directivePresent(value, "none");
  const all = directivePresent(value, "all");
  return {
    index: all || directivePresent(value, "index"),
    follow: all || directivePresent(value, "follow"),
    noindex: none || directivePresent(value, "noindex"),
    nofollow: none || directivePresent(value, "nofollow"),
  };
}

function visibleText(html) {
  return decodeEntities(String(html)
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|template|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function firstH1(html) {
  const match = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(String(html));
  return match ? visibleText(match[1]) : "";
}

function firstTitle(html) {
  const match = /<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(String(html));
  return match ? visibleText(match[1]) : "";
}

function mainText(html) {
  const match = /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(String(html));
  return match ? visibleText(match[1]) : "";
}

function comparableText(value) {
  return String(value ?? "").normalize("NFKC").replace(/\s+/g, " ").trim().toLocaleLowerCase("en");
}

function headerValue(headers, name) {
  if (!headers) return "";
  if (typeof headers.get === "function") return headers.get(name) ?? "";
  const target = name.toLowerCase();
  const entry = Object.entries(headers).find(([key]) => key.toLowerCase() === target);
  return entry ? String(entry[1]) : "";
}

function analyzeHtml(html, documentUrl, xRobotsTag) {
  const canonicals = [...new Set(extractCanonicals(html, documentUrl))];
  const h1 = firstH1(html);
  const title = firstTitle(html);
  const primaryText = mainText(html);
  return {
    canonicals,
    h1,
    title,
    mainText: primaryText,
    hasMain: Boolean(primaryText),
    textLength: primaryText.length,
    useful: Boolean(h1) && primaryText.length >= MIN_USEFUL_TEXT_LENGTH,
    metaRobots: robotFlags(extractNamedMeta(html, ["robots", "googlebot"])),
    headerRobots: robotFlags([xRobotsTag]),
  };
}

function contentFingerprint(response, analysis, documentUrl) {
  return JSON.stringify({
    status: response.status,
    finalUrl: normalizeComparableUrl(response.finalUrl, documentUrl),
    title: comparableText(analysis.title),
    h1: comparableText(analysis.h1),
    mainText: comparableText(analysis.mainText),
    canonicals: analysis.canonicals,
    metaRobots: analysis.metaRobots,
    headerRobots: analysis.headerRobots,
  });
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeOrigin(input) {
  const url = new URL(input);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("T0 base URL must use HTTP or HTTPS");
  }
  if (url.username || url.password) throw new Error("T0 base URL must not contain credentials");
  return url.origin;
}

function validateManifest(manifest) {
  if (!manifest || manifest.version !== 1 || !Array.isArray(manifest.samples) || manifest.samples.length === 0) {
    throw new Error("T0 sample manifest must be version 1 with a non-empty samples array");
  }
  const seen = new Set();
  for (const sample of manifest.samples) {
    if (!sample || typeof sample.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(sample.slug)) {
      throw new Error("Every T0 sample needs a normalized slug");
    }
    if (!EXPECTATIONS.has(sample.expectation)) {
      throw new Error(`Unsupported T0 expectation for ${sample.slug}`);
    }
    if (
      sample.expectation === "indexable" &&
      (typeof sample.expectedH1 !== "string" || sample.expectedH1.trim().length === 0)
    ) {
      throw new Error(`Indexable T0 sample needs expectedH1: ${sample.slug}`);
    }
    if (seen.has(sample.slug)) throw new Error(`Duplicate T0 sample slug: ${sample.slug}`);
    seen.add(sample.slug);
  }
  return manifest.samples;
}

function parseRobotsGroups(text) {
  const groups = [];
  let agents = [];
  let rules = [];
  const flush = () => {
    if (agents.length > 0) groups.push({ agents, rules });
    agents = [];
    rules = [];
  };

  for (const rawLine of String(text).split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const field = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    if (field === "user-agent") {
      if (rules.length > 0) flush();
      agents.push(value.toLowerCase());
    } else if ((field === "allow" || field === "disallow") && agents.length > 0) {
      rules.push({ kind: field, pattern: value });
    }
  }
  flush();
  return groups;
}

function robotsPatternMatch(pattern, path) {
  if (!pattern) return false;
  const anchored = pattern.endsWith("$");
  const source = (anchored ? pattern.slice(0, -1) : pattern)
    .split("*")
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");
  return new RegExp(`^${source}${anchored ? "$" : ""}`).test(path);
}

export function robotsAllowsPath(text, path, userAgent = T0_USER_AGENTS[1].value) {
  const groups = parseRobotsGroups(text);
  const normalizedAgent = userAgent.toLowerCase();
  const matching = groups
    .map((group) => ({
      ...group,
      specificity: Math.max(...group.agents
        .filter((agent) => agent === "*" || normalizedAgent.includes(agent))
        .map((agent) => agent === "*" ? 0 : agent.length), -1),
    }))
    .filter((group) => group.specificity >= 0);
  if (matching.length === 0) return true;
  const bestSpecificity = Math.max(...matching.map((group) => group.specificity));
  const rules = matching
    .filter((group) => group.specificity === bestSpecificity)
    .flatMap((group) => group.rules)
    .filter((rule) => robotsPatternMatch(rule.pattern, path));
  if (rules.length === 0) return true;
  const longest = Math.max(...rules.map((rule) => rule.pattern.replace(/[*$]/g, "").length));
  const winners = rules.filter((rule) => rule.pattern.replace(/[*$]/g, "").length === longest);
  return winners.some((rule) => rule.kind === "allow");
}

export function extractSitemapUrls(xml, baseUrl = DEFAULT_T0_ORIGIN) {
  const urls = new Set();
  for (const match of String(xml).matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/gi)) {
    const normalized = normalizeComparableUrl(decodeEntities(match[1].trim()), baseUrl);
    if (normalized) urls.add(normalized);
  }
  return urls;
}

async function requestText(fetchImpl, url, userAgent, timeoutMs) {
  try {
    const response = await fetchImpl(url, {
      method: "GET",
      // A canonical venue URL must answer directly. Following redirects would
      // hide auth, host, and path regressions behind a final HTTP 200.
      redirect: "manual",
      headers: {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5",
        "user-agent": userAgent,
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
    const body = await response.text();
    return {
      status: response.status,
      finalUrl: response.url || url,
      xRobotsTag: headerValue(response.headers, "x-robots-tag"),
      body,
      error: null,
    };
  } catch (error) {
    return {
      status: null,
      finalUrl: url,
      xRobotsTag: "",
      body: "",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function mapWithConcurrency(values, limit, worker) {
  const results = new Array(values.length);
  let cursor = 0;
  async function run() {
    while (cursor < values.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(values[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, run));
  return results;
}

export async function runT0IndexabilityAudit({
  fetchImpl = globalThis.fetch,
  baseUrl = DEFAULT_T0_ORIGIN,
  manifest,
  timeoutMs = 30_000,
  concurrency = 4,
  now = () => new Date(),
} = {}) {
  if (typeof fetchImpl !== "function") throw new Error("A fetch implementation is required");
  if (!Number.isInteger(concurrency) || concurrency < 1) throw new Error("Concurrency must be a positive integer");
  const origin = normalizeOrigin(baseUrl);
  const samples = validateManifest(manifest);
  const robotsUrl = `${origin}/robots.txt`;
  const sitemapUrl = `${origin}/sitemap.xml`;
  const genericAgent = T0_USER_AGENTS.find((agent) => agent.id === "generic_crawler").value;

  const [robotsResponses, sitemapResponse] = await Promise.all([
    Promise.all(T0_USER_AGENTS.map(async (agent) => ({
      agent,
      response: await requestText(fetchImpl, robotsUrl, agent.value, timeoutMs),
    }))),
    requestText(fetchImpl, sitemapUrl, genericAgent, timeoutMs),
  ]);
  const sitemapUrls = extractSitemapUrls(sitemapResponse.body, origin);
  const violations = [];
  const addViolation = (code, message, slug = null, agent = null) => {
    violations.push({ code, ...(slug ? { slug } : {}), ...(agent ? { agent } : {}), message });
  };

  let robotsAllowsAllTargets = true;
  for (const { agent, response } of robotsResponses) {
    if (response.error) addViolation("ROBOTS_FETCH_FAILED", response.error, null, agent.id);
    if (response.status !== 200) {
      addViolation(
        "ROBOTS_STATUS",
        `${agent.label} robots.txt returned ${response.status ?? "no status"}, expected 200`,
        null,
        agent.id,
      );
    }
    if (!robotsAllowsPath(response.body, "/places", agent.value)) {
      robotsAllowsAllTargets = false;
      addViolation("ROBOTS_BLOCKED", `${agent.label} is blocked from /places`, null, agent.id);
    }
    for (const sample of samples.filter((entry) => entry.expectation === "indexable")) {
      const pathname = `/places/${sample.slug}`;
      if (robotsAllowsPath(response.body, pathname, agent.value)) continue;
      robotsAllowsAllTargets = false;
      addViolation("ROBOTS_BLOCKED", `${agent.label} is blocked from ${pathname}`, sample.slug, agent.id);
    }
  }
  if (sitemapResponse.error) addViolation("SITEMAP_FETCH_FAILED", sitemapResponse.error);
  if (sitemapResponse.status !== 200) addViolation("SITEMAP_STATUS", `sitemap.xml returned ${sitemapResponse.status ?? "no status"}, expected 200`);
  if (sitemapResponse.status === 200 && sitemapUrls.size === 0) {
    addViolation("SITEMAP_EMPTY", "sitemap.xml contains no readable <loc> entries");
  }

  const pageResults = await mapWithConcurrency(samples, concurrency, async (sample) => {
    const expectedUrl = normalizeComparableUrl(`${origin}/places/${sample.slug}`, origin);
    const responses = await Promise.all(T0_USER_AGENTS.map(async (agent) => ({
      agent,
      response: await requestText(fetchImpl, expectedUrl, agent.value, timeoutMs),
    })));

    for (const { agent, response } of responses) {
      if (response.error) addViolation("PAGE_FETCH_FAILED", response.error, sample.slug, agent.id);
      const expectedStatus = sample.expectation === "indexable" ? 200 : 404;
      if (response.status !== expectedStatus) {
        addViolation(
          sample.expectation === "indexable" ? "POSITIVE_STATUS" : "NEGATIVE_STATUS",
          `${agent.label} returned ${response.status ?? "no status"}, expected ${expectedStatus}`,
          sample.slug,
          agent.id,
        );
      }
      const finalUrl = normalizeComparableUrl(response.finalUrl, origin);
      if (finalUrl !== expectedUrl) {
        addViolation("UNEXPECTED_FINAL_URL", `${agent.label} ended at ${finalUrl ?? "an invalid URL"}`, sample.slug, agent.id);
      }
    }

    const analyses = responses.map(({ agent, response }) => ({
      agent,
      response,
      analysis: analyzeHtml(response.body, expectedUrl, response.xRobotsTag),
    }));
    const hashes = responses.map(({ response }) => sha256(response.body));
    const identicalHtml = hashes.every((hash) => hash === hashes[0]);
    const fingerprints = analyses.map(({ response, analysis }) => contentFingerprint(response, analysis, expectedUrl));
    const equivalentContent = fingerprints.every((fingerprint) => fingerprint === fingerprints[0]);
    if (!equivalentContent) {
      addViolation(
        "UA_BODY_MISMATCH",
        "SEO metadata and normalized primary content differ between browser, generic crawler, and Googlebot Smartphone",
        sample.slug,
      );
    }
    if (sample.expectation === "indexable") {
      for (const { agent, analysis } of analyses) {
        if (!analysis.useful) {
          addViolation(
            "HTML_NOT_USEFUL",
            `${agent.label} initial HTML needs a non-empty H1, a main landmark, and at least ${MIN_USEFUL_TEXT_LENGTH} visible characters`,
            sample.slug,
            agent.id,
          );
        }
        if (comparableText(analysis.h1) !== comparableText(sample.expectedH1)) {
          addViolation("H1_MISMATCH", `${agent.label} H1 does not identify the expected venue`, sample.slug, agent.id);
        }
        if (!analysis.title || /\bundefined\b/i.test(analysis.title)) {
          addViolation("TITLE_INVALID", `${agent.label} title is empty or contains undefined`, sample.slug, agent.id);
        }
        if (analysis.canonicals.length === 0) {
          addViolation("CANONICAL_MISSING", `${agent.label} HTML has no canonical`, sample.slug, agent.id);
        } else if (analysis.canonicals.length !== 1 || analysis.canonicals[0] !== expectedUrl) {
          addViolation("CANONICAL_CONFLICT", `${agent.label} canonical is not uniquely self-referencing`, sample.slug, agent.id);
        }
        if (analysis.metaRobots.noindex || analysis.metaRobots.nofollow) {
          addViolation("META_ROBOTS_CONFLICT", `${agent.label} HTML contains noindex or nofollow`, sample.slug, agent.id);
        }
        if (!analysis.metaRobots.index || !analysis.metaRobots.follow) {
          addViolation("META_ROBOTS_NOT_INDEX_FOLLOW", `${agent.label} HTML does not explicitly declare index,follow`, sample.slug, agent.id);
        }
        if (analysis.headerRobots.noindex || analysis.headerRobots.nofollow) {
          addViolation("X_ROBOTS_CONFLICT", `${agent.label} X-Robots-Tag contains noindex or nofollow`, sample.slug, agent.id);
        }
      }
      if (!sitemapUrls.has(expectedUrl)) {
        addViolation("SITEMAP_MISSING", "Indexable sample is absent from sitemap.xml", sample.slug);
      }
    } else {
      for (const { agent, analysis } of analyses) {
        const noindex = analysis.metaRobots.noindex || analysis.headerRobots.noindex;
        if (!noindex) {
          addViolation("NEGATIVE_NOINDEX_MISSING", `${agent.label} 404 does not declare noindex`, sample.slug, agent.id);
        }
      }
      if (sitemapUrls.has(expectedUrl)) {
        addViolation("NEGATIVE_IN_SITEMAP", "Negative control is unexpectedly present in sitemap.xml", sample.slug);
      }
    }

    const primary = analyses[0];
    return {
      slug: sample.slug,
      expectation: sample.expectation,
      statuses: Object.fromEntries(responses.map(({ agent, response }) => [agent.id, response.status])),
      identicalHtml,
      equivalentContent,
      bodySha256: identicalHtml
        ? hashes[0]
        : Object.fromEntries(responses.map(({ agent }, index) => [agent.id, hashes[index]])),
      h1: primary.analysis.h1 || null,
      title: primary.analysis.title || null,
      canonical: primary.analysis.canonicals[0] ?? null,
      inSitemap: sitemapUrls.has(expectedUrl),
    };
  });

  const positiveCount = samples.filter((sample) => sample.expectation === "indexable").length;
  const negativeCount = samples.length - positiveCount;
  return {
    ok: violations.length === 0,
    checkedAt: now().toISOString(),
    baseUrl: origin,
    userAgents: T0_USER_AGENTS.map(({ id, value }) => ({ id, value })),
    robots: {
      statuses: Object.fromEntries(robotsResponses.map(({ agent, response }) => [agent.id, response.status])),
      allowsPlaces: robotsAllowsAllTargets,
    },
    sitemap: {
      status: sitemapResponse.status,
      urlCount: sitemapUrls.size,
    },
    totals: {
      positive: positiveCount,
      negative: negativeCount,
      pageFetches: samples.length * T0_USER_AGENTS.length,
      violations: violations.length,
    },
    samples: pageResults,
    violations,
  };
}

// Shared primitives for route-agnostic SEO release checks. Keep the parser and
// content fingerprint identical to the production T0 venue audit so newer
// governance tooling cannot silently weaken the original acceptance gate.
export {
  analyzeHtml as analyzeSeoHtml,
  contentFingerprint as seoContentFingerprint,
  normalizeComparableUrl as normalizeSeoUrl,
  sha256 as hashSeoFingerprint,
};
