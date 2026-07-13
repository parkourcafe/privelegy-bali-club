import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import PlaceCard from "@/components/PlaceCard";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { getUbudVenues, toUbudPlaceCard } from "@/lib/ubud";
import { UBUD_GUIDES } from "@/lib/ubud-guides";
import type { VenueWithPerk } from "@/lib/data";

const BASE = "https://otherbali.com";

export const metadata: Metadata = {
  title: "Ubud guide — where to eat, drink coffee and slow down",
  description:
    "A resident-curated Ubud guide: how the area feels, the restaurants and cafés worth your time, and how to plan a slow day in Bali's cultural heart.",
  alternates: { canonical: "/ubud" },
  openGraph: {
    title: "The Ubud guide · Other Bali",
    description: "Restaurants, cafés and how to plan a slow Ubud day.",
    url: `${BASE}/ubud`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Ubud guide · Other Bali",
    description: "Restaurants, cafés and how to plan a slow Ubud day.",
  },
};

const FAQ = [
  {
    q: "What is Ubud best for?",
    a: "Green, slower Bali: rice-terrace walks, jungle mornings, yoga and long healthy dinners. It's the cultural heart of the island — an inland base, not a beach one.",
  },
  {
    q: "Is Ubud walkable?",
    a: "The centre is walkable-ish, but sights and cafés spread into the surrounding villages and rice fields — a scooter or driver helps for anything beyond the core.",
  },
  {
    q: "How long should I spend in Ubud?",
    a: "Two to three days covers the food, a walk or two and a temple or market at an unhurried pace. Longer if you're here to slow down properly.",
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
          <PlaceCard key={v.slug} place={toUbudPlaceCard(v)} />
        ))}
      </div>
    </section>
  );
}

export default async function UbudPillarPage() {
  const venues = await getUbudVenues();
  const restaurants = venues.filter((v) => v.category === "restaurant");
  const cafes = venues.filter((v) => v.category === "cafe");
  const wellness = venues.filter((v) => v.category === "spa");

  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Ubud" }];

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
        <PageViewTracker event="district_page_view" slug="ubud" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Breadcrumbs items={crumbs} />

        <header style={{ marginTop: 8 }}>
          <p className="topline">Ubud · Central highlands</p>
          <h1 className="hero-title mt-2">Ubud, the slow green heart of Bali</h1>
          <p className="hero-copy">
            Rice terraces, jungle mornings, yoga and long healthy dinners — Ubud is
            the island&apos;s cultural, inland base, not a beach one. This guide covers
            where to eat, where to drink coffee, and where to practise yoga, be
            worked on and reset — curated from places we actually rate.
          </p>
          <div className="hero-actions" style={{ marginTop: 16 }}>
            <Link href="/places?district=ubud" className="button-secondary button-large">Browse all Ubud places</Link>
          </div>
        </header>

        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Ubud guides">
          {UBUD_GUIDES.map((g) => (
            <Link key={g.slug} href={`/ubud/${g.slug}`} className="chip">
              {g.h1.replace(" in Ubud", "").replace("Ubud ", "")}
            </Link>
          ))}
        </nav>

        <TopPicks title="Best restaurants" note="Long slow dinners and healthy plates." venues={restaurants} href="/ubud/best-restaurants" />
        <TopPicks title="Cafés & coffee" note="Serious coffee and calm mornings." venues={cafes} href="/ubud/best-cafes-coffee" />
        <TopPicks title="Yoga & wellness" note="Studios, spas, sound and retreats — Ubud's signature." venues={wellness} href="/ubud/best-yoga-wellness" />

        <FaqBlock items={FAQ} />
        <RelatedGuides
          links={[
            { href: "/canggu", title: "The Canggu guide", blurb: "Surf, cafés and a deep dinner scene." },
            { href: "/bali-retreat-reset", title: "A Bali reset", blurb: "A calmer week for your nervous system." },
            { href: "/places", title: "All Bali places", blurb: "The full curated map by district." },
          ]}
        />
        <GuideFooter />
      </main>
    </div>
  );
}
