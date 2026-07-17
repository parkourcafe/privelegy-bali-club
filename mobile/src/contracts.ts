import type {
  MobileDistrict,
  MobileRouteDetail,
  MobileRouteSummary,
  MobileVenue,
  MobileVenueCompact,
} from "../../lib/mobile-api/contracts";
import {
  classifyGoogleMapsHandoff,
  validateGoogleMapsUrl,
  validateInstagramUrl,
  validateOfficialWebsiteUrl,
} from "../../lib/external-links";
import {
  MOBILE_CONSENT_VERSION,
  MOBILE_DISTRICTS,
  MOBILE_VENUE_TYPES,
} from "../../lib/mobile-api/taxonomy";

const VENUE_TYPE_SET = new Set<string>(MOBILE_VENUE_TYPES);
const DISTRICT_SET = new Set<string>(MOBILE_DISTRICTS);
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface MobileBootstrapPayload {
  schemaVersion: 1;
  updatedAt: string;
  data: {
    config: {
      appName: "Other Bali";
      defaultLocale: "en";
      canonicalOrigin: string;
      privacyPolicyUrl: string;
      supportUrl: string;
    };
    districts: MobileDistrict[];
    venues: MobileVenueCompact[];
    routes: MobileRouteSummary[];
    consentVersion: string;
    minimumSupportedApiVersion: 1;
  };
}

export interface MobileVenueDetailPayload {
  schemaVersion: 1;
  updatedAt: string;
  data: {
    venue: MobileVenue;
  };
}

export interface MobileRouteDetailPayload {
  schemaVersion: 1;
  updatedAt: string;
  data: {
    route: MobileRouteDetail;
  };
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Expected an object");
  }
  return value as Record<string, unknown>;
}

function text(value: unknown, field: string, maxLength = 500): string {
  if (typeof value !== "string" || !value.trim() || value.length > maxLength) {
    throw new Error(`${field} must be bounded text`);
  }
  return value;
}

function nullableText(value: unknown, field: string, maxLength = 500): string | null {
  if (value === null) return null;
  return text(value, field, maxLength);
}

function stringList(value: unknown, field: string, maxItems = 20): string[] {
  if (
    !Array.isArray(value)
    || value.length > maxItems
    || value.some((entry) => typeof entry !== "string" || !entry.trim() || entry.length > 120)
  ) {
    throw new Error(`${field} must be a bounded string array`);
  }
  return value;
}

function httpsUrl(value: unknown, field: string): string {
  const raw = text(value, field, 2_048);
  const url = new URL(raw);
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error(`${field} must be a credential-free HTTPS URL`);
  }
  return raw;
}

function googleMapsUrl(value: unknown, field: string): string {
  const raw = text(value, field, 2_048);
  const safe = validateGoogleMapsUrl(raw);
  if (!safe || classifyGoogleMapsHandoff(safe) === "search") {
    throw new Error(`${field} must be a supported Google Maps URL for a specific venue`);
  }
  return safe;
}

function officialUrl(value: unknown, field: string): string {
  const raw = text(value, field, 2_048);
  const safe = validateOfficialWebsiteUrl(raw);
  if (!safe) throw new Error(`${field} must be a public HTTPS URL`);
  return safe;
}

function instagramUrl(value: unknown, field: string): string {
  const raw = text(value, field, 2_048);
  const safe = validateInstagramUrl(raw);
  if (!safe) throw new Error(`${field} must be an Instagram HTTPS URL`);
  return safe;
}

function timestamp(value: unknown, field: string): string {
  const raw = text(value, field, 40);
  const parsed = Date.parse(raw);
  if (!Number.isFinite(parsed) || new Date(parsed).toISOString() !== raw) {
    throw new Error(`${field} must be an ISO timestamp`);
  }
  return raw;
}

function district(value: unknown, index: number): MobileDistrict {
  const item = record(value);
  const id = text(item.id, `districts[${index}].id`, 120);
  const slug = text(item.slug, `districts[${index}].slug`, 120);
  if (id !== slug || !SLUG_PATTERN.test(slug)) throw new Error(`districts[${index}] has an invalid identity`);
  const guidePath = nullableText(item.guidePath, `districts[${index}].guidePath`);
  if (guidePath && !/^\/(?!\/)[A-Za-z0-9/_-]*$/.test(guidePath)) {
    throw new Error(`districts[${index}].guidePath must be an internal path`);
  }
  return {
    id,
    slug,
    name: text(item.name, `districts[${index}].name`, 160),
    region: text(item.region, `districts[${index}].region`, 160),
    moment: text(item.moment, `districts[${index}].moment`),
    bestFor: stringList(item.bestFor, `districts[${index}].bestFor`),
    mapsUrl: httpsUrl(item.mapsUrl, `districts[${index}].mapsUrl`),
    guidePath,
  };
}

function venue(value: unknown, index: number): MobileVenueCompact {
  const item = record(value);
  if (typeof item.isSponsored !== "boolean") {
    throw new Error(`venues[${index}].isSponsored must be boolean`);
  }
  const id = text(item.id, `venues[${index}].id`, 160);
  const slug = text(item.slug, `venues[${index}].slug`, 120);
  const category = text(item.category, `venues[${index}].category`, 120);
  const districtSlug = text(item.district, `venues[${index}].district`, 120);
  if (!SLUG_PATTERN.test(slug) || !VENUE_TYPE_SET.has(category) || !DISTRICT_SET.has(districtSlug)) {
    throw new Error(`venues[${index}] has an unsupported taxonomy value`);
  }
  return {
    id,
    slug,
    name: text(item.name, `venues[${index}].name`, 160),
    category,
    district: districtSlug,
    subarea: nullableText(item.subarea, `venues[${index}].subarea`),
    photoUrl: item.photoUrl === null ? null : httpsUrl(item.photoUrl, `venues[${index}].photoUrl`),
    bestFor: nullableText(item.bestFor, `venues[${index}].bestFor`),
    isSponsored: item.isSponsored,
  };
}

export function parseMobileVenueCompact(value: unknown): MobileVenueCompact {
  return venue(value, 0);
}

export function parseMobileVenue(value: unknown): MobileVenue {
  const item = record(value);
  const compact = parseMobileVenueCompact(item);
  return {
    ...compact,
    fullAddress: nullableText(item.fullAddress, "venue.fullAddress"),
    mapsUrl: googleMapsUrl(item.mapsUrl, "venue.mapsUrl"),
    officialUrl: item.officialUrl === null ? null : officialUrl(item.officialUrl, "venue.officialUrl"),
    instagramUrl: item.instagramUrl === null ? null : instagramUrl(item.instagramUrl, "venue.instagramUrl"),
    priceLabel: nullableText(item.priceLabel, "venue.priceLabel", 240),
    whatToOrder: nullableText(item.whatToOrder, "venue.whatToOrder"),
    whyItsHere: nullableText(item.whyItsHere, "venue.whyItsHere"),
    notFor: nullableText(item.notFor, "venue.notFor"),
    practicalTags: stringList(item.practicalTags, "venue.practicalTags"),
    vibes: stringList(item.vibes, "venue.vibes"),
  };
}

function route(value: unknown, index: number): MobileRouteSummary {
  const item = record(value);
  if (!Number.isInteger(item.stopCount) || Number(item.stopCount) < 1 || Number(item.stopCount) > 20) {
    throw new Error(`routes[${index}].stopCount must be between 1 and 20`);
  }
  const id = text(item.id, `routes[${index}].id`, 120);
  const slug = text(item.slug, `routes[${index}].slug`, 120);
  if (id !== slug || !SLUG_PATTERN.test(slug)) throw new Error(`routes[${index}] has an invalid identity`);
  return {
    id,
    slug,
    title: text(item.title, `routes[${index}].title`, 200),
    subtitle: nullableText(item.subtitle, `routes[${index}].subtitle`, 300),
    stopCount: Number(item.stopCount),
  };
}

function routeDetail(value: unknown): MobileRouteDetail {
  const item = record(value);
  const summary = route(item, 0);
  if (!Array.isArray(item.stops) || item.stops.length !== summary.stopCount) {
    throw new Error("route.stops must match stopCount");
  }
  const stops = item.stops.map((value, index) => {
    const stop = record(value);
    if (stop.position !== index + 1) {
      throw new Error(`route.stops[${index}].position must be sequential`);
    }
    return {
      position: index + 1,
      venue: parseMobileVenueCompact(stop.venue),
    };
  });
  return { ...summary, stops };
}

export function parseMobileBootstrap(value: unknown): MobileBootstrapPayload {
  const envelope = record(value);
  if (envelope.schemaVersion !== 1) throw new Error("Unsupported mobile API schema version");
  const updatedAt = timestamp(envelope.updatedAt, "updatedAt");

  const data = record(envelope.data);
  const config = record(data.config);
  if (config.appName !== "Other Bali" || config.defaultLocale !== "en") {
    throw new Error("Unsupported mobile app configuration");
  }
  if (data.minimumSupportedApiVersion !== 1) {
    throw new Error("This shell does not support the required API version");
  }
  if (!Array.isArray(data.districts) || !Array.isArray(data.venues) || !Array.isArray(data.routes)) {
    throw new Error("Bootstrap collections must be arrays");
  }
  if (data.districts.length > 50 || data.venues.length > 500 || data.routes.length > 100) {
    throw new Error("Bootstrap collection limit exceeded");
  }
  if (data.consentVersion !== MOBILE_CONSENT_VERSION) throw new Error("Unsupported consent version");
  const canonicalOrigin = httpsUrl(config.canonicalOrigin, "config.canonicalOrigin");
  const privacyPolicyUrl = httpsUrl(config.privacyPolicyUrl, "config.privacyPolicyUrl");
  const supportUrl = httpsUrl(config.supportUrl, "config.supportUrl");
  if (
    canonicalOrigin !== "https://www.otherbali.com"
    || privacyPolicyUrl !== "https://www.otherbali.com/privacy"
    || supportUrl !== "https://www.otherbali.com/support"
  ) {
    throw new Error("Mobile app configuration contains an unsupported origin");
  }

  return {
    schemaVersion: 1,
    updatedAt,
    data: {
      config: {
        appName: "Other Bali",
        defaultLocale: "en",
        canonicalOrigin,
        privacyPolicyUrl,
        supportUrl,
      },
      districts: data.districts.map(district),
      venues: data.venues.map(venue),
      routes: data.routes.map(route),
      consentVersion: MOBILE_CONSENT_VERSION,
      minimumSupportedApiVersion: 1,
    },
  };
}

export function parseMobileVenueDetail(value: unknown): MobileVenueDetailPayload {
  const envelope = record(value);
  if (envelope.schemaVersion !== 1) throw new Error("Unsupported mobile API schema version");
  const updatedAt = timestamp(envelope.updatedAt, "updatedAt");
  const data = record(envelope.data);
  return {
    schemaVersion: 1,
    updatedAt,
    data: {
      venue: parseMobileVenue(data.venue),
    },
  };
}

export function parseMobileRouteDetail(value: unknown): MobileRouteDetailPayload {
  const envelope = record(value);
  if (envelope.schemaVersion !== 1) throw new Error("Unsupported mobile API schema version");
  const updatedAt = timestamp(envelope.updatedAt, "updatedAt");
  const data = record(envelope.data);
  return {
    schemaVersion: 1,
    updatedAt,
    data: {
      route: routeDetail(data.route),
    },
  };
}
