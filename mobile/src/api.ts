import {
  parseMobileBootstrap,
  parseMobileRouteDetail,
  parseMobileVenueDetail,
  type MobileBootstrapPayload,
  type MobileRouteDetailPayload,
  type MobileVenueDetailPayload,
} from "./contracts";
import type { SyncMutation } from "../../lib/journey/offline-sync";
import {
  parseOfflineBaliManifest,
  type OfflineBaliManifest,
} from "../../lib/journey/offline-bali";

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

export interface MobileDecisionPlace {
  placeId: string;
  name: string;
  why: string | null;
  notIdealIf: string | null;
}

export interface MobileDecisionResult {
  bestFit: MobileDecisionPlace | null;
  backup: MobileDecisionPlace | null;
  contrast: MobileDecisionPlace | null;
  emptyStateReason: string | null;
}

export interface MobileEventOccurrence {
  id: string;
  eventId: string;
  title: string;
  venueSlug: string | null;
  area: string | null;
  startsAt: string;
  endsAt: string;
  lastVerifiedAt: string;
  expiresAt: string;
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

function parseDecisionPlace(value: unknown): MobileDecisionPlace | null {
  if (value === null) return null;
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid decision place");
  const item = value as Record<string, unknown>;
  if (
    typeof item.placeId !== "string"
    || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.placeId)
    || typeof item.name !== "string"
    || !item.name.trim()
    || item.name.length > 160
  ) throw new Error("Invalid decision place");
  const nullable = (entry: unknown) => entry === null
    ? null
    : typeof entry === "string" && entry.length <= 1_000 ? entry : null;
  return {
    placeId: item.placeId,
    name: item.name,
    why: nullable(item.why),
    notIdealIf: nullable(item.notIdealIf),
  };
}

export function parseDecisionResponse(value: unknown): MobileDecisionResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid decision response");
  const envelope = value as Record<string, unknown>;
  const data = envelope.data;
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Invalid decision response");
  const result = (data as Record<string, unknown>).result;
  if (!result || typeof result !== "object" || Array.isArray(result)) throw new Error("Invalid decision response");
  const item = result as Record<string, unknown>;
  return {
    bestFit: parseDecisionPlace(item.bestFit),
    backup: parseDecisionPlace(item.backup),
    contrast: parseDecisionPlace(item.contrast),
    emptyStateReason: typeof item.emptyStateReason === "string" ? item.emptyStateReason : null,
  };
}

export async function createDecision(
  context: Record<string, string>,
  signal?: AbortSignal,
): Promise<MobileDecisionResult> {
  const response = await fetch(`${MOBILE_API_ORIGIN}/api/mobile/v1/decisions`, {
    method: "POST",
    credentials: "include",
    headers: {
      ...MOBILE_HEADERS,
      "Content-Type": "application/json",
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify({ context }),
    signal,
  });
  if (!response.ok) throw new Error(`Decision request failed with ${response.status}`);
  return parseDecisionResponse(await response.json());
}

export function parseEventsResponse(value: unknown): {
  updatedAt: string;
  events: MobileEventOccurrence[];
} {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid events response");
  const envelope = value as Record<string, unknown>;
  const updatedAt = envelope.updatedAt;
  const data = envelope.data;
  if (
    typeof updatedAt !== "string"
    || !Number.isFinite(Date.parse(updatedAt))
    || !data
    || typeof data !== "object"
    || Array.isArray(data)
    || !Array.isArray((data as Record<string, unknown>).events)
  ) throw new Error("Invalid events response");
  const source = (data as { events: unknown[] }).events;
  if (source.length > 100) throw new Error("Invalid events response");
  const events = source.map((value): MobileEventOccurrence => {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid event");
    const item = value as Record<string, unknown>;
    const bounded = (field: string, max: number) => {
      const entry = item[field];
      if (typeof entry !== "string" || !entry.trim() || entry.length > max) throw new Error("Invalid event");
      return entry;
    };
    const timestamp = (field: string) => {
      const entry = bounded(field, 40);
      if (!Number.isFinite(Date.parse(entry))) throw new Error("Invalid event timestamp");
      return entry;
    };
    const event = {
      id: bounded("id", 160),
      eventId: bounded("eventId", 160),
      title: bounded("title", 200),
      venueSlug: item.venueSlug === null ? null : bounded("venueSlug", 160),
      area: item.area === null ? null : bounded("area", 160),
      startsAt: timestamp("startsAt"),
      endsAt: timestamp("endsAt"),
      lastVerifiedAt: timestamp("lastVerifiedAt"),
      expiresAt: timestamp("expiresAt"),
    };
    if (
      Date.parse(event.endsAt) <= Date.parse(event.startsAt)
      || Date.parse(event.expiresAt) <= Date.parse(event.lastVerifiedAt)
    ) throw new Error("Invalid event lifecycle");
    return event;
  });
  if (new Set(events.map((event) => event.id)).size !== events.length) {
    throw new Error("Duplicate event occurrence");
  }
  return { updatedAt, events };
}

export async function fetchEvents(signal?: AbortSignal) {
  return await fetchMobilePayload(
    "/api/mobile/v1/events",
    "Events",
    parseEventsResponse,
    signal,
  );
}

export async function fetchOfflineBaliManifest(
  signal?: AbortSignal,
): Promise<OfflineBaliManifest> {
  return await fetchMobilePayload(
    "/api/mobile/v1/offline-regions",
    "Offline Bali manifest",
    parseOfflineBaliManifest,
    signal,
  );
}

export async function pushSyncMutation(
  mutation: SyncMutation,
  signal?: AbortSignal,
): Promise<unknown> {
  const response = await fetch(`${MOBILE_API_ORIGIN}/api/mobile/v1/sync`, {
    method: "POST",
    credentials: "include",
    headers: {
      ...MOBILE_HEADERS,
      "Content-Type": "application/json",
      "Idempotency-Key": mutation.idempotencyKey,
    },
    body: JSON.stringify({ input: mutation }),
    signal,
  });
  if (!response.ok) throw new Error(`Sync request failed with ${response.status}`);
  const value = await response.json() as { data?: unknown };
  if (value.data === undefined) throw new Error("Sync mutation acknowledgement was missing");
  return value.data;
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
