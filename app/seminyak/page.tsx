import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import PlaceCard from "@/components/PlaceCard";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { guidesForDistrict } from "@/lib/guides";
import { getSeminyakVenues, toSeminyakPlaceCard } from "@/lib/seminyak";
import { SEMINYAK_GUIDES } from "@/lib/seminyak-guides";
import type { VenueWithPerk } from "@/lib/data";
import { serializeJsonLd } from "@/lib/json-ld";

const BASE = "https://www.otherbali.com";

export const metadata: Metadata = {
  title: "Seminyak guide — where to eat, drink at sunset and be looked after",
  description:
    "A resident-curated Seminyak guide: how the area feels, the restaurants and beach clubs worth your time, the sunset spots, and the island's densest spa-and-salon scene.",
  alternates: { canonical: "/seminyak" },
  openGraph: {
    title: "The Seminyak guide · Other Bali",
    description: "Dining, beach clubs, sunset spots and spas — how to plan Seminyak.",
    url: `${BASE}/seminyak`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Seminyak guide · Other Bali",
    description: "Dining, beach clubs, sunset spots and spas — how to plan Seminyak.",
  },
};

const FAQ = [
  {
    q: "What is Seminyak best for?",
    a: "Polished Bali: the original dining strip, beachfront sunset clubs, boutique shopping and the island's densest spa-and-salon scene. It's walkable and stylish — a more urban base than Canggu, calmer than Kuta.",
  },
  {
    q: "Which beaches are in Seminyak?",
    a: "Double Six (Blue Ocean) for beanbags, beginner surf and sunset strolls; quieter Petitenget Beach to the north. The sand runs continuously, so you can walk between the beach clubs at golden hour.",
  },
  {
    q: "Is Seminyak walkable?",
    a: "The core around Jl. Kayu Aya (Eat Street), Petitenget and Seminyak Square is walkable; anything toward Umalas, Batu Belig or Sunset Road is a short scooter or taxi.",
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
          <PlaceCard key={v.slug} place={toSeminyakPlaceCard(v)} />
        ))}
      </div>
    </section>
  );
}

export default async function SeminyakPillarPage() {
  const venues = await getSeminyakVenues();
  const restaurants = venues.filter((v) => v.category === "restaurant" || v.category === "warung");
  const beachClubs = venues.filter((v) => v.category === "beach_club" || v.category === "bar");
  const cafes = venues.filter((v) => v.category === "cafe");
  const wellness = venues.filter(
    (v) => v.category === "spa" || v.category === "beauty" || v.category === "fitness" || v.category === "yoga"
  );

  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Seminyak" }];

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
        <PageViewTracker event="district_page_view" slug="seminyak" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />

        <Breadcrumbs items={crumbs} />

        <header style={{ marginTop: 8 }}>
          <p className="topline">Seminyak · West coast</p>
          <h1 className="hero-title mt-2">Seminyak, Bali&apos;s polished coast</h1>
          <p className="hero-copy">
            The island&apos;s original style strip: Eat Street dining, beachfront
            sunset clubs along Double Six and Petitenget, boutique shopping and
            Bali&apos;s densest spa-and-salon scene. This guide covers where to eat,
            where to catch the sunset and where to be looked after — curated from
            places we actually rate.
          </p>
          <div className="hero-actions" style={{ marginTop: 16 }}>
            <Link href="/places?district=seminyak" className="button-secondary button-large">Browse all Seminyak places</Link>
          </div>
        </header>

        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Seminyak guides">
          {SEMINYAK_GUIDES.map((g) => (
            <Link key={g.slug} href={`/seminyak/${g.slug}`} className="chip">
              {g.h1.replace(" in Seminyak", "").replace("Seminyak ", "")}
            </Link>
          ))}
        </nav>

        <TopPicks title="Best restaurants" note="Eat Street rooms, sharing tables and honest warungs." venues={restaurants} href="/seminyak/best-restaurants" />
        <TopPicks title="Beach clubs & sunset" note="Where to be for golden hour on the sand." venues={beachClubs} href="/seminyak/beach-clubs-sunset" />
        <TopPicks title="Cafés & coffee" note="Specialty coffee and long brunches." venues={cafes} href="/seminyak/cafes-coffee" />
        <TopPicks title="Spas, salons & wellness" note="Massage, beauty, yoga and fitness — Bali's spa capital." venues={wellness} href="/seminyak/spas-salons-wellness" />

        <FaqBlock items={FAQ} />
        <RelatedGuides
          links={[
            { href: "/canggu", title: "The Canggu guide", blurb: "Surf, cafés and a deep dinner scene." },
            { href: "/ubud", title: "The Ubud guide", blurb: "Jungle calm, yoga and long slow dinners." },
            { href: "/places", title: "All Bali places", blurb: "The full curated map by district." },
          ]}
        />
        <RelatedGuides heading="Bali planning guides" links={guidesForDistrict("seminyak")} />

        <GuideFooter />
      </main>
    </div>
  );
}
