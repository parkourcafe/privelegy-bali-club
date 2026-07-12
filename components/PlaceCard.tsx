"use client";

import Link from "next/link";
import type { Venue } from "@/lib/types";
import PlaceCover from "@/components/PlaceCover";
import { track } from "@/lib/analytics";

// Editorial place card (brief §9). Decision-first: image or typographic
// cover, name, category · micro-area, ONE editorial sentence, Best for,
// verified price band, View place. Everything else lives on the venue page.
//
// Interaction: the title link stretches over the card (CSS ::after), so the
// whole card is clickable without nested interactive elements; the secondary
// action sits above it (z-index). Sponsored is labeled and never reorders
// anything (guardrail #6).

const categoryLabel: Record<string, string> = {
  cafe: "Café",
  warung: "Warung",
  restaurant: "Restaurant",
  beach_club: "Beach club",
  spa: "Wellness",
  bar: "Bar",
  surf: "Surf",
};

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
  // Confirmed offer exists — shown as a hint only; terms live on the page.
  hasOffer?: boolean;
}

const TABLEPILOT_URL =
  process.env.NEXT_PUBLIC_TABLEPILOT_URL ?? "https://tablepilot-id.vercel.app";

// reservation_click is a partner-proof demand signal: internal store only,
// never GA4 (same contract as ReserveButton).
function logReservationClick(venueSlug: string) {
  fetch("/api/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "reservation_click", venueSlug }),
    keepalive: true,
  }).catch(() => {});
}

export default function PlaceCard({
  place,
  secondaryAction = "directions",
}: {
  place: PlaceCardData;
  secondaryAction?: "directions" | "none";
}) {
  const href = `/places/${place.slug}`;

  return (
    <article className="place-card">
      <div className="place-card-media">
        {place.photoUrl ? (
          // Venue-approved photo (uploaded by the owner during onboarding).
          // Plain img with a fixed aspect box (no CLS); remote hosts vary, so
          // next/image optimization is not safe here.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={place.photoUrl}
            alt={`${place.name} — ${categoryLabel[place.category] ?? place.category}`}
            loading="lazy"
          />
        ) : (
          <PlaceCover name={place.name} category={place.category} />
        )}
      </div>

      <div className="place-card-body">
        <p className="place-card-eyebrow">
          <span>
            {categoryLabel[place.category] ?? place.category}
            {place.microArea ? ` · ${place.microArea}` : ""}
          </span>
          {place.isSponsored && <span className="sponsored-label">Sponsored</span>}
        </p>

        <h3 className="place-card-name">
          <Link
            href={href}
            onClick={() => track("venue_card_click", { venueSlug: place.slug })}
          >
            {place.name}
          </Link>
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
            {place.tablepilotSlug ? (
              <a
                href={`${TABLEPILOT_URL}/book/${encodeURIComponent(place.tablepilotSlug)}?source=bali_privilege`}
                target="_blank"
                rel="noreferrer"
                className="place-card-cta"
                onClick={() => logReservationClick(place.slug)}
              >
                Reserve
              </a>
            ) : (
              secondaryAction === "directions" &&
              place.gmapsUrl && (
                <a
                  href={place.gmapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="place-card-cta"
                  onClick={() => track("direction_click", { venueSlug: place.slug })}
                >
                  Directions
                </a>
              )
            )}
            <span aria-hidden="true" className="place-card-cta">
              View place →
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
