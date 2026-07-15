import Link from "next/link";
import { getDeveloperPhotoReviewPage } from "@/lib/developer-photo-review";

export const dynamic = "force-dynamic";

function valueOf(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function pageHref(page: number, query: string): string {
  const params = new URLSearchParams({ page: String(page) });
  if (query) params.set("q", query);
  return `/developer/photo-review?${params.toString()}`;
}

export default async function DeveloperPhotoReview({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = valueOf(params.q);
  const page = Number.parseInt(valueOf(params.page), 10) || 1;
  const review = await getDeveloperPhotoReviewPage({ page, query });

  return (
    <main className="min-h-screen bg-[#16100c] px-4 py-8 text-[#f4ece0] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e2ba79]">
          Other Bali · private developer review
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">All uploaded photos</h1>
            <p className="mt-2 text-sm text-[#cdbfa9]">
              {review.totalCandidates} photos across {review.totalVenues} venues
              {review.query ? " matching this search" : ""}. Nothing on this page is public.
            </p>
          </div>
          <span className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-[#cdbfa9]">
            Page {review.page} of {review.pageCount}
          </span>
        </div>

        <form className="mt-6 flex max-w-2xl gap-2" action="/developer/photo-review">
          <input
            type="search"
            name="q"
            defaultValue={review.query}
            placeholder="Search venue name or slug"
            className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#e2ba79]"
          />
          <button className="rounded-xl bg-[#c69a5c] px-5 py-3 text-sm font-semibold text-[#16100c]">
            Search
          </button>
          {review.query && (
            <Link href="/developer/photo-review" className="rounded-xl border border-white/15 px-4 py-3 text-sm">
              Clear
            </Link>
          )}
        </form>

        {review.unavailableCandidates > 0 && (
          <p className="mt-5 rounded-xl border border-rose-300/30 bg-rose-300/10 p-3 text-sm text-rose-100">
            {review.unavailableCandidates} images on this page could not receive a private preview URL. Refresh once; if it remains, check storage.
          </p>
        )}

        <div className="mt-8 space-y-10">
          {review.venues.map((venue) => (
            <section key={venue.slug} id={venue.slug} className="scroll-mt-6">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <h2 className="font-display text-2xl font-semibold">{venue.name}</h2>
                  <p className="mt-1 font-mono text-xs text-[#8c8175]">{venue.slug}</p>
                </div>
                <span className="text-xs text-[#cdbfa9]">{venue.candidates.length} photos</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {venue.candidates.map((candidate, index) => (
                  <figure key={candidate.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#201811] shadow-2xl">
                    <div className="aspect-[4/3] overflow-hidden bg-black/30">
                      {/* Private signed URLs expire quickly and should bypass the public image optimizer/cache. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={candidate.previewUrl}
                        alt={`${venue.name} candidate ${index + 1}`}
                        className="size-full object-cover transition duration-300 hover:scale-[1.02]"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <figcaption className="flex items-center justify-between gap-3 px-3 py-2.5 text-xs text-[#cdbfa9]">
                      <span>Photo {index + 1} · {candidate.width}×{candidate.height}</span>
                      <a
                        href={candidate.sourcePageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 text-[#e2ba79] hover:underline"
                      >
                        Source ↗
                      </a>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          ))}
        </div>

        {review.venues.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-white/20 p-10 text-center text-[#cdbfa9]">
            No venues match this search.
          </div>
        )}

        <nav className="mt-12 flex items-center justify-between border-t border-white/10 pt-6" aria-label="Photo review pages">
          {review.page > 1 ? (
            <Link href={pageHref(review.page - 1, review.query)} className="rounded-xl border border-white/15 px-4 py-2.5 text-sm hover:bg-white/5">
              ← Previous
            </Link>
          ) : <span />}
          <span className="text-xs text-[#8c8175]">10 venues per page</span>
          {review.page < review.pageCount ? (
            <Link href={pageHref(review.page + 1, review.query)} className="rounded-xl bg-[#c69a5c] px-4 py-2.5 text-sm font-semibold text-[#16100c]">
              Next →
            </Link>
          ) : <span />}
        </nav>
      </div>
    </main>
  );
}
