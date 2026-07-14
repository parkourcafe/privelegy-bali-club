import type { ActionKind } from "../contracts/menu-action";
import type { CanonicalActionProvider } from "../actions/types";
import {
  hostMatches,
  parseSafeHttpsUrl,
  validateOfficialWebsiteUrl,
} from "../external-links";

export { hostMatches, parseSafeHttpsUrl, validatePublicEvidenceUrl } from "../external-links";

const PROVIDER_ALIASES: Record<string, CanonicalActionProvider> = {
  tablepilot: "tablepilot",
  table_pilot: "tablepilot",
  google_maps: "google_maps",
  googlemaps: "google_maps",
  maps: "google_maps",
  whatsapp: "whatsapp",
  whats_app: "whatsapp",
  grabfood: "grabfood",
  grab_food: "grabfood",
  gofood: "gofood",
  go_food: "gofood",
  gojek: "gofood",
  shopeefood: "shopeefood",
  shopee_food: "shopeefood",
  official: "official",
  direct: "official",
  venue: "official",
  website: "official",
  sevenrooms: "sevenrooms",
  seven_rooms: "sevenrooms",
  tablecheck: "tablecheck",
  table_check: "tablecheck",
  chope: "chope",
  resdiary: "resdiary",
  res_diary: "resdiary",
  dishcult: "dishcult",
};

const PROVIDER_HOSTS: Partial<Record<CanonicalActionProvider, readonly string[]>> = {
  grabfood: ["grab.com", "grab.onelink.me"],
  gofood: ["gofood.co.id", "gofood.link", "gojek.com", "gojek.page.link"],
  shopeefood: ["shopee.co.id", "shopeefood.co.id"],
  sevenrooms: ["sevenrooms.com"],
  tablecheck: ["tablecheck.com"],
  chope: ["chope.co", "chope.co.id"],
  resdiary: ["resdiary.com"],
  dishcult: ["dishcult.com"],
};

const ORDERING_PROVIDERS = new Set<CanonicalActionProvider>([
  "grabfood",
  "gofood",
  "shopeefood",
]);
const BOOKING_PROVIDERS = new Set<CanonicalActionProvider>([
  "sevenrooms",
  "tablecheck",
  "chope",
  "resdiary",
  "dishcult",
]);

function hostsShareOfficialFamily(left: string, right: string): boolean {
  return hostMatches(left, right) || hostMatches(right, left);
}

export function normalizeActionProvider(value: unknown): CanonicalActionProvider | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return PROVIDER_ALIASES[normalized] ?? null;
}

export function providerLabel(provider: CanonicalActionProvider): string {
  const labels: Record<CanonicalActionProvider, string> = {
    tablepilot: "TablePilot",
    google_maps: "Google Maps",
    whatsapp: "WhatsApp",
    grabfood: "GrabFood",
    gofood: "GoFood",
    shopeefood: "ShopeeFood",
    official: "the venue",
    sevenrooms: "SevenRooms",
    tablecheck: "TableCheck",
    chope: "Chope",
    resdiary: "ResDiary",
    dishcult: "Dish Cult",
  };
  return labels[provider];
}

export function providerSupportsAction(
  provider: CanonicalActionProvider,
  kind: ActionKind
): boolean {
  if (provider === "official") {
    return ["reserve", "delivery", "takeaway", "preorder", "website"].includes(kind);
  }
  if (ORDERING_PROVIDERS.has(provider)) {
    return kind === "delivery" || kind === "takeaway";
  }
  if (BOOKING_PROVIDERS.has(provider)) return kind === "reserve";
  return false;
}

export function validateExternalProviderUrl(input: {
  provider: CanonicalActionProvider;
  kind: ActionKind;
  url: string;
  sourceUrl?: string | null;
  officialUrls?: Array<string | null | undefined>;
}): string | null {
  if (!providerSupportsAction(input.provider, input.kind)) return null;
  const target = parseSafeHttpsUrl(input.url);
  if (!target) return null;

  if (input.provider !== "official") {
    const allowed = PROVIDER_HOSTS[input.provider];
    if (!allowed?.some((host) => hostMatches(target.hostname, host))) return null;
    return target.toString();
  }

  const evidenceUrls = [input.sourceUrl, ...(input.officialUrls ?? [])]
    .map(parseSafeHttpsUrl)
    .filter((url): url is URL => Boolean(url));
  if (!evidenceUrls.some((url) => hostsShareOfficialFamily(target.hostname, url.hostname))) {
    return null;
  }
  return target.toString();
}

export function validateOfficialFallbackUrl(value: unknown): string | null {
  return validateOfficialWebsiteUrl(value);
}
