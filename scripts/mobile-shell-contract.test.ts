import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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

test("mobile navigation commits root and detail transitions before a forced process exit", () => {
  const source = readFileSync(new URL("../mobile/src/App.tsx", import.meta.url), "utf8");
  for (const handler of ["chooseSurface", "openVenue", "openRoute"]) {
    const start = source.indexOf(`function ${handler}`);
    assert.notEqual(start, -1, `${handler} must exist`);
    const body = source.slice(start, source.indexOf("\n  }", start) + 4);
    assert.match(body, /navigationSnapshotRef\.current = navigation/);
    assert.match(body, /writeNavigationState\(navigation\)/);
  }
});

test("photo-less Discover cards use approved area media with a truth label", () => {
  const component = readFileSync(
    new URL("../mobile/src/SelectionExperience.tsx", import.meta.url),
    "utf8",
  );
  const styles = readFileSync(new URL("../mobile/src/styles.css", import.meta.url), "utf8");
  assert.match(component, /editorialImageUrl\(snapshot\.venue\)/);
  assert.match(component, /Area mood/);
  assert.match(component, /wider area mood, not the named venue/);
  assert.match(styles, /\.discover-media\s*\{/);
});

test("selection feedback stays visible in the sticky navigation flow", () => {
  const source = readFileSync(new URL("../mobile/src/App.tsx", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../mobile/src/styles.css", import.meta.url), "utf8");

  const heroStart = source.indexOf('<header className="hero">');
  const heroEnd = source.indexOf("</header>", heroStart);
  const stickyStart = source.indexOf('<div className="sticky-navigation">', heroEnd);
  const stickyEnd = source.indexOf("</div>", stickyStart);
  const mainStart = source.indexOf('<main id="main-content">', stickyStart);

  assert.ok(heroStart >= 0 && heroEnd > heroStart);
  assert.doesNotMatch(source.slice(heroStart, heroEnd), /selectionNotice/);
  assert.ok(stickyStart > heroEnd && stickyEnd > stickyStart && stickyEnd < mainStart);
  const stickyMarkup = source.slice(stickyStart, stickyEnd);
  assert.match(stickyMarkup, /<nav className="tabs"/);
  assert.match(stickyMarkup, /className="action-feedback"/);
  assert.match(stickyMarkup, /role="status"/);
  assert.match(stickyMarkup, /aria-live="polite"/);
  assert.match(stickyMarkup, /aria-atomic="true"/);
  assert.match(stickyMarkup, /\{selectionNotice\}/);

  const stickyRule = styles.match(/\.sticky-navigation\s*\{([^}]*)\}/)?.[1] ?? "";
  assert.match(stickyRule, /position:\s*sticky/);
  assert.match(stickyRule, /safe-area-inset-top/);
  assert.match(stickyRule, /z-index:\s*2/);

  const feedbackRule = styles.match(/\.action-feedback\s*\{([^}]*)\}/)?.[1] ?? "";
  assert.match(feedbackRule, /display:\s*flex/);
  assert.match(feedbackRule, /min-height:\s*48px/);
  assert.match(feedbackRule, /margin:\s*0/);
  assert.match(feedbackRule, /background:\s*var\(--panel\)/);

  const tabsRule = styles.match(/\.tabs\s*\{([^}]*)\}/)?.[1] ?? "";
  assert.doesNotMatch(tabsRule, /position:\s*sticky/);
  assert.match(tabsRule, /margin:\s*0/);
  assert.match(
    source,
    /if \(!selectionNotice\) return;[\s\S]{0,160}?setSelectionNotice\(null\), 6_000/,
  );
});
