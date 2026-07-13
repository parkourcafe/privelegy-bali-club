"use client";

import { trackVenueAction } from "@/lib/analytics";
import { buildTablePilotReservationUrl } from "@/lib/integrations/tablepilot";
import { buildWhatsAppHandoff } from "@/lib/integrations/whatsapp";

// Backward-compatible CTA for existing cards and the current venue-page aside.
// New place-page integration uses VenueActionBarProps + the capability resolver;
// this wrapper keeps the TablePilot bridge and legacy WhatsApp fallback safe
// until Session 4 removes the duplicated legacy paths.
export default function ReserveButton({
  venueSlug,
  tablepilotSlug,
  whatsapp,
  perkTitle,
  venueName = "",
}: {
  venueSlug: string;
  tablepilotSlug?: string;
  whatsapp?: string;
  perkTitle?: string;
  venueName?: string;
}) {
  const tablepilotHref = tablepilotSlug
    ? buildTablePilotReservationUrl(tablepilotSlug, process.env.NEXT_PUBLIC_TABLEPILOT_URL)
    : null;

  if (tablepilotHref) {
    return (
      <a
        href={tablepilotHref}
        target="_blank"
        rel="noreferrer"
        onClick={() =>
          trackVenueAction({
            action: "reserve",
            provider: "tablepilot",
            venueSlug,
          })
        }
        className="button-primary button-reserve"
      >
        Reserve a table
      </a>
    );
  }

  const whatsappHref = whatsapp
    ? buildWhatsAppHandoff({
        phone: whatsapp,
        venueName,
        kind: "reserve",
        perkTitle,
      })
    : null;

  if (whatsappHref) {
    return (
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        onClick={() =>
          trackVenueAction({
            action: "reserve",
            provider: "whatsapp",
            venueSlug,
          })
        }
        className="button-secondary"
      >
        Reserve on WhatsApp
      </a>
    );
  }

  return null;
}
