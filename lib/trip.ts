export interface TripEntry {
  venueSlug: string;
  day: number | null;
  position: number;
}

const VENUE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeVenueSlug(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const slug = value.trim();
  return slug.length > 0 && slug.length <= 160 && VENUE_SLUG.test(slug) ? slug : null;
}

export function normalizeTripDay(value: unknown): number | null | undefined {
  if (value === null) return null;
  return Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 30
    ? Number(value)
    : undefined;
}

function numberValue(value: unknown, fallback: number): number {
  return Number.isInteger(value) && Number(value) > 0 ? Number(value) : fallback;
}

export function parseTripEntries(value: unknown): TripEntry[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const entries: TripEntry[] = [];

  value.forEach((raw, index) => {
    if (!raw || typeof raw !== "object") return;
    const row = raw as Record<string, unknown>;
    const venueSlug = normalizeVenueSlug(row.venue_slug ?? row.venueSlug);
    const day = normalizeTripDay(row.day_number ?? row.day ?? null);
    if (!venueSlug || day === undefined || seen.has(venueSlug)) return;
    seen.add(venueSlug);
    entries.push({ venueSlug, day, position: numberValue(row.position, index + 1) });
  });

  return entries.sort((a, b) => {
    const aDay = a.day ?? 0;
    const bDay = b.day ?? 0;
    return aDay - bDay || a.position - b.position || a.venueSlug.localeCompare(b.venueSlug);
  });
}

export function parseSharedTripEntries(value: unknown, legacySlugs: unknown): TripEntry[] {
  const structured = parseTripEntries(value);
  if (structured.length > 0) return structured;
  if (!Array.isArray(legacySlugs)) return [];
  return parseTripEntries(
    legacySlugs.map((venueSlug, index) => ({
      venue_slug: venueSlug,
      day_number: null,
      position: index + 1,
    })),
  );
}
