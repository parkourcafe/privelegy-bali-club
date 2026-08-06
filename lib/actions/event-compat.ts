import type { SafeEventPayload } from "./event-payload";

export type EventRpcError = {
  code?: string | null;
};

export type EventRpcResult = {
  error: EventRpcError | null;
};

// p_source carries the guest's first-touch attribution source. It was typed as
// `null` here, which made an unattributed funnel a compile-time guarantee — see
// lib/actions/guest-source.ts. Only a source confirmed active may be passed:
// log_event drops events whose source is not an active attribution row.
export type LogEventV2Args = {
  p_type: string;
  p_guest_ref: string;
  p_venue_slug: string | null;
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
