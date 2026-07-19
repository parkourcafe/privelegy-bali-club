// Accurate significant-update dates for static priority pages. Keep this
// deliberately explicit: Google says lastmod must reflect a real substantive
// page change, not the sitemap build time or every deployment.
const STATIC_LAST_MODIFIED: Readonly<Record<string, string>> = {
  "/canggu/work-friendly-cafes": "2026-07-15",
  "/canggu/best-brunch": "2026-07-15",
  "/canggu/best-restaurants": "2026-07-15",
  "/ubud/best-cafes-coffee": "2026-07-15",
  "/uluwatu/beach-clubs-sunset": "2026-07-14",
  "/seminyak/best-restaurants": "2026-07-15",
  "/best-warungs-in-bali": "2026-07-15",
  "/where-to-watch-sunset-in-bali": "2026-07-18",
};

export function staticLastModified(pathname: string): string | undefined {
  return STATIC_LAST_MODIFIED[pathname];
}

export function validLastModified(value: string | undefined): string | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const timestamp = Date.parse(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(timestamp)) return undefined;
  return new Date(timestamp).toISOString().slice(0, 10) === value
    ? value
    : undefined;
}
