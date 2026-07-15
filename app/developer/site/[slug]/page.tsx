import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeveloperPhotoSiteVenue } from "@/lib/developer-photo-review";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Venue photo preview · Other Bali",
  robots: { index: false, follow: false, nocache: true },
};

const categoryLabel: Record<string, string> = {
  cafe: "Café",
  warung: "Warung",
  restaurant: "Restaurant",
  beach_club: "Beach club",
  spa: "Wellness",
  beauty: "Beauty & salon",
  fitness: "Fitness",
  yoga: "Yoga",
  bar: "Bar",
  surf: "Surf",
};

const districtLabel: Record<string, string> = {
  canggu: "Canggu",
  ubud: "Ubud",
  seminyak: "Seminyak",
  "kuta-legian": "Kuta & Legian",
  jimbaran: "Jimbaran",
  "uluwatu-bukit": "Uluwatu",
  "nusa-dua": "Nusa Dua",
  sanur: "Sanur",
};

export default async function DeveloperVenuePhotoSite({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getDeveloperPhotoSiteVenue(slug);
  if (!result) notFound();
  const { venue, candidates } = result;
  const category = categoryLabel[venue.category] ?? venue.category;
  const district = districtLabel[venue.district] ?? venue.district;
  const kicker = [category, venue.area, district].filter(Boolean).join(" · ");

  return (
    <div className="venue-page-pad">
      <main className="site-shell">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/developer/site" className="topline">← All places</Link>
          <span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--muted)]">
            Private final-site preview · {candidates.length} photos
          </span>
        </div>

        <header className={`venue-masthead ob-grain${candidates[0] ? " has-photo" : ` type-cover-${venue.category}`}`}>
          {candidates[0] && (
            // Private signed URL: keep it outside the public optimizer/cache.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="venue-masthead-photo"
              src={candidates[0].previewUrl}
              alt={`${venue.name} — ${category}`}
              fetchPriority="high"
            />
          )}
          <div className="venue-masthead-inner">
            <p className="venue-masthead-kicker">{kicker}</p>
            <h1 className="venue-masthead-title">{venue.name}</h1>
            {venue.whyItsHere && <p className="venue-masthead-verdict">{venue.whyItsHere}</p>}
          </div>
        </header>

        <div className="venue-detail-grid">
          <div>
            <section className="guide-section" style={{ marginTop: 0 }}>
              <h2>Photos</h2>
              <p className="guide-lede">
                {candidates.length > 0
                  ? "The complete photo set prepared for this venue."
                  : "No candidate photo was found for this venue yet; the designed category cover remains in place."}
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {candidates.map((candidate, index) => (
                  <figure key={candidate.id} className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--paper-soft)] shadow-[var(--shadow-soft)]">
                    <div className="aspect-[4/3] overflow-hidden bg-[var(--paper-warm)]">
                      {/* Private signed URL: keep it outside the public optimizer/cache. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={candidate.previewUrl}
                        alt={`${venue.name} photo ${index + 1}`}
                        className="size-full object-cover"
                        loading={index === 0 ? "eager" : "lazy"}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </figure>
                ))}
              </div>
            </section>

            {venue.whyItsHere && (
              <section className="guide-section">
                <h2>Why it&apos;s here</h2>
                <div className="guide-prose"><p>{venue.whyItsHere}</p></div>
              </section>
            )}

            {venue.whatToOrder && (
              <section className="guide-section">
                <h2>What to order</h2>
                <div className="guide-prose"><p>{venue.whatToOrder}</p></div>
              </section>
            )}

            {venue.ownerNote && (
              <section className="guide-section">
                <h2>From the owner</h2>
                <figure className="owner-voice">
                  <blockquote>{venue.ownerNote}</blockquote>
                  <figcaption>In the owner&apos;s own words</figcaption>
                </figure>
              </section>
            )}
          </div>

          <aside className="venue-detail-aside">
            <div className="quick-block">
              <h2>The quick read</h2>
              <dl>
                {venue.bestFor && <div><dt>Best for</dt><dd>{venue.bestFor}</dd></div>}
                {venue.notFor && <div><dt>Not for</dt><dd>{venue.notFor}</dd></div>}
                {venue.vibeTags?.length ? <div><dt>Vibe</dt><dd>{venue.vibeTags.join(" · ")}</dd></div> : null}
              </dl>
            </div>
            <div className="quick-block mt-4">
              <h2>Practical</h2>
              <dl className="practical-list">
                {venue.address && <div><dt>Where</dt><dd>{venue.address}</dd></div>}
                {venue.priceAnchor && <div><dt>Spend</dt><dd>{venue.priceAnchor}</dd></div>}
                {venue.practicalTags?.length ? <div><dt>Good to know</dt><dd>{venue.practicalTags.join(" · ")}</dd></div> : null}
              </dl>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
