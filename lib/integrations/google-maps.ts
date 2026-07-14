import { parseSafeHttpsUrl } from "./external-ordering";

export function validateGoogleMapsUrl(value: unknown): string | null {
  const url = parseSafeHttpsUrl(value);
  if (!url) return null;
  const host = url.hostname.toLowerCase();

  const accepted =
    host === "maps.app.goo.gl" ||
    (host === "goo.gl" && url.pathname.startsWith("/maps")) ||
    host === "maps.google.com" ||
    ((host === "google.com" || host === "www.google.com") &&
      url.pathname.startsWith("/maps"));

  return accepted ? url.toString() : null;
}

export function buildGoogleMapsSearchUrl(query: string): string | null {
  const cleaned = query.trim().replace(/\s+/g, " ").slice(0, 180);
  if (!cleaned) return null;
  const url = new URL("https://www.google.com/maps/search/");
  url.searchParams.set("api", "1");
  url.searchParams.set("query", cleaned);
  return url.toString();
}
