export type MenuStatus = "draft" | "review" | "published" | "archived";
export type ActionStatus = "draft" | "review" | "confirmed" | "disabled" | "archived";
export type ActionKind =
  | "reserve"
  | "delivery"
  | "takeaway"
  | "preorder"
  | "website"
  | "whatsapp"
  | "maps";

export type Evidence = {
  sourceUrl: string;
  sourceLabel: string;
  capturedAt: string;
  verifiedAt: string | null;
};

export type MenuItemRecord = {
  id: string;
  name: string;
  description: string | null;
  priceMinor: number | null;
  currency: string | null;
  dietaryTags: string[];
  verifiedAllergenTags: string[];
  partnerRecommended: boolean;
  editorialPick: boolean;
  editorialNote: string | null;
  availabilityNote: string | null;
  position: number;
};

export type MenuSectionRecord = {
  id: string;
  name: string;
  description: string | null;
  position: number;
  items: MenuItemRecord[];
};

export type MenuRecord = Evidence & {
  id: string;
  venueSlug: string;
  title: string;
  version: number;
  status: MenuStatus;
  expiresAt: string | null;
  sections: MenuSectionRecord[];
};

export type VenueActionCapabilityRecord = Evidence & {
  id: string;
  venueSlug: string;
  kind: ActionKind;
  provider: string;
  url: string;
  label: string | null;
  status: ActionStatus;
  priority: number;
  confirmationRequired: boolean;
  expiresAt: string | null;
};

export type VenueActionFallbacks = {
  tablepilotSlug?: string | null;
  whatsapp?: string | null;
  officialMenuUrl?: string | null;
  websiteUrl?: string | null;
  googleMapsUrl?: string | null;
};

export type VenueActionBarProps = {
  venueSlug: string;
  venueName: string;
  district: string;
  coverageMode: "active_deep" | "next_deep" | "planning_only";
  capabilities: VenueActionCapabilityRecord[];
  fallbacks: VenueActionFallbacks;
  acquisitionSource?: string;
  className?: string;
};

export type SafeActionEventPayload = {
  action: ActionKind;
  provider: string;
  capabilityId?: string;
  venueSlug: string;
};

export type PublicVenueDetailExtension = {
  menu: MenuRecord | null;
  actionCapabilities: VenueActionCapabilityRecord[];
};

