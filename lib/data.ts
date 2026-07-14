import { anonClient, isSeedFallbackAllowed, isSupabaseConfigured } from "./supabase/server";
import { headers } from "next/headers";
import { serviceClient } from "./supabase/service";
import { validateGoogleMapsUrl } from "./integrations/google-maps";
import { VENUES, PERKS, PLAN_ENTRIES, ROUTES } from "./seed";
import { DISTRICT_GUIDE, type DistrictGuideEntry, type DistrictStatus } from "./districts";
import { INTENTS, normalizeJobs, type IntentDef } from "./intents";
import { getPublicationStatus } from "./publication";
import {
  failPublicDataRead,
  requireConfiguredPublicDataSource,
} from "./data-availability";
import { REQUEST_ID_HEADER } from "./request-correlation";
import { logServerFailure } from "./server-log";
import { exactReleaseSchemaProbe } from "./release-schema-probe";
import {
  parseLegacyPublicVenueRow,
  parseLegacyVenueRow,
  type LegacyVenueRow,
} from "./schema/venue";
import { parsePublicPerkRow } from "./schema/perk";
import { parsePublicRows } from "./schema/public-boundary";
import { isRecord } from "./schema/common";
import {
  parsePlanEntryRow,
  parseRouteRow,
  parseRouteStopRow,
} from "./schema/route";
import {
  validateInstagramUrl,
  validateOfficialWebsiteUrl,
} from "./external-links";
import { publishedUluwatuVenues, uluwatuAsVenue, getUluwatuContent } from "./uluwatu/venues";
import type {
  Venue,
  Perk,
  PlanEntry,
  Slot,
  RedemptionResult,
  PartnerReport,
  PartnerNotes,
  MyRedemption,
  RouteDef,
} from "./types";
import { SLOTS } from "./types";
import {
  matchExactRelatedRoutes,
  resolveExactRouteStops,
  routesWithDuplicateStopRanks,
  type ExactRelatedRouteSummary,
  type RouteIntegrityFailure,
} from "./route-integrity";

export interface VenueWithPerk extends Venue {
  perk: Perk | null;
  blurb: string;
  similar?: VenueWithPerk[]; // optional fallback, omitted from primary plan payload
}

export interface PlanBySlot {
  slot: Slot;
  label: string;
  hint: string;
  venues: VenueWithPerk[];
}

async function failPublicDataRequest(context: string): Promise<never> {
  let requestId: string | null = null;
  try {
    requestId = (await headers()).get(REQUEST_ID_HEADER);
  } catch {
    // Build-time/non-request callers still get a release-aware safe record.
  }
  logServerFailure({ event: "public_data_unavailable", requestId });
  return failPublicDataRead(context);
}

async function requirePublicDataSource(configured: boolean, context: string): Promise<void> {
  try {
    requireConfiguredPublicDataSource(configured, context);
  } catch {
    await failPublicDataRequest(context);
  }
}

// Postgres columns are snake_case; the domain types are camelCase. Map at the
// boundary so the rest of the app never sees DB naming.
type Row = Record<string, unknown>;

const DRAFT_PERK_PATTERNS = [
  /proposed\s+perk/i,
  /partner\s+negotiation/i,
  /terms\s+require/i,
];

const PLAN_VENUE_COLUMNS = [
  "id",
  "slug",
  "name",
  "category",
  "district",
  "address",
  "gmaps_url",
  "official_url",
  "instagram_url",
  "tier",
  "status",
  "is_sponsored",
  "vibe_tags",
  "price_anchor",
  "what_to_order",
  "area",
  "why_its_here",
  "best_for",
  "not_for",
  "practical_tags",
  "jobs",
  "owner_note",
  "publication_status",
  "wellness_categories",
].join(",");

const PUBLIC_PLACES_VENUE_COLUMNS = [
  "id",
  "slug",
  "name",
  "category",
  "district",
  "address",
  "gmaps_url",
  "official_url",
  "instagram_url",
  "tier",
  "status",
  "is_sponsored",
  "vibe_tags",
  "price_anchor",
  "what_to_order",
  // Legacy action fields are deliberately excluded. Public actions may
  // surface only through the fresh, confirmed capability store.
  "area",
  "why_its_here",
  "best_for",
  "not_for",
  "practical_tags",
  "jobs",
  "owner_note",
  "publication_status",
  "wellness_categories",
].join(",");

const PUBLIC_PERK_COLUMNS = "id,venue_slug,title,terms";
const PLAN_ENTRY_COLUMNS = "venue_slug,slot,rank,blurb";
const ROUTE_COLUMNS = "slug,title,subtitle,rank";
const ROUTE_STOP_COLUMNS = "route_slug,venue_slug,rank,note";

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

function publicDirectionsUrl(r: LegacyVenueRow): string {
  // Never synthesize a URL from a name/address. The UI separately labels a
  // stored handoff as exact listing, search, or unresolved short/generic link.
  return validateGoogleMapsUrl(r.gmaps_url) ?? "";
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

const mapVenue = (r: LegacyVenueRow): Venue => {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category,
    district: r.district,
    // Never null downstream: a null address once 500'd all of /places via
    // v.address.toLowerCase() in the catalogue filter.
    address: r.address ?? "",
    gmapsUrl: publicDirectionsUrl(r),
    officialUrl: validateOfficialWebsiteUrl(r.official_url) ?? undefined,
    instagramUrl: validateInstagramUrl(r.instagram_url) ?? undefined,
    tier: r.tier,
    status: r.status,
    isSponsored: r.is_sponsored,
    vibeTags: r.vibe_tags ?? undefined,
    priceAnchor: r.price_anchor ?? undefined,
    whatToOrder: r.what_to_order ?? undefined,
    // Legacy photo_url carries no normalized rights/approval evidence. Web,
    // like mobile v1, remains fail-closed until the approved photo DTO exists.
    photoUrl: undefined,
    whatsapp: undefined,
    tablepilotSlug: undefined,
    area: r.area ?? undefined,
    whyItsHere: r.why_its_here ?? undefined,
    bestFor: r.best_for ?? undefined,
    notFor: r.not_for ?? undefined,
    practicalTags: r.practical_tags ?? undefined,
    jobs: r.jobs ?? undefined,
    ownerNote: r.owner_note ?? undefined,
    publicationStatus: r.publication_status ?? undefined,
    wellnessCategories: r.wellness_categories ?? undefined,
  };
};

function mapPublicVenueRows(rows: readonly unknown[], context: string): Venue[] {
  return parsePublicRows(rows, parseLegacyPublicVenueRow, {
    entity: "venue",
    context,
  }).map(mapVenue).filter(isPublicReadyVenue);
}

function mapPublicVenueRow(row: unknown, context: string): Venue | null {
  return mapPublicVenueRows([row], context)[0] ?? null;
}
// Public tourist mapping: proposed / partner-negotiation offers are treated as
// absent until confirmed, so draft operational language never appears on cards.
function mapPublicPerks(rows: readonly unknown[], context: string): Perk[] {
  return parsePublicRows(rows, parsePublicPerkRow, {
    entity: "perk",
    context,
  }).filter((perk) => !isDraftPerk(perk.title, perk.terms));
}

function mapPlanEntries(rows: readonly unknown[], context: string): PlanEntry[] {
  return parsePublicRows(rows, parsePlanEntryRow, {
    entity: "plan_entry",
    context,
  });
}

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
  const allowSeed = isSeedFallbackAllowed();
  const configured = isSupabaseConfigured();
  await requirePublicDataSource(configured, "canggu_plan");
  let venues = allowSeed ? VENUES : [];
  let perks = allowSeed ? PERKS : [];
  let entries = allowSeed ? PLAN_ENTRIES : [];

  if (configured) {
    venues = [];
    perks = [];
    entries = [];
    const sb = anonClient()!;
    const [
      { data: v, error: venueError },
      { data: p },
      { data: e, error: entriesError },
    ] = await Promise.all([
      sb
        .from("venues")
        .select(PLAN_VENUE_COLUMNS)
        .eq("district", "canggu")
        .eq("status", "active")
        .eq("publication_status", "published"),
      sb.from("perks").select(PUBLIC_PERK_COLUMNS).eq("active", true),
      sb.from("plan_entries").select(PLAN_ENTRY_COLUMNS).eq("district", "canggu"),
    ]);
    if (venueError || entriesError || !v || !e) await failPublicDataRequest("canggu_plan");
    venues = mapPublicVenueRows(v ?? [], "canggu_plan");
    if (p) perks = mapPublicPerks(p, "canggu_plan");
    entries = mapPlanEntries(e ?? [], "canggu_plan");
  }

  venues = uniqueBy(venues.filter(isPublicReadyVenue), (v) => v.slug);
  perks = normalizePublicPerks(perks);
  entries = normalizePlanEntries(entries);

  const venueBySlug = new Map(venues.map((x) => [x.slug, x]));
  const perkByVenue = new Map(perks.map((x) => [x.venueSlug, x]));

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
  const configured = isSupabaseConfigured();
  await requirePublicDataSource(configured, "district_guide");
  if (!configured) return DISTRICT_GUIDE;
  const sb = anonClient()!;
  const { data, error } = await sb.from("districts").select("slug, status");
  if (error || !data) await failPublicDataRequest("district_guide");
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
  const configured = isSupabaseConfigured();
  await requirePublicDataSource(configured, "venue_detail");
  const allowSeed = isSeedFallbackAllowed();
  let venue: Venue | undefined = allowSeed ? VENUES.find((v) => v.slug === slug) : undefined;
  let perk: Perk | undefined = allowSeed ? PERKS.find((p) => p.venueSlug === slug) : undefined;

  if (configured) {
    venue = undefined;
    perk = undefined;
    const sb = anonClient()!;
    const { data: v, error: venueError } = await sb
      .from("venues")
      .select(PUBLIC_PLACES_VENUE_COLUMNS)
      .eq("slug", slug)
      .eq("status", "active")
      .eq("publication_status", "published")
      .maybeSingle();
    if (venueError) await failPublicDataRequest("venue_detail");
    if (v) venue = mapPublicVenueRow(v, "venue_detail") ?? undefined;
    const { data: p } = await sb
      .from("perks")
      .select(PUBLIC_PERK_COLUMNS)
      .eq("venue_slug", slug)
      .eq("active", true)
      .limit(1)
      .maybeSingle();
    if (p) perk = mapPublicPerks([p], "venue_detail")[0];
  }

  // Registry fallback: Uluwatu venues render from lib/uluwatu/venues.ts when
  // the DB row is missing (seed mode / prod migration lag).
  if (allowSeed && !venue) {
    const content = getUluwatuContent(slug);
    if (content?.publication === "published") venue = uluwatuAsVenue(content) as Venue;
  }

  if (!venue || !isPublicReadyVenue(venue)) return null;
  // Configured deployments trust the perk RLS policy, which checks the live
  // district coverage flags. Local fixture mode contains Canggu data only.
  const entry = allowSeed ? PLAN_ENTRIES.find((e) => e.venueSlug === slug) : undefined;
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
  const sb = serviceClient();
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
  const sb = serviceClient();
  if (!sb) return null;
  const { data, error } = await sb.rpc("venue_redemption_count", { p_venue_slug: venueSlug });
  if (error) return null;
  return (data as number) ?? 0;
}

// ---- Source attribution + funnel (§22 / §18) — all best-effort ----
// These never throw to the caller: attribution is valuable but must never block
// or break the redemption ring. If the RPCs don't exist yet (migration not
// applied), they fail silently and the ring keeps working.

export async function logEvent(input: {
  type: string;
  guestRef?: string;
  venueSlug?: string;
  source?: string;
}): Promise<void> {
  const sb = serviceClient();
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
  const sb = serviceClient();
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

// Public readiness gate. Since the Uluwatu launch this delegates to the
// explicit publication policy in lib/publication.ts: evidence-backed registry
// gate for Uluwatu plus explicit active/published state for every district.
// Sparse or held rows remain available only in authenticated operator queues.
export function isPublicReadyVenue(v: Venue): boolean {
  return getPublicationStatus(v) === "published";
}

// Public planning catalogue: explicitly active, published venue rows only.
// Perks/booking attach ONLY inside the active_deep district (guardrail #4,
// enforced below); planning_only rows never surface an offer. Review,
// archived and cleanup-pending rows belong to authenticated operator
// queues and never cross this public data boundary.
export async function getPublishedVenues(): Promise<VenueWithPerk[]> {
  // Seed fallback keeps the catalogue browsable (and demos honest) without a
  // configured DB, same as the /plan loaders.
  const configured = isSupabaseConfigured();
  await requirePublicDataSource(configured, "published_catalogue");
  const allowSeed = isSeedFallbackAllowed();
  let venues: Venue[] = allowSeed ? VENUES : [];
  let perks: Perk[] = allowSeed ? PERKS : [];

  if (configured) {
    // A configured database must fail closed. Seed data is not a substitute
    // for a schema/query error in staging or production.
    venues = [];
    perks = [];
    const sb = anonClient()!;
    const [{ data: v, error: venueError }, { data: p, error: perkError }] = await Promise.all([
      sb
        .from("venues")
        .select(PUBLIC_PLACES_VENUE_COLUMNS)
        .eq("status", "active")
        .eq("publication_status", "published")
        .order("district", { ascending: true })
        .order("name", { ascending: true }),
      sb.from("perks").select(PUBLIC_PERK_COLUMNS).eq("active", true),
    ]);
    if (venueError || !v) await failPublicDataRequest("published_catalogue");
    venues = mapPublicVenueRows(v ?? [], "published_catalogue");
    perks = !perkError && p ? mapPublicPerks(p, "published_catalogue") : [];
  }

  perks = normalizePublicPerks(perks);
  const perkByVenue = new Map(perks.map((x) => [x.venueSlug, x]));

  // Uluwatu registry venues ride along as a resilience layer: when the DB is
  // unreachable (seed mode) or a prod migration lags the repo, the district
  // product still renders. uniqueBy keeps the DB row when both exist.
  const uluwatuFallback = allowSeed
    ? publishedUluwatuVenues().map(uluwatuAsVenue) as Venue[]
    : [];

  return uniqueBy([...venues, ...uluwatuFallback], (v) => v.slug)
    .filter(isPublicReadyVenue)
    .sort((a, b) => a.district.localeCompare(b.district) || a.name.localeCompare(b.name))
    .map((v) => ({
      ...v,
      perk: perkByVenue.get(v.slug) ?? null,
      blurb: "",
    }));
}

// ---- SEO hub surface (/bali/[district]) ----

export interface DistrictHub {
  slug: string;
  name: string;
  venues: VenueWithPerk[];
}

// A district hub only publishes when it has enough real depth — below this a
// page is thin and drags topical authority (docs/seo-strategy.md §1 gate).
export const HUB_MIN_VENUES = 8;

// Districts with a hand-crafted pillar (base's /uluwatu product) are NOT served
// by the programmatic /bali/[district] hub — that would create two pages
// competing for the same queries. The pillar owns those districts.
const HUB_EXCLUDE_DISTRICTS = new Set(["uluwatu-bukit", "canggu", "sanur", "ubud", "seminyak", "nusa-dua", "jimbaran"]);

// Active, published venues grouped by district. Ranking pages show only
// canonical live rows. Known districts
// only (must exist in DISTRICT_GUIDE) so a stray district string can't mint a
// page with no editorial identity.
export async function getDistrictHubs(): Promise<DistrictHub[]> {
  const allowSeed = isSeedFallbackAllowed();
  const configured = isSupabaseConfigured();
  await requirePublicDataSource(configured, "district_hubs");
  let venues: Venue[] = allowSeed ? VENUES : [];
  let perks: Perk[] = allowSeed ? PERKS : [];

  if (configured) {
    venues = [];
    perks = [];
    const sb = anonClient()!;
    const [{ data: v, error: venueError }, { data: p, error: perkError }] = await Promise.all([
      sb
        .from("venues")
        .select(PUBLIC_PLACES_VENUE_COLUMNS)
        .eq("status", "active")
        .eq("publication_status", "published")
        .order("district", { ascending: true })
        .order("name", { ascending: true }),
      sb.from("perks").select(PUBLIC_PERK_COLUMNS).eq("active", true),
    ]);
    if (venueError || !v) await failPublicDataRequest("district_hubs");
    venues = mapPublicVenueRows(v ?? [], "district_hubs");
    perks = !perkError && p ? mapPublicPerks(p, "district_hubs") : [];
  }

  perks = normalizePublicPerks(perks);
  const perkByVenue = new Map(perks.map((x) => [x.venueSlug, x]));
  const nameBySlug = new Map(DISTRICT_GUIDE.map((d) => [d.slug, d.name] as const));

  const byDistrict = new Map<string, VenueWithPerk[]>();
  for (const v of uniqueBy(venues, (x) => x.slug).filter(isPublicReadyVenue)) {
    if (!nameBySlug.has(v.district)) continue;
    if (HUB_EXCLUDE_DISTRICTS.has(v.district)) continue;
    const list = byDistrict.get(v.district) ?? [];
    list.push({ ...v, perk: perkByVenue.get(v.slug) ?? null, blurb: "" });
    byDistrict.set(v.district, list);
  }

  const hubs: DistrictHub[] = [];
  for (const [slug, list] of byDistrict) {
    if (list.length < HUB_MIN_VENUES) continue;
    list.sort((a, b) => a.name.localeCompare(b.name));
    hubs.push({ slug, name: nameBySlug.get(slug)!, venues: list });
  }
  // Densest districts first — used for lateral "more districts" linking order.
  hubs.sort((a, b) => b.venues.length - a.venues.length || a.name.localeCompare(b.name));
  return hubs;
}

export async function getDistrictHub(slug: string): Promise<DistrictHub | null> {
  const hubs = await getDistrictHubs();
  return hubs.find((h) => h.slug === slug) ?? null;
}

// ---- SEO intent spokes (/bali/[district]/[intent]) ----

export interface IntentSpoke {
  district: string;
  districtName: string;
  intent: IntentDef;
  venues: VenueWithPerk[];
}

// A spoke below this venue count is thin — hold it back (seo-strategy §1 gate).
export const SPOKE_MIN_VENUES = 4;

// Feature the most editorially-complete venues first (a real "ranked list"):
// why-it's-here + what-to-order + price are what make a pick page useful.
function spokeRichness(v: VenueWithPerk): number {
  return (
    (v.whyItsHere ? 2 : 0) +
    (v.whatToOrder ? 1 : 0) +
    (v.bestFor ? 1 : 0) +
    (v.priceAnchor ? 1 : 0)
  );
}

export async function getIntentSpokes(): Promise<IntentSpoke[]> {
  const hubs = await getDistrictHubs();
  const spokes: IntentSpoke[] = [];
  for (const hub of hubs) {
    for (const intent of INTENTS) {
      const venues = hub.venues
        .filter((v) => normalizeJobs(v.jobs).includes(intent.jobSlug))
        .sort((a, b) => spokeRichness(b) - spokeRichness(a) || a.name.localeCompare(b.name));
      if (venues.length >= SPOKE_MIN_VENUES) {
        spokes.push({ district: hub.slug, districtName: hub.name, intent, venues });
      }
    }
  }
  return spokes;
}

export async function getIntentSpoke(
  district: string,
  intentUrlSlug: string
): Promise<IntentSpoke | null> {
  const spokes = await getIntentSpokes();
  return (
    spokes.find((s) => s.district === district && s.intent.urlSlug === intentUrlSlug) ?? null
  );
}

// A guest's own redemptions (for "My offers"). Guest ref comes from the cookie.
export async function getMyRedemptions(guestRef: string): Promise<MyRedemption[]> {
  const sb = serviceClient();
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
}): Promise<boolean> {
  const sb = serviceClient();
  if (!sb || !input.venueSlug) return false;
  try {
    const { error } = await sb.rpc("log_dish_feedback", {
      p_guest_ref: input.guestRef,
      p_venue_slug: input.venueSlug,
      p_dish: input.dish,
      p_verdict: input.verdict,
    });
    return !error;
  } catch {
    return false;
  }
}

// ---- Onboarding status (operator dashboard) ----
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
  const parsedVenue = parsePublicRows([r.venue], parseLegacyVenueRow, {
    entity: "venue",
    context: "onboard_info",
  })[0];
  if (!parsedVenue) {
    return {
      venue: null,
      confirmed: Boolean(r.confirmed),
      offerNeedsApproval: false,
    };
  }
  const venue = mapVenue(parsedVenue);
  const perkRaw = isRecord(r.perk) ? r.perk : null;
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
  const sb = serviceClient();
  if (!sb) return { ok: false, error: "unconfigured" };
  const schema = await sb.rpc("release_readiness_v1");
  if (schema.error || !exactReleaseSchemaProbe(schema.data, 1, "0040")) {
    return { ok: false, error: "unconfigured" };
  }
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

// Partner self-service own-words update. The compatibility RPC still accepts
// the historical arguments, but the 0031 repair ignores them so partners can
// never overwrite Other Bali editorial fit fields.
export async function setVenueJtbd(
  token: string,
  input: {
    ownerNote: string;
  }
): Promise<boolean> {
  const sb = serviceClient();
  if (!sb) return false;
  const schema = await sb.rpc("release_readiness_v1");
  if (schema.error || !exactReleaseSchemaProbe(schema.data, 1, "0040")) {
    return false;
  }
  const { data, error } = await sb.rpc("set_venue_jtbd", {
    p_token: token,
    p_best_for: "",
    p_not_for: "",
    p_jobs: [],
    p_practical_tags: [],
    p_owner_note: input.ownerNote,
  });
  if (error) return false;
  return Boolean((data as Record<string, unknown>)?.ok);
}

// Partner §11 Notes: source-type breakdown + repeat. Null if unavailable.
export async function getPartnerNotes(venueSlug: string): Promise<PartnerNotes | null> {
  const sb = serviceClient();
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
const PUBLIC_VENUE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export type RelatedRouteSummary = ExactRelatedRouteSummary;

function logRejectedRoute(routeSlug: string, failure: RouteIntegrityFailure): void {
  console.warn(JSON.stringify({
    event: "public_route_rejected",
    routeSlug,
    code: failure.code,
    ...("stopIndex" in failure ? { stopIndex: failure.stopIndex } : {}),
    ...("venueSlug" in failure ? { venueSlug: failure.venueSlug } : {}),
  }));
}

// Route definitions from DB (if present) else seed.
async function getRouteDefs(): Promise<RouteDef[]> {
  const configured = isSupabaseConfigured();
  await requirePublicDataSource(configured, "route_definitions");
  if (configured) {
    const sb = anonClient()!;
    const { data: routes, error: routesError } = await sb
      .from("routes")
      .select(ROUTE_COLUMNS)
      .eq("district", "canggu")
      .order("rank");
    if (routesError || !routes) await failPublicDataRequest("route_definitions");
    if (routes?.length) {
      const { data: stops, error: stopsError } = await sb
        .from("route_stops")
        .select(ROUTE_STOP_COLUMNS)
        .order("rank");
      if (stopsError || !stops) await failPublicDataRequest("route_stops");
      const routeRows = parsePublicRows(routes, parseRouteRow, {
        entity: "route",
        context: "route_definitions",
      });
      const stopRows = parsePublicRows(stops ?? [], parseRouteStopRow, {
        entity: "route_stop",
        context: "route_stops",
      });
      const routesWithMalformedStops = new Set(
        (stops ?? []).flatMap((row, index) => {
          const result = parseRouteStopRow(row, index);
          if (result.ok || !isRecord(row) || typeof row.route_slug !== "string") return [];
          return [row.route_slug];
        }),
      );
      const routesWithDuplicateRanks = routesWithDuplicateStopRanks(stopRows);
      for (const routeSlug of routesWithDuplicateRanks) {
        logRejectedRoute(routeSlug, { ok: false, code: "route_stop_duplicate_rank" });
      }
      return routeRows.filter((route) => (
        !routesWithMalformedStops.has(route.slug)
        && !routesWithDuplicateRanks.has(route.slug)
      )).map((route) => ({
        slug: route.slug,
        title: route.title,
        subtitle: route.subtitle,
        rank: route.rank,
        stops: stopRows
          .filter((stop) => stop.routeSlug === route.slug)
          .sort((a, b) => a.rank - b.rank)
          .map((stop) => ({
            venueSlug: stop.venueSlug,
            ...(stop.note ? { note: stop.note } : {}),
          })),
      }));
    }
  }
  return isSeedFallbackAllowed() ? [...ROUTES].sort((a, b) => a.rank - b.rank) : [];
}

export async function getRoutes(): Promise<RouteSummary[]> {
  const [defs, venues] = await Promise.all([getRouteDefs(), getVenuesList()]);
  return defs.flatMap((definition) => {
    const resolved = resolveExactRouteStops(definition, venues);
    if (!resolved.ok) {
      logRejectedRoute(definition.slug, resolved);
      return [];
    }
    return [{
      slug: definition.slug,
      title: definition.title,
      subtitle: definition.subtitle,
      stopCount: resolved.stops.length,
    }];
  });
}

export async function getRoute(slug: string): Promise<RouteDetail | null> {
  const defs = await getRouteDefs();
  const d = defs.find((x) => x.slug === slug);
  if (!d) return null;
  const all = await getVenuesList();
  const resolved = resolveExactRouteStops(d, all);
  if (!resolved.ok) {
    logRejectedRoute(d.slug, resolved);
    return null;
  }
  return { slug: d.slug, title: d.title, subtitle: d.subtitle, stops: resolved.stops };
}

// One definitions read + one public-venue read; invalid routes are excluded as
// a whole by the same exact-stop resolver used on the route page. No inferred
// replacement or category-based relationship can enter venue detail pages.
export async function getRelatedRoutesForVenue(
  venueSlug: string,
): Promise<RelatedRouteSummary[]> {
  if (venueSlug.length > 120 || !PUBLIC_VENUE_SLUG.test(venueSlug)) return [];
  const [definitions, publicVenues] = await Promise.all([getRouteDefs(), getVenuesList()]);
  return matchExactRelatedRoutes(definitions, publicVenues, venueSlug);
}

// ---- Traveller saves & sharing (master §6c) ----
// Anonymous by default: guest ref = httpOnly cookie. All best-effort — if the
// migrations (0019/0020) aren't applied yet they fail silently and the UI stays
// usable. Rung 3 (saveGuestContact) is the only PII path, opt-in + consent.

export async function getSavedSlugs(guestRef: string | null): Promise<string[]> {
  const sb = serviceClient();
  if (!sb || !guestRef) return [];
  const { data, error } = await sb.rpc("saved_places_for", { p_guest_ref: guestRef });
  if (error || !Array.isArray(data)) return [];
  return data as string[];
}

export async function toggleSavedPlace(
  guestRef: string,
  venueSlug: string
): Promise<{ ok: boolean; saved: boolean }> {
  const sb = serviceClient();
  if (!sb) return { ok: false, saved: false };
  const { data, error } = await sb.rpc("toggle_saved_place", {
    p_guest_ref: guestRef,
    p_venue_slug: venueSlug,
  });
  if (error || !data) return { ok: false, saved: false };
  const r = data as Record<string, unknown>;
  return { ok: Boolean(r.ok), saved: Boolean(r.saved) };
}

export async function setSavedPlace(
  guestRef: string,
  venueSlug: string,
  saved: boolean,
): Promise<{ ok: boolean; saved: boolean }> {
  const sb = serviceClient();
  if (!sb) return { ok: false, saved: false };
  const { data, error } = await sb.rpc("set_saved_place", {
    p_guest_ref: guestRef,
    p_venue_slug: venueSlug,
    p_saved: saved,
  });
  if (error || !data || typeof data !== "object" || Array.isArray(data)) {
    return { ok: false, saved: false };
  }
  const result = data as Record<string, unknown>;
  return {
    ok: result.ok === true,
    saved: result.saved === true,
  };
}

export async function getVenuesBySlugs(slugs: string[]): Promise<VenueWithPerk[]> {
  if (slugs.length === 0) return [];
  const all = await getPublishedVenues();
  const bySlug = new Map(all.map((v) => [v.slug, v]));
  return slugs
    .map((s) => bySlug.get(s))
    .filter((v): v is VenueWithPerk => Boolean(v));
}

export async function getSavedVenues(guestRef: string | null): Promise<VenueWithPerk[]> {
  return getVenuesBySlugs(await getSavedSlugs(guestRef));
}

export async function createSharedList(
  guestRef: string | null,
  slugs: string[]
): Promise<string | null> {
  const sb = serviceClient();
  if (!sb || slugs.length === 0) return null;
  const { data, error } = await sb.rpc("create_shared_list", {
    p_guest_ref: guestRef,
    p_slugs: slugs,
  });
  if (error || !data) return null;
  return data as string;
}

export async function getSharedListSlugs(id: string): Promise<string[]> {
  const sb = anonClient();
  if (!sb || !id) return [];
  const { data, error } = await sb.rpc("shared_list_slugs", { p_id: id });
  if (error || !Array.isArray(data)) return [];
  return data as string[];
}
// (Rung 3 opt-in contact lives in #26's guide_leads / GuideLeadForm — not duplicated here.)
