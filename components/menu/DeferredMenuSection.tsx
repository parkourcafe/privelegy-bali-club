"use client";

import { useState } from "react";
import type { MenuSectionRecord } from "@/lib/contracts/menu-action";
import type { PublicMenuSectionSummary } from "@/lib/data/menu-summary-repository";
import MenuItem from "./MenuItem";

export default function DeferredMenuSection({
  section,
  venueSlug,
  menuId,
}: {
  section: PublicMenuSectionSummary;
  venueSlug: string;
  menuId: string;
}) {
  const [loaded, setLoaded] = useState<MenuSectionRecord | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  async function load() {
    if (loaded || state === "loading") return;
    setState("loading");
    try {
      const params = new URLSearchParams({ venue: venueSlug, menu: menuId, section: section.id });
      const response = await fetch(`/api/public/menu-section?${params}`);
      const body = (await response.json()) as { section?: MenuSectionRecord };
      if (!response.ok || !body.section) throw new Error("section_unavailable");
      setLoaded(body.section);
      setState("idle");
    } catch {
      setState("error");
    }
  }

  return (
    <details
      className="structured-menu-section"
      onToggle={(event) => {
        if (event.currentTarget.open) void load();
      }}
    >
      <summary>
        <span>{section.name}</span>
        <small>{section.itemCount} item{section.itemCount === 1 ? "" : "s"}</small>
      </summary>
      {section.description ? <p className="structured-menu-section-description">{section.description}</p> : null}
      {state === "loading" ? <p className="structured-menu-section-status">Loading section…</p> : null}
      {state === "error" ? (
        <p className="structured-menu-section-status">This section could not load. Use the official menu link below.</p>
      ) : null}
      {loaded ? (
        <ul>{loaded.items.map((item) => <MenuItem key={item.id} item={item} />)}</ul>
      ) : null}
    </details>
  );
}
