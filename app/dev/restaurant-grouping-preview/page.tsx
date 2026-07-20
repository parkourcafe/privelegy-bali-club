import { notFound } from "next/navigation";
import type { VenueWithPerk } from "@/lib/data";
import { COLLECTIONS, blobOf } from "@/lib/collections";

// DEV-ONLY proof harness for the best-restaurants-in-bali taste-group
// reorganization: the real render can't be exercised in the sandbox (no
// gate-passing seed restaurants), so this feeds a handful of realistic
// fixture venues through the SAME tasteGroupFor()/blobOf()/match() logic and
// prints which bucket each one lands in. 404s outside development.

const TASTE_COLLECTIONS = COLLECTIONS.filter((c) => c.kind === "taste");
function tasteGroupFor(v: VenueWithPerk): string | null {
  const blob = blobOf(v);
  const hit = TASTE_COLLECTIONS.find((c) => c.match(blob, v));
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

export default function RestaurantGroupingPreview() {
  if (process.env.NODE_ENV !== "development") notFound();

  const groups = new Map<string, VenueWithPerk[]>();
  const more: VenueWithPerk[] = [];
  for (const v of FIXTURES) {
    const slug = tasteGroupFor(v);
    if (!slug) {
      more.push(v);
      continue;
    }
    const list = groups.get(slug) ?? [];
    list.push(v);
    groups.set(slug, list);
  }

  return (
    <main className="site-shell">
      <h1>Taste-group proof (dev only)</h1>
      {TASTE_COLLECTIONS.filter((c) => groups.has(c.slug)).map((c) => (
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
          <h3>More kitchens</h3>
          <ul>
            {more.map((v) => (
              <li key={v.slug}>{v.name}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
