import type { MenuRecord } from "@/lib/contracts/menu-action";
import TrackedOutboundLink from "@/components/TrackedOutboundLink";
import MenuSection from "./MenuSection";
import { MenuEmptyState, MenuStaleState, OfficialMenuFallback } from "./MenuStates";
import { formatMenuDate, getMenuFreshness } from "./menu-model";

export default function StructuredMenu({ menu, venueSlug, officialMenuUrl }: { menu: MenuRecord | null; venueSlug: string; officialMenuUrl?: string | null }) {
  if (!menu) return officialMenuUrl ? <OfficialMenuFallback venueSlug={venueSlug} officialMenuUrl={officialMenuUrl} /> : <MenuEmptyState />;
  const freshness = getMenuFreshness(menu);
  if (freshness === "stale" || freshness === "unpublished") return <MenuStaleState venueSlug={venueSlug} officialMenuUrl={officialMenuUrl} />;
  if (freshness === "empty") return officialMenuUrl ? <OfficialMenuFallback venueSlug={venueSlug} officialMenuUrl={officialMenuUrl} /> : <MenuEmptyState />;
  const verified = formatMenuDate(menu.verifiedAt);
  const expires = formatMenuDate(menu.expiresAt);
  const sections = [...menu.sections].sort((a, b) => a.position - b.position);
  return (
    <div className="structured-menu">
      <header className="structured-menu-header">
        <div><p className="structured-menu-eyebrow">Verified menu · version {menu.version}</p><h3>{menu.title}</h3></div>
        <p className="structured-menu-source">Source: <a href={menu.sourceUrl} target="_blank" rel="noreferrer">{menu.sourceLabel} ↗</a>{verified ? ` · checked ${verified}` : ""}{expires ? ` · current until ${expires}` : ""}</p>
      </header>
      <p className="structured-menu-allergen-note"><strong>Allergen note:</strong> only explicitly verified allergens are shown. No allergen tag means unknown, not allergen-free.</p>
      <div className="structured-menu-sections">{sections.map((section, index) => <MenuSection key={section.id} section={{ ...section, items: [...section.items].sort((a, b) => a.position - b.position) }} initiallyOpen={index === 0} />)}</div>
      {officialMenuUrl && (
        <p className="structured-menu-official-link">
          <TrackedOutboundLink href={officialMenuUrl} event="menu_click" venueSlug={venueSlug}>
            Compare with the official menu ↗
          </TrackedOutboundLink>
        </p>
      )}
    </div>
  );
}
