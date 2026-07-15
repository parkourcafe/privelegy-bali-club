import type { PublicMenuSectionSummary } from "@/lib/data/menu-summary-repository";
import MenuItem from "./MenuItem";
import DeferredMenuSection from "./DeferredMenuSection";

export default function MenuSection({ section, venueSlug, menuId, initiallyOpen = false }: { section: PublicMenuSectionSummary; venueSlug: string; menuId: string; initiallyOpen?: boolean }) {
  if (section.deferred) {
    return <DeferredMenuSection section={section} venueSlug={venueSlug} menuId={menuId} />;
  }
  return (
    <details className="structured-menu-section" open={initiallyOpen}>
      <summary>
        <span>{section.name}</span>
        <small>{section.itemCount} item{section.itemCount === 1 ? "" : "s"}</small>
      </summary>
      {section.description && <p className="structured-menu-section-description">{section.description}</p>}
      <ul>{section.items.map((item) => <MenuItem key={item.id} item={item} />)}</ul>
    </details>
  );
}
