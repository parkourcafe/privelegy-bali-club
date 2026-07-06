"use client";

// Reserve CTA for bookable venues (money model v0.3). Logs a reservation_click
// (the demand signal for the shifted Phase 0), then hands off to TablePilot's
// public booking page with source=bali_privilege so the reservation is
// attributed to us for the seated-reservation fee.

const TABLEPILOT_URL =
  process.env.NEXT_PUBLIC_TABLEPILOT_URL ?? "https://tablepilot-id.vercel.app";

function logClick(venueSlug: string) {
  fetch("/api/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "reservation_click", venueSlug }),
    keepalive: true,
  }).catch(() => {});
}

export default function ReserveButton({
  venueSlug,
  tablepilotSlug,
  whatsapp,
  perkTitle,
}: {
  venueSlug: string;
  tablepilotSlug?: string;
  whatsapp?: string;
  perkTitle?: string;
}) {
  // Bookable venue → TablePilot handoff.
  if (tablepilotSlug) {
    const href = `${TABLEPILOT_URL}/book/${encodeURIComponent(tablepilotSlug)}?source=bali_privilege`;
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={() => logClick(venueSlug)}
        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
      >
        Reserve a table
      </a>
    );
  }

  // Fallback: WhatsApp reservation (no fee loop — just a pre-filled message).
  if (whatsapp) {
    const text = `Hi! Booking via Canggu Perks Map.${perkTitle ? ` Perk: ${perkTitle}.` : ""} Table for … at …`;
    const href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={() => logClick(venueSlug)}
        className="rounded-lg border border-emerald-200 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
      >
        Reserve on WhatsApp
      </a>
    );
  }

  return null;
}
