import type { Metadata } from "next";
import Link from "next/link";
import PlacesView, { type CataloguePlace } from "@/app/places/PlacesView";
import { getDeveloperPhotoSiteCatalogue } from "@/lib/developer-photo-review";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Photo-complete site preview · Other Bali",
  robots: { index: false, follow: false, nocache: true },
};

export default async function DeveloperPhotoSite() {
  const catalogue = await getDeveloperPhotoSiteCatalogue();

  return (
    <div className="page-dark">
      <main className="site-shell">
        <div className="mb-5 rounded-xl border border-[var(--ob-brass)]/40 bg-[var(--ob-brass)]/10 px-4 py-3 text-sm text-[var(--ob-sand)]">
          <strong>Private final-site preview.</strong> Candidate photos are rendered in the real catalogue cards and venue layouts. Public visitor pages are unchanged.
        </div>

        <header className="hero-grid">
          <div>
            <div className="flex items-start justify-between">
              <Link href="/" className="topline">← Other Bali</Link>
              <span className="quiet-link">Photo-complete version</span>
            </div>
            <h1 className="hero-title mt-3">Places across Bali</h1>
            <p className="hero-copy">
              A curated map of Bali by district. Every candidate venue is shown here with the photography prepared for owner review.
            </p>
          </div>
          <div className="editorial-signal" role="group" aria-label="Photo preview coverage">
            <p className="editorial-signal-label">
              {catalogue.venues.length} places · {catalogue.totalCandidates} photos
            </p>
          </div>
        </header>

        <p className="mb-6 text-sm text-[var(--muted)]">
          {catalogue.venuesWithCandidates} venues have prepared photo covers. {catalogue.venuesWithoutCandidates} venues still use the designed category cover because no candidate image was found.
        </p>

        {catalogue.unavailableCovers > 0 && (
          <p className="mb-6 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
            {catalogue.unavailableCovers} prepared cover previews are temporarily unavailable. Reload once to renew signed image links.
          </p>
        )}

        <PlacesView
          venues={catalogue.venues as CataloguePlace[]}
          detailBasePath="/developer/site"
          previewMode
        />

        <footer className="mt-16 border-t border-[var(--line)] pt-6 text-xs text-[var(--muted)]">
          <p>Private photo-complete preview. No candidate image is published by viewing this page.</p>
        </footer>
      </main>
    </div>
  );
}
