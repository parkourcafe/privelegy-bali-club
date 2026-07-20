import type { PublicMenuSummary } from "@/lib/data/menu-summary-repository";
import TrackedOutboundLink from "@/components/TrackedOutboundLink";
import MenuSection from "./MenuSection";
import MenuOpenTracker from "./MenuAnalytics";
import { MenuEmptyState, MenuStaleState, OfficialMenuFallback } from "./MenuStates";
import { formatMenuDate, getMenuFreshness } from "./menu-model";

export default function StructuredMenu({ menu, venueSlug, officialMenuUrl, eyebrow, hideAllergenNote }: { menu: PublicMenuSummary | null; venueSlug: string; officialMenuUrl?: string | null; eyebrow?: string; hideAllergenNote?: boolean }) {
  if (!menu) return officialMenuUrl ? <OfficialMenuFallback venueSlug={venueSlug} officialMenuUrl={officialMenuUrl} /> : <MenuEmptyState />;
  const freshness = getMenuFreshness(menu);
  if (freshness === "stale" || freshness === "unpublished") return <MenuStaleState venueSlug={venueSlug} officialMenuUrl={officialMenuUrl} />;
  if (freshness === "empty") return officialMenuUrl ? <OfficialMenuFallback venueSlug={venueSlug} officialMenuUrl={officialMenuUrl} /> : <MenuEmptyState />;
  const captured = formatMenuDate(menu.capturedAt);
  const verified = formatMenuDate(menu.verifiedAt);
  const expires = formatMenuDate(menu.expiresAt);
  const sections = [...menu.sections].sort((a, b) => a.position - b.position);
  return (
    <div className="structured-menu" data-menu-id={menu.id}>
      <MenuOpenTracker venueSlug={venueSlug} menuId={menu.id} />
      <header className="structured-menu-header">
        <div><p className="structured-menu-eyebrow">{eyebrow ?? "Verified full menu"} · version {menu.version}</p><h3>{menu.title}</h3></div>
        <p className="structured-menu-source">Source: <a href={menu.sourceUrl} target="_blank" rel="noreferrer">{menu.sourceLabel} ↗</a>{captured ? ` · prices as of ${captured}, may vary` : ""}{verified ? ` · checked ${verified}` : ""}{expires ? ` · current until ${expires}` : ""}</p>
      </header>
      {!hideAllergenNote && (
        <p className="structured-menu-allergen-note"><strong>Allergen note:</strong> only explicitly verified allergens are shown. No allergen tag means unknown, not allergen-free.</p>
      )}
      <div className="structured-menu-sections">{sections.map((section, index) => <MenuSection key={section.id} section={{ ...section, items: [...section.items].sort((a, b) => a.position - b.position) }} venueSlug={venueSlug} menuId={menu.id} initiallyOpen={index === 0} />)}</div>
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
