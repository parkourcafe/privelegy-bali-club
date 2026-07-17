import {
  parseMobileBootstrap,
  parseMobileRouteDetail,
  parseMobileVenueDetail,
  type MobileBootstrapPayload,
  type MobileRouteDetailPayload,
  type MobileVenueDetailPayload,
} from "./contracts";

export const MOBILE_API_ORIGIN = __MOBILE_API_ORIGIN__;

const MOBILE_HEADERS = {
  Accept: "application/json",
  "X-Other-Bali-Mobile-Shell": __MOBILE_SHELL_VERSION__,
};

export async function fetchBootstrap(signal?: AbortSignal): Promise<MobileBootstrapPayload> {
  const response = await fetch(`${MOBILE_API_ORIGIN}/api/mobile/v1/bootstrap`, {
    headers: MOBILE_HEADERS,
    signal,
  });
  if (!response.ok) throw new Error(`Bootstrap request failed with ${response.status}`);
  return parseMobileBootstrap(await response.json());
}

export async function fetchVenueDetail(
  slug: string,
  signal?: AbortSignal,
): Promise<MobileVenueDetailPayload> {
  const response = await fetch(
    `${MOBILE_API_ORIGIN}/api/mobile/v1/venues/${encodeURIComponent(slug)}`,
    { headers: MOBILE_HEADERS, signal },
  );
  if (!response.ok) throw new Error(`Venue detail request failed with ${response.status}`);
  return parseMobileVenueDetail(await response.json());
}

export async function fetchRouteDetail(
  slug: string,
  signal?: AbortSignal,
): Promise<MobileRouteDetailPayload> {
  const response = await fetch(
    `${MOBILE_API_ORIGIN}/api/mobile/v1/routes/${encodeURIComponent(slug)}`,
    { headers: MOBILE_HEADERS, signal },
  );
  if (!response.ok) throw new Error(`Route detail request failed with ${response.status}`);
  return parseMobileRouteDetail(await response.json());
}
