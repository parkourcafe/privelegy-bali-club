import Link from "next/link";
import type { VenueWithPerk } from "@/lib/data";
import ReserveButton from "@/components/ReserveButton";
import SimilarPlaces from "@/components/SimilarPlaces";
import VenueVisual from "@/components/VenueVisual";
import TrackedDirectionsLink from "@/components/TrackedDirectionsLink";
import { googleMapsHandoffLabel } from "@/lib/external-links";

// Presentational venue card — shared by the planning grid and route pages.

const categoryLabel: Record<string, string> = {
  cafe: "Café",
  warung: "Warung",
  restaurant: "Restaurant",
  beach_club: "Beach club",
  spa: "Spa",
  fitness: "Fitness",
  yoga: "Yoga",
  beauty: "Beauty",
  bar: "Bar",
  surf: "Surf",
};

export default function VenueCard({
  v,
  showActions = true,
  showSimilar = true,
  actionMode,
  linkToPage = true,
}: {
  v: VenueWithPerk;
  showActions?: boolean;
  showSimilar?: boolean;
  actionMode?: "full" | "directions" | "none";
  // Public cards link to the full place by default. Internal previews may opt
  // out explicitly, but planner and route cards must never become dead ends.
  linkToPage?: boolean;
}) {
  const resolvedActionMode = showActions ? actionMode ?? "full" : "none";
  const mapsLabel = googleMapsHandoffLabel(v.gmapsUrl);

  return (
    <article className="venue-card">
      <VenueVisual name={v.name} category={v.category} photoUrl={v.photoUrl} />
      <div className="venue-card-body">
        <div className="flex items-center gap-2">
          <h3 className="venue-name">
            {linkToPage ? (
              <Link href={`/places/${v.slug}`} className="hover:underline">
                {v.name}
              </Link>
            ) : (
              v.name
            )}
          </h3>
          {v.isSponsored && (
            <span className="rounded-full bg-[rgba(184,138,66,0.16)] px-2 py-0.5 text-[10px] font-bold text-[var(--clay)]">
              Sponsored
            </span>
          )}
        </div>
        <p className="venue-meta">
          {categoryLabel[v.category] ?? v.category}
          {v.area ? ` · ${v.area}` : ""} · {v.address}
        </p>

        {v.vibeTags && v.vibeTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {v.vibeTags.map((t) => (
              <span key={t} className="rounded-full bg-[rgba(98,118,87,0.13)] px-2 py-0.5 text-[11px] font-semibold text-[var(--moss)]">
                {t}
              </span>
            ))}
          </div>
        )}

        {v.blurb && <p className="venue-copy">{v.blurb}</p>}

        {v.whyItsHere && <p className="why-here">{v.whyItsHere}</p>}

        {/* Fit context (master §6): WHO/WHEN a place suits — never quality
            warnings (guardrail #7). */}
        {(v.bestFor || v.notFor) && (
          <div className="fit-context">
            {v.bestFor && (
              <p className="fit-best">
                <span className="font-semibold">Best for:</span> {v.bestFor}
              </p>
            )}
            {v.notFor && (
              <p className="fit-not">
                <span className="font-semibold">Not for:</span> {v.notFor}
              </p>
            )}
          </div>
        )}

        {/* Owner's own words (UGC) — always attributed, kept visually apart
            from the editorial voice (why_its_here). Clamped on cards; full
            text stays in the DOM. */}
        {v.ownerNote && (
          <figure className="mt-2 border-l-2 border-[var(--line)] pl-3">
            <blockquote className="line-clamp-4 text-sm italic text-[var(--muted)]">
              {v.ownerNote}
            </blockquote>
            <figcaption className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
              From the owner
            </figcaption>
          </figure>
        )}

        {v.practicalTags && v.practicalTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {v.practicalTags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--line)] px-2 py-0.5 text-[11px] font-semibold text-[var(--muted)]"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {v.whatToOrder && (
          <p className="mt-2 text-sm text-[var(--muted)]">
            <span className="font-medium">What to order:</span> {v.whatToOrder}
          </p>
        )}
        {v.priceAnchor && <p className="mt-1 text-xs text-[var(--muted)]">{v.priceAnchor}</p>}

        {v.perk && (
          <div className="perk-strip">
            <p className="perk-title">{v.perk.title}</p>
            <p className="perk-terms">{v.perk.terms}</p>
          </div>
        )}

        {resolvedActionMode !== "none" && (
          <div className="action-row">
            {v.gmapsUrl && mapsLabel ? (
              <TrackedDirectionsLink
                href={v.gmapsUrl}
                venueSlug={v.slug}
                className="button-secondary"
              >
                {mapsLabel}
              </TrackedDirectionsLink>
            ) : null}
            {resolvedActionMode === "full" && (
              <>
                <ReserveButton
                  venueSlug={v.slug}
                  tablepilotSlug={v.tablepilotSlug}
                  whatsapp={undefined}
                  perkTitle={v.perk?.title}
                />
                {v.perk && (
                  <span className="text-xs text-[var(--muted)]">
                    Scan the venue&apos;s counter QR to redeem
                  </span>
                )}
              </>
            )}
          </div>
        )}

        {showSimilar && <SimilarPlaces venue={v} />}
      </div>
    </article>
  );
}
