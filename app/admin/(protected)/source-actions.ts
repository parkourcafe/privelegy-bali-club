"use server";

import { revalidatePath } from "next/cache";
import { requireAdminRequest } from "@/lib/admin-request-auth";
import { isSourceId } from "@/lib/source-attribution";
import { serviceClient } from "@/lib/supabase/service";

const SOURCE_CLASSES = new Set(["external", "creator", "in_venue"]);

async function operatorClient() {
  await requireAdminRequest();
  const client = serviceClient();
  if (!client) throw new Error("Attribution source management is not configured.");
  return client;
}

export async function createAttributionSource(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();
  const sourceClass = String(formData.get("sourceClass") ?? "").trim();
  if (!isSourceId(id) || label.length < 2 || label.length > 160 || !SOURCE_CLASSES.has(sourceClass)) {
    throw new Error("Enter a valid unique source ID, label and class.");
  }
  const client = await operatorClient();
  const { error } = await client.from("attribution_sources").insert({
    id,
    label,
    source_class: sourceClass,
    active: true,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function deactivateAttributionSource(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!isSourceId(id)) throw new Error("Invalid source ID.");
  const client = await operatorClient();
  const { error } = await client
    .from("attribution_sources")
    .update({ active: false })
    .eq("id", id)
    .eq("active", true);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}
