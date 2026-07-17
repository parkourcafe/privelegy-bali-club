import type { SafeEventPayload } from "./event-payload";

export type EventRpcError = {
  code?: string | null;
};

export type EventRpcResult = {
  error: EventRpcError | null;
};

export type LogEventV2Args = {
  p_type: string;
  p_guest_ref: string;
  p_venue_slug: string | null;
  // First-touch acquisition source (villa_canggu_01, meta_au, …) or null. The
  // deployed log_event/log_event_v2 RPCs already accept a text p_source; it was
  // previously always null at this boundary.
  p_source: string | null;
  p_payload: SafeEventPayload | null;
};

export type LegacyLogEventArgs = {
  p_type: string;
  p_guest_ref: string;
  p_venue_slug: string | null;
  p_source: string | null;
};

export interface EventRpcClient {
  rpc(name: "log_event_v2", args: LogEventV2Args): PromiseLike<EventRpcResult>;
  rpc(name: "log_event", args: LegacyLogEventArgs): PromiseLike<EventRpcResult>;
}

// The project intentionally uses an ungenerated Supabase client. Keep the v2
// compatibility assertion at one boundary instead of claiming a global schema
// that may not yet be deployed.
export function asEventRpcClient(client: unknown): EventRpcClient {
  return client as EventRpcClient;
}
