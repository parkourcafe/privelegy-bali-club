"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TrackedDirectionsLink from "@/components/TrackedDirectionsLink";
import type { TripVenueEntry } from "@/lib/data";

export default function TripPlanner({ entries }: { entries: TripVenueEntry[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const days = [...new Set(entries.map((entry) => entry.day).filter((day): day is number => day !== null))];
  const groups = [
    ...(entries.some((entry) => entry.day === null) ? [{ day: null, label: "Saved for later" }] : []),
    ...days.map((day) => ({ day, label: `Day ${day}` })),
  ];

  async function mutate(venueSlug: string, method: "PATCH" | "DELETE", body: Record<string, unknown>) {
    setBusy(venueSlug);
    setMessage("");
    try {
      const response = await fetch("/api/trip", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueSlug, ...body }),
      });
      if (!response.ok) throw new Error("mutation_failed");
      setMessage("Trip updated");
      router.refresh();
    } catch {
      setMessage("Could not update the trip. Try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mt-6 space-y-6">
      <p className="sr-only" aria-live="polite">{message}</p>
      {groups.map((group) => {
        const stops = entries.filter((entry) => entry.day === group.day);
        return (
          <section key={group.label} aria-labelledby={`heading-${group.day ?? "saved"}`}>
            <h2 id={`heading-${group.day ?? "saved"}`} className="font-display text-xl font-bold">{group.label}</h2>
            <ol className="mt-2 space-y-3">
              {stops.map((entry, index) => (
                <li key={entry.venueSlug} className="rounded-xl border border-[var(--line)] bg-[var(--paper-soft)] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/places/${entry.venueSlug}`} className="font-semibold">{entry.venue.name}</Link>
                      <p className="text-xs text-[var(--muted)]">{entry.venue.area ?? entry.venue.district}</p>
                    </div>
                    <TrackedDirectionsLink href={entry.venue.gmapsUrl} venueSlug={entry.venueSlug} className="quiet-link">
                      Maps
                    </TrackedDirectionsLink>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {group.day !== null && (
                      <>
                        <button className="button-secondary min-h-11 px-3" disabled={busy === entry.venueSlug || index === 0} onClick={() => mutate(entry.venueSlug, "PATCH", { action: "up" })} aria-label={`Move ${entry.venue.name} earlier`}>↑</button>
                        <button className="button-secondary min-h-11 px-3" disabled={busy === entry.venueSlug || index === stops.length - 1} onClick={() => mutate(entry.venueSlug, "PATCH", { action: "down" })} aria-label={`Move ${entry.venue.name} later`}>↓</button>
                      </>
                    )}
                    <label className="sr-only" htmlFor={`move-${entry.venueSlug}`}>{group.day === null ? "Add" : "Move"} {entry.venue.name} to day</label>
                    <select id={`move-${entry.venueSlug}`} value={group.day ?? ""} disabled={busy === entry.venueSlug} onChange={(event) => { if (event.target.value) void mutate(entry.venueSlug, "PATCH", { action: "move-day", day: Number(event.target.value) }); }} className="min-h-11 rounded-lg border border-[var(--line)] bg-[var(--paper)] px-2">
                      {group.day === null && <option value="">Choose day</option>}
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => <option key={day} value={day}>Day {day}</option>)}
                    </select>
                    <button className="button-secondary min-h-11" disabled={busy === entry.venueSlug} onClick={() => mutate(entry.venueSlug, "DELETE", {})}>Remove</button>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
