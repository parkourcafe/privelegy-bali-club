import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  T0_USER_AGENTS,
  robotsAllowsPath,
  runT0IndexabilityAudit,
} from "./t0-indexability-core.mjs";

const origin = "https://www.otherbali.com";
const manifest = JSON.parse(await readFile(new URL("./t0-indexability-samples.json", import.meta.url), "utf8"));
const expectedPositiveSlugs = [
  "monkey-bar-bali",
  "desa-wisata-penglipuran",
  "amo-spa-canggu-canggu",
  "atlas-beach-club",
  "baked-pererenan",
  "donna-ubud",
  "pantai-lovina",
  "nusa-dua-beach-grill",
  "crumb-and-coaster-kuta",
  "alchemy-uluwatu",
  "koa-shala-sanur",
  "kilo-kitchen-bali-seminyak",
];

function positiveHtml(slug, overrides = {}) {
  const canonical = overrides.canonical ?? `${origin}/places/${slug}`;
  const robots = overrides.robots ?? "index, follow";
  const h1 = overrides.h1 === false ? "" : `<h1>${overrides.h1 ?? `${slug} · Other Bali`}</h1>`;
  const title = overrides.title ?? slug;
  const filler = "Resident-curated Bali guidance with verified practical details, a clear reason to go, and useful context for this moment. ".repeat(4);
  const mainText = overrides.mainText === false ? "" : `<p>${filler}</p>`;
  const outsideText = overrides.mainText === false ? `<p>${filler}</p>` : "";
  return `<!doctype html><html><head><title>${title}</title><meta content="${robots}" name="robots"><link href="${canonical}" rel="canonical"></head><body><main>${h1}${mainText}</main>${outsideText}</body></html>`;
}

function negativeHtml(overrides = {}) {
  const robots = overrides.robots ?? "noindex, nofollow";
  return `<!doctype html><html><head><meta name="robots" content="${robots}"></head><body><main><h1>Not found</h1></main></body></html>`;
}

function fakeResponse({ status, url, body, headers = {} }) {
  return {
    status,
    url,
    headers: new Headers(headers),
    async text() {
      return body;
    },
  };
}

function makeFakeFetch({ samples = manifest.samples, mutate } = {}) {
  const calls = [];
  const sitemapLocations = samples
    .filter((sample) => sample.expectation === "indexable")
    .map((sample) => `<url><loc>${origin}/places/${sample.slug}</loc></url>`)
    .join("");

  const fetchImpl = async (input, init = {}) => {
    const url = String(input);
    const userAgent = new Headers(init.headers).get("user-agent") ?? "";
    calls.push({ url, userAgent, redirect: init.redirect });
    const pathname = new URL(url).pathname;
    let response;
    if (pathname === "/robots.txt") {
      response = { status: 200, url, body: "User-agent: *\nAllow: /\nDisallow: /admin/", headers: { "content-type": "text/plain" } };
    } else if (pathname === "/sitemap.xml") {
      response = { status: 200, url, body: `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapLocations}</urlset>`, headers: { "content-type": "application/xml" } };
    } else {
      const slug = pathname.replace(/^\/places\//, "");
      const sample = samples.find((entry) => entry.slug === slug);
      if (!sample) throw new Error(`Unexpected fake request: ${url}`);
      response = sample.expectation === "indexable"
        ? { status: 200, url, body: positiveHtml(slug, { h1: sample.expectedH1 }), headers: { "content-type": "text/html" } }
        : { status: 404, url, body: negativeHtml(), headers: { "content-type": "text/html" } };
    }
    const changed = mutate?.({ ...response, userAgent, pathname }) ?? response;
    return fakeResponse(changed);
  };
  return { fetchImpl, calls };
}

function reportCodes(report) {
  return new Set(report.violations.map((violation) => violation.code));
}

test("manifest locks the 12 indexable production samples and the factual-only negative control", () => {
  assert.deepEqual(
    manifest.samples.filter((sample) => sample.expectation === "indexable").map((sample) => sample.slug),
    expectedPositiveSlugs,
  );
  assert.deepEqual(
    manifest.samples.filter((sample) => sample.expectation === "not_found").map((sample) => sample.slug),
    ["adda-yoga"],
  );
  assert.deepEqual(manifest.branchTargets, [
    { slug: "big-dragon-villas-ubud", expectation: "indexable", expectedH1: "Big Dragon Villas Ubud" },
  ]);
});

test("offline fake fetch proves the complete positive and negative T0 contract for all three exact user agents", async () => {
  const { fetchImpl, calls } = makeFakeFetch();
  const report = await runT0IndexabilityAudit({
    fetchImpl,
    baseUrl: origin,
    manifest,
    now: () => new Date("2026-07-21T00:00:00.000Z"),
  });

  assert.equal(report.ok, true);
  assert.deepEqual(report.violations, []);
  assert.deepEqual(report.totals, { positive: 12, negative: 1, pageFetches: 39, violations: 0 });
  const robotsAgents = calls
    .filter((call) => call.url === `${origin}/robots.txt`)
    .map((call) => call.userAgent)
    .sort();
  assert.deepEqual(robotsAgents, T0_USER_AGENTS.map((agent) => agent.value).sort());
  for (const sample of manifest.samples) {
    const path = `${origin}/places/${sample.slug}`;
    const observedAgents = calls.filter((call) => call.url === path).map((call) => call.userAgent).sort();
    assert.deepEqual(observedAgents, T0_USER_AGENTS.map((agent) => agent.value).sort());
    assert.ok(calls.filter((call) => call.url === path).every((call) => call.redirect === "manual"));
    const result = report.samples.find((entry) => entry.slug === sample.slug);
    assert.equal(result.identicalHtml, true);
    if (sample.expectation === "indexable") {
      assert.deepEqual(Object.values(result.statuses), [200, 200, 200]);
      assert.ok(result.h1);
      assert.equal(result.canonical, path);
      assert.equal(result.inSitemap, true);
    } else {
      assert.deepEqual(Object.values(result.statuses), [404, 404, 404]);
      assert.equal(result.inSitemap, false);
    }
  }
});

test("positive checks fail independently for status, useful venue HTML, title, canonical, robots, X-Robots-Tag, sitemap, and UA parity", async (t) => {
  const sample = { slug: "monkey-bar-bali", expectation: "indexable", expectedH1: "The Monkey Bar" };
  const cases = [
    {
      name: "status",
      code: "POSITIVE_STATUS",
      mutate: (response) => response.pathname.includes(sample.slug) ? { ...response, status: 500 } : response,
    },
    {
      name: "initial HTML H1",
      code: "HTML_NOT_USEFUL",
      mutate: (response) => response.pathname.includes(sample.slug) ? { ...response, body: positiveHtml(sample.slug, { h1: false }) } : response,
    },
    {
      name: "venue identity H1",
      code: "H1_MISMATCH",
      mutate: (response) => response.pathname.includes(sample.slug) ? { ...response, body: positiveHtml(sample.slug, { h1: "Generic Bali place" }) } : response,
    },
    {
      name: "useful text inside main",
      code: "HTML_NOT_USEFUL",
      mutate: (response) => response.pathname.includes(sample.slug) ? { ...response, body: positiveHtml(sample.slug, { h1: sample.expectedH1, mainText: false }) } : response,
    },
    {
      name: "defined title",
      code: "TITLE_INVALID",
      mutate: (response) => response.pathname.includes(sample.slug) ? { ...response, body: positiveHtml(sample.slug, { h1: sample.expectedH1, title: "Venue — undefined in Bali" }) } : response,
    },
    {
      name: "self canonical",
      code: "CANONICAL_CONFLICT",
      mutate: (response) => response.pathname.includes(sample.slug) ? { ...response, body: positiveHtml(sample.slug, { canonical: `${origin}/places/wrong` }) } : response,
    },
    {
      name: "index follow",
      code: "META_ROBOTS_NOT_INDEX_FOLLOW",
      mutate: (response) => response.pathname.includes(sample.slug) ? { ...response, body: positiveHtml(sample.slug, { robots: "index" }) } : response,
    },
    {
      name: "conflicting X-Robots-Tag",
      code: "X_ROBOTS_CONFLICT",
      mutate: (response) => response.pathname.includes(sample.slug) ? { ...response, headers: { ...response.headers, "x-robots-tag": "noindex" } } : response,
    },
    {
      name: "sitemap inclusion",
      code: "SITEMAP_MISSING",
      mutate: (response) => response.pathname === "/sitemap.xml" ? { ...response, body: "<urlset></urlset>" } : response,
    },
    {
      name: "three-UA equivalent HTML",
      code: "UA_BODY_MISMATCH",
      mutate: (response) => response.pathname.includes(sample.slug) && response.userAgent === T0_USER_AGENTS[2].value
        ? { ...response, body: response.body.replace("</main>", "<p>Googlebot-only visible divergence</p></main>") }
        : response,
    },
  ];

  for (const entry of cases) {
    await t.test(entry.name, async () => {
      const samples = [sample];
      const { fetchImpl } = makeFakeFetch({ samples, mutate: entry.mutate });
      const report = await runT0IndexabilityAudit({ fetchImpl, baseUrl: origin, manifest: { version: 1, samples } });
      assert.equal(report.ok, false);
      assert.ok(reportCodes(report).has(entry.code), `expected ${entry.code}`);
    });
  }
});

test("negative control requires 404, noindex, sitemap absence, and three-UA equivalent bodies", async (t) => {
  const sample = { slug: "adda-yoga", expectation: "not_found" };
  const cases = [
    {
      name: "404",
      code: "NEGATIVE_STATUS",
      mutate: (response) => response.pathname.includes(sample.slug) ? { ...response, status: 200 } : response,
    },
    {
      name: "noindex",
      code: "NEGATIVE_NOINDEX_MISSING",
      mutate: (response) => response.pathname.includes(sample.slug) ? { ...response, body: negativeHtml({ robots: "index, follow" }) } : response,
    },
    {
      name: "sitemap absence",
      code: "NEGATIVE_IN_SITEMAP",
      mutate: (response) => response.pathname === "/sitemap.xml"
        ? { ...response, body: `<urlset><url><loc>${origin}/places/${sample.slug}</loc></url></urlset>` }
        : response,
    },
    {
      name: "three-UA equivalent bodies",
      code: "UA_BODY_MISMATCH",
      mutate: (response) => response.pathname.includes(sample.slug) && response.userAgent === T0_USER_AGENTS[1].value
        ? { ...response, body: response.body.replace("</main>", "<p>crawler-only visible divergence</p></main>") }
        : response,
    },
  ];

  for (const entry of cases) {
    await t.test(entry.name, async () => {
      const samples = [sample];
      const { fetchImpl } = makeFakeFetch({ samples, mutate: entry.mutate });
      const report = await runT0IndexabilityAudit({ fetchImpl, baseUrl: origin, manifest: { version: 1, samples } });
      assert.equal(report.ok, false);
      assert.ok(reportCodes(report).has(entry.code), `expected ${entry.code}`);
    });
  }
});

test("robots parser honors the longest matching allow/disallow rule for /places", () => {
  assert.equal(robotsAllowsPath("User-agent: *\nDisallow: /places", "/places/venue"), false);
  assert.equal(robotsAllowsPath("User-agent: *\nDisallow: /places\nAllow: /places/public", "/places/public"), true);
  assert.equal(robotsAllowsPath("User-agent: *\nDisallow: /admin", "/places/venue"), true);
});

test("UA parity ignores harmless runtime-only script differences", async () => {
  const sample = { slug: "monkey-bar-bali", expectation: "indexable", expectedH1: "The Monkey Bar" };
  const { fetchImpl } = makeFakeFetch({
    samples: [sample],
    mutate: (response) => response.pathname.includes(sample.slug) && response.userAgent === T0_USER_AGENTS[2].value
      ? { ...response, body: response.body.replace("</body>", "<script nonce=\"request-specific\">0</script></body>") }
      : response,
  });

  const report = await runT0IndexabilityAudit({
    fetchImpl,
    baseUrl: origin,
    manifest: { version: 1, samples: [sample] },
  });

  assert.equal(report.ok, true);
  assert.equal(report.samples[0].equivalentContent, true);
  assert.equal(report.samples[0].identicalHtml, false);
});

test("audit fails on crawler-specific and slug-specific robots blocks", async () => {
  const sample = { slug: "monkey-bar-bali", expectation: "indexable", expectedH1: "The Monkey Bar" };
  const { fetchImpl } = makeFakeFetch({
    samples: [sample],
    mutate: (response) => response.pathname === "/robots.txt" && response.userAgent === T0_USER_AGENTS[2].value
      ? {
          ...response,
          body: [
            "User-agent: *",
            "Disallow: /places/monkey-bar-bali",
          ].join("\n"),
        }
      : response,
  });

  const report = await runT0IndexabilityAudit({
    fetchImpl,
    baseUrl: origin,
    manifest: { version: 1, samples: [sample] },
  });

  assert.equal(report.ok, false);
  const block = report.violations.find((violation) => violation.code === "ROBOTS_BLOCKED");
  assert.equal(block?.slug, sample.slug);
  assert.equal(block?.agent, "googlebot_smartphone");
});
