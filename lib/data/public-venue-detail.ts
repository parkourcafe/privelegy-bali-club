import type { PublicVenueDetailExtension } from "../contracts/menu-action";
import { getPublishedActionCapabilities } from "./action-repository";
import { getPublishedMenu } from "./menu-repository";

async function fetchPublicVenueDetailExtension(
  venueSlug: string
): Promise<PublicVenueDetailExtension> {
  const [menu, actionCapabilities] = await Promise.all([
    getPublishedMenu(venueSlug),
    getPublishedActionCapabilities(venueSlug),
  ]);
  return { menu, actionCapabilities };
}

export const getPublicVenueDetailExtension = reactCache(
  fetchPublicVenueDetailExtension,
);
import { cache as reactCache } from "react";
