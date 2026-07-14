import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import PlaceCard from "@/components/PlaceCard";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { guidesForDistrict } from "@/lib/guides";
import { getCangguVenues, toCangguPlaceCard, venueHasJob } from "@/lib/canggu";
import { CANGGU_GUIDES } from "@/lib/canggu-guides";
import type { VenueWithPerk } from "@/lib/data";

const BASE = "https://www.otherbali.com";

export const metadata: Metadata = {
  title: "Canggu guide — where to eat, work, reset and watch the sunset",
  description:
    "A resident-curated Canggu guide: how the areas differ, the best restaurants, work-friendly cafés, spas and sunset spots — and where to book a table in a tap.",
  alternates: { canonical: "/canggu" },
  openGraph: {
    title: "The Canggu guide · Other Bali",
    description:
      "Areas, the best restaurants, work-friendly cafés, spas and sunset spots — sorted by the decision you're making.",
    url: `${BASE}/canggu`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Canggu guide · Other Bali",
    description: "Restaurants, work cafés, spas and sunset — sorted by decision.",
  },
};

const FAQ = [
  {
    q: "What is Canggu best for?",
    a: "Surf, café-and-laptop mornings, sunset beach bars and a deep dinner scene. It's the island's busiest expat-and-traveller hub — energetic and walkable-ish in patches, with real traffic between areas.",
  },
  {
    q: "Do I need to book restaurants in Canggu?",
    a: "For the popular dinner rooms and weekend sunsets, yes — reserve a table in a tap where you see the Reserve button. Cafés, warungs and casual spots are walk-in.",
  },
  {
    q: "Which area of Canggu should I stay in?",
    a: "Berawa and Batu Bolong for cafés, beach clubs and walkable dinners; Echo Beach for a quieter surf-and-sunset base. The guides below sort places by decision so you can plan around wherever you land.",
  },
];

function TopPicks({ title, note, venues, href }: { title: string; note: string; venues: VenueWithPerk[]; href: string }) {
  if (venues.length === 0) return null;
  return (
    <section className="guide-section">
      <div className="flex items-baseline justify-between gap-4">
        <h2>{title}</h2>
        <Link href={href} className="quiet-link">See all →</Link>
      </div>
      <p className="text-sm text-[var(--muted)]">{note}</p>
      <div className="pick-grid" style={{ marginTop: 16 }}>
        {venues.slice(0, 3).map((v) => (
          <PlaceCard key={v.slug} place={toCangguPlaceCard(v)} />
        ))}
      </div>
    </section>
  );
}

export default async function CangguPillarPage() {
  const venues = await getCangguVenues();
  const restaurants = venues.filter((v) => v.category === "restaurant");
  const cafes = venues.filter((v) => v.category === "cafe" || venueHasJob(v, ["quiet-work-cafe", "brunch-after-surf"]));
  const spas = venues.filter((v) => v.category === "spa");
  const sunset = venues.filter((v) => v.category === "beach_club" || v.category === "bar" || venueHasJob(v, ["sunset-drinks-view"]));

  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Canggu" }];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: `${BASE}${c.href}` } : {}),
    })),
  };

  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="district_page_view" slug="canggu" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Breadcrumbs items={crumbs} />

        <header style={{ marginTop: 8 }}>
          <p className="topline">Canggu · Other Bali beta</p>
          <h1 className="hero-title mt-2">Canggu, sorted by the decision you&apos;re making</h1>
          <p className="hero-copy">
            Surf, coffee, sunset and a deep dinner scene — and enough choice to lose
            an afternoon deciding. This guide sorts Canggu by what you&apos;re actually
            choosing: where to eat, where to work, where to reset, where to watch the
            sun go down. Confirmed offers and table reservations are one tap away.
          </p>
          <div className="hero-actions" style={{ marginTop: 16 }}>
            <Link href="/plan" className="button-primary button-large">Plan your Canggu day</Link>
            <Link href="/places?district=canggu" className="button-secondary button-large">Browse all Canggu places</Link>
          </div>
        </header>

        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Canggu guides">
          {CANGGU_GUIDES.map((g) => (
            <Link key={g.slug} href={`/canggu/${g.slug}`} className="chip">
              {g.h1.replace(" in Canggu", "").replace("Canggu ", "")}
            </Link>
          ))}
        </nav>

        <TopPicks title="Best restaurants" note="From date-night rooms to group tables." venues={restaurants} href="/canggu/best-restaurants" />
        <TopPicks title="Work-friendly cafés" note="Wifi, sockets and a seat that lasts." venues={cafes} href="/canggu/work-friendly-cafes" />
        <TopPicks title="Spas & reset" note="Wind down after beach and board." venues={spas} href="/canggu/best-spas" />
        <TopPicks title="Beach clubs & sunset" note="Golden hour, from day clubs to quiet bars." venues={sunset} href="/canggu/beach-clubs-sunset" />

        <FaqBlock items={FAQ} />
        <RelatedGuides
          links={[
            { href: "/uluwatu", title: "The Uluwatu guide", blurb: "Cliffs, surf and the island's best sunsets." },
            { href: "/first-time-in-bali", title: "First time in Bali", blurb: "Your first day without the rookie mistakes." },
            { href: "/plan", title: "Plan a Canggu day", blurb: "Build a day by the moment you're in." },
          ]}
        />
        <RelatedGuides heading="Bali planning guides" links={guidesForDistrict("canggu")} />

        <GuideFooter />
      </main>
    </div>
  );
}
