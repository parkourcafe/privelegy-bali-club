import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Single anon client. Public reads go through RLS (planning tables are
// public-read). All writes to identity/consent/proof tables go through
// SECURITY DEFINER RPCs (see migration 0002) — so no service_role secret is
// needed anywhere in the app or in the deploy environment.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

let _anon: SupabaseClient | null = null;

export function anonClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!_anon) _anon = createClient(url, anonKey, { auth: { persistSession: false } });
  return _anon;
}
