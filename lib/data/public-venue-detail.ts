import type { VenueActionCapabilityRecord } from "../contracts/menu-action";
import { getPublishedActionCapabilities } from "./action-repository";
import {
  getPublishedMenuSummary,
  type PublicMenuSummary,
} from "./menu-summary-repository";

export type PublicVenuePageDetailExtension = {
  menu: PublicMenuSummary | null;
  actionCapabilities: VenueActionCapabilityRecord[];
};

async function fetchPublicVenueDetailExtension(
  venueSlug: string
): Promise<PublicVenuePageDetailExtension> {
  const [menu, actionCapabilities] = await Promise.all([
    getPublishedMenuSummary(venueSlug),
    getPublishedActionCapabilities(venueSlug),
  ]);
  return { menu, actionCapabilities };
}

export const getPublicVenueDetailExtension = reactCache(
  fetchPublicVenueDetailExtension,
);
import { cache as reactCache } from "react";
