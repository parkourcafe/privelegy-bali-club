import type { MenuItemRecord } from "@/lib/contracts/menu-action";
import { formatMenuPrice } from "./menu-model";

export default function MenuItem({ item }: { item: MenuItemRecord }) {
  const price = formatMenuPrice(item.priceMinor, item.currency, item.priceText);

  return (
    <li>
      <details className="structured-menu-item" data-menu-item-id={item.id}>
      <summary className="structured-menu-item-head">
        <h4>
          <span>{item.name}</span>
          <span className="mt-1 block text-[11px] font-semibold text-[var(--lagoon-strong)]">
            View item details
          </span>
        </h4>
        <span className="structured-menu-price">{price ?? "Price not listed"}</span>
      </summary>
      <div className="structured-menu-item-details">
        {item.description && <p className="structured-menu-description">{item.description}</p>}
        <div className="structured-menu-signals">
          {item.editorialPick && <span className="menu-signal menu-signal-editorial">Other Bali pick</span>}
          {item.partnerRecommended && <span className="menu-signal menu-signal-partner">Recommended by the venue</span>}
          {item.dietaryTags.slice(0, 3).map((tag) => <span key={tag} className="menu-tag">{tag}</span>)}
          {item.verifiedAllergenTags.slice(0, 3).map((tag) => <span key={tag} className="menu-tag menu-tag-allergen">Contains: {tag}</span>)}
        </div>
        {item.editorialNote && <p className="structured-menu-editorial-note"><strong>Other Bali:</strong> {item.editorialNote}</p>}
        {item.availabilityNote && <p className="structured-menu-availability">Availability note: {item.availabilityNote}. Confirm with the venue.</p>}
        {!item.description && item.dietaryTags.length === 0 && item.verifiedAllergenTags.length === 0 && !item.editorialNote && !item.availabilityNote && !item.editorialPick && !item.partnerRecommended ? (
          <p className="structured-menu-description">No additional details are listed.</p>
        ) : null}
      </div>
      </details>
    </li>
  );
}
