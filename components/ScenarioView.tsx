import Link from "next/link";
import BrandHomeLink from "@/components/BrandHomeLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SCENARIOS, scenarioBriefHref, type Scenario } from "@/lib/scenarios";

const SITE = "https://www.otherbali.com";

// Presentational scenario page (master §6a.3). Uses the shared inner-page dark
// system (page-dark / site-shell / hero-*) so it reads as one product with
// /plan and /places, where its CTA funnels.
export default function ScenarioView({ scenario }: { scenario: Scenario }) {
  const briefHref = scenarioBriefHref(scenario.missionSlug);
  const others = SCENARIOS.filter((s) => s.slug !== scenario.slug);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: scenario.title,
      description: scenario.metaDescription,
      url: `${SITE}/${scenario.slug}`,
      about: scenario.eyebrow,
      isPartOf: { "@type": "WebSite", name: "Other Bali", url: SITE },
    },
  ];

  return (
    <div className="page-dark">
      <main className="site-shell">
        <header className="hero-grid">
          <div>
            <div className="flex items-start justify-between">
              <BrandHomeLink />
              <Link href="/places" className="quiet-link">
                All places →
              </Link>
            </div>
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: scenario.eyebrow }]} />
            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-[var(--lagoon-strong)]">
              {scenario.eyebrow}
            </p>
            <h1 className="hero-title mt-2">{scenario.title}</h1>
            <p className="hero-copy">{scenario.promise}</p>
            <p className="mt-3 text-sm text-[var(--muted)]">{scenario.intro}</p>
            <div className="hero-actions">
              <Link href={briefHref} className="button-primary button-large">
                {scenario.ctaLabel}
              </Link>
              <Link href="/plan" className="button-secondary button-large">
                Plan a Canggu day
              </Link>
              <p className="hero-note">
                Free to use. Offers appear only where venues confirm them.
              </p>
            </div>
          </div>
          <div className="editorial-signal" aria-label="Who this trip is for">
            <p className="editorial-signal-label">Who it&apos;s for</p>
            <p className="mt-2 text-sm text-[var(--ink)]">{scenario.forWho}</p>
            <p className="mt-3 text-xs text-[var(--muted)]">
              <span className="font-semibold">The worry we remove:</span>{" "}
              {scenario.fear}
            </p>
          </div>
        </header>

        <section className="slot-section">
          <ol className="mt-2 space-y-6">
            {scenario.sections.map((s, i) => (
              <li key={s.heading} className="flex gap-4">
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--lagoon)] text-xs font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h2 className="text-base font-semibold text-[var(--ink)]">
                    {s.heading}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8">
            <Link href={briefHref} className="button-primary button-large">
              {scenario.ctaLabel} →
            </Link>
          </div>
        </section>

        <section className="slot-section">
          <div className="slot-heading">
            <h2>Other kinds of trip</h2>
            <p>Pick the Bali that fits you.</p>
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            {others.map((s) => (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] px-4 py-3 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--lagoon)]"
              >
                {s.eyebrow}
                <span className="mt-0.5 block text-xs font-normal text-[var(--muted)]">
                  {s.promise}
                </span>
              </Link>
            ))}
          </div>
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
          </div>
        </footer>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
