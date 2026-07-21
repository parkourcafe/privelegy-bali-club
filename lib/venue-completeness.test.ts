import assert from "node:assert/strict";
import test from "node:test";
import {
  hasWhatToOrderEvidence,
  publicVenueVerifiedAt,
  publicWhatToOrderItems,
} from "./venue-completeness";

test("what_to_order requires current structured menu or a public evidence URL", () => {
  assert.equal(hasWhatToOrderEvidence({ hasCurrentStructuredMenu: true }), true);
  assert.equal(
    hasWhatToOrderEvidence({ officialMenuUrl: "https://venue.example.org/menu" }),
    true,
  );
  assert.equal(hasWhatToOrderEvidence({ officialMenuUrl: "javascript:alert(1)" }), false);
  assert.equal(hasWhatToOrderEvidence({ officialMenuUrl: "https://example.com/menu" }), false);
  assert.equal(hasWhatToOrderEvidence({}), false);
});

test("what_to_order is normalized only after its evidence gate passes", () => {
  assert.deepEqual(
    publicWhatToOrderItems({
      whatToOrder: "Nasi campur; Tempeh; Nasi campur; ",
      hasCurrentStructuredMenu: true,
    }),
    ["Nasi campur", "Tempeh"],
  );
  assert.deepEqual(
    publicWhatToOrderItems({
      whatToOrder: [" Pizza ", "", "Pizza", "Tacos"],
      officialMenuUrl: "https://restaurant.example.org/menu",
    }),
    ["Pizza", "Tacos"],
  );
  assert.deepEqual(
    publicWhatToOrderItems({
      whatToOrder: "Dish one; Dish two",
      venueVerifiedAt: "2026-07-20",
    }),
    [],
    "a generic venue verification date is not menu evidence",
  );
});

test("verification date falls back to the canonical venue row", () => {
  assert.equal(
    publicVenueVerifiedAt({
      contentVerifiedAt: " 2026-07-21 ",
      venueVerifiedAt: "2026-07-20",
    }),
    "2026-07-21",
  );
  assert.equal(
    publicVenueVerifiedAt({ contentVerifiedAt: " ", venueVerifiedAt: "2026-07-20" }),
    "2026-07-20",
  );
  assert.equal(
    publicVenueVerifiedAt({ contentVerifiedAt: "not-a-date", venueVerifiedAt: "2026-07-20" }),
    "2026-07-20",
  );
  assert.equal(publicVenueVerifiedAt({ venueVerifiedAt: "not-a-date" }), null);
  assert.equal(publicVenueVerifiedAt({}), null);
});
