// Trip Missions + trip duration — STATIC config (master §6a). One level above
// `lib/moments.ts`: a Moment is an intra-day slot scenario; a Trip Mission is a
// trip-level intent ("First time", "Workation month", "Retreat"…). Like moments
// this is buttons -> predefined content, NOT a chatbot / AI itinerary planner
// (guardrail #2), and NOT a DB entity (guardrail #11). Each mission is just a
// saved brief the tourist can tap: some tags, an optional category/district
// lean, and a future scenario ContentPage slug (built in §6a.7 step 4).
//
// Matching stays forgiving: these feed the same q/category/district brief the
// day builder already produces, so missions work on today's venue data and get
// sharper as the additive trip-fit fields (§6a.4) land.

export type TripMission = {
  slug: string;
  label: string;
  hint: string;
  query: string[]; // brief tags folded into the /places search brief
  category?: string; // optional category lean
  district?: string; // optional base district (explicit builder choice wins)
  scenarioSlug?: string; // future ContentPage (type: scenario), §6a.3 — not built yet
};

export const TRIP_MISSIONS: TripMission[] = [
  {
    slug: "first-time",
    label: "First time",
    hint: "Don't mess up day one",
    query: ["easy", "view", "sunset", "walk-in-friendly"],
    scenarioSlug: "first-time-in-bali",
  },
  {
    slug: "workation",
    label: "Work from Bali",
    hint: "Routine for a few weeks",
    query: ["work-friendly", "quiet", "wifi", "cafe"],
    category: "cafe",
    scenarioSlug: "bali-for-a-month",
  },
  {
    slug: "retreat",
    label: "Retreat / reset",
    hint: "Yoga, spa, softer pace",
    query: ["reset", "wellness", "quiet", "spa"],
    category: "spa",
    scenarioSlug: "bali-retreat-reset",
  },
  {
    slug: "romantic",
    label: "Romantic",
    hint: "Date energy, not a party",
    query: ["romantic", "date", "sunset", "view"],
    category: "restaurant",
    scenarioSlug: "romantic-bali",
  },
  {
    slug: "slow-living",
    label: "Slow living",
    hint: "Live it like a local month",
    query: ["slow", "local", "cafe", "quiet"],
    scenarioSlug: "slow-living-bali",
  },
  {
    slug: "family",
    label: "Family easy",
    hint: "Comfortable with kids",
    query: ["family", "kid-friendly", "easy"],
    scenarioSlug: "family-bali",
  },
  {
    slug: "night-out",
    label: "Night out",
    hint: "Friends, energy, evening",
    query: ["lively", "group", "dinner", "cocktail"],
    category: "bar",
    scenarioSlug: "bali-night-out",
  },
  {
    slug: "rainy-day",
    label: "Rainy-day backup",
    hint: "When the sky opens",
    query: ["indoor", "cafe", "spa", "reset"],
    scenarioSlug: "bali-rainy-day",
  },
];

export type TripDuration = {
  slug: string;
  label: string;
  hint: string;
  query?: string[]; // light lean — nudges, never dominates the brief
};

// Duration is a first-class axis (§6a.2). For a day it's "today"; longer trips
// lean toward routine-friendly places. Multi-day *rhythms* live in scenario
// ContentPages later — this config only carries the selectable axis + a nudge.
export const TRIP_DURATIONS: TripDuration[] = [
  { slug: "today", label: "Today", hint: "Just this one day" },
  { slug: "weekend", label: "A weekend", hint: "Two or three days" },
  { slug: "first-3", label: "First 3 days", hint: "Landing week" },
  { slug: "week", label: "A 7-day plan", hint: "A full week" },
  {
    slug: "month",
    label: "A month",
    hint: "Build a routine",
    query: ["work-friendly", "local"],
  },
  {
    slug: "living",
    label: "Living here",
    hint: "Like a resident",
    query: ["local", "work-friendly"],
  },
];

export function getTripMission(slug: string | null | undefined): TripMission | null {
  if (!slug) return null;
  return TRIP_MISSIONS.find((m) => m.slug === slug) ?? null;
}

export function getTripDuration(slug: string | null | undefined): TripDuration | null {
  if (!slug) return null;
  return TRIP_DURATIONS.find((d) => d.slug === slug) ?? null;
}
