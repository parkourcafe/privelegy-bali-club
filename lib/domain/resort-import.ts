// Deterministic importer for the resort research CSV (IA spec v1 §9).
// Pure functions — file IO lives in scripts/import-resort-csv.mjs.
//
// Guarantees (§9): deterministic (same input → byte-identical output, sorted
// by slug, no clocks/uuids), idempotent, validates URLs/enums/dates/money,
// never invents data ([NO DATA] → null + explicit status), never publishes
// (publicationStatus is always "review"), emits an accepted/rejected/warnings
// review report.

import type {
  HospitalityOffer,
  HospitalityProperty,
  ResortVenue,
  OfferType,
  PriceStatus,
  SourceType,
} from "./resort";

export interface ImportReport {
  accepted: { properties: number; venues: number; offers: number };
  rejected: { row: number; name: string; reason: string }[];
  warnings: { row: number; name: string; warning: string }[];
}

export interface ImportResult {
  properties: HospitalityProperty[];
  venues: ResortVenue[];
  offers: HospitalityOffer[];
  report: ImportReport;
}

// ---------- CSV ----------
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQ = false;
      } else field += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ",") {
      cur.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      cur.push(field);
      field = "";
      if (cur.length > 1 || cur[0] !== "") rows.push(cur);
      cur = [];
    } else field += ch;
  }
  if (field !== "" || cur.length) {
    cur.push(field);
    if (cur.length > 1 || cur[0] !== "") rows.push(cur);
  }
  if (rows.length === 0) return [];
  const head = rows[0].map((h) => h.trim());
  return rows.slice(1).map((r) => {
    const o: Record<string, string> = {};
    head.forEach((h, i) => (o[h] = (r[i] ?? "").trim()));
    return o;
  });
}

// ---------- normalization ----------
const NO_DATA = /\[NO DATA\]/i;
const MARKERS = /\[(ИНТЕРПРЕТАЦИЯ|ИЗВЛЕЧЕНО|EXTRACTED|VERIFIED|INTERPRETED)\]\s*/gi;

/** [NO DATA] → null; strips research markers (§9: [NO DATA] never becomes a
 * business value; markers stay in the research CSV only). */
export function normalizeText(raw: string | undefined): string | null {
  if (!raw) return null;
  const t = raw.replace(MARKERS, "").trim();
  if (!t || NO_DATA.test(raw)) return null;
  return t;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function validHttpsUrl(u: string | null): string | null {
  if (!u) return null;
  try {
    const url = new URL(u);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

export function validIsoDate(d: string | null): string | null {
  if (!d) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(d) && Number.isFinite(Date.parse(d)) ? d : null;
}

/** Parse IDR amounts out of a price string. IDR has no minor unit — "minor" is
 * whole rupiah. Returns null when no unambiguous IDR figure exists (never
 * guesses across currencies). */
export function parseIdr(price: string | null): {
  currency: "IDR" | null;
  priceMinor: number | null;
  priceMinMinor: number | null;
  priceMaxMinor: number | null;
} {
  const none = { currency: null, priceMinor: null, priceMinMinor: null, priceMaxMinor: null } as const;
  if (!price) return { ...none };
  if (/(USD|US\$|AUD|EUR)/i.test(price) && !/IDR|Rp/i.test(price)) return { ...none };
  const nums: number[] = [];
  for (const m of price.matchAll(/(?:IDR|Rp\.?)\s*([\d.,]+)\s*(M\b)?/gi)) {
    const raw = m[1].replace(/[.,](?=\d{3}\b)/g, "").replace(/,/g, ".");
    let n = parseFloat(raw);
    if (!Number.isFinite(n)) continue;
    if (m[2]) n *= 1_000_000;
    else if (/k\b/i.test(price.slice(m.index!, m.index! + m[0].length + 1))) n *= 1_000;
    if (n >= 1000) nums.push(Math.round(n));
  }
  if (nums.length === 0) return { ...none };
  const first = nums[0];
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  return {
    currency: "IDR",
    priceMinor: first,
    priceMinMinor: nums.length > 1 ? min : null,
    priceMaxMinor: nums.length > 1 ? max : null,
  };
}

export function mapSourceType(raw: string | null): SourceType | null {
  if (!raw) return null;
  const t = raw.toLowerCase();
  if (t.includes("official")) return "official";
  if (t.includes("booking")) return "booking_system";
  if (t.includes("aggregator") || t.includes("daypass") || t.includes("klook")) return "aggregator";
  if (t.includes("blog") || t.includes("secondary") || t.includes("editorial")) return "editorial_guide";
  return null;
}

export function derivePriceStatus(
  priceText: string | null,
  sourceTypeRaw: string | null,
  verificationStatus: string | null,
): PriceStatus {
  if (!priceText) return "not_published";
  const v = (verificationStatus ?? "").toLowerCase();
  const s = (sourceTypeRaw ?? "").toLowerCase();
  if (v.includes("conflict") || v.includes("call_required") || v.includes("call_to_confirm"))
    return "call_to_confirm";
  if (s.includes("legacy") || v.includes("stale") || /\[LEGACY/i.test(priceText)) return "stale";
  if (s.includes("official")) return "verified";
  return "call_to_confirm"; // aggregator / blog / unknown: honest, not "verified"
}

// ---------- main mapping (§9) ----------
export function importResortCsv(csvText: string): ImportResult {
  const rows = parseCsv(csvText);
  const properties = new Map<string, HospitalityProperty>();
  const venues = new Map<string, ResortVenue>();
  const offers = new Map<string, HospitalityOffer>();
  const report: ImportReport = {
    accepted: { properties: 0, venues: 0, offers: 0 },
    rejected: [],
    warnings: [],
  };

  rows.forEach((r, idx) => {
    const rowNo = idx + 2; // 1-based + header
    const resort = normalizeText(r.resort);
    const product = normalizeText(r.venue_or_product);
    const district = normalizeText(r.district);
    const type = normalizeText(r.product_type);
    if (!resort || !product || !district || !type) {
      report.rejected.push({
        row: rowNo,
        name: product ?? resort ?? "?",
        reason: "missing required field (resort/venue_or_product/district/product_type)",
      });
      return;
    }
    const districtSlug = slugify(district);
    const star = r.star === "5" ? 5 : r.star === "4" ? 4 : null;
    if (r.star && !star)
      report.warnings.push({ row: rowNo, name: product, warning: `unrecognised star "${r.star}"` });

    const sourceUrl = validHttpsUrl(normalizeText(r.source_url));
    if (normalizeText(r.source_url) && !sourceUrl)
      report.warnings.push({ row: rowNo, name: product, warning: "invalid source_url dropped" });
    const accessedAt = validIsoDate(normalizeText(r.accessed));
    if (normalizeText(r.accessed) && !accessedAt)
      report.warnings.push({ row: rowNo, name: product, warning: "invalid accessed date dropped" });

    // Property (dedupled by slug; first row wins, later rows may enrich star)
    const pSlug = slugify(resort);
    if (!properties.has(pSlug)) {
      properties.set(pSlug, {
        id: `prop_${pSlug}`,
        slug: pSlug,
        name: resort,
        propertyType: /resort|villas|suites/i.test(resort) ? "resort" : "hotel",
        district: districtSlug,
        area: null,
        starRating: star,
        officialUrl: sourceUrl && !/daypassapp|klook|marriott\.com\/offers/i.test(sourceUrl) ? null : null,
        instagramUrl: null,
        googleMapsUrl: null,
        status: "review",
        publicationStatus: "review",
        lastVerifiedAt: accessedAt,
      });
    } else if (star && !properties.get(pSlug)!.starRating) {
      properties.get(pSlug)!.starRating = star;
    }

    const monetizeRaw = (normalizeText(r.monetize) ?? "coverage").toLowerCase();
    const audienceTags = (normalizeText(r.audience) ?? "")
      .split(/[,;/]/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const priceText = normalizeText(r.price);
    const verification = normalizeText(r.verification_status ?? "");

    if (type === "resort_restaurant") {
      const vSlug = `${pSlug}--${slugify(product)}`;
      if (venues.has(vSlug)) {
        report.warnings.push({ row: rowNo, name: product, warning: "duplicate venue row skipped" });
        return;
      }
      // openToNonGuests only from explicit evidence — never invented (§18).
      const v = (verification ?? "").toLowerCase();
      const openToNonGuests = v.includes("non_guest_access")
        ? v.includes("call_required")
          ? null
          : true
        : null;
      venues.set(vSlug, {
        slug: vSlug,
        name: product,
        category: "restaurant",
        district: districtSlug,
        parentPropertySlug: pSlug,
        openToNonGuests,
        sourceUrl,
        accessedAt,
        editorialNote: normalizeText(r.honest_note),
        publicationStatus: "review",
      });
      report.accepted.venues++;
      return;
    }

    const OFFER_TYPES: OfferType[] = ["day_pass", "brunch", "pool_day_use", "spa_package"];
    if (!OFFER_TYPES.includes(type as OfferType)) {
      report.rejected.push({ row: rowNo, name: product, reason: `unknown product_type "${type}"` });
      return;
    }
    const oSlug = `${pSlug}--${slugify(product)}`;
    if (offers.has(oSlug)) {
      report.warnings.push({ row: rowNo, name: product, warning: "duplicate offer row skipped" });
      return;
    }
    const money = parseIdr(priceText);
    const priceSourceType = normalizeText(r.price_source_type ?? "") ?? normalizeText(r.booking_channel);
    const priceStatus = derivePriceStatus(priceText, priceSourceType, verification);
    offers.set(oSlug, {
      id: `offer_${oSlug}`,
      slug: oSlug,
      offerType: type as OfferType,
      name: product,
      propertyId: `prop_${pSlug}`,
      venueSlug: null,
      district: districtSlug,
      currency: money.currency,
      priceMinor: money.priceMinor,
      priceMinMinor: money.priceMinMinor,
      priceMaxMinor: money.priceMaxMinor,
      priceText,
      priceStatus,
      whatsIncluded: normalizeText(r.whats_included),
      scheduleText: normalizeText(r.hours),
      hoursText: null,
      // A day pass / brunch sold to the public is definitionally open to
      // non-guests; that's the product, not an invention.
      openToNonGuests: true,
      bookingChannel: normalizeText(r.booking_channel),
      bookingUrl: null,
      audienceTags,
      editorialNote: normalizeText(r.honest_note),
      sourceType: mapSourceType(priceSourceType),
      sourceUrl,
      accessedAt,
      // §9: accessed date is NOT automatically a price verification.
      priceVerifiedAt: priceStatus === "verified" ? accessedAt : null,
      lastVerifiedAt: accessedAt,
      availabilityStatus:
        (verification ?? "").includes("unavailable") ? "unavailable" : "review",
      monetizationMode: monetizeRaw === "seated" ? "seated" : "coverage",
      publicationStatus: "review",
    });
    report.accepted.offers++;
  });

  report.accepted.properties = properties.size;
  const bySlug = <T extends { slug: string }>(m: Map<string, T>) =>
    [...m.values()].sort((a, b) => a.slug.localeCompare(b.slug));
  return {
    properties: bySlug(properties),
    venues: bySlug(venues),
    offers: bySlug(offers),
    report,
  };
}
