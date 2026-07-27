import "server-only";
import { serviceClient } from "@/lib/supabase/service";

export interface MobileEventOccurrence {
  id: string;
  eventId: string;
  title: string;
  venueSlug: string | null;
  area: string | null;
  startsAt: string;
  endsAt: string;
  lastVerifiedAt: string;
  expiresAt: string;
}

export async function getActiveMobileEvents(now = new Date()): Promise<MobileEventOccurrence[]> {
  const client = serviceClient();
  if (!client) return [];
  const iso = now.toISOString();
  const { data, error } = await client
    .from("v12_event_occurrences")
    .select("id,event_id,title,venue_slug,area,starts_at,ends_at,last_verified_at,expires_at")
    .eq("status", "scheduled")
    .eq("publication_status", "published")
    .gt("ends_at", iso)
    .gt("expires_at", iso)
    .order("starts_at", { ascending: true })
    .limit(100);
  if (error || !data) return [];
  return data.map((row) => ({
    id: String(row.id),
    eventId: String(row.event_id),
    title: String(row.title),
    venueSlug: row.venue_slug ? String(row.venue_slug) : null,
    area: row.area ? String(row.area) : null,
    startsAt: String(row.starts_at),
    endsAt: String(row.ends_at),
    lastVerifiedAt: String(row.last_verified_at),
    expiresAt: String(row.expires_at),
  }));
}
