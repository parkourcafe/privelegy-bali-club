import type { StoredConsentState } from "./consent";

export interface PrivacyRpcResult {
  data: unknown;
  error: { code?: string | null } | null;
}

export interface PrivacyRpcClient {
  rpc(name: string, args: Record<string, unknown>): PromiseLike<PrivacyRpcResult>;
}

export interface GuestDataExport {
  ok: true;
  version: 1;
  data: {
    identity: unknown;
    consents: unknown[];
    events: unknown[];
    redemptions: unknown[];
    savedPlaces: unknown[];
    sharedLists: unknown[];
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function emptyGuestDataExport(): GuestDataExport {
  return {
    ok: true,
    version: 1,
    data: {
      identity: null,
      consents: [],
      events: [],
      redemptions: [],
      savedPlaces: [],
      sharedLists: [],
    },
  };
}

export async function recordGuestConsent(
  client: PrivacyRpcClient,
  input: {
    state: StoredConsentState;
    version: string;
    guestRef: string | null;
    userAgent: string | null;
  },
): Promise<boolean> {
  try {
    const result = await client.rpc("record_guest_consent", {
      p_state: input.state,
      p_consent_version: input.version,
      p_guest_ref: input.guestRef,
      p_user_agent: input.userAgent,
    });
    return !result.error && isRecord(result.data) && result.data.ok === true;
  } catch {
    return false;
  }
}

export async function exportGuestData(
  client: PrivacyRpcClient,
  guestRef: string,
): Promise<GuestDataExport | null> {
  try {
    const result = await client.rpc("export_guest_data", { p_guest_ref: guestRef });
    if (result.error || !isRecord(result.data) || result.data.ok !== true || result.data.version !== 1) {
      return null;
    }
    const data = result.data.data;
    if (!isRecord(data)) return null;
    for (const key of ["consents", "events", "redemptions", "savedPlaces", "sharedLists"]) {
      if (!Array.isArray(data[key])) return null;
    }
    return result.data as unknown as GuestDataExport;
  } catch {
    return null;
  }
}

export async function deleteGuestData(
  client: PrivacyRpcClient,
  guestRef: string,
): Promise<boolean> {
  try {
    const result = await client.rpc("delete_guest_data", { p_guest_ref: guestRef });
    return !result.error && isRecord(result.data) &&
      result.data.ok === true && result.data.status === "completed";
  } catch {
    return false;
  }
}
