"use client";

import { useEffect, useRef } from "react";
import { trackMenuOpen } from "@/lib/analytics";

export default function MenuOpenTracker({ venueSlug, menuId }: { venueSlug: string; menuId: string }) {
  const emitted = useRef(false);

  useEffect(() => {
    if (emitted.current) return;
    emitted.current = true;
    trackMenuOpen({ venueSlug, menuId });
  }, [menuId, venueSlug]);

  return null;
}
