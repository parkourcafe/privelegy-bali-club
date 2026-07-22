// Taste Collections — cross-island, cuisine-led shortlists (design brief
// "Taste Collections", 2026-07-14). A third browse axis next to By area
// (districts) and the moment-based day builder: "I want Japanese / seafood /
// brunch", island-wide.
//
// v1 needs no migration. A collection's members are selected from ALREADY
// verified editorial fields (name / what_to_order / why_its_here / best_for /
// vibe tags / category) — never from ratings, review counts or any of the
// consensus-research layer, which is internal and never surfaced (guardrails:
// no stars, no "top rated", no negativity, English-only public UI).
//
// Publication gate (brand rule — no thin pages): a collection is only live when
// it has >= MIN_VENUES decision-ready places across >= MIN_DISTRICTS districts.
// Below that it is neither linked, sitemapped nor served (returns 404). As
// editorial coverage grows, a held collection auto-publishes — nothing to flip.

import type { VenueWithPerk } from "@/lib/data";
import { getPublishedVenues } from "@/lib/data";
import { isVenueIndexable } from "@/lib/publication";
import { normalizeJobs } from "@/lib/intents";
import type { PlaceCardData } from "@/components/PlaceCard";

export const MIN_VENUES = 10;
export const MIN_DISTRICTS = 3;

// Shared curation line — our no-ratings honesty as a feature. Identical across
// every collection, and limited to rules enforced by the current catalogue.
export const CURATION_NOTE =
  "No ratings, no paid placements — every linked place must pass the publication gate before it appears.";

// The district order collections render in; empty districts are dropped. Same
// spine as the best-of guides so the taste pages read as sister pages.
export const COLLECTION_AREA_ORDER: { key: string; name: string; pillar?: string }[] = [
  { key: "canggu", name: "Canggu", pillar: "/canggu" },
  { key: "ubud", name: "Ubud", pillar: "/ubud" },
  { key: "uluwatu-bukit", name: "Uluwatu & the Bukit", pillar: "/uluwatu" },
  { key: "seminyak", name: "Seminyak", pillar: "/seminyak" },
  { key: "sanur", name: "Sanur", pillar: "/sanur" },
  { key: "jimbaran", name: "Jimbaran", pillar: "/jimbaran" },
  { key: "nusa-dua", name: "Nusa Dua", pillar: "/nusa-dua" },
];

export type CollectionKind = "taste" | "moment";

export interface Collection {
  slug: string; // route: /collections/{slug}
  kind: CollectionKind; // grouping on the hub: By taste vs By moment
  taste: string; // short chip label
  title: string; // H1 (brief-approved copy)
  metaTitle: string;
  metaDescription: string;
  intro: string;
  faq: { q: string; a: string }[];
  related: string[]; // other collection slugs
  // Optional district allow-list. Used for the geo-bound moments (sunset is a
  // west-coast fact — Sanur is sunrise and must never appear here).
  districts?: string[];
  // Membership signal. Taste collections read factual cuisine fields; moment
  // collections read the tagged `jobs` (and price for the budget cuts). Kept
  // deliberately narrow — "where this is the point", not "anything adjacent".
  match: (blob: string, v: VenueWithPerk) => boolean;
}

// Helpers for moment matchers.
const hasJob = (v: VenueWithPerk, job: string) => normalizeJobs(v.jobs).includes(job);
const priceStr = (v: VenueWithPerk) => (v.priceAnchor ?? "").trim();
const isCheap = (v: VenueWithPerk) => /^\$(?!\$)/.test(priceStr(v)); // exactly one leading $
const isSplurge = (v: VenueWithPerk) => /\$\$\$\$/.test(priceStr(v)); // four $ anywhere

// Cuisine signal is read from FACTUAL fields only — the name, the dish list
// (what_to_order) and vibe tags — never the editorial prose (why_its_here /
// best_for). Prose mentions many things in passing ("a refined alternative to
// the beachfront seafood warungs"), which produced false positives; the factual
// fields describe what a place actually serves.
export function blobOf(v: VenueWithPerk): string {
  return [v.name, v.whatToOrder ?? "", (v.vibeTags ?? []).join(" ")]
    .join(" ")
    .toLowerCase();
}

const rx = (source: string) => new RegExp(source);

export const COLLECTIONS: Collection[] = [
  {
    slug: "balinese-and-local-food",
    kind: "taste",
    taste: "Balinese & local",
    title: "Real Balinese food, island-wide",
    metaTitle: "Real Balinese & local food in Bali — island-wide",
    metaDescription:
      "Babi guling, nasi campur, bebek betutu — the island's own kitchen, calm and inexpensive. A resident-curated map of real Balinese and local food, by area.",
    intro:
      "Babi guling before noon, nasi campur the way a warung makes it, bebek betutu ordered a day ahead. This is the island's own kitchen — calm, generous and inexpensive — and where to find it done right.",
    faq: [
      { q: "Where can I find authentic Balinese food?", a: "In warungs and family kitchens across the island — Ubud and the villages inland for the most traditional cooking, and pockets of Canggu, Sanur and Uluwatu for local food alongside the international scene. The places here are sorted by area." },
      { q: "What Balinese dishes should I try?", a: "Babi guling (suckling pig), nasi/mie goreng, nasi campur (a rice plate of small dishes), bebek betutu (slow-cooked duck, often ordered a day ahead) and sate lilit. Each venue's page notes what to order." },
      { q: "Is local food in Bali cheap?", a: "Yes — a warung meal is one of the best-value plates in Asia. Each place shows its price band; for the cheapest authentic spots see our best warungs guide." },
    ],
    related: ["seafood", "brunch-and-breakfast"],
    // Deliberately specific: warungs plus Balinese-defining dishes. Generic
    // menu items (nasi/mie goreng) are excluded — they appear on international
    // menus too and would drag in places that aren't local kitchens.
    match: (b, v) =>
      v.category === "warung" ||
      rx("babi guling|bebek betutu|nasi campur|nasi ayam|nasi bali|lawar|sate lilit|balinese|waroeng|warung").test(b),
  },
  {
    slug: "brunch-and-breakfast",
    kind: "taste",
    taste: "Brunch",
    title: "The Bali brunch collection",
    metaTitle: "The best brunch & breakfast in Bali — by area",
    metaDescription:
      "Post-surf smoothie bowls, slow café mornings, breakfasts that turn into laptops and long conversations. A resident-curated map of Bali's best brunch, by area.",
    intro:
      "Post-surf smoothie bowls, slow café mornings, breakfasts that turn into laptops and long conversations. The island's first meal, done well, area by area.",
    faq: [
      { q: "Where is the best brunch in Bali?", a: "Canggu and Seminyak have the densest café-brunch scenes, Ubud the healthy jungle-view breakfasts. The spots here are grouped by area so you can pick one near you." },
      { q: "What is a typical Bali breakfast?", a: "The café scene runs to smoothie bowls, açai, sourdough and eggs; the local breakfast is nasi/mie goreng or bubur (rice porridge). Many cafés serve both." },
    ],
    related: ["balinese-and-local-food", "seafood"],
    match: (b, v) =>
      v.category === "cafe" ||
      rx("brunch|breakfast|smoothie bowl|acai|açai|pancake|eggs benedict|sourdough").test(b),
  },
  {
    slug: "seafood",
    kind: "taste",
    taste: "Seafood",
    title: "Seafood worth the trip",
    metaTitle: "The best seafood in Bali — grills, warungs & raw bars",
    metaDescription:
      "Grilled fish on Jimbaran sand, beachfront warungs in Sanur, fine-dining raw bars in Seminyak. A resident-curated map of Bali's best seafood, by area.",
    intro:
      "Grilled fish on Jimbaran sand, beachfront warungs in Sanur, fine-dining raw bars in Seminyak. Where the catch is fresh and the setting earns the ride.",
    faq: [
      { q: "Where is the best seafood in Bali?", a: "Jimbaran Bay is the classic — grilled fish on the sand at sunset. Sanur has easy beachfront warungs, and Seminyak the polished raw bars and fine dining. The places here are sorted by area." },
      { q: "How much does a Jimbaran seafood dinner cost?", a: "It ranges from casual warung plates to upmarket beachfront set menus. Each venue's page shows its price band; confirm per-kg pricing before you order on the beach." },
    ],
    related: ["balinese-and-local-food", "brunch-and-breakfast"],
    match: (b) => rx("seafood|ikan bakar|grilled fish|raw bar|oyster|lobster|prawn|catch|fish market|fishmarket").test(b),
  },
  // ---- Held below the gate for now (auto-publish once they reach the bar) ----
  {
    slug: "japanese",
    kind: "taste",
    taste: "Japanese",
    title: "Japanese in Bali: sushi to izakaya",
    metaTitle: "Japanese food in Bali — sushi, izakaya & ramen",
    metaDescription:
      "A short, honest list — Bali's Japanese scene is small but serious. Izakaya evenings, sushi counters and ramen, chosen the way residents choose them.",
    intro:
      "A short, honest list — Bali's Japanese scene is small but serious. Izakaya evenings, sushi counters and ramen for a rainy day, chosen the way residents choose them.",
    faq: [
      { q: "Is there good Japanese food in Bali?", a: "Yes, though the scene is small — a handful of serious sushi counters, izakayas and ramen spots, concentrated in Seminyak, Canggu and the south. The places here are the ones residents return to." },
    ],
    related: ["seafood", "brunch-and-breakfast"],
    match: (b) => rx("japanese|sushi|izakaya|ramen|sashimi|omakase|yakitori|donburi").test(b),
  },
  {
    slug: "desserts-gelato-and-pastry",
    kind: "taste",
    taste: "Desserts",
    title: "The sweet map of Bali",
    metaTitle: "The best desserts, gelato & pastry in Bali",
    metaDescription:
      "Proper gelato after a beach day, pastry that survives the humidity, dessert tasting rooms. A resident-curated sweet map of Bali, by area.",
    intro:
      "Proper gelato after a beach day, pastry that survives the humidity, dessert tasting rooms worth dressing up for. The island's sweetest stops, mapped by area.",
    faq: [
      { q: "Where can I find good dessert in Bali?", a: "The café belts of Canggu, Seminyak and Ubud carry the pastry and gelato scene, with a few dedicated dessert rooms. The spots here are sorted by area." },
    ],
    related: ["brunch-and-breakfast", "japanese"],
    match: (b) => rx("gelato|dessert|pastry|patisserie|bakery|ice cream|cake|chocolate|sweet").test(b),
  },
  {
    slug: "vegetarian-and-plant-based",
    kind: "taste",
    taste: "Vegetarian",
    title: "Vegetarian Bali, done properly",
    metaTitle: "Vegetarian & plant-based food in Bali — done properly",
    metaDescription:
      "From Ubud's pioneering plant-based tables to Canggu's health cafés — the places where vegetarian is the point, not the compromise. Resident-curated, by area.",
    intro:
      "Bali might be the easiest island in Asia to eat green — if you know which kitchens actually care. From Ubud's pioneering plant-based tables to Canggu's health cafés, these are the places where vegetarian is the point, not the compromise.",
    faq: [
      { q: "Is Bali good for vegetarians?", a: "Very — Ubud in particular is one of Asia's best places to eat plant-based, and Canggu's health-café scene is strong. The places here put vegetarian food at the centre, not as an afterthought." },
      { q: "Which area has the best vegetarian food?", a: "Ubud leads for dedicated plant-based and raw-food kitchens; Canggu for health cafés and smoothie bowls. Both are covered here, by area." },
    ],
    related: ["brunch-and-breakfast", "balinese-and-local-food"],
    match: (b) => rx("vegan|vegetarian|plant-based|plant based|raw food|meat-free|plant-forward").test(b),
  },

  // ---- By moment — tagged `jobs`, not cuisine (design brief "Moments") ----
  {
    slug: "date-night",
    kind: "moment",
    taste: "Date night",
    title: "Date night in Bali",
    metaTitle: "The best date-night restaurants in Bali",
    metaDescription:
      "Low light, a good bottle, a table you don't want to leave. Bali's most romantic rooms and beachfront corners, chosen for the night that matters.",
    intro:
      "Low light, a good bottle, a table you don't want to leave. The island's most romantic rooms and beachfront corners, chosen for the night that matters.",
    faq: [
      { q: "Where should I go for a romantic dinner in Bali?", a: "Uluwatu and Jimbaran for clifftop and beachfront sunsets, Seminyak and Canggu for candle-lit dining rooms, Ubud for jungle-view tables. The picks here are sorted by area." },
    ],
    related: ["special-occasion", "sunset-drinks"],
    match: (_b, v) => hasJob(v, "date_night_special"),
  },
  {
    slug: "group-dinners",
    kind: "moment",
    taste: "Group dinners",
    title: "Big tables, good nights",
    metaTitle: "The best group-dinner restaurants in Bali",
    metaDescription:
      "Sharing plates, big tables, a room that can take the noise. Where a group of eight still gets looked after — across Bali, by area.",
    intro:
      "Sharing plates, big tables, a room that can take the noise. Where a group of eight still gets looked after.",
    faq: [
      { q: "Where can a big group eat in Bali?", a: "Canggu and Seminyak have the most rooms built for sharing plates and larger tables; beach clubs work for a celebration. Booking ahead is worth it for six or more — each venue's page notes if it takes reservations." },
    ],
    related: ["special-occasion", "date-night"],
    match: (_b, v) => hasJob(v, "group_dinner_share"),
  },
  {
    slug: "family-easy-dinners",
    kind: "moment",
    taste: "Family-easy",
    title: "Easy dinners with kids",
    metaTitle: "Family-friendly, kid-easy restaurants in Bali",
    metaDescription:
      "Space to move, food that lands fast, no waiting out a tasting menu. Relaxed early dinners in Bali that actually work with children — by area.",
    intro:
      "Space to move, food that lands fast, and no waiting out a tasting menu. Relaxed early dinners that work with children — no fuss, no drama.",
    faq: [
      { q: "Which restaurants in Bali are good with kids?", a: "Casual, open-air places with room to move — many in Canggu, Sanur and Ubud. Sanur and Nusa Dua are the easiest family bases. The spots here are grouped by area." },
    ],
    related: ["group-dinners", "cheap-and-brilliant"],
    match: (_b, v) => hasJob(v, "family_early_dinner"),
  },
  {
    slug: "special-occasion",
    kind: "moment",
    taste: "Special occasion",
    title: "For the big occasion",
    metaTitle: "Special-occasion restaurants in Bali",
    metaDescription:
      "A birthday, an anniversary, the night that has to land. Bali's special-occasion tables — the rooms, the views and the kitchens worth dressing up for.",
    intro:
      "A birthday, an anniversary, the night that has to land. Bali's special-occasion tables — the rooms, the views and the kitchens worth dressing up for.",
    faq: [
      { q: "Where to celebrate a special occasion in Bali?", a: "Uluwatu for clifftop views, Seminyak and Ubud for signature dining rooms and tasting menus. Book well ahead for the headline tables — each venue's page shows whether it needs a reservation." },
    ],
    related: ["date-night", "worth-the-splurge"],
    match: (_b, v) => hasJob(v, "special_occasion"),
  },
  {
    slug: "work-friendly-cafes",
    kind: "moment",
    taste: "Work-friendly",
    title: "Cafés that let you stay",
    metaTitle: "Work-friendly cafés in Bali — where you can settle in",
    metaDescription:
      "A plug you can reach, a seat no one hurries you out of, and coffee worth staying for. The Bali cafés where people settle in to work — by area.",
    intro:
      "A plug you can actually reach, a seat no one hurries you out of, and coffee worth staying for. The cafés where a coffee turns into a productive morning.",
    faq: [
      { q: "Which cafés in Bali are good for working?", a: "Canggu and Ubud have the deepest work-café scenes, with Sanur and Uluwatu catching up. These are places where people settle in to work — comfortable seating and an unhurried welcome, rather than a promised connection speed. Check with the venue for current conditions." },
    ],
    related: ["brunch-and-breakfast", "local-and-calm"],
    match: (_b, v) => hasJob(v, "quiet_work_cafe"),
  },
  {
    slug: "sunset-drinks",
    kind: "moment",
    taste: "Sunset drinks",
    title: "Where the sunset lands",
    metaTitle: "The best sunset spots & bars in Bali",
    metaDescription:
      "The west coast does this best — cliff edges, beach sand and rooftop rails where the day signs off. Bali's sunset drinks, mapped for golden hour.",
    intro:
      "The west coast does this best. Cliff edges, beach sand and rooftop rails where the day signs off — timed and mapped for golden hour.",
    faq: [
      { q: "Where is the best sunset in Bali?", a: "The west and south-west coast: Uluwatu's cliffs, the Canggu and Seminyak beaches, and Jimbaran Bay. The east coast (Sanur) faces sunrise, so it isn't in this list. Arrive early in peak season for the front-row tables." },
    ],
    related: ["date-night", "special-occasion"],
    // Geo fact: sunset is a west/south-west coast experience. Sanur (sunrise)
    // and the east are excluded by the allow-list, not just by tagging.
    districts: ["canggu", "uluwatu-bukit", "seminyak", "jimbaran"],
    match: (_b, v) => hasJob(v, "sunset_drinks_view"),
  },
  {
    slug: "local-and-calm",
    kind: "moment",
    taste: "Local & calm",
    title: "Quiet local tables",
    metaTitle: "Quiet, calm local restaurants in Bali",
    metaDescription:
      "Local food, unhurried. Family warungs and calm neighbourhood kitchens where the plate is honest, the bill is small and no one rushes you — by area.",
    intro:
      "Local food, unhurried. Family warungs and calm neighbourhood kitchens where the plate is honest, the bill is small and no one rushes you.",
    faq: [
      { q: "Where can I eat calm, local food in Bali?", a: "Away from the busiest strips — quiet warungs and neighbourhood kitchens across Ubud, Sanur, Canggu and the south. The spots here are chosen for a calm, local meal, sorted by area." },
    ],
    related: ["balinese-and-local-food", "cheap-and-brilliant"],
    match: (_b, v) => hasJob(v, "local_food_calm"),
  },
  {
    slug: "just-landed",
    kind: "moment",
    taste: "Just landed",
    title: "Your first night in Bali",
    metaTitle: "Where to eat your first night in Bali — easy, no-fuss",
    metaDescription:
      "Jet-lagged, hungry, don't want a project. Easy, nearby, no-fuss first dinners in Bali for the night you arrive — by area.",
    intro:
      "Jet-lagged, hungry, and you don't want a project. Easy, nearby, no-fuss first dinners for the night you arrive.",
    faq: [
      { q: "Where should I eat on my first night in Bali?", a: "Somewhere easy and close to where you're staying — a relaxed local kitchen or a reliable all-rounder, not a big night out. The picks here are grouped by area so you can find one near your first hotel." },
    ],
    related: ["local-and-calm", "cheap-and-brilliant"],
    match: (_b, v) => hasJob(v, "just_landed_easy_dinner"),
  },
  // ---- By budget (price band) ----
  {
    slug: "cheap-and-brilliant",
    kind: "moment",
    taste: "Cheap & brilliant",
    title: "Cheap eats that punch above",
    metaTitle: "The best cheap eats in Bali — big flavour, small bills",
    metaDescription:
      "Small bills, big flavour. The warungs and street kitchens where a handful of rupiah still buys one of the best plates of your trip — across Bali, by area.",
    intro:
      "Small bills, big flavour. The warungs and street kitchens where a handful of rupiah still buys one of the best plates of your trip.",
    faq: [
      { q: "Where are the cheapest good eats in Bali?", a: "Local warungs, island-wide — a full plate for the price of a coffee back home. These are the budget spots we stand behind, sorted by area; each page shows its price band." },
    ],
    related: ["local-and-calm", "balinese-and-local-food"],
    match: (_b, v) => isCheap(v),
  },
  {
    slug: "worth-the-splurge",
    kind: "moment",
    taste: "Worth the splurge",
    title: "Worth dressing up for",
    metaTitle: "Fine dining in Bali — worth the splurge",
    metaDescription:
      "For the night you go all in. Tasting menus, clifftop rooms and signature kitchens in Bali where the bill is real and the evening earns it — by area.",
    intro:
      "For the night you go all in. Tasting menus, clifftop rooms and signature kitchens where the bill is real and the evening earns it.",
    faq: [
      { q: "Where is the best fine dining in Bali?", a: "Seminyak, Ubud and the Uluwatu cliffs hold most of the island's signature tasting menus and destination dining rooms. Book well ahead — each venue's page shows its price band and whether it needs a reservation." },
    ],
    related: ["special-occasion", "date-night"],
    match: (_b, v) => isSplurge(v),
  },
];

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export interface CollectionArea {
  key: string;
  name: string;
  pillar?: string;
  venues: VenueWithPerk[];
}

// Members of a collection: published + indexable + matches the taste signal,
// grouped into the district spine (empty districts dropped).
export async function getCollectionAreas(slug: string): Promise<CollectionArea[]> {
  const collection = getCollection(slug);
  if (!collection) return [];
  const all = await getPublishedVenues();
  const allow = collection.districts ? new Set(collection.districts) : null;
  const members = all.filter(
    (v) =>
      isVenueIndexable(v) &&
      (!allow || allow.has(v.district)) &&
      collection.match(blobOf(v), v),
  );
  return COLLECTION_AREA_ORDER.map((area) => ({
    ...area,
    venues: members
      .filter((v) => v.district === area.key)
      .sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((a) => a.venues.length > 0);
}

function meetsGate(areas: CollectionArea[]): boolean {
  const total = areas.reduce((n, a) => n + a.venues.length, 0);
  return total >= MIN_VENUES && areas.length >= MIN_DISTRICTS;
}

// Slugs of the collections that currently clear the publication gate. Used by
// generateStaticParams, the hub, the sitemap and every internal cross-link, so
// a held collection is invisible everywhere at once.
export async function liveCollectionSlugs(): Promise<string[]> {
  const live: string[] = [];
  for (const c of COLLECTIONS) {
    if (meetsGate(await getCollectionAreas(c.slug))) live.push(c.slug);
  }
  return live;
}

// A small, district-spread sample from a collection — round-robins across
// districts so a "My Day" slot doesn't show three places from one area. Empty
// if the collection isn't live-worthy (caller can hide the slot).
export async function getCollectionSample(slug: string, n: number): Promise<VenueWithPerk[]> {
  const areas = await getCollectionAreas(slug);
  const out: VenueWithPerk[] = [];
  let i = 0;
  while (out.length < n) {
    const before = out.length;
    for (const area of areas) {
      if (area.venues[i]) {
        out.push(area.venues[i]);
        if (out.length >= n) break;
      }
    }
    if (out.length === before) break; // exhausted
    i += 1;
  }
  return out;
}

// A sample from a collection restricted to one district, for the interactive
// "My Day" builder. When the chosen area has no decision-ready venue for this
// collection, it widens island-wide and reports `widened: true` so the UI can
// say so honestly instead of silently pretending the pick is local (or showing
// an empty slot). `district = null` means all Bali (never widened).
export async function getCollectionSampleInArea(
  slug: string,
  n: number,
  district: string | null,
): Promise<{ venues: VenueWithPerk[]; widened: boolean }> {
  if (!district) {
    return { venues: await getCollectionSample(slug, n), widened: false };
  }
  const areas = await getCollectionAreas(slug);
  const local = areas.find((a) => a.key === district)?.venues ?? [];
  if (local.length > 0) {
    return { venues: local.slice(0, n), widened: false };
  }
  return { venues: await getCollectionSample(slug, n), widened: true };
}

export function toCollectionPlaceCard(v: VenueWithPerk): PlaceCardData {
  return {
    slug: v.slug,
    name: v.name,
    category: v.category,
    microArea: v.area,
    editorialLine: v.whyItsHere,
    bestFor: v.bestFor,
    priceBand: v.priceAnchor,
    photoUrl: v.photoUrl,
    isSponsored: v.isSponsored,
    gmapsUrl: v.gmapsUrl,
  };
}
