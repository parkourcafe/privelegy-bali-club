import type { Slot, VenueCategory, Venue } from "./types";

// Day scenarios ("moments") — STATIC config, buttons → predefined filters.
// This is the deterministic "Moment Builder" master §6 allows: no AI, no
// chatbot (guardrail #2), no Scenario DB entity (guardrail #11). A moment is
// just a saved combination of slots / categories / jobs the tourist can tap.
//
// Matching is forgiving by design: `jobs` narrows only when the venue has
// jobs data; venues without JTBD content still match via category, so the
// guide works before the field pass fills the new columns.
//
// `evidence` tracks whether the moment is confirmed by research/field or is
// still a working hypothesis (docs/research/jtbd-venue-decisions-2026-07.md).
// Display-neutral — for our own prioritisation, not shown to tourists.

export type Moment = {
  slug: string;
  label: string;
  tagline: string;
  slots?: Slot[];
  categories?: VenueCategory[];
  jobs?: string[];
  evidence: "verified" | "hypothesis";
};

export const MOMENTS: Moment[] = [
  {
    slug: "slow-morning",
    label: "Slow morning",
    tagline: "Good coffee, no rush.",
    slots: ["morning"],
    categories: ["cafe", "warung"],
    jobs: ["slow", "breakfast"],
    evidence: "hypothesis",
  },
  {
    // Verified job (JTBD research §3): criteria = coffee/noise/wifi/seating/
    // plugs/free-to-sit; failure mode = time-of-day crowding ("too distracting
    // from 9am"). Tagline carries the verified time cue.
    slug: "work-session",
    label: "Work session",
    tagline: "Fast wifi, sockets, quiet before 9am.",
    slots: ["morning", "day"],
    categories: ["cafe"],
    jobs: ["work"],
    evidence: "verified",
  },
  {
    slug: "midday-reset",
    label: "Midday reset",
    tagline: "Honest lunch, surf, or a reset.",
    slots: ["day"],
    categories: ["warung", "restaurant", "surf", "spa"],
    jobs: ["lunch", "reset"],
    evidence: "hypothesis",
  },
  {
    slug: "golden-hour",
    label: "Golden hour",
    tagline: "The view, the drink, the sun going down.",
    slots: ["sunset"],
    categories: ["beach_club", "bar"],
    jobs: ["sunset"],
    evidence: "hypothesis",
  },
  {
    // Split from the old "late-dinner": casual after-dark table.
    slug: "late-dinner",
    label: "Late dinner",
    tagline: "A real table after dark.",
    slots: ["evening"],
    categories: ["restaurant", "bar"],
    jobs: ["dinner"],
    evidence: "hypothesis",
  },
  {
    // Verified job (JTBD research §3): couples plan a special-occasion dinner
    // in advance, framed in romance markers, with a price anchor considered
    // before booking. Distinct from casual late dinner.
    slug: "special-occasion",
    label: "Special occasion",
    tagline: "Book ahead. A dinner worth dressing up for.",
    slots: ["evening"],
    categories: ["restaurant"],
    jobs: ["date", "special"],
    evidence: "verified",
  },
  {
    slug: "family-day",
    label: "Family day",
    tagline: "Easy with kids in tow.",
    slots: ["morning", "day"],
    categories: ["cafe", "restaurant", "beach_club"],
    jobs: ["family"],
    evidence: "hypothesis",
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
