import type { PublicVenueDetailExtension } from "../contracts/menu-action";
import { getPublishedActionCapabilities } from "./action-repository";
import { getPublishedMenu } from "./menu-repository";

export async function getPublicVenueDetailExtension(
  venueSlug: string
): Promise<PublicVenueDetailExtension> {
  const [menu, actionCapabilities] = await Promise.all([
    getPublishedMenu(venueSlug),
    getPublishedActionCapabilities(venueSlug),
  ]);
  return { menu, actionCapabilities };
}
