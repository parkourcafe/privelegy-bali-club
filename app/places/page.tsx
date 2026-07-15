import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedVenues, getDistrictHubs, isPublicReadyVenue, type VenueWithPerk } from "@/lib/data";
import { getTripMission, getTripDuration } from "@/lib/trip-missions";
import {
  getUluwatuContent,
  normalizeDistrictParam,
  ULUWATU_DB_SLUG,
} from "@/lib/uluwatu/venues";
import PlacesView, { type CataloguePlace } from "./PlacesView";
import SceneImage from "@/components/landing/SceneImage";
import HeroLoop from "@/components/landing/HeroLoop";

export const dynamic = "force-dynamic";

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

export default async function PlacesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string | string[];
    district?: string | string[];
    category?: string | string[];
    intent?: string | string[];
    m?: string | string[];
    dur?: string | string[];
  }>;
}) {
  const [tracked, params] = await Promise.all([getPublishedVenues(), searchParams]);

  const ready = tracked.filter(isPublicReadyVenue);
  const venues = ready.map(enrichForCards);

  return (
    <div className="page-dark">
      <main className="site-shell">
        {/* Cinematic full-width masthead: golden-hour poster (SVG art + build-
            fetched still) with the Ubud dawn loop fading in on desktop — the
            same performance/motion gates as the landing hero. Atmosphere only,
            never a specific venue. Replaces the old abstract "signal" tile. */}
        <header className="ob-grain relative -mx-5 mb-10 overflow-hidden sm:mx-0 sm:rounded-3xl sm:border sm:border-[var(--ob-line)]">
          <div className="relative min-h-[20rem] md:min-h-[24rem]">
            <SceneImage scene="hero-sunset" variant="sunset" imgClassName="ob-grade" />
            <HeroLoop src="/scenes/places-coast-loop.mp4" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#16100c]/85 via-[#16100c]/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#16100c] to-transparent" />

            <div className="relative flex min-h-[20rem] flex-col justify-between p-6 sm:p-9 md:min-h-[24rem]">
              <div className="flex items-start justify-between gap-4">
                <Link href="/" className="topline">
                  ← Other Bali
                </Link>
                <Link href="/plan" className="quiet-link">
                  Canggu day →
                </Link>
              </div>
              <div className="max-w-2xl pt-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(198,154,92,0.5)] bg-black/30 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-[#e2ba79] backdrop-blur-sm">
                  {`${ready.length} curated places · resident-checked`}
                </span>
                <h1 className="hero-title mt-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                  Places across Bali
                </h1>
                <p className="hero-copy max-w-xl drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
                  A curated map of Bali by district. Every place here is one we
                  can stand behind — why it&apos;s worth it, who it suits, and
                  what to expect. Offers appear only when venues confirm them.
                </p>
              </div>
            </div>
          </div>
        </header>

        <PlacesView
          venues={venues}
          initialFilters={{
            query: firstParam(params.q),
            // Public URLs may say ?district=uluwatu; data keys off the
            // internal slug (brief §5 mapping — no duplicated rows).
            district: normalizeDistrictParam(firstParam(params.district)),
            category: firstParam(params.category),
            intentMode: firstParam(params.intent) === "1",
            missionLabel: getTripMission(firstParam(params.m))?.label,
            durationLabel: getTripDuration(firstParam(params.dur))?.label,
          }}
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
