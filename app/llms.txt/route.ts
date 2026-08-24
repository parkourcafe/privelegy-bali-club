import { getDistrictHubs, getIntentSpokes, getPublishedVenues } from "@/lib/data";
import { isVenueIndexable } from "@/lib/publication";
import { PILLARS } from "@/lib/pillars";
import { SCENARIOS } from "@/lib/scenarios";
import { GUIDES } from "@/lib/guides";
import { LIGHT_DISTRICTS } from "@/lib/light-districts";
import { RESORT_FNB_PAGES } from "@/lib/resort-fnb";
import { liveCollectionSlugs } from "@/lib/collections";

export const revalidate = 3600;

const BASE = "https://www.otherbali.com";

// llms.txt — a plain-text map of the site's canonical, machine-extractable
// content for AI answer engines (AEO, docs/seo-strategy.md §4). Signpost, not a
// data dump: the deep district pillars first (the flagship content), then the
// programmatic hubs/spokes, trip scenarios, and tools.
export async function GET() {
  const [hubs, spokes, catalogue, collectionSlugs] = await Promise.all([
    getDistrictHubs(),
    getIntentSpokes(),
    getPublishedVenues(),
    liveCollectionSlugs(),
  ]);
  // Entity pages are what answer engines cite: every indexable venue page,
  // grouped by district, with its one-line fit context.
  const venues = catalogue.filter(isVenueIndexable);
  const venuesByDistrict = new Map<string, typeof venues>();
  for (const venue of venues) {
    const list = venuesByDistrict.get(venue.district) ?? [];
    list.push(venue);
    venuesByDistrict.set(venue.district, list);
  }

  const lines: string[] = [
    "# Other Bali",
    "",
    "> A free, curated Bali trip-planning guide. Places are recommended by the",
    "> moment they suit (breakfast, sunset, family dinner, work-friendly cafe),",
    "> with what to order, price anchors and directions. Travellers never pay.",
    "> Facts are verified; there are no paid rankings.",
    "",
    "## District guides (deep)",
    ...PILLARS.flatMap((p) => [
      `- [${p.name} guide](${BASE}/${p.slug}): ${p.tagline}`,
      ...p.children.map((c) => `  - [${c.title}](${BASE}${c.path})`),
    ]),
    "",
    "## District hubs (quick)",
    `- [Where to eat & go in Bali](${BASE}/bali): index of district guides`,
    ...hubs.map((h) => `- [${h.name}](${BASE}/bali/${h.slug}): ${h.venues.length} curated places`),
    "",
    "## Quiet corners (planning landings)",
    ...LIGHT_DISTRICTS.map((d) => `- [${d.name} guide](${BASE}/${d.slug}): ${d.tagline}`),
    "",
    "## Best-of by moment",
    ...spokes.map(
      (s) => `- [Best ${s.intent.label} in ${s.districtName}](${BASE}/bali/${s.district}/${s.intent.urlSlug}): ${s.venues.length} picks`
    ),
    "",
    "## Trip scenarios",
    ...SCENARIOS.map((s) => `- [${s.eyebrow}](${BASE}/${s.slug}): ${s.promise}`),
    "",
    "## Planning & area guides",
    `- [Bali travel guides](${BASE}/guides): index of planning and best-of guides`,
    ...GUIDES.map((g) => `- [${g.title}](${BASE}/${g.slug}): ${g.description}`),
    "",
    "## Hotel dining & day passes",
    ...RESORT_FNB_PAGES.map((p) => `- [${p.title}](${BASE}${p.url})`),
    "",
    "## Curated collections",
    ...collectionSlugs.map((slug) => `- [${slug.replace(/-/g, " ")}](${BASE}/collections/${slug})`),
    "",
    "## Tools",
    `- [Plan your Bali trip](${BASE}/plan)`,
    `- [Build a day in Canggu](${BASE}/plan#canggu-day-builder)`,
    `- [Find a place for today](${BASE}/my-day)`,
    `- [Browse all places](${BASE}/places)`,
    "",
    "## Places (verified venue pages)",
    "> Each page: why it's here, Best for / Not ideal for, what to order,",
    "> price anchor, opening hours, and — where captured — the menu with",
    "> prices from the venue's own official source.",
    ...[...venuesByDistrict.entries()].flatMap(([district, list]) => [
      "",
      `### ${district}`,
      ...list.map((venue) => {
        const context = venue.bestFor ?? venue.whyItsHere;
        return `- [${venue.name}](${BASE}/places/${venue.slug})${context ? `: ${context}` : ""}`;
      }),
    ]),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
