// Seminyak SEO child guides (master §6a.3, brief §13). Editorial "best of"
// (guardrail #6), organised by category from real DB editorial data — nothing
// invented (§4). Seminyak is planning_only, so cards carry no money loop.

import type { VenueWithPerk } from "@/lib/data";

export type SeminyakGuide = {
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

export const SEMINYAK_GUIDES: SeminyakGuide[] = [
  {
    slug: "best-restaurants",
    h1: "Best restaurants in Seminyak",
    metaTitle: "Best restaurants in Seminyak — resident-curated dinner picks",
    metaDescription:
      "Where to eat in Seminyak: the Eat Street rooms and neighbourhood kitchens we actually rate, from date-night fine dining to shared-table feasts and local warungs.",
    lede: "Seminyak is Bali's original dining strip, with polished rooms on Eat Street, big-flavour sharing joints and local warungs. These are the tables we send people to.",
    base: (v) => v.category === "restaurant" || v.category === "warung",
    sectionHeading: "Where to eat in Seminyak",
    sectionNote: "Picks across fine dining, sharing tables and local warungs. Book the popular rooms ahead in high season.",
    faq: [
      { q: "Where's the main restaurant strip in Seminyak?", a: "Jl. Kayu Aya ('Eat Street') is the dense core, with more spread along Petitenget and out toward Batu Belig and Umalas." },
      { q: "Do Seminyak restaurants take reservations?", a: "The popular dinner rooms fill on weekends and in high season, so reserve a day or two ahead. Warungs and casual spots are walk-in." },
    ],
  },
  {
    slug: "beach-clubs-sunset",
    h1: "Seminyak beach clubs & sunset",
    metaTitle: "Seminyak beach clubs & sunset — where to be for golden hour",
    metaDescription:
      "Seminyak's beachfront and rooftop sunset spots compared: beach clubs and sundowner bars on the sand, and whether to reserve. Resident-curated.",
    lede: "Seminyak invented Bali's sunset-on-the-sand scene. These are the beach clubs and sundowner spots worth timing your evening around.",
    base: (v) => v.category === "beach_club" || v.category === "bar",
    sectionHeading: "Sunset drinks & beach clubs",
    sectionNote: "Be there before golden hour. Daybeds and weekend sunsets book out, so reserve where you can.",
    faq: [
      { q: "Do Seminyak beach clubs need a booking?", a: "For daybeds and weekend sunsets, yes. Reserve ahead. Bar seating and standing areas are usually walk-in earlier in the day." },
      { q: "When is sunset in Seminyak?", a: "Roughly 6–6.30pm year-round. Arrive an hour early on weekends to get a good spot before the crowd." },
    ],
  },
  {
    slug: "cafes-coffee",
    h1: "Best cafés & coffee in Seminyak",
    metaTitle: "Best cafés & coffee in Seminyak — brunch, specialty coffee, work",
    metaDescription:
      "Seminyak cafés worth a morning: specialty coffee, all-day brunch and the spots that hold up for a work session. Resident-curated, and we say which is which.",
    lede: "Seminyak runs on good coffee and long brunches. These are the cafés we rate for the espresso and the brunch, plus the ones you can work from.",
    base: (v) => v.category === "cafe",
    sectionHeading: "Coffee & café mornings",
    sectionNote: "Specialty coffee and all-day brunch. Some are better for a laptop, some just for a slow start.",
    faq: [
      { q: "Where's the best coffee in Seminyak?", a: "At the specialty roasters and espresso bars we tag here. Look for house-roasted beans and a real brew bar rather than a hotel breakfast counter." },
    ],
  },
  {
    slug: "spas-salons-wellness",
    h1: "Best spas, salons & wellness in Seminyak",
    metaTitle: "Best spas & salons in Seminyak — massage, beauty, yoga & fitness",
    metaDescription:
      "Seminyak is Bali's spa-and-salon capital: where to book a massage, a hair or nail appointment, or a yoga and fitness class. Resident-curated, and we say what each is for.",
    lede: "Seminyak is where Bali comes to be looked after: heritage massage houses, design-forward day spas, salons and studios. Choose by what you want, then book.",
    base: (v) => v.category === "spa" || v.category === "beauty" || v.category === "fitness" || v.category === "yoga",
    sectionHeading: "Spas, salons, yoga & fitness",
    sectionNote: "Massage and spa rituals, hair and beauty salons, and yoga/fitness studios. We say which is a treatment, a salon day or a class.",
    faq: [
      { q: "Is Seminyak good for spas?", a: "Yes. It's arguably Bali's densest spa-and-salon scene, from heritage massage houses to full day spas and Western-standard hair salons. Most of it is walkable in the central strips." },
      { q: "Should I book Seminyak spas and salons ahead?", a: "Yes, for evenings, weekends and the well-known names. Reserve a day ahead. Quieter neighbourhood spots often take walk-ins earlier in the day." },
    ],
  },
];

export function getSeminyakGuide(slug: string | null | undefined): SeminyakGuide | null {
  if (!slug) return null;
  return SEMINYAK_GUIDES.find((g) => g.slug === slug) ?? null;
}
