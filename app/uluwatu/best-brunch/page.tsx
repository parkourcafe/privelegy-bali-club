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

// Search intent: "best brunch uluwatu / best cafes uluwatu / breakfast
// uluwatu". Primary keyword: "best brunch Uluwatu"; secondary: "Uluwatu
// cafés", "breakfast Uluwatu", "coffee Uluwatu", "work-friendly café
// Uluwatu". Every venue here has verified breakfast/brunch relevance from
// the research layer — no café is called a brunch spot on category alone.

export const metadata: Metadata = {
  title: "Best brunch in Uluwatu — coffee, post-surf plates & quiet mornings",
  description:
    "Seven verified Uluwatu breakfast and brunch spots: 6 a.m. bakery starts, post-surf plates, plant-based gardens and the cafés that tolerate a laptop.",
  alternates: { canonical: "/uluwatu/best-brunch" },
  openGraph: {
    title: "Best brunch in Uluwatu · Other Bali",
    description:
      "Where Bukit mornings actually start: verified coffee, post-surf breakfasts and quiet garden brunches.",
    url: "https://www.otherbali.com/uluwatu/best-brunch",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best brunch in Uluwatu · Other Bali",
    description:
      "Verified coffee, post-surf breakfasts and quiet garden brunches on the Bukit.",
  },
};

const ALL_BRUNCH = [
  "suka-espresso",
  "son-of-a-baker",
  "bgs-uluwatu",
  "alchemy-uluwatu",
  "seed-bingin",
  "artisan-uluwatu",
  "gooseberry-french-restaurant-uluwatu",
];

const FAQ = [
  {
    q: "What opens earliest for breakfast in Uluwatu?",
    a: "Son of a Baker starts around first light (current listings show 6 a.m., Mondays off — check their Instagram before an early mission), and BGS pours pre-surf coffee at the Suluban entrance from early morning. Most other kitchens start between 7 and 8.",
  },
  {
    q: "Where can I work from a café in Uluwatu?",
    a: "Suka Espresso has air-con and a steady laptop crowd off-peak, Alchemy's garden is calm through the morning, and Son of a Baker works for a quiet hour. None of them are dedicated coworking spaces — peak brunch hours belong to brunch.",
  },
  {
    q: "What are the healthy or plant-based options?",
    a: "Alchemy Uluwatu is fully plant-based (raw and gluten-free options, organic shop on site) and Seed cooks farm-to-table from its own garden. Both serve proper breakfasts, not just juices.",
  },
  {
    q: "Do I need to book brunch?",
    a: "No — every café here is walk-in. The only booking-worthy morning is Gooseberry's French brunch if you want a specific poolside table; peak Suka hours may mean a short wait.",
  },
];

export default function BestBrunchPage() {
  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="editorial_page_view" slug="uluwatu-best-brunch" />
        <div className="flex items-start justify-between">
          <Link href="/uluwatu" className="topline">
            ← Uluwatu guide
          </Link>
          <Link href="/places?district=uluwatu&category=cafe" className="quiet-link">
            All Uluwatu cafés →
          </Link>
        </div>

        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Uluwatu", href: "/uluwatu" },
            { name: "Best brunch" },
          ]}
        />
        <VenueItemListSchema name="Best brunch in Uluwatu" slugs={ALL_BRUNCH} />

        <header className="guide-hero">
          <p className="guide-kicker">Uluwatu · Mornings</p>
          <h1 className="guide-title">Best brunch in Uluwatu</h1>
          <p className="guide-standfirst">
            Short answer: <PlaceLink slug="suka-espresso">Suka Espresso</PlaceLink>{" "}
            is the dependable all-rounder,{" "}
            <PlaceLink slug="son-of-a-baker">Son of a Baker</PlaceLink> owns the
            early start, and <PlaceLink slug="alchemy-uluwatu">Alchemy</PlaceLink>{" "}
            covers the plant-based morning. Seven spots below, each verified
            for actual breakfast service — not just for being a café.
          </p>
          <p className="guide-meta-line">
            7 places · verified 2026-07-12 · editorial order, no paid ranking
          </p>
        </header>

        <section className="guide-section">
          <h2>Coffee first</h2>
          <p className="guide-lede">
            When the flat white matters more than the plate.
          </p>
          <VenuePicks slugs={["bgs-uluwatu", "son-of-a-baker", "suka-espresso"]} columns={3} />
        </section>

        <section className="guide-section">
          <h2>Post-surf breakfast</h2>
          <p className="guide-lede">
            Real plates near the breaks — earned calories, short scooter rides.
          </p>
          <VenuePicks slugs={["suka-espresso", "artisan-uluwatu", "seed-bingin"]} columns={3} />
        </section>

        <section className="guide-section">
          <h2>Quiet mornings & healthy plates</h2>
          <p className="guide-lede">
            Gardens over queues: the slow-start options.
          </p>
          <VenuePicks slugs={["alchemy-uluwatu", "seed-bingin", "son-of-a-baker"]} columns={3} />
        </section>

        <section className="guide-section">
          <h2>Work-friendly hours</h2>
          <div className="guide-prose">
            <p>
              The honest hierarchy: <PlaceLink slug="suka-espresso" /> for
              air-con and sockets outside peak brunch,{" "}
              <PlaceLink slug="alchemy-uluwatu" /> for calm garden mornings,{" "}
              <PlaceLink slug="son-of-a-baker" /> for an early focused hour
              before the case sells out. Uluwatu has no true coworking café —
              if the whole day is calls, that’s a Canggu job.
            </p>
          </div>
        </section>

        <section className="guide-section">
          <h2>The long French brunch</h2>
          <div className="guide-prose">
            <p>
              One outlier belongs here despite being a dinner room:{" "}
              <PlaceLink slug="gooseberry-french-restaurant-uluwatu" /> runs its
              kitchen from breakfast onward above Bingin, and a poolside French
              brunch after a surf is exactly the kind of morning the Bukit does
              well. Book if you care where you sit.
            </p>
          </div>
          <VenuePicks slugs={["gooseberry-french-restaurant-uluwatu", "artisan-uluwatu"]} />
        </section>

        <FaqBlock items={FAQ} />

        <RelatedGuides
          links={[
            {
              href: "/uluwatu/best-restaurants",
              title: "Where dinner happens",
              blurb: "Twelve verified dinner rooms, sorted by decision.",
            },
            {
              href: "/uluwatu/beach-clubs-sunset",
              title: "After the flat white: the sunset",
              blurb: "Seven golden-hour venues compared honestly.",
            },
            {
              href: "/uluwatu",
              title: "The Uluwatu guide",
              blurb: "Micro-areas, quick picks and practical notes.",
            },
          ]}
        />

        <div className="cta-band">
          <h2>Mornings sorted — now the other 20 hours</h2>
          <p>
            The 48-hour plan starts at these counters and ends on a cliff —
            with every stop sequenced so you never backtrack.
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
