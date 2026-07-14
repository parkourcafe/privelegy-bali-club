import type { Metadata } from "next";
import Link from "next/link";
import { formatMenuDate } from "@/components/menu/menu-model";
import { getPublicMenuSummaries } from "@/lib/data/menu-repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bali restaurant menus — official-source snapshots",
  description:
    "Browse available Bali restaurant menu information with official sources, capture dates and clear full-versus-partial labels.",
  alternates: { canonical: "/menus" },
};

export default async function MenusPage() {
  const menus = await getPublicMenuSummaries();
  const verified = menus.filter((menu) => menu.status === "published").length;
  const snapshots = menus.filter((menu) => menu.status === "source_snapshot").length;

  return (
    <div className="page-dark">
      <main className="site-shell">
        <header className="hero-grid">
          <div>
            <div className="flex items-start justify-between gap-4">
              <Link href="/" className="topline">← Other Bali</Link>
              <Link href="/places" className="quiet-link">Places →</Link>
            </div>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--lagoon-strong)]">
              Official-source menu library
            </p>
            <h1 className="hero-title mt-3">Menus across Bali</h1>
            <p className="hero-copy">
              Full verified menus and clearly labelled partial source snapshots. Every entry links to its source and says when the information was captured.
            </p>
          </div>
          <div className="editorial-signal" aria-label="Public menu coverage">
            <p className="editorial-signal-label">{menus.length} available menus</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{verified} verified full · {snapshots} partial snapshots</p>
          </div>
        </header>

        {menus.length ? (
          <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Available restaurant menus">
            {menus.map((menu) => {
              const captured = formatMenuDate(menu.capturedAt);
              const expires = formatMenuDate(menu.expiresAt);
              const snapshot = menu.status === "source_snapshot";
              return (
                <article key={menu.id} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lagoon-strong)]">
                    {snapshot ? "Partial source snapshot" : "Verified full menu"}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-[var(--ink)]">{menu.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {snapshot ? "Selected items, not the complete menu." : "Full menu checked against the named source."}
                    {captured ? ` Captured ${captured}.` : ""}
                    {expires ? ` Recheck by ${expires}.` : ""}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link href={`/menus/${menu.venueSlug}`} className="button-secondary">View menu</Link>
                    <a href={menu.sourceUrl} target="_blank" rel="noreferrer" className="quiet-link">Official source ↗</a>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <section className="menu-state mt-10">
            <p className="menu-state-kicker">Menu library update</p>
            <h2>Public menu snapshots are being prepared</h2>
            <p>Use the places catalogue while the source-labelled menu index is refreshed.</p>
            <Link href="/places" className="button-secondary mt-4">Browse places</Link>
          </section>
        )}

        <footer className="mt-16 border-t border-[var(--line)] pt-6 text-xs text-[var(--muted)]">
          <p>Partial snapshots are informational extracts. Always confirm allergies, prices and availability directly with the venue.</p>
        </footer>
      </main>
    </div>
  );
}
