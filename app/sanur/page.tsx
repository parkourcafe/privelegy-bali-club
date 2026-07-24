import type { Metadata } from "next";
import Link from "next/link";
import BrandHomeLink from "@/components/BrandHomeLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import StartYourShortlist from "@/components/StartYourShortlist";
import PillarMasthead from "@/components/landing/PillarMasthead";
import { GuideFooter, RelatedGuides } from "@/components/GuideBlocks";
import { getSanurVenues } from "@/lib/sanur";
import { buildStartShortlist } from "@/lib/start-shortlist";

const canonicalUrl = "https://www.otherbali.com/sanur";
const reviewDate = "2026-07-22";

export const metadata: Metadata = {
  title: "Sanur Bali guide: who this calmer base suits",
  description:
    "Decide whether Sanur is the right Bali base for you, compare its practical north, central and south planning zones, and choose your next guide.",
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: "Sanur Bali guide: who this calmer base suits",
    description:
      "A practical fit check for Sanur, with clear trade-offs and links to narrower stay decisions.",
    url: canonicalUrl,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanur Bali guide: who this calmer base suits",
    description: "A practical fit check for choosing Sanur as your Bali base.",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Article", "TravelGuide"],
  headline: "Sanur Bali guide: who this calmer base suits",
  description: metadata.description,
  mainEntityOfPage: canonicalUrl,
  dateModified: reviewDate,
  author: { "@type": "Organization", name: "Other Bali" },
  publisher: { "@type": "Organization", name: "Other Bali" },
};

export default async function SanurPillarPage() {
  const venues = await getSanurVenues();

  return (
    <main className="site-shell">
      <PageViewTracker event="district_page_view" slug="sanur" />
      <div className="flex items-start justify-between gap-4">
        <BrandHomeLink />
        <Link href="/places?district=sanur" className="quiet-link">All Sanur places →</Link>
      </div>

      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Sanur" }]} />

      <PillarMasthead
        posterScene="district-sanur"
        variant="surf"
        kicker="Sanur · East coast"
        title="Is Sanur the right Bali base for you?"
        copy="Sanur is often a better fit if you want a calmer, promenade-led base and choose your location carefully. This guide helps you decide whether its pace and practical trade-offs match your trip."
        meta={`Verified: ${reviewDate} · researched, not sponsored · no paid ranking`}
      />

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Sanur planning guides">
        <Link href="/sanur/where-to-stay" className="chip">Where to stay</Link>
        <Link href="/sanur/best-hotels" className="chip">Hotels</Link>
        <Link href="/sanur/things-to-do" className="chip">Things to do</Link>
        <Link href="/sanur/best-restaurants" className="chip">Restaurants</Link>
      </nav>

      <StartYourShortlist district="Sanur" items={buildStartShortlist(venues)} />

      <section className="guide-section">
        <h2>Choose Sanur if a slower base matters</h2>
        <div className="guide-prose">
          <p>Sanur may suit you if you want a calmer stay and plan to use the promenade as part of your day. Location still matters: beachfront, near-promenade and inland stays do not offer the same experience.</p>
          <p>Sanur may not be the best fit if nightlife is the main reason for your Bali base.</p>
          <p>It can be a promising family base, but check the exact beach segment, hotel facilities and walking route. It can also work for older travellers who choose the right zone and do not need guaranteed accessibility.</p>
        </div>
      </section>

      <section className="guide-section">
        <h2>Use three planning zones</h2>
        <p className="guide-lede">Other Bali uses South, Central and North Sanur as practical planning zones. They are editorial planning labels, not official administrative boundaries.</p>
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead><tr><th scope="col">Zone</th><th scope="col">Use it for this decision</th></tr></thead>
            <tbody>
              <tr><th scope="row">Central Sanur</th><td>The practical default if you want to stay near the main Sanur rhythm.</td></tr>
              <tr><th scope="row">South Sanur</th><td>A quieter, more resort-led stay.</td></tr>
              <tr><th scope="row">North Sanur</th><td>Classic Sanur and harbour-side logistics, with identity caveats in the new and legacy hotel cluster.</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-5"><Link href="/sanur/where-to-stay" className="font-bold text-[var(--lagoon-strong)]">Compare the zones before choosing a hotel →</Link></p>
      </section>

      <section className="guide-section">
        <h2>When ferry connections influence the choice</h2>
        <p className="guide-lede">Sanur is especially relevant if your plan includes ferry handoffs to Nusa Penida, Lembongan or the Gili Islands. Routes and schedules are volatile, so confirm them directly for your travel date.</p>
      </section>

      <RelatedGuides links={[
        { href: "/sanur/where-to-stay", title: "Where to stay in Sanur", blurb: "Choose north, central or south Sanur before comparing individual hotels." },
        { href: "/sanur/best-hotels", title: "Best hotels in Sanur", blurb: "A separate hotel-selection guide; current terms should always be checked directly." },
        { href: "/sanur/things-to-do", title: "Things to do in Sanur", blurb: "Continue from the base decision to local activities." },
        { href: "/nusa-penida-day-trip", title: "Nusa Penida day trip", blurb: "Plan the island handoff separately from choosing your Sanur base." },
      ]} />

      <GuideFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
    </main>
  );
}
