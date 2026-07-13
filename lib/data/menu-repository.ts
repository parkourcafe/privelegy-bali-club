import type { MenuRecord } from "../contracts/menu-action";
import { mapPublishedMenu, type DataRow } from "../domain/menu";
import { anonClient, isSupabaseConfigured } from "../supabase/server";

export async function getPublishedMenu(venueSlug: string): Promise<MenuRecord | null> {
  if (!venueSlug || !isSupabaseConfigured()) return null;
  const client = anonClient();
  if (!client) return null;
  try {
    const { data: menus, error } = await client
      .from("menus")
      .select("id,venue_slug,title,version,status,source_url,source_label,captured_at,verified_at,expires_at")
      .eq("venue_slug", venueSlug)
      .eq("status", "published")
      .order("version", { ascending: false })
      .limit(1);
    if (error || !menus?.[0]) return null;
    const menu = menus[0] as DataRow;
    const [{ data: sections, error: sectionError }, { data: items, error: itemError }] = await Promise.all([
      client.from("menu_sections").select("id,menu_id,name,description,position").eq("menu_id", menu.id).order("position"),
      client.from("menu_items").select("id,section_id,name,description,price_minor,currency,dietary_tags,verified_allergen_tags,partner_recommended,editorial_pick,editorial_note,availability_note,position").eq("menu_id", menu.id).order("position"),
    ]);
    if (sectionError || itemError) return null;
    return mapPublishedMenu(menu, (sections ?? []) as DataRow[], (items ?? []) as DataRow[]);
  } catch {
    return null;
  }
}
