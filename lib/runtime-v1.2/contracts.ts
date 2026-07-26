import type { V12ErrorCode } from "@/lib/contracts/errors-v1.2";

export const RUNTIME_SCHEMA_VERSION = 1 as const;
export const FEED_TYPES = [
  "for_you", "near_you", "open_now", "sunset_tonight", "rainy_day",
  "new_on_other_bali", "worth_the_drive", "quiet_places", "with_kids",
  "under_budget", "saved_by_you", "similar_to_places_you_loved",
] as const;

export type FeedType = (typeof FEED_TYPES)[number];
export type RuntimeOperation =
  | "decision.create"
  | "feed.create"
  | "feed.update"
  | "today.create"
  | "today.update"
  | "trip.create"
  | "trip.update"
  | "sync.push";

export interface RuntimeEnvelope<T> {
  schemaVersion: typeof RUNTIME_SCHEMA_VERSION;
  updatedAt: string;
  data: T;
}

export interface RuntimeErrorEnvelope {
  schemaVersion: typeof RUNTIME_SCHEMA_VERSION;
  updatedAt: string;
  error: {
    code: V12ErrorCode | "INVALID_REQUEST" | "TEMPORARILY_UNAVAILABLE";
    message: string;
    retryable: boolean;
  };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function boundedRecord(value: unknown, maxBytes = 16_384): Record<string, unknown> | null {
  if (!isRecord(value)) return null;
  return JSON.stringify(value).length <= maxBytes ? value : null;
}

export function boundedString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized && normalized.length <= max ? normalized : null;
}

export function isFeedType(value: unknown): value is FeedType {
  return typeof value === "string" && (FEED_TYPES as readonly string[]).includes(value);
}

export function idempotencyKey(request: Request, body: Record<string, unknown>): string | null {
  return boundedString(request.headers.get("idempotency-key") ?? body.idempotencyKey, 160);
}

export async function parseRuntimeBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return boundedRecord(body, 64_000);
  } catch {
    return null;
  }
}
