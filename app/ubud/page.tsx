import type { Metadata } from "next";
import Link from "next/link";
import BrandHomeLink from "@/components/BrandHomeLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import PillarMasthead from "@/components/landing/PillarMasthead";
import { GuideFooter } from "@/components/GuideBlocks";

const canonicalUrl = "https://www.otherbali.com/ubud";
const reviewDate = "2026-07-23";

export const metadata: Metadata = {
  title: "Ubud Bali guide: is it the right base for you?",
  description:
    "Decide whether Ubud's central-Bali culture, arts and rice-field setting fits your trip, then continue to focused activity, itinerary and food guides.",
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: "Ubud Bali guide: is it the right base for you?",
    description:
      "A decision-first orientation to Ubud's verified planning identity and focused guides.",
    url: canonicalUrl,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ubud Bali guide: is it the right base for you?",
    description: "Understand Ubud's planning context before choosing the next guide.",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Article", "TravelGuide"],
  headline: "Ubud Bali guide: is it the right base for you?",
  description: metadata.description,
  mainEntityOfPage: canonicalUrl,
  dateModified: reviewDate,
  author: { "@type": "Organization", name: "Other Bali" },
  publisher: { "@type": "Organization", name: "Other Bali" },
};

const placeLinks = [
  { href: "/places/bali-buda-ubud", label: "Bali Buda Ubud" },
  { href: "/places/anomali-coffee-ubud", label: "Anomali Coffee Ubud" },
  { href: "/places/maya-ubud-yoga-ubud", label: "Maya Ubud Yoga" },
  { href: "/places/suka-espresso-ubud", label: "Suka Espresso Ubud" },
];

export default function UbudPillarPage() {
  return (
    <main className="site-shell">
      <PageViewTracker event="district_page_view" slug="ubud" />
      <div className="flex items-start justify-between gap-4">
        <BrandHomeLink />
        <Link href="/places/bali-buda-ubud" className="quiet-link">Open Bali Buda Ubud →</Link>
      </div>

      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Ubud" }]} />

      <PillarMasthead
        posterScene="district-ubud"
        variant="ridge"
        videoSrc="/scenes/ubud-dawn-loop.mp4"
        kicker="Ubud · Central Bali"
        title="Is Ubud the right Bali base for you?"
        copy="Official tourism sources frame Ubud through culture, arts and rice-field landscapes in central Bali. Choose it when those inland priorities matter more to the trip than having a coastal base."
        meta={`Verified: ${reviewDate} · researched, not sponsored · no paid ranking`}
      />

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Ubud planning guides">
        {placeLinks.map((item) => <Link key={item.href} href={item.href} className="chip">{item.label}</Link>)}
      </nav>

      <section className="guide-section">
        <h2>Start with the trip you want</h2>
        <div className="guide-prose">
          <p>Ubud is an inland planning choice. Its verified destination identity is tied to Balinese culture and arts, rice-field landscapes and wellness rather than a beach setting.</p>
          <p>That makes it a useful base when these are central to the trip. If daily beach time is the priority, compare Ubud with a coastal area before choosing accommodation.</p>
        </div>
      </section>

      <section className="guide-section">
        <h2>Choose centre or away from the centre first</h2>
        <div className="guide-prose">
          <p>Official visitor information distinguishes accommodation close to Ubud&apos;s activity from stays away from the centre and closer to greenery. Make that location decision before comparing individual properties.</p>
          <p>Other Bali does not currently promise that a named Ubud zone is walkable, suitable without transport or better for a particular traveller. Those recommendations require street-level, access and Maps verification.</p>
        </div>
      </section>

      <section className="guide-section">
        <h2>One verified town anchor</h2>
        <div className="guide-prose">
          <p>Sacred Monkey Forest Sanctuary identifies its location on Jalan Monkey Forest in Padangtegal, Ubud. It is one verified attraction anchor, not a definition of the whole area.</p>
          <p>Check the sanctuary&apos;s current visitor guidance on its official website before visiting. Hours, prices and operating rules can change and are not restated here.</p>
        </div>
      </section>

      <section className="guide-section">
        <h2>Open a specific Ubud place</h2>
        <p className="guide-lede">These links go directly to place pages, not another generic Ubud article.</p>
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead><tr><th scope="col">Your next decision</th><th scope="col">Open this place</th></tr></thead>
            <tbody>
              <tr><th scope="row">Choose a health-food stop</th><td><Link href="/places/bali-buda-ubud">Bali Buda Ubud</Link></td></tr>
              <tr><th scope="row">Choose a coffee stop</th><td><Link href="/places/anomali-coffee-ubud">Anomali Coffee Ubud</Link></td></tr>
              <tr><th scope="row">Choose a yoga stop</th><td><Link href="/places/maya-ubud-yoga-ubud">Maya Ubud Yoga</Link></td></tr>
              <tr><th scope="row">Choose an espresso stop</th><td><Link href="/places/suka-espresso-ubud">Suka Espresso Ubud</Link></td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="guide-section">
        <h2>Evidence limits</h2>
        <div className="guide-prose">
          <p>This page does not rank hotels, promise transport conditions or publish fixed travel times. Detailed stay-zone, no-scooter, family and accessibility advice remains on hold until field and Maps checks are complete.</p>
          <p>Current attraction schedules, prices, venue offers and booking terms should always be checked with the official provider for the date of the visit.</p>
        </div>
      </section>

      <section className="guide-section">
        <h2>More verified place pages</h2>
        <div className="related-guides">
          {placeLinks.map((place) => (
            <Link key={place.href} href={place.href} className="related-guide-card">
              <h3>{place.label}</h3>
              <p>Open the specific place profile.</p>
            </Link>
          ))}
        </div>
      </section>

      <GuideFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
    </main>
  );
}
