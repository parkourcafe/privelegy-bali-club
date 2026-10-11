// Sanur SEO child guides (venue layer, master §6a.3). Editorial "best of"
// (guardrail #6), organised by category from real DB editorial data — nothing
// invented (§4). Sanur is planning_only and sunrise-facing: no money loop, no
// sunset framing. These sit alongside the pillar's hotels + things-to-do guides.

import type { VenueWithPerk } from "@/lib/data";

export type SanurGuide = {
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

export const SANUR_GUIDES: SanurGuide[] = [
  {
    slug: "best-restaurants",
    h1: "Best restaurants in Sanur",
    metaTitle: "Best restaurants in Sanur — resident-curated, honest picks",
    metaDescription:
      "Where to eat in Sanur: the beachfront tables, long-running institutions and local warungs worth your time on Bali's calm east coast. Resident-curated.",
    lede: "Sanur's dining leans calm and dependable: beachfront classics, a few destination kitchens and local warungs. These are the tables we send people to.",
    base: (v) => v.category === "restaurant" || v.category === "warung",
    sectionHeading: "Where to eat in Sanur",
    sectionNote: "Picks from beachfront dining to local warungs. Most are walk-in, but the popular rooms fill on weekends.",
    faq: [
      { q: "Where's the classic local meal in Sanur?", a: "The long-running beachfront warungs on Jl. Hang Tuah, for fresh fish soup and grilled seafood. These are the local institutions people come back for." },
      { q: "Is Sanur good for a calm dinner?", a: "Yes. Evenings are mild and low-key. It's a place for an easy beachfront dinner rather than a party; nightlife lives on the west coast." },
    ],
  },
  {
    slug: "cafes-and-bars",
    h1: "Best cafés & bars in Sanur",
    metaTitle: "Best cafés & bars in Sanur — coffee, brunch and easy drinks",
    metaDescription:
      "Sanur cafés and low-key bars: specialty coffee and brunch for a slow morning, and relaxed beachfront spots for an easy evening drink. Resident-curated.",
    lede: "Sanur mornings are made for coffee by the beach path, and its bars are the easy, low-key kind. These are our picks for both.",
    base: (v) => v.category === "cafe" || v.category === "bar",
    sectionHeading: "Coffee, brunch & easy drinks",
    sectionNote: "Specialty coffee and brunch for the morning, plus the relaxed beachside bars for a drink. This is a calm coast, not a party strip.",
    faq: [
      { q: "Does Sanur have good coffee?", a: "Yes. There's a small but good set of specialty cafés along and just off the beach path, good for a slow brunch or a work morning." },
    ],
  },
  {
    slug: "spas-wellness",
    h1: "Best spas & wellness in Sanur",
    metaTitle: "Best spas & wellness in Sanur — massage, yoga & salons",
    metaDescription:
      "Where to reset in Sanur: beachfront resort spas, boutique massage, yoga shalas and salons on Bali's calm east coast. Resident-curated, and we say what each is for.",
    lede: "Sanur's calm suits a reset: beachfront resort spas, garden massage, bamboo yoga shalas and salons. Choose by what you want, then book.",
    base: (v) => v.category === "spa" || v.category === "yoga" || v.category === "beauty",
    sectionHeading: "Spas, yoga & salons",
    sectionNote: "Resort and boutique spas and yoga studios, plus salons. We say which is a beachfront treatment, a drop-in class or a salon visit.",
    faq: [
      { q: "Is Sanur good for yoga and wellness?", a: "It's quietly strong. Beachfront bamboo shalas and resort wellness programmes suit a calm morning practice, without the intensity of the Ubud or Canggu scenes." },
      { q: "Should I book Sanur spas ahead?", a: "Yes, for the resort spas and evenings. Reserve a day ahead. Smaller garden spots often take walk-ins earlier in the day." },
    ],
  },
];

export function getSanurGuide(slug: string | null | undefined): SanurGuide | null {
  if (!slug) return null;
  return SANUR_GUIDES.find((g) => g.slug === slug) ?? null;
}
