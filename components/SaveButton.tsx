"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

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
  const [loaded, setLoaded] = useState(variant === "card");
  const [message, setMessage] = useState("");
  const hasError = message.startsWith("Could not");

  useEffect(() => {
    if (variant === "card") return;
    const controller = new AbortController();
    fetch(`/api/save?venue=${encodeURIComponent(venueSlug)}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((body: { saved?: boolean }) => {
        if (typeof body.saved === "boolean") setSaved(body.saved);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
    return () => controller.abort();
  }, [venueSlug, variant]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    const next = variant === "card" ? true : !saved;
    setSaved(next);
    setMessage("");
    try {
      const r = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueSlug, saved: next }),
      });
      const d = await r.json();
      if (!r.ok || typeof d.saved !== "boolean") throw new Error("save_failed");
      setSaved(d.saved);
      setMessage(d.saved ? "Saved to My Bali" : "Removed from My Bali");
      if (d.saved) track("save", { venueSlug });
    } catch {
      setSaved(!next);
      setMessage("Could not update. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <span>
    <button
      type="button"
      disabled={!loaded || busy || (variant === "card" && saved)}
      onClick={toggle}
      aria-pressed={saved}
      aria-busy={!loaded || busy}
      aria-label={saved ? "Remove from your list" : "Save to your list"}
      className={variant === "detail" ? "save-btn save-btn-detail" : "save-btn save-btn-card"}
      data-saved={saved ? "true" : "false"}
    >
      <span aria-hidden>{saved ? "♥" : "♡"}</span>
      {variant === "detail" && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
    <span className={hasError ? "ml-2 text-xs text-red-700" : "sr-only"} aria-live="polite">{message}</span>
    </span>
  );
}
