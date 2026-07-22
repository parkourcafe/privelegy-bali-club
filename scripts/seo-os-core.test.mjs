import assert from "node:assert/strict";
import test from "node:test";
import {
  buildShadowPageRegistry,
  classifySeoPath,
  currentProjectDate,
  diffSitemapAndRegistry,
  inspectHtmlDocument,
  mergePageRegistryAnnotations,
  parseSitemapLocations,
  validateApprovedPageEvidence,
  validateEvidenceRegistry,
  validateIntentRegistry,
  validateIndexableHtmlInspection,
  validateMonthlyDecisionLog,
  validatePageRegistry,
  validateRedirectRegistry,
} from "./seo-os-core.mjs";

const origin = "https://www.otherbali.com";

test("uses the Bali operating date at the UTC day boundary", () => {
  assert.equal(currentProjectDate(new Date("2026-07-21T16:30:00.000Z")), "2026-07-22");
});

test("classifies the existing SEO route families without inventing new URLs", () => {
  const cases = {
    "/": "home",
    "/places": "catalogue",
    "/places/jari-menari-seminyak": "venue",
    "/bali": "area_directory",
    "/bali/kuta-legian": "programmatic_area",
    "/bali/kuta-legian/sunset": "programmatic_intent",
    "/canggu": "area_hub",
    "/canggu/best-brunch": "area_collection",
    "/collections": "collection_hub",
    "/collections/work-friendly-cafes": "collection",
    "/route/first-day": "route",
    "/day-passes/example": "offer_detail",
    "/guides": "guide_hub",
    "/plan": "planning_tool",
    "/for-venues": "partner_b2b",
    "/first-time-in-bali": "editorial",
  };
  for (const [pathname, expected] of Object.entries(cases)) {
    assert.equal(classifySeoPath(pathname), expected, pathname);
  }
});

test("parses unique sitemap locations and reports duplicates and foreign origins", () => {
  const xml = `<?xml version="1.0"?><urlset>
    <url><loc>${origin}</loc></url>
    <url><loc>${origin}/places?a=1&amp;b=2</loc></url>
    <url><loc>${origin}</loc></url>
    <url><loc>https://other.example/page</loc></url>
  </urlset>`;
  const parsed = parseSitemapLocations(xml, { expectedOrigin: origin });
  assert.deepEqual(parsed.locations, [
    origin,
    `${origin}/places?a=1&b=2`,
    "https://other.example/page",
  ]);
  assert.deepEqual(parsed.duplicates, [origin]);
  assert.deepEqual(parsed.foreignOrigins, ["https://other.example/page"]);
});

test("builds a non-enforcing shadow registry", () => {
  const registry = buildShadowPageRegistry({
    locations: [origin, `${origin}/places/example`],
    sourceSitemap: `${origin}/sitemap.xml`,
    generatedAt: "2026-07-22T00:00:00.000Z",
  });
  assert.equal(registry.mode, "shadow");
  assert.deepEqual(registry.counts, {
    total: 2,
    by_route_type: { home: 1, venue: 1 },
  });
  assert.ok(registry.entries.every((entry) => entry.os_gate_status === "shadow_unreviewed"));
  assert.deepEqual(validatePageRegistry(registry, { asOf: "2026-07-22" }), []);
});

test("approved pages require an intent owner, human owner and review date", () => {
  const registry = buildShadowPageRegistry({
    locations: [origin],
    sourceSitemap: `${origin}/sitemap.xml`,
  });
  registry.entries[0].os_gate_status = "approved";
  const errors = validatePageRegistry(registry);
  assert.ok(errors.some((error) => error.includes("intent_id")));
  assert.ok(errors.some((error) => error.includes("owner")));
  assert.ok(errors.some((error) => error.includes("review_due_at")));
});

test("approved page review dates expire against the operating date, not snapshot metadata", () => {
  const registry = buildShadowPageRegistry({
    locations: [origin],
    sourceSitemap: `${origin}/sitemap.xml`,
    generatedAt: "2026-01-01T00:00:00.000Z",
  });
  Object.assign(registry.entries[0], {
    os_gate_status: "approved",
    intent_id: "home-start",
    owner: "SEO/Product Owner",
    review_due_at: "2026-07-21",
  });
  assert.ok(
    validatePageRegistry(registry, { asOf: "2026-07-22" })
      .some((error) => error.includes("review_due_at is expired")),
  );
});

test("page registry rejects URLs outside its sitemap origin", () => {
  const registry = buildShadowPageRegistry({
    locations: [origin],
    sourceSitemap: `${origin}/sitemap.xml`,
  });
  registry.entries[0].sitemap_url = "https://attacker.example";
  assert.ok(validatePageRegistry(registry).some((error) => error.includes("registry origin")));
});

test("page and intent schemas reject contradictory or weakly typed state", () => {
  const pageRegistry = buildShadowPageRegistry({
    locations: [origin],
    sourceSitemap: `${origin}/sitemap.xml`,
  });
  pageRegistry.entries[0].declared_index_intent = "noindex";
  assert.ok(
    validatePageRegistry(pageRegistry).some((error) => error.includes("must declare indexable")),
  );
  pageRegistry.entries[0].declared_index_intent = "indexable";
  pageRegistry.entries[0].intent_id = "home-start";
  pageRegistry.entries[0].owner = "SEO/Product Owner";
  pageRegistry.entries[0].review_due_at = "2026-99-99";
  pageRegistry.entries[0].os_gate_status = "approved";
  assert.ok(
    validatePageRegistry(pageRegistry).some((error) => error.includes("review_due_at")),
  );
  pageRegistry.entries[0].os_gate_status = "shadow_unreviewed";
  const errors = validateIntentRegistry({
    schema_version: 1,
    entries: [{
      intent_id: "home-start",
      intent_key: "province:bali|start|trip|orientation|general|planning",
      owner_url: origin,
      status: "active",
      indexable: "true",
      conflict_status: "clear",
      differentiation_note: "Homepage start decision",
    }],
  }, pageRegistry);
  assert.ok(errors.some((error) => error.includes("indexable must be boolean")));
});

test("intent registry rejects two active indexable owners for one intent", () => {
  const pageRegistry = buildShadowPageRegistry({
    locations: [origin, `${origin}/guides`],
    sourceSitemap: `${origin}/sitemap.xml`,
  });
  pageRegistry.entries[0].intent_id = "intent-a";
  pageRegistry.entries[0].owner = "SEO/Product Owner";
  pageRegistry.entries[0].review_due_at = "2026-08-22";
  pageRegistry.entries[1].intent_id = "intent-b";
  pageRegistry.entries[1].owner = "SEO/Product Owner";
  pageRegistry.entries[1].review_due_at = "2026-08-22";
  const intentRegistry = {
    schema_version: 1,
    entries: [
      {
        intent_id: "intent-a",
        intent_key: "bali|plan|first-trip|pre-arrival|general",
        owner_url: origin,
        status: "active",
        indexable: true,
        conflict_status: "clear",
        differentiation_note: "Primary owner",
      },
      {
        intent_id: "intent-b",
        intent_key: "bali|plan|first-trip|pre-arrival|general",
        owner_url: `${origin}/guides`,
        status: "active",
        indexable: true,
        conflict_status: "clear",
        differentiation_note: "Duplicate owner",
      },
    ],
  };
  assert.ok(
    validateIntentRegistry(intentRegistry, pageRegistry).some((error) => error.includes("already belongs")),
  );
});

test("reports sitemap drift without mutating the snapshot", () => {
  const registry = buildShadowPageRegistry({
    locations: [origin, `${origin}/guides`],
    sourceSitemap: `${origin}/sitemap.xml`,
  });
  assert.deepEqual(
    diffSitemapAndRegistry([origin, `${origin}/new-page`], registry),
    {
      added_since_snapshot: [`${origin}/new-page`],
      removed_since_snapshot: [`${origin}/guides`],
    },
  );
});

test("refreshing a snapshot preserves human governance annotations", () => {
  const existing = buildShadowPageRegistry({
    locations: [origin],
    sourceSitemap: `${origin}/sitemap.xml`,
    generatedAt: "2026-07-21T00:00:00.000Z",
  });
  existing.entries[0].intent_id = "home-start";
  existing.entries[0].owner = "SEO/Product Owner";
  existing.entries[0].review_due_at = "2026-08-22";
  const fresh = buildShadowPageRegistry({
    locations: [origin, `${origin}/guides`],
    sourceSitemap: `${origin}/sitemap.xml`,
    generatedAt: "2026-07-22T00:00:00.000Z",
  });
  const merged = mergePageRegistryAnnotations(fresh, existing);
  assert.equal(merged.generated_at, "2026-07-22T00:00:00.000Z");
  assert.equal(merged.entries[0].intent_id, "home-start");
  assert.equal(merged.entries[0].owner, "SEO/Product Owner");
  assert.equal(merged.entries[1].intent_id, null);
});

test("approved sitemap drift preserves removed URLs as audit tombstones", () => {
  const existing = buildShadowPageRegistry({
    locations: [origin, `${origin}/guides`],
    sourceSitemap: `${origin}/sitemap.xml`,
  });
  const fresh = buildShadowPageRegistry({
    locations: [origin],
    sourceSitemap: `${origin}/sitemap.xml`,
  });
  const merged = mergePageRegistryAnnotations(fresh, existing);
  assert.equal(merged.entries.length, 2);
  const tombstone = merged.entries.find((entry) => entry.sitemap_url === `${origin}/guides`);
  assert.equal(tombstone.sitemap_included, false);
  assert.equal(tombstone.declared_index_intent, "indexable");
  assert.equal(tombstone.os_gate_status, "refresh_due");
  assert.deepEqual(diffSitemapAndRegistry([origin], merged), {
    added_since_snapshot: [],
    removed_since_snapshot: [],
  });
});

test("validates empty evidence, redirect and monthly governance registries", () => {
  const pageRegistry = buildShadowPageRegistry({
    locations: [origin],
    sourceSitemap: `${origin}/sitemap.xml`,
  });
  assert.deepEqual(
    validateEvidenceRegistry({
      schema_version: 1,
      updated_at: "2026-07-22",
      page_reviews: [],
      entries: [],
    }, pageRegistry),
    [],
  );
  assert.deepEqual(validateRedirectRegistry({ schema_version: 1, entries: [] }, pageRegistry), []);
  assert.deepEqual(validateMonthlyDecisionLog({ schema_version: 1, entries: [] }, pageRegistry), []);
});

test("approved pages require an active intent and verified factual evidence", () => {
  const pageRegistry = buildShadowPageRegistry({
    locations: [origin],
    sourceSitemap: `${origin}/sitemap.xml`,
  });
  Object.assign(pageRegistry.entries[0], {
    os_gate_status: "approved",
    intent_id: "home-start",
    owner: "SEO/Product Owner",
    review_due_at: "2026-08-22",
  });
  const intentRegistry = {
    schema_version: 1,
    entries: [{
      intent_id: "home-start",
      intent_key: "province:bali|start|trip|orientation|general|planning",
      owner_url: origin,
      status: "active",
      indexable: true,
      conflict_status: "clear",
      differentiation_note: "Homepage start decision",
    }],
  };
  assert.deepEqual(validateIntentRegistry(intentRegistry, pageRegistry), []);
  assert.ok(
    validateApprovedPageEvidence(pageRegistry, { schema_version: 1, page_reviews: [], entries: [] })
      .some((error) => error.includes("verified factual claim")),
  );
  const evidenceRegistry = {
    schema_version: 1,
    updated_at: "2026-07-22",
    page_reviews: [{
      page_url: origin,
      status: "facts_verified",
      verified_at: "2026-07-22",
      verified_by: "Research Lead",
      verified_claim_count: 1,
      source_count: 1,
    }],
    entries: [{
      claim_id: "home-claim-1",
      page_url: origin,
      field_name: "publisher_identity",
      claim_value: "Other Bali",
      fact_or_interpretation: "fact",
      volatility: "stable",
      source_tier: "S1",
      source_url: origin,
      source_date: "2026-07-22",
      verified_at: "2026-07-22",
      verified_by: "Research Lead",
      verification_method: "official_site_review",
      claim_status: "verified",
    }],
  };
  assert.deepEqual(validateEvidenceRegistry(evidenceRegistry, pageRegistry), []);
  assert.deepEqual(validateApprovedPageEvidence(pageRegistry, evidenceRegistry), []);
});

test("redirect registry rejects chains even before deployment", () => {
  const pageRegistry = buildShadowPageRegistry({
    locations: [origin, `${origin}/guides`],
    sourceSitemap: `${origin}/sitemap.xml`,
  });
  const errors = validateRedirectRegistry({
    schema_version: 1,
    entries: [
      {
        old_url: `${origin}/old-a`,
        new_url: `${origin}/old-b`,
        redirect_code: 301,
        status: "proposed",
      },
      {
        old_url: `${origin}/old-b`,
        new_url: `${origin}/guides`,
        redirect_code: 301,
        status: "proposed",
      },
    ],
  }, pageRegistry);
  assert.ok(errors.some((error) => error.includes("chain is not allowed")));
});

test("deployed redirects require a tombstoned old URL and active target", () => {
  const pageRegistry = buildShadowPageRegistry({
    locations: [origin, `${origin}/guides`],
    sourceSitemap: `${origin}/sitemap.xml`,
  });
  const registry = {
    schema_version: 1,
    entries: [{
      old_url: origin,
      new_url: `${origin}/guides`,
      redirect_code: 301,
      status: "deployed",
      approved_by: "SEO/Product Owner",
      approved_at: "2026-07-21",
      deployed_at: "2026-07-22",
    }],
  };
  assert.ok(
    validateRedirectRegistry(registry, pageRegistry)
      .some((error) => error.includes("sitemap-excluded tombstone")),
  );
  pageRegistry.entries[0].sitemap_included = false;
  pageRegistry.entries[0].declared_index_intent = "noindex";
  assert.deepEqual(validateRedirectRegistry(registry, pageRegistry), []);
});

test("deployed redirects reject an unknown old URL and approval state requires metadata", () => {
  const pageRegistry = buildShadowPageRegistry({
    locations: [`${origin}/guides`],
    sourceSitemap: `${origin}/sitemap.xml`,
  });
  const deployedErrors = validateRedirectRegistry({
    schema_version: 1,
    entries: [{
      old_url: `${origin}/unknown-old-url`,
      new_url: `${origin}/guides`,
      redirect_code: 301,
      status: "deployed",
      approved_by: "SEO/Product Owner",
      approved_at: "2026-07-21",
      deployed_at: "2026-07-22",
    }],
  }, pageRegistry);
  assert.ok(deployedErrors.some((error) => error.includes("sitemap-excluded tombstone")));

  const approvedErrors = validateRedirectRegistry({
    schema_version: 1,
    entries: [{
      old_url: `${origin}/old-url`,
      new_url: `${origin}/guides`,
      redirect_code: 301,
      status: "approved",
    }],
  }, pageRegistry);
  assert.ok(approvedErrors.some((error) => error.includes("approved_by")));
  assert.ok(approvedErrors.some((error) => error.includes("approved_at")));
});

test("expired volatile facts fail validation and cannot approve a page", () => {
  const pageRegistry = buildShadowPageRegistry({
    locations: [origin],
    sourceSitemap: `${origin}/sitemap.xml`,
  });
  Object.assign(pageRegistry.entries[0], {
    os_gate_status: "approved",
    intent_id: "home-start",
    owner: "SEO/Product Owner",
    review_due_at: "2026-08-22",
  });
  const evidenceRegistry = {
    schema_version: 1,
    updated_at: "2026-07-01",
    page_reviews: [{
      page_url: origin,
      status: "facts_verified",
      verified_at: "2026-07-01",
      verified_by: "Research Lead",
      verified_claim_count: 1,
      source_count: 1,
    }],
    entries: [{
      claim_id: "expired-hours",
      page_url: origin,
      field_name: "hours",
      claim_value: "09:00-17:00",
      fact_or_interpretation: "fact",
      volatility: "volatile",
      source_tier: "S1",
      source_url: origin,
      source_date: "2026-07-01",
      verified_at: "2026-07-01",
      verified_by: "Research Lead",
      verification_method: "official_site_review",
      valid_until: "2026-07-21",
      claim_status: "verified",
    }],
  };
  assert.ok(
    validateEvidenceRegistry(evidenceRegistry, pageRegistry, { asOf: "2026-07-22" })
      .some((error) => error.includes("valid_until is expired")),
  );
  assert.ok(
    validateApprovedPageEvidence(pageRegistry, evidenceRegistry, { asOf: "2026-07-22" })
      .some((error) => error.includes("verified factual claim")),
  );
});

test("future evidence dates are rejected", () => {
  const pageRegistry = buildShadowPageRegistry({
    locations: [origin],
    sourceSitemap: `${origin}/sitemap.xml`,
  });
  const errors = validateEvidenceRegistry({
    schema_version: 1,
    updated_at: "2026-07-22",
    page_reviews: [{
      page_url: origin,
      status: "facts_verified",
      verified_at: "2026-07-23",
      verified_by: "Research Lead",
      verified_claim_count: 1,
      source_count: 1,
    }],
    entries: [{
      claim_id: "future-source",
      page_url: origin,
      field_name: "publisher_identity",
      claim_value: "Other Bali",
      fact_or_interpretation: "fact",
      volatility: "stable",
      source_tier: "S1",
      source_url: origin,
      source_date: "2026-07-23",
      verified_at: "2026-07-23",
      verified_by: "Research Lead",
      verification_method: "official_site_review",
      claim_status: "verified",
    }],
  }, pageRegistry, { asOf: "2026-07-22" });
  assert.ok(errors.filter((error) => error.includes("cannot be in the future")).length >= 3);
});

test("free-form factual fields require explicit volatility classification", () => {
  const pageRegistry = buildShadowPageRegistry({
    locations: [origin],
    sourceSitemap: `${origin}/sitemap.xml`,
  });
  Object.assign(pageRegistry.entries[0], {
    os_gate_status: "approved",
    intent_id: "home-start",
    owner: "SEO/Product Owner",
    review_due_at: "2026-08-22",
  });
  const evidenceRegistry = {
    schema_version: 1,
    updated_at: "2026-07-22",
    page_reviews: [{
      page_url: origin,
      status: "facts_verified",
      verified_at: "2026-07-22",
      verified_by: "Research Lead",
      verified_claim_count: 1,
      source_count: 1,
    }],
    entries: [{
      claim_id: "unclassified-price-range",
      page_url: origin,
      field_name: "price_range",
      claim_value: "IDR 100k-200k",
      fact_or_interpretation: "fact",
      source_tier: "S1",
      source_url: origin,
      source_date: "2026-07-22",
      verified_at: "2026-07-22",
      verified_by: "Research Lead",
      verification_method: "official_site_review",
      claim_status: "verified",
    }],
  };
  assert.ok(
    validateEvidenceRegistry(evidenceRegistry, pageRegistry, { asOf: "2026-07-22" })
      .some((error) => error.includes("volatility must be stable or volatile")),
  );
  assert.ok(
    validateApprovedPageEvidence(pageRegistry, evidenceRegistry, { asOf: "2026-07-22" })
      .some((error) => error.includes("verified factual claim")),
  );

  evidenceRegistry.entries[0].volatility = "volatile";
  assert.ok(
    validateEvidenceRegistry(evidenceRegistry, pageRegistry, { asOf: "2026-07-22" })
      .some((error) => error.includes("valid_until is required")),
  );
});

test("rejects AI output as verification evidence", () => {
  const pageRegistry = buildShadowPageRegistry({
    locations: [origin],
    sourceSitemap: `${origin}/sitemap.xml`,
  });
  const errors = validateEvidenceRegistry({
    schema_version: 1,
    updated_at: "2026-07-22",
    page_reviews: [],
    entries: [{
      claim_id: "claim-1",
      page_url: origin,
      field_name: "hours",
      claim_value: "09:00-17:00",
      fact_or_interpretation: "fact",
      volatility: "volatile",
      source_tier: "S4",
      source_url: "https://example.com",
      source_date: "2026-07-22",
      verified_at: "2026-07-22",
      verified_by: "editor",
      verification_method: "ai_output",
      valid_until: "2026-08-22",
      claim_status: "verified",
    }],
  }, pageRegistry);
  assert.ok(errors.some((error) => error.includes("cannot verify")));
});

test("accepts a direct-verification artifact without inventing a public URL", () => {
  const pageRegistry = buildShadowPageRegistry({
    locations: [origin],
    sourceSitemap: `${origin}/sitemap.xml`,
  });
  const errors = validateEvidenceRegistry({
    schema_version: 1,
    updated_at: "2026-07-22",
    page_reviews: [],
    entries: [{
      claim_id: "direct-claim-1",
      page_url: origin,
      field_name: "accessibility",
      claim_value: "Step-free entrance confirmed",
      fact_or_interpretation: "fact",
      volatility: "stable",
      source_tier: "S1D",
      source_ref: "field-note-2026-07-22-001",
      source_date: "2026-07-22",
      verified_at: "2026-07-22",
      verified_by: "Research Lead",
      verification_method: "site_visit",
      claim_status: "verified",
    }],
  }, pageRegistry);
  assert.deepEqual(errors, []);
});

test("inspects canonical, robots and JSON-LD in server-rendered HTML", () => {
  const report = inspectHtmlDocument({
    url: `${origin}/guides`,
    status: 200,
    headers: {},
    html: `<html><head><title>Guides</title><link href="${origin}/guides" rel="canonical"><script type="application/ld+json">{"@type":"WebPage"}</script></head><body><h1>Guides</h1></body></html>`,
  });
  assert.equal(report.title, "Guides");
  assert.equal(report.h1, "Guides");
  assert.equal(report.canonical_matches, true);
  assert.equal(report.final_url_matches, true);
  assert.equal(report.noindex, false);
  assert.equal(report.nofollow, false);
  assert.equal(report.schema_blocks, 1);
  assert.deepEqual(report.schema_errors, []);
});

test("treats robots none as both noindex and nofollow", () => {
  const report = inspectHtmlDocument({
    url: origin,
    status: 200,
    headers: { "x-robots-tag": "none" },
    html: `<html><head><title>Home</title><link rel="canonical" href="${origin}"></head><body><h1>Home</h1></body></html>`,
  });
  assert.equal(report.noindex, true);
  assert.equal(report.nofollow, true);
  assert.equal(report.final_url_matches, true);
});

test("technical HTML gate requires at least one valid JSON-LD block", () => {
  const report = inspectHtmlDocument({
    url: origin,
    status: 200,
    headers: {},
    html: `<html><head><title>Other Bali</title><link rel="canonical" href="${origin}"></head><body><main><h1>Other Bali</h1><p>${"Useful planning copy. ".repeat(30)}</p></main></body></html>`,
  });
  assert.deepEqual(validateIndexableHtmlInspection(report), ["missing JSON-LD"]);
});
