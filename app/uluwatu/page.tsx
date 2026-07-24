import type { Metadata } from "next";
import Link from "next/link";
import BrandHomeLink from "@/components/BrandHomeLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import StartYourShortlist from "@/components/StartYourShortlist";
import PillarMasthead from "@/components/landing/PillarMasthead";
import { GuideFooter, RelatedGuides } from "@/components/GuideBlocks";
import { getPublishedVenues } from "@/lib/data";
import { buildStartShortlist } from "@/lib/start-shortlist";
import { ULUWATU_DB_SLUG } from "@/lib/uluwatu/venues";

const canonicalUrl = "https://www.otherbali.com/uluwatu";
const reviewDate = "2026-07-23";

export const metadata: Metadata = {
  title: "Uluwatu Bali guide: is it the right base for you?",
  description:
    "Decide whether Uluwatu fits your Bali trip, understand the Pecatu and Ungasan planning context, and continue to focused food, sunset and itinerary guides.",
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: "Uluwatu Bali guide: is it the right base for you?",
    description:
      "A conservative, decision-first orientation to Uluwatu's verified anchors and narrower planning guides.",
    url: canonicalUrl,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Uluwatu Bali guide: is it the right base for you?",
    description: "Understand Uluwatu's planning context before choosing your next guide.",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Article", "TravelGuide"],
  headline: "Uluwatu Bali guide: is it the right base for you?",
  description: metadata.description,
  mainEntityOfPage: canonicalUrl,
  dateModified: reviewDate,
  author: { "@type": "Organization", name: "Other Bali" },
  publisher: { "@type": "Organization", name: "Other Bali" },
};

const guideLinks = [
  { href: "/uluwatu/best-restaurants", label: "Restaurants" },
  { href: "/uluwatu/best-brunch", label: "Brunch & coffee" },
  { href: "/uluwatu/beach-clubs-sunset", label: "Sunset clubs" },
  { href: "/uluwatu/date-night-restaurants", label: "Date night" },
  { href: "/uluwatu/48-hours", label: "48 hours" },
];

export default async function UluwatuPillarPage() {
  const venues = (await getPublishedVenues())
    .filter((venue) => venue.district === ULUWATU_DB_SLUG);

  return (
    <main className="site-shell">
      <PageViewTracker event="district_page_view" slug="uluwatu" />
      <div className="flex items-start justify-between gap-4">
        <BrandHomeLink />
        <Link href="/places?district=uluwatu" className="quiet-link">All Uluwatu places →</Link>
      </div>

      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Uluwatu" }]} />

      <PillarMasthead
        posterScene="district-uluwatu-bukit"
        variant="sunset"
        kicker="Uluwatu · Bukit Peninsula"
        title="Is Uluwatu the right Bali base for you?"
        copy="Other Bali uses Uluwatu as a practical planning label that includes verified anchors in Pecatu and nearby Ungasan. It is not one official compact district, so start with the part of the peninsula your trip is built around."
        meta={`Verified: ${reviewDate} · researched, not sponsored · no paid ranking`}
      />

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Uluwatu planning guides">
        {guideLinks.map((item) => <Link key={item.href} href={item.href} className="chip">{item.label}</Link>)}
      </nav>

      <StartYourShortlist district="Uluwatu" items={buildStartShortlist(venues)} />

      <section className="guide-section">
        <h2>Start with the planning label</h2>
        <div className="guide-prose">
          <p>Pura Luhur Uluwatu is a Pecatu cliff-side cultural anchor. GWK Cultural Park is in Ungasan. Both can appear in a broader Uluwatu trip, but they are not the same locality.</p>
          <p>That distinction matters before you choose accommodation or sequence a day. This guide does not publish fixed tourist-zone boundaries or promise that the wider area works like one neighbourhood.</p>
        </div>
      </section>

      <section className="guide-section">
        <h2>Verified coastal anchors</h2>
        <div className="guide-prose">
          <p>Padang Padang and Nyang Nyang are distinct Pecatu/Uluwatu-area beach anchors. Their identity is verified; swimming suitability, accessibility and current access conditions are not treated as universal facts here.</p>
          <p>Choose accommodation and transport only after checking the exact route and current access conditions. Other Bali does not currently claim that the wider Uluwatu area is walkable, that a scooter is required, or that one transport option works for everyone.</p>
        </div>
      </section>

      <section className="guide-section">
        <h2>Choose the narrower decision next</h2>
        <p className="guide-lede">Once the wider area makes sense for your trip, use the focused guides below for restaurant, brunch, sunset-club, date-night and itinerary choices.</p>
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead><tr><th scope="col">Your next decision</th><th scope="col">Use this guide</th></tr></thead>
            <tbody>
              <tr><th scope="row">Choose a meal</th><td><Link href="/uluwatu/best-restaurants">Best restaurants in Uluwatu</Link></td></tr>
              <tr><th scope="row">Choose brunch or coffee</th><td><Link href="/uluwatu/best-brunch">Best brunch &amp; coffee</Link></td></tr>
              <tr><th scope="row">Compare sunset venues</th><td><Link href="/uluwatu/beach-clubs-sunset">Beach clubs &amp; sunset</Link></td></tr>
              <tr><th scope="row">Plan an occasion meal</th><td><Link href="/uluwatu/date-night-restaurants">Date-night restaurants</Link></td></tr>
              <tr><th scope="row">Sequence the trip</th><td><Link href="/uluwatu/48-hours">48 hours in Uluwatu</Link></td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="guide-section">
        <h2>Evidence limits</h2>
        <div className="guide-prose">
          <p>Current hours, tickets, day passes, prices and venue policies are volatile. Check current official terms for the date of your visit.</p>
          <p>We will add detailed stay, hotel, beach and activity guidance only after the movement, access, safety, entity and Maps checks behind those decisions are complete.</p>
        </div>
      </section>

      <RelatedGuides links={[
        { href: "/uluwatu-sunset-kecak", title: "Uluwatu Temple and Kecak route", blurb: "Plan the temple and Kecak sequence after choosing the wider area." },
        { href: "/canggu-vs-uluwatu", title: "Canggu or Uluwatu?", blurb: "Compare these two Bali bases directly." },
        { href: "/where-to-stay-in-bali", title: "Where to stay in Bali", blurb: "Compare Uluwatu with other Bali areas before narrowing the trip." },
      ]} />

      <GuideFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
    </main>
  );
}
