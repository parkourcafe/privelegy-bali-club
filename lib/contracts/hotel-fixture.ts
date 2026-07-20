import type { MenuRecord } from "./menu-action";

// DEV-ONLY hotel layout fixture (Stage C). Lets the hotel profile variant of
// /places/[slug] be reviewed without a real hotel row in the DB. It is rendered
// ONLY under NODE_ENV==='development' && HOTEL_FIXTURE (mirroring MENU_FIXTURE);
// production never reads it, so no invented content is ever published
// (guardrail #10). A real hotel renders these sections only once verified,
// kind-tagged menus exist in the DB — a later, migration-bearing stage.
//
// Rooms / spa / day-pass are modelled as Menus (the approved entity): sections
// are room categories / treatment groups / pass tiers, priceText carries the
// rate. Nothing here is a new domain entity.

const evidence = {
  sourceUrl: "https://example-hotel.otherbali.dev/rates",
  sourceLabel: "Hotel official source (fixture)",
  capturedAt: "2026-07-20T00:00:00.000Z",
  verifiedAt: "2026-07-20T00:00:00.000Z",
};

function item(
  id: string,
  name: string,
  priceText: string,
  description: string | null,
  availabilityNote: string | null,
  position: number
) {
  return {
    id,
    name,
    description,
    priceMinor: null,
    currency: "IDR",
    priceText,
    dietaryTags: [],
    verifiedAllergenTags: [],
    partnerRecommended: false,
    editorialPick: false,
    editorialNote: null,
    availabilityNote,
    position,
  };
}

function menu(id: string, title: string, sections: MenuRecord["sections"]): MenuRecord {
  return {
    ...evidence,
    id,
    venueSlug: "fixture-hotel",
    title,
    version: 1,
    status: "published",
    completeness: "full",
    expiresAt: "2099-01-01T00:00:00.000Z",
    sections,
  };
}

export const hotelFixture: {
  rooms: MenuRecord;
  dining: MenuRecord;
  spa: MenuRecord;
  dayPass: MenuRecord;
  bookHref: string;
  dayPassHref: string;
} = {
  bookHref: "https://example-hotel.otherbali.dev/book",
  dayPassHref: "https://example-hotel.otherbali.dev/day-pass",
  rooms: menu("fixture-hotel-rooms", "Rooms & suites", [
    {
      id: "fx-rooms-garden",
      name: "Garden rooms",
      description: "Ground-floor rooms opening onto the rice-field garden.",
      position: 0,
      items: [
        item("fx-room-1", "Garden Room", "from Rp 1,250,000 / night", "28 m², king bed, garden terrace.", "2 guests", 0),
        item("fx-room-2", "Garden Suite", "from Rp 1,900,000 / night", "45 m², separate living area.", "2–3 guests", 1),
      ],
    },
    {
      id: "fx-rooms-pool",
      name: "Pool access",
      description: "Rooms with direct access to the main pool.",
      position: 1,
      items: [
        item("fx-room-3", "Pool Room", "from Rp 1,650,000 / night", "32 m², step-out to the pool deck.", "2 guests", 0),
      ],
    },
  ]),
  dining: menu("fixture-hotel-dining", "Kembang restaurant", [
    {
      id: "fx-dining-all-day",
      name: "All-day dining",
      description: "Open to non-guests · daily 7:00–22:00.",
      position: 0,
      items: [
        item("fx-dish-1", "Nasi campur", "Rp 95,000", "Rice with a rotating selection of Balinese sides.", null, 0),
        item("fx-dish-2", "Grilled snapper", "Rp 165,000", "Whole reef snapper, sambal matah.", null, 1),
      ],
    },
  ]),
  spa: menu("fixture-hotel-spa", "Spa treatments", [
    {
      id: "fx-spa-massage",
      name: "Massage",
      description: "Open to non-guests · booking recommended.",
      position: 0,
      items: [
        item("fx-spa-1", "Balinese massage", "Rp 350,000", "Traditional full-body massage.", "60 min", 0),
        item("fx-spa-2", "Aromatherapy massage", "Rp 450,000", "With essential-oil blend.", "90 min", 1),
      ],
    },
  ]),
  dayPass: menu("fixture-hotel-day-pass", "Day pass & pool access", [
    {
      id: "fx-daypass-tiers",
      name: "Passes",
      description: "For visitors — you don't have to stay here.",
      position: 0,
      items: [
        item("fx-pass-1", "Pool day pass", "Rp 150,000", "Two pools, sunbed & towel. Redeemable on food & drinks.", "Daily 9:00–18:00", 0),
        item("fx-pass-2", "Family pass", "Rp 400,000", "Two adults + two children.", "Daily 9:00–18:00", 1),
      ],
    },
  ]),
};
