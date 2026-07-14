import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import PlaceCard from "@/components/PlaceCard";
import { FaqBlock, GuideFooter, RelatedGuides } from "@/components/GuideBlocks";
import { guidesForDistrict } from "@/lib/guides";
import {
  SANUR_FAQ,
  SANUR_HOTELS,
  SANUR_REVIEW_DATE,
  SANUR_THINGS_TO_DO,
  SANUR_ZONE_LABEL,
} from "@/lib/sanur/content";
import { getSanurVenues, toSanurPlaceCard } from "@/lib/sanur";
import type { VenueWithPerk } from "@/lib/data";

// Sanur pillar page (ContentPage type district_guide). Sanur is the calm,
// sunrise-facing, walkable east-coast base. Coverage this release: destination
// fit, stay zones, a hotel shortlist and things to do — the verified layers of
// the research pack. Restaurants/cafés are a later pass. Planning_only: no
// money surface (guardrail #4).

export const metadata: Metadata = {
  title: "Sanur guide — a calm, walkable, sunrise Bali base",
  description:
    "A practical Sanur guide: who the area suits, where to stay along the 5 km beach path (north, central, south), a hotel shortlist, and the best low-stress things to do.",
  alternates: { canonical: "/sanur" },
  openGraph: {
    title: "The Sanur guide · Other Bali",
    description:
      "Calm sunrise coast, a 5 km beach promenade, stay zones decoded, a hotel shortlist and easy things to do.",
    url: "https://www.otherbali.com/sanur",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Sanur guide · Other Bali",
    description:
      "Calm sunrise coast, stay zones decoded, a hotel shortlist and easy things to do.",
  },
};

const previewHotels = SANUR_HOTELS.slice(0, 3);
const previewThings = SANUR_THINGS_TO_DO.slice(0, 4);

function VenuePicks({ title, note, venues, href }: { title: string; note: string; venues: VenueWithPerk[]; href: string }) {
  if (venues.length === 0) return null;
  return (
    <section className="guide-section">
      <div className="flex items-baseline justify-between gap-4">
        <h2>{title}</h2>
        <Link href={href} className="quiet-link">See all →</Link>
      </div>
      <p className="guide-lede">{note}</p>
      <div className="pick-grid" style={{ marginTop: 16 }}>
        {venues.slice(0, 3).map((v) => (
          <PlaceCard key={v.slug} place={toSanurPlaceCard(v)} />
        ))}
      </div>
    </section>
  );
}

export default async function SanurPillarPage() {
  const venues = await getSanurVenues();
  const restaurants = venues.filter((v) => v.category === "restaurant" || v.category === "warung");
  const cafesBars = venues.filter((v) => v.category === "cafe" || v.category === "bar");
  const wellness = venues.filter((v) => v.category === "spa" || v.category === "yoga" || v.category === "beauty");
  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="district_page_view" slug="sanur" />
        <div className="flex items-start justify-between">
          <Link href="/" className="topline">
            ← Other Bali
          </Link>
          <Link href="/places?district=sanur" className="quiet-link">
            All Sanur places →
          </Link>
        </div>

        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Sanur" }]} />

        <header className="guide-hero">
          <p className="guide-kicker">Sanur · East coast</p>
          <h1 className="guide-title">The Sanur guide</h1>
          <p className="guide-standfirst">
            Sanur is the anti-chaos Bali base: the island&apos;s sunrise coast,
            flatter underfoot and far more walkable than the louder beach
            districts, with roughly 5 km of paved beachfront path and one of
            Bali&apos;s cleanest fast-boat gateways to the Nusa islands. It is a
            place to settle into, not to chase. This guide covers the layers we
            have verified — who it suits, where to stay, and what to do.
          </p>
          <p className="guide-meta-line">
            Editorial review: {SANUR_REVIEW_DATE} · researched, not sponsored ·
            no paid ranking
          </p>
        </header>

        <section className="guide-section">
          <h2>Who Sanur suits — and who it frustrates</h2>
          <div className="guide-prose">
            <p>
              <strong>It suits</strong> families with young children, couples
              on a short calm break, long-stay and slow travellers, low-key
              remote workers, first-time visitors who want easy logistics, and
              anyone using a quieter base for a Nusa Penida or Lembongan day
              trip.
            </p>
            <p>
              <strong>It frustrates</strong> travellers who want nightlife, a
              dense strip of independent cafés, or a fashionable scene — evenings
              here are mild, and Sanur is intentionally low-friction rather than
              trend-chasing. Surfers chasing waves belong on the west coast.
            </p>
          </div>
        </section>

        <section className="guide-section">
          <h2>Where to stay: the three zones</h2>
          <p className="guide-lede">
            Sanur hotels make more sense sorted by position on the coast than by
            star rating. Pick the zone first, the hotel second.
          </p>
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">Zone</th>
                  <th scope="col">Character</th>
                  <th scope="col">Best for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">{SANUR_ZONE_LABEL.north}</th>
                  <td>
                    The modern harbour district by Matahari Terbit — the
                    fast-boat terminal and the Le Mayeur museum.
                  </td>
                  <td>Boat-departure trips; a new premium-and-heritage cluster.</td>
                </tr>
                <tr>
                  <th scope="row">{SANUR_ZONE_LABEL.central}</th>
                  <td>
                    The classic &quot;best of Sanur&quot; stretch: the most
                    balanced mix of beach access, dining and walkable paths.
                  </td>
                  <td>The best all-round base for most travellers.</td>
                </tr>
                <tr>
                  <th scope="row">{SANUR_ZONE_LABEL.south}</th>
                  <td>
                    Semawang, Cemara and Mertasari — quieter and looser, a
                    softer family-beach mood at the promenade&apos;s south end.
                  </td>
                  <td>Calmer surroundings; families who don&apos;t need the centre.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="guide-section">
          <h2>The hotel shortlist</h2>
          <p className="guide-lede">
            {SANUR_HOTELS.length} beachfront and near-beach classics, sorted by
            zone and travel style. Start with the three below or{" "}
            <Link href="/sanur/best-hotels" className="font-bold text-[var(--lagoon-strong)]">
              read the full hotels guide →
            </Link>
          </p>
          <ul className="guide-prose">
            {previewHotels.map((h) => (
              <li key={h.name}>
                <a href={h.mapsUrl} target="_blank" rel="noreferrer" className="font-bold text-[var(--lagoon-strong)]">
                  {h.name}
                </a>{" "}
                — {h.bestFor}
              </li>
            ))}
          </ul>
        </section>

        <section className="guide-section">
          <h2>Best things to do</h2>
          <p className="guide-lede">
            Sanur is built for good mornings and easy movement, not adrenaline
            stacking.{" "}
            <Link href="/sanur/things-to-do" className="font-bold text-[var(--lagoon-strong)]">
              The full things-to-do guide →
            </Link>
          </p>
          <ul className="guide-prose">
            {previewThings.map((t) => (
              <li key={t.title}>
                <strong>{t.title}.</strong> {t.blurb}
              </li>
            ))}
          </ul>
        </section>

        <VenuePicks title="Best restaurants" note="Beachfront classics, destination kitchens and local warungs." venues={restaurants} href="/sanur/best-restaurants" />
        <VenuePicks title="Cafés & bars" note="Specialty coffee, brunch and low-key beachside drinks." venues={cafesBars} href="/sanur/cafes-and-bars" />
        <VenuePicks title="Spas & wellness" note="Beachfront resort spas, garden massage and bamboo yoga." venues={wellness} href="/sanur/spas-wellness" />

        <section className="guide-section">
          <h2>Practical notes (read before you plan)</h2>
          <div className="guide-prose">
            <ul>
              <li>
                <strong>It really is walkable.</strong> The ~5 km promenade lets
                you base here and move on foot in a way that is genuinely
                useful, not just technically possible.
              </li>
              <li>
                <strong>Swimming is tide-dependent.</strong> Calm and shallow
                behind the reef, but low tide can be too thin for a real swim —
                go when the tide is in.
              </li>
              <li>
                <strong>Sunrise, not sunset.</strong> Sanur faces east. Build
                mornings around the beach path; don&apos;t expect a sunset
                ritual.
              </li>
              <li>
                <strong>Hotel booking details are dynamic.</strong> Rates and
                cancellation terms usually vary by rate, not by hotel — confirm
                directly. We list only facts a venue or brand states itself.
              </li>
              <li>
                <strong>Eat local and by the beach.</strong> Sanur&apos;s food is
                calm and dependable — see the{" "}
                <Link href="/sanur/best-restaurants" className="font-bold text-[var(--lagoon-strong)]">restaurants</Link>,{" "}
                <Link href="/sanur/cafes-and-bars" className="font-bold text-[var(--lagoon-strong)]">cafés &amp; bars</Link> and{" "}
                <Link href="/sanur/spas-wellness" className="font-bold text-[var(--lagoon-strong)]">spas &amp; wellness</Link> guides.
              </li>
            </ul>
          </div>
        </section>

        <FaqBlock items={SANUR_FAQ} />

        <RelatedGuides
          links={[
            {
              href: "/sanur/best-hotels",
              title: "Best hotels in Sanur",
              blurb: "Beachfront classics by zone and travel style — harbour, centre, south.",
            },
            {
              href: "/sanur/things-to-do",
              title: "Best things to do in Sanur",
              blurb: "Sunrise walks, the beach path, calm-water activities and the boat gateway.",
            },
            {
              href: "/sanur/best-restaurants",
              title: "Best restaurants in Sanur",
              blurb: "Beachfront classics, destination kitchens and local warungs.",
            },
            {
              href: "/sanur/cafes-and-bars",
              title: "Best cafés & bars in Sanur",
              blurb: "Specialty coffee, brunch and easy beachside drinks.",
            },
            {
              href: "/sanur/spas-wellness",
              title: "Best spas & wellness in Sanur",
              blurb: "Resort spas, garden massage and bamboo yoga shalas.",
            },
          ]}
        />

        <div className="cta-band">
          <h2>Use Sanur as your calm base</h2>
          <p>
            Sleep somewhere flat and quiet, walk to breakfast, and still reach
            the Nusa islands from a modern harbour. Start with the zone that fits
            your trip, then pick the hotel.
          </p>
          <Link href="/sanur/best-hotels" className="cta-band-action">
            See the hotel shortlist →
          </Link>
        </div>

        <RelatedGuides heading="Bali planning guides" links={guidesForDistrict("sanur")} />

        <GuideFooter />
      </main>
    </div>
  );
}
