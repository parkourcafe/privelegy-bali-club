import { parseSafeHttpsUrl } from "./external-ordering";

export const DEFAULT_TABLEPILOT_URL = "https://tablepilot-id.vercel.app";

const TABLEPILOT_SLUG = /^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$/;

function tablePilotBase(value?: string): URL | null {
  return parseSafeHttpsUrl(value === undefined ? DEFAULT_TABLEPILOT_URL : value);
}

export function isValidTablePilotSlug(value: unknown): value is string {
  return typeof value === "string" && TABLEPILOT_SLUG.test(value);
}

export function buildTablePilotReservationUrl(
  slug: string,
  baseUrl?: string
): string | null {
  if (!isValidTablePilotSlug(slug)) return null;
  const base = tablePilotBase(baseUrl);
  if (!base) return null;

  const url = new URL(`/book/${encodeURIComponent(slug)}`, base.origin);
  url.searchParams.set("source", "bali_privilege");
  return url.toString();
}

export function tablePilotSlugFromUrl(value: unknown, baseUrl?: string): string | null {
  const url = parseSafeHttpsUrl(value);
  const base = tablePilotBase(baseUrl);
  if (!url || !base || url.origin !== base.origin) return null;

  const match = url.pathname.match(/^\/book\/([^/]+)\/?$/);
  if (!match) return null;
  try {
    const slug = decodeURIComponent(match[1]);
    return isValidTablePilotSlug(slug) ? slug : null;
  } catch {
    return null;
  }
}
