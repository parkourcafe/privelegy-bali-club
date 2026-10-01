export interface TripEntry {
  venueSlug: string;
  day: number | null;
  position: number;
}

export type SavedTripState<T> = { status: "ready" | "legacy"; entries: T[] };

export async function resolveSavedTripRead(
  read: { data: unknown; error: { code?: string } | null },
  readLegacySlugs: () => Promise<string[]>,
): Promise<SavedTripState<TripEntry>> {
  if (!read.error) {
    if (!Array.isArray(read.data)) throw new Error("saved_trip_unavailable");
    return { status: "ready", entries: parseTripEntries(read.data) };
  }
  // A missing RPC is a known migration gap; all other errors leave the saved
  // plan unavailable rather than flattening day assignments into a new state.
  if (read.error.code !== "PGRST202" && read.error.code !== "42883") throw read.error;
  const entries = (await readLegacySlugs()).map((venueSlug, index) => ({
    venueSlug,
    day: null,
    position: index + 1,
  }));
  return { status: "legacy", entries };
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
