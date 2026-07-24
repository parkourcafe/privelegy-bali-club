"use client";

import { useId, useState } from "react";
import { track } from "@/lib/analytics";

export default function AddToTripButton({ venueSlug }: { venueSlug: string }) {
  const [day, setDay] = useState(1);
  const [state, setState] = useState<"idle" | "working" | "done" | "error">("idle");
  const [expanded, setExpanded] = useState(false);
  const dayId = useId();

  async function add() {
    if (state === "working") return;
    setState("working");
    try {
      const response = await fetch("/api/trip", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueSlug, day }),
      });
      setState(response.ok ? "done" : "error");
      if (response.ok) track("route_add", { venueSlug });
    } catch {
      setState("error");
    }
  }

  return (
    <div className="flex min-h-11 items-center gap-2">
      {!expanded ? (
        <button type="button" onClick={() => setExpanded(true)} className="button-secondary min-h-11">
          Add to trip
        </button>
      ) : (
      <>
      <label className="sr-only" htmlFor={dayId}>Trip day</label>
      <select
        id={dayId}
        value={day}
        onChange={(event) => { setDay(Number(event.target.value)); setState("idle"); }}
        className="min-h-11 rounded-lg border border-[var(--line)] bg-[var(--paper)] px-2 text-sm"
      >
        {Array.from({ length: 30 }, (_, index) => index + 1).map((value) => (
          <option key={value} value={value}>Day {value}</option>
        ))}
      </select>
      <button type="button" onClick={add} disabled={state === "working"} className="button-secondary min-h-11">
        {state === "working" ? "Adding…" : state === "done" ? "Added ✓" : "Add to trip"}
      </button>
      <span className="sr-only" aria-live="polite">
        {state === "done" ? `Added to day ${day}` : state === "error" ? "Could not add. Try again." : ""}
      </span>
      </>
      )}
    </div>
  );
}
