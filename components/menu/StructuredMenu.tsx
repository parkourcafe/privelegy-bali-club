import type { MenuRecord } from "@/lib/contracts/menu-action";
import TrackedOutboundLink from "@/components/TrackedOutboundLink";
import MenuSection from "./MenuSection";
import MenuOpenTracker from "./MenuAnalytics";
import { MenuEmptyState, MenuStaleState, OfficialMenuFallback } from "./MenuStates";
import { formatMenuDate, getMenuFreshness } from "./menu-model";

export default function StructuredMenu({ menu, venueSlug, officialMenuUrl }: { menu: MenuRecord | null; venueSlug: string; officialMenuUrl?: string | null }) {
  if (!menu) return officialMenuUrl ? <OfficialMenuFallback venueSlug={venueSlug} officialMenuUrl={officialMenuUrl} /> : <MenuEmptyState />;
  const freshness = getMenuFreshness(menu);
  if (freshness === "stale" || freshness === "unpublished") return <MenuStaleState venueSlug={venueSlug} officialMenuUrl={officialMenuUrl} />;
  if (freshness === "empty") return officialMenuUrl ? <OfficialMenuFallback venueSlug={venueSlug} officialMenuUrl={officialMenuUrl} /> : <MenuEmptyState />;
  const captured = formatMenuDate(menu.capturedAt);
  const verified = formatMenuDate(menu.verifiedAt);
  const expires = formatMenuDate(menu.expiresAt);
  const sections = [...menu.sections].sort((a, b) => a.position - b.position);
  const itemCount = sections.reduce((count, section) => count + section.items.length, 0);
  const sourceSnapshot = menu.status === "source_snapshot";
  return (
    <div className="structured-menu">
      <MenuOpenTracker venueSlug={venueSlug} menuId={menu.id} />
      <header className="structured-menu-header">
        <div>
          <p className="structured-menu-eyebrow">
            {sourceSnapshot
              ? `Partial source snapshot · ${itemCount} listed item${itemCount === 1 ? "" : "s"}`
              : `Verified full menu · version ${menu.version}`}
          </p>
          <h3>{menu.title}</h3>
        </div>
        <p className="structured-menu-source">
          {sourceSnapshot ? "Official source: " : "Source: "}
          <a href={menu.sourceUrl} target="_blank" rel="noreferrer">{menu.sourceLabel} ↗</a>
          {captured ? ` · captured ${captured}` : ""}
          {verified ? ` · checked ${verified}` : ""}
          {expires ? ` · recheck by ${expires}` : ""}
        </p>
      </header>
      {sourceSnapshot ? (
        <p className="structured-menu-allergen-note" role="note">
          <strong>Selected items only:</strong> this is not the complete menu and has not been independently verified item by item. Prices, taxes, service charges and availability may have changed. Confirm important details with the venue.
        </p>
      ) : (
        <p className="structured-menu-allergen-note"><strong>Allergen note:</strong> only explicitly verified allergens are shown. No allergen tag means unknown, not allergen-free.</p>
      )}
      <div className="structured-menu-sections">{sections.map((section, index) => <MenuSection key={section.id} section={{ ...section, items: [...section.items].sort((a, b) => a.position - b.position) }} venueSlug={venueSlug} menuId={menu.id} initiallyOpen={index === 0} sourceSnapshot={sourceSnapshot} />)}</div>
      {officialMenuUrl && officialMenuUrl !== menu.sourceUrl && (
        <p className="structured-menu-official-link">
          <TrackedOutboundLink href={officialMenuUrl} event="menu_click" venueSlug={venueSlug}>
            Compare with the official menu ↗
          </TrackedOutboundLink>
        </p>
      )}
    </div>
  );
}
