import type { Metadata } from "next";
import Link from "next/link";
import PlacesView, { type CataloguePlace } from "@/app/places/PlacesView";
import { getDeveloperPhotoSiteCatalogue } from "@/lib/developer-photo-review";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Photo-complete places · Other Bali",
  robots: { index: false, follow: false, nocache: true },
};

export default async function RestaurateurPlacesPreview() {
  const catalogue = await getDeveloperPhotoSiteCatalogue();

  return (
    <div className="page-dark">
      <main className="site-shell">
        <div className="mb-5 rounded-xl border border-[var(--ob-brass)]/40 bg-[var(--ob-brass)]/10 px-4 py-3 text-sm text-[var(--ob-sand)]">
          <strong>Private restaurateur preview.</strong> This is the live production catalogue with the prepared candidate photography layered onto matching venues. Nothing here changes the public cards.
        </div>

        <header className="hero-grid">
          <div>
            <div className="flex items-start justify-between">
              <Link href="/developer/site" className="topline">← Full site</Link>
              <span className="quiet-link">Photo review version</span>
            </div>
            <h1 className="hero-title mt-3">Places across Bali</h1>
            <p className="hero-copy">
              The current production catalogue, with every available review photo shown in its real card and venue layout.
            </p>
          </div>
          <div className="editorial-signal" role="group" aria-label="Photo preview coverage">
            <p className="editorial-signal-label">
              {catalogue.venues.length} live places · {catalogue.totalCandidates} review photos
            </p>
          </div>
        </header>

        <p className="mb-6 text-sm text-[var(--muted)]">
          {catalogue.venuesWithCandidates} live places have a prepared candidate cover. The other {catalogue.venuesWithoutCandidates} keep their current production photo or designed category art.
        </p>

        {catalogue.unavailableCovers > 0 && (
          <p className="mb-6 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
            {catalogue.unavailableCovers} prepared covers could not be signed for this request. Reload once to renew the private links.
          </p>
        )}

        <PlacesView
          venues={catalogue.venues as CataloguePlace[]}
          detailBasePath="/developer/site"
          previewMode
        />
      </main>
    </div>
  );
}
