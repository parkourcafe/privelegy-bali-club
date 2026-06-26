import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Two server-side clients:
//  - anon: public reads (planning layer)
//  - service: privileged writes (guest_refs, consent_log, redemption_events)
// We never ship the service key to the browser. All redemption/consent writes
// go through API routes that use the service client.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

export function hasServiceRole(): boolean {
  return Boolean(url && serviceKey);
}

let _anon: SupabaseClient | null = null;
let _service: SupabaseClient | null = null;

export function anonClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!_anon) _anon = createClient(url, anonKey, { auth: { persistSession: false } });
  return _anon;
}

export function serviceClient(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  if (!_service)
    _service = createClient(url, serviceKey, { auth: { persistSession: false } });
  return _service;
}
