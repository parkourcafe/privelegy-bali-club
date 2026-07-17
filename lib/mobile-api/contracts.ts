import type { DistrictGuideEntry } from "../districts";
import {
  classifyGoogleMapsHandoff,
  validateGoogleMapsUrl,
  validateInstagramUrl,
  validateOfficialWebsiteUrl,
} from "../external-links";
import {
  MOBILE_CONSENT_VERSION,
  MOBILE_DISTRICTS,
  MOBILE_VENUE_TYPES,
} from "./taxonomy";
import type { Venue } from "../types";

export const MOBILE_API_VERSION = 1 as const;
export const MOBILE_API_SCHEMA_VERSION = 1 as const;
export const MOBILE_API_MINIMUM_SUPPORTED_VERSION = 1 as const;
export { MOBILE_CONSENT_VERSION } from "./taxonomy";

export const MOBILE_API_LIMITS = {
  districts: 50,
  venues: 500,
  routes: 100,
  routeStops: 20,
  tags: 20,
} as const;

export interface MobileAppConfig {
  appName: "Other Bali";
  defaultLocale: "en";
  canonicalOrigin: "https://www.otherbali.com";
  privacyPolicyUrl: "https://www.otherbali.com/privacy";
  supportUrl: "https://www.otherbali.com/support";
}

export interface MobileDistrict {
  id: string;
  slug: string;
  name: string;
  region: string;
  moment: string;
  bestFor: string[];
  mapsUrl: string;
  guidePath: string | null;
}

export interface MobileVenueCompact {
  id: string;
  slug: string;
  name: string;
  category: string;
  district: string;
  subarea: string | null;
  photoUrl: string | null;
  bestFor: string | null;
  isSponsored: boolean;
}

export interface MobileVenue extends MobileVenueCompact {
  fullAddress: string | null;
  mapsUrl: string;
  officialUrl: string | null;
  instagramUrl: string | null;
  priceLabel: string | null;
  whatToOrder: string | null;
  whyItsHere: string | null;
  notFor: string | null;
  practicalTags: string[];
  vibes: string[];
}

export interface MobileRouteSummary {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  stopCount: number;
}

export interface MobileRouteStop {
  position: number;
  venue: MobileVenueCompact;
}

export interface MobileRouteDetail extends MobileRouteSummary {
  stops: MobileRouteStop[];
}

export interface MobileBootstrapData {
  config: MobileAppConfig;
  districts: MobileDistrict[];
  venues: MobileVenueCompact[];
  routes: MobileRouteSummary[];
  consentVersion: string;
  minimumSupportedApiVersion: typeof MOBILE_API_MINIMUM_SUPPORTED_VERSION;
}

export interface MobileVenuesData {
  venues: MobileVenue[];
}

export interface MobileVenueData {
  venue: MobileVenue;
}

export interface MobileRoutesData {
  routes: MobileRouteSummary[];
}

export interface MobileRouteData {
  route: MobileRouteDetail;
}

export interface MobileConfigData {
  config: MobileAppConfig;
  consentVersion: string;
  minimumSupportedApiVersion: typeof MOBILE_API_MINIMUM_SUPPORTED_VERSION;
}

export interface MobileSuccessEnvelope<T> {
  schemaVersion: typeof MOBILE_API_SCHEMA_VERSION;
  updatedAt: string;
  data: T;
}

export type MobileErrorCode =
  | "invalid_request"
  | "not_found"
  | "temporarily_unavailable";

export interface MobileErrorEnvelope {
  schemaVersion: typeof MOBILE_API_SCHEMA_VERSION;
  updatedAt: string;
  error: {
    code: MobileErrorCode;
    message: string;
  };
}

export interface MobileContractIssue {
  path: string;
  code: string;
}

export type MobileContractResult<T> =
  | { success: true; data: T }
  | { success: false; issues: MobileContractIssue[] };

export interface MobileContractSchema<T> {
  readonly name: string;
  safeParse(input: unknown): MobileContractResult<T>;
}

export const MOBILE_APP_CONFIG: MobileAppConfig = {
  appName: "Other Bali",
  defaultLocale: "en",
  canonicalOrigin: "https://www.otherbali.com",
  privacyPolicyUrl: "https://www.otherbali.com/privacy",
  supportUrl: "https://www.otherbali.com/support",
};

const VENUE_TYPE_SET = new Set<string>(MOBILE_VENUE_TYPES);
const DISTRICT_SET = new Set<string>(MOBILE_DISTRICTS);
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RELATIVE_PATH_PATTERN = /^\/(?!\/)[A-Za-z0-9/_-]*$/;

function text(value: unknown, maxLength = 500): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized && normalized.length <= maxLength ? normalized : null;
}

function nullableText(value: unknown, maxLength = 500): string | null {
  return value == null ? null : text(value, maxLength);
}

function publicHttpsUrl(value: unknown): string | null {
  return validateOfficialWebsiteUrl(value);
}

function relativePath(value: unknown): string | null {
  const candidate = text(value, 240);
  return candidate && RELATIVE_PATH_PATTERN.test(candidate) ? candidate : null;
}

function stringList(value: unknown, limit = MOBILE_API_LIMITS.tags): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((entry) => text(entry, 120)).filter((entry): entry is string => Boolean(entry)))]
    .slice(0, limit);
}

function hasExactKeys(value: unknown, keys: readonly string[]): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isNullableString(value: unknown): value is string | null {
  return value === null || isString(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isPublicHttpsUrl(value: unknown): value is string {
  return isString(value) && publicHttpsUrl(value) === value;
}

function isIsoTimestamp(value: unknown): value is string {
  if (!isString(value)) return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === value;
}

const COMPACT_VENUE_KEYS = [
  "id",
  "slug",
  "name",
  "category",
  "district",
  "subarea",
  "photoUrl",
  "bestFor",
  "isSponsored",
] as const;

const MOBILE_VENUE_KEYS = [
  ...COMPACT_VENUE_KEYS,
  "fullAddress",
  "mapsUrl",
  "officialUrl",
  "instagramUrl",
  "priceLabel",
  "whatToOrder",
  "whyItsHere",
  "notFor",
  "practicalTags",
  "vibes",
] as const;

const ROUTE_SUMMARY_KEYS = ["id", "slug", "title", "subtitle", "stopCount"] as const;

function isMobileAppConfig(input: unknown): input is MobileAppConfig {
  return hasExactKeys(input, [
    "appName",
    "defaultLocale",
    "canonicalOrigin",
    "privacyPolicyUrl",
    "supportUrl",
  ]) && input.appName === MOBILE_APP_CONFIG.appName
    && input.defaultLocale === MOBILE_APP_CONFIG.defaultLocale
    && input.canonicalOrigin === MOBILE_APP_CONFIG.canonicalOrigin
    && input.privacyPolicyUrl === MOBILE_APP_CONFIG.privacyPolicyUrl
    && input.supportUrl === MOBILE_APP_CONFIG.supportUrl;
}

function isMobileDistrict(input: unknown): input is MobileDistrict {
  return hasExactKeys(input, [
    "id",
    "slug",
    "name",
    "region",
    "moment",
    "bestFor",
    "mapsUrl",
    "guidePath",
  ]) && isString(input.id)
    && isString(input.slug)
    && input.id === input.slug
    && SLUG_PATTERN.test(input.slug)
    && isString(input.name)
    && isString(input.region)
    && isString(input.moment)
    && isStringArray(input.bestFor)
    && validateGoogleMapsUrl(input.mapsUrl) === input.mapsUrl
    && (input.guidePath === null || (isString(input.guidePath) && relativePath(input.guidePath) === input.guidePath));
}

export function isMobileVenueCompact(input: unknown): input is MobileVenueCompact {
  return hasExactKeys(input, COMPACT_VENUE_KEYS)
    && isString(input.id)
    && isString(input.slug)
    && SLUG_PATTERN.test(input.slug)
    && isString(input.name)
    && isString(input.category)
    && VENUE_TYPE_SET.has(input.category)
    && isString(input.district)
    && DISTRICT_SET.has(input.district)
    && isNullableString(input.subarea)
    && (input.photoUrl === null || isPublicHttpsUrl(input.photoUrl))
    && isNullableString(input.bestFor)
    && typeof input.isSponsored === "boolean";
}

export function isMobileVenue(input: unknown): input is MobileVenue {
  return hasExactKeys(input, MOBILE_VENUE_KEYS)
    && isMobileVenueCompact(Object.fromEntries(COMPACT_VENUE_KEYS.map((key) => [key, input[key]])))
    && isNullableString(input.fullAddress)
    && validateGoogleMapsUrl(input.mapsUrl) === input.mapsUrl
    && (input.officialUrl === null || validateOfficialWebsiteUrl(input.officialUrl) === input.officialUrl)
    && (input.instagramUrl === null || validateInstagramUrl(input.instagramUrl) === input.instagramUrl)
    && isNullableString(input.priceLabel)
    && isNullableString(input.whatToOrder)
    && isNullableString(input.whyItsHere)
    && isNullableString(input.notFor)
    && isStringArray(input.practicalTags)
    && isStringArray(input.vibes);
}

export function isMobileRouteSummary(input: unknown): input is MobileRouteSummary {
  return hasExactKeys(input, ROUTE_SUMMARY_KEYS)
    && isString(input.id)
    && isString(input.slug)
    && input.id === input.slug
    && SLUG_PATTERN.test(input.slug)
    && isString(input.title)
    && isNullableString(input.subtitle)
    && Number.isInteger(input.stopCount)
    && (input.stopCount as number) > 0
    && (input.stopCount as number) <= MOBILE_API_LIMITS.routeStops;
}

function isMobileRouteDetail(input: unknown): input is MobileRouteDetail {
  if (!hasExactKeys(input, [...ROUTE_SUMMARY_KEYS, "stops"])) return false;
  const summary = Object.fromEntries(ROUTE_SUMMARY_KEYS.map((key) => [key, input[key]]));
  return isMobileRouteSummary(summary)
    && Array.isArray(input.stops)
    && input.stops.length === input.stopCount
    && input.stops.every((stop, index) => hasExactKeys(stop, ["position", "venue"])
      && stop.position === index + 1
      && isMobileVenueCompact(stop.venue));
}

function schema<T>(name: string, check: (input: unknown) => input is T): MobileContractSchema<T> {
  return {
    name,
    safeParse(input) {
      return check(input)
        ? { success: true, data: input }
        : { success: false, issues: [{ path: "$", code: `${name}.invalid` }] };
    },
  };
}

export const mobileBootstrapDataSchema = schema<MobileBootstrapData>(
  "mobile.bootstrap",
  (input): input is MobileBootstrapData => hasExactKeys(input, [
    "config",
    "districts",
    "venues",
    "routes",
    "consentVersion",
    "minimumSupportedApiVersion",
  ]) && isMobileAppConfig(input.config)
    && Array.isArray(input.districts)
    && input.districts.length <= MOBILE_API_LIMITS.districts
    && input.districts.every(isMobileDistrict)
    && Array.isArray(input.venues)
    && input.venues.length <= MOBILE_API_LIMITS.venues
    && input.venues.every(isMobileVenueCompact)
    && Array.isArray(input.routes)
    && input.routes.length <= MOBILE_API_LIMITS.routes
    && input.routes.every(isMobileRouteSummary)
    && input.consentVersion === MOBILE_CONSENT_VERSION
    && input.minimumSupportedApiVersion === MOBILE_API_MINIMUM_SUPPORTED_VERSION,
);

export const mobileVenuesDataSchema = schema<MobileVenuesData>(
  "mobile.venues",
  (input): input is MobileVenuesData => hasExactKeys(input, ["venues"])
    && Array.isArray(input.venues)
    && input.venues.length <= MOBILE_API_LIMITS.venues
    && input.venues.every(isMobileVenue),
);

export const mobileVenueDataSchema = schema<MobileVenueData>(
  "mobile.venue",
  (input): input is MobileVenueData => hasExactKeys(input, ["venue"])
    && isMobileVenue(input.venue),
);

export const mobileRoutesDataSchema = schema<MobileRoutesData>(
  "mobile.routes",
  (input): input is MobileRoutesData => hasExactKeys(input, ["routes"])
    && Array.isArray(input.routes)
    && input.routes.length <= MOBILE_API_LIMITS.routes
    && input.routes.every(isMobileRouteSummary),
);

export const mobileRouteDataSchema = schema<MobileRouteData>(
  "mobile.route",
  (input): input is MobileRouteData => hasExactKeys(input, ["route"])
    && isMobileRouteDetail(input.route),
);

export const mobileConfigDataSchema = schema<MobileConfigData>(
  "mobile.config",
  (input): input is MobileConfigData => hasExactKeys(input, [
    "config",
    "consentVersion",
    "minimumSupportedApiVersion",
  ]) && isMobileAppConfig(input.config)
    && input.consentVersion === MOBILE_CONSENT_VERSION
    && input.minimumSupportedApiVersion === MOBILE_API_MINIMUM_SUPPORTED_VERSION,
);

export const mobileSuccessEnvelopeSchema = <T>(
  dataSchema: MobileContractSchema<T>,
): MobileContractSchema<MobileSuccessEnvelope<T>> => schema(
  `mobile.envelope.${dataSchema.name}`,
  (input): input is MobileSuccessEnvelope<T> => {
    if (!hasExactKeys(input, ["schemaVersion", "updatedAt", "data"])) return false;
    return input.schemaVersion === MOBILE_API_SCHEMA_VERSION
      && isIsoTimestamp(input.updatedAt)
      && dataSchema.safeParse(input.data).success;
  },
);

export function isMobileSlug(value: unknown): value is string {
  return typeof value === "string" && value.length <= 120 && SLUG_PATTERN.test(value);
}

export function toMobileDistrict(input: DistrictGuideEntry): MobileDistrict | null {
  const slug = text(input.slug, 120);
  const name = text(input.name, 160);
  const region = text(input.region, 160);
  const moment = text(input.moment, 500);
  const mapsUrl = validateGoogleMapsUrl(input.mapsUrl);
  if (!slug || !SLUG_PATTERN.test(slug) || !name || !region || !moment || !mapsUrl) return null;
  const district: MobileDistrict = {
    id: slug,
    slug,
    name,
    region,
    moment,
    bestFor: stringList(input.bestFor),
    mapsUrl,
    guidePath: relativePath(input.guidePath),
  };
  return isMobileDistrict(district) ? district : null;
}

export function toMobileVenueCompact(input: Venue): MobileVenueCompact | null {
  const id = text(input.id, 160);
  const slug = text(input.slug, 120);
  const name = text(input.name, 160);
  if (!id || !slug || !SLUG_PATTERN.test(slug) || !name) return null;
  if (!VENUE_TYPE_SET.has(input.category) || !DISTRICT_SET.has(input.district)) return null;
  const venue: MobileVenueCompact = {
    id,
    slug,
    name,
    category: input.category,
    district: input.district,
    subarea: nullableText(input.area, 160),
    // Legacy rows do not carry the normalized photo-rights state required by
    // the launch contract. Mobile v1 therefore publishes an explicit null
    // until an approved public photo DTO is available.
    photoUrl: null,
    bestFor: nullableText(input.bestFor),
    isSponsored: Boolean(input.isSponsored),
  };
  return isMobileVenueCompact(venue) ? venue : null;
}

export function toMobileVenue(input: Venue): MobileVenue | null {
  const compact = toMobileVenueCompact(input);
  const mapsUrl = validateGoogleMapsUrl(input.gmapsUrl);
  const handoff = classifyGoogleMapsHandoff(mapsUrl);
  if (!compact || !mapsUrl || handoff === "search") return null;
  const venue: MobileVenue = {
    ...compact,
    fullAddress: nullableText(input.address),
    mapsUrl,
    officialUrl: validateOfficialWebsiteUrl(input.officialUrl),
    instagramUrl: validateInstagramUrl(input.instagramUrl),
    priceLabel: nullableText(input.priceAnchor, 240),
    whatToOrder: nullableText(input.whatToOrder),
    whyItsHere: nullableText(input.whyItsHere),
    notFor: nullableText(input.notFor),
    practicalTags: stringList(input.practicalTags),
    vibes: stringList(input.vibeTags),
  };
  return isMobileVenue(venue) ? venue : null;
}

export function compactMobileVenue(input: MobileVenue): MobileVenueCompact {
  return {
    id: input.id,
    slug: input.slug,
    name: input.name,
    category: input.category,
    district: input.district,
    subarea: input.subarea,
    photoUrl: input.photoUrl,
    bestFor: input.bestFor,
    isSponsored: input.isSponsored,
  };
}

export function toMobileRouteDetail(input: {
  slug: string;
  title: string;
  subtitle?: string;
  stops: Venue[];
}): MobileRouteDetail | null {
  const slug = text(input.slug, 120);
  const title = text(input.title, 200);
  if (!slug || !SLUG_PATTERN.test(slug) || !title) return null;
  const stops = input.stops
    .flatMap((venue) => {
      const mapped = toMobileVenueCompact(venue);
      return mapped ? [mapped] : [];
    })
    .slice(0, MOBILE_API_LIMITS.routeStops)
    .map((venue, index) => ({ position: index + 1, venue }));
  if (!stops.length) return null;
  const route: MobileRouteDetail = {
    id: slug,
    slug,
    title,
    subtitle: nullableText(input.subtitle, 300),
    stopCount: stops.length,
    stops,
  };
  return isMobileRouteDetail(route) ? route : null;
}

export function toMobileRouteSummary(input: MobileRouteDetail): MobileRouteSummary {
  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    subtitle: input.subtitle,
    stopCount: input.stopCount,
  };
}
