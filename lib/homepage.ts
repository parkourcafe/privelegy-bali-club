export type HomeSectionId =
  | "home_hero"
  | "home_moments"
  | "home_plan"
  | "home_picks"
  | "home_categories"
  | "home_canggu"
  | "home_trust_save";

export type HomeItemKind = "scenario" | "area" | "plan" | "category" | "cta";

export interface HomeLinkItem {
  id: string;
  label: string;
  body?: string;
  ctaLabel?: string;
  href: string;
  sectionId: HomeSectionId;
  kind: HomeItemKind;
  required: boolean;
}

export const HOME_HERO = {
  eyebrow: "Curated across Bali",
  h1: "The right Bali for the moment you’re in.",
  body: "Find places, routes and practical plans for your day or trip — with clear guidance, not endless lists.",
  primaryCta: { id: "hero_now", label: "Find a place now", href: "/my-day" },
  secondaryCta: { id: "hero_plan", label: "Plan my trip", href: "/plan" },
} as const;

export const HOME_MOMENTS: HomeLinkItem[] = [
  { id: "first_day", label: "First day in Bali", body: "Land, settle in and make the day easy.", ctaLabel: "Open the first-day guide", href: "/first-time-in-bali", sectionId: "home_moments", kind: "scenario", required: true },
  { id: "sunset", label: "Sunset", body: "Choose the right coast, view and setting before golden hour.", ctaLabel: "Open the sunset guide", href: "/where-to-watch-sunset-in-bali", sectionId: "home_moments", kind: "scenario", required: true },
  { id: "with_kids", label: "With kids", body: "Lower-friction family choices and easier areas.", ctaLabel: "Open the family guide", href: "/bali-with-kids", sectionId: "home_moments", kind: "scenario", required: true },
  { id: "rainy_day", label: "Rainy day", body: "Useful indoor and low-friction plans when the weather turns.", ctaLabel: "Open the rainy-day guide", href: "/bali-rainy-day", sectionId: "home_moments", kind: "scenario", required: true },
  { id: "romantic", label: "Romantic", body: "Places and routes that make sense for two.", ctaLabel: "Open the romantic guide", href: "/romantic-bali", sectionId: "home_moments", kind: "scenario", required: true },
  { id: "trip_lengths", label: "Plan 3 / 5 / 7 days", body: "Start from the length of your trip and choose the right route.", ctaLabel: "Open trip plans", href: "/plan", sectionId: "home_moments", kind: "scenario", required: true },
];

export const HOME_AREAS: HomeLinkItem[] = [
  { id: "ubud", label: "Ubud", body: "Culture, nature and slower days", href: "/ubud", sectionId: "home_plan", kind: "area", required: true },
  { id: "canggu", label: "Canggu", body: "Cafés, social energy and sunsets", href: "/canggu", sectionId: "home_plan", kind: "area", required: true },
  { id: "sanur", label: "Sanur", body: "Calm beach days and an easy pace", href: "/sanur", sectionId: "home_plan", kind: "area", required: true },
  { id: "uluwatu", label: "Uluwatu", body: "Cliffs, surf and dramatic views", href: "/uluwatu", sectionId: "home_plan", kind: "area", required: true },
  { id: "seminyak", label: "Seminyak", body: "Dining, shopping and late nights", href: "/seminyak", sectionId: "home_plan", kind: "area", required: true },
  { id: "nusa_dua", label: "Nusa Dua", body: "Resorts and easy beach time", href: "/nusa-dua", sectionId: "home_plan", kind: "area", required: true },
];

export const HOME_PLANS: HomeLinkItem[] = [
  { id: "first_trip", label: "Your first trip to Bali", body: "A practical starting point if this is your first visit.", href: "/first-time-in-bali", sectionId: "home_plan", kind: "plan", required: true },
  { id: "bali_3_days", label: "Bali in 3 days", body: "A short trip without trying to see everything.", href: "/bali-itinerary-3-days", sectionId: "home_plan", kind: "plan", required: true },
  { id: "bali_5_days", label: "Bali in 5 days", body: "Enough structure to choose bases and avoid wasted driving.", href: "/bali-itinerary-5-days", sectionId: "home_plan", kind: "plan", required: true },
  { id: "without_scooter", label: "Bali without a scooter", body: "Plan around taxis, walking areas and lower-friction days.", href: "/canggu-without-a-scooter", sectionId: "home_plan", kind: "plan", required: true },
  { id: "with_kids_plan", label: "Bali with kids", body: "Family-friendly areas, timing and easier choices.", href: "/bali-with-kids", sectionId: "home_plan", kind: "plan", required: true },
];

export const HOME_CATEGORIES: HomeLinkItem[] = [
  { id: "eat_drink", label: "Eat & Drink", body: "Restaurants, warungs, cafés and hotel dining.", href: "/best-restaurants-in-bali", sectionId: "home_categories", kind: "category", required: true },
  { id: "beach_pool", label: "Beach & Pool", body: "Beach clubs, resort pools and day passes.", href: "/best-beach-clubs-in-bali", sectionId: "home_categories", kind: "category", required: true },
  { id: "wellness", label: "Wellness", body: "Spas, massage and slower reset days.", href: "/best-spas-in-bali", sectionId: "home_categories", kind: "category", required: true },
  { id: "things_to_do", label: "Things to Do", body: "Activities, temples, routes and day trips.", href: "/things-to-do-in-bali", sectionId: "home_categories", kind: "category", required: true },
];

export const HOME_TRUST_PRINCIPLES = [
  "Selected, not exhaustive",
  "No sponsored homepage ranking",
  "Clear routes to the next step",
] as const;

export const HOME_REQUIRED_LINKS = [
  ...HOME_MOMENTS,
  ...HOME_AREAS,
  ...HOME_PLANS,
  ...HOME_CATEGORIES,
].filter((item) => item.required);

export function allHomeLinks(): HomeLinkItem[] {
  return [
    ...HOME_MOMENTS,
    ...HOME_AREAS,
    ...HOME_PLANS,
    ...HOME_CATEGORIES,
  ];
}
