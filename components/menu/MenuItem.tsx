import type { MenuItemRecord } from "@/lib/contracts/menu-action";
import { formatMenuPrice } from "./menu-model";

export default function MenuItem({ item }: { item: MenuItemRecord }) {
  const price = formatMenuPrice(item.priceMinor, item.currency);
  return (
    <li className="structured-menu-item">
      <div className="structured-menu-item-head">
        <h4>{item.name}</h4>
        <span className="structured-menu-price">{price ?? "Price not listed"}</span>
      </div>
      {item.description && <p className="structured-menu-description">{item.description}</p>}
      <div className="structured-menu-signals">
        {item.editorialPick && <span className="menu-signal menu-signal-editorial">Other Bali pick</span>}
        {item.partnerRecommended && <span className="menu-signal menu-signal-partner">Recommended by the venue</span>}
        {item.dietaryTags.slice(0, 3).map((tag) => <span key={tag} className="menu-tag">{tag}</span>)}
        {item.verifiedAllergenTags.slice(0, 3).map((tag) => <span key={tag} className="menu-tag menu-tag-allergen">Contains: {tag}</span>)}
      </div>
      {item.editorialNote && <p className="structured-menu-editorial-note"><strong>Other Bali:</strong> {item.editorialNote}</p>}
      {item.availabilityNote && <p className="structured-menu-availability">Availability note: {item.availabilityNote}. Confirm with the venue.</p>}
    </li>
  );
}
