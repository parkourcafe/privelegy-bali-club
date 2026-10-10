// Jimbaran SEO child guides (master §6a.3). Editorial "best of" (guardrail #6),
// organised by category from real DB editorial data — nothing invented (§4).
// Jimbaran is planning_only (seafood bay + resort strip): no money loop.

import type { VenueWithPerk } from "@/lib/data";

export type JimbaranGuide = {
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

export const JIMBARAN_GUIDES: JimbaranGuide[] = [
  {
    slug: "best-restaurants",
    h1: "Best restaurants in Jimbaran",
    metaTitle: "Best restaurants in Jimbaran — seafood, sunset bars & fine dining",
    metaDescription:
      "Where to eat in Jimbaran: the grilled-seafood tables on the bay, cliff-edge sunset bars and the resort fine-dining rooms. Resident-curated, and we say what each is for.",
    lede:
      "Jimbaran dining runs on two things: grilled seafood eaten with your feet near the sand at sunset, and polished resort rooms up on the headland. These are the tables and bars we rate, and what each is for.",
    base: (v) =>
      v.category === "restaurant" ||
      v.category === "warung" ||
      v.category === "beach_club" ||
      v.category === "bar",
    sectionHeading: "Where to eat & drink in Jimbaran",
    sectionNote:
      "Bay seafood, sunset bars and resort fine dining. The destination rooms and sunset seats book out, so reserve ahead.",
    faq: [
      {
        q: "Is Jimbaran good for seafood?",
        a: "It's the reason most people come. Jimbaran Bay is lined with grilled-seafood spots where the catch is chosen fresh and cooked over coconut husk. You eat at tables set out near the sand, and it's best timed for sunset.",
      },
      {
        q: "Do Jimbaran restaurants take reservations?",
        a: "The resort fine-dining rooms and the sunset bars do, so book ahead, especially for a sunset table at weekends or a special occasion.",
      },
      {
        q: "Is Jimbaran expensive to eat in?",
        a: "It spans both ends. The bay seafood grills are mid-range and pay-by-weight, while the headland resort restaurants and cliff bars sit at the top of the price scale. Each place's price band is on its page.",
      },
    ],
  },
  {
    slug: "spas-wellness",
    h1: "Best spas & wellness in Jimbaran",
    metaTitle: "Best spas & wellness in Jimbaran — resort spas, fitness & yoga",
    metaDescription:
      "The resort spas on Jimbaran's headland, plus fitness and yoga. Where to book, by what you want. Resident-curated, and we say what each is for.",
    lede:
      "The Jimbaran headland is resort-spa country. Some of Bali's most awarded treatment rooms sit inside the cliff-top five-stars, alongside well-kitted fitness and calm yoga. Choose by what you're after, then book.",
    base: (v) =>
      v.category === "spa" ||
      v.category === "fitness" ||
      v.category === "yoga" ||
      v.category === "beauty",
    sectionHeading: "Spas, fitness & yoga",
    sectionNote:
      "Cliff-top resort spas and hotel fitness centres, plus yoga. We say which is a treatment, a workout or a class.",
    faq: [
      {
        q: "Is Jimbaran good for spas?",
        a: "Yes. The headland five-stars hold several of Bali's most awarded spas, many with clifftop treatment rooms and sea views, plus full hydrotherapy facilities.",
      },
      {
        q: "Can non-guests use Jimbaran resort spas and gyms?",
        a: "Many resort spas take outside bookings and some fitness centres sell day passes. Confirm directly with the venue, as access varies by resort.",
      },
    ],
  },
];

export function getJimbaranGuide(slug: string | null | undefined): JimbaranGuide | null {
  if (!slug) return null;
  return JIMBARAN_GUIDES.find((g) => g.slug === slug) ?? null;
}
