import { JourneyError } from "./contracts";

export type OfflineAction =
  | "save"
  | "add_to_day"
  | "add_to_trip"
  | "visited"
  | "note"
  | "view_cached_details"
  | "view_cached_coordinates"
  | "view_cached_route"
  | "booking"
  | "delivery"
  | "website"
  | "instagram"
  | "whatsapp"
  | "live_directions"
  | "live_traffic";

const OFFLINE_SAFE = new Set<OfflineAction>([
  "save", "add_to_day", "add_to_trip", "visited", "note",
  "view_cached_details", "view_cached_coordinates", "view_cached_route",
]);

export function offlineCapability(action: OfflineAction): "offline_safe" | "online_required" {
  return OFFLINE_SAFE.has(action) ? "offline_safe" : "online_required";
}

export interface SyncMutation {
  idempotencyKey: string;
  entityType: "saved" | "visited" | "note" | "trip_stop";
  entityId: string;
  operation: string;
  payload: Record<string, unknown>;
  baseVersion: string | null;
  createdAt: string;
}

export interface SyncConflict {
  mutation: SyncMutation;
  code: "SYNC_CONFLICT" | "SYNC_VERSION_MISMATCH";
  serverVersion: string;
}

export class SyncQueue {
  readonly #pending = new Map<string, SyncMutation>();

  enqueue(mutation: SyncMutation): boolean {
    if (!mutation.idempotencyKey.trim()) throw new Error("Idempotency key is required");
    if (this.#pending.has(mutation.idempotencyKey)) return false;
    this.#pending.set(mutation.idempotencyKey, mutation);
    return true;
  }

  list(): SyncMutation[] {
    return [...this.#pending.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  acknowledge(idempotencyKey: string): void {
    this.#pending.delete(idempotencyKey);
  }

  resolveVersion(mutation: SyncMutation, serverVersion: string): void {
    if (mutation.baseVersion !== null && mutation.baseVersion !== serverVersion) {
      throw new JourneyError("SYNC_VERSION_MISMATCH", "Server data changed while offline");
    }
  }
}

export interface OfflineSnapshot<T> {
  schemaVersion: 1;
  level: 1 | 2;
  updatedAt: string;
  data: T;
}

export function offlineFreshnessLabel(updatedAt: string, online: boolean): string | null {
  if (online) return null;
  const timestamp = Date.parse(updatedAt);
  if (!Number.isFinite(timestamp)) throw new Error("Offline snapshot timestamp is invalid");
  return `Offline · last updated ${new Date(timestamp).toISOString()}`;
}

