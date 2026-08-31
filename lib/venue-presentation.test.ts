import assert from "node:assert/strict";
import test from "node:test";

import {
  publishableStreetAddress,
  resolveVenueSchemaType,
  venueCategoryLabel,
  venueCoverAssetCategory,
  venueSchemaType,
} from "./venue-presentation";

test("resolves accommodation from the venue name before the editorial category", () => {
  const cases = [
    ["Ecosfera Hotel", "", "spa", "Hotel"],
    ["Hotel Uyah Amed Spa Resort", "", "spa", "Hotel"],
    ["Bali Dream Villa Resort", "", "beauty", "Resort"],
    ["Secret Garden", "A boutique villa in Canggu", "spa", "LodgingBusiness"],
    ["Beach Club Resort", "", "beach_club", "Resort"],
  ] as const;

  for (const [name, description, category, schemaType] of cases) {
    assert.equal(resolveVenueSchemaType({ name, description, category }), schemaType);
  }
});

test("keeps a hosted sub-venue distinct from the hotel or resort named around it", () => {
  const cases = [
    [
      "Sunset Beach Bar and Grill",
      "The open-air beach bar of the InterContinental Bali Resort",
      "bar",
      "BarOrPub",
    ],
    [
      "Warnakali Restaurant at Adiwana Warnakali Resort",
      "Restaurant in Nusa Islands",
      "restaurant",
      "Restaurant",
    ],
    ["DaLa Spa at Alaya Resort Ubud", "Beauty services and massage", "spa", "DaySpa"],
  ] as const;

  for (const [name, description, category, schemaType] of cases) {
    assert.equal(resolveVenueSchemaType({ name, description, category }), schemaType);
  }
});

test("does not invent lodging when the venue identity contains only spa evidence", () => {
  assert.equal(
    resolveVenueSchemaType({
      name: "Blue Karma Village",
      description:
        "Wellness spa in Canggu. The published treatment list includes Balinese Massage, Yoga and Pilates.",
      category: "spa",
    }),
    "DaySpa",
  );
});

test("resolves nightlife, wellness, salon, and attraction keywords before category fallback", () => {
  const cases = [
    ["Sunday Beach Club", "", "restaurant", "NightClub"],
    ["The Rooftop Bar", "Cocktails at sunset", "restaurant", "BarOrPub"],
    ["Blue Earth Village", "Massage and spa treatments", "spa", "DaySpa"],
    ["Studio S Salon", "Hair and manicure studio", "spa", "BeautySalon"],
    ["Tegenungan Waterfall", "A popular natural attraction", "restaurant", "TouristAttraction"],
  ] as const;

  for (const [name, description, category, schemaType] of cases) {
    assert.equal(resolveVenueSchemaType({ name, description, category }), schemaType);
  }
});

test("uses the defining bar description before an ambiguous club name", () => {
  assert.equal(
    resolveVenueSchemaType({
      name: "Pavilion Surf Club",
      description: "Bar in Legian. Cold beer for the game and cocktails at sunset.",
      category: "bar",
    }),
    "BarOrPub",
  );
});

test("falls back to the established editorial category mapping", () => {
  const cases = [
    ["Crate", "All-day breakfast", "cafe", "CafeOrCoffeeShop"],
    ["Locavore", "Seasonal tasting menu", "restaurant", "Restaurant"],
    ["Radiantly Alive", "Movement classes", "yoga", "SportsActivityLocation"],
    ["Unknown Place", "No matching description", "unknown", "LocalBusiness"],
  ] as const;

  for (const [name, description, category, schemaType] of cases) {
    assert.equal(resolveVenueSchemaType({ name, description, category }), schemaType);
  }
});

test("presents villa venues with lodging metadata and the existing hotel cover", () => {
  assert.equal(venueCategoryLabel("villa"), "Villa");
  assert.equal(venueSchemaType("villa"), "LodgingBusiness");

  const coverAssetCategory = venueCoverAssetCategory("villa");

  assert.equal(coverAssetCategory, "hotel");
  assert.equal(`/covers/${coverAssetCategory}.webp`, "/covers/hotel.webp");
  assert.notEqual(`/covers/${coverAssetCategory}.webp`, "/covers/villa.webp");
});

test("preserves established labels and schema types for existing categories", () => {
  const cases = [
    ["restaurant", "Restaurant", "Restaurant"],
    ["cafe", "Café", "CafeOrCoffeeShop"],
    ["bar", "Bar", "BarOrPub"],
    ["spa", "Wellness", "HealthAndBeautyBusiness"],
    ["hotel", "Hotel", "Hotel"],
    ["resort", "Resort", "Resort"],
    ["attraction", "Attraction", "TouristAttraction"],
  ] as const;

  for (const [category, label, schemaType] of cases) {
    assert.equal(venueCategoryLabel(category), label);
    assert.equal(venueSchemaType(category), schemaType);
    assert.equal(venueCoverAssetCategory(category), category);
  }
});

test("publishableStreetAddress accepts a real address", () => {
  assert.equal(
    publishableStreetAddress("Jl. Pantai Batu Bolong No.10, Canggu"),
    "Jl. Pantai Batu Bolong No.10, Canggu",
  );
  assert.equal(
    publishableStreetAddress("Jalan Labuan Sait, Pecatu, Kuta Selatan, Badung, Bali 80361"),
    "Jalan Labuan Sait, Pecatu, Kuta Selatan, Badung, Bali 80361",
  );
  assert.equal(
    publishableStreetAddress("Br. Nagi, Jl. Lanyahan, Petulu, Ubud, Gianyar, Bali 80571"),
    "Br. Nagi, Jl. Lanyahan, Petulu, Ubud, Gianyar, Bali 80571",
  );
});

test("publishableStreetAddress rejects an area note", () => {
  // These are the values venues.full_address actually holds for most rows.
  assert.equal(publishableStreetAddress("Canggu/Batu Bolong/Berawa"), undefined);
  assert.equal(publishableStreetAddress("Pecatu / uluwatu bukit"), undefined);
  assert.equal(publishableStreetAddress("Ubud"), undefined);
  assert.equal(publishableStreetAddress("Tibubeneng / Canggu / Berawa near Finns"), undefined);
});

test("publishableStreetAddress rejects an operator's working note", () => {
  // Publishing these as a postal address states something false, and an empty
  // field would at least be visible.
  assert.equal(publishableStreetAddress("Berawa boundary / verify pin"), undefined);
  assert.equal(publishableStreetAddress("Canggu shortcut / verify branch"), undefined);
  assert.equal(publishableStreetAddress("Jl. Raya Ubud — verify"), undefined);
});

test("publishableStreetAddress ignores non-strings and blanks", () => {
  assert.equal(publishableStreetAddress(null), undefined);
  assert.equal(publishableStreetAddress(undefined), undefined);
  assert.equal(publishableStreetAddress(""), undefined);
  assert.equal(publishableStreetAddress("   "), undefined);
});
