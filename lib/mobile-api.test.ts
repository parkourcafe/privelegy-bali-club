import assert from "node:assert/strict";
import test from "node:test";
import {
  MOBILE_API_MINIMUM_SUPPORTED_VERSION,
  MOBILE_API_SCHEMA_VERSION,
  MOBILE_APP_CONFIG,
  MOBILE_CONSENT_VERSION,
  compactMobileVenue,
  isMobileSlug,
  mobileBootstrapDataSchema,
  mobileSuccessEnvelopeSchema,
  mobileVenueDataSchema,
  toMobileDistrict,
  toMobileRouteDetail,
  toMobileRouteSummary,
  toMobileVenue,
  type MobileBootstrapData,
  type MobileVenueData,
} from "./mobile-api/contracts";
import {
  mobileApiError,
  mobileApiOptions,
  mobileApiSuccess,
  requestMatchesEtag,
} from "./mobile-api/http";
import type { Venue } from "./types";

const publishedVenue: Venue = {
  id: "venue-stable-1",
  slug: "verified-cafe",
  name: "Verified Cafe",
  category: "cafe",
  district: "canggu",
  address: "",
  gmapsUrl: "https://www.google.com/maps/place/Verified+Cafe",
  officialUrl: "https://verified.example.org",
  instagramUrl: "https://www.instagram.com/verified",
  tier: "editorial_seed",
  status: "active",
  isSponsored: false,
  area: "Berawa",
  whyItsHere: "A useful editorial reason.",
  bestFor: "Quiet breakfasts",
  notFor: "Large groups",
  practicalTags: ["wifi", "wifi", "opens early"],
  vibeTags: ["quiet"],
  priceAnchor: "Coffee from 35k",
  whatToOrder: "Filter coffee",
  photoUrl: "https://images.example.org/unverified.jpg",
  ownerNote: "internal owner copy",
  publicationStatus: "published",
};

test("mobile venue mapper emits a strict public DTO with explicit nulls", () => {
  const venue = toMobileVenue(publishedVenue);
  assert.ok(venue);
  assert.equal(venue.fullAddress, null);
  assert.equal(venue.photoUrl, null, "legacy photos stay hidden without a rights-state DTO");
  assert.equal(venue.officialUrl, "https://verified.example.org/");
  assert.deepEqual(venue.practicalTags, ["wifi", "opens early"]);
  assert.equal("tier" in venue, false);
  assert.equal("status" in venue, false);
  assert.equal("publicationStatus" in venue, false);
  assert.equal("ownerNote" in venue, false);
  assert.equal("perk" in venue, false);
  assert.equal(mobileVenueDataSchema.safeParse({ venue }).success, true);
});

test("mobile venue contract rejects leaked raw or editorial fields", () => {
  const venue = toMobileVenue(publishedVenue);
  assert.ok(venue);
  assert.equal(mobileVenueDataSchema.safeParse({
    venue: { ...venue, tier: "founding" },
  }).success, false);
  assert.equal(mobileVenueDataSchema.safeParse({
    venue: { ...venue, fullAddress: undefined },
  }).success, false);
});

test("mobile mapper rejects invalid public URLs and unsupported taxonomy", () => {
  assert.equal(toMobileVenue({
    ...publishedVenue,
    officialUrl: "https://user:secret@example.org/private",
  })?.officialUrl, null);
  assert.equal(toMobileVenue({
    ...publishedVenue,
    gmapsUrl: "https://evil.example/maps",
  }), null);
  assert.equal(toMobileVenue({
    ...publishedVenue,
    gmapsUrl: "https://www.google.com/maps/search/?api=1&query=Verified+Cafe",
  }), null, "a generated search must not be presented as an exact venue handoff");
  assert.equal(toMobileVenue({
    ...publishedVenue,
    category: "internal_review" as Venue["category"],
  }), null);
});

test("bootstrap contract is bounded, versioned, and contains compact DTOs", () => {
  const venue = toMobileVenue(publishedVenue);
  const district = toMobileDistrict({
    slug: "canggu",
    name: "Canggu",
    status: "active_deep",
    region: "South-west coast",
    moment: "Surf mornings.",
    bestFor: ["surf"],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Canggu",
    guidePath: "/canggu",
  });
  assert.ok(venue);
  assert.ok(district);
  const route = toMobileRouteDetail({
    slug: "first-day",
    title: "First day",
    subtitle: undefined,
    stops: [publishedVenue],
  });
  assert.ok(route);
  const data: MobileBootstrapData = {
    config: MOBILE_APP_CONFIG,
    districts: [district],
    venues: [compactMobileVenue(venue)],
    routes: [toMobileRouteSummary(route)],
    consentVersion: MOBILE_CONSENT_VERSION,
    minimumSupportedApiVersion: MOBILE_API_MINIMUM_SUPPORTED_VERSION,
  };
  assert.equal(mobileBootstrapDataSchema.safeParse(data).success, true);

  const envelope = {
    schemaVersion: MOBILE_API_SCHEMA_VERSION,
    updatedAt: "2026-07-14T00:00:00.000Z",
    data,
  };
  assert.equal(mobileSuccessEnvelopeSchema(mobileBootstrapDataSchema).safeParse(envelope).success, true);
});

test("route DTO uses stable IDs, explicit nullable subtitle, and ordered stops", () => {
  const route = toMobileRouteDetail({
    slug: "first-day",
    title: "First day",
    stops: [publishedVenue, { ...publishedVenue, id: "venue-stable-2", slug: "second-stop" }],
  });
  assert.ok(route);
  assert.equal(route.id, route.slug);
  assert.equal(route.subtitle, null);
  assert.deepEqual(route.stops.map((stop) => stop.position), [1, 2]);
  assert.deepEqual(route.stops.map((stop) => stop.venue.slug), ["verified-cafe", "second-stop"]);
});

test("success responses support ETag revalidation and public read-only CORS", async () => {
  const venue = toMobileVenue(publishedVenue);
  assert.ok(venue);
  const first = mobileApiSuccess(
    new Request("https://www.otherbali.com/api/mobile/v1/venues/verified-cafe"),
    { venue },
    mobileVenueDataSchema,
  );
  assert.equal(first.status, 200);
  assert.equal(first.headers.get("access-control-allow-origin"), "*");
  assert.equal(
    first.headers.get("access-control-allow-headers"),
    "Accept, If-None-Match, X-Other-Bali-Mobile-Shell",
  );
  assert.match(
    first.headers.get("access-control-expose-headers") ?? "",
    /(?:^|, )X-Request-ID(?:,|$)/,
  );
  assert.match(first.headers.get("cache-control") ?? "", /s-maxage=300/);
  const etag = first.headers.get("etag");
  assert.ok(etag);
  assert.equal(requestMatchesEtag(`W/${etag}`, etag), true);

  const second = mobileApiSuccess(
    new Request("https://www.otherbali.com/api/mobile/v1/venues/verified-cafe", {
      headers: { "If-None-Match": etag },
    }),
    { venue },
    mobileVenueDataSchema,
  );
  assert.equal(second.status, 304);
  assert.equal(await second.text(), "");
  assert.equal(second.headers.get("etag"), etag);

  const preflight = mobileApiOptions();
  assert.equal(preflight.status, 204);
  assert.match(
    preflight.headers.get("access-control-allow-headers") ?? "",
    /X-Other-Bali-Mobile-Shell/,
  );
});

test("invalid output fails closed and public errors do not expose internals", async () => {
  const response = mobileApiSuccess(
    new Request("https://www.otherbali.com/api/mobile/v1/venues"),
    { venue: { secret: "service-role" } } as unknown as MobileVenueData,
    mobileVenueDataSchema,
  );
  assert.equal(response.status, 503);
  const body = await response.text();
  assert.equal(body.includes("service-role"), false);
  assert.deepEqual(JSON.parse(body).error, {
    code: "temporarily_unavailable",
    message: "The service is temporarily unavailable.",
  });

  const notFound = mobileApiError("not_found", 404);
  assert.equal(notFound.headers.get("cache-control"), "no-store");
  assert.equal((await notFound.json() as { error: { code: string } }).error.code, "not_found");
});

test("mobile path identifiers are bounded lowercase kebab-case", () => {
  assert.equal(isMobileSlug("first-day"), true);
  assert.equal(isMobileSlug("../admin"), false);
  assert.equal(isMobileSlug("Uppercase"), false);
  assert.equal(isMobileSlug("a".repeat(121)), false);
});
