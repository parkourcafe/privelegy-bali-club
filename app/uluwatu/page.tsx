import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import {
  FaqBlock,
  GuideFooter,
  PlaceLink,
  RelatedGuides,
  VenuePicks,
} from "@/components/GuideBlocks";

// Uluwatu pillar page (ContentPage type district_guide, master §6a.3).
// Search intent: "uluwatu bali guide / where to eat in uluwatu / what is
// uluwatu like". Primary keyword: "Uluwatu guide"; secondary: "Uluwatu
// restaurants", "Uluwatu beach clubs", "Uluwatu sunset", "48 hours Uluwatu".
// Coverage honesty: this release covers verified food, drink and sunset
// decisions only — hotels/spas/activities are deferred until the data layer
// supports them (docs/uluwatu-deferred-backlog.md).

export const metadata: Metadata = {
  title: "Uluwatu guide — where to eat, drink & watch the sunset",
  description:
    "A resident-curated Uluwatu guide: how the Bukit's micro-areas differ, 24 verified places to eat and drink, sunset clubs compared, and a realistic 48-hour plan.",
  alternates: { canonical: "/uluwatu" },
  openGraph: {
    title: "The Uluwatu guide · Other Bali",
    description:
      "Micro-areas, verified restaurants and cafés, sunset clubs compared, and a realistic 48-hour plan for the Bukit.",
    url: "https://otherbali.com/uluwatu",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Uluwatu guide · Other Bali",
    description:
      "Micro-areas, verified restaurants and cafés, sunset clubs compared, and a realistic 48-hour plan.",
  },
};

const FAQ = [
  {
    q: "Do I need to book restaurants in Uluwatu?",
    a: "For sunset tables and the occasion venues, yes — El Kabrón takes reservations with a deposit, oneeighty° caps day-pass capacity, and dinner rooms like KALA, YUKI and Papi Sapi book out on weekends. Cafés and casual spots are walk-in.",
  },
  {
    q: "Do the beach clubs charge entry?",
    a: "Most work on a day-pass or minimum-spend model that converts to food and drink credit — Sundays sells a daily beach pass, White Rock and Tropical Temptation reserve daybeds against a minimum spend. Cliff bars like Single Fin are free to walk into.",
  },
  {
    q: "Which sunset spot should I pick?",
    a: "Loud and iconic: Single Fin above the Suluban break. Composed dinner-with-view: Mana or El Kabrón. Toes in the sand: Sundays or the Melasti clubs. The beach-clubs guide compares all of them on beach access, family fit and booking needs.",
  },
  {
    q: "Is Uluwatu good with kids?",
    a: "For beach days and early dinners, genuinely yes — Sundays and White Rock welcome families, and ZALI, Ulu Fishmarket and Ulu Garden are comfortable with children. Note Tropical Temptation is 18+ and Gooseberry has no children's menu by design.",
  },
  {
    q: "Does this guide cover hotels, spas or surf schools?",
    a: "Not yet. We only publish what we have verified, and our current Uluwatu research covers food, drink and sunset decisions. Hotels, wellness and activities are on the roadmap.",
  },
];

export default function UluwatuPillarPage() {
  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="district_page_view" slug="uluwatu" />
        <div className="flex items-start justify-between">
          <Link href="/" className="topline">
            ← Other Bali
          </Link>
          <Link href="/places?district=uluwatu" className="quiet-link">
            All Uluwatu places →
          </Link>
        </div>

        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Uluwatu" }]} />

        {/* 1. Hero + 2. short editorial answer */}
        <header className="guide-hero">
          <p className="guide-kicker">Uluwatu · Bukit Peninsula</p>
          <h1 className="guide-title">The Uluwatu guide</h1>
          <p className="guide-standfirst">
            Uluwatu is Bali’s cliff edge: world-class surf below, golden-hour
            venues above, and everything spread along winding peninsula roads.
            It rewards travellers who plan by area — and punishes the ones who
            treat it like a walkable town. This guide covers the food, drink
            and sunset decisions we have actually verified: 24 places, checked
            on 12 July 2026.
          </p>
          <p className="guide-meta-line">
            Editorial review: 2026-07-12 · resident-curated · no paid ranking
          </p>
        </header>

        {/* 3. Who it suits / 4. who it doesn't */}
        <section className="guide-section">
          <h2>Who Uluwatu suits — and who it frustrates</h2>
          <div className="guide-prose">
            <p>
              <strong>It suits</strong> surfers of any level of obsession,
              couples building a trip around sunsets and long dinners, groups
              who want one big beach-club day, and anyone who prefers dramatic
              coastline over café-street density.
            </p>
            <p>
              <strong>It frustrates</strong> travellers who want to walk
              everywhere (distances are real and the cliff lanes are narrow),
              night-owls looking for a bar strip (evenings mostly end where you
              had dinner, except Single Fin’s party nights), and anyone
              expecting Canggu-style ten-cafés-per-street choice. You will be
              on a scooter or in a car between most stops.
            </p>
          </div>
        </section>

        {/* 5. Micro-area guide — confirmed geography only */}
        <section className="guide-section">
          <h2>The micro-areas, decoded</h2>
          <p className="guide-lede">
            Our verified places cluster in five zones. Distances between them
            look short on the map and aren’t — plan one zone per half-day.
          </p>
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">Area</th>
                  <th scope="col">Character</th>
                  <th scope="col">Verified anchors</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Suluban & the Uluwatu cliffs</th>
                  <td>
                    The postcard: cliff bars above the surf break, the temple
                    to the south, the Labuan Sait strip feeding it all.
                  </td>
                  <td>
                    <PlaceLink slug="single-fin" />, <PlaceLink slug="mana-uluwatu" />,{" "}
                    <PlaceLink slug="bgs-uluwatu" />, <PlaceLink slug="zali-uluwatu" />,{" "}
                    <PlaceLink slug="artisan-uluwatu" />
                  </td>
                </tr>
                <tr>
                  <th scope="row">Labuan Sait road</th>
                  <td>
                    The peninsula’s restaurant row — most serious dinners sit
                    on this one road between Padang Padang and Suluban.
                  </td>
                  <td>
                    <PlaceLink slug="suka-espresso" />, <PlaceLink slug="yuki-uluwatu" />,{" "}
                    <PlaceLink slug="masonry-restaurant" />, <PlaceLink slug="ulu-fishmarket" />,{" "}
                    <PlaceLink slug="papi-sapi" />, <PlaceLink slug="son-of-a-baker" />
                  </td>
                </tr>
                <tr>
                  <th scope="row">Padang Padang</th>
                  <td>
                    Small famous beach, big evening energy around it.
                  </td>
                  <td>
                    <PlaceLink slug="kala-uluwatu" />, <PlaceLink slug="ulu-garden" />
                  </td>
                </tr>
                <tr>
                  <th scope="row">Bingin</th>
                  <td>
                    Steep lanes, surf shacks, and the peninsula’s quietest
                    good-food cluster above the beach steps.
                  </td>
                  <td>
                    <PlaceLink slug="gooseberry-french-restaurant-uluwatu" />,{" "}
                    <PlaceLink slug="seed-bingin" />, <PlaceLink slug="laggas-uluwatu" />,{" "}
                    <PlaceLink slug="alchemy-uluwatu" />
                  </td>
                </tr>
                <tr>
                  <th scope="row">Ungasan & Melasti</th>
                  <td>
                    The south side: white-sand Melasti below carved cliffs,
                    resort clifftops above — a separate trip from the west
                    cliffs.
                  </td>
                  <td>
                    <PlaceLink slug="sundays-beach-club" />, <PlaceLink slug="white-rock-beach-club" />,{" "}
                    <PlaceLink slug="tropical-temptation-adult-only-beach-club" />,{" "}
                    <PlaceLink slug="waatu" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="guide-lede">
            Dreamland and Balangan sit between Bingin and the south side; we
            don’t have verified picks there yet, so they stay off this guide
            until we do.
          </p>
        </section>

        {/* 6. Quick picks by situation */}
        <section className="guide-section">
          <h2>Quick picks by situation</h2>
          <div className="compare-table-wrap">
            <table className="compare-table">
              <tbody>
                <tr>
                  <th scope="row">First coffee after dawn patrol</th>
                  <td>
                    <PlaceLink slug="bgs-uluwatu" /> at the Suluban entrance;{" "}
                    <PlaceLink slug="son-of-a-baker" /> when you want pastry with it
                  </td>
                </tr>
                <tr>
                  <th scope="row">One big brunch</th>
                  <td>
                    <PlaceLink slug="suka-espresso" /> — the reliable default since 2016
                  </td>
                </tr>
                <tr>
                  <th scope="row">Date night</th>
                  <td>
                    <PlaceLink slug="kala-uluwatu" /> for the food,{" "}
                    <PlaceLink slug="gooseberry-french-restaurant-uluwatu" /> for the mood
                  </td>
                </tr>
                <tr>
                  <th scope="row">The sunset</th>
                  <td>
                    <PlaceLink slug="single-fin" /> loud, <PlaceLink slug="mana-uluwatu" /> calm,{" "}
                    <PlaceLink slug="el-kabron-bali" /> full-occasion
                  </td>
                </tr>
                <tr>
                  <th scope="row">Beach day with kids</th>
                  <td>
                    <PlaceLink slug="sundays-beach-club" /> (funicular + lagoon) or{" "}
                    <PlaceLink slug="white-rock-beach-club" /> (space for everyone)
                  </td>
                </tr>
                <tr>
                  <th scope="row">Adults-only pool day</th>
                  <td>
                    <PlaceLink slug="tropical-temptation-adult-only-beach-club" /> — 18+ by policy
                  </td>
                </tr>
                <tr>
                  <th scope="row">Group dinner that pleases everyone</th>
                  <td>
                    <PlaceLink slug="zali-uluwatu" /> (Lebanese sharing) or{" "}
                    <PlaceLink slug="ulu-fishmarket" /> (seafood, easy mood)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 7–10. Child-guide previews */}
        <section className="guide-section">
          <h2>Where to eat</h2>
          <p className="guide-lede">
            Twelve verified dinner rooms, organised by the decision you’re
            actually making — date night, groups, family, occasion. Start with
            the three below or{" "}
            <Link href="/uluwatu/best-restaurants" className="font-bold text-[var(--lagoon-strong)]">
              read the full restaurants guide →
            </Link>
          </p>
          <VenuePicks slugs={["kala-uluwatu", "yuki-uluwatu", "the-warung-at-alila-villas-uluwatu"]} columns={3} />
        </section>

        <section className="guide-section">
          <h2>Brunch & coffee</h2>
          <p className="guide-lede">
            Six cafés with verified breakfast credentials — from 6 a.m. bakery
            starts to plant-based gardens.{" "}
            <Link href="/uluwatu/best-brunch" className="font-bold text-[var(--lagoon-strong)]">
              The full brunch guide →
            </Link>
          </p>
          <VenuePicks slugs={["suka-espresso", "son-of-a-baker", "alchemy-uluwatu"]} columns={3} />
        </section>

        <section className="guide-section">
          <h2>Sunset & beach clubs</h2>
          <p className="guide-lede">
            Seven very different answers to the same golden hour — compared on
            beach access, family fit and booking needs.{" "}
            <Link href="/uluwatu/beach-clubs-sunset" className="font-bold text-[var(--lagoon-strong)]">
              Compare all seven →
            </Link>
          </p>
          <VenuePicks slugs={["sundays-beach-club", "single-fin", "el-kabron-bali"]} columns={3} />
        </section>

        <section className="guide-section">
          <h2>Date night</h2>
          <p className="guide-lede">
            Quiet conversation, a view, or a kitchen worth the trip — the
            date-night guide separates actual date rooms from group party
            venues.{" "}
            <Link href="/uluwatu/date-night-restaurants" className="font-bold text-[var(--lagoon-strong)]">
              The date-night shortlist →
            </Link>
          </p>
        </section>

        {/* 12. Practical limitations */}
        <section className="guide-section">
          <h2>Practical notes (read before you plan)</h2>
          <div className="guide-prose">
            <ul>
              <li>
                <strong>Distances beat expectations.</strong> The west cliffs,
                Bingin and Melasti are separate outings, not one stroll. One
                zone per half-day is the honest rhythm.
              </li>
              <li>
                <strong>Sunset is the bottleneck.</strong> Every good west-facing
                table fills at the same hour. Book the occasion venues; arrive
                early at the walk-in ones.
              </li>
              <li>
                <strong>Beach clubs price by model, not menu.</strong> Day passes
                and minimum spends are normal on Melasti and at the day clubs —
                check the venue page’s booking note before committing the day.
              </li>
              <li>
                <strong>Hours drift.</strong> We publish opening hours only when
                a venue states them on its own site, and we date-stamp every
                page. When in doubt, check the venue’s Instagram — linked on
                each place page.
              </li>
              <li>
                <strong>This guide is food, drink and sunset only</strong> for
                now — no hotels, spas or activities until we can verify them
                properly.
              </li>
            </ul>
          </div>
        </section>

        <FaqBlock items={FAQ} />

        {/* 13. Related guides */}
        <RelatedGuides
          links={[
            {
              href: "/uluwatu/best-restaurants",
              title: "Best restaurants in Uluwatu",
              blurb: "Twelve verified dinner rooms by decision, not by list position.",
            },
            {
              href: "/uluwatu/best-brunch",
              title: "Best brunch & coffee",
              blurb: "Where mornings actually start on the Bukit — from 6 a.m.",
            },
            {
              href: "/uluwatu/beach-clubs-sunset",
              title: "Beach clubs & sunset",
              blurb: "Seven golden-hour venues compared honestly.",
            },
          ]}
        />

        {/* 14. CTA → 48 hours */}
        <div className="cta-band">
          <h2>Two days on the Bukit, already sequenced</h2>
          <p>
            The 48-hour plan strings these places into a route that never
            crosses the peninsula twice in one day — with booking notes and
            rain alternatives.
          </p>
          <Link href="/uluwatu/48-hours" className="cta-band-action">
            Get the 48-hour plan →
          </Link>
        </div>

        <GuideFooter />
      </main>
    </div>
  );
}
