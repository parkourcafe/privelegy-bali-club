"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { isPublishableActionTarget, isPublishableHttpsUrl } from "../../../components/admin/freshness-model";
import { requireAdminRequest } from "@/lib/admin-request-auth";
import { hasExplicitReviewConfirmation } from "@/lib/admin-review";
import { serviceClient } from "@/lib/supabase/service";
import { PUBLIC_CACHE_TAGS } from "@/lib/data/public-cache";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const REVIEW_TTL_MS = 60 * 24 * 60 * 60 * 1000;

function refreshPublicMenu() {
  revalidateTag(PUBLIC_CACHE_TAGS.menus, "max");
  revalidatePath("/admin/freshness");
  revalidatePath("/places/[slug]", "page");
}

function refreshPublicActions() {
  revalidateTag(PUBLIC_CACHE_TAGS.actions, "max");
  revalidatePath("/admin/freshness");
  revalidatePath("/places/[slug]", "page");
}

async function operatorClient() {
  await requireAdminRequest();
  const client = serviceClient();
  if (!client) throw new Error("Operator mutations are not configured for this environment.");
  return client;
}

function recordId(formData: FormData): string {
  const id = String(formData.get("id") ?? "");
  if (!UUID.test(id)) throw new Error("Invalid record id.");
  return id;
}

export async function publishMenu(formData: FormData) {
  const client = await operatorClient();
  const { data, error } = await client.rpc("publish_menu_version", { p_menu_id: recordId(formData) });
  if (error || !data || data.ok !== true) throw new Error(error?.message ?? data?.error ?? "Menu failed publication checks.");
  refreshPublicMenu();
}

export async function reviewMenu(formData: FormData) {
  const client = await operatorClient();
  if (!hasExplicitReviewConfirmation(formData.get("verification"))) {
    throw new Error("Open the official source and explicitly confirm the menu comparison before verification.");
  }
  const id = recordId(formData);
  const { data: menu, error } = await client.from("menus").select("id,status,completeness,source_url,source_label,captured_at").eq("id", id).single();
  if (error || !menu) throw new Error(error?.message ?? "Menu not found.");
  if (menu.completeness !== "full") throw new Error("Partial menu extracts cannot be verified or published as full menus.");
  if (!isPublishableHttpsUrl(menu.source_url) || !menu.source_label?.trim() || !Number.isFinite(Date.parse(menu.captured_at ?? ""))) {
    throw new Error("Menu evidence must be checked before review.");
  }
  const { count: sectionCount } = await client.from("menu_sections").select("id", { count: "exact", head: true }).eq("menu_id", id);
  const { count: itemCount } = await client.from("menu_items").select("id", { count: "exact", head: true }).eq("menu_id", id);
  if (!sectionCount || !itemCount) throw new Error("Menu needs at least one section and item.");
  const verifiedAt = new Date();
  const { data: reviewed, error: updateError } = await client
    .from("menus")
    .update({
      status: "review",
      verified_at: verifiedAt.toISOString(),
      expires_at: new Date(verifiedAt.getTime() + REVIEW_TTL_MS).toISOString(),
    })
    .eq("id", id)
    .eq("status", "draft")
    .select("id")
    .maybeSingle();
  if (updateError || !reviewed) throw new Error(updateError?.message ?? "Menu is no longer an unreviewed draft.");
  refreshPublicMenu();
}

export async function archiveMenu(formData: FormData) {
  const client = await operatorClient();
  const { error } = await client.from("menus").update({ status: "archived" }).eq("id", recordId(formData)).in("status", ["draft", "review", "published"]);
  if (error) throw new Error(error.message);
  refreshPublicMenu();
}

export async function confirmAction(formData: FormData) {
  const client = await operatorClient();
  if (!hasExplicitReviewConfirmation(formData.get("verification"))) {
    throw new Error("Open the official source and explicitly confirm the action before verification.");
  }
  const id = recordId(formData);
  const { data: candidate, error: candidateError } = await client
    .from("venue_action_capabilities")
    .select("id,kind,provider,url,source_url,status")
    .eq("id", id)
    .single();
  if (
    candidateError ||
    !candidate ||
    !["draft", "review"].includes(String(candidate.status)) ||
    !isPublishableActionTarget({
      kind: String(candidate.kind),
      provider: candidate.provider ? String(candidate.provider) : null,
      url: candidate.url ? String(candidate.url) : null,
      source_url: candidate.source_url ? String(candidate.source_url) : null,
    })
  ) {
    throw new Error(candidateError?.message ?? "Action destination or provider is not publishable.");
  }
  const { data, error } = await client.rpc("publish_action_capability", {
    p_capability_id: id,
  });
  if (error || !data || data.ok !== true) {
    throw new Error(error?.message ?? data?.error ?? "Action failed publication checks.");
  }
  refreshPublicActions();
}

export async function archiveAction(formData: FormData) {
  const client = await operatorClient();
  const { error } = await client.from("venue_action_capabilities").update({ status: "archived", updated_at: new Date().toISOString() }).eq("id", recordId(formData)).in("status", ["draft", "review", "confirmed", "disabled"]);
  if (error) throw new Error(error.message);
  refreshPublicActions();
}
