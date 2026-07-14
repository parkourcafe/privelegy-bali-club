"use client";

import type { MenuItemRecord } from "@/lib/contracts/menu-action";
import { useId, useState } from "react";
import { trackMenuItemOpen } from "@/lib/analytics";
import { formatMenuPrice } from "./menu-model";

export default function MenuItem({
  item,
  venueSlug,
  menuId,
  sourceSnapshot = false,
}: {
  item: MenuItemRecord;
  venueSlug: string;
  menuId: string;
  sourceSnapshot?: boolean;
}) {
  const price = formatMenuPrice(item.priceMinor, item.currency, item.priceText);
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();

  function toggleDetails() {
    setExpanded((current) => {
      if (!current) trackMenuItemOpen({ venueSlug, menuId, menuItemId: item.id });
      return !current;
    });
  }

  return (
    <li className="structured-menu-item">
      <div className="structured-menu-item-head">
        <h4>
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={detailsId}
            onClick={toggleDetails}
            className="min-h-11 rounded text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lagoon-strong)]"
          >
            <span>{item.name}</span>
            <span className="mt-1 block text-[11px] font-semibold text-[var(--lagoon-strong)]">
              {expanded ? "Hide item details" : "View item details"}
            </span>
          </button>
        </h4>
        <span className="structured-menu-price">{price ?? "Price not listed"}</span>
      </div>
      <div id={detailsId} hidden={!expanded}>
        {item.description && <p className="structured-menu-description">{item.description}</p>}
        {!sourceSnapshot ? (
          <div className="structured-menu-signals">
            {item.editorialPick && <span className="menu-signal menu-signal-editorial">Other Bali pick</span>}
            {item.partnerRecommended && <span className="menu-signal menu-signal-partner">Recommended by the venue</span>}
            {item.dietaryTags.slice(0, 3).map((tag) => <span key={tag} className="menu-tag">{tag}</span>)}
            {item.verifiedAllergenTags.slice(0, 3).map((tag) => <span key={tag} className="menu-tag menu-tag-allergen">Contains: {tag}</span>)}
          </div>
        ) : null}
        {!sourceSnapshot && item.editorialNote && <p className="structured-menu-editorial-note"><strong>Other Bali:</strong> {item.editorialNote}</p>}
        {item.availabilityNote && <p className="structured-menu-availability">Availability note: {item.availabilityNote}. Confirm with the venue.</p>}
        {!item.description && !item.availabilityNote && (
          sourceSnapshot || (item.dietaryTags.length === 0 && item.verifiedAllergenTags.length === 0 && !item.editorialNote && !item.editorialPick && !item.partnerRecommended)
        ) ? (
          <p className="structured-menu-description">No additional details are listed.</p>
        ) : null}
      </div>
    </li>
  );
}
