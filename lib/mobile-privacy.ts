import "server-only";

import { isGuestRef } from "@/lib/guest-server";
import { serviceClient } from "@/lib/supabase/service";

export const RETAINED_PRIVACY_RECORDS = [
  "a bare revoked pseudonymous guest reference and erasure timestamp retained indefinitely to prevent replay",
  "existing redemption proof detached from the installation reference and retained for partner proof, accounting, and applicable legal needs",
  "corresponding granted redemption consent evidence with device-specific fields removed",
] as const;

export interface GuestErasureResult {
  ok: boolean;
  deleted: boolean;
  retainedRedemptions: number;
  retainedConsents: number;
  error?: "invalid_guest" | "privacy_store_unavailable";
}

interface ErasureRpcResult {
  ok?: unknown;
  deleted?: unknown;
  retainedRedemptions?: unknown;
  retainedConsents?: unknown;
  error?: unknown;
}

/**
 * Delete mutable traveller state through the service-role-only
 * forget_guest_v12 SECURITY DEFINER RPC.
 *
 * A missing guest is a successful idempotent deletion. A storage/RPC failure is
 * never reported as success, because the UI must not claim erasure it cannot
 * confirm.
 */
export async function eraseGuestData(guestRef: string): Promise<GuestErasureResult> {
  if (!isGuestRef(guestRef)) {
    return {
      ok: false,
      deleted: false,
      retainedRedemptions: 0,
      retainedConsents: 0,
      error: "invalid_guest",
    };
  }

  const client = serviceClient();
  if (!client) {
    return {
      ok: false,
      deleted: false,
      retainedRedemptions: 0,
      retainedConsents: 0,
      error: "privacy_store_unavailable",
    };
  }

  const { data, error } = await client.rpc("forget_guest_v12", {
    p_guest_ref: guestRef,
  });
  if (error || !data || typeof data !== "object") {
    return {
      ok: false,
      deleted: false,
      retainedRedemptions: 0,
      retainedConsents: 0,
      error: "privacy_store_unavailable",
    };
  }

  const result = data as ErasureRpcResult;
  if (
    result.ok !== true
    || result.deleted !== true
    || !Number.isSafeInteger(result.retainedRedemptions)
    || Number(result.retainedRedemptions) < 0
    || !Number.isSafeInteger(result.retainedConsents)
    || Number(result.retainedConsents) < 0
  ) {
    return {
      ok: false,
      deleted: false,
      retainedRedemptions: 0,
      retainedConsents: 0,
      error: "privacy_store_unavailable",
    };
  }

  return {
    ok: true,
    deleted: true,
    retainedRedemptions: Number(result.retainedRedemptions),
    retainedConsents: Number(result.retainedConsents),
  };
}
