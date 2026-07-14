import type { MenuRecord, VenueActionCapabilityRecord } from "./menu-action";

const evidence = {
  sourceUrl: "https://fixturevenue.com/official-menu",
  sourceLabel: "Official venue source (fixture)",
  capturedAt: "2026-07-13T00:00:00.000Z",
  verifiedAt: "2026-07-13T00:00:00.000Z",
};

export const menuActionFixtures: {
  freshMenu: MenuRecord;
  staleMenu: MenuRecord;
  capabilities: VenueActionCapabilityRecord[];
} = {
  freshMenu: {
    ...evidence,
    id: "fixture-menu-fresh",
    venueSlug: "fixture-venue",
    title: "Fixture menu",
    version: 1,
    status: "published",
    completeness: "full",
    expiresAt: "2099-01-01T00:00:00.000Z",
    sections: [
      {
        id: "fixture-section",
        name: "Breakfast",
        description: null,
        position: 0,
        items: [
          {
            id: "fixture-item",
            name: "Fixture bowl",
            description: "Development-only contract fixture",
            priceMinor: 85000,
            currency: "IDR",
            priceText: "Rp 85,000",
            dietaryTags: ["vegetarian"],
            verifiedAllergenTags: [],
            partnerRecommended: true,
            editorialPick: false,
            editorialNote: null,
            availabilityNote: null,
            position: 0,
          },
        ],
      },
    ],
  },
  staleMenu: {
    ...evidence,
    id: "fixture-menu-stale",
    venueSlug: "fixture-venue",
    title: "Expired fixture menu",
    version: 0,
    status: "published",
    completeness: "full",
    expiresAt: "2020-01-01T00:00:00.000Z",
    sections: [],
  },
  capabilities: [
    {
      ...evidence,
      id: "fixture-reserve",
      venueSlug: "fixture-venue",
      kind: "reserve",
      provider: "tablepilot",
      url: "https://tablepilot.example/book/fixture-venue",
      label: "Reserve with TablePilot",
      status: "confirmed",
      priority: 10,
      confirmationRequired: true,
      expiresAt: "2099-01-01T00:00:00.000Z",
    },
    {
      ...evidence,
      id: "fixture-maps",
      venueSlug: "fixture-venue",
      kind: "maps",
      provider: "google_maps",
      url: "https://maps.google.com/?q=Fixture+Venue",
      label: "Open in Google Maps",
      status: "confirmed",
      priority: 100,
      confirmationRequired: false,
      expiresAt: "2099-01-01T00:00:00.000Z",
    },
  ],
};
