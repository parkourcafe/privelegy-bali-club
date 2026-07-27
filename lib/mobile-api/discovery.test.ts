import assert from "node:assert/strict";
import test from "node:test";
import type { MobileVenue } from "./contracts";

interface DiscoveryCard {
  venue: MobileVenue;
  reasonShown: string;
  whyThisPlace: string;
  skipIf: string | null;
  tags: string[];
  freshness: string;
}

interface DiscoveryPage {
  items: DiscoveryCard[];
  nextCursor: string | null;
  end: boolean;
}

interface DecisionSlot {
  venue: MobileVenue;
  explanation: string;
}

interface MobileDecision {
  best: DecisionSlot | null;
  backup: DecisionSlot | null;
  contrast: DecisionSlot | null;
  emptyStateReason: string | null;
}

interface DiscoveryModule {
  buildMobileDiscoveryPage?: (
    venues: readonly MobileVenue[],
    options: {
      district: string;
      category: string;
      cursor: string | null;
      limit: number;
      updatedAt: string;
    },
  ) => DiscoveryPage;
  createMobileDecision?: (
    venues: readonly MobileVenue[],
    context: {
      area: string;
      moment: string;
      budget: string;
      company: string;
      updatedAt: string;
    },
  ) => MobileDecision;
}

const discoveryModulePath = "./discovery";

async function loadDiscoveryModule(): Promise<DiscoveryModule> {
  try {
    return await import(discoveryModulePath) as DiscoveryModule;
  } catch {
    return {};
  }
}

function venue(
  id: string,
  overrides: Partial<MobileVenue> = {},
): MobileVenue {
  return {
    id,
    slug: id,
    name: id,
    category: "cafe",
    district: "sanur",
    subarea: "beach",
    photoUrl: null,
    bestFor: "Calm mornings",
    isSponsored: false,
    fullAddress: null,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${id}`,
    officialUrl: null,
    instagramUrl: null,
    priceLabel: "$",
    whatToOrder: null,
    whyItsHere: "A calm, low-cost morning stop.",
    notFor: "Late-night parties.",
    practicalTags: ["quiet", "breakfast"],
    vibes: ["calm", "family"],
    ...overrides,
  };
}

const venues: MobileVenue[] = [
  venue("family-morning", {
    bestFor: "Families and calm mornings",
    whyItsHere: "Easy low-cost breakfast for a family.",
    vibes: ["calm", "family", "morning"],
  }),
  venue("sunset-date", {
    bestFor: "Couples at sunset",
    priceLabel: "$$$",
    whyItsHere: "Premium sunset dinner for couples.",
    notFor: "A low budget.",
    vibes: ["sunset", "couple", "dinner"],
  }),
  venue("quiet-work", {
    bestFor: "Quiet solo time",
    priceLabel: "$$",
    whyItsHere: "A quiet mid-budget afternoon.",
    vibes: ["quiet", "solo"],
  }),
  venue("sanur-dinner", {
    category: "restaurant",
    priceLabel: "$$",
    bestFor: "Dinner with friends",
    whyItsHere: "A sociable dinner in Sanur.",
    vibes: ["friends", "dinner"],
  }),
  venue("ubud-cafe", {
    district: "ubud",
    bestFor: "Ubud mornings",
  }),
  venue("family-morning", {
    name: "duplicate must not replace the canonical first item",
    isSponsored: true,
  }),
];

function decisionIds(result: MobileDecision): string[] {
  return [result.best, result.backup, result.contrast]
    .filter((slot): slot is DecisionSlot => slot !== null)
    .map((slot) => slot.venue.id);
}

test("shared discovery page is exact, deterministic, organic and cursor bounded", async () => {
  const discovery = await loadDiscoveryModule();
  assert.equal(typeof discovery.buildMobileDiscoveryPage, "function");
  const buildPage = discovery.buildMobileDiscoveryPage!;
  const options = {
    district: "sanur",
    category: "cafe",
    cursor: null,
    limit: 2,
    updatedAt: "2026-07-28T08:00:00.000Z",
  };

  const first = buildPage(venues, options);
  const changedPaid = buildPage(
    venues.map((item) => ({ ...item, isSponsored: !item.isSponsored })),
    options,
  );
  assert.deepEqual(first.items.map((card) => card.venue.id), [
    "family-morning",
    "sunset-date",
  ]);
  assert.deepEqual(
    changedPaid.items.map((card) => card.venue.id),
    first.items.map((card) => card.venue.id),
  );
  assert.equal(typeof first.nextCursor, "string");
  assert.doesNotMatch(first.nextCursor!, /^\d+$/);
  assert.equal(first.end, false);

  const second = buildPage(venues, { ...options, cursor: first.nextCursor });
  assert.deepEqual(second.items.map((card) => card.venue.id), ["quiet-work"]);
  assert.equal(second.nextCursor, null);
  assert.equal(second.end, true);
  assert.deepEqual(
    new Set([
      ...first.items.map((card) => card.venue.id),
      ...second.items.map((card) => card.venue.id),
    ]).size,
    3,
  );

  const empty = buildPage(venues, {
    ...options,
    district: "uluwatu",
    cursor: null,
  });
  assert.deepEqual(empty.items, []);
  for (const card of [...first.items, ...second.items]) {
    assert.ok(card.reasonShown.trim());
    assert.ok(card.whyThisPlace.trim());
    assert.ok(Object.hasOwn(card, "skipIf"));
    assert.ok(Array.isArray(card.tags));
    assert.ok(card.freshness.trim());
    assert.doesNotMatch(JSON.stringify(card), /\bverified\b/i);
  }
});

test("Decision uses the same exact organic universe and responds to meaningful context", async () => {
  const discovery = await loadDiscoveryModule();
  assert.equal(typeof discovery.createMobileDecision, "function");
  const createDecision = discovery.createMobileDecision!;
  const calmFamily = createDecision(venues, {
    area: "sanur",
    moment: "calm morning",
    budget: "low",
    company: "family",
    updatedAt: "2026-07-28T08:00:00.000Z",
  });
  const sunsetCouple = createDecision(venues, {
    area: "sanur",
    moment: "sunset dinner",
    budget: "premium",
    company: "couple",
    updatedAt: "2026-07-28T08:00:00.000Z",
  });
  const withoutPaidSignal = createDecision(
    venues.map((item) => ({ ...item, isSponsored: false })),
    {
      area: "sanur",
      moment: "sunset dinner",
      budget: "premium",
      company: "couple",
      updatedAt: "2026-07-28T08:00:00.000Z",
    },
  );

  assert.deepEqual(decisionIds(calmFamily).length, 3);
  assert.deepEqual(new Set(decisionIds(calmFamily)).size, 3);
  assert.ok(decisionIds(calmFamily).every((id) => id !== "ubud-cafe"));
  assert.equal(calmFamily.best?.venue.id, "family-morning");
  assert.equal(sunsetCouple.best?.venue.id, "sunset-date");
  assert.notDeepEqual(decisionIds(sunsetCouple), decisionIds(calmFamily));
  assert.notEqual(
    sunsetCouple.best?.explanation,
    calmFamily.best?.explanation,
  );
  assert.deepEqual(
    decisionIds(withoutPaidSignal),
    decisionIds(sunsetCouple),
  );
  assert.doesNotMatch(JSON.stringify(sunsetCouple), /sponsor|paid/i);
  assert.equal(calmFamily.emptyStateReason, null);
  assert.equal(sunsetCouple.emptyStateReason, null);
});

test("Decision reports insufficient exact-area candidates without duplication or cross-fill", async () => {
  const discovery = await loadDiscoveryModule();
  assert.equal(typeof discovery.createMobileDecision, "function");
  const result = discovery.createMobileDecision!(venues, {
    area: "ubud",
    moment: "morning",
    budget: "low",
    company: "solo",
    updatedAt: "2026-07-28T08:00:00.000Z",
  });
  const ids = decisionIds(result);

  assert.ok(ids.every((id) => id === "ubud-cafe"));
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(result.emptyStateReason?.trim());
  assert.match(result.emptyStateReason!, /not enough|insufficient|fewer|available/i);
});
