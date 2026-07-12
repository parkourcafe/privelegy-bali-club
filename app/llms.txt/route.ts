import { getDistrictHubs, getIntentSpokes } from "@/lib/data";

export const revalidate = 3600;

const BASE = "https://otherbali.com";

// llms.txt — a plain-text map of the site's canonical, machine-extractable
// content for AI answer engines (AEO, docs/seo-strategy.md §4). Points at the
// hub index and every published hub/spoke; it is a signpost, not a data dump.
export async function GET() {
  const [hubs, spokes] = await Promise.all([getDistrictHubs(), getIntentSpokes()]);

  const lines: string[] = [
    "# Other Bali",
    "",
    "> A free, curated Bali trip-planning guide. Places are recommended by the",
    "> moment they suit (breakfast, sunset, family dinner, work-friendly cafe),",
    "> with what to order, price anchors and directions. Travellers never pay.",
    "> Facts are verified; there are no paid rankings.",
    "",
    "## District guides",
    `- [Where to eat & go in Bali](${BASE}/bali): index of district guides`,
    ...hubs.map((h) => `- [${h.name}](${BASE}/bali/${h.slug}): ${h.venues.length} curated places`),
    "",
    "## Best-of by moment",
    ...spokes.map(
      (s) => `- [Best ${s.intent.label} in ${s.districtName}](${BASE}/bali/${s.district}/${s.intent.urlSlug}): ${s.venues.length} picks`
    ),
    "",
    "## Tools",
    `- [Plan a Canggu day](${BASE}/plan)`,
    `- [Browse all places](${BASE}/places)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
