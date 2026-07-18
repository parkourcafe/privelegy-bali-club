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

// Partner tiers — relationship stage only (all unpaid). Money model v0.3
// (docs/money-model.md): tiers are NOT paid products and never will be —
// revenue is a fixed fee per confirmed seated reservation via TablePilot.
// Organic vs Sponsored is a separate axis, never conflated with tier.
export type VenueTier = "editorial_seed" | "launch" | "founding";

export type VenueCategory =
  | "cafe"
  | "warung"
  | "restaurant"
  | "beach_club"
  | "fitness"
  | "yoga"
  | "spa"
  | "beauty"
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
  officialUrl?: string; // venue's own website — used for schema sameAs (entity signal)
  instagramUrl?: string; // official IG — used for schema sameAs
  tier: VenueTier;
  status?: string;
  isSponsored: boolean; // organic (false) vs labeled sponsored display (true); NOT a paid listing product under money model v0.3
  // Field Kit §2/§3 card content — all optional, filled from venue visits.
  vibeTags?: string[];
  priceAnchor?: string; // e.g. "Americano 35k · Bintang 40k"
  whatToOrder?: string; // consensus-checked bestseller(s)
  photoUrl?: string;
  whatsapp?: string; // digits only, intl format
  tablepilotSlug?: string; // if set, venue is bookable via TablePilot (money model v0.3)
  // Sub-area inside the district (Berawa / Batu Bolong / Echo Beach / …).
  // Display + filter only — coverage/monetization still keys off `district`.
  area?: string;
  // JTBD content layer (master §6): fit context = WHO/WHEN a place suits.
  // `notFor` is fit language only, never a quality warning (guardrail #7).
  whyItsHere?: string;
  bestFor?: string;
  notFor?: string;
  practicalTags?: string[]; // e.g. "fast wifi", "sockets", "kids ok"
  jobs?: string[]; // JTBD tags driving static moments (work, date, family, …)
  // Owner's own words (UGC, self-service onboarding). Always shown attributed
  // ("From the owner") — never blended into the editorial voice.
  ownerNote?: string;
  publicationStatus?: "published" | "review";
  wellnessCategories?: VenueCategory[];
  // Evidence freshness for sitemap lastmod. This is the existing
  // venues.last_verified_at value, not a synthetic build/deploy timestamp.
  lastVerifiedAt?: string;
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

// Curated routes (§8): an ordered sequence of venues through a day/theme.
export interface RouteStopDef {
  venueSlug: string;
  note?: string;
}
export interface RouteDef {
  slug: string;
  title: string;
  subtitle?: string;
  rank: number;
  stops: RouteStopDef[];
}

export interface RedemptionResult {
  ok: boolean;
  confirmCode?: string;
  venueName?: string;
  perkTitle?: string;
  ts?: string;
  externallyAttributed?: boolean;
  error?: string;
}

// Reach / Intent / Proof — the partner report shape (§11). Aggregate only.
export interface PartnerReport {
  venueCardOpens: number;
  perkOpens: number;
  redemptions: number;
  externallyAttributed: number; // brought by us (had an external source before the visit)
  inVenue: number; // redeemed but no external source — engagement, not acquisition
  creator: number; // creator-perk redemptions — excluded from partner-proof (§21a#1)
}

// Partner report §11 "Notes": source-type breakdown + repeat visits.
export interface PartnerNotes {
  bySource: Record<string, number>; // villa / coliving / reels / direct / in_venue / creator
  repeat: number; // guests who redeemed here more than once
}

// A guest's own redeemed offer (for "My offers").
export interface MyRedemption {
  venueName: string;
  venueSlug: string;
  perkTitle: string;
  confirmCode: string;
  ts: string;
}

// Phase 0 operator dashboard (§22 go/no-go).
export interface Phase0VenueStat {
  slug: string;
  name: string;
  directionClicks: number;
  reservationClicks: number;
  perkOpens: number;
  redemptions: number;
  externallyAttributed: number;
  inVenue: number;
  creator: number;
}
export interface Phase0Overview {
  funnel: {
    sourceScan: number;
    landingOpen: number;
    venueCardOpen: number;
    perkOpen: number;
    directionClick: number;
    reservationClick: number;
    similarOpen: number;
    redemption: number;
  };
  venues: Phase0VenueStat[];
}

// Additive public data-contract aliases. The canonical definitions live in
// lib/contracts/menu-action.ts so all four loop sessions share one boundary.
export type {
  MenuRecord,
  MenuSectionRecord,
  MenuItemRecord,
  VenueActionCapabilityRecord,
  PublicVenueDetailExtension,
  SafeActionEventPayload,
} from "./contracts/menu-action";
