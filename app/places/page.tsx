import type { Metadata } from "next";
import Link from "next/link";
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

const PAGE_SIZE = 24;

// Canonicalize the district-filtered tool view onto its hub page so the
// query-param surface doesn't compete with /bali/[district] for ranking
// (docs/seo-strategy.md §2). Self-canonical otherwise (incl. Uluwatu, which
// ranks via its own /uluwatu pillar, not a programmatic hub).
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ district?: string | string[] }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const district = firstParam(params.district);
  const hubs = district ? await getDistrictHubs() : [];
  const hub = hubs.find((h) => h.slug === district);
  return {
    title: "Places to eat, drink & go in Bali — by district",
    description:
      "A curated, resident-checked map of Bali by district — cafés, restaurants, beach clubs, bars and wellness, with who each place suits and what to expect. Free to browse; travellers never pay.",
    alternates: { canonical: hub ? `/bali/${hub.slug}` : "/places" },
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

function pageNumber(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export default async function PlacesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string | string[];
    district?: string | string[];
    category?: string | string[];
    moment?: string | string[];
    intent?: string | string[];
    m?: string | string[];
    dur?: string | string[];
    page?: string | string[];
  }>;
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
  const page = Math.min(pageNumber(firstParam(params.page)), totalPages);
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

  return (
    <div>
      <main className="site-shell">
        {/* Cinematic full-width masthead: golden-hour poster (SVG art + build-
            fetched still) with the Ubud dawn loop fading in on desktop — the
            same performance/motion gates as the landing hero. Atmosphere only,
            never a specific venue. Self-contained dark block on the light
            editorial page (mockup design system, 2026-07-16). */}
        <header className="places-masthead ob-grain relative -mx-4 mb-10 overflow-hidden sm:mx-0 sm:rounded-3xl sm:border sm:border-[rgba(22,16,12,0.35)]">
          <div className="relative min-h-[20rem] md:min-h-[24rem]">
            <SceneImage scene="hero-sunset" variant="sunset" imgClassName="ob-grade" />
            <HeroLoop src="/scenes/places-coast-loop.mp4" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#16100c]/85 via-[#16100c]/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#16100c] to-transparent" />

            <div className="relative flex min-h-[20rem] flex-col justify-between p-6 sm:p-9 md:min-h-[24rem]">
              <div className="flex items-start justify-between gap-4">
                <BrandHomeLink />
                <Link href="/plan" className="quiet-link">
                  Canggu day →
                </Link>
              </div>
              <div className="max-w-2xl pt-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(198,154,92,0.5)] bg-black/30 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-[#e2ba79] backdrop-blur-sm">
                  {`${ready.length} curated places · resident-checked`}
                </span>
                <h1 className="hero-title mt-4 text-[#f4ece0] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                  {districtName ? `Places in ${districtName}` : "Places across Bali"}
                </h1>
                <p className="hero-copy max-w-xl text-[#cdbfa9] drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
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
