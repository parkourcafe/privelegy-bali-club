import {
  parseMobileBootstrap,
  parseMobileRouteDetail,
  parseMobileVenue,
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
import {
  GUEST_IDENTITY_PATTERN,
  getOrCreateGuestIdentity,
} from "./guest-identity";

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
  status?: "scheduled" | "cancelled";
  cancellationReason?: string | null;
  lastVerifiedAt: string;
  expiresAt: string;
}

export interface MobileFeedCard {
  venue: ReturnType<typeof parseMobileVenue>;
  reasonShown: string;
  whyThisPlace: string;
  skipIf: string | null;
  tags: string[];
  freshness: string;
}

export interface MobileFeedResult {
  updatedAt: string;
  page: {
    items: MobileFeedCard[];
    nextCursor: string | null;
    end: boolean;
  };
}

const MOBILE_HEADERS = {
  Accept: "application/json",
  "X-Other-Bali-Mobile-Shell": __MOBILE_SHELL_VERSION__,
};

export type GuestIdentityProvider = () => Promise<string>;

const DECISION_CONTEXT_FIELDS = [
  "area",
  "company",
  "moment",
  "budget",
  "ending",
] as const;

function safeDecisionContext(context: Record<string, string>): Record<string, string> {
  const safe: Record<string, string> = {};
  for (const field of DECISION_CONTEXT_FIELDS) {
    const value = context[field];
    if (typeof value === "string" && value.length <= 160) safe[field] = value;
  }
  return safe;
}

function containsPreciseLocation(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(containsPreciseLocation);
  return Object.entries(value).some(([key, entry]) => (
    /^(?:lat|latitude|lon|lng|longitude|coord|coords|coordinate|coordinates)$/i.test(key)
    || containsPreciseLocation(entry)
  ));
}

async function guestIdentityHeader(
  provider: GuestIdentityProvider,
): Promise<{ "X-Other-Bali-Guest": string }> {
  const identity = await provider();
  if (!GUEST_IDENTITY_PATTERN.test(identity)) throw new Error("Invalid guest identity");
  return { "X-Other-Bali-Guest": identity };
}

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
  identityProvider: GuestIdentityProvider = getOrCreateGuestIdentity,
): Promise<MobileDecisionResult> {
  const guestHeader = await guestIdentityHeader(identityProvider);
  const response = await fetch(`${MOBILE_API_ORIGIN}/api/mobile/v1/decisions`, {
    method: "POST",
    credentials: "include",
    headers: {
      ...MOBILE_HEADERS,
      ...guestHeader,
      "Content-Type": "application/json",
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify({ context: safeDecisionContext(context) }),
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
    const status: "scheduled" | "cancelled" = item.status === "scheduled" || item.status === "cancelled"
      ? item.status
      : (() => { throw new Error("Invalid event status"); })();
    const event: MobileEventOccurrence = {
      id: bounded("id", 160),
      eventId: bounded("eventId", 160),
      title: bounded("title", 200),
      venueSlug: item.venueSlug === null ? null : bounded("venueSlug", 160),
      area: item.area === null ? null : bounded("area", 160),
      startsAt: timestamp("startsAt"),
      endsAt: timestamp("endsAt"),
      status,
      cancellationReason: item.cancellationReason === null
        ? null
        : bounded("cancellationReason", 500),
      lastVerifiedAt: timestamp("lastVerifiedAt"),
      expiresAt: timestamp("expiresAt"),
    };
    if ((status === "cancelled") !== Boolean(event.cancellationReason)) {
      throw new Error("Invalid event cancellation lifecycle");
    }
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

export function parseMobileFeedResponse(value: unknown): MobileFeedResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid feed response");
  }
  const envelope = value as Record<string, unknown>;
  if (
    envelope.schemaVersion !== 1
    || typeof envelope.updatedAt !== "string"
    || !Number.isFinite(Date.parse(envelope.updatedAt))
    || new Date(envelope.updatedAt).toISOString() !== envelope.updatedAt
    || !envelope.data
    || typeof envelope.data !== "object"
    || Array.isArray(envelope.data)
  ) throw new Error("Invalid feed timestamp or envelope");
  const page = (envelope.data as Record<string, unknown>).page;
  if (!page || typeof page !== "object" || Array.isArray(page)) {
    throw new Error("Invalid feed page");
  }
  const record = page as Record<string, unknown>;
  if (
    !Array.isArray(record.items)
    || record.items.length > 50
    || typeof record.end !== "boolean"
    || !(
      record.nextCursor === null
      || (
        typeof record.nextCursor === "string"
        && /^[A-Za-z0-9_-]{1,500}$/.test(record.nextCursor)
      )
    )
    || (record.end && record.nextCursor !== null)
    || (!record.end && record.nextCursor === null)
  ) throw new Error("Invalid feed cursor lifecycle");
  const bounded = (entry: unknown, field: string, max = 1_000): string => {
    if (typeof entry !== "string" || !entry.trim() || entry.length > max) {
      throw new Error(`Invalid bounded feed ${field}`);
    }
    return entry;
  };
  const feedVenue = (entry: unknown) => {
    try {
      return parseMobileVenue(entry);
    } catch {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
        throw new Error("Invalid feed venue");
      }
      const officialUrl = (entry as Record<string, unknown>).officialUrl;
      if (typeof officialUrl !== "string") throw new Error("Invalid feed venue");
      try {
        const url = new URL(officialUrl);
        if (
          url.protocol !== "https:"
          || url.username
          || url.password
          || !url.hostname.includes(".")
        ) throw new Error("unsafe");
        return {
          ...parseMobileVenue({ ...(entry as Record<string, unknown>), officialUrl: null }),
          officialUrl,
        };
      } catch {
        throw new Error("Invalid feed venue");
      }
    }
  };
  const items = record.items.map((entry): MobileFeedCard => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error("Invalid feed card");
    }
    const card = entry as Record<string, unknown>;
    if (
      !Array.isArray(card.tags)
      || card.tags.length > 20
      || card.tags.some((tag) => typeof tag !== "string" || !tag.trim() || tag.length > 120)
    ) throw new Error("Invalid bounded feed tags");
    return {
      venue: feedVenue(card.venue),
      reasonShown: bounded(card.reasonShown, "reason"),
      whyThisPlace: bounded(card.whyThisPlace, "why"),
      skipIf: card.skipIf === null ? null : bounded(card.skipIf, "skip"),
      tags: card.tags as string[],
      freshness: bounded(card.freshness, "freshness", 240),
    };
  });
  if (new Set(items.map((item) => item.venue.id)).size !== items.length) {
    throw new Error("Duplicate feed identity");
  }
  return {
    updatedAt: envelope.updatedAt,
    page: {
      items,
      nextCursor: record.nextCursor as string | null,
      end: record.end,
    },
  };
}

export async function fetchDiscoveryFeed(
  request: {
    district: string;
    category: string;
    limit: number;
    cursor: string | null;
  },
  signal?: AbortSignal,
): Promise<MobileFeedResult> {
  const search = new URLSearchParams({
    district: request.district,
    category: request.category,
    limit: String(request.limit),
  });
  if (request.cursor !== null) search.set("cursor", request.cursor);
  return await fetchMobilePayload(
    `/api/mobile/v1/feed?${search.toString()}`,
    "Feed",
    parseMobileFeedResponse,
    signal,
  );
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
  identityProvider: GuestIdentityProvider = getOrCreateGuestIdentity,
): Promise<unknown> {
  const { idempotencyKey, ...input } = mutation;
  if (containsPreciseLocation(input)) {
    throw new Error("Precise location is not allowed in sync payloads");
  }
  const guestHeader = await guestIdentityHeader(identityProvider);
  const response = await fetch(`${MOBILE_API_ORIGIN}/api/mobile/v1/sync`, {
    method: "POST",
    credentials: "include",
    headers: {
      ...MOBILE_HEADERS,
      ...guestHeader,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({ input }),
    signal,
  });
  if (!response.ok) throw new Error(`Sync request failed with ${response.status}`);
  const value = await response.json() as { data?: unknown };
  if (value.data === undefined) throw new Error("Sync mutation acknowledgement was missing");
  return value.data;
}

export async function deleteSyncedData(
  signal?: AbortSignal,
  identityProvider: GuestIdentityProvider = getOrCreateGuestIdentity,
): Promise<void> {
  const guestHeader = await guestIdentityHeader(identityProvider);
  const response = await fetch(`${MOBILE_API_ORIGIN}/api/mobile/v1/privacy`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      ...MOBILE_HEADERS,
      ...guestHeader,
    },
    signal,
  });
  if (!response.ok) throw new Error(`Privacy deletion request failed with ${response.status}`);
  let confirmation: unknown;
  try {
    confirmation = await response.json();
  } catch {
    throw new Error("Privacy deletion response did not confirm success");
  }
  if (
    !confirmation
    || typeof confirmation !== "object"
    || Array.isArray(confirmation)
    || (confirmation as Record<string, unknown>).ok !== true
  ) {
    throw new Error("Privacy deletion response did not confirm success");
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
