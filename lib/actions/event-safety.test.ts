import test from "node:test";
import assert from "node:assert/strict";

const eventSafety = (await import(
  new URL("./event-safety.ts", import.meta.url).href
)) as typeof import("./event-safety");
const {
  ALLOWED_EVENT_TYPES,
  parseEventRequest,
} = eventSafety;

const EXISTING_EVENTS = [
  "landing_open",
  "venue_card_open",
  "perk_open",
  "direction_click",
  "reservation_click",
  "similar_open",
  "district_open",
  "district_page_view",
  "editorial_page_view",
  "venue_detail_view",
  "venue_card_click",
  "booking_click",
  "official_website_click",
  "instagram_click",
  "menu_click",
  "partner_offer_click",
  "guide_form_started",
  "guide_form_submitted",
  "whatsapp_guide_click",
  "internal_guide_click",
];

const ADDITIVE_EVENTS = [
  "menu_open",
  "menu_item_open",
  "action_handoff",
  "delivery_click",
  "takeaway_click",
  "preorder_click",
];

test("preserves every existing event and adds the six approved events", () => {
  assert.deepEqual(ALLOWED_EVENT_TYPES, [...EXISTING_EVENTS, ...ADDITIVE_EVENTS]);
});

test("accepts an existing event without action metadata", () => {
  assert.deepEqual(parseEventRequest({ type: "landing_open" }), {
    ok: true,
    event: { type: "landing_open", venueSlug: null, payload: null },
  });
});

test("preserves safe slash-separated page slugs used by existing trackers", () => {
  assert.deepEqual(
    parseEventRequest({
      type: "editorial_page_view",
      venueSlug: "ubud/best-restaurants",
    }),
    {
      ok: true,
      event: {
        type: "editorial_page_view",
        venueSlug: "ubud/best-restaurants",
        payload: null,
      },
    }
  );
});

test("reconstructs only safe action payload keys", () => {
  const result = parseEventRequest({
    type: "action_handoff",
    venueSlug: "fixture-venue",
    payload: {
      action: "delivery",
      provider: "gojek",
      capabilityId: "capability-123",
      venueSlug: "fixture-venue",
      url: "https://example.com/?token=secret",
      message: "private free-form text",
    },
  });

  assert.deepEqual(result, {
    ok: true,
    event: {
      type: "action_handoff",
      venueSlug: "fixture-venue",
      payload: {
        action: "delivery",
        provider: "gojek",
        capabilityId: "capability-123",
        venueSlug: "fixture-venue",
      },
    },
  });
});

test("reconstructs only bounded menu identifiers", () => {
  assert.deepEqual(
    parseEventRequest({
      type: "menu_open",
      venueSlug: "fixture-venue",
      payload: {
        venueSlug: "fixture-venue",
        menuId: "menu-123",
        url: "https://example.com/?token=secret",
      },
    }),
    {
      ok: true,
      event: {
        type: "menu_open",
        venueSlug: "fixture-venue",
        payload: { venueSlug: "fixture-venue", menuId: "menu-123" },
      },
    }
  );

  assert.deepEqual(
    parseEventRequest({
      type: "menu_item_open",
      venueSlug: "fixture-venue",
      payload: {
        venueSlug: "fixture-venue",
        menuId: "menu-123",
        menuItemId: "item-456",
        itemName: "must not be stored",
      },
    }),
    {
      ok: true,
      event: {
        type: "menu_item_open",
        venueSlug: "fixture-venue",
        payload: { venueSlug: "fixture-venue", menuId: "menu-123", menuItemId: "item-456" },
      },
    }
  );
});

test("requires matching menu identifiers for menu interactions", () => {
  const invalid = [
    { type: "menu_open", venueSlug: "fixture-venue" },
    {
      type: "menu_open",
      venueSlug: "fixture-venue",
      payload: { venueSlug: "other-venue", menuId: "menu-123" },
    },
    {
      type: "menu_open",
      venueSlug: "fixture-venue",
      payload: { venueSlug: "fixture-venue", menuId: "menu-123", menuItemId: "item-456" },
    },
    {
      type: "menu_item_open",
      venueSlug: "fixture-venue",
      payload: { venueSlug: "fixture-venue", menuId: "menu-123" },
    },
  ];

  for (const body of invalid) assert.equal(parseEventRequest(body).ok, false);
});

test("requires action metadata and matching venue slugs for action handoffs", () => {
  assert.equal(
    parseEventRequest({ type: "action_handoff", venueSlug: "fixture-venue" }).ok,
    false
  );
  assert.equal(
    parseEventRequest({
      type: "action_handoff",
      venueSlug: "fixture-venue",
      payload: {
        action: "website",
        provider: "official",
        venueSlug: "different-venue",
      },
    }).ok,
    false
  );
});

test("requires the action to match each specific action click", () => {
  const cases = [
    ["delivery_click", "delivery", "takeaway"],
    ["takeaway_click", "takeaway", "preorder"],
    ["preorder_click", "preorder", "delivery"],
  ];

  for (const [type, matchingAction, wrongAction] of cases) {
    const valid = parseEventRequest({
      type,
      venueSlug: "fixture-venue",
      payload: {
        action: matchingAction,
        provider: "official",
        venueSlug: "fixture-venue",
      },
    });
    const invalid = parseEventRequest({
      type,
      venueSlug: "fixture-venue",
      payload: {
        action: wrongAction,
        provider: "official",
        venueSlug: "fixture-venue",
      },
    });

    assert.equal(valid.ok, true, `${type} should accept ${matchingAction}`);
    assert.equal(invalid.ok, false, `${type} should reject ${wrongAction}`);
  }
});

test("rejects malformed and oversized fields", () => {
  const invalidBodies = [
    null,
    [],
    { type: 42 },
    { type: "not_allowed" },
    { type: "menu_open", venueSlug: {} },
    { type: "menu_open", venueSlug: "Bad Slug" },
    { type: "menu_open", venueSlug: `a${"b".repeat(120)}` },
    {
      type: "action_handoff",
      venueSlug: "fixture-venue",
      payload: [],
    },
    {
      type: "action_handoff",
      venueSlug: "fixture-venue",
      payload: {
        action: "delivery",
        provider: ["gojek"],
        venueSlug: "fixture-venue",
      },
    },
    {
      type: "action_handoff",
      venueSlug: "fixture-venue",
      payload: {
        action: "delivery",
        provider: `p${"x".repeat(64)}`,
        venueSlug: "fixture-venue",
      },
    },
    {
      type: "action_handoff",
      venueSlug: "fixture-venue",
      payload: {
        action: "delivery",
        provider: "gojek",
        capabilityId: 7,
        venueSlug: "fixture-venue",
      },
    },
    {
      type: "action_handoff",
      venueSlug: "fixture-venue",
      payload: {
        action: "delivery",
        provider: "gojek",
        capabilityId: `c${"x".repeat(120)}`,
        venueSlug: "fixture-venue",
      },
    },
  ];

  for (const body of invalidBodies) {
    assert.equal(parseEventRequest(body).ok, false, JSON.stringify(body));
  }
});

test("rejects any client attempt to set acquisition source", () => {
  const payload = {
    action: "website",
    provider: "official",
    venueSlug: "fixture-venue",
  };

  assert.equal(
    parseEventRequest({
      type: "action_handoff",
      venueSlug: "fixture-venue",
      source: "villa_01",
      payload,
    }).ok,
    false
  );
  assert.equal(
    parseEventRequest({
      type: "action_handoff",
      venueSlug: "fixture-venue",
      acquisitionSource: "villa_01",
      payload,
    }).ok,
    false
  );
  assert.equal(
    parseEventRequest({
      type: "action_handoff",
      venueSlug: "fixture-venue",
      payload: { ...payload, source: "villa_01" },
    }).ok,
    false
  );
});

test("does not accept action payloads on unrelated events", () => {
  assert.equal(
    parseEventRequest({
      type: "menu_open",
      venueSlug: "fixture-venue",
      payload: {
        action: "website",
        provider: "official",
        venueSlug: "fixture-venue",
      },
    }).ok,
    false
  );
});
