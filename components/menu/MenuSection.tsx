import type { MenuSectionRecord } from "@/lib/contracts/menu-action";
import MenuItem from "./MenuItem";

export default function MenuSection({
  section,
  venueSlug,
  menuId,
  initiallyOpen = false,
  sourceSnapshot = false,
}: {
  section: MenuSectionRecord;
  venueSlug: string;
  menuId: string;
  initiallyOpen?: boolean;
  sourceSnapshot?: boolean;
}) {
  const snapshotSectionPrefix = section.name.replace(/\s*review subset\s*$/i, "").trim();
  const publicName = sourceSnapshot && /review subset\s*$/i.test(section.name)
    ? `${snapshotSectionPrefix ? `${snapshotSectionPrefix} · ` : ""}Selected items`
    : section.name;
  return (
    <details className="structured-menu-section" open={initiallyOpen}>
      <summary>
        <span>{publicName}</span>
        <small>{section.items.length} item{section.items.length === 1 ? "" : "s"}</small>
      </summary>
      {section.description && <p className="structured-menu-section-description">{section.description}</p>}
      <ul>{section.items.map((item) => <MenuItem key={item.id} item={item} venueSlug={venueSlug} menuId={menuId} sourceSnapshot={sourceSnapshot} />)}</ul>
    </details>
  );
}
