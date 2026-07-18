import type { Metadata } from "next";
import Link from "next/link";
import BrandHomeLink from "@/components/BrandHomeLink";
import { getCangguPlan, getRoutes } from "@/lib/data";
import PlanView from "../PlanView";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Plan my Canggu day",
  description:
    "Build a Canggu day by the moment you're in — breakfast, work-friendly cafés, sunset, dinner. Curated picks with directions and confirmed offers. Free; travellers never pay.",
  alternates: { canonical: "/plan" },
  openGraph: {
    title: "Plan my Canggu day · Other Bali",
    description:
      "Build a Canggu day around your moment, with curated places, routes and practical handoffs.",
    url: "https://www.otherbali.com/plan",
    type: "website",
  },
};

// The working tourist tool. The cinematic landing at / funnels here; this page
// stays fast and one-handed. ?m=<moment> preselects a day scenario (static
// config, lib/moments.ts) so landing cards can deep-link into a filtered day.
export default async function Plan({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const [{ m }, plan, routes] = await Promise.all([
    searchParams,
    getCangguPlan(),
    getRoutes(),
  ]);

  return (
    <div className="page-dark">
    <main className="site-shell">
      <header className="hero-grid">
        <div>
          <div className="flex items-start justify-between">
            <BrandHomeLink />
            <Link href="/me" className="quiet-link">
              My offers →
            </Link>
          </div>
          <h1 className="hero-title mt-3">Your Canggu day</h1>
          <p className="hero-copy">
            The right place for the moment you&apos;re in. Hand-picked places,
            routes, and confirmed venue offers.
          </p>
          <div className="hero-actions">
            <Link href="#routes" className="button-primary button-large">
              Pick a route
            </Link>
            <Link href="#guide" className="button-secondary button-large">
              Browse places
            </Link>
            <Link href="/places" className="button-secondary button-large">
              All Bali places
            </Link>
            <p className="hero-note">No signup. Offers appear only where venues confirm them.</p>
          </div>
        </div>
        <div className="editorial-signal" aria-label="Canggu route collage">
          <p className="editorial-signal-label">From coffee to dinner, picked for the kind of day you&apos;re having.</p>
        </div>
      </header>

      {routes.length > 0 && (
        <section id="routes" className="scroll-mt-8">
          <h2 className="topline">Ready-made routes</h2>
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

      <section id="guide" className="scroll-mt-8">
        <PlanView plan={plan} initialMoment={m} />
      </section>

      <footer className="mt-16 border-t border-[var(--line)] pt-6 text-xs text-[var(--muted)]">
        <p>
          You do not pay us. Venues pay Other Bali only when a reservation made
          through us becomes a real seated visit.
        </p>
        <div className="mt-3 flex gap-4">
          <Link href="/privacy" className="quiet-link">
            Privacy
          </Link>
          <Link href="/terms" className="quiet-link">
            Terms
          </Link>
          <Link href="/support" className="quiet-link">
            Support
          </Link>
        </div>
      </footer>
    </main>
    </div>
  );
}
