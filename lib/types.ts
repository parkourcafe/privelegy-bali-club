// Core domain types — kept deliberately small (thin G0→G1 MVP).
// The taxonomy here mirrors the two-layer thesis: districts (Bali-wide
// planning, free) vs the single active deep district (Canggu) where
// perks + QR redemption live.

export type Slot = "morning" | "day" | "sunset" | "evening";

export const SLOTS: { key: Slot; label: string; hint: string }[] = [
  { key: "morning", label: "Morning", hint: "Coffee, brunch, beach walk" },
  { key: "day", label: "Day", hint: "Work, surf, pool, lunch" },
  { key: "sunset", label: "Sunset", hint: "Beach club, golden hour" },
  { key: "evening", label: "Evening", hint: "Dinner, drinks, live music" },
];

// Partner tiers — Editorial Seed / Launch / Founding come first (unpaid,
// proof-building), paid tiers only after redemption proof. Organic vs
// Sponsored is a separate axis, never conflated with tier.
export type VenueTier =
  | "editorial_seed"
  | "launch"
  | "founding"
  | "basic"
  | "featured";

export type VenueCategory =
  | "cafe"
  | "warung"
  | "restaurant"
  | "beach_club"
  | "spa"
  | "bar"
  | "surf";

export interface Venue {
  id: string;
  slug: string;
  name: string;
  category: VenueCategory;
  district: string; // district slug
  address: string;
  gmapsUrl: string;
  tier: VenueTier;
  isSponsored: boolean; // organic (false) vs sponsored (true)
}

export interface Perk {
  id: string;
  venueSlug: string;
  title: string;
  terms: string;
}

export interface PlanEntry {
  venueSlug: string;
  slot: Slot;
  rank: number;
  blurb: string; // opinionated one-liner — this is the "deep" curation
}

export interface RedemptionResult {
  ok: boolean;
  confirmCode?: string;
  venueName?: string;
  perkTitle?: string;
  ts?: string;
  error?: string;
}
