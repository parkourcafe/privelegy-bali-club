"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Browser client — used ONLY for direct photo uploads to the venue-photos
// bucket during partner onboarding. Storage RLS restricts anon inserts to
// folders named by a valid onboarding token; everything else stays server-side.

let _client: SupabaseClient | null = null;

export function browserClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!_client) _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}
