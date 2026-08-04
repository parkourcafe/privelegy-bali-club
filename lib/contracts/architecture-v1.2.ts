/**
 * Additive boundary contracts for the owner-approved v1.2 architecture.
 * These types do not imply that migration 0060 is applied in any environment.
 */

export const PLACE_ACTION_TYPES = [
  "booking",
  "delivery",
  "website",
  "instagram",
  "whatsapp",
  "directions",
  "grab",
  "save",
  "add_to_day",
  "add_to_trip",
  "view_details",
] as const;

export type PlaceActionType = (typeof PLACE_ACTION_TYPES)[number];
export type VerificationStatus =
  | "unverified"
  | "needs_review"
  | "verified"
  | "expired"
  | "rejected";

export interface PlaceAction {
  id: string;
  placeId: string;
  actionType: PlaceActionType;
  label: string;
  url: string | null;
  provider: string | null;
  targetEntityId: string | null;
  isOfficial: boolean;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  lastCheckedAt: string | null;
  availability: string | null;
  displayPriority: number;
  sourceUrl: string | null;
  rightsStatus: "not_applicable" | "unknown" | "allowed" | "restricted";
  failureReason: string | null;
}

export interface FieldVerification {
  id: string;
  entityType: "place" | "place_action" | "place_media" | "event_occurrence";
  entityId: string;
  fieldName: string;
  sourceUrl: string;
  sourceType: "official" | "partner" | "editorial" | "provider";
  verifiedAt: string;
  expiresAt: string | null;
  confidence: "low" | "medium" | "high";
  status: VerificationStatus;
  conflictGroupId: string | null;
}

export interface PlaceMediaTruth {
  id: string;
  placeId: string;
  mediaType: "image" | "video";
  url: string;
  thumbnailUrl: string | null;
  order: number;
  sourceUrl: string;
  provenance: string;
  rightsStatus: "unknown" | "allowed" | "restricted";
  decoderStatus: "pending" | "passed" | "failed";
  publicationStatus: "draft" | "review" | "published" | "rejected";
  lastVerifiedAt: string | null;
}

export interface ScopedFreshness {
  field: string;
  status: "fresh" | "stale" | "unknown";
  checkedAt: string | null;
  sourceLabel: string | null;
}

export interface DiscoveryCardTruth {
  placeId: string;
  reasonShown: string;
  whyThisPlace: string;
  skipIf: string | null;
  contextualTags: string[];
  media: PlaceMediaTruth[];
  actions: PlaceAction[];
  freshness: ScopedFreshness[];
  openingState: "open" | "closed" | "unknown";
  openingStateAsOf: string | null;
  travelEstimate: {
    label: string;
    source: "live" | "recent" | "typical" | "unknown";
    calculatedAt: string | null;
  } | null;
}
