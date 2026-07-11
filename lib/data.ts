import { anonClient, isSupabaseConfigured } from "./supabase/server";
import { rankSimilar } from "./similar";
import { VENUES, PERKS, PLAN_ENTRIES, ROUTES } from "./seed";
import { DISTRICT_GUIDE, type DistrictGuideEntry, type DistrictStatus } from "./districts";
import type {
  Venue,
  Perk,
  PlanEntry,
  Slot,
  RedemptionResult,
  PartnerReport,
  PartnerNotes,
  MyRedemption,
  Phase0Overview,
  RouteDef,
} from "./types";
import { SLOTS } from "./types";

export interface VenueWithPerk extends Venue {
  perk: Perk | null;
  blurb: string;
  similar?: VenueWithPerk[]; // top same-district matches (backlog #4 fallback)
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

const DRAFT_PERK_PATTERNS = [
  /proposed\s+perk/i,
  /partner\s+negotiation/i,
  /terms\s+require/i,
];

function textValue(value: unknown): string {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function hasDraftPerkLanguage(value: unknown): boolean {
  const text = textValue(value);
  return DRAFT_PERK_PATTERNS.some((pattern) => pattern.test(text));
}

function isDraftPerk(title: unknown, terms: unknown): boolean {
  return hasDraftPerkLanguage(title) || hasDraftPerkLanguage(terms);
}

function isGoogleMapsUrl(value: unknown): boolean {
  const raw = textValue(value);
  if (!raw) return false;

  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    const path = url.pathname.toLowerCase();

    if (host === "maps.app.goo.gl") return true;
    if (host === "goo.gl" && path.startsWith("/maps")) return true;
    if (host.startsWith("maps.google.")) return true;
    return host.includes("google.") && path.includes("/maps");
  } catch {
    return false;
  }
}

function mapsSearchUrl(name: unknown, address: unknown): string {
  const query = [textValue(name), textValue(address), "Bali"].filter(Boolean).join(" ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function publicDirectionsUrl(r: Row): string {
  return isGoogleMapsUrl(r.gmaps_url) ? textValue(r.gmaps_url) : mapsSearchUrl(r.name, r.address);
}

function uniqueBy<T>(items: T[], keyOf: (item: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const key = keyOf(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function normalizePublicPerks(perks: Perk[]): Perk[] {
  return uniqueBy(
    perks.filter((p) => !isDraftPerk(p.title, p.terms)),
    (p) => p.venueSlug
  );
}

function normalizePlanEntries(entries: PlanEntry[]): PlanEntry[] {
  const seen = new Set<string>();
  return [...entries]
    .sort((a, b) => a.rank - b.rank)
    .filter((entry) => {
      const key = `${entry.slot}:${entry.venueSlug}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

const mapVenue = (r: Row): Venue => ({
  id: r.id as string,
  slug: r.slug as string,
  name: r.name as string,
  category: r.category as Venue["category"],
  district: r.district as string,
  address: r.address as string,
  gmapsUrl: publicDirectionsUrl(r),
  tier: r.tier as Venue["tier"],
  isSponsored: Boolean(r.is_sponsored),
  vibeTags: (r.vibe_tags as string[]) ?? undefined,
  priceAnchor: (r.price_anchor as string) ?? undefined,
  whatToOrder: (r.what_to_order as string) ?? undefined,
  photoUrl: (r.photo_url as string) ?? undefined,
  whatsapp: (r.whatsapp as string) ?? undefined,
  tablepilotSlug: (r.tablepilot_slug as string) ?? undefined,
  area: (r.area as string) ?? undefined,
  whyItsHere: (r.why_its_here as string) ?? undefined,
  bestFor: (r.best_for as string) ?? undefined,
  notFor: (r.not_for as string) ?? undefined,
  practicalTags: (r.practical_tags as string[]) ?? undefined,
  jobs: (r.jobs as string[]) ?? undefined,
});
// Public tourist mapping: proposed / partner-negotiation offers are treated as
// absent until confirmed, so draft operational language never appears on cards.
const mapPublicPerk = (r: Row): Perk | null => {
  if (isDraftPerk(r.title, r.terms)) return null;
  const title = textValue(r.title);
  if (!title) return null;
  return {
    id: textValue(r.id),
    venueSlug: textValue(r.venue_slug),
    title,
    terms: textValue(r.terms),
  };
};
const mapPublicPerks = (rows: Row[]): Perk[] =>
  rows.map(mapPublicPerk).filter((p): p is Perk => p !== null);
const mapPlan = (r: Row): PlanEntry => ({
  venueSlug: r.venue_slug as string,
  slot: r.slot as Slot,
  rank: r.rank as number,
  blurb: r.blurb as string,
});

function publicStoredPerkTitle(value: unknown): string {
  const title = textValue(value);
  if (!title || hasDraftPerkLanguage(title)) return "Venue visit";
  return title;
}

function stripDraftPerkMarker(value: unknown): string {
  return textValue(value)
    .replace(/^proposed\s+perk\s*[:;.-]?\s*/i, "")
    .replace(/^terms\s+require\s+partner\s+negotiation\s*[:;.-]?\s*/i, "")
    .trim();
}

// Internal / partner-onboarding mapping: proposed offers must stay visible so
// venues can approve or reject them, but the card copy should read as an
// approval item rather than a public tourist promise.
function mapInternalPerk(r: Row): Perk | null {
  const rawTitle = textValue(r.title);
  const rawTerms = textValue(r.terms);
  if (!rawTitle && !rawTerms) return null;

  const title = hasDraftPerkLanguage(rawTitle)
    ? "Proposed guest offer"
    : rawTitle;

  return {
    id: textValue(r.id),
    venueSlug: textValue(r.venue_slug),
    title,
    terms: stripDraftPerkMarker(rawTerms) || "Final terms to confirm with your team.",
  };
}

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
    if (v) venues = (v as Row[]).map(mapVenue);
    if (p) perks = mapPublicPerks(p as Row[]);
    if (e) entries = (e as Row[]).map(mapPlan);
  }

  venues = uniqueBy(venues, (v) => v.slug);
  perks = normalizePublicPerks(perks);
  entries = normalizePlanEntries(entries);

  const venueBySlug = new Map(venues.map((x) => [x.slug, x]));
  const perkByVenue = new Map(perks.map((x) => [x.venueSlug, x]));
  const blurbByVenue = new Map(entries.map((en) => [en.venueSlug, en.blurb] as const));

  // A flat "similar places" set per venue: same-district matches by category /
  // vibe tags. Rendered as the reservation fallback (backlog #4). Computed once
  // here; the suggestion cards carry a perk + reserve path but no nested similar.
  const toCard = (v: Venue): VenueWithPerk => ({
    ...v,
    perk: perkByVenue.get(v.slug) ?? null,
    blurb: blurbByVenue.get(v.slug) ?? "",
  });
  const similarByVenue = new Map(
    venues.map((v) => [v.slug, rankSimilar(v, venues).map(toCard)] as const)
  );

  return SLOTS.map(({ key, label, hint }) => {
    const venuesForSlot: VenueWithPerk[] = entries
      .filter((en) => en.slot === key)
      .sort((a, b) => a.rank - b.rank)
      .flatMap((en) => {
        const venue = venueBySlug.get(en.venueSlug);
        if (!venue) return [];
        return [
          {
            ...venue,
            perk: perkByVenue.get(en.venueSlug) ?? null,
            blurb: en.blurb,
            similar: similarByVenue.get(en.venueSlug) ?? [],
          },
        ];
      });
    return { slot: key, label, hint, venues: venuesForSlot };
  });
}

// Bali-wide planning layer: the editorial area guide, with coverage status
// (planning_only / next_deep / active_deep) overridden from the districts
// table when a DB is configured — so flipping a district's status in the DB
// is reflected on the site without a deploy. Copy stays in code (ContentPage
// territory is deliberately not entered here).
export async function getDistrictsGuide(): Promise<DistrictGuideEntry[]> {
  if (!isSupabaseConfigured()) return DISTRICT_GUIDE;
  const sb = anonClient()!;
  const { data } = await sb.from("districts").select("slug, status");
  if (!data) return DISTRICT_GUIDE;
  const statusBySlug = new Map(
    (data as Row[]).map((r) => [String(r.slug), String(r.status)] as const)
  );
  const valid = new Set<DistrictStatus>(["planning_only", "active_deep", "next_deep"]);
  return DISTRICT_GUIDE.map((d) => {
    const s = statusBySlug.get(d.slug);
    return s && valid.has(s as DistrictStatus)
      ? { ...d, status: s as DistrictStatus }
      : d;
  });
}

export async function getVenueWithPerk(slug: string): Promise<VenueWithPerk | null> {
  let venue: Venue | undefined = VENUES.find((v) => v.slug === slug);
  let perk: Perk | undefined = PERKS.find((p) => p.venueSlug === slug);

  if (isSupabaseConfigured()) {
    venue = undefined;
    perk = undefined;
    const sb = anonClient()!;
    const { data: v } = await sb.from("venues").select("*").eq("slug", slug).maybeSingle();
    if (v) venue = mapVenue(v as Row);
    const { data: p } = await sb
      .from("perks")
      .select("*")
      .eq("venue_slug", slug)
      .eq("active", true)
      .limit(1)
      .maybeSingle();
    if (p) perk = mapPublicPerk(p as Row) ?? undefined;
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

  const { data: activePerk } = await sb
    .from("perks")
    .select("title,terms")
    .eq("venue_slug", input.venueSlug)
    .eq("active", true)
    .limit(1)
    .maybeSingle();
  if (!activePerk || isDraftPerk((activePerk as Row).title, (activePerk as Row).terms)) {
    return { ok: false, error: "no_active_perk" };
  }

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
    perkTitle: publicStoredPerkTitle(r.perk_title),
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

// A guest's own redemptions (for "My offers"). Guest ref comes from the cookie.
export async function getMyRedemptions(guestRef: string): Promise<MyRedemption[]> {
  const sb = anonClient();
  if (!sb || !guestRef) return [];
  const { data, error } = await sb.rpc("my_redemptions", { p_guest_ref: guestRef });
  if (error || !data) return [];
  return (data as Record<string, unknown>[]).map((r) => ({
    venueName: String(r.venue_name ?? "Venue"),
    venueSlug: String(r.venue_slug ?? ""),
    perkTitle: publicStoredPerkTitle(r.perk_title),
    confirmCode: String(r.confirm_code ?? ""),
    ts: String(r.ts ?? ""),
  }));
}

// Dish feedback (§18) — best-effort, never blocks.
export async function logDishFeedback(input: {
  guestRef: string;
  venueSlug: string;
  dish: string;
  verdict: string;
}): Promise<void> {
  const sb = anonClient();
  if (!sb || !input.venueSlug) return;
  await sb
    .rpc("log_dish_feedback", {
      p_guest_ref: input.guestRef,
      p_venue_slug: input.venueSlug,
      p_dish: input.dish,
      p_verdict: input.verdict,
    })
    .then(
      () => {},
      () => {}
    );
}

// ---- Onboarding status (operator dashboard) ----
export interface OnboardStatus {
  slug: string;
  invited: boolean;
  confirmed: boolean;
  hasPhoto: boolean;
}

export async function getOnboardStatus(): Promise<Record<string, OnboardStatus>> {
  const sb = anonClient();
  if (!sb) return {};
  const { data, error } = await sb.rpc("onboard_status");
  if (error || !data) return {};
  const out: Record<string, OnboardStatus> = {};
  for (const r of data as Record<string, unknown>[]) {
    const slug = String(r.slug);
    out[slug] = {
      slug,
      invited: Boolean(r.invited),
      confirmed: Boolean(r.confirmed),
      hasPhoto: Boolean(r.has_photo),
    };
  }
  return out;
}

// ---- Partner onboarding (tokenized invite links) ----

export interface OnboardInfo {
  venue: VenueWithPerk | null;
  confirmed: boolean;
  offerNeedsApproval: boolean;
}

export async function getOnboardInfo(token: string): Promise<OnboardInfo | null> {
  const sb = anonClient();
  if (!sb || !token) return null;
  const { data, error } = await sb.rpc("onboard_info", { p_token: token });
  if (error || !data) return null;
  const r = data as Record<string, unknown>;
  if (!r.venue) return { venue: null, confirmed: false, offerNeedsApproval: false };
  const venue = mapVenue(r.venue as Row);
  const perkRaw = r.perk as Record<string, unknown> | null;
  const perk = perkRaw
    ? mapInternalPerk({
        id: "",
        venue_slug: venue.slug,
        title: perkRaw.title,
        terms: perkRaw.terms,
      })
    : null;
  return {
    venue: {
      ...venue,
      perk,
      blurb: "",
    },
    confirmed: Boolean(r.confirmed),
    offerNeedsApproval: perkRaw ? isDraftPerk(perkRaw.title, perkRaw.terms) : false,
  };
}

export async function confirmOnboarding(input: {
  token: string;
  name: string;
  agreed: boolean;
  userAgent: string;
}): Promise<{ ok: boolean; error?: string }> {
  const sb = anonClient();
  if (!sb) return { ok: false, error: "unconfigured" };
  const { data, error } = await sb.rpc("confirm_onboarding", {
    p_token: input.token,
    p_name: input.name,
    p_agreed: input.agreed,
    p_user_agent: input.userAgent,
  });
  if (error) return { ok: false, error: "write_failed" };
  const r = (data ?? {}) as Record<string, unknown>;
  return { ok: Boolean(r.ok), error: r.error as string | undefined };
}

export async function setVenuePhoto(token: string, url: string): Promise<boolean> {
  const sb = anonClient();
  if (!sb) return false;
  const { data, error } = await sb.rpc("set_venue_photo", { p_token: token, p_url: url });
  if (error) return false;
  return Boolean((data as Record<string, unknown>)?.ok);
}

export async function getOrCreateOnboardToken(venueSlug: string): Promise<string | null> {
  const sb = anonClient();
  if (!sb) return null;
  const { data, error } = await sb.rpc("get_or_create_onboard_token", { p_venue_slug: venueSlug });
  if (error || !data) return null;
  return data as string;
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
      directionClick: Number(f.direction_click ?? 0),
      reservationClick: Number(f.reservation_click ?? 0),
      similarOpen: Number(f.similar_open ?? 0),
      redemption: Number(f.redemption ?? 0),
    },
    venues: venues.map((v) => ({
      slug: String(v.slug),
      name: String(v.name),
      directionClicks: Number(v.direction_clicks ?? 0),
      reservationClicks: Number(v.reservation_clicks ?? 0),
      perkOpens: Number(v.perk_opens ?? 0),
      redemptions: Number(v.redemptions ?? 0),
      externallyAttributed: Number(v.externally_attributed ?? 0),
      inVenue: Number(v.in_venue ?? 0),
      creator: Number(v.creator ?? 0),
    })),
  };
}
