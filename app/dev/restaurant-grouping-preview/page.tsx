import { notFound } from "next/navigation";
import type { VenueWithPerk } from "@/lib/data";
import { COLLECTIONS, blobOf } from "@/lib/collections";

// DEV-ONLY proof harness for the best-restaurants-in-bali taste-group
// reorganization: the real render can't be exercised in the sandbox (no
// gate-passing seed restaurants), so this feeds a handful of realistic
// fixture venues through the SAME tasteGroupFor()/blobOf()/match() logic and
// prints which bucket each one lands in. 404s outside development.

const TASTE_COLLECTIONS = COLLECTIONS.filter((c) => c.kind === "taste");
const CAFE_TASTE_COLLECTIONS = TASTE_COLLECTIONS.filter((c) => c.slug !== "brunch-and-breakfast");
const WARUNG_TASTE_COLLECTIONS = TASTE_COLLECTIONS.filter((c) => c.slug !== "balinese-and-local-food");

function groupOf(pool: typeof TASTE_COLLECTIONS, v: VenueWithPerk): string | null {
  const blob = blobOf(v);
  const hit = pool.find((c) => c.match(blob, v));
  return hit?.slug ?? null;
}

function fixture(over: Partial<VenueWithPerk>): VenueWithPerk {
  return {
    id: over.slug as string,
    slug: over.slug as string,
    name: over.name as string,
    category: "restaurant",
    district: "canggu",
    address: "",
    gmapsUrl: "",
    tier: "editorial_seed",
    isSponsored: false,
    ...over,
  } as VenueWithPerk;
}

const FIXTURES = [
  fixture({ slug: "warung-bu-mi", name: "Warung Bu Mi", whatToOrder: "Nasi campur, babi guling" }),
  fixture({ slug: "sushi-nori", name: "Sushi Nori", whatToOrder: "Sashimi platter, ramen" }),
  fixture({ slug: "green-bowl-house", name: "Green Bowl House", vibeTags: ["plant-based", "vegan"] }),
  fixture({ slug: "kembali-seafood", name: "Kembali Seafood Grill", whatToOrder: "Grilled fish, oyster platter" }),
  fixture({ slug: "sunday-brunch-co", name: "Sunday Brunch Co", whatToOrder: "Smoothie bowl, eggs benedict" }),
  fixture({ slug: "the-tasting-room", name: "The Tasting Room" }), // matches nothing -> residual
];

// Proves the per-page tautology exclusion: a plain cafe with no distinguishing
// keyword must land in "More" (never a degenerate all-cafes "Brunch" bucket),
// while a genuinely dessert/vegetarian cafe still gets a real sub-group.
const CAFE_FIXTURES = [
  fixture({ slug: "plain-corner-cafe", name: "Plain Corner Cafe", category: "cafe" }),
  fixture({ slug: "gelato-lab", name: "Gelato Lab", category: "cafe", whatToOrder: "Pistachio gelato, affogato" }),
  fixture({ slug: "raw-greens-cafe", name: "Raw Greens Cafe", category: "cafe", vibeTags: ["vegan", "plant-based"] }),
];

// Proves the same exclusion for warungs: a plain local warung must land in
// "More" (never a degenerate all-warungs "Balinese & local" bucket), while a
// warung that's actually about seafood still gets a real sub-group.
const WARUNG_FIXTURES = [
  fixture({ slug: "warung-sederhana", name: "Warung Sederhana", category: "warung" }),
  fixture({ slug: "warung-ikan-segar", name: "Warung Ikan Segar", category: "warung", whatToOrder: "Grilled fish, prawn sambal" }),
];

function groupFixtures(pool: typeof TASTE_COLLECTIONS, fixtures: VenueWithPerk[]) {
  const groups = new Map<string, VenueWithPerk[]>();
  const more: VenueWithPerk[] = [];
  for (const v of fixtures) {
    const slug = groupOf(pool, v);
    if (!slug) {
      more.push(v);
      continue;
    }
    const list = groups.get(slug) ?? [];
    list.push(v);
    groups.set(slug, list);
  }
  return { groups, more };
}

function GroupBlock({
  pool,
  fixtures,
  moreLabel,
}: {
  pool: typeof TASTE_COLLECTIONS;
  fixtures: VenueWithPerk[];
  moreLabel: string;
}) {
  const { groups, more } = groupFixtures(pool, fixtures);
  return (
    <>
      {pool.filter((c) => groups.has(c.slug)).map((c) => (
        <section key={c.slug} className="guide-section">
          <h3>{c.taste}</h3>
          <ul>
            {groups.get(c.slug)!.map((v) => (
              <li key={v.slug}>{v.name}</li>
            ))}
          </ul>
        </section>
      ))}
      {more.length > 0 && (
        <section className="guide-section">
          <h3>{moreLabel}</h3>
          <ul>
            {more.map((v) => (
              <li key={v.slug}>{v.name}</li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

export default function RestaurantGroupingPreview() {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <main className="site-shell">
      <h1>Taste-group proof (dev only)</h1>

      <h2>best-restaurants-in-bali</h2>
      <GroupBlock pool={TASTE_COLLECTIONS} fixtures={FIXTURES} moreLabel="More kitchens" />

      <h2>best-cafes-in-bali (brunch-and-breakfast excluded)</h2>
      <GroupBlock pool={CAFE_TASTE_COLLECTIONS} fixtures={CAFE_FIXTURES} moreLabel="More cafés" />

      <h2>best-warungs-in-bali (balinese-and-local-food excluded)</h2>
      <GroupBlock pool={WARUNG_TASTE_COLLECTIONS} fixtures={WARUNG_FIXTURES} moreLabel="More warungs" />
    </main>
  );
}
