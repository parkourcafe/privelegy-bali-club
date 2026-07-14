"use client";

import { useState } from "react";
import { withGuestIdentity } from "@/lib/guest-client";

// Share a read-only list by link (master §6c, Rung 2). Creates a shared list
// server-side, then uses the native share sheet or copies the link. No account.
export default function ShareButton({ slugs }: { slugs?: string[] }) {
  const [state, setState] = useState<"idle" | "working" | "copied" | "error">("idle");

  async function share() {
    if (state === "working") return;
    setState("working");
    try {
      const r = await withGuestIdentity((signal) => fetch("/api/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slugs ? { slugs } : {}),
        signal,
      }));
      const d = await r.json();
      if (!d.id) {
        setState("error");
        return;
      }
      const url = `${window.location.origin}/list/${d.id}`;
      if (navigator.share) {
        await navigator.share({ title: "My Bali list — Other Bali", url });
        setState("idle");
      } else {
        await navigator.clipboard.writeText(url);
        setState("copied");
        setTimeout(() => setState("idle"), 2000);
      }
    } catch {
      setState("error");
    }
  }

  return (
    <button type="button" onClick={share} className="button-secondary">
      {state === "working"
        ? "Creating link…"
        : state === "copied"
        ? "Link copied ✓"
        : state === "error"
        ? "Try again"
        : "Share my list"}
    </button>
  );
}
