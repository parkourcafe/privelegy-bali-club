import { cache as reactCache } from "react";
import { unstable_cache } from "next/cache";
import type { VenueActionCapabilityRecord } from "../contracts/menu-action";
import { mapPublishedActionCapability, sortActionCapabilities } from "../domain/actions";
import type { DataRow } from "../domain/menu";
import { anonClient, isSupabaseConfigured } from "../supabase/server";
import {
  PUBLIC_CACHE_REVALIDATE_SECONDS,
  PUBLIC_CACHE_TAGS,
} from "./public-cache";

async function fetchPublishedActionCapabilities(
  venueSlug: string
): Promise<VenueActionCapabilityRecord[]> {
  if (!venueSlug || !isSupabaseConfigured()) return [];
  const client = anonClient();
  if (!client) return [];
  try {
    const { data, error } = await client
      .from("venue_action_capabilities")
      .select("id,venue_slug,kind,provider,url,label,status,priority,confirmation_required,source_url,source_label,captured_at,verified_at,expires_at")
      .eq("venue_slug", venueSlug)
      .eq("status", "confirmed")
      .order("priority");
    if (error || !data) return [];
    return sortActionCapabilities(
      (data as DataRow[]).map((row) => mapPublishedActionCapability(row)).filter(
        (record): record is VenueActionCapabilityRecord => record !== null
      )
    );
  } catch {
    return [];
  }
}

const getCachedPublishedActionCapabilities = unstable_cache(
  fetchPublishedActionCapabilities,
  ["published-action-capabilities-v1"],
  {
    revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.actions],
  },
);

export const getPublishedActionCapabilities = reactCache(
  getCachedPublishedActionCapabilities,
);
