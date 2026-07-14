import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import { GuideFooter, RelatedGuides } from "@/components/GuideBlocks";
import {
  SANUR_HOTELS,
  SANUR_REVIEW_DATE,
  SANUR_ZONE_LABEL,
  type SanurZone,
} from "@/lib/sanur/content";
import { serializeJsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Best hotels in Sanur — beachfront classics by zone",
  description:
    "Where to stay in Sanur, sorted by position on the coast: harbour-side, central beachfront classics, and quieter south-end resorts. Verified facilities, honest booking notes.",
  alternates: { canonical: "/sanur/best-hotels" },
  openGraph: {
    title: "Best hotels in Sanur · Other Bali",
    description:
      "Harbour-side, central beachfront, and south-end resorts — chosen by zone and travel style.",
    url: "https://www.otherbali.com/sanur/best-hotels",
    type: "article",
  },
};

const ZONE_ORDER: SanurZone[] = ["central", "north", "south"];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best hotels in Sanur, Bali",
    numberOfItems: SANUR_HOTELS.length,
    itemListElement: SANUR_HOTELS.map((h, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Hotel",
        name: h.name,
        areaServed: `Sanur (${h.zone})`,
        ...(h.mapsUrl ? { hasMap: h.mapsUrl } : {}),
      },
    })),
  },
];

export default function SanurHotelsPage() {
  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="district_page_view" slug="sanur/best-hotels" />
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Sanur", href: "/sanur" },
            { name: "Best hotels" },
          ]}
        />

        <header className="guide-hero">
          <p className="guide-kicker">Sanur · Where to stay</p>
          <h1 className="guide-title">Best hotels in Sanur</h1>
          <p className="guide-standfirst">
            Sanur hotels make more sense sorted by position on the coast than by
            star rating alone. The real question is not &quot;which is
            nicest&quot; but &quot;do you want harbour convenience, central
            walkability, or a quieter southern base?&quot; Pick the zone, then
            the hotel.
          </p>
          <p className="guide-meta-line">
            Editorial review: {SANUR_REVIEW_DATE} · facilities verified · rates
            &amp; cancellation vary by rate — confirm directly
          </p>
        </header>

        {ZONE_ORDER.map((zone) => {
          const hotels = SANUR_HOTELS.filter((h) => h.zone === zone);
          if (hotels.length === 0) return null;
          return (
            <section key={zone} className="guide-section">
              <h2>{SANUR_ZONE_LABEL[zone]}</h2>
              <div className="guide-prose">
                {hotels.map((h) => (
                  <div key={h.name} className="mt-5">
                    <h3 className="text-lg font-bold">
                      <a
                        href={h.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--lagoon-strong)]"
                      >
                        {h.name}
                      </a>{" "}
                      {h.beachfront ? (
                        <span className="text-xs font-semibold text-[var(--muted)]">· beachfront</span>
                      ) : (
                        <span className="text-xs font-semibold text-[var(--muted)]">· near beach</span>
                      )}
                    </h3>
                    <p className="mt-1">{h.fact}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      <span className="font-semibold">Best for:</span> {h.bestFor}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <section className="guide-section">
          <h2>How to choose fast</h2>
          <div className="guide-prose">
            <ul>
              <li>
                <strong>North / harbour side</strong> if the trip is built
                around boat departures or you want the new wellness-and-heritage
                cluster.
              </li>
              <li>
                <strong>Central Sanur</strong> for the best all-round mix of
                beach path, dining access and classic stays.
              </li>
              <li>
                <strong>South end</strong> for calmer surroundings, more
                family-beach energy and less passing traffic.
              </li>
              <li>
                <strong>Read booking details carefully.</strong> Across the big
                chains, cancellation terms usually vary by rate, not by hotel —
                so there is rarely one fixed rule per property.
              </li>
            </ul>
          </div>
        </section>

        <RelatedGuides
          links={[
            {
              href: "/sanur",
              title: "The Sanur guide",
              blurb: "Who Sanur suits, the three stay zones, and how to use it as a base.",
            },
            {
              href: "/sanur/things-to-do",
              title: "Best things to do in Sanur",
              blurb: "Sunrise walks, the beach path, calm-water activities and the boat gateway.",
            },
          ]}
        />

        <GuideFooter />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
    </div>
  );
}
