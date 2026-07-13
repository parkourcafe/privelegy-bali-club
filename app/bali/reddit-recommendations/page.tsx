import type { Metadata } from "next";
import Link from "next/link";
import { REDDIT_REPORTS } from "@/lib/reddit-reports";

export const metadata: Metadata = {
  title: "Bali Recommendations from Reddit — Research Library",
  description: "Traveller recommendations from Reddit, organised by Bali area, restaurants, hotels, wellness, activities and island routes.",
  alternates: { canonical: "/bali/reddit-recommendations" },
};

export default function RedditRecommendationsPage() {
  return (
    <div className="page-dark">
      <main className="site-shell">
        <nav aria-label="Breadcrumb" className="text-xs text-[var(--muted)]">
          <Link href="/" className="quiet-link">Other Bali</Link> › <Link href="/bali" className="quiet-link">Bali</Link> › Reddit recommendations
        </nav>
        <header className="hero-grid mt-3">
          <div>
            <h1 className="hero-title">What travellers recommend on Reddit</h1>
            <p className="hero-copy mt-3">A structured research library of recurring traveller recommendations — including the disagreements, warnings and places people call overrated.</p>
          </div>
          <div className="editorial-signal"><p className="editorial-signal-label">Research completed 13 July 2026.</p></div>
        </header>

        <aside className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-5 text-sm leading-7 text-[var(--muted)]">
          <strong className="text-[var(--ink)]">How to read this:</strong> these are Reddit recommendation signals, not paid rankings and not proof that a venue is currently open. We preserve mixed opinions and link to source discussions. Opening status, hours, prices and safety details require a separate current check.
        </aside>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          {REDDIT_REPORTS.map((report) => (
            <Link key={report.slug} href={`/bali/reddit-recommendations/${report.slug}`} className="venue-card block p-5 transition-transform hover:-translate-y-0.5">
              <h2 className="venue-name">{report.title}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{report.description}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-[var(--lagoon-strong)]">Read the research →</span>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
