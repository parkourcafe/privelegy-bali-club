import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import PlaceCard from "@/components/PlaceCard";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { guidesForDistrict } from "@/lib/guides";
import { getNusaDuaVenues, toNusaDuaPlaceCard } from "@/lib/nusa-dua";
import { NUSA_DUA_GUIDES } from "@/lib/nusa-dua-guides";
import type { VenueWithPerk } from "@/lib/data";

const BASE = "https://otherbali.com";

export const metadata: Metadata = {
  title: "Nusa Dua guide — the calm, polished resort enclave",
  description:
    "A resident-curated Nusa Dua guide: who the gated resort enclave suits, its calm swimmable beaches, resort fine dining and some of Bali's biggest spas.",
  alternates: { canonical: "/nusa-dua" },
  openGraph: {
    title: "The Nusa Dua guide · Other Bali",
    description: "The resort enclave — calm beaches, fine dining and big resort spas.",
    url: `${BASE}/nusa-dua`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Nusa Dua guide · Other Bali",
    description: "The resort enclave — calm beaches, fine dining and big resort spas.",
  },
};

const FAQ = [
  {
    q: "What is Nusa Dua best for?",
    a: "Calm, polished, low-friction Bali: a gated enclave of beachfront five-star resorts, manicured grounds, safe swimmable beaches and resort fine dining. It suits families, couples on a relaxed break and travellers who want easy, secure logistics over an independent scene.",
  },
  {
    q: "Are Nusa Dua's beaches good?",
    a: "Yes — calm, reef-protected and swimmable, among the safest in Bali for families. Geger Beach is the local favourite; the resort beachfronts are clean and gently shelving.",
  },
  {
    q: "Is Nusa Dua walkable or lively?",
    a: "It's manicured and quiet rather than lively — great for a stroll along the beach promenade or the Bali Collection shops, but nightlife and independent cafés live elsewhere. Tanjung Benoa, just north, is the watersports hub.",
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
          <PlaceCard key={v.slug} place={toNusaDuaPlaceCard(v)} />
        ))}
      </div>
    </section>
  );
}

export default async function NusaDuaPillarPage() {
  const venues = await getNusaDuaVenues();
  const restaurants = venues.filter((v) => v.category === "restaurant" || v.category === "warung" || v.category === "beach_club");
  const wellness = venues.filter((v) => v.category === "spa" || v.category === "fitness" || v.category === "yoga");

  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Nusa Dua" }];

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
        <PageViewTracker event="district_page_view" slug="nusa-dua" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Breadcrumbs items={crumbs} />

        <header style={{ marginTop: 8 }}>
          <p className="topline">Nusa Dua · South-east coast</p>
          <h1 className="hero-title mt-2">Nusa Dua, the calm resort enclave</h1>
          <p className="hero-copy">
            A gated, manicured enclave of beachfront five-star resorts on Bali&apos;s
            south-east tip: calm swimmable beaches, resort fine dining and some of
            the island&apos;s biggest spas. It&apos;s the low-friction, family-safe
            end of Bali — this guide covers where to eat and where to be looked
            after, curated from places we actually rate.
          </p>
          <div className="hero-actions" style={{ marginTop: 16 }}>
            <Link href="/places?district=nusa-dua" className="button-secondary button-large">Browse all Nusa Dua places</Link>
          </div>
        </header>

        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Nusa Dua guides">
          {NUSA_DUA_GUIDES.map((g) => (
            <Link key={g.slug} href={`/nusa-dua/${g.slug}`} className="chip">
              {g.h1.replace(" in Nusa Dua", "").replace("Nusa Dua ", "")}
            </Link>
          ))}
        </nav>

        <TopPicks title="Best restaurants" note="Resort fine dining, beachfront tables and a few local spots." venues={restaurants} href="/nusa-dua/best-restaurants" />
        <TopPicks title="Spas & wellness" note="Some of Bali's biggest resort spas, plus fitness and yoga." venues={wellness} href="/nusa-dua/spas-wellness" />

        <FaqBlock items={FAQ} />
        <RelatedGuides
          links={[
            { href: "/sanur", title: "The Sanur guide", blurb: "A calmer, walkable sunrise base up the coast." },
            { href: "/uluwatu", title: "The Uluwatu guide", blurb: "Cliff-edge sunsets and surf, just west." },
            { href: "/places", title: "All Bali places", blurb: "The full curated map by district." },
          ]}
        />
        <RelatedGuides heading="Bali planning guides" links={guidesForDistrict("nusa-dua")} />

        <GuideFooter />
      </main>
    </div>
  );
}
