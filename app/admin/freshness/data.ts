import { createClient } from "@supabase/supabase-js";
import {
  evaluateActions, evaluateMenus, evaluateVenues, sortFreshnessIssues,
  type AdminActionRow, type AdminMenuRow, type AdminVenueRow, type FreshnessIssue,
} from "../../../components/admin/freshness-model";

export type FreshnessQueueResult = {
  configured: boolean;
  issues: FreshnessIssue[];
  error: string | null;
  counts: { menus: number; actions: number; venues: number };
};

export async function getFreshnessQueue(): Promise<FreshnessQueueResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return { configured: false, issues: [], error: null, counts: { menus: 0, actions: 0, venues: 0 } };

  const client = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const [menuResult, sectionResult, itemResult, actionResult, venueResult] = await Promise.all([
    client.from("menus").select("id,venue_slug,status,source_url,source_label,captured_at,verified_at,expires_at"),
    client.from("menu_sections").select("menu_id"),
    client.from("menu_items").select("menu_id"),
    client.from("venue_action_capabilities").select("id,venue_slug,kind,status,url,source_url,source_label,captured_at,verified_at,expires_at"),
    client.from("venues").select("slug,status,publication_status,gmaps_url,last_verified_at"),
  ]);
  const firstError = menuResult.error ?? sectionResult.error ?? itemResult.error ?? actionResult.error ?? venueResult.error;
  if (firstError) return { configured: true, issues: [], error: firstError.message, counts: { menus: 0, actions: 0, venues: 0 } };

  const sectionCounts = new Map<string, number>();
  const itemCounts = new Map<string, number>();
  for (const row of sectionResult.data ?? []) sectionCounts.set(String(row.menu_id), (sectionCounts.get(String(row.menu_id)) ?? 0) + 1);
  for (const row of itemResult.data ?? []) itemCounts.set(String(row.menu_id), (itemCounts.get(String(row.menu_id)) ?? 0) + 1);
  const menus = (menuResult.data ?? []).map((row) => ({ ...row, section_count: sectionCounts.get(String(row.id)) ?? 0, item_count: itemCounts.get(String(row.id)) ?? 0 })) as AdminMenuRow[];
  const actions = (actionResult.data ?? []) as AdminActionRow[];
  const venues = (venueResult.data ?? []) as AdminVenueRow[];
  return {
    configured: true,
    issues: sortFreshnessIssues([...evaluateMenus(menus), ...evaluateActions(actions), ...evaluateVenues(venues)]),
    error: null,
    counts: { menus: menus.length, actions: actions.length, venues: venues.length },
  };
}

