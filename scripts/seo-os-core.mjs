import { URL } from "node:url";
import {
  analyzeSeoHtml,
  hashSeoFingerprint,
  normalizeSeoUrl,
  seoContentFingerprint,
} from "./t0-indexability-core.mjs";

export const SEO_OS_SCHEMA_VERSION = 1;

export const SEO_OS_ROUTE_TYPES = Object.freeze([
  "home",
  "catalogue",
  "venue",
  "area_directory",
  "programmatic_area",
  "programmatic_intent",
  "area_hub",
  "area_collection",
  "collection_hub",
  "collection",
  "route",
  "offer_detail",
  "guide_hub",
  "planning_tool",
  "partner_b2b",
  "editorial",
]);

const ROUTE_TYPE_SET = new Set(SEO_OS_ROUTE_TYPES);

const INTENT_STATUSES = new Set(["active", "candidate", "blocked", "retired"]);
const CONFLICT_STATUSES = new Set(["clear", "needs_gsc_review", "confirmed_conflict"]);
const SOURCE_TIERS = new Set(["S0", "S1", "S1D", "S2", "S3", "S4"]);
const CLAIM_STATUSES = new Set([
  "draft",
  "verified",
  "needs_verification",
  "disputed",
  "expired",
]);
const MONTHLY_DECISIONS = new Set([
  "HOLD",
  "UPDATE",
  "MERGE",
  "EXPAND",
  "RETAIN",
  "RETIRE_REDIRECT",
]);
const DIRECT_VERIFICATION_TIERS = new Set(["S0", "S1", "S1D"]);
const FACT_VOLATILITY = new Set(["stable", "volatile"]);
const VOLATILE_FACT_FIELDS = new Set([
  "booking_conditions",
  "booking_difficulty",
  "day_pass",
  "hours",
  "menu",
  "opening_hours",
  "price",
  "transport_schedule",
]);

const TOURIST_AREA_SLUGS = new Set([
  "amed",
  "canggu",
  "jimbaran",
  "lovina",
  "munduk",
  "nusa-dua",
  "nusa-penida",
  "sanur",
  "seminyak",
  "sidemen",
  "ubud",
  "uluwatu",
]);

const PARTNER_PATHS = new Set([
  "/for-venues",
  "/hotels",
  "/list-your-property",
  "/villas",
]);

const PLANNING_TOOL_PATHS = new Set(["/my-day", "/plan"]);

function xmlDecode(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

export function normalizeOrigin(value) {
  const url = new URL(value);
  url.hash = "";
  url.search = "";
  url.pathname = "";
  return url.toString().replace(/\/$/, "");
}

export function classifySeoPath(pathname) {
  if (pathname === "/") return "home";
  if (pathname === "/places") return "catalogue";
  if (pathname.startsWith("/places/")) return "venue";
  if (pathname === "/bali") return "area_directory";
  if (pathname === "/collections") return "collection_hub";
  if (pathname.startsWith("/collections/")) return "collection";
  if (pathname.startsWith("/route/")) return "route";
  if (pathname.startsWith("/brunches/") || pathname.startsWith("/day-passes/")) {
    return "offer_detail";
  }
  if (pathname === "/guides") return "guide_hub";
  if (PARTNER_PATHS.has(pathname)) return "partner_b2b";
  if (PLANNING_TOOL_PATHS.has(pathname)) return "planning_tool";

  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "bali") {
    return segments.length >= 3 ? "programmatic_intent" : "programmatic_area";
  }
  if (TOURIST_AREA_SLUGS.has(segments[0])) {
    return segments.length === 1 ? "area_hub" : "area_collection";
  }
  return "editorial";
}

export function parseSitemapLocations(xml, { expectedOrigin } = {}) {
  if (typeof xml !== "string" || !xml.includes("<urlset")) {
    throw new Error("Expected a sitemap urlset XML document");
  }

  const normalizedExpectedOrigin = expectedOrigin ? normalizeOrigin(expectedOrigin) : null;
  const observed = [];
  const seen = new Set();
  const duplicates = [];
  const foreignOrigins = [];
  const locPattern = /<loc>\s*([^<]+?)\s*<\/loc>/gu;

  for (const match of xml.matchAll(locPattern)) {
    const value = xmlDecode(match[1].trim());
    const url = new URL(value);
    url.hash = "";
    if (normalizedExpectedOrigin && url.origin !== normalizedExpectedOrigin) {
      foreignOrigins.push(url.toString());
    }
    if (url.pathname !== "/") url.pathname = url.pathname.replace(/\/+$/u, "");
    const normalized = url.pathname === "/" && !url.search ? url.origin : url.toString();
    if (seen.has(normalized)) {
      duplicates.push(normalized);
      continue;
    }
    seen.add(normalized);
    observed.push(normalized);
  }

  if (observed.length === 0) throw new Error("Sitemap contains no <loc> entries");
  return { locations: observed, duplicates, foreignOrigins };
}

export function buildShadowPageRegistry({
  locations,
  sourceSitemap,
  generatedAt = new Date().toISOString(),
}) {
  const entries = locations.map((value) => {
    const url = new URL(value);
    return {
      sitemap_url: value,
      pathname: url.pathname,
      route_type: classifySeoPath(url.pathname),
      sitemap_included: true,
      declared_index_intent: "indexable",
      observed_index_state: "unknown",
      os_gate_status: "shadow_unreviewed",
      intent_id: null,
      owner: null,
      review_due_at: null,
      notes: null,
    };
  });

  return {
    schema_version: SEO_OS_SCHEMA_VERSION,
    mode: "shadow",
    generated_at: generatedAt,
    source_sitemap: sourceSitemap,
    counts: summarizeRoutes(entries),
    entries,
  };
}

export function mergePageRegistryAnnotations(freshRegistry, existingRegistry) {
  if (!existingRegistry?.entries) return freshRegistry;
  const previousByUrl = new Map(
    existingRegistry.entries.map((entry) => [entry.sitemap_url, entry]),
  );
  const preservedFields = [
    "os_gate_status",
    "intent_id",
    "owner",
    "review_due_at",
    "observed_index_state",
    "notes",
  ];
  const freshUrls = new Set(freshRegistry.entries.map((entry) => entry.sitemap_url));
  const tombstones = existingRegistry.entries
    .filter((entry) => !freshUrls.has(entry.sitemap_url))
    .map((entry) => ({
      ...entry,
      sitemap_included: false,
      os_gate_status: "refresh_due",
    }));
  return {
    ...freshRegistry,
    entries: [
      ...freshRegistry.entries.map((entry) => {
        const previous = previousByUrl.get(entry.sitemap_url);
        if (!previous) return entry;
        return Object.fromEntries([
          ...Object.entries(entry),
          ...preservedFields
            .filter((field) => Object.hasOwn(previous, field))
            .map((field) => [field, previous[field]]),
        ]);
      }),
      ...tombstones,
    ],
  };
}

export function summarizeRoutes(entries) {
  const byRouteType = {};
  for (const entry of entries) {
    byRouteType[entry.route_type] = (byRouteType[entry.route_type] ?? 0) + 1;
  }
  return {
    total: entries.length,
    by_route_type: Object.fromEntries(
      Object.entries(byRouteType).sort(([left], [right]) => left.localeCompare(right)),
    ),
  };
}

function isIsoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function isIsoMonth(value) {
  return typeof value === "string" && /^\d{4}-(?:0[1-9]|1[0-2])$/u.test(value);
}

export function currentProjectDate(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en", {
      timeZone: "Asia/Makassar",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(now)
      .filter(({ type }) => ["year", "month", "day"].includes(type))
      .map(({ type, value }) => [type, value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function validatePageRegistry(registry, { asOf = currentProjectDate() } = {}) {
  const errors = [];
  if (!isIsoDate(asOf)) return ["asOf must be YYYY-MM-DD"];
  if (!registry || typeof registry !== "object") return ["registry must be an object"];
  if (registry.schema_version !== SEO_OS_SCHEMA_VERSION) {
    errors.push(`schema_version must be ${SEO_OS_SCHEMA_VERSION}`);
  }
  if (!Array.isArray(registry.entries)) return [...errors, "entries must be an array"];

  let expectedOrigin = null;
  try {
    const sourceSitemap = new URL(registry.source_sitemap);
    if (sourceSitemap.protocol !== "https:" || sourceSitemap.pathname !== "/sitemap.xml") {
      errors.push("source_sitemap must be an HTTPS /sitemap.xml URL");
    }
    expectedOrigin = sourceSitemap.origin;
  } catch {
    errors.push("source_sitemap must be an absolute URL");
  }

  const urls = new Set();
  for (const [index, entry] of registry.entries.entries()) {
    const prefix = `entries[${index}]`;
    let parsed;
    try {
      parsed = new URL(entry.sitemap_url);
    } catch {
      errors.push(`${prefix}.sitemap_url must be an absolute URL`);
      continue;
    }
    if (parsed.protocol !== "https:") errors.push(`${prefix}.sitemap_url must use https`);
    if (parsed.username || parsed.password) {
      errors.push(`${prefix}.sitemap_url must not contain credentials`);
    }
    if (expectedOrigin && parsed.origin !== expectedOrigin) {
      errors.push(`${prefix}.sitemap_url must use the registry origin`);
    }
    if (parsed.search) errors.push(`${prefix}.sitemap_url must not contain a query string`);
    if (urls.has(entry.sitemap_url)) errors.push(`${prefix}.sitemap_url is duplicated`);
    urls.add(entry.sitemap_url);
    if (entry.pathname !== parsed.pathname) errors.push(`${prefix}.pathname does not match sitemap_url`);
    if (!ROUTE_TYPE_SET.has(entry.route_type)) errors.push(`${prefix}.route_type is not allowed`);
    if (typeof entry.sitemap_included !== "boolean") {
      errors.push(`${prefix}.sitemap_included must be boolean`);
    }
    if (!["indexable", "noindex"].includes(entry.declared_index_intent)) {
      errors.push(`${prefix}.declared_index_intent is not allowed`);
    }
    if (entry.sitemap_included === true && entry.declared_index_intent !== "indexable") {
      errors.push(`${prefix}.sitemap URL must declare indexable intent`);
    }
    if (!["unknown", "technical_sample_passed", "gsc_indexed"].includes(entry.observed_index_state)) {
      errors.push(`${prefix}.observed_index_state is not allowed`);
    }
    if (!["shadow_unreviewed", "approved", "blocked", "refresh_due"].includes(entry.os_gate_status)) {
      errors.push(`${prefix}.os_gate_status is not allowed`);
    }
    if (entry.os_gate_status === "approved") {
      if (!entry.intent_id) errors.push(`${prefix}.intent_id is required when approved`);
      if (!entry.owner) errors.push(`${prefix}.owner is required when approved`);
      if (!isIsoDate(entry.review_due_at)) {
        errors.push(`${prefix}.review_due_at must be YYYY-MM-DD when approved`);
      } else if (entry.review_due_at < asOf) {
        errors.push(`${prefix}.review_due_at is expired`);
      }
    }
  }
  return errors;
}

export function validateIntentRegistry(registry, pageRegistry) {
  const errors = [];
  if (!registry || typeof registry !== "object") return ["intent registry must be an object"];
  if (registry.schema_version !== SEO_OS_SCHEMA_VERSION) {
    errors.push(`intent registry schema_version must be ${SEO_OS_SCHEMA_VERSION}`);
  }
  if (!Array.isArray(registry.entries)) return [...errors, "intent entries must be an array"];

  const ids = new Set();
  const activeOwners = new Map();
  const knownPages = new Map(
    pageRegistry?.entries?.map((entry) => [entry.sitemap_url, entry]) ?? [],
  );

  for (const [index, entry] of registry.entries.entries()) {
    const prefix = `intent.entries[${index}]`;
    if (!entry.intent_id) errors.push(`${prefix}.intent_id is required`);
    else if (ids.has(entry.intent_id)) errors.push(`${prefix}.intent_id is duplicated`);
    else ids.add(entry.intent_id);
    if (!entry.intent_key) errors.push(`${prefix}.intent_key is required`);
    if (!entry.owner_url) errors.push(`${prefix}.owner_url is required`);
    else if (knownPages.size && !knownPages.has(entry.owner_url)) {
      errors.push(`${prefix}.owner_url is absent from the page registry`);
    }
    if (!INTENT_STATUSES.has(entry.status)) {
      errors.push(`${prefix}.status is not allowed`);
    }
    if (!CONFLICT_STATUSES.has(entry.conflict_status)) {
      errors.push(`${prefix}.conflict_status is not allowed`);
    }
    if (typeof entry.indexable !== "boolean") {
      errors.push(`${prefix}.indexable must be boolean`);
    }
    if (entry.status === "active" && entry.indexable === true && !entry.differentiation_note) {
      errors.push(`${prefix}.differentiation_note is required for an active owner`);
    }
    if (entry.status === "active" && entry.indexable === true) {
      const ownerPage = knownPages.get(entry.owner_url);
      if (ownerPage && ownerPage.intent_id !== entry.intent_id) {
        errors.push(`${prefix}.owner_url is not linked to this intent_id in the page registry`);
      }
      if (ownerPage && (!ownerPage.owner || !isIsoDate(ownerPage.review_due_at))) {
        errors.push(`${prefix}.owner_url requires an owner and review_due_at in the page registry`);
      }
      if (ownerPage && ownerPage.sitemap_included !== true) {
        errors.push(`${prefix}.active indexable owner_url must be included in the sitemap`);
      }
    }
    if (entry.status === "active" && entry.indexable === true) {
      const previous = activeOwners.get(entry.intent_key);
      if (previous) {
        errors.push(`${prefix}.intent_key already belongs to ${previous}`);
      } else {
        activeOwners.set(entry.intent_key, entry.owner_url);
      }
    }
  }

  const intentsById = new Map(registry.entries.map((entry) => [entry.intent_id, entry]));
  for (const [index, page] of (pageRegistry?.entries ?? []).entries()) {
    if (page.os_gate_status !== "approved") continue;
    const intent = intentsById.get(page.intent_id);
    if (!intent) {
      errors.push(`page.entries[${index}] approved intent_id is absent from the intent registry`);
    } else if (
      intent.status !== "active" ||
      intent.indexable !== true ||
      intent.owner_url !== page.sitemap_url
    ) {
      errors.push(`page.entries[${index}] approved page must own an active indexable intent`);
    }
  }
  return errors;
}

export function validateEvidenceRegistry(
  registry,
  pageRegistry,
  { asOf = currentProjectDate() } = {},
) {
  const errors = [];
  if (!isIsoDate(asOf)) return ["asOf must be YYYY-MM-DD"];
  if (!registry || typeof registry !== "object") return ["evidence registry must be an object"];
  if (registry.schema_version !== SEO_OS_SCHEMA_VERSION) {
    errors.push(`evidence registry schema_version must be ${SEO_OS_SCHEMA_VERSION}`);
  }
  if (!Array.isArray(registry.entries)) return [...errors, "evidence entries must be an array"];
  if (!Array.isArray(registry.page_reviews)) {
    return [...errors, "evidence page_reviews must be an array"];
  }
  if (!isIsoDate(registry.updated_at)) {
    errors.push("evidence updated_at must be YYYY-MM-DD");
  } else if (registry.updated_at > asOf) {
    errors.push("evidence updated_at cannot be in the future");
  }

  const ids = new Set();
  const knownPages = new Map(
    pageRegistry?.entries?.map((entry) => [entry.sitemap_url, entry]) ?? [],
  );
  const reviewedUrls = new Set();
  for (const [index, review] of registry.page_reviews.entries()) {
    const prefix = `evidence.page_reviews[${index}]`;
    if (!review.page_url || (knownPages.size && !knownPages.has(review.page_url))) {
      errors.push(`${prefix}.page_url is absent from the page registry`);
    }
    if (reviewedUrls.has(review.page_url)) errors.push(`${prefix}.page_url is duplicated`);
    reviewedUrls.add(review.page_url);
    if (!["researching", "facts_verified", "expired"].includes(review.status)) {
      errors.push(`${prefix}.status is not allowed`);
    }
    if (review.status === "facts_verified") {
      if (!isIsoDate(review.verified_at)) {
        errors.push(`${prefix}.verified_at must be YYYY-MM-DD when facts_verified`);
      } else if (review.verified_at > asOf) {
        errors.push(`${prefix}.verified_at cannot be in the future`);
      }
      if (!review.verified_by) errors.push(`${prefix}.verified_by is required when facts_verified`);
      if (!Number.isInteger(review.verified_claim_count) || review.verified_claim_count < 1) {
        errors.push(`${prefix}.verified_claim_count must be a positive integer`);
      }
      if (!Number.isInteger(review.source_count) || review.source_count < 1) {
        errors.push(`${prefix}.source_count must be a positive integer`);
      }
    }
  }
  for (const [index, entry] of registry.entries.entries()) {
    const prefix = `evidence.entries[${index}]`;
    if (!entry.claim_id) errors.push(`${prefix}.claim_id is required`);
    else if (ids.has(entry.claim_id)) errors.push(`${prefix}.claim_id is duplicated`);
    else ids.add(entry.claim_id);
    if (!entry.page_url) {
      errors.push(`${prefix}.page_url is required`);
    } else if (knownPages.size && !knownPages.has(entry.page_url)) {
      errors.push(`${prefix}.page_url is absent from the page registry`);
    }
    if (!entry.field_name) errors.push(`${prefix}.field_name is required`);
    if (entry.claim_value === undefined || entry.claim_value === null || entry.claim_value === "") {
      errors.push(`${prefix}.claim_value is required`);
    }
    if (!["fact", "interpretation"].includes(entry.fact_or_interpretation)) {
      errors.push(`${prefix}.fact_or_interpretation is not allowed`);
    }
    if (
      entry.fact_or_interpretation === "fact" &&
      !FACT_VOLATILITY.has(entry.volatility)
    ) {
      errors.push(`${prefix}.volatility must be stable or volatile for a factual claim`);
    }
    if (
      entry.fact_or_interpretation === "fact" &&
      VOLATILE_FACT_FIELDS.has(entry.field_name) &&
      entry.volatility !== "volatile"
    ) {
      errors.push(`${prefix}.volatility must be volatile for ${entry.field_name}`);
    }
    if (!SOURCE_TIERS.has(entry.source_tier)) errors.push(`${prefix}.source_tier is not allowed`);
    if (!CLAIM_STATUSES.has(entry.claim_status)) errors.push(`${prefix}.claim_status is not allowed`);
    if (entry.claim_status === "verified") {
      if (!DIRECT_VERIFICATION_TIERS.has(entry.source_tier)) {
        errors.push(`${prefix}.${entry.source_tier} cannot verify a claim without a direct source`);
      }
      if (entry.source_tier === "S1D") {
        if (!entry.source_ref) {
          errors.push(`${prefix}.source_ref is required for direct verification`);
        }
        if (entry.source_url) {
          try {
            const source = new URL(entry.source_url);
            if (source.protocol !== "https:") errors.push(`${prefix}.source_url must use https`);
          } catch {
            errors.push(`${prefix}.source_url must be an absolute URL when provided`);
          }
        }
      } else {
        try {
          const source = new URL(entry.source_url);
          if (source.protocol !== "https:") errors.push(`${prefix}.source_url must use https`);
        } catch {
          errors.push(`${prefix}.source_url must be an absolute URL when verified`);
        }
      }
      if (!isIsoDate(entry.source_date)) {
        errors.push(`${prefix}.source_date must be YYYY-MM-DD when verified`);
      } else if (entry.source_date > asOf) {
        errors.push(`${prefix}.source_date cannot be in the future`);
      }
      if (!isIsoDate(entry.verified_at)) {
        errors.push(`${prefix}.verified_at must be YYYY-MM-DD when verified`);
      } else if (entry.verified_at > asOf) {
        errors.push(`${prefix}.verified_at cannot be in the future`);
      }
      if (!entry.verified_by) errors.push(`${prefix}.verified_by is required when verified`);
      if (!entry.verification_method) {
        errors.push(`${prefix}.verification_method is required when verified`);
      }
      if (entry.volatility === "volatile" && !isIsoDate(entry.valid_until)) {
        errors.push(`${prefix}.valid_until is required for a volatile verified fact`);
      } else if (
        entry.volatility === "volatile" &&
        isIsoDate(entry.valid_until) &&
        entry.valid_until < asOf
      ) {
        errors.push(`${prefix}.valid_until is expired`);
      }
    }
  }
  return errors;
}

export function validateRedirectRegistry(registry, pageRegistry) {
  const errors = [];
  if (!registry || typeof registry !== "object") return ["redirect registry must be an object"];
  if (registry.schema_version !== SEO_OS_SCHEMA_VERSION) {
    errors.push(`redirect registry schema_version must be ${SEO_OS_SCHEMA_VERSION}`);
  }
  if (!Array.isArray(registry.entries)) return [...errors, "redirect entries must be an array"];

  const oldUrls = new Set();
  const redirectMap = new Map();
  const knownPages = new Map(
    pageRegistry?.entries?.map((entry) => [entry.sitemap_url, entry]) ?? [],
  );
  let expectedOrigin = null;
  try {
    expectedOrigin = pageRegistry?.source_sitemap
      ? new URL(pageRegistry.source_sitemap).origin
      : null;
  } catch {
    expectedOrigin = null;
  }
  for (const [index, entry] of registry.entries.entries()) {
    const prefix = `redirect.entries[${index}]`;
    for (const field of ["old_url", "new_url"]) {
      try {
        const parsed = new URL(entry[field]);
        if (parsed.protocol !== "https:") errors.push(`${prefix}.${field} must use https`);
        if (expectedOrigin && parsed.origin !== expectedOrigin) {
          errors.push(`${prefix}.${field} must use the registry origin`);
        }
      } catch {
        errors.push(`${prefix}.${field} must be an absolute URL`);
      }
    }
    if (entry.old_url === entry.new_url) errors.push(`${prefix} cannot redirect a URL to itself`);
    if (![301, 308].includes(entry.redirect_code)) {
      errors.push(`${prefix}.redirect_code must be 301 or 308`);
    }
    if (!["proposed", "approved", "deployed", "rolled_back"].includes(entry.status)) {
      errors.push(`${prefix}.status is not allowed`);
    }
    if (["approved", "deployed"].includes(entry.status)) {
      if (!entry.approved_by) errors.push(`${prefix}.approved_by is required when approved`);
      if (!isIsoDate(entry.approved_at)) {
        errors.push(`${prefix}.approved_at must be YYYY-MM-DD when approved`);
      }
    }
    if (entry.status !== "rolled_back") {
      if (oldUrls.has(entry.old_url)) errors.push(`${prefix}.old_url is duplicated`);
      oldUrls.add(entry.old_url);
      redirectMap.set(entry.old_url, entry.new_url);
    }
    if (entry.status === "deployed") {
      const oldPage = knownPages.get(entry.old_url);
      const newPage = knownPages.get(entry.new_url);
      if (!oldPage || oldPage.sitemap_included !== false) {
        errors.push(`${prefix}.old_url must exist as a sitemap-excluded tombstone when deployed`);
      }
      if (!newPage || newPage.sitemap_included !== true) {
        errors.push(`${prefix}.new_url must be an active sitemap URL when deployed`);
      }
      if (!isIsoDate(entry.deployed_at)) {
        errors.push(`${prefix}.deployed_at must be YYYY-MM-DD when deployed`);
      }
    }
  }
  for (const [oldUrl, newUrl] of redirectMap) {
    if (redirectMap.has(newUrl)) {
      errors.push(`redirect chain is not allowed: ${oldUrl} -> ${newUrl}`);
    }
  }
  return errors;
}

export function validateApprovedPageEvidence(
  pageRegistry,
  evidenceRegistry,
  { asOf = currentProjectDate() } = {},
) {
  const errors = [];
  if (!isIsoDate(asOf)) return ["asOf must be YYYY-MM-DD"];
  const verifiedFactsByPage = new Map();
  for (const claim of evidenceRegistry?.entries ?? []) {
    if (claim.claim_status !== "verified" || claim.fact_or_interpretation !== "fact") continue;
    if (
      claim.volatility === "volatile" &&
      (!isIsoDate(claim.valid_until) || claim.valid_until < asOf)
    ) {
      continue;
    }
    if (!FACT_VOLATILITY.has(claim.volatility)) continue;
    if (VOLATILE_FACT_FIELDS.has(claim.field_name) && claim.volatility !== "volatile") continue;
    verifiedFactsByPage.set(claim.page_url, (verifiedFactsByPage.get(claim.page_url) ?? 0) + 1);
  }
  const pageReviews = new Map(
    (evidenceRegistry?.page_reviews ?? []).map((review) => [review.page_url, review]),
  );
  for (const [index, page] of (pageRegistry?.entries ?? []).entries()) {
    if (page.os_gate_status !== "approved") continue;
    if (!verifiedFactsByPage.has(page.sitemap_url)) {
      errors.push(`page.entries[${index}] approved page requires at least one verified factual claim`);
    }
    if (pageReviews.get(page.sitemap_url)?.status !== "facts_verified") {
      errors.push(`page.entries[${index}] approved page requires a facts_verified page review`);
    }
  }
  return errors;
}

export function validateMonthlyDecisionLog(registry, pageRegistry) {
  const errors = [];
  if (!registry || typeof registry !== "object") return ["monthly decision log must be an object"];
  if (registry.schema_version !== SEO_OS_SCHEMA_VERSION) {
    errors.push(`monthly decision log schema_version must be ${SEO_OS_SCHEMA_VERSION}`);
  }
  if (!Array.isArray(registry.entries)) return [...errors, "monthly decision entries must be an array"];

  const keys = new Set();
  const knownUrls = new Set(pageRegistry?.entries?.map((entry) => entry.sitemap_url) ?? []);
  for (const [index, entry] of registry.entries.entries()) {
    const prefix = `monthly.entries[${index}]`;
    if (!isIsoMonth(entry.review_month)) {
      errors.push(`${prefix}.review_month must be YYYY-MM`);
    }
    if (!entry.page_url || (knownUrls.size && !knownUrls.has(entry.page_url))) {
      errors.push(`${prefix}.page_url is absent from the page registry`);
    }
    const key = `${entry.review_month}|${entry.page_url}`;
    if (keys.has(key)) errors.push(`${prefix} duplicates a page/month decision`);
    keys.add(key);
    if (!MONTHLY_DECISIONS.has(entry.decision)) errors.push(`${prefix}.decision is not allowed`);
    if (!["proposed", "approved", "executed", "rejected"].includes(entry.status)) {
      errors.push(`${prefix}.status is not allowed`);
    }
    if (!entry.reason) errors.push(`${prefix}.reason is required`);
    if (!entry.owner_role) errors.push(`${prefix}.owner_role is required`);
    if (["approved", "executed"].includes(entry.status)) {
      if (!entry.approved_by) errors.push(`${prefix}.approved_by is required when approved`);
      if (!isIsoDate(entry.approved_at)) {
        errors.push(`${prefix}.approved_at must be YYYY-MM-DD when approved`);
      }
    }
    if (entry.status === "executed" && !isIsoDate(entry.completed_at)) {
      errors.push(`${prefix}.completed_at must be YYYY-MM-DD when executed`);
    }
  }
  return errors;
}

function readAttribute(tag, name) {
  const pattern = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "iu");
  const match = tag.match(pattern);
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
}

export function inspectHtmlDocument({ url, finalUrl = url, status, headers = {}, html }) {
  const xRobotsTag = headers["x-robots-tag"] ?? headers["X-Robots-Tag"] ?? "";
  const analysis = analyzeSeoHtml(html, url, xRobotsTag);
  const canonical = analysis.canonicals[0] ?? null;

  const schemaErrors = [];
  let schemaBlocks = 0;
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/giu)) {
    const type = readAttribute(`<script ${match[1]}>`, "type");
    if (type?.toLowerCase() !== "application/ld+json") continue;
    schemaBlocks += 1;
    try {
      JSON.parse(match[2]);
    } catch (error) {
      schemaErrors.push(error instanceof Error ? error.message : String(error));
    }
  }

  const expectedUrl = normalizeSeoUrl(url, url);
  const normalizedFinalUrl = normalizeSeoUrl(finalUrl, url);
  const canonicalMatches = analysis.canonicals.length === 1 && canonical === expectedUrl;
  const noindex = analysis.metaRobots.noindex || analysis.headerRobots.noindex;
  const nofollow = analysis.metaRobots.nofollow || analysis.headerRobots.nofollow;

  return {
    status,
    final_url: normalizedFinalUrl,
    final_url_matches: normalizedFinalUrl === expectedUrl,
    title: analysis.title || null,
    h1: analysis.h1 || null,
    canonical,
    canonical_count: analysis.canonicals.length,
    canonical_matches: canonicalMatches,
    noindex,
    nofollow,
    has_main: analysis.hasMain,
    main_text_length: analysis.textLength,
    useful_main: analysis.useful,
    content_fingerprint: hashSeoFingerprint(
      seoContentFingerprint({ status, finalUrl }, analysis, url),
    ),
    schema_blocks: schemaBlocks,
    schema_errors: schemaErrors,
  };
}

export function validateIndexableHtmlInspection(inspection) {
  const failures = [];
  if (inspection.status !== 200) failures.push(`HTTP ${inspection.status}`);
  if (!inspection.final_url_matches) failures.push("unexpected final URL");
  if (!inspection.title) failures.push("missing title");
  if (!inspection.h1) failures.push("missing H1");
  if (!inspection.useful_main) failures.push("missing useful server-rendered main content");
  if (inspection.canonical_count !== 1) failures.push("canonical is missing or not unique");
  if (!inspection.canonical_matches) failures.push("canonical mismatch");
  if (inspection.noindex) failures.push("unexpected noindex");
  if (inspection.nofollow) failures.push("unexpected nofollow");
  if (inspection.schema_blocks === 0) failures.push("missing JSON-LD");
  if (inspection.schema_errors.length) failures.push("invalid JSON-LD");
  return failures;
}

export function diffSitemapAndRegistry(locations, registry) {
  const live = new Set(locations);
  const recorded = new Set(
    registry.entries
      .filter((entry) => entry.sitemap_included === true)
      .map((entry) => entry.sitemap_url),
  );
  return {
    added_since_snapshot: [...live].filter((url) => !recorded.has(url)).sort(),
    removed_since_snapshot: [...recorded].filter((url) => !live.has(url)).sort(),
  };
}
