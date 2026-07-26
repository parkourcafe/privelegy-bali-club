"use client";

import Link from "next/link";
import { useState } from "react";

type DecisionPlace = {
  placeId: string;
  name: string;
  why: string | null;
  notIdealIf: string | null;
};

type DecisionResult = {
  bestFit: DecisionPlace | null;
  backup: DecisionPlace | null;
  contrast: DecisionPlace | null;
  emptyStateReason: string | null;
};

type DecisionResponse = {
  data?: {
    ok: boolean;
    result?: DecisionResult;
  };
  error?: { message?: string };
};

const MOMENTS = [
  { value: "brunch_after_surf", label: "Brunch" },
  { value: "date_night_special", label: "Date night" },
  { value: "local_food_calm", label: "Calm local food" },
] as const;

function mapsSearchHref(name: string, areaLabel: string) {
  const query = new URLSearchParams({
    api: "1",
    query: `${name} ${areaLabel} Bali`,
  });
  return `https://www.google.com/maps/search/?${query.toString()}`;
}

export default function DecisionRail({
  area,
  areaLabel,
}: {
  area: string;
  areaLabel: string;
}) {
  const [moment, setMoment] = useState<(typeof MOMENTS)[number]["value"]>("brunch_after_surf");
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [view, setView] = useState<"list" | "map">("list");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  async function decide(nextMoment: typeof moment) {
    setMoment(nextMoment);
    setState("loading");
    setResult(null);
    try {
      const response = await fetch("/api/v1/decisions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify({ context: { area, moment: nextMoment } }),
      });
      const payload = (await response.json()) as DecisionResponse;
      if (!response.ok || !payload.data?.ok || !payload.data.result) throw new Error(payload.error?.message);
      setResult(payload.data.result);
      setState("idle");
    } catch {
      setState("error");
    }
  }

  const places = result
    ? [
        ["Best fit", result.bestFit],
        ["Backup", result.backup],
        ["Contrast", result.contrast],
      ].filter((entry): entry is [string, DecisionPlace] => Boolean(entry[1]))
    : [];

  return (
    <section className="decision-rail" aria-labelledby={`${area}-decision-title`}>
      <div className="decision-rail-head">
        <div>
          <p className="eyebrow">Decide with verified places</p>
          <h2 id={`${area}-decision-title`}>What fits right now in {areaLabel}?</h2>
        </div>
        {places.length > 0 ? (
          <div className="decision-view-toggle" aria-label="Result view">
            <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")}>List</button>
            <button type="button" aria-pressed={view === "map"} onClick={() => setView("map")}>Map</button>
          </div>
        ) : null}
      </div>

      <div className="decision-moments" aria-label="Choose a moment">
        {MOMENTS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={moment === option.value && Boolean(result)}
            disabled={state === "loading"}
            onClick={() => decide(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {state === "loading" ? <p className="decision-status" role="status">Choosing from published places…</p> : null}
      {state === "error" ? (
        <p className="decision-status" role="alert">
          The live shortlist is unavailable. <Link href={`/places?district=${encodeURIComponent(area)}`}>Browse {areaLabel} places</Link>.
        </p>
      ) : null}
      {result?.emptyStateReason ? (
        <p className="decision-status">
          No verified shortlist for this exact moment yet. <Link href={`/places?district=${encodeURIComponent(area)}`}>See all published places</Link>.
        </p>
      ) : null}

      {places.length > 0 ? (
        <div className="decision-results" data-view={view}>
          {places.map(([role, place]) => (
            <article className="decision-result-card" key={place.placeId}>
              <span>{role}</span>
              <h3>{place.name}</h3>
              {place.why ? <p>{place.why}</p> : null}
              {place.notIdealIf ? <small>Skip if: {place.notIdealIf}</small> : null}
              {view === "map" ? (
                <a href={mapsSearchHref(place.name, areaLabel)} target="_blank" rel="noreferrer">
                  Open Maps search ↗
                </a>
              ) : (
                <Link href={`/places/${place.placeId}`}>Open verified profile →</Link>
              )}
            </article>
          ))}
        </div>
      ) : null}
      <p className="decision-disclosure">Editorial fit, not a paid ranking. Map mode opens a named Google Maps search, not a guessed pin.</p>
    </section>
  );
}
