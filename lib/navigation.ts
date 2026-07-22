// Single source of truth for the public navigation taxonomy (IA spec v1,
// 2026-07-20, §5): six category groups + Search/Saved actions, shared by the
// desktop header, the mobile Explore sheet and the homepage CategoryGateway so
// the homepage and inner pages can never drift apart again.
//
// Rules encoded here:
//  - every href must resolve to an existing static route (enforced by
//    lib/navigation.test.ts — the "no dead links" gate from spec §19.2);
//  - only live surfaces are listed: spec items whose hub does not exist yet
//    (Hotel Restaurants, Pool Day-Use, Beaches, Gyms, Recovery, Excursions…)
//    are deliberately ABSENT until their Phase 3/4 pages pass the publication
//    gate — an empty hub must never be reachable from the menu (spec §10.2);
//  - existing URLs are kept verbatim (spec §5.3: rename UX labels, not routes).

export interface NavLink {
  href: string;
  label: string;
  blurb?: string;
}

export interface NavGroup {
  key: string;
  label: string;
  links: NavLink[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    key: "eat-drink",
    label: "Eat & Drink",
    links: [
      { href: "/best-restaurants-in-bali", label: "Restaurants" },
      { href: "/best-warungs-in-bali", label: "Warungs & Local Food" },
      { href: "/best-cafes-in-bali", label: "Cafés & Breakfast" },
      { href: "/bali-hotel-brunches", label: "Brunches & Buffets" },
      { href: "/best-coffee-in-bali", label: "Specialty Coffee" },
      { href: "/where-to-watch-sunset-in-bali", label: "Bars & Sunset Drinks" },
    ],
  },
  {
    key: "beach-pool",
    label: "Beach & Pool",
    links: [
      { href: "/best-beach-clubs-in-bali", label: "Beach Clubs" },
      { href: "/bali-resort-day-passes", label: "Hotel Day Passes" },
      { href: "/bali-free-beach-clubs", label: "Free Beach Clubs" },
      { href: "/bali-sunset-clubs", label: "Sunset Clubs" },
    ],
  },
  {
    key: "wellness",
    label: "Wellness",
    links: [
      { href: "/best-spas-in-bali", label: "Spas & Massage" },
      { href: "/ubud/best-yoga-wellness", label: "Yoga & Wellness (Ubud)" },
    ],
  },
  {
    key: "things-to-do",
    label: "Things to Do",
    links: [
      { href: "/things-to-do-in-bali", label: "Best Things to Do" },
      { href: "/nusa-penida-day-trip", label: "Nusa Penida Day Trip" },
      { href: "/ubud/things-to-do", label: "Things to Do in Ubud" },
      { href: "/sanur/things-to-do", label: "Things to Do in Sanur" },
      { href: "/jimbaran/things-to-do", label: "Things to Do in Jimbaran" },
      { href: "/nusa-dua/things-to-do", label: "Things to Do in Nusa Dua" },
    ],
  },
  {
    key: "areas",
    label: "Areas",
    links: [
      { href: "/canggu", label: "Canggu" },
      { href: "/seminyak", label: "Seminyak" },
      { href: "/uluwatu", label: "Uluwatu & the Bukit" },
      { href: "/jimbaran", label: "Jimbaran" },
      { href: "/nusa-dua", label: "Nusa Dua" },
      { href: "/sanur", label: "Sanur" },
      { href: "/ubud", label: "Ubud" },
      { href: "/nusa-penida", label: "Nusa Penida" },
      { href: "/amed", label: "Amed & the East" },
      { href: "/sidemen", label: "Sidemen" },
      { href: "/munduk", label: "Munduk & Highlands" },
      { href: "/lovina", label: "Lovina & the North" },
      { href: "/bali", label: "All areas" },
    ],
  },
  {
    key: "plan",
    label: "Plan Bali",
    links: [
      { href: "/bali-travel-guide", label: "Bali Travel Guide" },
      { href: "/first-time-in-bali", label: "First Time in Bali" },
      { href: "/bali-itinerary-7-days", label: "Itineraries" },
      { href: "/where-to-stay-in-bali", label: "Where to Stay" },
      { href: "/how-many-days-in-bali", label: "How Many Days" },
      { href: "/best-time-to-visit-bali", label: "Weather & Seasons" },
      { href: "/how-to-get-around-bali", label: "Transport & Getting Around" },
      { href: "/bali-on-a-budget", label: "Budget & Money" },
      { href: "/is-bali-safe", label: "Safety & Essentials" },
      { href: "/bali-with-kids", label: "Bali with Kids" },
      { href: "/guides", label: "All guides" },
    ],
  },
];

// Persistent single-tap actions (spec §5.1.7-8, §5.3): Search lives on the
// Explore catalogue; Saved is the /me surface relabelled.
export const NAV_ACTIONS: NavLink[] = [
  { href: "/places", label: "Explore" },
  { href: "/plan", label: "Plan" },
  { href: "/me", label: "Saved" },
];

// Homepage CategoryGateway (spec §6): the four primary category cards plus the
// two second-row entries. Cards reference the same registry links.
export const GATEWAY_PRIMARY: { group: string; href: string; label: string; blurb: string; art: string }[] = [
  { group: "eat-drink", href: "/best-restaurants-in-bali", label: "Eat & Drink", blurb: "Restaurants, warungs, cafés, brunches", art: "/covers/restaurant.webp" },
  { group: "beach-pool", href: "/best-beach-clubs-in-bali", label: "Beach & Pool", blurb: "Beach clubs, day passes, sunset", art: "/covers/beach_club.webp" },
  { group: "wellness", href: "/best-spas-in-bali", label: "Wellness", blurb: "Spas, massage, yoga", art: "/covers/spa.webp" },
  { group: "things-to-do", href: "/things-to-do-in-bali", label: "Things to Do", blurb: "Icons, day trips, area days", art: "/covers/surf.webp" },
];

export const GATEWAY_SECONDARY: NavLink[] = [
  { href: "/bali", label: "Explore by area", blurb: "Canggu to Nusa Penida — pick your base" },
  { href: "/guides", label: "Plan Bali", blurb: "When to go, where to stay, itineraries" },
];
