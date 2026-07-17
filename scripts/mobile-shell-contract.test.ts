import assert from "node:assert/strict";
import test from "node:test";
import {
  parseMobileBootstrap,
  parseMobileRouteDetail,
  parseMobileVenueCompact,
  parseMobileVenueDetail,
} from "../mobile/src/contracts";

function validBootstrap() {
  return {
    schemaVersion: 1,
    updatedAt: "2026-07-14T08:00:00.000Z",
    data: {
      config: {
        appName: "Other Bali",
        defaultLocale: "en",
        canonicalOrigin: "https://www.otherbali.com",
        privacyPolicyUrl: "https://www.otherbali.com/privacy",
        supportUrl: "https://www.otherbali.com/support",
      },
      districts: [{
        id: "ubud",
        slug: "ubud",
        name: "Ubud",
        region: "Central Bali",
        moment: "A slower cultural day",
        bestFor: ["art"],
        mapsUrl: "https://www.google.com/maps/place/Ubud",
        guidePath: "/districts/ubud",
      }],
      venues: [{
        id: "venue-1",
        slug: "sample-cafe",
        name: "Sample Cafe",
        category: "cafe",
        district: "ubud",
        subarea: null,
        photoUrl: null,
        bestFor: "A quiet coffee",
        isSponsored: false,
      }],
      routes: [{
        id: "quiet-ubud",
        slug: "quiet-ubud",
        title: "Quiet Ubud",
        subtitle: null,
        stopCount: 1,
      }],
      consentVersion: "2026-07-14",
      minimumSupportedApiVersion: 1,
    },
  };
}

test("mobile shell accepts the canonical v1 bootstrap contract", () => {
  const parsed = parseMobileBootstrap(validBootstrap());
  assert.equal(parsed.schemaVersion, 1);
  assert.equal(parsed.data.venues[0]?.name, "Sample Cafe");
});

test("mobile shell rejects schema drift, unsafe config, and malformed nullable fields", () => {
  const schemaDrift = validBootstrap();
  schemaDrift.schemaVersion = 2;
  assert.throws(() => parseMobileBootstrap(schemaDrift), /Unsupported mobile API schema version/);

  const unsafeOrigin = validBootstrap();
  unsafeOrigin.data.config.supportUrl = "https://lookalike.invalid/support";
  assert.throws(() => parseMobileBootstrap(unsafeOrigin), /unsupported origin/);

  const malformedVenue = validBootstrap().data.venues[0];
  assert.throws(
    () => parseMobileVenueCompact({ ...malformedVenue, subarea: undefined }),
    /subarea must be bounded text/,
  );
});

function validVenueDetail() {
  return {
    schemaVersion: 1,
    updatedAt: "2026-07-14T08:05:00.000Z",
    data: {
      venue: {
        ...validBootstrap().data.venues[0],
        fullAddress: "1 Sample Road, Ubud",
        mapsUrl: "https://www.google.com/maps/place/Sample+Cafe",
        officialUrl: "https://samplecafe.example.org/",
        instagramUrl: null,
        priceLabel: "IDR 50k–100k",
        whatToOrder: "Coffee",
        whyItsHere: "A calm stop.",
        notFor: null,
        practicalTags: ["outdoor seating"],
        vibes: ["quiet"],
      },
    },
  };
}

test("mobile shell accepts bounded full venue detail with exact Google Maps directions", () => {
  const parsed = parseMobileVenueDetail(validVenueDetail());
  assert.equal(parsed.data.venue.mapsUrl, "https://www.google.com/maps/place/Sample+Cafe");
  assert.equal(parsed.data.venue.fullAddress, "1 Sample Road, Ubud");
});

test("mobile shell rejects lookalike Maps hosts and oversized full-detail arrays", () => {
  const lookalike = validVenueDetail();
  lookalike.data.venue.mapsUrl = "https://www.google.com.evil.invalid/maps/place/Sample";
  assert.throws(() => parseMobileVenueDetail(lookalike), /supported Google Maps/);

  const oversized = validVenueDetail();
  oversized.data.venue.practicalTags = Array.from({ length: 21 }, (_, index) => `tag-${index}`);
  assert.throws(() => parseMobileVenueDetail(oversized), /bounded string array/);
});

test("mobile shell accepts a bounded route detail and rejects non-sequential stops", () => {
  const payload = {
    schemaVersion: 1,
    updatedAt: "2026-07-14T08:10:00.000Z",
    data: {
      route: {
        ...validBootstrap().data.routes[0],
        stops: [{ position: 1, venue: validBootstrap().data.venues[0] }],
      },
    },
  };
  assert.equal(parseMobileRouteDetail(payload).data.route.stops[0]?.venue.slug, "sample-cafe");

  payload.data.route.stops[0]!.position = 2;
  assert.throws(() => parseMobileRouteDetail(payload), /position must be sequential/);
});
