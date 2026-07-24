import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import { GuideFooter, RelatedGuides } from "@/components/GuideBlocks";

const canonicalUrl = "https://www.otherbali.com/sanur/where-to-stay";
const reviewDate = "2026-07-22";

export const metadata: Metadata = {
  title: "Where to stay in Sanur: north, central or south",
  description: "Choose the right part of Sanur before choosing a hotel. Compare central, south and north Sanur, plus beachfront, near-promenade and inland trade-offs.",
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: "Where to stay in Sanur: north, central or south",
    description: "A location-first guide to Sanur's practical stay zones and accommodation trade-offs.",
    url: canonicalUrl,
    type: "article",
  },
  twitter: { card: "summary_large_image", title: "Where to stay in Sanur", description: "Choose the Sanur zone first, then the hotel." },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Article", "TravelGuide"],
  headline: "Where to stay in Sanur: north, central or south",
  description: metadata.description,
  mainEntityOfPage: canonicalUrl,
  dateModified: reviewDate,
  author: { "@type": "Organization", name: "Other Bali" },
  publisher: { "@type": "Organization", name: "Other Bali" },
};

export default function WhereToStayInSanurPage() {
  return (
    <main className="site-shell">
      <PageViewTracker event="district_page_view" slug="sanur/where-to-stay" />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Sanur", href: "/sanur" }, { name: "Where to stay" }]} />

      <header className="guide-hero">
        <p className="guide-kicker">Sanur · Stay zones</p>
        <h1 className="guide-title">Where to stay in Sanur</h1>
        <p className="guide-standfirst">Choose the part of Sanur before you choose the hotel. Central, south and north Sanur solve different trip decisions, and beachfront and inland stays are not interchangeable.</p>
        <p className="guide-meta-line">Verified: {reviewDate} · researched, not sponsored · no paid ranking</p>
      </header>

      <section className="guide-section">
        <h2>Quick decision</h2>
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead><tr><th scope="col">Choose</th><th scope="col">When your priority is</th><th scope="col">Trade-off to check</th></tr></thead>
            <tbody>
              <tr><th scope="row">Central Sanur</th><td>Staying near the main Sanur rhythm.</td><td>Do not assume every hotel is walkable to everything; check the exact route.</td></tr>
              <tr><th scope="row">South Sanur</th><td>A quieter, more resort-led stay.</td><td>Check the exact beach segment and current hotel facts.</td></tr>
              <tr><th scope="row">North Sanur</th><td>Classic Sanur and harbour-side logistics.</td><td>The new and legacy hotel cluster has identity caveats; confirm the exact property.</td></tr>
            </tbody>
          </table>
        </div>
        <p className="guide-lede mt-5">These are Other Bali planning zones, not official administrative boundaries.</p>
      </section>

      <section className="guide-section">
        <h2>Central Sanur: the practical default</h2>
        <div className="guide-prose"><p>Central Sanur is usually the practical default if you want to stay near the main Sanur rhythm. It is a starting point, not a promise that every address is convenient for every traveller.</p><p>Check the exact hotel position and walking route before booking, especially if step-free access, shade or easy crossings matter.</p></div>
      </section>

      <section className="guide-section">
        <h2>South Sanur: quieter and more resort-led</h2>
        <div className="guide-prose"><p>South Sanur is better framed for a quieter, more resort-led stay. Do not assume that every beach segment has the same swimming conditions or that every resort has the same access to the promenade.</p></div>
      </section>

      <section className="guide-section">
        <h2>North Sanur: classic Sanur and harbour logistics</h2>
        <div className="guide-prose"><p>North Sanur is useful for classic Sanur and harbour-side logistics, with some identity caveats in the new and legacy hotel cluster. Confirm the exact property name and current harbour route before relying on either.</p></div>
      </section>

      <section className="guide-section">
        <h2>Beachfront, near-promenade or inland?</h2>
        <div className="guide-prose"><p>Beachfront or near-promenade stays make Sanur&apos;s core experience easier; inland options can work but are a trade-off. Klumpu Bali Resort is one inland example, with an official address at Jalan Kesari No. 16B.</p><p>Prime Plaza Hotel Sanur is better treated as an edge or inland Sanur case, not a core beachfront stay. Exact walking times require a route check, and unconfirmed Maps links are intentionally not included here.</p></div>
      </section>

      <section className="guide-section">
        <h2>Choose the zone before the hotel</h2>
        <div className="guide-prose"><ol><li>Decide whether your priority is the main Sanur rhythm, a quieter resort-led stay or harbour-side logistics.</li><li>Choose beachfront, near-promenade or inland, accepting the location trade-off.</li><li>Then compare individual hotels in the separate hotel guide.</li></ol><p>Check current hotel terms before booking. This guide does not treat prices, breakfast, cancellation, renovations, day passes or pool access as evergreen facts.</p></div>
        <p><Link href="/sanur/best-hotels" className="font-bold text-[var(--lagoon-strong)]">Continue to the Sanur hotel guide →</Link></p>
      </section>

      <RelatedGuides links={[
        { href: "/sanur", title: "Is Sanur right for you?", blurb: "Return to the broader base-fit decision." },
        { href: "/sanur/best-hotels", title: "Best hotels in Sanur", blurb: "A separate hotel-selection decision after you choose the zone." },
        { href: "/sanur/things-to-do", title: "Things to do in Sanur", blurb: "Plan local activities after choosing where to stay." },
      ]} />
      <GuideFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
    </main>
  );
}
