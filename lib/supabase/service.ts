import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const previewProjectRef = process.env.OTHER_BALI_PREVIEW_SUPABASE_PROJECT_REF;
const KNOWN_PRODUCTION_PROJECT_REF = "egkdapqwkfprtyqvvnso";

let client: SupabaseClient | null = null;

export function isServiceEnvironmentSafe(input: {
  url?: string;
  vercelEnv?: string;
  previewProjectRef?: string;
}): boolean {
  if (input.vercelEnv !== "preview") return true;
  const ref = input.previewProjectRef?.trim();
  if (!input.url || !ref || ref === KNOWN_PRODUCTION_PROJECT_REF) return false;
  try {
    const parsed = new URL(input.url);
    return parsed.protocol === "https:" && parsed.hostname === `${ref}.supabase.co`;
  } catch {
    return false;
  }
}

export function serviceClient(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  if (!isServiceEnvironmentSafe({
    url,
    vercelEnv: process.env.VERCEL_ENV,
    previewProjectRef,
  })) return null;
  if (!client) {
    client = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
