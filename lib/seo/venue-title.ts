import { venueCategoryLabel } from "../venue-presentation";

type VenueTitleInput = {
  name: string;
  category: string;
  district: string;
  area?: string;
};

export function buildCompactVenueTitle(venue: VenueTitleInput): string {
  const category = venueCategoryLabel(venue.category);
  const area = venue.area?.trim();
  const district = venue.district.trim();
  const areaAlreadyNamesDistrict = Boolean(
    area && area.toLocaleLowerCase("en").includes(district.toLocaleLowerCase("en")),
  );
  const location = [area, areaAlreadyNamesDistrict ? undefined : district]
    .filter(Boolean)
    .join(", ");
  const candidates = [
    `${venue.name} — ${category} in ${location}`,
    `${venue.name} — ${category} in ${district}`,
    `${venue.name} — ${category}`,
    `${venue.name} · Other Bali`,
  ];

  return candidates.find((candidate) => candidate.length <= 60) ?? candidates.at(-1)!;
}
