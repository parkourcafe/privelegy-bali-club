// Pure, data-derived text + structured-data helpers for the /bali/[district]
// SEO hubs. Everything here is composed from REAL venue data (counts, category
// mix, area names) and the editorial district guide — no invented claims, no
// hype, no lorem (guardrail: "no invented content", "no lorem in tourist UI").
// Answer-first and machine-extractable for AEO (docs/seo-strategy.md §4).

import type { DistrictHub, IntentSpoke } from "./data";
import type { VenueWithPerk } from "./data";
import { DISTRICT_GUIDE } from "./districts";

export const SITE_ORIGIN = "https://www.otherbali.com";

// Plural section labels. Ordered so the highest-intent food/drink sections lead.
export const HUB_CATEGORY_LABEL: Record<string, string> = {
  restaurant: "Restaurants",
  cafe: "Cafés",
  beach_club: "Beach clubs",
  bar: "Bars",
  warung: "Warungs",
  surf: "Surf",
  spa: "Spas & wellness",
};

const CATEGORY_ORDER = ["restaurant", "cafe", "beach_club", "bar", "warung", "surf", "spa"];

// Singular, lower-case — for prose counts ("48 restaurants, 20 cafés").
const CATEGORY_SINGULAR: Record<string, string> = {
  restaurant: "restaurant",
  cafe: "café",
  beach_club: "beach club",
  bar: "bar",
  warung: "warung",
  surf: "surf spot",
  spa: "spa",
};

function pluralise(n: number, singular: string): string {
  if (n === 1) return `1 ${singular}`;
  // café -> cafés, bar -> bars, beach club -> beach clubs, spa -> spas
  return `${n} ${singular}${singular.endsWith("s") ? "es" : "s"}`;
}

export interface CategoryGroup {
  key: string;
  label: string;
  venues: VenueWithPerk[];
}

// Group a hub's venues by category, in display order, unknown categories last.
export function groupByCategory(venues: VenueWithPerk[]): CategoryGroup[] {
  const byCat = new Map<string, VenueWithPerk[]>();
  for (const v of venues) {
    const list = byCat.get(v.category) ?? [];
    list.push(v);
    byCat.set(v.category, list);
  }
  const keys = [...byCat.keys()].sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a);
    const ib = CATEGORY_ORDER.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
  });
  return keys.map((key) => ({
    key,
    label: HUB_CATEGORY_LABEL[key] ?? key.replace(/_/g, " "),
    venues: byCat.get(key)!,
  }));
}

// Top sub-areas by frequency (real `area` values, first token before any "/").
export function topAreas(venues: VenueWithPerk[], limit = 4): string[] {
  const counts = new Map<string, number>();
  for (const v of venues) {
    const raw = (v.area ?? "").split("/")[0].trim();
    if (!raw) continue;
    counts.set(raw, (counts.get(raw) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([area]) => area);
}

// "48 restaurants, 20 cafés and 5 beach clubs" — factual category mix.
export function categoryPhrase(venues: VenueWithPerk[]): string {
  const groups = groupByCategory(venues).filter((g) => CATEGORY_SINGULAR[g.key]);
  const parts = groups
    .slice(0, 4)
    .map((g) => pluralise(g.venues.length, CATEGORY_SINGULAR[g.key]));
  if (parts.length === 0) return `${venues.length} places`;
  if (parts.length === 1) return parts[0];
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

function guideEntry(slug: string) {
  return DISTRICT_GUIDE.find((d) => d.slug === slug);
}

// Answer-first, factual hub intro. First sentence is directly quotable.
export function hubIntro(hub: DistrictHub): string {
  const g = guideEntry(hub.slug);
  const areas = topAreas(hub.venues, 3);
  const mix = categoryPhrase(hub.venues);
  const lead = `Other Bali tracks ${hub.venues.length} places in ${hub.name} — ${mix}${
    areas.length ? `, clustered around ${listJoin(areas)}` : ""
  }.`;
  const moment = g?.moment ? ` ${g.moment}` : "";
  const bestFor = g?.bestFor?.length
    ? ` Best for ${listJoin(g.bestFor)}.`
    : "";
  return `${lead}${moment}${bestFor}`.trim();
}

// ≤ ~155 chars, for <meta description>.
export function hubMetaDescription(hub: DistrictHub): string {
  const areas = topAreas(hub.venues, 2);
  const base = `Where to eat & go in ${hub.name}, Bali — ${hub.venues.length} curated places${
    areas.length ? ` across ${listJoin(areas)}` : ""
  }. Free to use; travellers never pay.`;
  return base.length <= 158 ? base : base.slice(0, 155).trimEnd() + "…";
}

export interface Faq {
  q: string;
  a: string;
}

export function hubFaqs(hub: DistrictHub): Faq[] {
  const areas = topAreas(hub.venues, 4);
  const faqs: Faq[] = [
    {
      q: `How many places does Other Bali track in ${hub.name}?`,
      a: `${hub.venues.length} — ${categoryPhrase(hub.venues)}.`,
    },
  ];
  if (areas.length) {
    faqs.push({
      q: `Which areas of ${hub.name} does it cover?`,
      a: `Mostly ${listJoin(areas)}.`,
    });
  }
  if (hub.slug === "canggu") {
    faqs.push({
      q: `Can I reserve a table in Canggu through Other Bali?`,
      a: `Yes. Bookable Canggu venues hand off to a confirmed reservation; the rest show directions and a WhatsApp link. Travellers never pay a fee.`,
    });
  }
  faqs.push({
    q: `Do travellers pay to use Other Bali?`,
    a: `No. Other Bali is a free planning guide — browse places, routes and any offers at no cost.`,
  });
  return faqs;
}

// ---- Intent spoke (/bali/[district]/[intent]) helpers ----

export function spokeTitle(spoke: IntentSpoke): string {
  return `Best ${spoke.intent.label} in ${spoke.districtName}`;
}

// Answer-first, quotable first sentence — real count + areas, no hype.
export function spokeIntro(spoke: IntentSpoke): string {
  const areas = topAreas(spoke.venues, 3);
  const lead = `Other Bali tracks ${spoke.venues.length} ${spoke.intent.noun} in ${spoke.districtName}${
    areas.length ? `, clustered around ${listJoin(areas)}` : ""
  } — for ${spoke.intent.blurb}.`;
  return `${lead} Each pick below lists what to order and the price anchor.`;
}

export function spokeMetaDescription(spoke: IntentSpoke): string {
  const base = `Best ${spoke.intent.label.toLowerCase()} in ${spoke.districtName}, Bali — ${spoke.venues.length} ${spoke.intent.noun} with what to order and prices. Free to use; travellers never pay.`;
  return base.length <= 158 ? base : base.slice(0, 155).trimEnd() + "…";
}

export function spokeFaqs(spoke: IntentSpoke): Faq[] {
  const top = spoke.venues.slice(0, 3).map((v) => v.name);
  const faqs: Faq[] = [
    {
      q: `How many ${spoke.intent.noun} does Other Bali list in ${spoke.districtName}?`,
      a: `${spoke.venues.length}${
        spoke.venues.length ? `, starting with ${listJoin(top)}.` : "."
      }`,
    },
    {
      q: `Do travellers pay to use Other Bali?`,
      a: `No. Other Bali is free — browse ${spoke.intent.noun}, prices and directions at no cost.`,
    },
  ];
  return faqs;
}

function spokeSchemaType(category: string): string {
  return schemaTypeFor(category);
}

export function spokeJsonLd(spoke: IntentSpoke): object[] {
  const url = `${SITE_ORIGIN}/bali/${spoke.district}/${spoke.intent.urlSlug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
        { "@type": "ListItem", position: 2, name: "Bali", item: `${SITE_ORIGIN}/bali` },
        {
          "@type": "ListItem",
          position: 3,
          name: spoke.districtName,
          item: `${SITE_ORIGIN}/bali/${spoke.district}`,
        },
        { "@type": "ListItem", position: 4, name: spoke.intent.label, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: spokeTitle(spoke),
      numberOfItems: spoke.venues.length,
      itemListElement: spoke.venues.map((v, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": spokeSchemaType(v.category),
          name: v.name,
          ...(v.address ? { address: v.address } : {}),
          ...(v.area ? { areaServed: v.area } : {}),
          ...(v.priceAnchor ? { priceRange: v.priceAnchor } : {}),
          ...(v.gmapsUrl ? { hasMap: v.gmapsUrl } : {}),
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: spokeFaqs(spoke).map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
}

// Oxford-comma-free "a, b and c".
function listJoin(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

// Restaurant for food/drink, LocalBusiness otherwise — keeps schema honest.
function schemaTypeFor(category: string): string {
  return ["restaurant", "cafe", "beach_club", "bar", "warung"].includes(category)
    ? "Restaurant"
    : "LocalBusiness";
}

// BreadcrumbList + ItemList + FAQPage as a JSON-LD array (Google accepts arrays).
export function hubJsonLd(hub: DistrictHub): object[] {
  const hubUrl = `${SITE_ORIGIN}/bali/${hub.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
        { "@type": "ListItem", position: 2, name: "Bali", item: `${SITE_ORIGIN}/bali` },
        { "@type": "ListItem", position: 3, name: hub.name, item: hubUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Where to eat & go in ${hub.name}`,
      numberOfItems: hub.venues.length,
      itemListElement: hub.venues.map((v, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": schemaTypeFor(v.category),
          name: v.name,
          ...(v.address ? { address: v.address } : {}),
          ...(v.area ? { areaServed: v.area } : {}),
          ...(v.priceAnchor ? { priceRange: v.priceAnchor } : {}),
          ...(v.gmapsUrl ? { hasMap: v.gmapsUrl } : {}),
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: hubFaqs(hub).map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
}
