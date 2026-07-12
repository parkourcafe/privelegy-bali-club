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
    title: "Places",
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
    all?: string | string[];
    m?: string | string[];
    dur?: string | string[];
  }>;
}) {
  const [tracked, params] = await Promise.all([getPublishedVenues(), searchParams]);

  // Public default: only publication-gated places. `?all=1` is the internal
  // review view that surfaces every tracked row (including held/sparse rows).
  const showAll = firstParam(params.all) === "1";
  const ready = tracked.filter(isPublicReadyVenue);
  const venues = (showAll ? tracked : ready).map(enrichForCards);

  return (
    <div className="page-dark">
      <main className="site-shell">
        <header className="hero-grid">
          <div>
            <div className="flex items-start justify-between">
              <Link href="/" className="topline">
                ← Other Bali
              </Link>
              <Link href="/plan" className="quiet-link">
                Canggu day →
              </Link>
            </div>
            <h1 className="hero-title mt-3">Places across Bali</h1>
            <p className="hero-copy">
              A curated map of Bali by district. A place appears here once we have
              enough to help you decide — why it&apos;s worth it, who it suits, and
              what to expect. Offers appear only when venues confirm them.
            </p>
          </div>
          <div className="editorial-signal" aria-label="Bali places signal">
            <p className="editorial-signal-label">
              {showAll
                ? `Internal view · ${tracked.length} places tracked`
                : `${ready.length} places ready · ${tracked.length} tracked`}
            </p>
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
