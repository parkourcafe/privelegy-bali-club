import { LIGHT_DISTRICT_SLUGS } from "../light-districts";

export function canonicalProgrammaticDistrictHubs<T extends { slug: string }>(
  hubs: readonly T[],
): T[] {
  const editorialRoots = new Set<string>(LIGHT_DISTRICT_SLUGS);
  return hubs.filter((hub) => !editorialRoots.has(hub.slug));
}
