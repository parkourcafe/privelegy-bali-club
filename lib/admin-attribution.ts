import "server-only";

import { requireAdminRequest } from "./admin-request-auth";
import { isSourceId } from "./source-attribution";
import { serviceClient } from "./supabase/service";

export type AttributionSourceRow = {
  id: string;
  label: string;
  sourceClass: "external" | "creator" | "in_venue";
  active: boolean;
};

export async function listAttributionSources(): Promise<AttributionSourceRow[]> {
  await requireAdminRequest();
  const client = serviceClient();
  if (!client) return [];
  const { data, error } = await client
    .from("attribution_sources")
    .select("id,label,source_class,active")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((row) => ({
    id: String(row.id),
    label: String(row.label),
    sourceClass: row.source_class as AttributionSourceRow["sourceClass"],
    active: Boolean(row.active),
  }));
}

export async function isIssuedAttributionSource(source: string): Promise<boolean> {
  await requireAdminRequest();
  if (!isSourceId(source)) return false;
  const client = serviceClient();
  if (!client) return false;
  const { data, error } = await client
    .from("attribution_sources")
    .select("id")
    .eq("id", source)
    .eq("active", true)
    .maybeSingle();
  return !error && Boolean(data);
}
