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

// Search intent: "date night restaurants uluwatu / romantic dinner uluwatu".
// Primary keyword: "date night restaurants Uluwatu"; secondary: "romantic
// restaurant Uluwatu", "anniversary dinner Bali cliff", "quiet dinner
// Uluwatu". The differentiation (quiet vs view vs lively vs group) is the
// content — not one interchangeable "romantic" list.

export const metadata: Metadata = {
  title: "Date-night restaurants in Uluwatu — quiet, view or occasion",
  description:
    "The Uluwatu dinners that actually work as dates: quiet-conversation rooms, cliff views, food-led kitchens and true special-occasion tables — separated from the group-party venues.",
  alternates: { canonical: "/uluwatu/date-night-restaurants" },
  openGraph: {
    title: "Date-night restaurants in Uluwatu · Other Bali",
    description:
      "Quiet conversation, a view, or a kitchen worth the trip — the honest date-night taxonomy.",
    url: "https://otherbali.com/uluwatu/date-night-restaurants",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Date-night restaurants in Uluwatu · Other Bali",
    description:
      "Quiet conversation, a view, or a kitchen worth the trip — the honest date-night taxonomy.",
  },
};

const ALL_DATE = [
  "kala-uluwatu",
  "gooseberry-french-restaurant-uluwatu",
  "waatu",
  "the-warung-at-alila-villas-uluwatu",
  "mana-uluwatu",
  "el-kabron-bali",
  "seed-bingin",
  "yuki-uluwatu",
];

const FAQ = [
  {
    q: "What's the single best date-night restaurant in Uluwatu?",
    a: "Depends on the date. Food-first: KALA. Mood-first: Gooseberry. View-first: Mana at golden hour. If it's a proposal-grade occasion, The Warung at Alila or El Kabrón's sunset seating — both need proper reservations.",
  },
  {
    q: "Which rooms are quiet enough to actually talk?",
    a: "Gooseberry (screen-free by design), Seed in Bingin, and The Warung at Alila. WAATU is focused rather than loud. YUKI and MASONRY are great dinners but social-loud — take them for third dates, not first conversations.",
  },
  {
    q: "Can we do sunset drinks and dinner in one place?",
    a: "Yes at Mana (cliff table through golden hour into dinner) and El Kabrón (sunset seating with a Spanish kitchen, deposit required). Otherwise: drinks at Single Fin, then a five-minute ride to KALA or YUKI.",
  },
  {
    q: "How dressed up is dinner here?",
    a: "Smart-casual carries every room on this page. The resort venues (Alila, WAATU) lean tidier; nobody expects heels on a cliff lane. We publish dress codes only if a venue states one — none of these currently do.",
  },
];

export default function DateNightPage() {
  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="editorial_page_view" slug="uluwatu-date-night" />
        <div className="flex items-start justify-between">
          <Link href="/uluwatu" className="topline">
            ← Uluwatu guide
          </Link>
          <Link href="/places?district=uluwatu&category=restaurant" className="quiet-link">
            All Uluwatu restaurants →
          </Link>
        </div>

        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Uluwatu", href: "/uluwatu" },
            { name: "Date night" },
          ]}
        />
        <VenueItemListSchema name="Date-night restaurants in Uluwatu" slugs={ALL_DATE} />

        <header className="guide-hero">
          <p className="guide-kicker">Uluwatu · Evenings for two</p>
          <h1 className="guide-title">Date night, separated properly</h1>
          <p className="guide-standfirst">
            “Romantic restaurant” means four different things: a room quiet
            enough to talk, a view doing half the work, a kitchen worth
            dressing for, or a full occasion production. Uluwatu has verified
            answers to each — and a couple of famous rooms that are actually
            group venues in date-night clothing.
          </p>
          <p className="guide-meta-line">
            8 places · verified 2026-07-12 · editorial order, no paid ranking
          </p>
        </header>

        <section className="guide-section">
          <h2>Quiet conversation</h2>
          <p className="guide-lede">
            The talk-across-the-table rooms.
          </p>
          <VenuePicks slugs={["gooseberry-french-restaurant-uluwatu", "seed-bingin", "the-warung-at-alila-villas-uluwatu"]} columns={3} />
        </section>

        <section className="guide-section">
          <h2>The view does half the work</h2>
          <p className="guide-lede">
            Book golden hour, let the cliff carry the evening.
          </p>
          <VenuePicks slugs={["mana-uluwatu", "el-kabron-bali", "waatu"]} columns={3} />
        </section>

        <section className="guide-section">
          <h2>Food-led dates</h2>
          <p className="guide-lede">
            For couples whose love language is an open kitchen.
          </p>
          <VenuePicks slugs={["kala-uluwatu", "waatu", "gooseberry-french-restaurant-uluwatu"]} columns={3} />
        </section>

        <section className="guide-section">
          <h2>Special occasions</h2>
          <div className="guide-prose">
            <p>
              Anniversary-grade:{" "}
              <PlaceLink slug="the-warung-at-alila-villas-uluwatu" /> (reserve —
              it sits inside a gated resort),{" "}
              <PlaceLink slug="el-kabron-bali" /> (sunset seating with deposit),
              and <PlaceLink slug="waatu" /> when the occasion deserves fire.
              All three reward booking days ahead, not hours.
            </p>
          </div>
        </section>

        <section className="guide-section">
          <h2>Lively dates — and the group-dinner trap</h2>
          <div className="guide-prose">
            <p>
              <PlaceLink slug="yuki-uluwatu" /> is the right call when the date
              wants energy: sharing plates, music, a room with momentum. The
              same quality makes it — like{" "}
              <PlaceLink slug="masonry-restaurant" /> and{" "}
              <PlaceLink slug="ulu-fishmarket" /> — a better group dinner than a
              first-date room. If the goal is conversation, start at the quiet
              list above; if the goal is fun, start here.
            </p>
          </div>
        </section>

        <FaqBlock items={FAQ} />

        <RelatedGuides
          links={[
            {
              href: "/uluwatu/beach-clubs-sunset",
              title: "Sunset drinks first",
              blurb: "Seven golden-hour venues compared — pick the pre-dinner cliff.",
            },
            {
              href: "/uluwatu/best-restaurants",
              title: "The full dinner map",
              blurb: "All twelve verified rooms, sorted by decision.",
            },
            {
              href: "/uluwatu",
              title: "The Uluwatu guide",
              blurb: "Micro-areas, quick picks and practical notes.",
            },
          ]}
        />

        <div className="cta-band">
          <h2>Make the date a whole day</h2>
          <p>
            The 48-hour plan builds the beach afternoon and the cliff sunset
            around dinner — so the evening starts long before the table.
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
