import type {
  EventV3RpcClient,
  LogEventV3Args,
  SourceScanRpcClient,
} from "./event-compat";
import type { EventStoreInput } from "./event-store";

export type RateLimitedEventResult =
  | { status: "stored" }
  | { status: "rate_limited"; retryAfterSeconds: number }
  | { status: "consent_required" }
  | { status: "unavailable" };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function retryAfter(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 60;
  return Math.max(1, Math.min(60, Math.ceil(value)));
}

async function storeAtomicEvent(
  client: EventV3RpcClient,
  args: LogEventV3Args,
): Promise<RateLimitedEventResult> {
  try {
    const result = await client.rpc("log_event_v3", args);
    if (result.error || !isRecord(result.data)) return { status: "unavailable" };
    if (result.data.ok === true) return { status: "stored" };
    if (result.data.error === "rate_limited") {
      return {
        status: "rate_limited",
        retryAfterSeconds: retryAfter(result.data.retry_after_seconds),
      };
    }
    if (
      result.data.error === "analytics_consent_required" ||
      result.data.error === "consent_required"
    ) {
      return { status: "consent_required" };
    }
    return { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  }
}

async function mapSourceScanResult(
  client: SourceScanRpcClient,
  input: { guestRef: string; source: string },
): Promise<RateLimitedEventResult> {
  try {
    const result = await client.rpc("capture_source_scan", {
      p_guest_ref: input.guestRef,
      p_source: input.source,
    });
    if (result.error || !isRecord(result.data)) return { status: "unavailable" };
    if (result.data.ok === true) return { status: "stored" };
    if (result.data.error === "rate_limited") {
      return {
        status: "rate_limited",
        retryAfterSeconds: retryAfter(result.data.retry_after_seconds),
      };
    }
    if (
      result.data.error === "analytics_consent_required"
      || result.data.error === "consent_required"
    ) return { status: "consent_required" };
    return { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  }
}

export async function storeRateLimitedEvent(
  client: EventV3RpcClient,
  input: EventStoreInput,
): Promise<RateLimitedEventResult> {
  const args = {
    p_type: input.type,
    p_guest_ref: input.guestRef,
    p_venue_slug: input.venueSlug,
    p_source: null,
    p_payload: input.payload,
  } satisfies LogEventV3Args;

  return storeAtomicEvent(client, args);
}

// Separate server-only entry point for acquisition capture. The public event
// parser has no source_scan event and storeRateLimitedEvent hard-codes source
// to null, so a browser cannot turn this into an arbitrary analytics dimension.
export async function storeRateLimitedSourceScan(
  client: SourceScanRpcClient,
  input: { guestRef: string; source: string },
): Promise<RateLimitedEventResult> {
  return mapSourceScanResult(client, input);
}
