import type { SafeEventPayload } from "./event-payload";

export type EventRpcError = {
  code?: string | null;
};

export type EventRpcResult = {
  data?: unknown;
  error: EventRpcError | null;
};

export type LogEventV3Args = {
  p_type: string;
  p_guest_ref: string;
  p_venue_slug: string | null;
  p_source: string | null;
  p_payload: SafeEventPayload | null;
};

export type CaptureSourceScanArgs = {
  p_guest_ref: string;
  p_source: string;
};

export type LogEventV2Args = {
  p_type: string;
  p_guest_ref: string;
  p_venue_slug: string | null;
  p_source: null;
  p_payload: SafeEventPayload | null;
};

export type LegacyLogEventArgs = {
  p_type: string;
  p_guest_ref: string;
  p_venue_slug: string | null;
  p_source: null;
};

export interface EventRpcClient {
  rpc(name: "log_event_v2", args: LogEventV2Args): PromiseLike<EventRpcResult>;
  rpc(name: "log_event", args: LegacyLogEventArgs): PromiseLike<EventRpcResult>;
}

export interface EventV3RpcClient {
  rpc(name: "log_event_v3", args: LogEventV3Args): PromiseLike<EventRpcResult>;
}

export interface SourceScanRpcClient {
  rpc(name: "capture_source_scan", args: CaptureSourceScanArgs): PromiseLike<EventRpcResult>;
}

// The project intentionally uses an ungenerated Supabase client. Keep the RPC
// compatibility assertion at one boundary instead of claiming a global schema
// that may not yet be deployed.
export function asEventRpcClient(client: unknown): EventRpcClient {
  return client as EventRpcClient;
}

export function asEventV3RpcClient(client: unknown): EventV3RpcClient {
  return client as EventV3RpcClient;
}

export function asSourceScanRpcClient(client: unknown): SourceScanRpcClient {
  return client as SourceScanRpcClient;
}
