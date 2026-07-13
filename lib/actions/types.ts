import type { ActionKind, SafeActionEventPayload } from "../contracts/menu-action";

export type CanonicalActionProvider =
  | "tablepilot"
  | "google_maps"
  | "whatsapp"
  | "grabfood"
  | "gofood"
  | "shopeefood"
  | "official"
  | "sevenrooms"
  | "tablecheck"
  | "chope"
  | "resdiary"
  | "dishcult";

export interface ResolvedVenueAction {
  id: string;
  kind: ActionKind;
  provider: CanonicalActionProvider;
  providerLabel: string;
  href: string;
  label: string;
  disclosure: string;
  confirmationRequired: boolean;
  priority: number;
  source: "capability" | "fallback";
  eventPayload: SafeActionEventPayload;
}

export interface RejectedVenueAction {
  id: string;
  reason: string;
}

export interface VenueActionResolution {
  primary: ResolvedVenueAction | null;
  alternatives: ResolvedVenueAction[];
  maps: ResolvedVenueAction | null;
  all: ResolvedVenueAction[];
  rejected: RejectedVenueAction[];
}

export interface ResolveVenueActionsOptions {
  now?: Date | string | number;
  tablepilotBaseUrl?: string;
}
