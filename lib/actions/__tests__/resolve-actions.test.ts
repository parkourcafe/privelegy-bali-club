import assert from "node:assert/strict";
import test from "node:test";

import { menuActionFixtures } from "../../contracts/menu-action.fixtures";
import type {
  ActionKind,
  VenueActionBarProps,
  VenueActionCapabilityRecord,
} from "../../contracts/menu-action";
import { resolveVenueActions } from "../resolve-actions";

const NOW = new Date("2026-07-13T12:00:00.000Z");
const TABLEPILOT_TEST_BASE = "https://tablepilot.example";

function cloneCapability(index = 0): VenueActionCapabilityRecord {
  return structuredClone(menuActionFixtures.capabilities[index]);
}

function capability(
  overrides: Partial<VenueActionCapabilityRecord>,
  fixtureIndex = 0
): VenueActionCapabilityRecord {
  return { ...cloneCapability(fixtureIndex), ...overrides };
}

function props(overrides: Partial<VenueActionBarProps> = {}): VenueActionBarProps {
  return {
    venueSlug: "fixture-venue",
    venueName: "Fixture Venue",
    district: "canggu",
    coverageMode: "active_deep",
    capabilities: structuredClone(menuActionFixtures.capabilities),
    fallbacks: {},
    ...overrides,
  };
}

function resolve(
  input: VenueActionBarProps,
  options: { now?: Date; tablepilotBaseUrl?: string; allowReviewCandidates?: boolean } = {}
) {
  return resolveVenueActions(input, { now: NOW, ...options });
}

test("shows unverified draft actions only inside the protected review mode", () => {
  const draftReserve = capability({
    id: "draft-official-reserve",
    status: "draft",
    provider: "official",
    url: "https://venue-bali.com/reserve",
    sourceUrl: "https://venue-bali.com/reserve",
    verifiedAt: null,
    expiresAt: null,
  });
  const input = props({ coverageMode: "planning_only", capabilities: [draftReserve] });

  assert.deepEqual(resolve(input).all, []);
  assert.equal(
    resolve(input, { allowReviewCandidates: true }).primary?.id,
    "draft-official-reserve",
  );
});

test("resolves TablePilot with its external slug, fixed attribution, and safe UI metadata", () => {
  const result = resolve(props(), { tablepilotBaseUrl: TABLEPILOT_TEST_BASE });

  assert.equal(result.primary?.id, "fixture-reserve");
  assert.equal(result.primary?.kind, "reserve");
  assert.equal(result.primary?.provider, "tablepilot");
  assert.equal(result.primary?.providerLabel, "TablePilot");
  assert.equal(result.primary?.href, "https://tablepilot.example/book/fixture-venue?source=bali_privilege");
  assert.equal(result.primary?.label, "Reserve");
  assert.equal(result.primary?.disclosure, "Booking handled by TablePilot");
  assert.equal(result.primary?.confirmationRequired, true);
  assert.equal(result.primary?.source, "capability");
  assert.deepEqual(result.primary?.eventPayload, {
    action: "reserve",
    provider: "tablepilot",
    capabilityId: "fixture-reserve",
    venueSlug: "fixture-venue",
  });
  assert.equal(result.maps?.provider, "google_maps");
  assert.deepEqual(result.alternatives, []);
  assert.deepEqual(result.all.map((action) => action.id), ["fixture-reserve", "fixture-maps"]);
});

test("rejects the canonical .example TablePilot URL unless that exact base is injected", () => {
  const production = resolve(props());
  const injected = resolve(props(), { tablepilotBaseUrl: TABLEPILOT_TEST_BASE });

  assert.equal(production.primary, null);
  assert.equal(production.maps?.id, "fixture-maps");
  assert.equal(injected.primary?.provider, "tablepilot");
});

test("rebuilds TablePilot URLs and discards untrusted query parameters", () => {
  const reserve = capability({
    url: "https://tablepilot.example/book/external-tablepilot-slug?source=wrong&guest=secret",
  });
  const result = resolve(props({ capabilities: [reserve] }), {
    tablepilotBaseUrl: TABLEPILOT_TEST_BASE,
  });

  assert.equal(
    result.primary?.href,
    "https://tablepilot.example/book/external-tablepilot-slug?source=bali_privilege"
  );
});

test("uses a validated legacy TablePilot slug only in active-deep coverage", () => {
  const base = props({
    capabilities: [],
    fallbacks: { tablepilotSlug: "actual-external-slug" },
  });

  const active = resolve(base, { tablepilotBaseUrl: TABLEPILOT_TEST_BASE });
  const planning = resolve({ ...base, coverageMode: "planning_only" }, {
    tablepilotBaseUrl: TABLEPILOT_TEST_BASE,
  });
  const nextDeep = resolve({ ...base, coverageMode: "next_deep" }, {
    tablepilotBaseUrl: TABLEPILOT_TEST_BASE,
  });

  assert.equal(
    active.primary?.href,
    "https://tablepilot.example/book/actual-external-slug?source=bali_privilege"
  );
  assert.equal(active.primary?.source, "fallback");
  assert.equal(planning.primary, null);
  assert.equal(nextDeep.primary, null);
});

test("allows a verified official reservation outside active-deep coverage", () => {
  const officialReserve = capability({
    id: "official-reserve",
    provider: "official",
    url: "https://book.venue-bali.com/reserve",
    sourceUrl: "https://venue-bali.com/book",
    label: "Instant confirmation",
  });
  const result = resolve(
    props({ coverageMode: "planning_only", capabilities: [officialReserve] })
  );

  assert.equal(result.primary?.provider, "official");
  assert.equal(result.primary?.label, "Reserve");
  assert.match(result.primary?.disclosure ?? "", /official/i);
});

test("fails closed for ineligible capability records", async (t) => {
  const cases: Array<[string, Partial<VenueActionCapabilityRecord>]> = [
    ["wrong venue", { venueSlug: "another-venue" }],
    ["non-confirmed status", { status: "review" }],
    ["missing verification", { verifiedAt: null }],
    ["blank source URL", { sourceUrl: "  " }],
    ["blank source label", { sourceLabel: "" }],
    ["invalid captured timestamp", { capturedAt: "not-a-date" }],
    ["invalid verified timestamp", { verifiedAt: "not-a-date" }],
    ["future verification", { verifiedAt: "2026-07-14T00:00:00.000Z" }],
    ["expired at the boundary", { expiresAt: NOW.toISOString() }],
    ["invalid expiry", { expiresAt: "not-a-date" }],
    ["negative priority", { priority: -1 }],
    ["fractional priority", { priority: 1.5 }],
  ];

  for (const [name, overrides] of cases) {
    await t.test(name, () => {
      const result = resolve(
        props({ capabilities: [capability(overrides, 1)] })
      );
      assert.deepEqual(result.all, []);
    });
  }
});

test("sorts by lower priority, then action-kind rank, then capability id", () => {
  const delivery = capability({
    id: "a-delivery",
    kind: "delivery",
    provider: "grabfood",
    priority: 20,
    url: "https://food.grab.com/id/en/restaurant/fixture",
    sourceUrl: "https://food.grab.com/id/en/restaurant/fixture",
  });
  const reserveZ = capability({
    id: "z-reserve",
    provider: "official",
    priority: 20,
    url: "https://venue-bali.com/reserve/z",
    sourceUrl: "https://venue-bali.com/reserve/z",
  });
  const reserveA = capability({
    id: "a-reserve",
    provider: "official",
    priority: 20,
    url: "https://venue-bali.com/reserve/a",
    sourceUrl: "https://venue-bali.com/reserve/a",
  });
  const result = resolve(
    props({
      coverageMode: "planning_only",
      capabilities: [delivery, reserveZ, reserveA],
    })
  );

  assert.equal(result.primary?.id, "a-reserve");
  assert.deepEqual(result.alternatives.map((action) => action.id), ["z-reserve", "a-delivery"]);
});

test("keeps Maps separate from the primary commerce action regardless of priority", () => {
  const maps = capability({ priority: 0 }, 1);
  const delivery = capability({
    id: "delivery",
    kind: "delivery",
    provider: "gofood",
    priority: 100,
    url: "https://gofood.co.id/bali/restaurant/fixture",
    sourceUrl: "https://gofood.co.id/bali/restaurant/fixture",
  });
  const result = resolve(props({ capabilities: [maps, delivery] }));

  assert.equal(result.primary?.id, "delivery");
  assert.equal(result.maps?.id, "fixture-maps");
  assert.deepEqual(result.all.map((action) => action.id), ["delivery", "fixture-maps"]);
});

test("accepts only approved delivery provider host families", async (t) => {
  const valid: Array<[string, string]> = [
    ["grabfood", "https://r.grab.com/g/fixture"],
    ["gofood", "https://gofood.link/a/fixture"],
    ["shopeefood", "https://shopee.co.id/universal-link/now-food/shop/123"],
  ];

  for (const [provider, url] of valid) {
    await t.test(provider, () => {
      const record = capability({
        id: provider,
        kind: "delivery",
        provider,
        url,
        sourceUrl: url,
      });
      assert.equal(resolve(props({ capabilities: [record] })).primary?.provider, provider);
    });
  }

  const lookalikes = valid.map(([provider, url]) =>
    capability({
      id: `bad-${provider}`,
      kind: "delivery",
      provider,
      url: url.replace(new URL(url).hostname, `${new URL(url).hostname}.evil.invalid`),
      sourceUrl: "https://venue-bali.com/delivery",
    })
  );
  assert.deepEqual(resolve(props({ capabilities: lookalikes })).all, []);
});

test("rejects unknown providers and provider/action mismatches", () => {
  const unknown = capability({
    provider: "mystery_delivery",
    kind: "delivery",
    url: "https://venue-bali.com/order",
    sourceUrl: "https://venue-bali.com/order",
  });
  const mapsAsReserve = capability({
    provider: "google_maps",
    kind: "reserve",
    url: "https://www.google.com/maps/place/Fixture",
    sourceUrl: "https://www.google.com/maps/place/Fixture",
  });

  assert.deepEqual(resolve(props({ capabilities: [unknown, mapsAsReserve] })).all, []);
});

test("validates Google Maps capabilities and fallbacks without accepting lookalikes", () => {
  const badMaps = capability({
    url: "https://maps.google.com.evil.invalid/place/Fixture",
    sourceUrl: "https://maps.google.com.evil.invalid/place/Fixture",
  }, 1);
  const fallbackResult = resolve(
    props({
      capabilities: [badMaps],
      fallbacks: { googleMapsUrl: "https://maps.app.goo.gl/fixture" },
    })
  );
  const invalidFallback = resolve(
    props({
      capabilities: [],
      fallbacks: { googleMapsUrl: "https://notgoogle.com/maps/fixture" },
    })
  );
  const unownedTld = resolve(
    props({
      capabilities: [],
      fallbacks: { googleMapsUrl: "https://maps.google.xyz/place/Fixture" },
    })
  );

  assert.equal(fallbackResult.maps?.provider, "google_maps");
  assert.equal(fallbackResult.maps?.source, "fallback");
  assert.equal(invalidFallback.maps, null);
  assert.equal(unownedTld.maps, null);
});

test("canonicalizes verified WhatsApp capabilities and legacy digit fallbacks", () => {
  const whatsapp = capability({
    id: "whatsapp",
    kind: "whatsapp",
    provider: "whatsapp",
    url: "https://wa.me/628123456789?text=untrusted",
    sourceUrl: "https://wa.me/628123456789",
  }, 1);
  const capabilityResult = resolve(props({ capabilities: [whatsapp] }));
  const fallbackResult = resolve(
    props({ capabilities: [], fallbacks: { whatsapp: "628123456789" } })
  );
  const invalidFallback = resolve(
    props({ capabilities: [], fallbacks: { whatsapp: "+62 812-3456-789" } })
  );

  assert.equal(capabilityResult.primary?.provider, "whatsapp");
  assert.match(capabilityResult.primary?.href ?? "", /^https:\/\/wa\.me\/628123456789\?text=/);
  assert.deepEqual(capabilityResult.primary?.eventPayload, {
    action: "whatsapp",
    provider: "whatsapp",
    capabilityId: "whatsapp",
    venueSlug: "fixture-venue",
  });
  assert.equal(fallbackResult.primary?.source, "fallback");
  assert.equal(invalidFallback.primary, null);
});

test("uses WhatsApp as a neutral delivery or takeaway handoff", async (t) => {
  for (const kind of ["delivery", "takeaway"] as const) {
    await t.test(kind, () => {
      const record = capability({
        id: `whatsapp-${kind}`,
        kind,
        provider: "whatsapp",
        url: "https://wa.me/628123456789?text=untrusted",
        sourceUrl: "https://wa.me/628123456789",
        confirmationRequired: true,
      });
      const result = resolve(props({ capabilities: [record] }));

      assert.equal(result.primary?.kind, kind);
      assert.equal(result.primary?.provider, "whatsapp");
      assert.equal(result.primary?.confirmationRequired, true);
      assert.match(
        decodeURIComponent(result.primary?.href ?? ""),
        new RegExp(kind)
      );
      assert.doesNotMatch(result.primary?.href ?? "", /untrusted/);
    });
  }
});

test("validates direct official hosts and the website fallback", () => {
  const hostMismatch = capability({
    id: "host-mismatch",
    kind: "website",
    provider: "official",
    url: "https://attacker.invalid/venue",
    sourceUrl: "https://venue-bali.com",
  });
  const fallback = resolve(
    props({ capabilities: [hostMismatch], fallbacks: { websiteUrl: "https://venue-bali.com" } })
  );
  const badFallback = resolve(
    props({ capabilities: [], fallbacks: { websiteUrl: "javascript:alert(1)" } })
  );

  assert.equal(fallback.primary?.provider, "official");
  assert.equal(fallback.primary?.href, "https://venue-bali.com/");
  assert.equal(fallback.primary?.source, "fallback");
  assert.equal(badFallback.primary, null);
});

test("does not emit officialMenuUrl as an action", () => {
  const result = resolve(
    props({
      capabilities: [],
      fallbacks: { officialMenuUrl: "https://venue-bali.com/menu" },
    })
  );

  assert.deepEqual(result.all, []);
});

test("returns no placeholders when no capability or fallback exists", () => {
  const result = resolve(props({ capabilities: [], fallbacks: {} }));

  assert.equal(result.primary, null);
  assert.equal(result.maps, null);
  assert.deepEqual(result.alternatives, []);
  assert.deepEqual(result.all, []);
});

test("supports all commerce kinds with canonical labels", () => {
  const kinds: ActionKind[] = ["delivery", "takeaway", "preorder"];
  const records = kinds.map((kind, index) => capability({
    id: kind,
    kind,
    provider: "official",
    priority: index,
    url: `https://venue-bali.com/${kind}`,
    sourceUrl: `https://venue-bali.com/${kind}`,
  }));
  const result = resolve(props({ capabilities: records }));

  assert.deepEqual(result.all.map((action) => action.label), [
    "Delivery",
    "Takeaway",
    "Request pre-order",
  ]);
  assert.equal(
    result.all.find((action) => action.kind === "preorder")?.confirmationRequired,
    true
  );
});
