import type { PublicVenueDetailExtension } from "../contracts/menu-action";
import { getPublishedActionCapabilities } from "./action-repository";
import { getPublishedMenuOptional } from "./menu-repository";

export async function getPublicVenueDetailExtension(
  venueSlug: string
): Promise<PublicVenueDetailExtension> {
  const [menu, actionCapabilities] = await Promise.all([
    getPublishedMenuOptional(venueSlug),
    getPublishedActionCapabilities(venueSlug),
  ]);
  return { menu, actionCapabilities };
}
