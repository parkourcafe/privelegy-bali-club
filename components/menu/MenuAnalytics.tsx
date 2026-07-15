"use client";

import { useEffect, useRef } from "react";
import { trackMenuItemOpen, trackMenuOpen } from "@/lib/analytics";

export default function MenuOpenTracker({ venueSlug, menuId }: { venueSlug: string; menuId: string }) {
  const emitted = useRef(false);

  useEffect(() => {
    if (emitted.current) return;
    emitted.current = true;
    trackMenuOpen({ venueSlug, menuId });
  }, [menuId, venueSlug]);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(`[data-menu-id="${CSS.escape(menuId)}"]`);
    if (!root) return;
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const summary = target.closest("summary");
      const details = summary?.parentElement;
      const menuItemId = details?.dataset.menuItemId;
      if (!menuItemId || details instanceof HTMLDetailsElement && details.open) return;
      trackMenuItemOpen({ venueSlug, menuId, menuItemId });
    };
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [menuId, venueSlug]);

  return null;
}
