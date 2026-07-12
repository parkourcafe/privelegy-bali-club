"use client";

import { useState } from "react";

// ♡ Save toggle (master §6c, Rung 1). Optimistic; posts to /api/save which keys
// off the anonymous guest cookie. Sits above the card's stretched link, so it
// stops propagation to avoid navigating when tapped.
export default function SaveButton({
  venueSlug,
  initialSaved = false,
  variant = "card",
}: {
  venueSlug: string;
  initialSaved?: boolean;
  variant?: "card" | "detail";
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [busy, setBusy] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    const next = !saved;
    setSaved(next);
    try {
      const r = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueSlug }),
      });
      const d = await r.json();
      if (typeof d.saved === "boolean") setSaved(d.saved);
      else setSaved(!next);
    } catch {
      setSaved(!next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? "Remove from your list" : "Save to your list"}
      className={variant === "detail" ? "save-btn save-btn-detail" : "save-btn save-btn-card"}
      data-saved={saved ? "true" : "false"}
    >
      <span aria-hidden>{saved ? "♥" : "♡"}</span>
      {variant === "detail" && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
