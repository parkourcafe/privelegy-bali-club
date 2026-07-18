import {
  parseMobileBootstrap,
  parseMobileRouteDetail,
  parseMobileVenueDetail,
  type MobileBootstrapPayload,
  type MobileRouteDetailPayload,
  type MobileVenueDetailPayload,
} from "./contracts";

export const MOBILE_API_ORIGIN = __MOBILE_API_ORIGIN__;
export const MOBILE_API_TIMEOUT_MS = 12_000;

export class MobileApiTimeoutError extends Error {
  readonly timeoutMs: number;

  constructor(timeoutMs = MOBILE_API_TIMEOUT_MS) {
    super(`Mobile API request timed out after ${timeoutMs} ms`);
    this.name = "MobileApiTimeoutError";
    this.timeoutMs = timeoutMs;
  }
}

const MOBILE_HEADERS = {
  Accept: "application/json",
  "X-Other-Bali-Mobile-Shell": __MOBILE_SHELL_VERSION__,
};

function abortError(): DOMException {
  return new DOMException("The operation was aborted.", "AbortError");
}

async function fetchMobilePayload<T>(
  path: string,
  requestName: string,
  parse: (value: unknown) => T,
  externalSignal?: AbortSignal,
): Promise<T> {
  if (externalSignal?.aborted) throw abortError();

  const controller = new AbortController();
  let onExternalAbort: (() => void) | undefined;
  let externalAbortPromise: Promise<never> | undefined;
  if (externalSignal) {
    externalAbortPromise = new Promise<never>((_resolve, reject) => {
      onExternalAbort = () => {
        reject(abortError());
        controller.abort();
      };
      externalSignal.addEventListener("abort", onExternalAbort, { once: true });
    });
    if (externalSignal.aborted) onExternalAbort?.();
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new MobileApiTimeoutError());
      controller.abort();
    }, MOBILE_API_TIMEOUT_MS);
  });
  const request = (async () => {
    const response = await fetch(`${MOBILE_API_ORIGIN}${path}`, {
      headers: MOBILE_HEADERS,
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`${requestName} request failed with ${response.status}`);
    return parse(await response.json());
  })();

  try {
    const competing = externalAbortPromise
      ? [request, timeoutPromise, externalAbortPromise]
      : [request, timeoutPromise];
    return await Promise.race(competing);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
    if (externalSignal && onExternalAbort) {
      externalSignal.removeEventListener("abort", onExternalAbort);
    }
  }
}

export async function fetchBootstrap(signal?: AbortSignal): Promise<MobileBootstrapPayload> {
  return await fetchMobilePayload(
    "/api/mobile/v1/bootstrap",
    "Bootstrap",
    parseMobileBootstrap,
    signal,
  );
}

export async function fetchVenueDetail(
  slug: string,
  signal?: AbortSignal,
): Promise<MobileVenueDetailPayload> {
  return await fetchMobilePayload(
    `/api/mobile/v1/venues/${encodeURIComponent(slug)}`,
    "Venue detail",
    parseMobileVenueDetail,
    signal,
  );
}

export async function fetchRouteDetail(
  slug: string,
  signal?: AbortSignal,
): Promise<MobileRouteDetailPayload> {
  return await fetchMobilePayload(
    `/api/mobile/v1/routes/${encodeURIComponent(slug)}`,
    "Route detail",
    parseMobileRouteDetail,
    signal,
  );
}
