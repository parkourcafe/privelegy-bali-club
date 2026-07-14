import {
  hasErrors,
  isJsonValue,
  isRecord,
  makeIssue,
  normalizedText,
  type JsonValue,
  type ValidationIssue,
  type ValidationRecordRef,
  type ValidationResult,
} from "./common";

export const VENUE_TYPES = [
  "bar",
  "beach_club",
  "beauty",
  "cafe",
  "fitness",
  "restaurant",
  "spa",
  "surf",
  "warung",
  "yoga",
] as const;

export type VenueType = (typeof VENUE_TYPES)[number];

export const KNOWN_DISTRICTS = [
  "amed",
  "canggu",
  "gili-islands",
  "jimbaran",
  "kuta-legian",
  "lombok",
  "lovina",
  "munduk",
  "nusa-dua",
  "nusa-islands",
  "sanur",
  "seminyak",
  "sidemen",
  "ubud",
  "uluwatu-bukit",
] as const;

export type KnownDistrict = (typeof KNOWN_DISTRICTS)[number];

export const EDITORIAL_STATUSES = ["draft", "review", "published", "archived"] as const;
export type EditorialStatus = (typeof EDITORIAL_STATUSES)[number];

export const PHOTO_STATUSES = [
  "missing",
  "needs_verification",
  "approved_no_photo",
  "approved",
  "published",
  "rejected",
] as const;
export type PhotoStatus = (typeof PHOTO_STATUSES)[number];

export const PRICE_BANDS = ["$", "$$", "$$$", "$$$$"] as const;
export type PriceBand = (typeof PRICE_BANDS)[number];

const MEAL_PERIODS = new Set(["breakfast", "brunch", "lunch", "dinner", "late_night", "all_day"]);
const VENUE_TYPE_SET = new Set<string>(VENUE_TYPES);
const DISTRICT_SET = new Set<string>(KNOWN_DISTRICTS);
const EDITORIAL_STATUS_SET = new Set<string>(EDITORIAL_STATUSES);
const PHOTO_STATUS_SET = new Set<string>(PHOTO_STATUSES);
const PRICE_BAND_SET = new Set<string>(PRICE_BANDS);
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TAXONOMY_TOKEN_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;
const GOOGLE_PLACE_ID_PATTERN = /^[A-Za-z0-9_-]{8,255}$/;
const DRAFT_OFFER_PATTERN = /\b(?:draft offer|proposed perk|partner negotiation|terms require(?: partner)? (?:approval|negotiation))\b/i;

export const VENUE_ANON_AUDIT_COLUMNS = [
  "id",
  "slug",
  "name",
  "category",
  "district",
  "address",
  "gmaps_url",
  "tier",
  "is_sponsored",
  "status",
  "vibe_tags",
  "price_anchor",
  "what_to_order",
  "photo_url",
  "area",
  "why_its_here",
  "best_for",
  "not_for",
  "practical_tags",
  "jobs",
  "owner_note",
  "publication_status",
  "wellness_categories",
  "opening_hours",
  "last_verified_at",
  "venue_type",
  "subarea",
  "full_address",
  "latitude",
  "longitude",
  "google_place_id",
  "price_min_idr",
  "price_max_idr",
  "price_band",
  "opening_hours_json",
  "verified_at",
  "verification_source",
  "editorial_status",
  "occasions",
  "meal_periods",
  "photo_status",
] as const;

export interface NormalizedVenuePhoto {
  id: string | null;
  url: string | null;
  storagePath: string | null;
  rightsBasis: string | null;
  rightsHolder: string | null;
  creditLine: string | null;
  altText: string | null;
  isPrimary: boolean;
  verifiedAt: string | null;
  status: PhotoStatus;
}

export interface VenueBookingMethod {
  type: string;
  url: string;
}

export interface NormalizedVenue {
  id: string;
  slug: string;
  name: string;
  venueType: VenueType;
  district: KnownDistrict;
  subarea: string | null;
  fullAddress: string | null;
  latitude: number | null;
  longitude: number | null;
  googlePlaceId: string | null;
  gmapsUrl: string | null;
  officialUrl: string | null;
  instagramUrl: string | null;
  priceMinIdr: number | null;
  priceMaxIdr: number | null;
  priceBand: PriceBand | null;
  priceAnchor: string | null;
  openingHours: JsonValue | null;
  verifiedAt: string | null;
  verificationSource: string | null;
  editorialStatus: EditorialStatus;
  operationalStatus: string;
  whyItsHere: string | null;
  bestFor: string | null;
  notFor: string | null;
  practicalTags: string[];
  occasions: string[];
  mealPeriods: string[];
  vibes: string[];
  photos: NormalizedVenuePhoto[];
  photoStatus: PhotoStatus;
  bookingMethods: VenueBookingMethod[];
  isSponsored: boolean;
}

export type PublishedVenue = NormalizedVenue & {
  gmapsUrl: string;
  verifiedAt: string;
  verificationSource: string;
  editorialStatus: "published";
  whyItsHere: string;
  bestFor: string;
};

export const LEGACY_VENUE_TIERS = ["editorial_seed", "launch", "founding"] as const;
export type LegacyVenueTier = (typeof LEGACY_VENUE_TIERS)[number];

const LEGACY_VENUE_TIER_SET = new Set<string>(LEGACY_VENUE_TIERS);
const LEGACY_PUBLICATION_STATUS_SET = new Set(["published", "review"]);

// Typed shape of only the already-deployed columns read by lib/data.ts. This
// transitional parser is a runtime-safety boundary; it is deliberately not a
// substitute for the stricter normalized publication audit below.
export interface LegacyVenueRow {
  id: string;
  slug: string;
  name: string;
  category: VenueType;
  district: KnownDistrict;
  address: string | null;
  gmaps_url: string | null;
  official_url: string | null;
  instagram_url: string | null;
  tier: LegacyVenueTier;
  status: string;
  is_sponsored: boolean;
  vibe_tags: string[] | null;
  price_anchor: string | null;
  what_to_order: string | null;
  photo_url: string | null;
  area: string | null;
  why_its_here: string | null;
  best_for: string | null;
  not_for: string | null;
  practical_tags: string[] | null;
  jobs: string[] | null;
  owner_note: string | null;
  publication_status: "published" | "review" | null;
  wellness_categories: VenueType[] | null;
}

export type LegacyPublicVenueRow = LegacyVenueRow & {
  status: "active";
  publication_status: "published";
};

export interface VenueRowValidation {
  normalized: NormalizedVenue | null;
  published: PublishedVenue | null;
  issues: ValidationIssue[];
}

function legacyRequiredText(
  row: Record<string, unknown>,
  keys: string[],
  path: string,
  issues: ValidationIssue[],
  ref: ValidationRecordRef,
): string | null {
  const value = field(row, ...keys);
  if (typeof value !== "string") {
    issues.push(makeIssue(
      `venue.${path}.invalid_type`,
      path,
      `${path} must be a string`,
      "raw",
      "error",
      ref,
    ));
    return null;
  }
  const text = normalizedText(value);
  if (!text) {
    issues.push(makeIssue(
      `venue.${path}.required`,
      path,
      `${path} must be a non-empty string`,
      "raw",
      "error",
      ref,
    ));
  }
  return text;
}

function legacyOptionalText(
  row: Record<string, unknown>,
  keys: string[],
  path: string,
  issues: ValidationIssue[],
  ref: ValidationRecordRef,
): string | null {
  const value = field(row, ...keys);
  if (value == null) return null;
  if (typeof value !== "string") {
    issues.push(makeIssue(
      `venue.${path}.invalid_type`,
      path,
      `${path} must be a string or null`,
      "raw",
      "error",
      ref,
    ));
    return null;
  }
  return normalizedText(value);
}

function legacyTextArray(
  row: Record<string, unknown>,
  keys: string[],
  path: string,
  issues: ValidationIssue[],
  ref: ValidationRecordRef,
  allowed?: Set<string>,
): string[] | null {
  const value = field(row, ...keys);
  if (value == null) return null;
  if (!Array.isArray(value)) {
    issues.push(makeIssue(
      `venue.${path}.invalid_type`,
      path,
      `${path} must be an array or null`,
      "raw",
      "error",
      ref,
    ));
    return null;
  }
  const result: string[] = [];
  value.forEach((item, index) => {
    const text = normalizedText(item);
    if (!text || (allowed && !allowed.has(text))) {
      issues.push(makeIssue(
        `venue.${path}.item_invalid`,
        `${path}[${index}]`,
        `${path}[${index}] must be a supported non-empty string`,
        "raw",
        "error",
        ref,
      ));
      return;
    }
    result.push(text);
  });
  return result;
}

export function parseLegacyVenueRow(
  input: unknown,
  index?: number,
): ValidationResult<LegacyVenueRow> {
  if (!isRecord(input)) {
    return {
      ok: false,
      data: null,
      issues: [makeIssue("venue.input.not_object", "$", "venue row must be an object", "raw", "error", {
        id: null,
        slug: null,
        ...(index === undefined ? {} : { index }),
      })],
    };
  }

  const issues: ValidationIssue[] = [];
  const ref = recordRef(input, index);
  const id = legacyRequiredText(input, ["id"], "id", issues, ref);
  const slug = legacyRequiredText(input, ["slug"], "slug", issues, ref);
  if (slug && (!SLUG_PATTERN.test(slug) || slug.length > 120)) {
    issues.push(makeIssue(
      "venue.slug.invalid",
      "slug",
      "slug must be lowercase kebab-case",
      "raw",
      "error",
      ref,
    ));
  }
  const name = legacyRequiredText(input, ["name"], "name", issues, ref);
  const category = legacyRequiredText(
    input,
    ["category", "venue_type", "venueType"],
    "category",
    issues,
    ref,
  );
  if (category && !VENUE_TYPE_SET.has(category)) {
    issues.push(makeIssue(
      "venue.category.unknown",
      "category",
      "category is not supported",
      "raw",
      "error",
      ref,
    ));
  }
  const district = legacyRequiredText(input, ["district"], "district", issues, ref);
  if (district && !DISTRICT_SET.has(district)) {
    issues.push(makeIssue(
      "venue.district.unknown",
      "district",
      "district is not supported",
      "raw",
      "error",
      ref,
    ));
  }
  const tier = legacyRequiredText(input, ["tier"], "tier", issues, ref);
  if (tier && !LEGACY_VENUE_TIER_SET.has(tier)) {
    issues.push(makeIssue(
      "venue.tier.unknown",
      "tier",
      "tier is not supported",
      "raw",
      "error",
      ref,
    ));
  }
  const status = legacyRequiredText(input, ["status"], "status", issues, ref);
  const publicationStatus = legacyOptionalText(
    input,
    ["publication_status", "editorial_status", "editorialStatus"],
    "publication_status",
    issues,
    ref,
  );
  if (publicationStatus && !LEGACY_PUBLICATION_STATUS_SET.has(publicationStatus)) {
    issues.push(makeIssue(
      "venue.publication_status.unknown",
      "publication_status",
      "publication_status is not supported by the legacy public domain",
      "raw",
      "error",
      ref,
    ));
  }

  const address = legacyOptionalText(
    input,
    ["address", "full_address", "fullAddress"],
    "address",
    issues,
    ref,
  );
  const rawMaps = legacyOptionalText(
    input,
    ["gmaps_url", "gmapsUrl"],
    "gmaps_url",
    issues,
    ref,
  );
  const maps = rawMaps ? googleMapsUrl(rawMaps) : null;
  if (rawMaps && !maps) {
    issues.push(makeIssue(
      "venue.gmaps_url.invalid",
      "gmaps_url",
      "gmaps_url must be a supported Google Maps HTTPS URL",
      "raw",
      "error",
      ref,
    ));
  }

  const officialUrl = legacyOptionalText(input, ["official_url", "officialUrl"], "official_url", issues, ref);
  const instagramUrl = legacyOptionalText(input, ["instagram_url", "instagramUrl"], "instagram_url", issues, ref);
  const priceAnchor = legacyOptionalText(input, ["price_anchor", "priceAnchor"], "price_anchor", issues, ref);
  const whatToOrder = legacyOptionalText(input, ["what_to_order", "whatToOrder"], "what_to_order", issues, ref);
  const photoUrl = legacyOptionalText(input, ["photo_url", "photoUrl"], "photo_url", issues, ref);
  const area = legacyOptionalText(input, ["area", "subarea"], "area", issues, ref);
  const whyItsHere = legacyOptionalText(input, ["why_its_here", "whyItsHere"], "why_its_here", issues, ref);
  const bestFor = legacyOptionalText(input, ["best_for", "bestFor"], "best_for", issues, ref);
  const notFor = legacyOptionalText(input, ["not_for", "notFor"], "not_for", issues, ref);
  const ownerNote = legacyOptionalText(input, ["owner_note", "ownerNote"], "owner_note", issues, ref);
  const vibeTags = legacyTextArray(input, ["vibe_tags", "vibeTags", "vibes"], "vibe_tags", issues, ref);
  const practicalTags = legacyTextArray(input, ["practical_tags", "practicalTags"], "practical_tags", issues, ref);
  const jobs = legacyTextArray(input, ["jobs", "occasions"], "jobs", issues, ref);
  const wellnessCategories = legacyTextArray(
    input,
    ["wellness_categories", "wellnessCategories"],
    "wellness_categories",
    issues,
    ref,
    VENUE_TYPE_SET,
  );
  const sponsored = field(input, "is_sponsored", "isSponsored");
  if (typeof sponsored !== "boolean") {
    issues.push(makeIssue(
      "venue.is_sponsored.invalid_type",
      "is_sponsored",
      "is_sponsored must be a boolean",
      "raw",
      "error",
      ref,
    ));
  }

  if (
    hasErrors(issues)
    || !id
    || !slug
    || !name
    || !category
    || !VENUE_TYPE_SET.has(category)
    || !district
    || !DISTRICT_SET.has(district)
    || !tier
    || !LEGACY_VENUE_TIER_SET.has(tier)
    || !status
    || typeof sponsored !== "boolean"
  ) {
    return { ok: false, data: null, issues };
  }

  return {
    ok: true,
    data: {
      id,
      slug,
      name,
      category: category as VenueType,
      district: district as KnownDistrict,
      address,
      gmaps_url: maps,
      official_url: officialUrl,
      instagram_url: instagramUrl,
      tier: tier as LegacyVenueTier,
      status,
      is_sponsored: sponsored,
      vibe_tags: vibeTags,
      price_anchor: priceAnchor,
      what_to_order: whatToOrder,
      photo_url: photoUrl,
      area,
      why_its_here: whyItsHere,
      best_for: bestFor,
      not_for: notFor,
      practical_tags: practicalTags,
      jobs,
      owner_note: ownerNote,
      publication_status: publicationStatus as "published" | "review" | null,
      wellness_categories: wellnessCategories as VenueType[] | null,
    },
    issues,
  };
}

export function parseLegacyPublicVenueRow(
  input: unknown,
  index?: number,
): ValidationResult<LegacyPublicVenueRow> {
  const structural = parseLegacyVenueRow(input, index);
  if (!structural.ok || !structural.data) {
    return { ok: false, data: null, issues: structural.issues };
  }
  const issues = [...structural.issues];
  const row = structural.data;
  const ref: ValidationRecordRef = {
    id: row.id,
    slug: row.slug,
    ...(index === undefined ? {} : { index }),
  };
  if (row.status !== "active") {
    issues.push(makeIssue("venue.operational_status.not_active", "status", "public venue must have status=active", "publication", "error", ref));
  }
  if (row.publication_status !== "published") {
    issues.push(makeIssue("venue.editorial_status.not_published", "publication_status", "public venue must be marked published", "publication", "error", ref));
  }
  if (!row.address && !row.gmaps_url) {
    issues.push(makeIssue("venue.location.missing", "address", "legacy public venue requires an address or valid Google Maps URL", "publication", "error", ref));
  }
  if (hasErrors(issues)) return { ok: false, data: null, issues };
  return {
    ok: true,
    data: { ...row, status: "active", publication_status: "published" },
    issues,
  };
}

// Transitional trust-boundary gate for the existing public mapper. It checks
// the legacy columns that are available before the additive normalized-schema
// migration is applied. The full normalize/publication contract above remains
// the release gate and data-audit source of truth.
export function legacyPublicVenueRowIssues(input: unknown, index?: number): ValidationIssue[] {
  return parseLegacyPublicVenueRow(input, index).issues;
}

export interface VenueAuditRecord {
  index: number;
  id: string | null;
  slug: string | null;
  claimedPublished: boolean;
  normalized: boolean;
  publishable: boolean;
  excludedFromPublic: boolean;
  issues: ValidationIssue[];
}

export interface VenueAuditSummary {
  totalVenues: number;
  normalizedVenues: number;
  claimedPublishedVenues: number;
  publishableVenues: number;
  reviewVenues: number;
  invalidVenues: number;
  venuesWithoutPhoto: number;
  venuesWithoutVerifiedAt: number;
  venuesWithEmptyAddress: number;
  venuesWithInvalidMapsUrl: number;
  duplicateSlugs: number;
  errors: number;
  warnings: number;
}

export interface VenueAuditReport {
  schemaVersion: 1;
  source: string;
  asOf: string | null;
  ready: boolean;
  summary: VenueAuditSummary;
  records: VenueAuditRecord[];
  issues: ValidationIssue[];
}

function field(row: Record<string, unknown>, ...keys: string[]): unknown {
  let sawNull = false;
  for (const key of keys) {
    if (!Object.hasOwn(row, key)) continue;
    if (row[key] != null) return row[key];
    sawNull = true;
  }
  return sawNull ? null : undefined;
}

function recordRef(row: Record<string, unknown>, index?: number): ValidationRecordRef {
  return {
    id: normalizedText(row.id),
    slug: normalizedText(row.slug),
    ...(index === undefined ? {} : { index }),
  };
}

function requiredText(
  row: Record<string, unknown>,
  keys: string[],
  path: string,
  code: string,
  issues: ValidationIssue[],
  ref: ValidationRecordRef,
): string | null {
  const value = field(row, ...keys);
  const text = normalizedText(value);
  if (!text) {
    issues.push(makeIssue(code, path, `${path} must be a non-empty string`, "raw", "error", ref));
  }
  return text;
}

function optionalText(
  row: Record<string, unknown>,
  keys: string[],
  path: string,
  issues: ValidationIssue[],
  ref: ValidationRecordRef,
): string | null {
  const value = field(row, ...keys);
  if (value == null) return null;
  const text = normalizedText(value);
  if (!text) {
    issues.push(makeIssue(`venue.${path}.invalid`, path, `${path} must be null or a non-empty string`, "raw", "error", ref));
  }
  return text;
}

function optionalInteger(
  row: Record<string, unknown>,
  keys: string[],
  path: string,
  issues: ValidationIssue[],
  ref: ValidationRecordRef,
): number | null {
  const value = field(row, ...keys);
  if (value == null) return null;
  if (!Number.isSafeInteger(value) || (value as number) < 0) {
    issues.push(makeIssue(`venue.${path}.invalid`, path, `${path} must be a non-negative safe integer or null`, "raw", "error", ref));
    return null;
  }
  return value as number;
}

function optionalCoordinate(
  row: Record<string, unknown>,
  key: "latitude" | "longitude",
  min: number,
  max: number,
  issues: ValidationIssue[],
  ref: ValidationRecordRef,
): number | null {
  const value = row[key];
  if (value == null) return null;
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) {
    issues.push(makeIssue(`venue.${key}.out_of_range`, key, `${key} must be a finite number between ${min} and ${max}`, "raw", "error", ref));
    return null;
  }
  return value;
}

function timestamp(
  row: Record<string, unknown>,
  keys: string[],
  path: string,
  issues: ValidationIssue[],
  ref: ValidationRecordRef,
): string | null {
  const value = field(row, ...keys);
  if (value == null) return null;
  const text = normalizedText(value);
  if (!text || !Number.isFinite(Date.parse(text))) {
    issues.push(makeIssue(`venue.${path}.invalid`, path, `${path} must be null or a valid ISO date/timestamp`, "raw", "error", ref));
    return null;
  }
  return new Date(text).toISOString();
}

function httpsUrl(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
  ref: ValidationRecordRef,
): string | null {
  if (value == null) return null;
  const text = normalizedText(value);
  try {
    if (!text) throw new Error("empty");
    const url = new URL(text);
    if (url.protocol !== "https:" || url.username || url.password || !url.hostname) throw new Error("unsafe");
    return url.toString();
  } catch {
    issues.push(makeIssue(`venue.${path}.invalid`, path, `${path} must be a credential-free HTTPS URL`, "raw", "error", ref));
    return null;
  }
}

function googleMapsUrl(value: unknown): string | null {
  const text = normalizedText(value);
  if (!text) return null;
  try {
    const url = new URL(text);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    const host = url.hostname.toLowerCase();
    const accepted =
      host === "maps.app.goo.gl" ||
      (host === "goo.gl" && url.pathname.startsWith("/maps")) ||
      host === "maps.google.com" ||
      ((host === "google.com" || host === "www.google.com") && url.pathname.startsWith("/maps"));
    return accepted ? url.toString() : null;
  } catch {
    return null;
  }
}

function directionsUrl(
  row: Record<string, unknown>,
  name: string | null,
  latitude: number | null,
  longitude: number | null,
  placeId: string | null,
  issues: ValidationIssue[],
  ref: ValidationRecordRef,
): string | null {
  const raw = field(row, "gmaps_url", "gmapsUrl");
  const explicit = googleMapsUrl(raw);
  if (explicit) return explicit;
  if (raw != null) {
    issues.push(makeIssue(
      "venue.gmaps_url.invalid",
      "gmaps_url",
      "gmaps_url must be a supported credential-free Google Maps HTTPS URL",
      "raw",
      latitude != null && longitude != null || placeId ? "warning" : "error",
      ref,
    ));
  }
  if (placeId) {
    const url = new URL("https://www.google.com/maps/search/");
    url.searchParams.set("api", "1");
    url.searchParams.set("query", name ?? placeId);
    url.searchParams.set("query_place_id", placeId);
    return url.toString();
  }
  if (latitude != null && longitude != null) {
    const url = new URL("https://www.google.com/maps/search/");
    url.searchParams.set("api", "1");
    url.searchParams.set("query", `${latitude},${longitude}`);
    return url.toString();
  }
  return null;
}

function taxonomyArray(
  row: Record<string, unknown>,
  keys: string[],
  path: string,
  issues: ValidationIssue[],
  ref: ValidationRecordRef,
  allowed?: Set<string>,
): string[] {
  const value = field(row, ...keys);
  if (value == null) return [];
  if (!Array.isArray(value)) {
    issues.push(makeIssue(`venue.${path}.invalid_type`, path, `${path} must be an array`, "raw", "error", ref));
    return [];
  }
  const result: string[] = [];
  for (const [index, item] of value.entries()) {
    const text = normalizedText(item);
    if (!text || !TAXONOMY_TOKEN_PATTERN.test(text) || (allowed && !allowed.has(text))) {
      issues.push(makeIssue(
        `venue.${path}.unknown`,
        `${path}[${index}]`,
        `${path}[${index}] must be a supported snake_case taxonomy value`,
        "raw",
        "error",
        ref,
      ));
      continue;
    }
    if (!result.includes(text)) result.push(text);
  }
  return result;
}

function photoRows(
  row: Record<string, unknown>,
  issues: ValidationIssue[],
  ref: ValidationRecordRef,
): NormalizedVenuePhoto[] {
  const rawPhotos = row.photos;
  const photos: NormalizedVenuePhoto[] = [];
  if (rawPhotos != null && !Array.isArray(rawPhotos)) {
    issues.push(makeIssue("venue.photos.invalid_type", "photos", "photos must be an array", "raw", "error", ref));
  }
  for (const [index, rawPhoto] of (Array.isArray(rawPhotos) ? rawPhotos : []).entries()) {
    if (!isRecord(rawPhoto)) {
      issues.push(makeIssue("venue.photos.item_invalid", `photos[${index}]`, "photo must be an object", "raw", "error", ref));
      continue;
    }
    const statusValue = normalizedText(rawPhoto.status) ?? "needs_verification";
    if (!PHOTO_STATUS_SET.has(statusValue)) {
      issues.push(makeIssue("venue.photos.status_unknown", `photos[${index}].status`, "photo status is not supported", "raw", "error", ref));
    }
    const url = httpsUrl(field(rawPhoto, "source_url", "url"), `photos[${index}].url`, issues, ref);
    const storagePath = normalizedText(field(rawPhoto, "storage_path", "storagePath"));
    if (!url && !storagePath) {
      issues.push(makeIssue("venue.photos.source_required", `photos[${index}]`, "photo requires source_url or storage_path", "raw", "error", ref));
    }
    photos.push({
      id: normalizedText(rawPhoto.id),
      url,
      storagePath,
      rightsBasis: normalizedText(field(rawPhoto, "rights_basis", "rightsBasis")),
      rightsHolder: normalizedText(field(rawPhoto, "rights_holder", "rightsHolder")),
      creditLine: normalizedText(field(rawPhoto, "credit_line", "creditLine")),
      altText: normalizedText(field(rawPhoto, "alt_text", "altText")),
      isPrimary: rawPhoto.is_primary === true || rawPhoto.isPrimary === true,
      verifiedAt: timestamp(rawPhoto, ["verified_at", "verifiedAt"], `photos[${index}].verified_at`, issues, ref),
      status: PHOTO_STATUS_SET.has(statusValue) ? statusValue as PhotoStatus : "needs_verification",
    });
  }
  if (rawPhotos == null && row.photo_url != null) {
    const url = httpsUrl(row.photo_url, "photo_url", issues, ref);
    if (url) {
      photos.push({
        id: null,
        url,
        storagePath: null,
        rightsBasis: null,
        rightsHolder: null,
        creditLine: null,
        altText: null,
        isPrimary: true,
        verifiedAt: null,
        status: "needs_verification",
      });
    }
  }
  if (photos.filter((photo) => photo.isPrimary).length > 1) {
    issues.push(makeIssue("venue.photos.duplicate_primary", "photos", "a venue may have at most one primary photo", "normalized", "error", ref));
  }
  return photos;
}

function bookingMethods(
  row: Record<string, unknown>,
  issues: ValidationIssue[],
  ref: ValidationRecordRef,
): VenueBookingMethod[] {
  const value = field(row, "booking_methods", "bookingMethods");
  if (value == null) return [];
  if (!Array.isArray(value)) {
    issues.push(makeIssue("venue.booking_methods.invalid_type", "booking_methods", "booking_methods must be an array", "raw", "error", ref));
    return [];
  }
  const output: VenueBookingMethod[] = [];
  for (const [index, item] of value.entries()) {
    if (!isRecord(item)) {
      issues.push(makeIssue("venue.booking_methods.item_invalid", `booking_methods[${index}]`, "booking method must be an object", "raw", "error", ref));
      continue;
    }
    const type = normalizedText(item.type);
    const url = httpsUrl(item.url, `booking_methods[${index}].url`, issues, ref);
    if (!type || !TAXONOMY_TOKEN_PATTERN.test(type)) {
      issues.push(makeIssue("venue.booking_methods.type_invalid", `booking_methods[${index}].type`, "booking method type must be a snake_case value", "raw", "error", ref));
    }
    if (type && url) output.push({ type, url });
  }
  return output;
}

export function normalizeVenueRow(input: unknown, index?: number): ValidationResult<NormalizedVenue> {
  if (!isRecord(input)) {
    const issue = makeIssue("venue.input.not_object", "$", "venue row must be an object", "raw", "error", {
      id: null,
      slug: null,
      ...(index === undefined ? {} : { index }),
    });
    return { ok: false, data: null, issues: [issue] };
  }

  const issues: ValidationIssue[] = [];
  const ref = recordRef(input, index);
  const id = requiredText(input, ["id"], "id", "venue.id.required", issues, ref);
  const slug = requiredText(input, ["slug"], "slug", "venue.slug.required", issues, ref);
  if (slug && (!SLUG_PATTERN.test(slug) || slug.length > 120)) {
    issues.push(makeIssue("venue.slug.invalid", "slug", "slug must be a lowercase kebab-case value up to 120 characters", "raw", "error", ref));
  }
  const name = requiredText(input, ["name"], "name", "venue.name.required", issues, ref);
  if (name && name.length > 240) {
    issues.push(makeIssue("venue.name.too_long", "name", "name must not exceed 240 characters", "raw", "error", ref));
  }

  const venueTypeValue = normalizedText(field(input, "venue_type", "venueType", "category"));
  if (!venueTypeValue) {
    issues.push(makeIssue("venue.venue_type.required", "venue_type", "venue_type (or legacy category) is required", "raw", "error", ref));
  } else if (!VENUE_TYPE_SET.has(venueTypeValue)) {
    issues.push(makeIssue("venue.venue_type.unknown", "venue_type", "venue_type is not in the supported venue taxonomy", "raw", "error", ref));
  }

  const districtValue = normalizedText(input.district);
  if (!districtValue) {
    issues.push(makeIssue("venue.district.required", "district", "district is required", "raw", "error", ref));
  } else if (!DISTRICT_SET.has(districtValue)) {
    issues.push(makeIssue("venue.district.unknown", "district", "district is not in the supported district registry", "raw", "error", ref));
  }

  const subarea = optionalText(input, ["subarea", "area"], "subarea", issues, ref);
  const fullAddress = optionalText(input, ["full_address", "fullAddress", "address"], "full_address", issues, ref);
  const latitude = optionalCoordinate(input, "latitude", -90, 90, issues, ref);
  const longitude = optionalCoordinate(input, "longitude", -180, 180, issues, ref);
  if ((latitude == null) !== (longitude == null)) {
    issues.push(makeIssue("venue.coordinates.incomplete", "latitude", "latitude and longitude must both be set or both be null", "normalized", "error", ref));
  }
  const googlePlaceId = optionalText(input, ["google_place_id", "googlePlaceId"], "google_place_id", issues, ref);
  if (googlePlaceId && !GOOGLE_PLACE_ID_PATTERN.test(googlePlaceId)) {
    issues.push(makeIssue("venue.google_place_id.invalid", "google_place_id", "google_place_id has an invalid shape", "raw", "error", ref));
  }
  const gmapsUrl = directionsUrl(input, name, latitude, longitude, googlePlaceId, issues, ref);
  const officialUrl = httpsUrl(field(input, "official_url", "officialUrl"), "official_url", issues, ref);
  const instagramUrl = httpsUrl(field(input, "instagram_url", "instagramUrl"), "instagram_url", issues, ref);
  const priceMinIdr = optionalInteger(input, ["price_min_idr", "priceMinIdr"], "price_min_idr", issues, ref);
  const priceMaxIdr = optionalInteger(input, ["price_max_idr", "priceMaxIdr"], "price_max_idr", issues, ref);
  if (priceMinIdr != null && priceMaxIdr != null && priceMinIdr > priceMaxIdr) {
    issues.push(makeIssue("venue.price.range_invalid", "price_min_idr", "price_min_idr must be less than or equal to price_max_idr", "normalized", "error", ref));
  }
  const priceBandValue = optionalText(input, ["price_band", "priceBand"], "price_band", issues, ref);
  if (priceBandValue && !PRICE_BAND_SET.has(priceBandValue)) {
    issues.push(makeIssue("venue.price_band.unknown", "price_band", "price_band must be one of $, $$, $$$, $$$$", "raw", "error", ref));
  }
  const priceAnchor = optionalText(input, ["price_anchor", "priceAnchor"], "price_anchor", issues, ref);

  const openingHoursValue = field(input, "opening_hours_json", "openingHours", "opening_hours");
  let openingHours: JsonValue | null = null;
  if (openingHoursValue != null) {
    if (!isJsonValue(openingHoursValue)) {
      issues.push(makeIssue("venue.opening_hours.invalid", "opening_hours_json", "opening_hours_json must contain JSON-compatible data", "raw", "error", ref));
    } else {
      openingHours = openingHoursValue;
    }
  }

  const verifiedAt = timestamp(input, ["verified_at", "verifiedAt", "last_verified_at"], "verified_at", issues, ref);
  const verificationSource = optionalText(input, ["verification_source", "verificationSource"], "verification_source", issues, ref);
  const editorialStatusValue = normalizedText(field(input, "editorial_status", "editorialStatus", "publication_status")) ?? "review";
  if (!EDITORIAL_STATUS_SET.has(editorialStatusValue)) {
    issues.push(makeIssue("venue.editorial_status.unknown", "editorial_status", "editorial_status is not supported", "raw", "error", ref));
  }
  const operationalStatus = normalizedText(input.status) ?? "active";
  const whyItsHere = optionalText(input, ["why_its_here", "whyItsHere"], "why_its_here", issues, ref);
  const bestFor = optionalText(input, ["best_for", "bestFor"], "best_for", issues, ref);
  const notFor = optionalText(input, ["not_for", "notFor"], "not_for", issues, ref);
  const practicalTags = taxonomyArray(input, ["practical_tags", "practicalTags"], "practical_tags", issues, ref);
  const occasions = taxonomyArray(input, ["occasions", "jobs"], "occasions", issues, ref);
  const mealPeriods = taxonomyArray(input, ["meal_periods", "mealPeriods"], "meal_periods", issues, ref, MEAL_PERIODS);
  const vibes = taxonomyArray(input, ["vibes", "vibe_tags", "vibeTags"], "vibes", issues, ref);
  const photos = photoRows(input, issues, ref);
  const photoStatusValue = normalizedText(field(input, "photo_status", "photoStatus")) ?? (photos.length > 0 ? "needs_verification" : "missing");
  if (!PHOTO_STATUS_SET.has(photoStatusValue)) {
    issues.push(makeIssue("venue.photo_status.unknown", "photo_status", "photo_status is not supported", "raw", "error", ref));
  }
  const methods = bookingMethods(input, issues, ref);
  const sponsoredValue = field(input, "is_sponsored", "isSponsored");
  if (typeof sponsoredValue !== "boolean") {
    issues.push(makeIssue("venue.is_sponsored.invalid", "is_sponsored", "is_sponsored must be a boolean", "raw", "error", ref));
  }

  if (hasErrors(issues) || !id || !slug || !name || !venueTypeValue || !VENUE_TYPE_SET.has(venueTypeValue) || !districtValue || !DISTRICT_SET.has(districtValue)) {
    return { ok: false, data: null, issues };
  }

  const data: NormalizedVenue = {
    id,
    slug,
    name,
    venueType: venueTypeValue as VenueType,
    district: districtValue as KnownDistrict,
    subarea,
    fullAddress,
    latitude,
    longitude,
    googlePlaceId,
    gmapsUrl,
    officialUrl,
    instagramUrl,
    priceMinIdr,
    priceMaxIdr,
    priceBand: priceBandValue as PriceBand | null,
    priceAnchor,
    openingHours,
    verifiedAt,
    verificationSource,
    editorialStatus: editorialStatusValue as EditorialStatus,
    operationalStatus,
    whyItsHere,
    bestFor,
    notFor,
    practicalTags,
    occasions,
    mealPeriods,
    vibes,
    photos,
    photoStatus: PHOTO_STATUS_SET.has(photoStatusValue) ? photoStatusValue as PhotoStatus : "missing",
    bookingMethods: methods,
    isSponsored: sponsoredValue as boolean,
  };
  return { ok: true, data, issues };
}

export function validatePublishedVenue(venue: NormalizedVenue, index?: number): ValidationResult<PublishedVenue> {
  const ref: ValidationRecordRef = { id: venue.id, slug: venue.slug, ...(index === undefined ? {} : { index }) };
  const issues: ValidationIssue[] = [];
  if (venue.operationalStatus !== "active") {
    issues.push(makeIssue("venue.operational_status.not_active", "status", "published venue must have status=active", "publication", "error", ref));
  }
  if (venue.editorialStatus !== "published") {
    issues.push(makeIssue("venue.editorial_status.not_published", "editorial_status", "venue is not marked published", "publication", "error", ref));
  }
  if (!venue.fullAddress && (venue.latitude == null || venue.longitude == null)) {
    issues.push(makeIssue("venue.location.missing", "full_address", "published venue requires a full address or a complete coordinate pair", "publication", "error", ref));
  }
  if (!venue.gmapsUrl) {
    issues.push(makeIssue("venue.directions.missing", "gmaps_url", "published venue requires a verified or coordinates/Place-ID-derived Google Maps URL", "publication", "error", ref));
  }
  if (!venue.whyItsHere) {
    issues.push(makeIssue("venue.why_its_here.required", "why_its_here", "published venue requires why_its_here", "publication", "error", ref));
  }
  if (!venue.bestFor) {
    issues.push(makeIssue("venue.best_for.required", "best_for", "published venue requires best_for", "publication", "error", ref));
  }
  if (!venue.verifiedAt) {
    issues.push(makeIssue("venue.verified_at.required", "verified_at", "published venue requires verified_at", "publication", "error", ref));
  }
  if (!venue.verificationSource) {
    issues.push(makeIssue("venue.verification_source.required", "verification_source", "published venue requires verification_source", "publication", "error", ref));
  }
  for (const [path, value] of [
    ["why_its_here", venue.whyItsHere],
    ["best_for", venue.bestFor],
    ["not_for", venue.notFor],
    ["price_anchor", venue.priceAnchor],
  ] as const) {
    if (value && DRAFT_OFFER_PATTERN.test(value)) {
      issues.push(makeIssue("venue.content.draft_offer_language", path, `${path} contains internal draft-offer language`, "publication", "error", ref));
    }
  }
  const primaryPhotos = venue.photos.filter((photo) => photo.isPrimary);
  const publishablePrimary = primaryPhotos.some((photo) =>
    ["approved", "published"].includes(photo.status) &&
    Boolean(photo.verifiedAt && photo.rightsBasis && photo.rightsHolder),
  );
  if (!publishablePrimary && venue.photoStatus !== "approved_no_photo") {
    issues.push(makeIssue(
      "venue.photo.indexability_state_required",
      "photo_status",
      "indexable venue requires one rights-verified primary photo or photo_status=approved_no_photo",
      "publication",
      "error",
      ref,
    ));
  }

  if (hasErrors(issues) || !venue.gmapsUrl || !venue.verifiedAt || !venue.verificationSource || venue.editorialStatus !== "published" || !venue.whyItsHere || !venue.bestFor) {
    return { ok: false, data: null, issues };
  }
  return { ok: true, data: venue as PublishedVenue, issues };
}

export function validateVenueRow(input: unknown, index?: number): VenueRowValidation {
  const normalized = normalizeVenueRow(input, index);
  if (!normalized.data) return { normalized: null, published: null, issues: normalized.issues };
  if (normalized.data.editorialStatus !== "published") {
    return { normalized: normalized.data, published: null, issues: normalized.issues };
  }
  const publication = validatePublishedVenue(normalized.data, index);
  return {
    normalized: normalized.data,
    published: publication.data,
    issues: [...normalized.issues, ...publication.issues],
  };
}

function claimedPublished(input: unknown): boolean {
  if (!isRecord(input)) return false;
  return normalizedText(field(input, "editorial_status", "editorialStatus", "publication_status")) === "published";
}

function rawHasEmptyAddress(input: unknown): boolean {
  if (!isRecord(input)) return true;
  return normalizedText(field(input, "full_address", "fullAddress", "address")) === null;
}

function rawHasNoPhoto(input: unknown): boolean {
  if (!isRecord(input)) return true;
  const photos = input.photos;
  return !normalizedText(input.photo_url) && (!Array.isArray(photos) || photos.length === 0);
}

function rawHasNoVerifiedAt(input: unknown): boolean {
  return !isRecord(input) || !normalizedText(field(input, "verified_at", "verifiedAt", "last_verified_at"));
}

function rawHasInvalidMap(input: unknown): boolean {
  if (!isRecord(input)) return false;
  const value = field(input, "gmaps_url", "gmapsUrl");
  return value != null && !googleMapsUrl(value);
}

export function auditVenueRows(
  rows: unknown[],
  options: { source: string; asOf?: string | null },
): VenueAuditReport {
  const records: VenueAuditRecord[] = [];
  const allIssues: ValidationIssue[] = [];
  const firstSlugIndex = new Map<string, number>();
  let duplicateSlugs = 0;

  for (const [index, row] of rows.entries()) {
    const validation = validateVenueRow(row, index);
    const ref = isRecord(row) ? recordRef(row, index) : { id: null, slug: null, index };
    const slug = ref.slug;
    if (slug) {
      const first = firstSlugIndex.get(slug);
      if (first !== undefined) {
        duplicateSlugs += 1;
        validation.issues.push(makeIssue(
          "venue.snapshot.duplicate_slug",
          "slug",
          `slug duplicates snapshot row ${first}`,
          "dataset",
          "error",
          ref,
        ));
      } else {
        firstSlugIndex.set(slug, index);
      }
    }
    const errors = validation.issues.some((issue) => issue.severity === "error");
    const record: VenueAuditRecord = {
      index,
      id: ref.id,
      slug,
      claimedPublished: claimedPublished(row),
      normalized: validation.normalized !== null,
      publishable: validation.published !== null && !errors,
      excludedFromPublic: validation.published === null || errors,
      issues: validation.issues,
    };
    records.push(record);
    allIssues.push(...record.issues);
  }

  const summary: VenueAuditSummary = {
    totalVenues: rows.length,
    normalizedVenues: records.filter((record) => record.normalized).length,
    claimedPublishedVenues: records.filter((record) => record.claimedPublished).length,
    publishableVenues: records.filter((record) => record.publishable).length,
    reviewVenues: records.filter((record) => record.normalized && !record.claimedPublished).length,
    invalidVenues: records.filter((record) => record.issues.some((issue) => issue.severity === "error")).length,
    venuesWithoutPhoto: rows.filter(rawHasNoPhoto).length,
    venuesWithoutVerifiedAt: rows.filter(rawHasNoVerifiedAt).length,
    venuesWithEmptyAddress: rows.filter(rawHasEmptyAddress).length,
    venuesWithInvalidMapsUrl: rows.filter(rawHasInvalidMap).length,
    duplicateSlugs,
    errors: allIssues.filter((issue) => issue.severity === "error").length,
    warnings: allIssues.filter((issue) => issue.severity === "warning").length,
  };
  return {
    schemaVersion: 1,
    source: options.source,
    asOf: options.asOf ?? null,
    ready: summary.errors === 0,
    summary,
    records,
    issues: allIssues,
  };
}
