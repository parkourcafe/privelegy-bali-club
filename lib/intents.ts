// Intent taxonomy for the /bali/[district]/[intent] SEO spokes. Each intent
// maps a canonical `jobs` slug (stored on venues) to a stable URL slug and the
// human framing for "Best {label} in {District}". Query shapes come from
// docs/seo-strategy.md §1 — real Bali long-tail, no invented search volumes.

export interface IntentDef {
  urlSlug: string; // stable URL segment, e.g. "date-night"
  jobSlug: string; // canonical snake_case jobs value on venues
  label: string; // reads in "Best {label} in {District}"
  short: string; // short chip label for the hub intent nav
  noun: string; // lower-case plural for prose ("date-night restaurants")
  blurb: string; // one factual clause describing the moment
}

// Order = display order of the intent nav on a hub. `just_landed_easy_dinner`
// is intentionally excluded (weak query — seo-strategy §1).
export const INTENTS: IntentDef[] = [
  {
    urlSlug: "brunch",
    jobSlug: "brunch_after_surf",
    label: "Brunch",
    short: "Brunch",
    noun: "brunch spots",
    blurb: "breakfast and post-surf brunch",
  },
  {
    urlSlug: "date-night",
    jobSlug: "date_night_special",
    label: "Date-Night Restaurants",
    short: "Date night",
    noun: "date-night restaurants",
    blurb: "a romantic dinner for two",
  },
  {
    urlSlug: "sunset",
    jobSlug: "sunset_drinks_view",
    label: "Sunset Spots",
    short: "Sunset",
    noun: "sunset spots",
    blurb: "sunset drinks and dinner with a view",
  },
  {
    urlSlug: "family",
    jobSlug: "family_early_dinner",
    label: "Family Restaurants",
    short: "Family",
    noun: "family restaurants",
    blurb: "an early, kid-friendly dinner",
  },
  {
    urlSlug: "groups",
    jobSlug: "group_dinner_share",
    label: "Group Restaurants",
    short: "Groups",
    noun: "group restaurants",
    blurb: "a big table and dishes to share",
  },
  {
    urlSlug: "special-occasion",
    jobSlug: "special_occasion",
    label: "Special-Occasion Restaurants",
    short: "Special occasion",
    noun: "special-occasion restaurants",
    blurb: "a celebration or a standout meal",
  },
  {
    urlSlug: "work-cafe",
    jobSlug: "quiet_work_cafe",
    label: "Work-Friendly Cafés",
    short: "Work cafés",
    noun: "work-friendly cafés",
    blurb: "wifi, a good coffee and room for a laptop",
  },
  {
    urlSlug: "local-food",
    jobSlug: "local_food_calm",
    label: "Local Food",
    short: "Local food",
    noun: "local food and warungs",
    blurb: "calm, authentic local food",
  },
];

export const INTENT_BY_URL = new Map(INTENTS.map((i) => [i.urlSlug, i] as const));

// Normalize a stored jobs array to canonical snake_case (prod may still carry
// kebab-case until migration 0017 is applied — match both).
export function normalizeJobs(jobs?: string[] | null): string[] {
  return (jobs ?? []).map((j) => j.replace(/-/g, "_"));
}
