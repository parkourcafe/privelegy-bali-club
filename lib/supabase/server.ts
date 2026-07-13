import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Single anon client. Public reads go through RLS (planning tables are
// public-read). All writes to identity/consent/proof tables go through
// SECURITY DEFINER RPCs (see migration 0002) — so no service_role secret is
// needed anywhere in the app or in the deploy environment.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const previewProjectRef = process.env.OTHER_BALI_PREVIEW_SUPABASE_PROJECT_REF;
const KNOWN_PRODUCTION_PROJECT_REF = "egkdapqwkfprtyqvvnso";

export function isAnonEnvironmentSafe(input: {
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

export function isSupabaseConfigured(): boolean {
  return Boolean(
    url &&
      anonKey &&
      isAnonEnvironmentSafe({
        url,
        vercelEnv: process.env.VERCEL_ENV,
        previewProjectRef,
      }),
  );
}

// Local development may use the explicitly labelled fixture dataset. A public
// Vercel preview must never silently replace an unavailable staging database
// with those fixtures, because they contain invented pilot venues and offers.
export function isSeedFallbackAllowed(input: {
  nodeEnv?: string;
  vercelEnv?: string;
  allowFixtureData?: string;
} = {
  nodeEnv: process.env.NODE_ENV,
  vercelEnv: process.env.VERCEL_ENV,
  allowFixtureData: process.env.OTHER_BALI_ALLOW_FIXTURE_DATA,
}): boolean {
  return (
    input.nodeEnv === "development" &&
    !input.vercelEnv &&
    input.allowFixtureData === "YES"
  );
}

let _anon: SupabaseClient | null = null;

export function anonClient(): SupabaseClient | null {
  if (!isSupabaseConfigured() || !url || !anonKey) return null;
  if (!_anon) _anon = createClient(url, anonKey, { auth: { persistSession: false } });
  return _anon;
}
