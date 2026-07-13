/**
 * Canonical development fixtures for the Other Bali menu/action loop.
 * FROZEN alongside menu-action.ts (v1.1 addendum, 2026-07-13, Bali).
 *
 * All sessions MUST import mock data from this file during development and
 * MUST NOT invent local mock shapes. Identical fixtures across worktrees is
 * what keeps Session 2 (UX), Session 3 (actions) and Session 4 (integration)
 * compatible before Session 1's real schema and data land.
 *
 * Content below is editorial-capture style sample data for one fictional
 * Canggu venue. Prices in IDR.
 */

import type {
  PublishedMenu,
  PublicVenueActionBundle,
  PublicVenueDetailExtension,
  VenueActionCapabilityRecord,
  ResolvedVenueAction,
} from "./menu-action";

export const FIXTURE_VENUE_SLUG = "sample-warung-canggu";

export const FIXTURE_PUBLISHED_MENU: PublishedMenu = {
  id: "menu_fixture_001",
  venueSlug: FIXTURE_VENUE_SLUG,
  version: 1,
  name: "All-Day Menu",
  currency: "IDR",
  sourceType: "editorial_capture",
  sourceUrl: "https://example.com/menu",
  status: "published",
  verifiedAt: "2026-07-13T00:00:00Z",
  sections: [
    {
      id: "sec_breakfast",
      name: "Breakfast",
      description: "Served until 12:00",
      sortOrder: 1,
      items: [
        {
          id: "item_smoothie_bowl",
          slug: "dragonfruit-smoothie-bowl",
          name: "Dragonfruit Smoothie Bowl",
          description: "Granola, banana, coconut flakes",
          priceAmount: 65000,
          priceText: "65K",
          dietaryTags: ["vegan"],
          allergenTags: ["nuts"],
          isAvailable: true,
          partnerRecommended: true,
          editorialPick: true,
          editorialNote: "The dish this venue is known for.",
          sortOrder: 1,
        },
        {
          id: "item_nasi_goreng",
          slug: "nasi-goreng-kampung",
          name: "Nasi Goreng Kampung",
          priceAmount: 55000,
          priceText: "55K",
          dietaryTags: [],
          allergenTags: ["egg"],
          isAvailable: true,
          partnerRecommended: false,
          editorialPick: false,
          sortOrder: 2,
        },
      ],
    },
    {
      id: "sec_drinks",
      name: "Coffee & Drinks",
      sortOrder: 2,
      items: [
        {
          id: "item_es_kopi",
          slug: "es-kopi-susu",
          name: "Es Kopi Susu",
          priceAmount: 35000,
          priceText: "35K",
          dietaryTags: [],
          allergenTags: ["dairy"],
          isAvailable: true,
          partnerRecommended: false,
          editorialPick: false,
          sortOrder: 1,
        },
      ],
    },
  ],
};

const reserveAction: ResolvedVenueAction = {
  id: "act_reserve_wa",
  type: "reserve",
  provider: "whatsapp",
  label: "Reserve via WhatsApp",
  href: "https://wa.me/6281200000000?text=Hi%2C%20table%20for%20two",
  external: true,
  confirmationRequired: true,
  availabilityText: "Replies 09:00-21:00",
  verifiedAt: "2026-07-13T00:00:00Z",
};

const deliveryAction: ResolvedVenueAction = {
  id: "act_delivery_gofood",
  type: "delivery",
  provider: "gofood",
  label: "Order on GoFood",
  href: "https://gofood.co.id/en/bali/restaurant/sample-warung",
  external: true,
  confirmationRequired: false,
  serviceAreaText: "Canggu / Berawa",
  minimumOrderText: "No minimum",
  feeText: "Delivery fee set by GoFood",
  verifiedAt: "2026-07-13T00:00:00Z",
};

const directionsAction: ResolvedVenueAction = {
  id: "act_directions_gmaps",
  type: "directions",
  provider: "google_maps",
  label: "Directions",
  href: "https://maps.google.com/?q=Sample+Warung+Canggu",
  external: true,
  confirmationRequired: false,
};

export const FIXTURE_ACTION_BUNDLE: PublicVenueActionBundle = {
  primary: {
    reserve: reserveAction,
    delivery: deliveryAction,
    directions: directionsAction,
  },
  alternatives: {
    delivery: [
      {
        id: "act_delivery_grab",
        type: "delivery",
        provider: "grabfood",
        label: "Order on GrabFood",
        href: "https://food.grab.com/id/en/restaurant/sample-warung",
        external: true,
        confirmationRequired: false,
      },
    ],
  },
};

export const FIXTURE_ACTION_RECORDS: VenueActionCapabilityRecord[] = [
  {
    id: "cap_reserve_wa",
    venueSlug: FIXTURE_VENUE_SLUG,
    actionType: "reserve",
    provider: "whatsapp",
    label: "Reserve via WhatsApp",
    handoffUrl: "https://wa.me/6281200000000",
    status: "published",
    priority: 1,
    sourceType: "editorial_capture",
    sourceUrl: "https://example.com",
    verifiedAt: "2026-07-13T00:00:00Z",
    confirmationRequired: true,
    metadata: {},
  },
  {
    id: "cap_delivery_gofood",
    venueSlug: FIXTURE_VENUE_SLUG,
    actionType: "delivery",
    provider: "gofood",
    handoffUrl: "https://gofood.co.id/en/bali/restaurant/sample-warung",
    status: "published",
    priority: 1,
    sourceType: "official_url",
    verifiedAt: "2026-07-13T00:00:00Z",
    confirmationRequired: false,
    serviceAreaText: "Canggu / Berawa",
    metadata: {},
  },
];

export const FIXTURE_VENUE_DETAIL_EXTENSION: PublicVenueDetailExtension = {
  menu: FIXTURE_PUBLISHED_MENU,
  actions: FIXTURE_ACTION_BUNDLE,
  verification: {
    menuVerifiedAt: "2026-07-13T00:00:00Z",
    actionsVerifiedAt: "2026-07-13T00:00:00Z",
  },
};
