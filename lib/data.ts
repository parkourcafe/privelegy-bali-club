import { anonClient, serviceClient, isSupabaseConfigured } from "./supabase/server";
import { VENUES, PERKS, PLAN_ENTRIES } from "./seed";
import type { Venue, Perk, PlanEntry, Slot, RedemptionResult } from "./types";
import { SLOTS } from "./types";
import { customAlphabet } from "nanoid";

// 6-digit numeric confirm code shown to staff at the counter.
const confirmCode = customAlphabet("0123456789", 6);

export interface VenueWithPerk extends Venue {
  perk: Perk | null;
  blurb: string;
}

export interface PlanBySlot {
  slot: Slot;
  label: string;
  hint: string;
  venues: VenueWithPerk[];
}

// Postgres columns are snake_case; the domain types are camelCase. Map at the
// boundary so the rest of the app never sees DB naming.
type Row = Record<string, unknown>;
const mapVenue = (r: Row): Venue => ({
  id: r.id as string,
  slug: r.slug as string,
  name: r.name as string,
  category: r.category as Venue["category"],
  district: r.district as string,
  address: r.address as string,
  gmapsUrl: r.gmaps_url as string,
  tier: r.tier as Venue["tier"],
  isSponsored: Boolean(r.is_sponsored),
});
const mapPerk = (r: Row): Perk => ({
  id: r.id as string,
  venueSlug: r.venue_slug as string,
  title: r.title as string,
  terms: r.terms as string,
});
const mapPlan = (r: Row): PlanEntry => ({
  venueSlug: r.venue_slug as string,
  slot: r.slot as Slot,
  rank: r.rank as number,
  blurb: r.blurb as string,
});

// ---- Read layer (planning form, G0) ----
// Falls back to seed data when Supabase is not configured, so the app builds
// and demos without a live DB. Reads are public either way.

export async function getCangguPlan(): Promise<PlanBySlot[]> {
  let venues = VENUES;
  let perks = PERKS;
  let entries = PLAN_ENTRIES;

  if (isSupabaseConfigured()) {
    const sb = anonClient()!;
    const [{ data: v }, { data: p }, { data: e }] = await Promise.all([
      sb.from("venues").select("*").eq("district", "canggu").eq("status", "active"),
      sb.from("perks").select("*").eq("active", true),
      sb.from("plan_entries").select("*").eq("district", "canggu"),
    ]);
    if (v?.length) venues = (v as Row[]).map(mapVenue);
    if (p?.length) perks = (p as Row[]).map(mapPerk);
    if (e?.length) entries = (e as Row[]).map(mapPlan);
  }

  const venueBySlug = new Map(venues.map((x) => [x.slug, x]));
  const perkByVenue = new Map(perks.map((x) => [x.venueSlug, x]));

  return SLOTS.map(({ key, label, hint }) => {
    const venuesForSlot: VenueWithPerk[] = entries
      .filter((en) => en.slot === key)
      .sort((a, b) => a.rank - b.rank)
      .map((en) => {
        const venue = venueBySlug.get(en.venueSlug);
        if (!venue) return null;
        return { ...venue, perk: perkByVenue.get(en.venueSlug) ?? null, blurb: en.blurb };
      })
      .filter((x): x is VenueWithPerk => x !== null);
    return { slot: key, label, hint, venues: venuesForSlot };
  });
}

export async function getVenueWithPerk(slug: string): Promise<VenueWithPerk | null> {
  let venue: Venue | undefined = VENUES.find((v) => v.slug === slug);
  let perk: Perk | undefined = PERKS.find((p) => p.venueSlug === slug);

  if (isSupabaseConfigured()) {
    const sb = anonClient()!;
    const { data: v } = await sb.from("venues").select("*").eq("slug", slug).maybeSingle();
    if (v) venue = mapVenue(v as Row);
    const { data: p } = await sb
      .from("perks")
      .select("*")
      .eq("venue_slug", slug)
      .eq("active", true)
      .maybeSingle();
    if (p) perk = mapPerk(p as Row);
  }

  if (!venue) return null;
  const entry = PLAN_ENTRIES.find((e) => e.venueSlug === slug);
  return { ...venue, perk: perk ?? null, blurb: entry?.blurb ?? "" };
}

// ---- Write layer (redemption, G1) ----
// Requires the service role. Without it we cannot prove a redemption, so we
// fail loudly rather than pretend.

export async function recordRedemption(input: {
  guestRef: string;
  venueSlug: string;
  consentGranted: boolean;
  userAgent: string;
}): Promise<RedemptionResult> {
  const venue = await getVenueWithPerk(input.venueSlug);
  if (!venue) return { ok: false, error: "venue_not_found" };

  const code = confirmCode();
  const ts = new Date().toISOString();

  const sb = serviceClient();
  if (!sb) {
    // No DB configured: cannot record proof. Return a clear, non-faked error.
    return { ok: false, error: "redemption_storage_unconfigured" };
  }

  // 1) Resolve or create the anonymous guest identity.
  const { data: existing } = await sb
    .from("guest_refs")
    .select("id")
    .eq("ref", input.guestRef)
    .maybeSingle();

  let guestRefId = existing?.id as string | undefined;
  if (!guestRefId) {
    const { data: created, error: gErr } = await sb
      .from("guest_refs")
      .insert({ ref: input.guestRef, first_district: "canggu" })
      .select("id")
      .single();
    if (gErr) return { ok: false, error: "guest_ref_failed" };
    guestRefId = created.id as string;

    // 2) Append the consent record (privacy: explicit, append-only).
    await sb.from("consent_log").insert({
      guest_ref_id: guestRefId,
      consent_type: "redemption_tracking_v1",
      granted: input.consentGranted,
      user_agent: input.userAgent.slice(0, 300),
    });
  }

  if (!input.consentGranted) return { ok: false, error: "consent_required" };

  // 3) Write the redemption event — the core proof artifact.
  const { error: rErr } = await sb.from("redemption_events").insert({
    guest_ref_id: guestRefId,
    venue_slug: input.venueSlug,
    perk_id: venue.perk?.id ?? null,
    confirm_code: code,
    source: "venue_qr",
    ts,
  });
  if (rErr) return { ok: false, error: "redemption_write_failed" };

  return {
    ok: true,
    confirmCode: code,
    venueName: venue.name,
    perkTitle: venue.perk?.title ?? "Perk",
    ts,
  };
}

// Aggregate-by-default partner view (privacy). Returns a count only.
export async function getVenueRedemptionCount(venueSlug: string): Promise<number | null> {
  const sb = serviceClient();
  if (!sb) return null;
  const { count } = await sb
    .from("redemption_events")
    .select("*", { count: "exact", head: true })
    .eq("venue_slug", venueSlug);
  return count ?? 0;
}
