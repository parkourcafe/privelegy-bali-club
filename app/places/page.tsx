import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrandHomeLink from "@/components/BrandHomeLink";
import { getPublishedVenues, getDistrictHubs, isPublicReadyVenue, type VenueWithPerk } from "@/lib/data";
import { getTripMission, getTripDuration } from "@/lib/trip-missions";
import {
  getUluwatuContent,
  normalizeDistrictParam,
  ULUWATU_DB_SLUG,
} from "@/lib/uluwatu/venues";
import PlacesView, {
  type CatalogueFilters,
  type CataloguePlace,
  type CatalogueTopPick,
} from "./PlacesView";
import SceneImage from "@/components/landing/SceneImage";
import HeroLoop from "@/components/landing/HeroLoop";
import { MOMENT_BY_SLUG } from "@/lib/catalogue-moments";
import { DISTRICT_GUIDE } from "@/lib/districts";
import { parsePlacesPageNumber, placesCanonical } from "@/lib/seo/places-indexing";

const PAGE_SIZE = 24;

type PlacesSearchParams = {
  q?: string | string[];
  district?: string | string[];
  category?: string | string[];
  moment?: string | string[];
  intent?: string | string[];
  m?: string | string[];
  dur?: string | string[];
  page?: string | string[];
};

// Canonicalize the district-filtered tool view onto its hub page so the
// query-param surface doesn't compete with /bali/[district] for ranking
// (docs/seo-strategy.md §2). Self-canonical otherwise (incl. Uluwatu, which
// ranks via its own /uluwatu pillar, not a programmatic hub).
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<PlacesSearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const district = normalizeDistrictParam(firstParam(params.district));
  const hubs = district ? await getDistrictHubs() : [];
  const hub = hubs.find((h) => h.slug === district);
  const rawPage = firstParam(params.page).trim();
  const parsedPage = parsePlacesPageNumber(rawPage);
  const requestedPage = parsedPage ?? 1;
  const hasFilters = [
    params.q,
    params.district,
    params.category,
    params.moment,
    params.intent,
    params.m,
    params.dur,
  ].some((value) => firstParam(value).trim().length > 0);
  const canonical = placesCanonical({
    hasFilters,
    hubPath: hub ? `/bali/${hub.slug}` : undefined,
    requestedPage,
  });
  const title = !hasFilters && requestedPage > 1
    ? `Places to eat, drink & go in Bali — page ${requestedPage}`
    : "Places to eat, drink & go in Bali — by district";
  return {
    title,
    description:
      "A curated, resident-checked map of Bali by district — cafés, restaurants, beach clubs, bars and wellness, with who each place suits and what to expect. Free to browse; travellers never pay.",
    alternates: { canonical },
    robots: hasFilters || parsedPage === null
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title,
      description:
        "A resident-checked map of Bali by district, with clear fit notes and practical actions.",
      url: `https://www.otherbali.com${canonical}`,
      type: "website",
    },
  };
}

function firstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

// Card-level price band: prefer the explicit "Price band: $$" research format;
// free-form price anchors (e.g. "Americano 35k") stay off the card.
function parsePriceBand(anchor?: string): string | undefined {
  const m = anchor?.match(/^Price band:\s*(\${1,4})$/);
  return m?.[1];
}

function enrichForCards(v: VenueWithPerk): CataloguePlace {
  const uluwatu = v.district === ULUWATU_DB_SLUG ? getUluwatuContent(v.slug) : null;
  return {
    ...v,
    cardLine: uluwatu?.verdict ?? v.whyItsHere,
    cardArea: uluwatu?.microArea ?? v.area,
    cardBestFor: uluwatu?.bestFor ?? v.bestFor,
    cardPrice: uluwatu?.priceBand ?? parsePriceBand(v.priceAnchor),
  };
}

const catalogueCategoryLabel: Record<string, string> = {
  cafe: "café",
  warung: "warung",
  restaurant: "restaurant",
  beach_club: "beach club",
  spa: "wellness",
  fitness: "fitness",
  yoga: "yoga",
  beauty: "beauty",
  bar: "bar",
  surf: "surf",
};

function catalogueHaystack(venue: CataloguePlace): string {
  return [
    venue.name,
    venue.address,
    venue.area,
    venue.cardArea,
    venue.category,
    ...(venue.wellnessCategories ?? []),
    venue.district,
    venue.whyItsHere,
    venue.cardLine,
    venue.bestFor,
    venue.cardBestFor,
    ...(venue.vibeTags ?? []),
    ...(venue.practicalTags ?? []),
    ...(venue.jobs ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function scoreCatalogueVenue(
  venue: CataloguePlace,
  tokens: string[],
  category: string,
  district: string,
): { score: number; reasons: string[] } {
  const haystack = catalogueHaystack(venue);
  const reasons: string[] = [];
  let score = 0;
  const categoryMatched = Boolean(
    category &&
      (venue.category === category || venue.wellnessCategories?.includes(category as VenueWithPerk["category"])),
  );
  if (categoryMatched) {
    score += 3;
    reasons.push(catalogueCategoryLabel[category] ?? category);
  }
  for (const token of tokens) {
    if (!token || !haystack.includes(token)) continue;
    score += 2;
    if (!(categoryMatched && token === venue.category)) reasons.push(token.replace(/[-_]/g, " "));
  }
  if (district && venue.district === district) score += 1;
  if (venue.photoUrl) score += 1;
  if (venue.bestFor) score += 1;
  if (venue.priceAnchor || venue.whatToOrder) score += 1;
  score += venue.tier === "founding" ? 1 : venue.tier === "launch" ? 0.5 : 0;

  return {
    score,
    reasons: [...new Set(reasons.map((reason) => reason.trim()).filter(Boolean))].slice(0, 4),
  };
}

export default async function PlacesPage({
  searchParams,
}: {
  searchParams: Promise<PlacesSearchParams>;
}) {
  const [tracked, params] = await Promise.all([getPublishedVenues(), searchParams]);

  const ready = tracked.filter(isPublicReadyVenue);
  const venues = ready.map(enrichForCards);
  const moment = MOMENT_BY_SLUG.get(firstParam(params.moment)) ?? null;
  const filters: CatalogueFilters = {
    query: firstParam(params.q).trim(),
    district: normalizeDistrictParam(firstParam(params.district)),
    category: firstParam(params.category),
    moment: moment?.slug ?? "",
    momentLabel: moment?.label,
    intentMode: firstParam(params.intent) === "1",
    mission: firstParam(params.m),
    missionLabel: getTripMission(firstParam(params.m))?.label,
    duration: firstParam(params.dur),
    durationLabel: getTripDuration(firstParam(params.dur))?.label,
  };
  const tokens = filters.query.toLowerCase().split(/\s+/).filter(Boolean);
  // A moment chip is an honest any-match over fields editors already wrote
  // (jobs / vibe tags / why-it's-here). No match on a venue's own record ⇒
  // it simply doesn't appear for that moment (guardrail #10).
  const matchesBrief = (venue: CataloguePlace, withDistrict: boolean) => {
    const haystack = catalogueHaystack(venue);
    return (
      (!withDistrict || !filters.district || venue.district === filters.district) &&
      (!filters.category ||
        venue.category === filters.category ||
        venue.wellnessCategories?.includes(filters.category as VenueWithPerk["category"])) &&
      (!moment || moment.tokens.some((token) => haystack.includes(token))) &&
      (tokens.length === 0 ||
        (filters.intentMode
          ? tokens.some((token) => haystack.includes(token))
          : tokens.every((token) => haystack.includes(token))))
    );
  };
  let filtered = venues.filter((venue) => matchesBrief(venue, true));
  // Moment mode is a ranked answer, not an atlas: best fit first, the top
  // card badged in the view. Score with the moment's own tokens.
  if (moment) {
    filtered = filtered
      .map((venue) => ({
        venue,
        score: scoreCatalogueVenue(venue, [...moment.tokens], filters.category, filters.district).score,
      }))
      .sort((a, b) => b.score - a.score || a.venue.name.localeCompare(b.venue.name))
      .map(({ venue }) => venue);
  }
  // "Nearby — outside <district>": the same brief matched beyond the active
  // district. Deliberately no travel-time claims — routing/ETA belongs to
  // Google Maps (guardrail #1); the card itself names its own district.
  const nearby: CataloguePlace[] =
    filters.district && (moment || filters.category || tokens.length > 0)
      ? venues
          .filter((venue) => venue.district !== filters.district && matchesBrief(venue, false))
          .map((venue) => ({
            venue,
            score: scoreCatalogueVenue(
              venue,
              moment ? [...moment.tokens] : tokens,
              filters.category,
              "",
            ).score,
          }))
          .sort((a, b) => b.score - a.score || a.venue.name.localeCompare(b.venue.name))
          .slice(0, 3)
          .map(({ venue }) => venue)
      : [];
  const ranked: CatalogueTopPick[] =
    filters.intentMode && (tokens.length > 0 || filters.category)
      ? filtered
          .map((venue) => ({ venue, ...scoreCatalogueVenue(venue, tokens, filters.category, filters.district) }))
          .filter(({ score }) => score > 0)
          .sort((a, b) => b.score - a.score || a.venue.name.localeCompare(b.venue.name))
          .slice(0, 3)
          .map(({ venue, reasons }) => ({ venue, reasons }))
      : [];
  const rankedSlugs = new Set(ranked.map(({ venue }) => venue.slug));
  const paginatedMatches = filtered.filter((venue) => !rankedSlugs.has(venue.slug));
  const totalPages = Math.max(1, Math.ceil(paginatedMatches.length / PAGE_SIZE));
  const requestedPage = parsePlacesPageNumber(firstParam(params.page).trim());
  if (requestedPage === null || requestedPage > totalPages) notFound();
  const page = requestedPage;
  const pageVenues = paginatedMatches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const districts = [...new Set(venues.map((venue) => venue.district))].sort();
  const categories = [
    ...new Set(
      venues.flatMap((venue) =>
        venue.wellnessCategories?.length ? venue.wellnessCategories : [venue.category],
      ),
    ),
  ].sort();

  const districtName = filters.district
    ? DISTRICT_GUIDE.find((d) => d.slug === filters.district)?.name ?? null
    : null;

  // Structured data for the catalogue. BreadcrumbList always; the ItemList only
  // on the default, self-canonical view (no filters, page 1) so it never
  // competes with the /bali/[district] hub canonicals a filtered view points to.
  const PLACES_BASE = "https://www.otherbali.com";
  const isDefaultView =
    !filters.district &&
    !filters.category &&
    !filters.query &&
    !filters.moment &&
    !filters.mission &&
    !filters.intentMode &&
    page === 1;
  const placesJsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${PLACES_BASE}/` },
        { "@type": "ListItem", position: 2, name: "Places", item: `${PLACES_BASE}/places` },
      ],
    },
  ];
  if (isDefaultView && pageVenues.length > 0) {
    placesJsonLd.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Curated places across Bali",
      numberOfItems: pageVenues.length,
      itemListElement: pageVenues.map((venue, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${PLACES_BASE}/places/${venue.slug}`,
        name: venue.name,
      })),
    });
  }

  return (
    <div>
      <main className="site-shell">
        {placesJsonLd.map((node, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
          />
        ))}
        {/* Cinematic full-width masthead: golden-hour poster (SVG art + build-
            fetched still) with the Ubud dawn loop fading in on desktop — the
            same performance/motion gates as the landing hero. Atmosphere only,
            never a specific venue. Self-contained dark block on the light
            editorial page (mockup design system, 2026-07-16). */}
        <header className="places-masthead ob-grain relative -mx-4 mb-10 overflow-hidden sm:mx-0 sm:rounded-3xl sm:border sm:border-[rgba(22,16,12,0.35)]">
          <div className="relative min-h-[20rem] md:min-h-[24rem]">
            <SceneImage scene="hero-sunset" variant="sunset" imgClassName="ob-grade" />
            <HeroLoop src="/scenes/places-coast-loop.mp4" />
            {/* Legibility scrim: a light left/right wash for the headline plus a
                stronger bottom-up gradient so the body copy stays readable over
                the bright part of the sunset (matches the landing hero). */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#16100c]/90 via-[#16100c]/55 to-[#16100c]/25" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#16100c] via-[#16100c]/78 to-transparent" />

            <div className="relative flex min-h-[20rem] flex-col justify-between p-6 sm:p-9 md:min-h-[24rem]">
              <div className="flex items-start justify-between gap-4">
                <BrandHomeLink tone="dark" />
                <Link
                  href="/plan"
                  className="text-sm font-medium text-[rgba(250,246,239,0.9)] transition-colors hover:text-white"
                >
                  Canggu day →
                </Link>
              </div>
              <div className="max-w-2xl pt-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(231,183,174,0.55)] bg-black/35 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-[#E7B7AE] backdrop-blur-sm">
                  {`${ready.length} curated places · resident-checked`}
                </span>
                <h1 className="hero-title mt-4 text-[#FAF6EF] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                  {districtName ? `Places in ${districtName}` : "Places across Bali"}
                </h1>
                <p className="hero-copy max-w-xl text-[#FAF6EF] drop-shadow-[0_2px_14px_rgba(0,0,0,0.92)]">
                  A curated map of Bali by district. Every place here is one we
                  can stand behind — why it&apos;s worth it, who it suits, and
                  what to expect. Offers appear only when venues confirm them.
                </p>
              </div>
            </div>
          </div>
        </header>

        <PlacesView
          venues={pageVenues}
          topPicks={page === 1 ? ranked : []}
          filters={filters}
          districts={districts}
          categories={categories}
          nearby={nearby}
          totalMatches={filtered.length}
          totalVenues={venues.length}
          page={page}
          totalPages={totalPages}
        />

        <footer className="mt-16 border-t border-[var(--line)] pt-6 text-xs text-[var(--muted)]">
          <p>
            Planning-only districts do not have QR redemption, paid placement,
            or reservation monetization.
          </p>
          <div className="mt-3 flex gap-4">
            <Link href="/privacy" className="quiet-link">
              Privacy
            </Link>
            <Link href="/terms" className="quiet-link">
              Terms
            </Link>
            <Link href="/support" className="quiet-link">
              Support
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
