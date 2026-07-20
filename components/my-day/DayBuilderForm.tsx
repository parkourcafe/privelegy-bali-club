"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DAY_AREAS,
  GROUP_OPTIONS,
  VIBE_OPTIONS,
  BUDGET_OPTIONS,
  FINISH_OPTIONS,
  nearestArea,
  type DayAnswers,
} from "@/lib/day-builder";

// Interactive question flow for "My Day". It only collects answers and pushes
// them to the URL (/my-day?area=…&group=…); the SERVER page reads those params
// and builds the day from published collections. That keeps the plan shareable,
// SEO-visible, and the data server-side (guardrail: prefer server reads). No
// identity or location is ever stored — a geolocation fix is used in-memory to
// pick the nearest area and then discarded (guardrail #11).

type GeoState =
  | { kind: "idle" }
  | { kind: "locating" }
  | { kind: "found"; name: string }
  | { kind: "outside" }
  | { kind: "denied" }
  | { kind: "unavailable" };

const CHIP = "chip";
const CHIP_ON = "chip chip-active";

function Group({
  legend,
  options,
  selected,
  onSelect,
}: {
  legend: string;
  options: { value: string; label: string; hint: string }[];
  selected: string | null;
  onSelect: (value: string) => void;
}) {
  return (
    <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
      <legend className="field-label" style={{ marginBottom: 8 }}>
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = selected === o.value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              title={o.hint}
              onClick={() => onSelect(o.value)}
              className={on ? CHIP_ON : CHIP}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function DayBuilderForm({ initial }: { initial: DayAnswers }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<DayAnswers>(initial);
  const [geo, setGeo] = useState<GeoState>({ kind: "idle" });

  // Tapping the selected value again clears it (nothing is forced).
  function set<K extends keyof DayAnswers>(key: K, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: prev[key] === value ? null : value }));
  }

  function useMyLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeo({ kind: "unavailable" });
      return;
    }
    setGeo({ kind: "locating" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const near = nearestArea(pos.coords.latitude, pos.coords.longitude);
        if (near) {
          setAnswers((prev) => ({ ...prev, area: near.slug }));
          setGeo({ kind: "found", name: near.name });
        } else {
          setAnswers((prev) => ({ ...prev, area: null }));
          setGeo({ kind: "outside" });
        }
      },
      () => setGeo({ kind: "denied" }),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }

  function buildDay() {
    const params = new URLSearchParams();
    if (answers.area) params.set("area", answers.area);
    if (answers.group) params.set("group", answers.group);
    if (answers.vibe) params.set("vibe", answers.vibe);
    if (answers.budget) params.set("budget", answers.budget);
    if (answers.finish) params.set("finish", answers.finish);
    const qs = params.toString();
    router.push(qs ? `/my-day?${qs}#your-day` : "/my-day#your-day");
  }

  const geoLine =
    geo.kind === "locating"
      ? "Finding you…"
      : geo.kind === "found"
        ? `You're near ${geo.name}.`
        : geo.kind === "outside"
          ? "You seem to be outside our covered areas — building for all Bali."
          : geo.kind === "denied"
            ? "No problem — just pick your area below."
            : geo.kind === "unavailable"
              ? "Location isn't available on this device — pick your area below."
              : null;

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-5 shadow-[var(--shadow-soft)]">
      <div className="space-y-5">
        {/* Where — with geolocation */}
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="field-label" style={{ marginBottom: 8 }}>
            Where are you today?
          </legend>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={answers.area === null}
              onClick={() => setAnswers((p) => ({ ...p, area: null }))}
              className={answers.area === null ? CHIP_ON : CHIP}
            >
              All Bali
            </button>
            {DAY_AREAS.map((a) => {
              const on = answers.area === a.slug;
              return (
                <button
                  key={a.slug}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setAnswers((p) => ({ ...p, area: a.slug }))}
                  className={on ? CHIP_ON : CHIP}
                >
                  {a.name}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={useMyLocation}
              disabled={geo.kind === "locating"}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[var(--lagoon)] px-4 text-sm font-bold text-[var(--lagoon-strong)] disabled:opacity-60"
            >
              📍 {geo.kind === "locating" ? "Locating…" : "Use my location"}
            </button>
            {geoLine && <span className="text-sm text-[var(--muted)]">{geoLine}</span>}
          </div>
        </fieldset>

        <Group legend="Who's with you?" options={GROUP_OPTIONS} selected={answers.group} onSelect={(v) => set("group", v)} />
        <Group legend="What's the vibe?" options={VIBE_OPTIONS} selected={answers.vibe} onSelect={(v) => set("vibe", v)} />
        <Group legend="What's the budget?" options={BUDGET_OPTIONS} selected={answers.budget} onSelect={(v) => set("budget", v)} />
        <Group legend="How should it end?" options={FINISH_OPTIONS} selected={answers.finish} onSelect={(v) => set("finish", v)} />

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={buildDay}
            className="min-h-11 rounded-full bg-[var(--lagoon-strong)] px-6 text-sm font-bold text-white"
          >
            Build my day →
          </button>
          <span className="text-xs text-[var(--muted)]">
            Tap only what matters — skip the rest. Nothing is stored.
          </span>
        </div>
      </div>
    </div>
  );
}
