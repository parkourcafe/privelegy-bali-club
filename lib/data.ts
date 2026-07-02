import { anonClient, isSupabaseConfigured } from "./supabase/server";
import { VENUES, PERKS, PLAN_ENTRIES, ROUTES } from "./seed";
import type {
  Venue,
  Perk,
  PlanEntry,
  Slot,
  RedemptionResult,
  PartnerReport,
  PartnerNotes,
  Phase0Overview,
  RouteDef,
} from "./types";
import { SLOTS } from "./types";

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
  vibeTags: (r.vibe_tags as string[]) ?? undefined,
  priceAnchor: (r.price_anchor as string) ?? undefined,
  whatToOrder: (r.what_to_order as string) ?? undefined,
  photoUrl: (r.photo_url as string) ?? undefined,
  whatsapp: (r.whatsapp as string) ?? undefined,
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
// Goes through the record_redemption SECURITY DEFINER RPC (migration 0002) so
// no service_role secret is needed. Without a DB we fail loudly rather than
// fake a proof.

export async function recordRedemption(input: {
  guestRef: string;
  venueSlug: string;
  consentGranted: boolean;
  userAgent: string;
}): Promise<RedemptionResult> {
  const sb = anonClient();
  if (!sb) return { ok: false, error: "redemption_storage_unconfigured" };

  const { data, error } = await sb.rpc("record_redemption", {
    p_guest_ref: input.guestRef,
    p_venue_slug: input.venueSlug,
    p_consent_granted: input.consentGranted,
    p_user_agent: input.userAgent,
  });

  if (error) return { ok: false, error: "redemption_write_failed" };

  const r = (data ?? {}) as Record<string, unknown>;
  if (!r.ok) return { ok: false, error: (r.error as string) ?? "redemption_write_failed" };

  return {
    ok: true,
    confirmCode: r.confirm_code as string,
    venueName: r.venue_name as string,
    perkTitle: r.perk_title as string,
    ts: r.ts as string,
    externallyAttributed: Boolean(r.externally_attributed),
  };
}

// Aggregate-by-default partner view (privacy). Returns a count only.
export async function getVenueRedemptionCount(venueSlug: string): Promise<number | null> {
  const sb = anonClient();
  if (!sb) return null;
  const { data, error } = await sb.rpc("venue_redemption_count", { p_venue_slug: venueSlug });
  if (error) return null;
  return (data as number) ?? 0;
}

// ---- Source attribution + funnel (§22 / §18) — all best-effort ----
// These never throw to the caller: attribution is valuable but must never block
// or break the redemption ring. If the RPCs don't exist yet (migration not
// applied), they fail silently and the ring keeps working.

export async function setGuestSource(guestRef: string, source: string): Promise<void> {
  const sb = anonClient();
  if (!sb || !guestRef || !source) return;
  await sb.rpc("set_guest_source", { p_guest_ref: guestRef, p_source: source }).then(
    () => {},
    () => {}
  );
}

export async function logEvent(input: {
  type: string;
  guestRef?: string;
  venueSlug?: string;
  source?: string;
}): Promise<void> {
  const sb = anonClient();
  if (!sb || !input.type) return;
  await sb
    .rpc("log_event", {
      p_type: input.type,
      p_guest_ref: input.guestRef ?? null,
      p_venue_slug: input.venueSlug ?? null,
      p_source: input.source ?? null,
    })
    .then(
      () => {},
      () => {}
    );
}

// Partner Reach/Intent/Proof report. Returns null if unavailable (e.g. migration
// not applied yet) so callers can fall back to a plain count.
export async function getPartnerReport(venueSlug: string): Promise<PartnerReport | null> {
  const sb = anonClient();
  if (!sb) return null;
  const { data, error } = await sb.rpc("partner_report", { p_venue_slug: venueSlug });
  if (error || !data) return null;
  const r = data as Record<string, unknown>;
  return {
    venueCardOpens: Number(r.venue_card_opens ?? 0),
    perkOpens: Number(r.perk_opens ?? 0),
    redemptions: Number(r.redemptions ?? 0),
    externallyAttributed: Number(r.externally_attributed ?? 0),
    inVenue: Number(r.in_venue ?? 0),
    creator: Number(r.creator ?? 0),
  };
}

// Flat list of active Canggu venues with their perk — for the admin Field Kit.
export async function getVenuesList(): Promise<VenueWithPerk[]> {
  const plan = await getCangguPlan();
  const seen = new Set<string>();
  const out: VenueWithPerk[] = [];
  for (const block of plan) {
    for (const v of block.venues) {
      if (seen.has(v.slug)) continue;
      seen.add(v.slug);
      out.push(v);
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

// Partner §11 Notes: source-type breakdown + repeat. Null if unavailable.
export async function getPartnerNotes(venueSlug: string): Promise<PartnerNotes | null> {
  const sb = anonClient();
  if (!sb) return null;
  const { data, error } = await sb.rpc("partner_notes", { p_venue_slug: venueSlug });
  if (error || !data) return null;
  const r = data as Record<string, unknown>;
  return {
    bySource: (r.by_source as Record<string, number>) ?? {},
    repeat: Number(r.repeat ?? 0),
  };
}

// ---- Routes (§8) ----
export interface RouteSummary {
  slug: string;
  title: string;
  subtitle?: string;
  stopCount: number;
}
export interface RouteDetail {
  slug: string;
  title: string;
  subtitle?: string;
  stops: VenueWithPerk[];
}

// Route definitions from DB (if present) else seed.
async function getRouteDefs(): Promise<RouteDef[]> {
  if (isSupabaseConfigured()) {
    const sb = anonClient()!;
    const { data: routes } = await sb
      .from("routes")
      .select("*")
      .eq("district", "canggu")
      .order("rank");
    if (routes?.length) {
      const { data: stops } = await sb.from("route_stops").select("*").order("rank");
      const rows = (stops ?? []) as Row[];
      return (routes as Row[]).map((r) => ({
        slug: r.slug as string,
        title: r.title as string,
        subtitle: (r.subtitle as string) ?? undefined,
        rank: (r.rank as number) ?? 100,
        stops: rows
          .filter((s) => s.route_slug === r.slug)
          .map((s) => ({ venueSlug: s.venue_slug as string, note: (s.note as string) ?? undefined })),
      }));
    }
  }
  return [...ROUTES].sort((a, b) => a.rank - b.rank);
}

export async function getRoutes(): Promise<RouteSummary[]> {
  const defs = await getRouteDefs();
  return defs.map((d) => ({
    slug: d.slug,
    title: d.title,
    subtitle: d.subtitle,
    stopCount: d.stops.length,
  }));
}

export async function getRoute(slug: string): Promise<RouteDetail | null> {
  const defs = await getRouteDefs();
  const d = defs.find((x) => x.slug === slug);
  if (!d) return null;
  const all = await getVenuesList();
  const bySlug = new Map(all.map((v) => [v.slug, v]));
  const stops = d.stops
    .map((s) => {
      const v = bySlug.get(s.venueSlug);
      if (!v) return null;
      return { ...v, blurb: s.note ?? v.blurb };
    })
    .filter((x): x is VenueWithPerk => x !== null);
  return { slug: d.slug, title: d.title, subtitle: d.subtitle, stops };
}

// Phase 0 operator dashboard data (§22). Returns null if unavailable.
export async function getPhase0Overview(): Promise<Phase0Overview | null> {
  const sb = anonClient();
  if (!sb) return null;
  const { data, error } = await sb.rpc("phase0_overview");
  if (error || !data) return null;
  const d = data as Record<string, unknown>;
  const f = (d.funnel ?? {}) as Record<string, unknown>;
  const venues = (d.venues ?? []) as Record<string, unknown>[];
  return {
    funnel: {
      sourceScan: Number(f.source_scan ?? 0),
      landingOpen: Number(f.landing_open ?? 0),
      venueCardOpen: Number(f.venue_card_open ?? 0),
      perkOpen: Number(f.perk_open ?? 0),
      redemption: Number(f.redemption ?? 0),
    },
    venues: venues.map((v) => ({
      slug: String(v.slug),
      name: String(v.name),
      perkOpens: Number(v.perk_opens ?? 0),
      redemptions: Number(v.redemptions ?? 0),
      externallyAttributed: Number(v.externally_attributed ?? 0),
      inVenue: Number(v.in_venue ?? 0),
    })),
  };
}
