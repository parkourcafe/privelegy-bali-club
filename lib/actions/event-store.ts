import type {
  EventRpcClient,
  LegacyLogEventArgs,
  LogEventV2Args,
} from "./event-compat";
import type { AllowedEventType } from "./event-safety";
import type { SafeEventPayload } from "./event-payload";

export type EventStoreInput = {
  type: AllowedEventType;
  guestRef: string;
  venueSlug: string | null;
  payload: SafeEventPayload | null;
  // First-touch acquisition source for this guest, stamped onto the event row
  // so attribution travels with every event. Null when the guest arrived with
  // no source tag.
  source: string | null;
};

export type EventStoreResult = {
  stored: boolean;
  version: "v2" | "legacy";
};

const MISSING_V2_CODES = new Set(["PGRST202", "42883"]);
const V2_EVENT_TYPES = new Set<AllowedEventType>([
  "menu_open",
  "menu_item_open",
  "action_handoff",
  "delivery_click",
  "takeaway_click",
  "preorder_click",
]);

async function storeLegacyEvent(
  client: EventRpcClient,
  input: EventStoreInput
): Promise<EventStoreResult> {
  const legacyArgs = {
    p_type: input.type,
    p_guest_ref: input.guestRef,
    p_venue_slug: input.venueSlug,
    p_source: input.source,
  } satisfies LegacyLogEventArgs;

  try {
    const legacyResult = await client.rpc("log_event", legacyArgs);
    return { stored: !legacyResult.error, version: "legacy" };
  } catch {
    return { stored: false, version: "legacy" };
  }
}

export async function storeEvent(
  client: EventRpcClient,
  input: EventStoreInput
): Promise<EventStoreResult> {
  // Session 1's v2 RPC intentionally accepts only the six additive events.
  // Preserve the deployed funnel by sending every existing event directly to
  // log_event instead of probing a v2 function that would no-op by design.
  if (!V2_EVENT_TYPES.has(input.type)) {
    return storeLegacyEvent(client, input);
  }

  const v2Args = {
    p_type: input.type,
    p_guest_ref: input.guestRef,
    p_venue_slug: input.venueSlug,
    p_source: input.source,
    p_payload: input.payload,
  } satisfies LogEventV2Args;

  let v2Result;
  try {
    v2Result = await client.rpc("log_event_v2", v2Args);
  } catch {
    return { stored: false, version: "v2" };
  }

  if (!v2Result.error) return { stored: true, version: "v2" };
  if (!v2Result.error.code || !MISSING_V2_CODES.has(v2Result.error.code)) {
    return { stored: false, version: "v2" };
  }

  return storeLegacyEvent(client, input);
}
