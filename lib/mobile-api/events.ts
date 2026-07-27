import "server-only";
import { serviceClient } from "@/lib/supabase/service";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface MobileEventOccurrence {
  id: string;
  eventId: string;
  title: string;
  venueSlug: string | null;
  area: string | null;
  startsAt: string;
  endsAt: string;
  status: "scheduled" | "cancelled";
  cancellationReason: string | null;
  lastVerifiedAt: string;
  expiresAt: string;
}

export type MobileEventStoreUnavailableReason =
  | "client_unavailable"
  | "query_failed";

export class MobileEventStoreUnavailableError extends Error {
  readonly reason: MobileEventStoreUnavailableReason;

  constructor(reason: MobileEventStoreUnavailableReason) {
    super(`Mobile event store unavailable: ${reason}`);
    this.name = "MobileEventStoreUnavailableError";
    this.reason = reason;
  }
}

type EventStoreClientResolver = () => SupabaseClient | null;

export async function getActiveMobileEvents(
  now = new Date(),
  resolveClient: EventStoreClientResolver = serviceClient,
): Promise<MobileEventOccurrence[]> {
  const client = resolveClient();
  if (!client) {
    throw new MobileEventStoreUnavailableError("client_unavailable");
  }
  const iso = now.toISOString();
  let result;
  try {
    result = await client
      .from("v12_event_occurrences")
      .select("id,event_id,title,venue_slug,area,starts_at,ends_at,status,cancellation_reason,last_verified_at,expires_at")
      .eq("publication_status", "published")
      .gt("expires_at", iso)
      .order("starts_at", { ascending: true })
      .limit(100);
  } catch {
    throw new MobileEventStoreUnavailableError("query_failed");
  }
  const { data, error } = result;
  if (error || !data) {
    throw new MobileEventStoreUnavailableError("query_failed");
  }
  return data.map((row) => ({
    id: String(row.id),
    eventId: String(row.event_id),
    title: String(row.title),
    venueSlug: row.venue_slug ? String(row.venue_slug) : null,
    area: row.area ? String(row.area) : null,
    startsAt: String(row.starts_at),
    endsAt: String(row.ends_at),
    status: row.status === "cancelled" ? "cancelled" : "scheduled",
    cancellationReason: row.cancellation_reason ? String(row.cancellation_reason) : null,
    lastVerifiedAt: String(row.last_verified_at),
    expiresAt: String(row.expires_at),
  }));
}
