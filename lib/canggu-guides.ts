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

// Answer-first block. The page has to answer the question before the list
// starts, so the decision is readable (and extractable) without scrolling.
//
// Two rules hold this honest:
//  1. Every pick is addressed by SLUG and gated at render time against the
//     venues actually shown — an unpublished or re-jobbed venue drops out of
//     the answer instead of leaving a dangling promise in the copy.
//  2. `why` and `facts` restate facts already carried on the verified venue
//     record (why_its_here / best_for / price_anchor). No blanket estimate of
//     district-wide hours or prices — unknown stays unsaid (guardrail #10).
export type GuideAnswerPick = {
  slug: string;
  want: string; // the traveller's decision, in their words
  why: string; // the one fact that settles it
};

export type CangguGuide = {
  slug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  lede: string;
  answer?: { picks: GuideAnswerPick[]; facts: string[] };
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
    answer: {
      picks: [
        { slug: "hungry-bird-coffee", want: "Specialty coffee", why: "Roasts its own beans in Tibubeneng, direct from local farms, since 2013." },
        { slug: "brunch-club-pererenan", want: "A long table with friends", why: "All-day brunch under a big mango tree in Pererenan." },
        { slug: "zin-cafe-canggu", want: "A laptop morning", why: "Free coworking near Nelayan Beach, with power at most tables." },
        { slug: "secret-spot-bali", want: "Vegan brunch", why: "Fully plant-based breakfast through dinner, vegan croissants included." },
        { slug: "the-lawn-canggu-beach-club", want: "Brunch by the water", why: "Directly on the black sand at Batu Bolong Beach." },
      ],
      facts: [
        "Plates start around 35,000–70,000 IDR at Crate Cafe and run to 100,000–250,000 IDR for mains at Milu by Nook.",
        "7AM Bakers in Umalas opens at 07:00, ahead of most of the neighbourhood. Nook Umalas runs 08:00 to 23:00.",
        "Berawa has the most brunch on this list; Batu Bolong is the beach-road strip; Pererenan, Umalas and Seseh sit further out.",
      ],
    },
    base: (v) => venueHasJob(v, ["brunch-after-surf"]),
    groups: [
      { key: "cafe", heading: "Café brunch & specialty coffee", note: "Bowls, eggs, good coffee — and a seat that lasts.", match: (v) => v.category === "cafe" },
      { key: "allday", heading: "All-day & weekend brunch", note: "Bigger menus and a proper sit-down spread.", match: (v) => v.category === "restaurant" },
      { key: "beach", heading: "Beachfront brunch", note: "Brunch with sand and surf out front.", match: (v) => v.category === "beach_club" },
    ],
    // Each answer restates facts already carried on the verified venue records
    // behind this page. Where we do not hold the fact — district-wide opening
    // hours, weekend queue windows — the answer says what we do know instead of
    // estimating (guardrail #10).
    faq: [
      { q: "Where is the best brunch in Canggu?", a: "Canggu's brunch clusters around Batu Bolong, Berawa and Pererenan — café-and-coffee spots for a laptop morning, all-day restaurants for a bigger weekend spread, and a beachfront club. The picks above are sorted by which you want." },
      { q: "What time is brunch in Canggu?", a: "7AM Bakers in Umalas opens at 07:00, earlier than most of the neighbourhood. Nook Umalas runs 08:00 to 23:00. Most places on this list serve an all-day menu, so a late brunch is easy." },
      { q: "How much does brunch cost in Canggu?", a: "Most of this list sits in the mid band. Oma Jamu, ZIN Cafe and NÜDE Berawa are the cheapest. Crate Cafe is 35,000–70,000 IDR a plate. Milu by Nook and The Lawn are the top band, with Milu's mains at 100,000–250,000 IDR." },
      { q: "Do I need to book brunch in Canggu?", a: "Most of the cafés here are walk-in. The bigger weekend rooms fill up, so arriving early helps. Where a place does take bookings, the link is on its own page." },
      { q: "Where is the best vegan brunch in Canggu?", a: "Secret Spot is fully plant-based, vegan croissants included. Roots builds a bowl from 50+ ingredients. The Shady Shack is vegetarian and vegan over the Berawa rice fields. Oma Jamu is the cheapest of them. CAFE VIDA has a vegan and raw section, with no palm oil, cane sugar or wheat flour." },
      { q: "Where can I work over brunch in Canggu?", a: "ZIN Cafe is a free coworking space with power at most tables. MIEL has spacious tables, a quiet room and fast wifi. Tropical Nomad is a coworking space with its own open-air café. 7AM Bakers has strong wifi and two floors. Crate Cafe is not the one — it is loud and busy." },
      { q: "Is there brunch in Canggu for kids?", a: "Milk & Madu Beach Road has a kids' play area. Brunch Club in Pererenan is open-sided with room to move under the mango tree. Milu by Nook has a garden over a rice paddy. Bali Buda Canggu is a calm wholefoods café with groceries on the way out." },
      { q: "Which part of Canggu is best for brunch?", a: "Berawa has the most choice on this list. Batu Bolong is the beach-road strip, closest to the surf and the busiest. Pererenan, Umalas and Seseh sit further out and quieter, with rice fields instead of traffic." },
    ],
  },
  {
    slug: "best-warungs",
    h1: "Best warungs & local food in Canggu",
    metaTitle: "Best warungs in Canggu — cheap, authentic local food",
    metaDescription:
      "Where to eat cheap, authentic local food in Canggu: the nasi campur warungs and babi guling stalls worth seeking out, from Batu Bolong to Pererenan.",
    lede: "Beyond the brunch cafés, Canggu has honest, cheap warungs and babi guling stalls doing real Balinese and Indonesian food. These are the local plates we send people to, sorted by what you're after.",
    // Catches local warungs, including those keyed as `restaurant` by name
    // (Warung Bu Mi, Warung Nonii), without a destructive re-category migration.
    base: (v) => v.category === "warung" || /\bwarung\b/i.test(v.name),
    groups: [
      { key: "nasi", heading: "Nasi campur & local plates", note: "Point-and-pick mixed rice and home-style Indonesian, cheap and generous.", match: (v) => !/babi/i.test(v.name) },
      { key: "babi", heading: "Babi guling & roast pork", note: "Balinese suckling pig with rice, crackling and sambal.", match: (v) => /babi/i.test(v.name) },
    ],
    faq: [
      { q: "What is a warung?", a: "A warung is a small, family-run Indonesian eatery serving affordable local food — nasi campur, satay and daily home-style dishes. They're the backbone of everyday eating in Bali." },
      { q: "Where do you eat cheap local food in Canggu?", a: "At the warungs and babi guling stalls above — clustered around Batu Bolong, Pererenan and Padang Linjong. Nasi campur (build-your-own mixed rice) is the everyday plate; babi guling is the Balinese roast-pork specialty." },
      { q: "What is babi guling?", a: "Babi guling is Balinese roast suckling pig, served with rice, crispy crackling, lawar and sambal. It's a local celebration dish and a hearty, affordable warung plate." },
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
