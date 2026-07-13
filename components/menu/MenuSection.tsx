import type { MenuSectionRecord } from "@/lib/contracts/menu-action";
import MenuItem from "./MenuItem";

export default function MenuSection({ section, initiallyOpen = false }: { section: MenuSectionRecord; initiallyOpen?: boolean }) {
  return (
    <details className="structured-menu-section" open={initiallyOpen}>
      <summary>
        <span>{section.name}</span>
        <small>{section.items.length} item{section.items.length === 1 ? "" : "s"}</small>
      </summary>
      {section.description && <p className="structured-menu-section-description">{section.description}</p>}
      <ul>{section.items.map((item) => <MenuItem key={item.id} item={item} />)}</ul>
    </details>
  );
}
