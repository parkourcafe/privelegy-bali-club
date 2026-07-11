import type { Slot, VenueCategory, Venue } from "./types";

// Day scenarios ("moments") — STATIC config, buttons → predefined filters.
// This is the deterministic "Moment Builder" master §6 allows: no AI, no
// chatbot (guardrail #2), no Scenario DB entity (guardrail #11). A moment is
// just a saved combination of slots / categories / jobs the tourist can tap.
//
// Matching is forgiving by design: `jobs` narrows only when the venue has
// jobs data; venues without JTBD content still match via category, so the
// guide works before the field pass fills the new columns.

export type Moment = {
  slug: string;
  label: string;
  tagline: string;
  slots?: Slot[];
  categories?: VenueCategory[];
  jobs?: string[];
};

export const MOMENTS: Moment[] = [
  {
    slug: "slow-morning",
    label: "Slow morning",
    tagline: "Good coffee, no rush.",
    slots: ["morning"],
    categories: ["cafe", "warung"],
    jobs: ["slow", "breakfast"],
  },
  {
    slug: "work-session",
    label: "Work session",
    tagline: "Wifi, sockets, long sits welcome.",
    slots: ["morning", "day"],
    categories: ["cafe"],
    jobs: ["work"],
  },
  {
    slug: "midday-reset",
    label: "Midday reset",
    tagline: "Honest lunch, surf, or a reset.",
    slots: ["day"],
    categories: ["warung", "restaurant", "surf", "spa"],
    jobs: ["lunch", "reset"],
  },
  {
    slug: "golden-hour",
    label: "Golden hour",
    tagline: "The view, the drink, the sun going down.",
    slots: ["sunset"],
    categories: ["beach_club", "bar"],
    jobs: ["sunset"],
  },
  {
    slug: "late-dinner",
    label: "Late dinner",
    tagline: "A real table after dark.",
    slots: ["evening"],
    categories: ["restaurant", "bar"],
    jobs: ["date", "dinner"],
  },
  {
    slug: "family-day",
    label: "Family day",
    tagline: "Easy with kids in tow.",
    slots: ["morning", "day"],
    categories: ["cafe", "restaurant", "beach_club"],
    jobs: ["family"],
  },
];

export function getMoment(slug: string | undefined | null): Moment | null {
  if (!slug) return null;
  return MOMENTS.find((m) => m.slug === slug) ?? null;
}

// A venue fits a moment if its jobs intersect the moment's jobs; venues
// without jobs data fall back to the category gate. Category gate applies
// only when the moment declares categories.
export function venueFitsMoment(v: Venue, m: Moment): boolean {
  if (m.jobs && v.jobs && v.jobs.length > 0) {
    if (v.jobs.some((j) => m.jobs!.includes(j))) return true;
  }
  if (m.categories) return m.categories.includes(v.category);
  return true;
}
