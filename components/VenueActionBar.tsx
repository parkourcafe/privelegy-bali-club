"use client";

import VenueActionPanel from "@/components/actions/VenueActionPanel";
import { resolveVenueActions } from "@/lib/actions/resolve-actions";
import type { VenueActionBarProps } from "@/lib/contracts/menu-action";
import { trackVenueAction } from "@/lib/analytics";

// The public place page on the frozen baseline still passes this shape. Keep the
// adapter until Session 4 wires Session 2's frozen VenueActionBarProps slot; the
// capability-driven path below is the new integration contract.
type LegacyVenueActionBarProps = {
  slug: string;
  gmapsUrl: string;
  bookHref: string | null;
  bookLabel: string;
  whatsapp?: string;
  isTablepilot: boolean;
};

function isLegacyProps(
  props: VenueActionBarProps | LegacyVenueActionBarProps
): props is LegacyVenueActionBarProps {
  return "slug" in props;
}

function LegacyVenueActionBar({
  slug,
  gmapsUrl,
  bookHref,
  bookLabel,
  whatsapp,
  isTablepilot,
}: LegacyVenueActionBarProps) {
  return (
    <nav className="venue-action-bar max-w-[100vw] overflow-hidden" aria-label="Quick actions">
      <a
        href={gmapsUrl}
        target="_blank"
        rel="noreferrer"
        className="min-w-0 truncate"
        onClick={() =>
          trackVenueAction({
            action: "maps",
            provider: "google_maps",
            venueSlug: slug,
          })
        }
      >
        Google Maps
      </a>
      {bookHref ? (
        <a
          href={bookHref}
          target="_blank"
          rel="noreferrer"
          className="is-primary min-w-0 truncate"
          onClick={() =>
            trackVenueAction({
              action: "reserve",
              provider: isTablepilot ? "tablepilot" : "official",
              venueSlug: slug,
            })
          }
        >
          {bookLabel}
        </a>
      ) : whatsapp ? (
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="is-primary min-w-0 truncate"
          onClick={() =>
            trackVenueAction({
              action: "whatsapp",
              provider: "whatsapp",
              venueSlug: slug,
            })
          }
        >
          WhatsApp
        </a>
      ) : null}
    </nav>
  );
}

function VenueActionBar(props: VenueActionBarProps): React.ReactNode;
function VenueActionBar(props: LegacyVenueActionBarProps): React.ReactNode;
function VenueActionBar(
  props: VenueActionBarProps | LegacyVenueActionBarProps
): React.ReactNode {
  if (isLegacyProps(props)) return <LegacyVenueActionBar {...props} />;

  const resolution = resolveVenueActions(props, {
    tablepilotBaseUrl: process.env.NEXT_PUBLIC_TABLEPILOT_URL,
  });

  return (
    <VenueActionPanel
      venueName={props.venueName}
      resolution={resolution}
      className={props.className}
    />
  );
}

export default VenueActionBar;
