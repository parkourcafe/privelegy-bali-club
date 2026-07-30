import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BrandHomeLink from "@/components/BrandHomeLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import DecisionRail from "@/components/DecisionRail";
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
    "Decide whether Sanur is the right Bali base for you, compare its north, central and south stays, and choose your next guide.",
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

const visualChoices = [
  {
    href: "/sanur/where-to-stay",
    image: "/scenes/sanur-sunrise-promenade-illustrative.webp",
    alt: "Illustrative Sanur sunrise promenade beside calm east-coast water",
    label: "Sunrise promenade",
    title: "Walk the coast early",
    copy: "Best if the promenade and a slower first rhythm are part of the trip.",
  },
  {
    href: "/sanur/best-hotels",
    image: "/scenes/sanur-calm-family-coast-illustrative.webp",
    alt: "Illustrative calm reef-sheltered shoreline and shaded coastal path in Sanur",
    label: "Calm coast",
    title: "Choose an easier base",
    copy: "Look for the exact beach segment, walking route and hotel facilities — not just the Sanur label.",
  },
  {
    href: "/nusa-penida-day-trip",
    image: "/scenes/sanur-harbor-handoff-illustrative.webp",
    alt: "Illustrative harbor-side road and traditional boats in Sanur at morning",
    label: "Ferry handoff",
    title: "Start with the transfer",
    copy: "If an island connection shapes the day, confirm the operator, departure point and return plan separately.",
  },
] as const;

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

      <section className="guide-section" aria-labelledby="sanur-visual-choices">
        <div className="visual-first-heading-row">
          <div>
            <p className="eyebrow">Choose the shape of the day</p>
            <h2 id="sanur-visual-choices">Start with the Sanur that fits</h2>
          </div>
          <p>These area-mood scenes are illustrative, not photos of named hotels, beaches or ferry operators. Use them to choose the decision; use the guides below to verify the details.</p>
        </div>
        <div className="visual-choice-grid visual-choice-grid-three">
          {visualChoices.map((choice) => (
            <Link key={choice.href} href={choice.href} className="visual-choice-card">
              <Image
                src={choice.image}
                alt={choice.alt}
                fill
                loading="lazy"
                sizes="(max-width: 759px) 100vw, (max-width: 1199px) 33vw, 360px"
                className="object-cover transition duration-700"
              />
              <div className="visual-choice-card-copy">
                <span>{choice.label}</span>
                <h3>{choice.title}</h3>
                <p>{choice.copy}</p>
                <strong>Open the guide →</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <DecisionRail area="sanur" areaLabel="Sanur" />

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
        <h2>Compare north, central and south Sanur</h2>
        <p className="guide-lede">Sanur changes by exact location. Start with the part of the coast that fits your trip, then choose the hotel or restaurant.</p>
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead><tr><th scope="col">Zone</th><th scope="col">Use it for this decision</th></tr></thead>
            <tbody>
              <tr><th scope="row">Central Sanur</th><td>The practical default if you want to stay near the main Sanur rhythm.</td></tr>
              <tr><th scope="row">South Sanur</th><td>A quieter, more resort-led stay.</td></tr>
              <tr><th scope="row">North Sanur</th><td>Classic Sanur and harbour-side logistics; check the exact hotel name and route before booking.</td></tr>
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
