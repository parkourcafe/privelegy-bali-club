import { venueCategoryLabel } from "../venue-presentation";

type VenueTitleInput = {
  name: string;
  category: string;
  district: string;
  area?: string;
};

const MAX_TITLE_LENGTH = 60;
const BRAND_SUFFIX = " · Other Bali";

export function buildCompactVenueTitle(venue: VenueTitleInput): string {
  const category = venueCategoryLabel(venue.category);
  const area = venue.area?.trim();
  const rawDistrict = venue.district.trim();
  const areaAlreadyNamesDistrict = Boolean(
    area && area.toLocaleLowerCase("en").includes(rawDistrict.toLocaleLowerCase("en")),
  );
  const district = area?.toLocaleLowerCase("en") === rawDistrict.toLocaleLowerCase("en")
    ? area
    : rawDistrict;
  const location = [area, areaAlreadyNamesDistrict ? undefined : district]
    .filter(Boolean)
    .join(", ");
  const candidates = [
    `${venue.name} — ${category} in ${location}${BRAND_SUFFIX}`,
    `${venue.name} — ${category} in ${district}${BRAND_SUFFIX}`,
    `${venue.name} — ${category}${BRAND_SUFFIX}`,
    `${venue.name}${BRAND_SUFFIX}`,
  ];

  const fitting = candidates.find((candidate) => candidate.length <= MAX_TITLE_LENGTH);
  if (fitting) return fitting;

  const availableNameLength = MAX_TITLE_LENGTH - BRAND_SUFFIX.length - 1;
  return `${venue.name.slice(0, availableNameLength).trimEnd()}…${BRAND_SUFFIX}`;
}
