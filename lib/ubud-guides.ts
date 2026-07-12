// Ubud SEO child guides (master §6a.3, brief §13). Editorial "best of"
// (guardrail #6). Ubud has no `jobs` tags yet, so these are curated CATEGORY
// lists from real DB editorial data — no fabricated decision groups (§4). The
// richer decision/wellness guides arrive with the Ubud data + evidence pass.

import type { VenueWithPerk } from "@/lib/data";

export type UbudGuide = {
  slug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  lede: string;
  base: (v: VenueWithPerk) => boolean;
  sectionHeading: string;
  sectionNote: string;
  faq: { q: string; a: string }[];
};

export const UBUD_GUIDES: UbudGuide[] = [
  {
    slug: "best-restaurants",
    h1: "Best restaurants in Ubud",
    metaTitle: "Best restaurants in Ubud — resident-curated, honest picks",
    metaDescription:
      "Where to eat in Ubud: the restaurants we actually rate, from long slow dinners to healthy plates — curated, honest about trade-offs.",
    lede: "Ubud's dinner scene leans green, healthy and unhurried. These are the rooms we send people to.",
    base: (v) => v.category === "restaurant",
    sectionHeading: "Where to eat in Ubud",
    sectionNote: "Curated picks — book ahead for the popular rooms.",
    faq: [
      { q: "Do Ubud restaurants take reservations?", a: "The popular dinner rooms fill in high season — book a day or two ahead. Casual spots and warungs are walk-in." },
      { q: "Is Ubud good for vegetarians and vegans?", a: "Very — Ubud has one of Bali's deepest plant-based scenes; most kitchens do strong vegetarian and vegan plates." },
    ],
  },
  {
    slug: "best-cafes-coffee",
    h1: "Best cafés & coffee in Ubud",
    metaTitle: "Best cafés & coffee in Ubud — where to sit, work and slow down",
    metaDescription:
      "Ubud cafés worth a morning: serious coffee, calm rooms and green views. Resident-curated, honest about which are for work and which are for slowing down.",
    lede: "Ubud mornings are made for coffee and a slow start. These are the cafés we rate for it.",
    base: (v) => v.category === "cafe",
    sectionHeading: "Coffee & café mornings",
    sectionNote: "Serious coffee and calm rooms — some better for work, some for slowing down.",
    faq: [
      { q: "Which Ubud cafés are good for working?", a: "Ubud has a strong café-work culture, but rooms vary — look for the ones we note as calm with room to sit; some jungle cafés are for the view, not a laptop." },
    ],
  },
];

export function getUbudGuide(slug: string | null | undefined): UbudGuide | null {
  if (!slug) return null;
  return UBUD_GUIDES.find((g) => g.slug === slug) ?? null;
}
