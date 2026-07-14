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
    slug: "best-warungs",
    h1: "Best warungs & local food in Ubud",
    metaTitle: "Best warungs in Ubud — cheap, authentic local food",
    metaDescription:
      "Where to eat cheap, authentic Balinese and Indonesian food in Ubud — the warungs we rate for nasi campur, home-style plates and honest local eating.",
    lede: "Beyond the health cafés, Ubud has honest, affordable warungs doing real Balinese and Indonesian food. These are the ones we send people to.",
    // Catches the local warungs, including those keyed as `restaurant` in the
    // catalogue (name-based), without a destructive re-category migration.
    base: (v) => v.category === "warung" || /\bwarung\b/i.test(v.name),
    sectionHeading: "Warungs & local food",
    sectionNote: "Cheap, authentic and unfussy — the local plates worth seeking out.",
    faq: [
      { q: "What is a warung?", a: "A warung is a small, family-run Indonesian eatery serving affordable local food — nasi campur, satay and daily home-style dishes. They're the backbone of everyday eating in Bali." },
      { q: "Where do locals eat in Ubud?", a: "At warungs — small local eateries away from the tourist strip. The picks here are the ones we rate for authentic, affordable Balinese and Indonesian food." },
      { q: "Is local food in Ubud cheap?", a: "Yes — warungs are among the best value in Bali, with generous plates for a fraction of café or restaurant prices." },
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
  {
    slug: "best-yoga-wellness",
    h1: "Best yoga & wellness in Ubud",
    metaTitle: "Best yoga & wellness in Ubud — studios, spas, sound & retreats",
    metaDescription:
      "Ubud's yoga, spa and wellness scene, curated: where to drop into a class, book a massage, sit in a sound bath or commit to a retreat. Resident-curated, honest about what each is for.",
    lede: "Ubud is Bali's wellness capital — this is where to practise, reset and be worked on, from big drop-in studios to quiet Ayurvedic spas and sound healing.",
    base: (v) => v.category === "spa",
    sectionHeading: "Yoga, spa & wellness",
    sectionNote: "Studios, spas, sound and retreats — honest about which is a drop-in class, a treatment or a multi-day commitment.",
    faq: [
      { q: "Where should a first-timer do yoga in Ubud?", a: "The big drop-in studios — the kind with a full daily timetable across styles — are the easiest starting point; smaller shalas suit you once you know what you want to practise." },
      { q: "Do I need to book Ubud yoga classes and spa treatments ahead?", a: "Popular classes and the well-known spas fill in high season — reserve a day ahead where you can. Some hillside studios and village spas are quieter and easier to walk into." },
      { q: "What's the difference between a class, a treatment and a retreat here?", a: "We note it on each: a drop-in class is an hour or two, a spa or Ayurvedic treatment is a single booking, and a retreat is a multi-day, often doctor- or teacher-led programme." },
    ],
  },
];

export function getUbudGuide(slug: string | null | undefined): UbudGuide | null {
  if (!slug) return null;
  return UBUD_GUIDES.find((g) => g.slug === slug) ?? null;
}
