export { validateGoogleMapsUrl } from "../external-links";

export function buildGoogleMapsSearchUrl(query: string): string | null {
  const cleaned = query.trim().replace(/\s+/g, " ").slice(0, 180);
  if (!cleaned) return null;
  const url = new URL("https://www.google.com/maps/search/");
  url.searchParams.set("api", "1");
  url.searchParams.set("query", cleaned);
  return url.toString();
}
