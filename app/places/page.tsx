import Link from "next/link";
import { getPublishedVenues } from "@/lib/data";
import PlacesView from "./PlacesView";

export const dynamic = "force-dynamic";

export const metadata = { title: "Places" };

function firstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function PlacesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string | string[];
    district?: string | string[];
    category?: string | string[];
    intent?: string | string[];
  }>;
}) {
  const [venues, params] = await Promise.all([getPublishedVenues(), searchParams]);

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

        <PlacesView
          venues={venues}
          initialFilters={{
            query: firstParam(params.q),
            district: firstParam(params.district),
            category: firstParam(params.category),
            intentMode: firstParam(params.intent) === "1",
          }}
        />

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
            <Link href="/support" className="quiet-link">
              Support
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
