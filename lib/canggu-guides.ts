// Canggu SEO child guides (master §6a.3, launch brief §13) — editorial "best of"
// (guardrail #6), organised by DECISION using each venue's own real data
// (category / jobs / tags). Nothing invented (§4). Active_deep: cards keep the
// money loop via PlaceCard.

import type { VenueWithPerk } from "@/lib/data";
import { venueHasJob, hasTag } from "@/lib/canggu";

export type GuideGroup = {
  key: string;
  heading: string;
  note: string;
  match: (v: VenueWithPerk) => boolean;
};

export type CangguGuide = {
  slug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  lede: string;
  base: (v: VenueWithPerk) => boolean;
  groups: GuideGroup[];
  faq: { q: string; a: string }[];
};

export const CANGGU_GUIDES: CangguGuide[] = [
  {
    slug: "best-brunch",
    h1: "Best brunch in Canggu",
    metaTitle: "Best brunch in Canggu — cafés, all-day spots and beachfront",
    metaDescription:
      "The best brunch in Canggu, sorted by the morning you want: café brunch and specialty coffee, all-day and weekend spreads, or a table by the beach.",
    lede: "Brunch is Canggu's best meal. These are the spots we rate, sorted by the morning you're after — a laptop-and-coffee café, a proper weekend spread, or toes-near-sand by the beach.",
    base: (v) => venueHasJob(v, ["brunch-after-surf"]),
    groups: [
      { key: "cafe", heading: "Café brunch & specialty coffee", note: "Bowls, eggs, good coffee — and a seat that lasts.", match: (v) => v.category === "cafe" },
      { key: "allday", heading: "All-day & weekend brunch", note: "Bigger menus and a proper sit-down spread.", match: (v) => v.category === "restaurant" },
      { key: "beach", heading: "Beachfront brunch", note: "Brunch with sand and surf out front.", match: (v) => v.category === "beach_club" },
    ],
    faq: [
      { q: "Where is the best brunch in Canggu?", a: "Canggu's brunch clusters around Batu Bolong, Berawa and Pererenan — café-and-coffee spots for a laptop morning, all-day restaurants for a bigger weekend spread, and a few beachfront clubs. The picks above are sorted by which you want." },
      { q: "Do I need to book brunch in Canggu?", a: "The popular weekend spots fill up, so a reservation helps on Saturday and Sunday mornings. Cafés and quieter places are usually walk-in." },
      { q: "What time is brunch in Canggu?", a: "Most cafés open early (around 7–8am) and serve brunch all morning into the afternoon; many run all-day menus, so a late brunch is easy." },
    ],
  },
  {
    slug: "best-restaurants",
    h1: "Best restaurants in Canggu",
    metaTitle: "Best restaurants in Canggu — sorted by the dinner you're planning",
    metaDescription:
      "The best restaurants in Canggu, organised by decision: date night, group dinners, family tables and special occasions. Resident-curated, book a table in a tap.",
    lede: "Canggu's dinner scene is deep and uneven. These are the tables we rate, sorted by the dinner you're actually planning.",
    base: (v) => v.category === "restaurant",
    groups: [
      { key: "date", heading: "Date night", note: "Two people, a table worth dressing for.", match: (v) => venueHasJob(v, ["date-night-special"]) },
      { key: "groups", heading: "Groups & sharing", note: "Menus and room for a full table.", match: (v) => venueHasJob(v, ["group-dinner-share"]) },
      { key: "family", heading: "Family dinners", note: "Early, easy, comfortable with kids.", match: (v) => venueHasJob(v, ["family-early-dinner", "family"]) },
      { key: "occasion", heading: "Special occasion", note: "When the dinner is the event. Book ahead.", match: (v) => venueHasJob(v, ["special-occasion"]) },
    ],
    faq: [
      { q: "Do Canggu restaurants take reservations?", a: "The popular dinner rooms do, and weekends book out — reserve a table in a tap where you see the Reserve button. Casual and warung spots are walk-in." },
      { q: "Where's good for a group dinner in Canggu?", a: "Look under Groups & sharing — rooms with the space and sharing menus that actually work for a full table." },
    ],
  },
  {
    slug: "work-friendly-cafes",
    h1: "Work-friendly cafés in Canggu",
    metaTitle: "Work-friendly cafés in Canggu — wifi, sockets, a seat that lasts",
    metaDescription:
      "Where to actually work in Canggu: cafés with wifi, sockets, AC and a seat you can hold — plus the calm morning spots before the brunch rush. Resident-curated.",
    lede: "Canggu runs on laptops. These are the cafés that hold up for a work morning — not every pretty brunch spot does.",
    // §13: a café alone isn't a work café — require the verified work/morning job.
    base: (v) => v.category === "cafe" || venueHasJob(v, ["quiet-work-cafe", "brunch-after-surf"]),
    groups: [
      { key: "work", heading: "Laptop-friendly", note: "Wifi, sockets and a seat you can hold.", match: (v) => venueHasJob(v, ["quiet-work-cafe"]) || hasTag(v, "fast wifi", "practical") || hasTag(v, "sockets", "practical") },
      { key: "coffee", heading: "Coffee & a slow start", note: "Serious coffee, calmer mornings.", match: (v) => venueHasJob(v, ["brunch-after-surf"]) || v.category === "cafe" },
    ],
    faq: [
      { q: "Which Canggu cafés are best for working?", a: "We tag the ones with the wifi, sockets and seating to actually work — a packed brunch café at 10am usually isn't one of them." },
    ],
  },
  {
    slug: "best-spas",
    h1: "Best spas & wellness in Canggu",
    metaTitle: "Best spas in Canggu — massage, reset and recovery",
    metaDescription:
      "Where to reset in Canggu: massage, spa and recovery spots worth booking. Resident-curated, honest about what each is best for.",
    lede: "After the surf and the scooters, Canggu is built for a reset. These are the spa and wellness spots we send people to.",
    base: (v) => v.category === "spa",
    groups: [
      { key: "reset", heading: "Massage & reset", note: "A proper wind-down after beach and board.", match: () => true },
    ],
    faq: [
      { q: "Should I book a spa in Canggu ahead?", a: "For evenings and weekends, yes — the good rooms fill. Book where you can, and walk in earlier in the day." },
    ],
  },
  {
    slug: "beach-clubs-sunset",
    h1: "Canggu beach clubs & sunset spots",
    metaTitle: "Canggu beach clubs & sunset — where to be for golden hour",
    metaDescription:
      "Canggu beach clubs and sunset spots compared: pool-and-day-club energy vs a quiet sunset drink, and whether you should reserve. Resident-curated.",
    lede: "Canggu's sunset stretch runs from big day clubs to quiet beach bars. Here's where to be, by the evening you want.",
    base: (v) => v.category === "beach_club" || v.category === "bar" || venueHasJob(v, ["sunset-drinks-view"]),
    groups: [
      { key: "sunset", heading: "Sunset drinks & views", note: "Be there before golden hour.", match: (v) => venueHasJob(v, ["sunset-drinks-view"]) || hasTag(v, "view", "vibe") },
      { key: "lively", heading: "Day clubs & lively", note: "Pool, music, a bigger night.", match: (v) => hasTag(v, "lively", "vibe") || v.category === "beach_club" },
    ],
    faq: [
      { q: "Do Canggu beach clubs need a booking?", a: "Daybeds and weekend sunsets, usually yes — reserve where you can. Beach bars are mostly walk-in." },
    ],
  },
];

export function getCangguGuide(slug: string | null | undefined): CangguGuide | null {
  if (!slug) return null;
  return CANGGU_GUIDES.find((g) => g.slug === slug) ?? null;
}
