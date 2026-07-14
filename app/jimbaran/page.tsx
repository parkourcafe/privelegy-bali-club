import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import PlaceCard from "@/components/PlaceCard";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { getJimbaranVenues, toJimbaranPlaceCard } from "@/lib/jimbaran";
import { JIMBARAN_GUIDES } from "@/lib/jimbaran-guides";
import type { VenueWithPerk } from "@/lib/data";
import { serializeJsonLd } from "@/lib/json-ld";

const BASE = "https://www.otherbali.com";

export const metadata: Metadata = {
  title: "Jimbaran guide — the seafood bay, sunset bars & resort dining",
  description:
    "A resident-curated Jimbaran guide: grilled seafood on the bay at sunset, cliff-edge sunset bars, calm swimmable beaches near the airport, and some of Bali's most serious resort spas.",
  alternates: { canonical: "/jimbaran" },
  openGraph: {
    title: "The Jimbaran guide · Other Bali",
    description: "Seafood on the sand, cliff-edge sunset bars, calm bay mornings near the airport.",
    url: `${BASE}/jimbaran`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Jimbaran guide · Other Bali",
    description: "Seafood on the sand, cliff-edge sunset bars, calm bay mornings near the airport.",
  },
};

const FAQ = [
  {
    q: "What is Jimbaran best for?",
    a: "Seafood at sunset and a calmer, resort-leaning base close to the airport. It suits couples and families who want swimmable bay beaches, a famous grilled-seafood dinner on the sand, and cliff-top resort dining — over an independent café or nightlife scene, which lives up in Canggu and Seminyak.",
  },
  {
    q: "Is the Jimbaran seafood on the beach worth it?",
    a: "Yes, if you time it right. The bay grills serve fresh seafood cooked over coconut husk at tables near the sand — go for sunset, agree the price by weight before ordering, and treat it as the experience it is rather than the island's finest cooking.",
  },
  {
    q: "Is Jimbaran a good base near the airport?",
    a: "It's one of the closest calm areas to the airport (roughly 10–20 minutes), which makes it an easy first or last night. The bay is swimmable and family-friendly; the headland resorts are quiet and polished.",
  },
  {
    q: "Where is the sunset in Jimbaran?",
    a: "The bay faces west, so the seafood grills get the sunset directly. The headland above the bay holds Bali's best-known cliff-edge sunset bars — book a seat ahead for a weekend evening.",
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
          <PlaceCard key={v.slug} place={toJimbaranPlaceCard(v)} />
        ))}
      </div>
    </section>
  );
}

export default async function JimbaranPillarPage() {
  const venues = await getJimbaranVenues();
  const dining = venues.filter(
    (v) =>
      v.category === "restaurant" ||
      v.category === "warung" ||
      v.category === "beach_club" ||
      v.category === "bar" ||
      v.category === "cafe"
  );
  const wellness = venues.filter(
    (v) => v.category === "spa" || v.category === "fitness" || v.category === "yoga" || v.category === "beauty"
  );

  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Jimbaran" }];

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
        <PageViewTracker event="district_page_view" slug="jimbaran" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />

        <Breadcrumbs items={crumbs} />

        <header style={{ marginTop: 8 }}>
          <p className="topline">Jimbaran · South coast</p>
          <h1 className="hero-title mt-2">Jimbaran, the seafood bay</h1>
          <p className="hero-copy">
            A calm, west-facing bay a short hop from the airport, famous for one
            thing above all: grilled seafood eaten near the sand at sunset. Above
            it, the headland holds cliff-edge sunset bars and some of Bali&apos;s
            most serious resort spas. This guide covers where to eat, drink and be
            looked after — curated from places we actually rate, never a directory.
          </p>
          <div className="hero-actions" style={{ marginTop: 16 }}>
            <Link href="/places?district=jimbaran" className="button-secondary button-large">Browse all Jimbaran places</Link>
          </div>
        </header>

        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Jimbaran guides">
          {JIMBARAN_GUIDES.map((g) => (
            <Link key={g.slug} href={`/jimbaran/${g.slug}`} className="chip">
              {g.h1.replace(" in Jimbaran", "").replace("Jimbaran ", "")}
            </Link>
          ))}
        </nav>

        <TopPicks title="Where to eat & drink" note="Bay seafood grills, sunset bars and resort fine dining." venues={dining} href="/jimbaran/best-restaurants" />
        <TopPicks title="Spas & wellness" note="Cliff-top resort spas, plus fitness and yoga." venues={wellness} href="/jimbaran/spas-wellness" />

        <FaqBlock items={FAQ} />
        <RelatedGuides
          links={[
            { href: "/uluwatu", title: "The Uluwatu guide", blurb: "Cliff-edge sunsets and world-class surf, just south." },
            { href: "/nusa-dua", title: "The Nusa Dua guide", blurb: "The calm resort enclave, next door to the east." },
            { href: "/places", title: "All Bali places", blurb: "The full curated map by district." },
          ]}
        />
        <GuideFooter />
      </main>
    </div>
  );
}
