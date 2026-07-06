"use client";

import { useRef } from "react";
import type { MouseEvent } from "react";
import type { VenueWithPerk } from "@/lib/data";
import ReserveButton from "@/components/ReserveButton";

// Reservation fallback (backlog #4): if a guest can't get a table here (venue
// closed / fully booked on TablePilot), or just wants options, offer the
// nearest same-district matches. Collapsed by default so it never clutters the
// planning grid. No AI — the suggestions come from category + verified vibe
// tags (guardrail #2).

const categoryLabel: Record<string, string> = {
  cafe: "Café",
  warung: "Warung",
  restaurant: "Restaurant",
  beach_club: "Beach club",
  spa: "Spa",
  bar: "Bar",
  surf: "Surf",
};

export default function SimilarPlaces({ venue }: { venue: VenueWithPerk }) {
  const logged = useRef(false);
  const similar = venue.similar ?? [];
  if (similar.length === 0) return null;

  const bookable = Boolean(venue.tablepilotSlug);
  const summary = bookable ? "Fully booked? Similar spots nearby" : "Similar spots nearby";

  // Funnel signal for the gated experiment: did guests actually reach for the
  // fallback? onClick on the summary (not onToggle on the details) so it fires
  // only on expand, not on collapse: at click time the summary hasn't toggled
  // yet, so details.open still holds the pre-click value. Fire once,
  // best-effort — never blocks the UI.
  function onSummaryClick(event: MouseEvent<HTMLElement>) {
    const details = event.currentTarget.closest("details");
    if (!details || details.open || logged.current) return; // already open → collapsing
    logged.current = true;
    fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "similar_open", venueSlug: venue.slug }),
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <details className="mt-3 rounded-xl border border-stone-200">
      <summary
        onClick={onSummaryClick}
        className="cursor-pointer list-none px-3 py-2 text-sm font-medium text-stone-600 hover:text-stone-900"
      >
        {summary}
      </summary>
      <ul className="space-y-2 px-3 pb-3">
        {similar.map((s) => (
          <li key={s.slug} className="rounded-lg bg-stone-50 p-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{s.name}</span>
              {s.isSponsored && (
                <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-700">
                  Sponsored
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500">
              {categoryLabel[s.category] ?? s.category} · {s.address}
            </p>
            {s.vibeTags && s.vibeTags.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {s.vibeTags.map((t) => (
                  <span key={t} className="rounded-full bg-white px-2 py-0.5 text-[10px] text-stone-500">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              <a
                href={s.gmapsUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-stone-200 px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-white"
              >
                Directions
              </a>
              <ReserveButton
                venueSlug={s.slug}
                tablepilotSlug={s.tablepilotSlug}
                whatsapp={s.whatsapp}
                perkTitle={s.perk?.title}
              />
            </div>
          </li>
        ))}
      </ul>
    </details>
  );
}
