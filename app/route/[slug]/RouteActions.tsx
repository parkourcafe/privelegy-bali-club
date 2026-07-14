"use client";

import Link from "next/link";
import { useState } from "react";
import { unsavedRouteStopSlugs } from "@/lib/route-experience";
import { withGuestIdentity } from "@/lib/guest-client";

type SaveState = "idle" | "working" | "saved" | "partial";
type ShareState = "idle" | "working" | "shared" | "copied" | "manual";

function responseSaved(value: unknown): boolean {
  return Boolean(
    value
      && typeof value === "object"
      && "ok" in value
      && "saved" in value
      && (value as { ok?: unknown }).ok === true
      && (value as { saved?: unknown }).saved === true,
  );
}

function wasShareCancelled(error: unknown): boolean {
  return Boolean(
    error
      && typeof error === "object"
      && "name" in error
      && (error as { name?: unknown }).name === "AbortError",
  );
}

export default function RouteActions({
  routeTitle,
  canonicalUrl,
  stopSlugs,
  initiallySavedSlugs,
}: {
  routeTitle: string;
  canonicalUrl: string;
  stopSlugs: string[];
  initiallySavedSlugs: string[];
}) {
  const initialPending = unsavedRouteStopSlugs(stopSlugs, initiallySavedSlugs);
  const [pendingSlugs, setPendingSlugs] = useState(initialPending);
  const [saveState, setSaveState] = useState<SaveState>(
    initialPending.length === 0 ? "saved" : "idle",
  );
  const [shareState, setShareState] = useState<ShareState>("idle");

  async function saveRouteStops() {
    if (saveState === "working" || pendingSlugs.length === 0) return;
    setSaveState("working");

    const remaining = [...pendingSlugs];
    try {
      await withGuestIdentity(async (signal) => {
        for (const venueSlug of pendingSlugs) {
          try {
            const response = await fetch("/api/save", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ venueSlug, saved: true }),
              signal,
            });
            const payload: unknown = await response.json().catch(() => null);
            if (!response.ok || !responseSaved(payload)) break;
            remaining.shift();
            setPendingSlugs([...remaining]);
          } catch {
            break;
          }
        }
      });
    } catch {
      // The retry state below remains visible if coordination/bootstrap fails.
    }

    setSaveState(remaining.length === 0 ? "saved" : "partial");
  }

  async function shareRoute() {
    if (shareState === "working") return;
    setShareState("working");

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: `${routeTitle} · Other Bali`, url: canonicalUrl });
        setShareState("shared");
        return;
      } catch (error) {
        if (wasShareCancelled(error)) {
          setShareState("idle");
          return;
        }
      }
    }

    if (typeof navigator.clipboard?.writeText === "function") {
      try {
        await navigator.clipboard.writeText(canonicalUrl);
        setShareState("copied");
        return;
      } catch {
        // A visible read-only field below is the final no-permission fallback.
      }
    }

    setShareState("manual");
  }

  const saveLabel = saveState === "working"
    ? `Saving ${pendingSlugs.length} stop${pendingSlugs.length === 1 ? "" : "s"}…`
    : saveState === "saved"
      ? "All stops saved"
      : saveState === "partial"
        ? `Save remaining ${pendingSlugs.length}`
        : "Save route stops";

  const shareLabel = shareState === "working"
    ? "Opening share…"
    : shareState === "shared"
      ? "Route shared"
      : shareState === "copied"
        ? "Route link copied"
        : "Share route";

  return (
    <div className="route-actions">
      <div className="route-actions-buttons">
        <button
          type="button"
          className="button-primary"
          onClick={saveRouteStops}
          disabled={saveState === "working" || pendingSlugs.length === 0}
        >
          {saveLabel}
        </button>
        <button
          type="button"
          className="button-secondary"
          onClick={shareRoute}
          disabled={shareState === "working"}
        >
          {shareLabel}
        </button>
      </div>

      <p className="route-action-status" aria-live="polite">
        {saveState === "saved" ? (
          <>
            Every stop is in <Link href="/me">My list</Link>. This page keeps the published order.
          </>
        ) : saveState === "partial" ? (
          `${stopSlugs.length - pendingSlugs.length} of ${stopSlugs.length} stops saved. Try the remaining stops.`
        ) : (
          "Saving adds each stop to My list; it never changes the published route order."
        )}
        {shareState === "shared" && " Route shared through your device."}
        {shareState === "copied" && " Route link copied to your clipboard."}
        {shareState === "manual" && " Automatic sharing is unavailable. Copy the link below."}
      </p>

      {shareState === "manual" && (
        <label className="route-copy-field">
          <span>Route link</span>
          <input
            type="text"
            readOnly
            value={canonicalUrl}
            onFocus={(event) => event.currentTarget.select()}
            onClick={(event) => event.currentTarget.select()}
          />
        </label>
      )}
    </div>
  );
}
