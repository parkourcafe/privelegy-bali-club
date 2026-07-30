import "server-only";
import { serviceClient } from "@/lib/supabase/service";
import type { RuntimeOperation } from "./contracts";

export interface RuntimeMutationResult {
  ok: boolean;
  replayed?: boolean;
  error?: string;
  [key: string]: unknown;
}

export async function mutateRuntime(
  guestRef: string,
  operation: RuntimeOperation,
  input: Record<string, unknown>,
  idempotencyKey: string,
): Promise<RuntimeMutationResult> {
  const client = serviceClient();
  if (!client) return { ok: false, error: "runtime_unavailable" };
  const { data, error } = await client.rpc("v12_runtime_mutate", {
    p_guest_ref: guestRef,
    p_operation: operation,
    p_input: input,
    p_idempotency_key: idempotencyKey,
  });
  if (error || !data || typeof data !== "object") return { ok: false, error: "runtime_unavailable" };
  return data as RuntimeMutationResult;
}

export async function readRuntime(
  guestRef: string,
  resource: "feed" | "today" | "trip" | "sync",
  id?: string,
): Promise<RuntimeMutationResult> {
  const client = serviceClient();
  if (!client) return { ok: false, error: "runtime_unavailable" };
  const { data, error } = await client.rpc("v12_runtime_read", {
    p_guest_ref: guestRef,
    p_resource: resource,
    p_id: id ?? null,
  });
  if (error || !data || typeof data !== "object") return { ok: false, error: "runtime_unavailable" };
  return data as RuntimeMutationResult;
}
