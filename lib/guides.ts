// Registry of long-form editorial guides (the top-of-funnel SEO/AEO articles,
// e.g. "Where to stay in Bali for the first time"). Static config — no DB
// entity (guardrail #11), same pattern as lib/scenarios.ts and lib/pillars.ts.
// Single source of truth so the sitemap and llms.txt can enumerate guides
// without drifting. The article body lives in its own route; this holds the
// slug + metadata used for linking, sitemap and machine surfaces.

export interface Guide {
  slug: string; // URL segment at the site root, e.g. "where-to-stay-in-bali"
  title: string; // H1 / sitemap label
  description: string; // meta description (~150 chars, human-written)
}

export const GUIDES: Guide[] = [
  {
    slug: "where-to-stay-in-bali",
    title: "Where to stay in Bali for the first time",
    description:
      "Canggu, Seminyak, Uluwatu, Ubud or Sanur? How Bali's five first-timer areas actually differ — and how to pick the right base for your first trip.",
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
