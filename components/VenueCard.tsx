import Link from "next/link";
import type { VenueWithPerk } from "@/lib/data";
import ReserveButton from "@/components/ReserveButton";
import SimilarPlaces from "@/components/SimilarPlaces";
import VenueVisual from "@/components/VenueVisual";
import TrackedDirectionsLink from "@/components/TrackedDirectionsLink";

// Presentational venue card — shared by the planning grid and route pages.

const categoryLabel: Record<string, string> = {
  cafe: "Café",
  warung: "Warung",
  restaurant: "Restaurant",
  beach_club: "Beach club",
  spa: "Spa",
  bar: "Bar",
  surf: "Surf",
};

export default function VenueCard({
  v,
  showActions = true,
  showSimilar = true,
}: {
  v: VenueWithPerk;
  showActions?: boolean;
  showSimilar?: boolean;
}) {
  return (
    <article className="venue-card">
      <VenueVisual name={v.name} category={v.category} photoUrl={v.photoUrl} />
      <div className="venue-card-body">
        <div className="flex items-center gap-2">
          <h3 className="venue-name">{v.name}</h3>
          {v.isSponsored && (
            <span className="rounded-full bg-[rgba(184,138,66,0.16)] px-2 py-0.5 text-[10px] font-bold text-[var(--clay)]">
              Sponsored
            </span>
          )}
        </div>
        <p className="venue-meta">
          {categoryLabel[v.category] ?? v.category} · {v.address}
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

        {showActions && (
          <div className="action-row">
            <TrackedDirectionsLink
              href={v.gmapsUrl}
              venueSlug={v.slug}
              className="button-secondary"
            >
              Directions
            </TrackedDirectionsLink>
            <ReserveButton
              venueSlug={v.slug}
              tablepilotSlug={v.tablepilotSlug}
              whatsapp={v.whatsapp}
              perkTitle={v.perk?.title}
            />
            {v.perk && (
              <Link
                href={`/v/${v.slug}/redeem`}
                className="button-primary"
              >
                Show offer
              </Link>
            )}
          </div>
        )}

        {showSimilar && <SimilarPlaces venue={v} />}
      </div>
    </article>
  );
}
