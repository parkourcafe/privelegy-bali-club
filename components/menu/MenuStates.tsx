import TrackedOutboundLink from "@/components/TrackedOutboundLink";

export function OfficialMenuFallback({ venueSlug, officialMenuUrl, compact = false }: { venueSlug: string; officialMenuUrl: string; compact?: boolean }) {
  return (
    <div className={compact ? "menu-state menu-state-compact" : "menu-state"}>
      <p className="menu-state-kicker">Official source</p>
      <h3>See the venue&apos;s current menu</h3>
      <p>Prices and availability can change. The official menu is the best current source.</p>
      <TrackedOutboundLink href={officialMenuUrl} event="menu_click" venueSlug={venueSlug} className="button-secondary mt-4">View official menu ↗</TrackedOutboundLink>
    </div>
  );
}

export function MenuEmptyState() {
  return <div className="menu-state"><p className="menu-state-kicker">Menu not available</p><h3>Decide with the editorial picks above</h3><p>We do not have a verified menu for this place yet. Check with the venue before making a special trip for a specific item.</p></div>;
}

export function MenuStaleState({ venueSlug, officialMenuUrl }: { venueSlug: string; officialMenuUrl?: string | null }) {
  return <div className="menu-state menu-state-stale"><p className="menu-state-kicker">Menu update needed</p><h3>We have hidden an out-of-date menu</h3><p>Rather than show old prices or items, we suppress the structured menu until it is verified again.</p>{officialMenuUrl && <OfficialMenuFallback venueSlug={venueSlug} officialMenuUrl={officialMenuUrl} compact />}</div>;
}
