/**
 * Frozen cross-session contract for the Other Bali menu/action loop.
 *
 * Add this file to the baseline commit before creating the four worktrees.
 * Sessions may extend implementation behind these interfaces, but any breaking
 * contract change must be recorded in the coordination board and approved by
 * the integration owner.
 */

export type MenuSourceType = "partner" | "official_url" | "editorial_capture";
export type MenuStatus = "draft" | "review" | "published" | "stale" | "archived";

export interface PublishedMenuItem {
  id: string;
  slug: string;
  name: string;
  description?: string;
  priceAmount?: number;
  priceText?: string;
  imageUrl?: string;
  dietaryTags: string[];
  allergenTags: string[];
  availabilityText?: string;
  isAvailable: boolean;
  partnerRecommended: boolean;
  editorialPick: boolean;
  editorialNote?: string;
  sortOrder: number;
}

export interface PublishedMenuSection {
  id: string;
  name: string;
  description?: string;
  availabilityText?: string;
  sortOrder: number;
  items: PublishedMenuItem[];
}

export interface PublishedMenu {
  id: string;
  venueSlug: string;
  version: number;
  name: string;
  currency: string;
  sourceType: MenuSourceType;
  sourceUrl?: string;
  status: MenuStatus;
  verifiedAt?: string;
  expiresAt?: string;
  sections: PublishedMenuSection[];
}

export type VenueActionType =
  | "reserve"
  | "delivery"
  | "takeaway"
  | "preorder"
  | "website"
  | "whatsapp"
  | "directions";

export type VenueActionStatus = "draft" | "review" | "published" | "stale" | "disabled";

export interface VenueActionCapabilityRecord {
  id: string;
  venueSlug: string;
  actionType: Exclude<VenueActionType, "directions">;
  provider: string;
  label?: string;
  handoffUrl: string;
  status: VenueActionStatus;
  priority: number;
  sourceType: string;
  sourceUrl?: string;
  verifiedAt?: string;
  expiresAt?: string;
  confirmationRequired: boolean;
  serviceAreaText?: string;
  minimumOrderText?: string;
  feeText?: string;
  availabilityText?: string;
  metadata: Record<string, unknown>;
}

export interface ResolvedVenueAction {
  id: string;
  type: VenueActionType;
  provider: string;
  label: string;
  href: string;
  external: true;
  confirmationRequired: boolean;
  availabilityText?: string;
  serviceAreaText?: string;
  minimumOrderText?: string;
  feeText?: string;
  verifiedAt?: string;
}

export interface PublicVenueActionBundle {
  primary: Partial<Record<VenueActionType, ResolvedVenueAction>>;
  alternatives: Partial<Record<VenueActionType, ResolvedVenueAction[]>>;
}

export interface PublicVenueDetailExtension {
  menu: PublishedMenu | null;
  actions: PublicVenueActionBundle;
  verification: {
    menuVerifiedAt?: string;
    actionsVerifiedAt?: string;
  };
}

// ============================================================================
// v1.1 ADDENDUM — frozen 2026-07-13 (Bali), founder-approved package patch v2.
// Same change control as above: breaking changes only via a contract-change
// request recorded on the status board and approved by the integration owner.
// ============================================================================

/**
 * Component contract for the venue action integration slot.
 * Session 2 renders the slot and passes exactly these props.
 * Session 3 implements the component that consumes them.
 * Session 4 wires the real data source at integration.
 */
export interface VenueActionBarProps {
  venueSlug: string;
  bundle: PublicVenueActionBundle;
  placement: "venue_header" | "venue_sticky_footer" | "menu_context";
  /** Analytics-only hook; navigation/handoff behavior lives inside the component. */
  onActionSelect?: (actionType: VenueActionType) => void;
}

/**
 * Canonical fixtures: during development all sessions must import mock data
 * from `./menu-action.fixtures` and must not invent local mock shapes.
 */
