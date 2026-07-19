// Repository layer for the resort vertical (IA spec v1 Phase 3). Reads the
// deterministic importer's committed review JSON (data/resort-import/*.json)
// and applies the publication gates (§13) + the operator publish whitelist.
//
// Two visibility tiers, both server-resolved:
//   - PUBLIC: entity is in RESORT_PUBLISH_WHITELIST *and* passes its gate.
//     Only these are indexable and sitemap-listed.
//   - OWNER PREVIEW: everything else, shown only when audienceMode() ===
//     "owner_prelaunch", always noindex, never in sitemap/nav. This is where
//     review-stage rows (incl. Russian research notes — founder/admin-only per
//     guardrail #15) are visible to the founder before an operator publishes.
//
// Nothing here writes anywhere or touches a database.

import propertiesJson from "@/data/resort-import/properties.json";
import venuesJson from "@/data/resort-import/venues.json";
import offersJson from "@/data/resort-import/offers.json";
import type {
  HospitalityOffer,
  HospitalityProperty,
  ResortVenue,
  OfferType,
} from "./resort";
import { HUB_GATES } from "./resort";
import { RESORT_PUBLISH_WHITELIST } from "./resort-publication";
import { audienceMode, type AudienceMode } from "@/lib/photo-policy";

const PROPERTIES = propertiesJson as HospitalityProperty[];
const VENUES = venuesJson as ResortVenue[];
const OFFERS = offersJson as HospitalityOffer[];

// Tanjung Benoa is the same first-timer area as Nusa Dua (spec §5.1:
// "Nusa Dua & Tanjung Benoa"). Keep the granular value in the data; group it
// under nusa-dua for hub routing.
const DISTRICT_ALIAS: Record<string, string> = { "tanjung-benoa": "nusa-dua" };
export function hubDistrict(d: string): string {
  return DISTRICT_ALIAS[d] ?? d;
}

const propertyById = new Map(PROPERTIES.map((p) => [p.id, p]));
export function getProperty(id: string | null | undefined): HospitalityProperty | undefined {
  return id ? propertyById.get(id) : undefined;
}

// ---------- publication gate (§13.1) ----------
export function isOfferPublishable(o: HospitalityOffer): boolean {
  if (!RESORT_PUBLISH_WHITELIST.has(o.slug)) return false;
  const parent = getProperty(o.propertyId);
  const hasParent = !parent || parent.status !== "inactive";
  const hasDecisionContent = Boolean(o.whatsIncluded || o.scheduleText || o.editorialNote);
  const hasAction = Boolean(o.bookingUrl || o.bookingChannel) || o.priceStatus === "call_to_confirm";
  return (
    hasParent &&
    Boolean(o.name && o.offerType && o.district) &&
    hasDecisionContent &&
    Boolean(o.sourceUrl) &&
    Boolean(o.accessedAt) &&
    hasAction
  );
}

export function isVenuePublishable(v: ResortVenue): boolean {
  if (!RESORT_PUBLISH_WHITELIST.has(v.slug)) return false;
  return Boolean(v.name && v.district && v.sourceUrl && v.accessedAt && v.editorialNote);
}

// ---------- queries ----------
export interface OfferView extends HospitalityOffer {
  property?: HospitalityProperty;
  isPublic: boolean;
}
export interface VenueView extends ResortVenue {
  property?: HospitalityProperty;
  isPublic: boolean;
}

function offerView(o: HospitalityOffer): OfferView {
  return { ...o, property: getProperty(o.propertyId), isPublic: isOfferPublishable(o) };
}
function venueView(v: ResortVenue): VenueView {
  const property = PROPERTIES.find((p) => p.slug === v.parentPropertySlug);
  return { ...v, property, isPublic: isVenuePublishable(v) };
}

/** Offers of a type. `scope` = "public" (indexable) or "preview" (owner
 * prelaunch only: public + review, deduped). */
export function offersByType(
  type: OfferType,
  scope: "public" | "preview",
  district?: string,
): OfferView[] {
  return OFFERS.filter((o) => o.offerType === type)
    .map(offerView)
    .filter((o) => (scope === "public" ? o.isPublic : true))
    .filter((o) => (district ? hubDistrict(o.district) === district : true))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function hotelRestaurants(scope: "public" | "preview", district?: string): VenueView[] {
  return VENUES.map(venueView)
    .filter((v) => (scope === "public" ? v.isPublic : true))
    .filter((v) => (district ? hubDistrict(v.district) === district : true))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getOffer(slug: string): OfferView | undefined {
  const o = OFFERS.find((x) => x.slug === slug);
  return o ? offerView(o) : undefined;
}

/** Slugs eligible for static generation of offer detail pages: only public
 * (whitelisted + gated) ones get a real indexable page. */
export function publicOfferSlugs(type?: OfferType): string[] {
  return OFFERS.filter((o) => (type ? o.offerType === type : true))
    .map(offerView)
    .filter((o) => o.isPublic)
    .map((o) => o.slug);
}

// ---------- hub gate (§13.2) ----------
export function globalHubPasses(entries: { district: string }[]): boolean {
  const districts = new Set(entries.map((e) => hubDistrict(e.district)));
  return entries.length >= HUB_GATES.globalHub.minEntries && districts.size >= HUB_GATES.globalHub.minDistricts;
}
export function districtHubPasses(entries: unknown[]): boolean {
  return entries.length >= HUB_GATES.districtHub.minEntries;
}

/** Whether owner-preview content should render at all (server-side). */
export function previewEnabled(mode: AudienceMode = audienceMode()): boolean {
  return mode === "owner_prelaunch";
}
