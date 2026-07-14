import { cache } from "react";
import type { MenuRecord, MenuSummary } from "../contracts/menu-action";
import { mapPublishedMenu, mapPublicMenuSummary, type DataRow } from "../domain/menu";
import { anonClient, isSupabaseConfigured } from "../supabase/server";

type MenuLookup =
  | { available: true; menu: MenuRecord | null }
  | { available: false; menu: null };

type MenuSummaryLookup =
  | { available: true; menus: MenuSummary[] }
  | { available: false; menus: [] };

const loadPublishedMenu = cache(async (venueSlug: string): Promise<MenuLookup> => {
  if (!venueSlug) return { available: true, menu: null };
  if (!isSupabaseConfigured()) return { available: false, menu: null };
  const client = anonClient();
  if (!client) return { available: false, menu: null };
  try {
    const { data: menus, error } = await client
      .from("menus")
      .select("id,venue_slug,title,version,status,completeness,source_url,source_label,captured_at,verified_at,expires_at")
      .eq("venue_slug", venueSlug)
      .in("status", ["published", "source_snapshot"])
      .order("version", { ascending: false })
      .limit(1);
    if (error) return { available: false, menu: null };
    if (!menus?.[0]) return { available: true, menu: null };
    const menu = menus[0] as DataRow;
    const [{ data: sections, error: sectionError }, { data: items, error: itemError }] = await Promise.all([
      client.from("menu_sections").select("id,menu_id,name,description,position").eq("menu_id", menu.id).order("position"),
      client.from("menu_items").select("id,section_id,name,description,price_minor,currency,price_text,dietary_tags,verified_allergen_tags,partner_recommended,editorial_pick,editorial_note,availability_note,position").eq("menu_id", menu.id).order("position"),
    ]);
    if (sectionError || itemError) return { available: false, menu: null };
    return {
      available: true,
      menu: mapPublishedMenu(menu, (sections ?? []) as DataRow[], (items ?? []) as DataRow[]),
    };
  } catch {
    return { available: false, menu: null };
  }
});

export async function getPublishedMenu(venueSlug: string): Promise<MenuRecord | null> {
  const result = await loadPublishedMenu(venueSlug);
  if (!result.available) throw new Error("Public menu service is temporarily unavailable");
  return result.menu;
}

export async function getPublishedMenuOptional(venueSlug: string): Promise<MenuRecord | null> {
  const result = await loadPublishedMenu(venueSlug);
  return result.available ? result.menu : null;
}

const loadPublicMenuSummaries = cache(async (): Promise<MenuSummaryLookup> => {
  if (!isSupabaseConfigured()) return { available: false, menus: [] };
  const client = anonClient();
  if (!client) return { available: false, menus: [] };
  try {
    const { data, error } = await client
      .from("menus")
      .select("id,venue_slug,title,version,status,completeness,source_url,source_label,captured_at,verified_at,expires_at")
      .in("status", ["published", "source_snapshot"])
      .order("title")
      .limit(500);
    if (error) return { available: false, menus: [] };
    const menus = (data ?? [])
      .map((row) => mapPublicMenuSummary(row as DataRow))
      .filter((row): row is MenuSummary => row !== null)
      .sort((a, b) => a.title.localeCompare(b.title) || a.venueSlug.localeCompare(b.venueSlug));
    return { available: true, menus };
  } catch {
    return { available: false, menus: [] };
  }
});

export async function getPublicMenuSummaries(): Promise<MenuSummary[]> {
  const result = await loadPublicMenuSummaries();
  if (!result.available) throw new Error("Public menu service is temporarily unavailable");
  return result.menus;
}

export async function getPublicMenuSummariesOptional(): Promise<MenuSummary[]> {
  const result = await loadPublicMenuSummaries();
  return result.available ? result.menus : [];
}
