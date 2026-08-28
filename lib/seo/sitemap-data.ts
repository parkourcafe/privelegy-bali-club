import type { MetadataRoute } from "next";
import { getRoutes, getDistrictHubs, getIntentSpokes, getPublishedVenues } from "@/lib/data";
import { isVenueIndexable } from "@/lib/publication";
import { SCENARIOS } from "@/lib/scenarios";
import { GUIDES } from "@/lib/guides";
import { PILLARS } from "@/lib/pillars";
import { RESORT_FNB_PAGES } from "@/lib/resort-fnb";
import { publicOfferSlugs } from "@/lib/domain/resort-repo";
import { hotelRestaurantsHubIndexable } from "@/components/resort/HotelRestaurantsHub";
import { LIGHT_DISTRICT_SLUGS } from "@/lib/light-districts";
import { liveCollectionSlugs } from "@/lib/collections";
import { staticLastModified, validLastModified } from "@/lib/seo/sitemap-last-modified";
import { CANONICAL_SITE_ORIGIN } from "@/lib/site-origin-policy";
import { canonicalProgrammaticDistrictHubs } from "@/lib/seo/canonical-district-hubs";
import { isSitemapSection, type SitemapSection } from "@/lib/seo/sitemap-index";

const BASE = CANONICAL_SITE_ORIGIN;

function sectionForPath(pathname: string): SitemapSection {
  const guidePaths = new Set([
    "/guides",
    ...GUIDES.map((guide) => `/${guide.slug}`),
    ...PILLARS.flatMap((pillar) => [`/${pillar.slug}`, ...pillar.children.map((child) => child.path)]),
  ]);
  const offerPaths = new Set(RESORT_FNB_PAGES.map((page) => page.url));

  if (pathname === "/places" || pathname.startsWith("/places/")) return "places";
  if (guidePaths.has(pathname)) return "guides";
  if (pathname.startsWith("/route/")) return "routes";
  if (pathname === "/collections" || pathname.startsWith("/collections/")) return "collections";
  if (
    offerPaths.has(pathname)
    || pathname === "/hotel-restaurants"
    || pathname.endsWith("/hotel-restaurants")
    || pathname.startsWith("/day-passes/")
    || pathname.startsWith("/brunches/")
  ) return "offers";
  return "content";
}

export async function buildSectionSitemap(section: string): Promise<MetadataRoute.Sitemap> {
  if (!isSitemapSection(section)) return [];
  // Each child route reads only the inventory it owns. This keeps sitemap
  // segmentation from multiplying the previous all-in-one Supabase workload.
  const [routes, hubs, spokes, catalogue, collectionSlugs] = await Promise.all([
    section === "routes" ? getRoutes() : [],
    section === "content" ? getDistrictHubs() : [],
    section === "content" ? getIntentSpokes() : [],
    section === "places" ? getPublishedVenues() : [],
    section === "collections" ? liveCollectionSlugs() : [],
  ]);
  // Every venue whose detail page is indexable (publication bar), all districts.
  const indexableVenues = catalogue.filter(isVenueIndexable);
  const canonicalHubs = canonicalProgrammaticDistrictHubs(hubs);
  const entries: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    // The working tool lives at /plan (landing funnels into it).
    { url: `${BASE}/plan`, changeFrequency: "daily", priority: 0.9 },
    // Bali-wide curated places catalogue.
    { url: `${BASE}/places`, changeFrequency: "daily", priority: 0.8 },
    // Trust and service pages are public, canonical and linked site-wide.
    { url: `${BASE}/about`, lastModified: "2026-08-28", changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/support`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/together`, changeFrequency: "monthly", priority: 0.5 },
    // Venue self-submission intake ("add your place") — owners search for this.
    { url: `${BASE}/for-venues`, changeFrequency: "monthly", priority: 0.5 },
    // Villa partner page — villa managers search "list my villa Bali guide".
    { url: `${BASE}/villas`, changeFrequency: "monthly", priority: 0.5 },
    // Hotel partner page — hotel/resort operators search "list my hotel Bali".
    { url: `${BASE}/hotels`, changeFrequency: "monthly", priority: 0.5 },
    // Unified property submission page (villa + hotel intake behind the "Add"
    // CTAs on /villas and /hotels).
    { url: `${BASE}/list-your-property`, changeFrequency: "monthly", priority: 0.5 },
    // SEO hub index + per-district hubs — the programmatic ranking surface for
    // districts without a hand-crafted pillar (Uluwatu is excluded — it has its
    // own /uluwatu pillar below).
    { url: `${BASE}/bali`, changeFrequency: "weekly", priority: 0.9 },
    ...canonicalHubs.map((h) => ({
      url: `${BASE}/bali/${h.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    // Intent spokes — the long-tail engine ("best {intent} in {district}").
    ...spokes.map((s) => ({
      url: `${BASE}/bali/${s.district}/${s.intent.urlSlug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Trip-mission scenario landing pages (§6a.3).
    ...SCENARIOS.map((s) => ({
      url: `${BASE}/${s.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    // Guides hub + the long-form editorial guides (top-of-funnel SEO/AEO).
    { url: `${BASE}/guides`, changeFrequency: "weekly", priority: 0.8 },
    ...GUIDES.map((g) => ({
      url: `${BASE}/${g.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...routes.map((r) => ({
      url: `${BASE}/route/${r.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // District pillars + their editorial children (driven by lib/pillars.ts so
    // the sitemap can't drift from the actual pages). The Ubud wellness guide is
    // registered there too. These are stable editorial pages and are ALWAYS
    // emitted — they must never drop out of the sitemap because a venue-set
    // completeness check drifted (the flagship /uluwatu tree was previously
    // gated on that and could silently vanish).
    ...PILLARS.flatMap((p) => [
      { url: `${BASE}/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.9 },
      ...p.children.map((c) => ({
        url: `${BASE}${c.path}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ]),
    // Lightweight editorial landings for Bali's quiet corners (Sidemen, Amed,
    // Munduk, Lovina). Hand-crafted planning_only pages — always emitted; they
    // carry no venue set to gate on.
    ...LIGHT_DISTRICT_SLUGS.map((slug) => ({
      url: `${BASE}/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // Resort-F&B hubs (resort day passes · hotel brunches · sunset · free beach
    // clubs) — price-verified editorial hubs, driven by the generated registry so
    // the sitemap can't drift from the actual pages.
    ...RESORT_FNB_PAGES.map((p) => ({
      url: `${BASE}${p.url}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Resort vertical (IA v1 Phase 3): only offers/hubs past the operator
    // whitelist + publication gate. Empty whitelist → nothing emitted (the
    // hotel-restaurant hubs and offer details stay noindex until published).
    ...publicOfferSlugs("day_pass").map((slug) => ({
      url: `${BASE}/day-passes/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...publicOfferSlugs("brunch").map((slug) => ({
      url: `${BASE}/brunches/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...(hotelRestaurantsHubIndexable(null)
      ? [{ url: `${BASE}/hotel-restaurants`, changeFrequency: "weekly" as const, priority: 0.8 }]
      : []),
    ...(hotelRestaurantsHubIndexable("nusa-dua")
      ? [{ url: `${BASE}/nusa-dua/hotel-restaurants`, changeFrequency: "weekly" as const, priority: 0.8 }]
      : []),
    // My Day — the morning-to-night plan built from live collections.
    { url: `${BASE}/my-day`, changeFrequency: "weekly" as const, priority: 0.8 },
    // Taste Collections — include the hub only when at least one collection is
    // past the publication gate. The URL itself remains available, but empty
    // collection inventory should not be promoted from public crawl surfaces.
    ...(collectionSlugs.length > 0
      ? [{ url: `${BASE}/collections`, changeFrequency: "weekly" as const, priority: 0.8 }]
      : []),
    ...collectionSlugs.map((slug) => ({
      url: `${BASE}/collections/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Venue detail pages — ONLY those that passed the evidence-backed
    // publication gate (review/incomplete venues stay noindex + unlisted).
    ...indexableVenues.map((venue) => ({
      url: `${BASE}/places/${venue.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      ...(validLastModified(venue.lastVerifiedAt)
        ? { lastModified: venue.lastVerifiedAt }
        : {}),
    })),
  ];

  // Add static dates only where a significant content review is recorded.
  // Missing is safer than a synthetic "today" value that lies to crawlers.
  return entries.map((entry) => {
    const pathname = new URL(entry.url).pathname;
    const lastModified = staticLastModified(pathname);
    return lastModified && !entry.lastModified
      ? { ...entry, lastModified }
      : entry;
  }).filter((entry) => sectionForPath(new URL(entry.url).pathname) === section);
}
