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

// Search intent: "best restaurants in Uluwatu". Primary keyword: "best
// restaurants Uluwatu"; secondary: "Uluwatu dinner", "where to eat Uluwatu",
// "Uluwatu date night restaurant", "family restaurant Uluwatu".
// Organised by decision (brief §13), never by paid position (guardrail #6).

export const metadata: Metadata = {
  title: "Best restaurants in Uluwatu — chosen by decision, not by list",
  description:
    "42 verified Uluwatu restaurants for date night, groups, families, brunch, special occasions and sunset tables — checked against official sources.",
  alternates: { canonical: "/uluwatu/best-restaurants" },
  openGraph: {
    title: "Best restaurants in Uluwatu · Other Bali",
    description:
      "42 verified restaurants sorted by the decision you're making — date night, groups, family, brunch and occasion.",
    url: "https://www.otherbali.com/uluwatu/best-restaurants",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best restaurants in Uluwatu · Other Bali",
    description:
      "42 verified restaurants sorted by decision — date night, groups, family, brunch and occasion.",
  },
};

const ALL_RESTAURANTS = [
  "kala-uluwatu",
  "yuki-uluwatu",
  "gooseberry-french-restaurant-uluwatu",
  "waatu",
  "the-warung-at-alila-villas-uluwatu",
  "zali-uluwatu",
  "masonry-restaurant",
  "papi-sapi",
  "ulu-fishmarket",
  "ulu-garden",
  "seed-bingin",
  "laggas-uluwatu",
  "ours-bali", "bartolo-bali", "avli-bali", "bb52-burgers-uluwatu",
  "hidden-gem-uluwatu", "abracadabra-at-mu", "tacos-aqui-uluwatu",
  "la-baracca-uluwatu", "tabu-bali", "lolas-cantina-uluwatu",
  "shaka-riki-uluwatu", "the-cave-bali", "cire-alila-uluwatu",
  "di-mare-karma-kandara", "double-ikat", "filini-uluwatu", "botol-biru",
  "ulu-cliffhouse", "the-beach-by-ours", "mood-by-ours", "analog-uluwatu",
  "baked-uluwatu", "tanah-uluwatu", "milk-and-madu-uluwatu",
  "tarabelle-uluwatu", "lands-end-cafe", "bukit-cafe",
  "oliverra-umana-bali", "il-ristorante-niko-romito", "malini-uluwatu",
];

const NEW_RESTAURANTS = ALL_RESTAURANTS.slice(12);

const FAQ = [
  {
    q: "How far ahead should I book dinner in Uluwatu?",
    a: "A day or two is enough for most rooms midweek; for weekend dinners at KALA, YUKI, Gooseberry or WAATU book earlier. The Warung at Alila sits inside a gated resort, so a reservation is required for entry, and Papi Sapi's small room fills from opening.",
  },
  {
    q: "Which restaurants work with children?",
    a: "ZALI, Ulu Fishmarket, Ulu Garden and Laggas are genuinely comfortable with kids — sharing formats, garden space, early-evening rhythm. Gooseberry is screen-free with no children's menu, so it suits older kids at earlier slots at most.",
  },
  {
    q: "Where do I eat Indonesian food in Uluwatu?",
    a: "The Warung at Alila Villas is the district's serious Indonesian table (the megibung banquet is the signature format), and Ulu Garden cooks contemporary Indonesian with weekly Balinese cultural programming.",
  },
  {
    q: "What does $$ / $$$ mean on your pages?",
    a: "A relative spend band for the area from our research, not a menu quote — $ is a cheap counter stop, $$$ is an occasion-level bill. Every price band is dated and rechecked; we never publish exact prices we can't verify.",
  },
];

export default function BestRestaurantsPage() {
  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="editorial_page_view" slug="uluwatu-best-restaurants" />
        <div className="flex items-start justify-between">
          <Link href="/uluwatu" className="topline">
            ← Uluwatu guide
          </Link>
          <Link href="/places?district=uluwatu" className="quiet-link">
            All Uluwatu places →
          </Link>
        </div>

        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Uluwatu", href: "/uluwatu" },
            { name: "Best restaurants" },
          ]}
        />
        <VenueItemListSchema name="Best restaurants in Uluwatu" slugs={ALL_RESTAURANTS} />

        <header className="guide-hero">
          <p className="guide-kicker">Uluwatu · Eating out</p>
          <h1 className="guide-title">Best restaurants in Uluwatu</h1>
          <p className="guide-standfirst">
            Short answer: book <PlaceLink slug="kala-uluwatu">KALA</PlaceLink>{" "}
            for a food-led date, <PlaceLink slug="yuki-uluwatu">YUKI</PlaceLink>{" "}
            for a group with energy, and{" "}
            <PlaceLink slug="the-warung-at-alila-villas-uluwatu">
              The Warung at Alila
            </PlaceLink>{" "}
            for the one big occasion. Below, 42 verified restaurants —
            sorted by the decision you’re making, not by anyone’s ad budget.
          </p>
          <p className="guide-meta-line">
            42 places · expanded 2026-07-23 · editorial order, no paid ranking
          </p>
        </header>

        <section className="guide-section">
          <h2>30 more Uluwatu restaurants, newly verified</h2>
          <p className="guide-lede">
            The expanded set spans Pecatu, Bingin, Suluban and Ungasan — from
            casual tacos and bakery breakfasts to resort dining and tasting
            menus. Each listing is tied to an official venue or hotel source;
            ratings and review quotes are never copied into this guide.
          </p>
          <VenuePicks slugs={NEW_RESTAURANTS} />
        </section>

        <section className="guide-section">
          <h2>Date night</h2>
          <p className="guide-lede">
            Rooms where the food and the mood both hold up. For the full
            romantic taxonomy — quiet vs view vs occasion — see the{" "}
            <Link href="/uluwatu/date-night-restaurants" className="font-bold text-[var(--lagoon-strong)]">
              date-night guide
            </Link>
            .
          </p>
          <VenuePicks slugs={["kala-uluwatu", "gooseberry-french-restaurant-uluwatu", "waatu", "seed-bingin"]} />
        </section>

        <section className="guide-section">
          <h2>Groups</h2>
          <p className="guide-lede">
            Sharing formats and rooms that absorb eight people without losing
            the table.
          </p>
          <VenuePicks slugs={["yuki-uluwatu", "zali-uluwatu", "masonry-restaurant", "ulu-fishmarket"]} />
        </section>

        <section className="guide-section">
          <h2>Family dinners</h2>
          <p className="guide-lede">
            Early-evening friendly, space to move, and menus that don’t fight
            with kids.
          </p>
          <VenuePicks slugs={["ulu-garden", "zali-uluwatu", "ulu-fishmarket", "laggas-uluwatu"]} />
        </section>

        <section className="guide-section">
          <h2>Special occasion</h2>
          <p className="guide-lede">
            When the dinner is the point of the day. Two of these are inside
            resorts — reserve so the gate expects you.
          </p>
          <VenuePicks slugs={["the-warung-at-alila-villas-uluwatu", "waatu", "gooseberry-french-restaurant-uluwatu"]} columns={3} />
        </section>

        <section className="guide-section">
          <h2>Casual dinners</h2>
          <p className="guide-lede">
            No ceremony, good cooking — the weeknight answers.
          </p>
          <VenuePicks slugs={["papi-sapi", "laggas-uluwatu", "ulu-fishmarket", "seed-bingin"]} />
        </section>

        <section className="guide-section">
          <h2>Dinner with the sunset attached</h2>
          <div className="guide-prose">
            <p>
              If golden hour is non-negotiable, eat where the cliff is:{" "}
              <PlaceLink slug="mana-uluwatu" /> pairs a real kitchen with the
              Suluban view, <PlaceLink slug="el-kabron-bali" /> turns dinner
              into a Spanish sunset production (deposit required), and{" "}
              <PlaceLink slug="single-fin" /> covers the casual bar-food
              version. All three are compared properly in the{" "}
              <Link href="/uluwatu/beach-clubs-sunset">sunset guide</Link>.
            </p>
          </div>
        </section>

        <section className="guide-section">
          <h2>Local & regional food</h2>
          <div className="guide-prose">
            <p>
              Uluwatu’s dining scene skews international; for Indonesian
              cooking the verified options are{" "}
              <PlaceLink slug="the-warung-at-alila-villas-uluwatu" /> (refined,
              resort-level, the megibung banquet) and{" "}
              <PlaceLink slug="ulu-garden" /> (contemporary Indonesian with
              Balinese dance and market nights). For everyday warung food the
              honest answer is that our verified inventory doesn’t cover it yet
              — it’s on the research list.
            </p>
          </div>
        </section>

        <FaqBlock items={FAQ} />

        <RelatedGuides
          links={[
            {
              href: "/uluwatu/date-night-restaurants",
              title: "Date night, separated properly",
              blurb: "Quiet vs view vs occasion — not every nice room is a date room.",
            },
            {
              href: "/uluwatu/48-hours",
              title: "48 hours in Uluwatu",
              blurb: "These restaurants, sequenced into two realistic days.",
            },
            {
              href: "/uluwatu",
              title: "The Uluwatu guide",
              blurb: "Micro-areas, quick picks and practical notes.",
            },
          ]}
        />

        <div className="cta-band">
          <h2>Don’t plan dinner in a vacuum</h2>
          <p>
            The 48-hour plan slots these rooms into days that already include
            the beach, the coffee and the sunset — in an order that works.
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
