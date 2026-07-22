import type { Venue } from "@/lib/types";
import PlaceCover from "@/components/PlaceCover";
import VenueImage from "@/components/VenueImage";
import { buildTablePilotReservationUrl } from "@/lib/integrations/tablepilot";
import {
  TrackedDirectionLink,
  TrackedPlaceLink,
  TrackedReservationLink,
} from "@/components/PlaceCardActions";
import { venueCategoryLabel } from "@/lib/venue-presentation";
import { googleMapsHandoffLabel } from "@/lib/external-links";

// Editorial place card (brief §9). Decision-first: image or typographic
// cover, name, category · micro-area, ONE editorial sentence, Best for,
// verified price band, View place. Everything else lives on the venue page.
//
// Interaction: the title link stretches over the card (CSS ::after), so the
// whole card is clickable without nested interactive elements; the secondary
// action sits above it (z-index). Sponsored is labeled and never reorders
// anything (guardrail #6).

export interface PlaceCardData {
  slug: string;
  name: string;
  category: Venue["category"];
  microArea?: string;
  editorialLine?: string;
  bestFor?: string;
  priceBand?: string;
  photoUrl?: string;
  isSponsored?: boolean;
  gmapsUrl?: string;
  // Canggu money loop: when set, the card keeps a Reserve secondary CTA —
  // the TablePilot handoff (guardrail #3) stays one tap from the catalogue.
  tablepilotSlug?: string;
  coverageMode?: "active_deep" | "next_deep" | "planning_only";
  // Confirmed offer exists — shown as a hint only; terms live on the page.
  hasOffer?: boolean;
}

export default function PlaceCard({
  place,
  secondaryAction = "directions",
}: {
  place: PlaceCardData;
  secondaryAction?: "directions" | "none";
}) {
  const href = `/places/${place.slug}`;
  const tablepilotHref = place.coverageMode === "active_deep" && place.tablepilotSlug
    ? buildTablePilotReservationUrl(
        place.tablepilotSlug,
        process.env.NEXT_PUBLIC_TABLEPILOT_URL,
      )
    : null;

  return (
    <article className="place-card">
      <div className="place-card-media">
        {place.photoUrl ? (
          <VenueImage
            src={place.photoUrl}
            alt={`${place.name} — ${venueCategoryLabel(place.category)}`}
            variant="card"
            fallback={<PlaceCover name={place.name} category={place.category} />}
          />
        ) : (
          <PlaceCover name={place.name} category={place.category} />
        )}
      </div>

      <div className="place-card-body">
        <p className="place-card-eyebrow">
          <span>
            {venueCategoryLabel(place.category)}
            {place.microArea ? ` · ${place.microArea}` : ""}
          </span>
          {place.isSponsored && <span className="sponsored-label">Sponsored</span>}
        </p>

        <h3 className="place-card-name">
          <TrackedPlaceLink
            href={href}
            venueSlug={place.slug}
          >
            {place.name}
          </TrackedPlaceLink>
        </h3>

        {place.editorialLine && (
          <p className="place-card-line">{place.editorialLine}</p>
        )}

        {place.bestFor && (
          <p className="place-card-fit">
            <strong>Best for:</strong> {place.bestFor}
          </p>
        )}

        <div className="place-card-foot">
          <span className="place-card-price">
            {place.priceBand ?? ""}
            {place.hasOffer ? (
              <span className="ml-2 text-[var(--lagoon-strong)]">Confirmed offer</span>
            ) : null}
          </span>
          <div className="place-card-actions">
            {tablepilotHref ? (
              <TrackedReservationLink
                href={tablepilotHref}
                venueSlug={place.slug}
                className="place-card-cta"
              >
                Reserve
              </TrackedReservationLink>
            ) : (
              secondaryAction === "directions" &&
              place.gmapsUrl && (
                <TrackedDirectionLink
                  href={place.gmapsUrl}
                  venueSlug={place.slug}
                  className="place-card-cta"
                >
                  {googleMapsHandoffLabel(place.gmapsUrl) ?? "Open in Maps"}
                </TrackedDirectionLink>
              )
            )}
            <TrackedPlaceLink
              href={href}
              venueSlug={place.slug}
              className="place-card-cta"
            >
              View place →
            </TrackedPlaceLink>
          </div>
        </div>
      </div>
    </article>
  );
}
