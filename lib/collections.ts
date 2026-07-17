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
import type { PlaceCardData } from "@/components/PlaceCard";

export const MIN_VENUES = 10;
export const MIN_DISTRICTS = 3;

// Shared curation line — our no-ratings honesty as a feature. Identical across
// every collection (brief §4.3, mandatory element).
export const CURATION_NOTE =
  "No ratings, no paid placements — every place here was chosen for fit by people who live on the island.";

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

export interface Collection {
  slug: string; // route: /collections/{slug}
  taste: string; // short chip label
  title: string; // H1 (brief-approved copy)
  metaTitle: string;
  metaDescription: string;
  intro: string;
  faq: { q: string; a: string }[];
  related: string[]; // other collection slugs
  // Membership signal over verified editorial text. Kept deliberately narrow —
  // a collection is "where this is the point", not "anything that mentions it".
  match: (blob: string, v: VenueWithPerk) => boolean;
}

// Cuisine signal is read from FACTUAL fields only — the name, the dish list
// (what_to_order) and vibe tags — never the editorial prose (why_its_here /
// best_for). Prose mentions many things in passing ("a refined alternative to
// the beachfront seafood warungs"), which produced false positives; the factual
// fields describe what a place actually serves.
function blobOf(v: VenueWithPerk): string {
  return [v.name, v.whatToOrder ?? "", (v.vibeTags ?? []).join(" ")]
    .join(" ")
    .toLowerCase();
}

const rx = (source: string) => new RegExp(source);

export const COLLECTIONS: Collection[] = [
  {
    slug: "balinese-and-local-food",
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
  const members = all.filter(
    (v) => isVenueIndexable(v) && collection.match(blobOf(v), v),
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
