export type HomeSectionId =
  | "home_hero"
  | "home_moments"
  | "home_plan"
  | "home_picks"
  | "home_categories"
  | "home_trust_save";

export type HomeItemKind = "scenario" | "area" | "plan" | "category" | "cta";

export interface HomeLinkItem {
  id: string;
  label: string;
  body?: string;
  href: string;
  sectionId: HomeSectionId;
  kind: HomeItemKind;
  required: boolean;
}

export const HOME_HERO = {
  eyebrow: "Curated across Bali",
  h1: "The right Bali for the moment you’re in.",
  body: "Find places, routes and practical plans for your day or trip — with clear guidance, not endless lists.",
  primaryCta: { id: "hero_now", label: "Choose what to do", href: "#moments" },
  secondaryCta: { id: "hero_plan", label: "Plan my trip", href: "/plan" },
} as const;

export const HOME_MOMENTS: HomeLinkItem[] = [
  { id: "eat_special", label: "Eat somewhere special", body: "Date night, celebration or one meal you want to remember.", href: "/best-restaurants-in-bali", sectionId: "home_moments", kind: "scenario", required: true },
  { id: "sunset", label: "Watch the sunset", body: "Pick the right coast, view and setting before golden hour.", href: "/where-to-watch-sunset-in-bali", sectionId: "home_moments", kind: "scenario", required: true },
  { id: "rainy_day", label: "Make the most of a rainy day", body: "Useful indoor and low-friction plans when the weather turns.", href: "/bali-rainy-day", sectionId: "home_moments", kind: "scenario", required: true },
  { id: "romantic", label: "Plan a romantic evening", body: "Places and routes that make sense for two.", href: "/romantic-bali", sectionId: "home_moments", kind: "scenario", required: true },
  { id: "with_kids", label: "Explore Bali with kids", body: "Lower-friction family choices and easier areas.", href: "/bali-with-kids", sectionId: "home_moments", kind: "scenario", required: true },
  { id: "temple_day", label: "Plan a temple day", body: "Choose a temple route with practical context, not a rushed checklist.", href: "/bali-temples-which-one", sectionId: "home_moments", kind: "scenario", required: true },
  { id: "day_trip", label: "Take a day trip", body: "A practical way to spend a day beyond your base.", href: "/bali-day-trips", sectionId: "home_moments", kind: "scenario", required: true },
  { id: "beaches", label: "Explore Bali beaches", body: "Beach and pool ideas without claiming live conditions.", href: "/best-beach-clubs-in-bali", sectionId: "home_moments", kind: "scenario", required: true },
];

export const HOME_AREAS: HomeLinkItem[] = [
  { id: "ubud", label: "Ubud", body: "Culture, nature and slower days", href: "/ubud", sectionId: "home_plan", kind: "area", required: true },
  { id: "canggu", label: "Canggu", body: "Cafés, social energy and sunsets", href: "/canggu", sectionId: "home_plan", kind: "area", required: true },
  { id: "sanur", label: "Sanur", body: "Calm beach days and an easy pace", href: "/sanur", sectionId: "home_plan", kind: "area", required: true },
  { id: "uluwatu", label: "Uluwatu", body: "Cliffs, surf and dramatic views", href: "/uluwatu-sunset-kecak", sectionId: "home_plan", kind: "area", required: true },
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
  { id: "restaurants", label: "Restaurants", href: "/best-restaurants-in-bali", sectionId: "home_categories", kind: "category", required: true },
  { id: "warungs", label: "Warungs", href: "/best-warungs-in-bali", sectionId: "home_categories", kind: "category", required: true },
  { id: "beach_clubs", label: "Beach clubs", href: "/best-beach-clubs-in-bali", sectionId: "home_categories", kind: "category", required: true },
  { id: "hotel_day_passes", label: "Hotel day passes", href: "/bali-resort-day-passes", sectionId: "home_categories", kind: "category", required: true },
  { id: "spa_wellness", label: "Spa & wellness", href: "/best-spas-in-bali", sectionId: "home_categories", kind: "category", required: true },
  { id: "hotel_restaurants", label: "Hotel restaurants", href: "/hotel-restaurants", sectionId: "home_categories", kind: "category", required: false },
  { id: "activities", label: "Activities", href: "/things-to-do-in-bali", sectionId: "home_categories", kind: "category", required: true },
  { id: "tours_day_trips", label: "Tours & day trips", href: "/bali-day-trips", sectionId: "home_categories", kind: "category", required: true },
  { id: "beaches", label: "Beaches", href: "/best-beach-clubs-in-bali", sectionId: "home_categories", kind: "category", required: true },
  { id: "temples_culture", label: "Temples & culture", href: "/bali-temples-which-one", sectionId: "home_categories", kind: "category", required: true },
];

export const HOME_TRUST_PRINCIPLES = [
  "Selected, not exhaustive",
  "Editorial ranking is not for sale",
  "Information is reviewed and date-stamped",
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
