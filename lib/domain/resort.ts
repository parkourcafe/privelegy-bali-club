// Domain contracts for the resort vertical (IA spec v1 §7-8):
// HospitalityProperty → Venue(parent_property) → HospitalityOffer, plus the
// Experience contract for Phase 4. Pure types + policy constants — no IO.
//
// DB note: schema exists only as a DRAFT (docs/sql-drafts/resort_schema_draft.sql).
// Per README's migration-history warning nothing here may be applied to
// staging/production; the repository layer reads from imported JSON until the
// migration history is reconciled.

export type PropertyType = "hotel" | "resort";
export type OfferType = "day_pass" | "brunch" | "pool_day_use" | "spa_package";
export type PriceStatus = "verified" | "not_published" | "call_to_confirm" | "stale";
export type AvailabilityStatus =
  | "active"
  | "seasonal"
  | "call_to_confirm"
  | "unavailable"
  | "review";
export type MonetizationMode = "seated" | "coverage"; // internal only — never shown to tourists
export type PublicationStatus = "published" | "review";
export type SourceType =
  | "official"
  | "aggregator"
  | "booking_system"
  | "editorial_guide";

export interface HospitalityProperty {
  id: string;
  slug: string;
  name: string;
  propertyType: PropertyType;
  district: string;
  area?: string | null;
  starRating?: 4 | 5 | null;
  officialUrl?: string | null;
  instagramUrl?: string | null;
  googleMapsUrl?: string | null;
  status: "active" | "inactive" | "review";
  publicationStatus: PublicationStatus;
  lastVerifiedAt?: string | null;
}

export interface HospitalityOffer {
  id: string;
  slug: string;
  offerType: OfferType;
  name: string;
  propertyId?: string | null;
  venueSlug?: string | null;
  district: string;
  currency?: "IDR" | "USD" | null;
  priceMinor?: number | null;
  priceMinMinor?: number | null;
  priceMaxMinor?: number | null;
  priceText?: string | null;
  priceStatus: PriceStatus;
  whatsIncluded?: string | null;
  scheduleText?: string | null;
  hoursText?: string | null;
  openToNonGuests: boolean;
  bookingChannel?: string | null;
  bookingUrl?: string | null;
  audienceTags: string[];
  editorialNote?: string | null;
  sourceType?: SourceType | null;
  sourceUrl?: string | null;
  accessedAt?: string | null;
  priceVerifiedAt?: string | null;
  lastVerifiedAt?: string | null;
  availabilityStatus: AvailabilityStatus;
  monetizationMode: MonetizationMode;
  publicationStatus: PublicationStatus;
}

export interface ResortVenue {
  slug: string;
  name: string;
  category: "restaurant";
  district: string;
  parentPropertySlug: string;
  openToNonGuests: boolean | null; // null = not verified either way (never invented)
  sourceUrl?: string | null;
  accessedAt?: string | null;
  editorialNote?: string | null;
  publicationStatus: PublicationStatus;
}

export interface Experience {
  id: string;
  slug: string;
  title: string;
  experienceType: string;
  providerName: string;
  providerUrl?: string | null;
  district?: string | null;
  departureAreas: string[];
  durationText?: string | null;
  format: "private" | "group" | "both";
  priceText?: string | null;
  currency?: "IDR" | "USD" | null;
  whatsIncluded?: string | null;
  exclusions?: string | null;
  pickupText?: string | null;
  bookingChannel?: string | null;
  bookingUrl?: string | null;
  audienceTags: string[];
  editorialNote?: string | null;
  sourceUrl?: string | null;
  sourceType?: string | null;
  accessedAt?: string | null;
  lastVerifiedAt?: string | null;
  publicationStatus: PublicationStatus;
}

// §13.2 publication-gate thresholds — single config, no magic numbers in
// components.
export const HUB_GATES = {
  globalHub: { minEntries: 10, minDistricts: 3 },
  districtHub: { minEntries: 5 },
} as const;

// §12.7 freshness policy per product type (days until a verified price is
// treated as stale and must stop looking verified).
export const FRESHNESS_DAYS: Record<OfferType | "resort_restaurant", number> = {
  day_pass: 120,
  brunch: 90,
  pool_day_use: 120,
  spa_package: 120,
  resort_restaurant: 180,
};

export function isPriceFresh(
  priceVerifiedAt: string | null | undefined,
  offerType: OfferType,
  now: Date,
): boolean {
  if (!priceVerifiedAt) return false;
  const t = Date.parse(priceVerifiedAt);
  if (!Number.isFinite(t)) return false;
  return now.getTime() - t <= FRESHNESS_DAYS[offerType] * 86_400_000;
}

/** Public copy for a missing price (§11.3) — [NO DATA] never reaches a tourist. */
export function publicPriceFallback(checkedAt?: string | null): string {
  return checkedAt
    ? `Price not published — confirm directly with the hotel. Checked ${checkedAt}.`
    : "Price not published — confirm directly with the hotel.";
}
