import Link from "next/link";
import { getPublishedVenues } from "@/lib/data";
import PlacesView from "./PlacesView";

export const dynamic = "force-dynamic";

export const metadata = { title: "Places" };

export default async function PlacesPage() {
  const venues = await getPublishedVenues();

  return (
    <div className="page-dark">
      <main className="site-shell">
        <header className="hero-grid">
          <div>
            <div className="flex items-start justify-between">
              <Link href="/" className="topline">
                ← Other Bali
              </Link>
              <Link href="/plan" className="quiet-link">
                Canggu day →
              </Link>
            </div>
            <h1 className="hero-title mt-3">Places across Bali</h1>
            <p className="hero-copy">
              A working editorial map of places we are tracking now across
              Bali. Offers appear only when venues confirm them.
            </p>
          </div>
          <div className="editorial-signal" aria-label="Bali places signal">
            <p className="editorial-signal-label">
              {venues.length} places in the planning layer.
            </p>
          </div>
        </header>

        <PlacesView venues={venues} />

        <footer className="mt-16 border-t border-[var(--line)] pt-6 text-xs text-[var(--muted)]">
          <p>
            Planning-only districts do not have QR redemption, paid placement,
            or reservation monetization.
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
    </div>
  );
}
