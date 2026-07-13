// Nusa Dua SEO child guides (master §6a.3). Editorial "best of" (guardrail #6),
// organised by category from real DB editorial data — nothing invented (§4).
// Nusa Dua is planning_only (resort enclave): no money loop.

import type { VenueWithPerk } from "@/lib/data";

export type NusaDuaGuide = {
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

export const NUSA_DUA_GUIDES: NusaDuaGuide[] = [
  {
    slug: "best-restaurants",
    h1: "Best restaurants in Nusa Dua",
    metaTitle: "Best restaurants in Nusa Dua — fine dining, beachfront & local",
    metaDescription:
      "Where to eat in Nusa Dua: the resort fine-dining rooms, beachfront tables and the local warungs worth leaving the resort for. Resident-curated, honest about what each is for.",
    lede: "Nusa Dua dining is resort-led — polished fine-dining rooms and beachfront tables inside the five-stars, plus a few local spots worth the short trip out. These are the ones we rate.",
    base: (v) => v.category === "restaurant" || v.category === "warung" || v.category === "beach_club",
    sectionHeading: "Where to eat in Nusa Dua",
    sectionNote: "Resort fine dining, beachfront tables and local warungs — the destination rooms book out, so reserve ahead.",
    faq: [
      { q: "Is there anywhere to eat in Nusa Dua outside the resorts?", a: "A little — the enclave is resort-led, but a short trip to Bualu village reaches local warungs, and the Bali Collection has casual options. For a proper local meal, look under the warung picks." },
      { q: "Do Nusa Dua restaurants take reservations?", a: "The resort fine-dining rooms do and should be booked ahead, especially for dinner and special occasions." },
    ],
  },
  {
    slug: "spas-wellness",
    h1: "Best spas & wellness in Nusa Dua",
    metaTitle: "Best spas & wellness in Nusa Dua — resort spas, fitness & yoga",
    metaDescription:
      "Nusa Dua is a resort-spa heartland: where to book a massage, use a proper fitness centre, or take a yoga class. Resident-curated, honest about what each is for.",
    lede: "Nusa Dua is built for being looked after — some of Bali's largest and most awarded resort spas, plus well-kitted fitness centres and calm yoga. Here's where to book, by what you want.",
    base: (v) => v.category === "spa" || v.category === "fitness" || v.category === "yoga",
    sectionHeading: "Spas, fitness & yoga",
    sectionNote: "Award-winning resort spas, hotel fitness centres and yoga — honest about which is a treatment, a workout or a class.",
    faq: [
      { q: "Is Nusa Dua good for spas?", a: "It's arguably Bali's resort-spa heartland — several of the island's biggest and most awarded spas sit inside the Nusa Dua five-stars, many with hydrotherapy and thalassotherapy facilities." },
      { q: "Can non-guests use Nusa Dua resort spas and gyms?", a: "Many resort spas take outside bookings, and some fitness centres offer day passes — confirm directly with the venue, as access varies by resort." },
    ],
  },
];

export function getNusaDuaGuide(slug: string | null | undefined): NusaDuaGuide | null {
  if (!slug) return null;
  return NUSA_DUA_GUIDES.find((g) => g.slug === slug) ?? null;
}
