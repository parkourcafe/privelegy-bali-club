"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { evaluateActions, evaluateVenues, isPublishableHttpsUrl, type AdminActionRow, type AdminVenueRow } from "../../../components/admin/freshness-model";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function operatorClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminToken = process.env.ADMIN_ACCESS_TOKEN?.trim();
  if (!url || !key || !adminToken) throw new Error("Operator mutations are not configured.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function recordId(formData: FormData): string {
  const id = String(formData.get("id") ?? "");
  if (!UUID.test(id)) throw new Error("Invalid record id.");
  return id;
}

export async function publishMenu(formData: FormData) {
  const client = operatorClient();
  const { data, error } = await client.rpc("publish_menu_version", { p_menu_id: recordId(formData) });
  if (error || !data || data.ok !== true) throw new Error(error?.message ?? data?.error ?? "Menu failed publication checks.");
  revalidatePath("/admin/freshness");
}

export async function reviewMenu(formData: FormData) {
  const client = operatorClient();
  const id = recordId(formData);
  const { data: menu, error } = await client.from("menus").select("id,status,source_url,source_label,captured_at").eq("id", id).single();
  if (error || !menu) throw new Error(error?.message ?? "Menu not found.");
  if (!isPublishableHttpsUrl(menu.source_url) || !menu.source_label?.trim() || !Number.isFinite(Date.parse(menu.captured_at ?? ""))) {
    throw new Error("Menu evidence must be checked before review.");
  }
  const { count: sectionCount } = await client.from("menu_sections").select("id", { count: "exact", head: true }).eq("menu_id", id);
  const { count: itemCount } = await client.from("menu_items").select("id", { count: "exact", head: true }).eq("menu_id", id);
  if (!sectionCount || !itemCount) throw new Error("Menu needs at least one section and item.");
  const { error: updateError } = await client.from("menus").update({ status: "review", verified_at: new Date().toISOString() }).eq("id", id).eq("status", "draft");
  if (updateError) throw new Error(updateError.message);
  revalidatePath("/admin/freshness");
}

export async function archiveMenu(formData: FormData) {
  const client = operatorClient();
  const { error } = await client.from("menus").update({ status: "archived" }).eq("id", recordId(formData)).in("status", ["draft", "review", "published"]);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/freshness");
}

export async function confirmAction(formData: FormData) {
  const client = operatorClient();
  const id = recordId(formData);
  const { data: action, error } = await client.from("venue_action_capabilities").select("id,venue_slug,kind,status,url,source_url,source_label,captured_at,verified_at,expires_at").eq("id", id).single();
  if (error || !action) throw new Error(error?.message ?? "Action not found.");
  const { data: venue, error: venueError } = await client.from("venues").select("slug,status,publication_status,gmaps_url,last_verified_at").eq("slug", action.venue_slug).single();
  if (venueError || !venue) throw new Error(venueError?.message ?? "Parent venue not found.");
  const verifiedAt = new Date().toISOString();
  const actionBlockers = evaluateActions([{ ...action, status: "confirmed", verified_at: verifiedAt } as AdminActionRow]).filter((issue) => issue.severity === "blocker");
  const venueBlockers = evaluateVenues([venue as AdminVenueRow]).filter((issue) => issue.code === "venue_publication_blocker");
  if (actionBlockers.length || venueBlockers.length) throw new Error("Action failed URL, evidence, freshness or parent-publication checks.");
  const { error: updateError } = await client.from("venue_action_capabilities").update({ status: "confirmed", verified_at: verifiedAt, updated_at: verifiedAt }).eq("id", id).in("status", ["draft", "review"]);
  if (updateError) throw new Error(updateError.message);
  revalidatePath("/admin/freshness");
}

export async function archiveAction(formData: FormData) {
  const client = operatorClient();
  const { error } = await client.from("venue_action_capabilities").update({ status: "archived", updated_at: new Date().toISOString() }).eq("id", recordId(formData)).in("status", ["draft", "review", "confirmed", "disabled"]);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/freshness");
}
