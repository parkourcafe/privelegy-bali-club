import Link from "next/link";
import { getCangguPlan, getRoutes } from "@/lib/data";
import PlanView from "./PlanView";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [plan, routes] = await Promise.all([getCangguPlan(), getRoutes()]);

  return (
    <main className="site-shell">
      <header className="hero-grid">
        <div>
          <div className="flex items-start justify-between">
            <p className="topline">
              Canggu · perks map
            </p>
            <Link href="/me" className="quiet-link">
              My perks →
            </Link>
          </div>
          <h1 className="hero-title mt-3">Your Canggu day</h1>
          <p className="hero-copy">
            Hand-picked spots, morning to night, each with a real perk and a
            clear reason to go.
          </p>
          <div className="hero-actions">
            <Link href="#routes" className="button-primary button-large">
              Pick a route
            </Link>
            <Link href="#guide" className="button-secondary button-large">
              Browse spots
            </Link>
            <p className="hero-note">No signup. Just show the screen at the venue.</p>
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
        <PlanView plan={plan} />
      </section>

      <footer className="mt-16 border-t border-[var(--line)] pt-6 text-xs text-[var(--muted)]">
        Free to use. We earn from venues only when a reservation made through us
        becomes a real seated visit — never from you.
      </footer>
    </main>
  );
}
