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
        copy="Use this page to decide whether the Bukit Peninsula fits your trip. Uluwatu, Pecatu and Ungasan sit close together, but the best base depends on whether you want surf beaches, cliff sunsets, restaurants or an easier route back to your hotel."
        meta={`Verified: ${reviewDate} · researched, not sponsored · no paid ranking`}
      />

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Uluwatu planning guides">
        {guideLinks.map((item) => <Link key={item.href} href={item.href} className="chip">{item.label}</Link>)}
      </nav>

      <StartYourShortlist district="Uluwatu" items={buildStartShortlist(venues)} />

      <section className="guide-section">
        <h2>Start with the part of Uluwatu you actually need</h2>
        <div className="guide-prose">
          <p>Pura Luhur Uluwatu, Padang Padang, Bingin, Nyang Nyang and GWK can all sit inside an “Uluwatu trip”, but they do not feel the same on the ground.</p>
          <p>Choose your base by the day you want: cliff sunsets and Kecak, surf beaches, brunch and cafés around Bingin, or a quieter hotel stay with fewer transfers.</p>
        </div>
      </section>

      <section className="guide-section">
        <h2>Pick beaches and sunsets with a bit of caution</h2>
        <div className="guide-prose">
          <p>Padang Padang and Nyang Nyang are both worth knowing, but access, stairs, tides and swimming conditions can change the day quickly.</p>
          <p>Before you lock a plan, check the exact route from your hotel and keep a driver, taxi app or return plan in mind. Uluwatu is beautiful, but it is not a single walkable neighbourhood.</p>
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
        <h2>Before you go</h2>
        <div className="guide-prose">
          <p>Opening hours, Kecak tickets, beach access, day-pass rules and prices can change. Check the official page or the venue before you travel across the peninsula.</p>
          <p>If you are staying in Uluwatu without a scooter, plan transport first. The area is spread out, and the best choice often depends on the exact hotel, beach and dinner spot.</p>
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
