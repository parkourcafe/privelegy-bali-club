import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import {
  FaqBlock,
  GuideFooter,
  PlaceLink,
  RelatedGuides,
  VenueItemListSchema,
  VenuePicks,
} from "@/components/GuideBlocks";

// Search intent: "uluwatu beach clubs / best sunset uluwatu / melasti beach
// club". Primary keyword: "Uluwatu beach clubs"; secondary: "Uluwatu sunset
// bar", "Melasti beach clubs", "adults-only beach club Bali", "Sundays Beach
// Club vs". The comparison publishes CONFIRMED attributes only — beach
// access, adults-only policy, pools, booking model all carry evidence in the
// registry.

export const metadata: Metadata = {
  title: "Uluwatu beach clubs & sunset spots — compared honestly",
  description:
    "Seven verified golden-hour venues on the Bukit: who has real beach access, who is adults-only, where families fit, and which sunsets need a booking.",
  alternates: { canonical: "/uluwatu/beach-clubs-sunset" },
  openGraph: {
    title: "Uluwatu beach clubs & sunset, compared · Other Bali",
    description:
      "Beach access, cliff views, adults-only policies, family fit and booking models — the honest comparison.",
    url: "https://otherbali.com/uluwatu/beach-clubs-sunset",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Uluwatu beach clubs & sunset, compared · Other Bali",
    description:
      "Beach access, adults-only policies, family fit and booking models — compared honestly.",
  },
};

const ALL_SUNSET = [
  "sundays-beach-club",
  "white-rock-beach-club",
  "tropical-temptation-adult-only-beach-club",
  "el-kabron-bali",
  "oneeighty",
  "single-fin",
  "mana-uluwatu",
];

const FAQ = [
  {
    q: "Which Uluwatu beach clubs have actual beach access?",
    a: "Three: Sundays (private cove reached by funicular), White Rock and Tropical Temptation (both directly on Melasti Beach). El Kabrón and oneeighty° are clifftop venues — spectacular, but you won't touch sand.",
  },
  {
    q: "Is any club adults-only?",
    a: "Tropical Temptation is 18+ by policy — stated on the venue's own site. oneeighty° is often mislabeled adults-only; in fact only its VIP deck restricts under-12s.",
  },
  {
    q: "What do day passes cost?",
    a: "We don't publish prices we can't keep current. The models are stable though: Sundays sells a daily beach pass with food-and-drink credit, White Rock and Tropical Temptation reserve daybeds against minimum spends, and oneeighty° runs a capped day pass. Exact rates are on each venue's official booking page — linked from our place pages.",
  },
  {
    q: "Where do I watch the sunset without paying for a club?",
    a: "Single Fin is a walk-in bar above the Suluban break — arrive 60–90 minutes early for a rail spot. Mana next door trades some chaos for a calmer table (book at golden hour).",
  },
];

export default function BeachClubsSunsetPage() {
  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="editorial_page_view" slug="uluwatu-beach-clubs-sunset" />
        <div className="flex items-start justify-between">
          <Link href="/uluwatu" className="topline">
            ← Uluwatu guide
          </Link>
          <Link href="/places?district=uluwatu&category=beach_club" className="quiet-link">
            All Uluwatu clubs →
          </Link>
        </div>

        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Uluwatu", href: "/uluwatu" },
            { name: "Beach clubs & sunset" },
          ]}
        />
        <VenueItemListSchema name="Uluwatu beach clubs and sunset venues" slugs={ALL_SUNSET} />

        <header className="guide-hero">
          <p className="guide-kicker">Uluwatu · Golden hour</p>
          <h1 className="guide-title">Beach clubs & sunset, compared</h1>
          <p className="guide-standfirst">
            Short answer: sand and kids →{" "}
            <PlaceLink slug="sundays-beach-club">Sundays</PlaceLink>; adults-only
            pools →{" "}
            <PlaceLink slug="tropical-temptation-adult-only-beach-club">
              Tropical Temptation
            </PlaceLink>
            ; the occasion sunset → <PlaceLink slug="el-kabron-bali">El Kabrón</PlaceLink>;
            the free iconic one → <PlaceLink slug="single-fin">Single Fin</PlaceLink>.
            The full comparison below sticks to what we could verify.
          </p>
          <p className="guide-meta-line">
            7 places · verified 2026-07-12 · editorial order, no paid ranking
          </p>
        </header>

        <section className="guide-section">
          <h2>The honest comparison</h2>
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">Venue</th>
                  <th scope="col">Beach access</th>
                  <th scope="col">Setting</th>
                  <th scope="col">Kids</th>
                  <th scope="col">Booking</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">
                    <PlaceLink slug="sundays-beach-club" />
                  </th>
                  <td>Private cove via funicular</td>
                  <td>Lagoon, watersports, bonfires</td>
                  <td>Welcome</td>
                  <td>Pass walk-in; cabanas pre-booked</td>
                </tr>
                <tr>
                  <th scope="row">
                    <PlaceLink slug="white-rock-beach-club" />
                  </th>
                  <td>Direct — Melasti Beach</td>
                  <td>Big club: pools, daybeds, stage</td>
                  <td>Welcome</td>
                  <td>Daybeds via booking site</td>
                </tr>
                <tr>
                  <th scope="row">
                    <PlaceLink slug="tropical-temptation-adult-only-beach-club" />
                  </th>
                  <td>Direct — Melasti Beach</td>
                  <td>Three pools, spa, bar</td>
                  <td>No — 18+ policy</td>
                  <td>Daybeds via booking site</td>
                </tr>
                <tr>
                  <th scope="row">
                    <PlaceLink slug="el-kabron-bali" />
                  </th>
                  <td>None — clifftop</td>
                  <td>Spanish restaurant + cliff pool</td>
                  <td>Better for adults</td>
                  <td>Essential, with deposit</td>
                </tr>
                <tr>
                  <th scope="row">
                    <PlaceLink slug="oneeighty" />
                  </th>
                  <td>None — clifftop (162 m)</td>
                  <td>Glass sky pool, dayclub</td>
                  <td>VIP deck 12+ only</td>
                  <td>Day pass, capacity capped</td>
                </tr>
                <tr>
                  <th scope="row">
                    <PlaceLink slug="single-fin" />
                  </th>
                  <td>Cliff above Suluban</td>
                  <td>Surf bar, party Wed/Sun</td>
                  <td>Daytime ok</td>
                  <td>Walk-in; book event nights</td>
                </tr>
                <tr>
                  <th scope="row">
                    <PlaceLink slug="mana-uluwatu" />
                  </th>
                  <td>Cliff above Suluban</td>
                  <td>Restaurant + pool, composed</td>
                  <td>Early evening ok</td>
                  <td>Book sunset tables</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="guide-section">
          <h2>Pick by the day you want</h2>
          <VenuePicks
            slugs={["sundays-beach-club", "white-rock-beach-club", "tropical-temptation-adult-only-beach-club", "oneeighty"]}
          />
        </section>

        <section className="guide-section">
          <h2>The cliff-bar sunset</h2>
          <p className="guide-lede">
            No pass, no daybed — just the break below and a drink in hand.
          </p>
          <VenuePicks slugs={["single-fin", "mana-uluwatu", "el-kabron-bali"]} columns={3} />
        </section>

        <section className="guide-section">
          <h2>Two practical warnings</h2>
          <div className="guide-prose">
            <ul>
              <li>
                <strong>Melasti is its own trip.</strong> The Melasti clubs sit
                on the south side of the peninsula — combine them with WAATU or
                Sundays for the evening rather than racing back to the west
                cliffs for sunset.
              </li>
              <li>
                <strong>Golden hour books out first.</strong> Whatever the
                venue, the west-facing seats at 5:30 p.m. are the scarcest
                commodity on the Bukit. Decide at breakfast, not at four.
              </li>
            </ul>
          </div>
        </section>

        <FaqBlock items={FAQ} />

        <RelatedGuides
          links={[
            {
              href: "/uluwatu/date-night-restaurants",
              title: "Sunset into dinner",
              blurb: "The date-night rooms that follow golden hour naturally.",
            },
            {
              href: "/uluwatu/best-restaurants",
              title: "All twelve dinner rooms",
              blurb: "Groups, families, occasions — sorted by decision.",
            },
            {
              href: "/uluwatu",
              title: "The Uluwatu guide",
              blurb: "Micro-areas, quick picks and practical notes.",
            },
          ]}
        />

        <div className="cta-band">
          <h2>One beach day, one cliff day</h2>
          <p>
            The 48-hour plan pairs a Melasti beach afternoon with a west-cliff
            sunset day — in the order that avoids crossing the Bukit twice.
          </p>
          <Link href="/uluwatu/48-hours" className="cta-band-action">
            See the 48-hour plan →
          </Link>
        </div>

        <GuideFooter />
      </main>
    </div>
  );
}
