import type { Metadata } from "next";
import Link from "next/link";
import BrandHomeLink from "@/components/BrandHomeLink";
import { GuideFooter } from "@/components/GuideBlocks";
import { GuideHeroMedia, GuideSectionMedia } from "@/components/GuideMedia";
import { getCangguPlan, getRoutes } from "@/lib/data";
import PlanView from "../PlanView";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Plan your Bali trip",
  description:
    "Start a Bali trip plan from published itineraries, ready-made routes and the Canggu day-builder pilot. Free; travellers never pay.",
  alternates: { canonical: "/plan" },
  openGraph: {
    title: "Plan your Bali trip · Other Bali",
    description:
      "Future-trip planning for Bali: itineraries, ready-made routes and a Canggu day-builder pilot.",
    url: "https://www.otherbali.com/plan",
    type: "website",
  },
};

const TRIP_GUIDES = [
  {
    href: "/bali-itinerary-3-days",
    title: "Bali in 3 days",
    body: "A short trip without trying to see everything.",
  },
  {
    href: "/bali-itinerary-5-days",
    title: "Bali in 5 days",
    body: "Choose a base, add one or two realistic day trips.",
  },
  {
    href: "/bali-itinerary-7-days",
    title: "Bali in 7 days",
    body: "A fuller first-trip plan with enough room to slow down.",
  },
  {
    href: "/where-to-stay-in-bali",
    title: "Choose your base",
    body: "Compare areas before you lock the shape of the trip.",
  },
];

// Future planning surface. It shows published trip guides and route records
// first. The current interactive planner underneath is explicitly framed as a
// Canggu active-deep pilot so it no longer competes with /my-day (Today).
export default async function Plan({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const [{ m }, plan, allRoutes] = await Promise.all([
    searchParams,
    getCangguPlan(),
    getRoutes(),
  ]);
  const routes = allRoutes;

  return (
    <div className="page-dark">
    <main className="site-shell">
      <header className="hero-grid">
        <div>
          <div className="flex items-start justify-between">
            <BrandHomeLink />
            <Link href="/me" className="quiet-link">
              My Bali →
            </Link>
          </div>
          <p className="topline mt-3">Plan · Future trip planning</p>
          <h1 className="hero-title mt-2">Plan your Bali trip</h1>
          <p className="hero-copy">
            Use this when you are planning ahead: choose an itinerary, compare
            areas, then save routes or places into one trip. If you need a
            decision for right now, use Today instead.
          </p>
          <div className="hero-actions">
            <Link href="#trip-guides" className="button-primary button-large">
              Start with trip length
            </Link>
            <Link href="#routes" className="button-secondary button-large">
              Browse ready-made routes
            </Link>
            <Link href="/my-day" className="button-secondary button-large">
              Need today instead?
            </Link>
            <p className="hero-note">No signup. Planning stays separate from paid placement.</p>
          </div>
        </div>
        <div className="editorial-signal" aria-label="Plan page role">
          <p className="editorial-signal-label">
            Future trip → itinerary → routes → saved plan.
          </p>
        </div>
        <div className="lg:col-span-2">
          <GuideHeroMedia seed="plan bali trip itineraries routes" />
        </div>
      </header>

      <section id="trip-guides" className="scroll-mt-8">
        <h2 className="topline">Trip planning starters</h2>
        <GuideSectionMedia seed="plan bali trip length guides" index={0} />
        <div className="related-guides mt-4">
          {TRIP_GUIDES.map((guide) => (
            <Link key={guide.href} href={guide.href} className="related-guide-card">
              <h3>{guide.title}</h3>
              <p>{guide.body}</p>
            </Link>
          ))}
        </div>
      </section>

      {routes.length > 0 && (
        <section id="routes" className="scroll-mt-8">
          <h2 className="topline">Ready-made routes</h2>
          <GuideSectionMedia seed="plan ready made routes bali" index={1} />
          <div className="route-strip">
            {routes.map((r) => (
              <Link
                key={r.slug}
                href={`/route/${r.slug}`}
                className="route-card"
              >
                <p className="route-card-title">{r.title}</p>
                {r.subtitle && <p className="route-card-meta">{r.subtitle}</p>}
                <p className="mt-5 text-sm font-bold text-[var(--lagoon-strong)]">
                  {r.stopCount} stops →
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section id="canggu-day-builder" className="scroll-mt-8">
        <p className="topline">Canggu active-deep pilot</p>
        <h2 className="section-title mt-2">Build a Canggu day</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          Canggu currently has the deepest operational coverage. This module is
          a pilot for arranging a day there; it does not mean the rest of Bali is
          missing from Explore or future planning.
        </p>
        <GuideSectionMedia seed="plan guide canggu places pilot" index={2} />
        <PlanView plan={plan} initialMoment={m} />
      </section>

      <p className="mt-16 border-t border-[var(--line)] pt-6 text-xs text-[var(--muted)]">
        Free to use. Organic planning order is not paid placement.
      </p>
    </main>
    <GuideFooter />
    </div>
  );
}
