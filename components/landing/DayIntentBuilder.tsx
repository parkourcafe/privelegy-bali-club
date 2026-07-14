"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { TRIP_MISSIONS, TRIP_DURATIONS } from "@/lib/trip-missions";

type Choice = {
  value: string;
  label: string;
  hint: string;
  query: string[];
  district?: string;
  category?: string;
};

// Trip Missions + duration (master §6a) as the two top questions. Reuse the
// shared static config so scenario pages and the builder stay in sync.
const missionOptions: Choice[] = TRIP_MISSIONS.map((m) => ({
  value: m.slug,
  label: m.label,
  hint: m.hint,
  query: m.query,
  category: m.category,
  district: m.district,
}));

const durationOptions: Choice[] = TRIP_DURATIONS.map((d) => ({
  value: d.slug,
  label: d.label,
  hint: d.hint,
  query: d.query ?? [],
}));

const spendOptions: Choice[] = [
  {
    value: "slow",
    label: "Slow start",
    hint: "Coffee, breakfast, no rush",
    query: ["cafe", "brunch", "quiet"],
    category: "cafe",
  },
  {
    value: "work",
    label: "Work and reset",
    hint: "Laptop time, then a good meal",
    query: ["work-friendly", "quiet", "cafe"],
    category: "cafe",
  },
  {
    value: "beach",
    label: "Beach day",
    hint: "Sun, swim, sunset",
    query: ["view", "beach", "sunset"],
    category: "beach_club",
  },
  {
    value: "food",
    label: "Food crawl",
    hint: "Lunch, dinner, something worth ordering",
    query: ["restaurant", "group", "dinner"],
    category: "restaurant",
  },
];

const feelOptions: Choice[] = [
  { value: "quiet", label: "Quiet", hint: "Calm and easy", query: ["quiet"] },
  { value: "local", label: "Local", hint: "Less polished, more Bali", query: ["warung"] },
  { value: "view", label: "A view", hint: "Ocean, ricefield, sunset", query: ["view"] },
  { value: "romantic", label: "Romantic", hint: "Date energy", query: ["romantic", "date"] },
  { value: "lively", label: "Lively", hint: "Music, people, evening", query: ["lively"] },
  { value: "reset", label: "Reset", hint: "Spa, surf, softer pace", query: ["reset", "wellness"] },
];

const districtOptions: Choice[] = [
  { value: "all", label: "All Bali", hint: "Let the map stay wide", query: [] },
  { value: "canggu", label: "Canggu", hint: "Deepest local layer", query: [], district: "canggu" },
  { value: "ubud", label: "Ubud", hint: "Culture, jungle, slower days", query: [], district: "ubud" },
  { value: "seminyak", label: "Seminyak", hint: "Dinner, shopping, polished nights", query: [], district: "seminyak" },
  { value: "uluwatu", label: "Uluwatu", hint: "Cliffs, beaches, sunset", query: [], district: "uluwatu-bukit" },
  { value: "sanur", label: "Sanur", hint: "Easy, family, sunrise", query: [], district: "sanur" },
  { value: "nusa-dua", label: "Nusa Dua", hint: "Resorts and calm beaches", query: [], district: "nusa-dua" },
];

const groupOptions: Choice[] = [
  { value: "solo", label: "Solo", hint: "Easy to enter, no big plan", query: ["quiet", "walk-in-friendly"] },
  { value: "couple", label: "Date / partner", hint: "Good for two", query: ["romantic", "date"] },
  { value: "family", label: "Family", hint: "Comfortable with kids", query: ["family", "kid-friendly"] },
  { value: "friends", label: "Friends", hint: "Share plates, good energy", query: ["group", "lively"] },
];

const finishOptions: Choice[] = [
  { value: "sunset", label: "Sunset", hint: "End with a view", query: ["sunset", "view"] },
  { value: "dinner", label: "Dinner", hint: "A real table after dark", query: ["dinner", "restaurant"], category: "restaurant" },
  { value: "special", label: "Special occasion", hint: "Worth dressing for", query: ["special", "romantic"] },
  { value: "early", label: "Early night", hint: "Good food, easy exit", query: ["family", "quiet"] },
];

// One-tap moments: the primary, default way to use the builder. Each is a real
// link straight to a filtered /places, so a traveller picks the moment they're
// in and lands on the map — no questions required. Hrefs mirror the working
// "moments" cards on the homepage so the results are never empty. The full
// seven-axis brief is optional and lives behind the "Fine-tune" toggle.
const quickStarts: { label: string; hint: string; href: string }[] = [
  { label: "Slow morning", hint: "Coffee & a calm table", href: "/places?intent=1&q=cafe%20quiet&category=cafe" },
  { label: "Beach day", hint: "Sun, swim, sunset", href: "/places?intent=1&q=sunset%20view&category=beach_club" },
  { label: "Food crawl", hint: "Lunch & dinner worth ordering", href: "/places?intent=1&q=dinner%20restaurant&category=restaurant" },
  { label: "Date night", hint: "A table for two", href: "/places?intent=1&q=romantic%20date&category=restaurant" },
];

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

type AxisKey = "mission" | "duration" | "spend" | "feel" | "district" | "group" | "finish";

const AXES: { key: AxisKey; legend: string; options: Choice[]; wash: string }[] = [
  { key: "mission", legend: "What kind of Bali are you here for?", options: missionOptions, wash: "ob-wash-dawn" },
  { key: "duration", legend: "How long are you here?", options: durationOptions, wash: "ob-wash-island" },
  { key: "spend", legend: "How do you want to spend it?", options: spendOptions, wash: "ob-wash-dawn" },
  { key: "feel", legend: "What do you want to feel?", options: feelOptions, wash: "ob-wash-feel" },
  { key: "district", legend: "Where are you today?", options: districtOptions, wash: "ob-wash-island" },
  { key: "group", legend: "Who are you with?", options: groupOptions, wash: "ob-wash-group" },
  { key: "finish", legend: "How should it end?", options: finishOptions, wash: "ob-wash-finish" },
];

function buildHref(parts: Choice[], missionSlug: string, durationSlug: string) {
  const params = new URLSearchParams();
  // Only the axes the traveller actually chose reach the brief (audit 2026-07 —
  // no silent defaults). Mission tags lead, so keep a slightly wider cap.
  const query = unique(parts.flatMap((part) => part.query)).slice(0, 8);
  const district = parts.find((part) => part.district)?.district;
  const category = [...parts].reverse().find((part) => part.category)?.category;

  if (query.length > 0) params.set("q", query.join(" "));
  if (district) params.set("district", district);
  if (category) params.set("category", category);
  if (missionSlug) params.set("m", missionSlug);
  if (durationSlug) params.set("dur", durationSlug);
  // "Top picks for your brief" mode only makes sense when there is something to
  // match on — otherwise land on the plain, unranked catalogue.
  if (query.length > 0 || district || category) params.set("intent", "1");

  const qs = params.toString();
  return qs ? `/places?${qs}` : "/places";
}

export default function DayIntentBuilder() {
  // Nothing is pre-selected: every axis starts empty so the brief carries ONLY
  // what the traveller taps (audit 2026-07 — silent defaults like beach/couple/
  // sunset used to bias the shortlist behind their back). Tapping a selected
  // option again clears it.
  const [choices, setChoices] = useState<Partial<Record<AxisKey, string>>>({});
  // The seven-axis builder is advanced/optional — collapsed by default so the
  // column leads with one obvious action (pick a moment) instead of a wall.
  const [expanded, setExpanded] = useState(false);

  function toggle(axis: AxisKey, value: string) {
    setChoices((prev) => {
      const next = { ...prev };
      if (next[axis] === value) delete next[axis];
      else next[axis] = value;
      return next;
    });
  }

  const selected = useMemo(
    () =>
      AXES.map((axis) => {
        const value = choices[axis.key];
        return value ? axis.options.find((option) => option.value === value) ?? null : null;
      }).filter((choice): choice is Choice => choice !== null),
    [choices]
  );

  const href = useMemo(
    () => buildHref(selected, choices.mission ?? "", choices.duration ?? ""),
    [selected, choices.mission, choices.duration]
  );

  const hasBrief = selected.length > 0;
  const summary = useMemo(
    () => selected.map((choice) => choice.label.toLowerCase()).join(" · "),
    [selected]
  );

  // Visual only: re-key the brief box when the summary changes so it pulses
  // softly (ob-brief-pulse). Selection logic and the built URL are untouched.
  const [pulseKey, setPulseKey] = useState(0);
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setPulseKey((k) => k + 1);
  }, [summary, href]);

  return (
    <section
      id="day-builder"
      className="ob-float w-full max-w-[25rem] overflow-hidden rounded-3xl border border-[var(--ob-line)] bg-[var(--ob-espresso-2)]/88 p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md sm:p-5"
      aria-label="Build your Bali day"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-[var(--ob-brass)]">Build your Bali</p>
          <h2 className="mt-2 font-display text-2xl font-semibold leading-tight">
            Tell us the trip. Get the shortlist.
          </h2>
        </div>
        <span className="rounded-full border border-[var(--ob-line)] px-3 py-1 text-xs text-[var(--ob-sand-dim)]">
          Bali
        </span>
      </div>

      {/* DEFAULT (simple) view — one obvious job: pick the moment you're in and
          land on a filtered map. No wall of questions; the full seven-axis
          brief is optional and tucked behind "Fine-tune" below. */}
      <p className="mt-4 text-sm leading-relaxed text-[var(--ob-sand-dim)]">
        What&rsquo;s today about? Tap a moment — we&rsquo;ll open the map.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {quickStarts.map((q) => (
          <Link
            key={q.label}
            href={q.href}
            className="group rounded-2xl border border-[var(--ob-line)] bg-white/[0.04] px-3.5 py-3 transition-colors hover:border-[var(--ob-brass)] hover:bg-[var(--ob-brass)]/10"
          >
            <span className="flex items-center justify-between gap-1">
              <span className="text-sm font-semibold text-[var(--ob-sand)]">{q.label}</span>
              <span className="text-[var(--ob-brass-2)] transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
            <span className="mt-0.5 block text-[11px] leading-snug text-[var(--ob-sand-dim)]">
              {q.hint}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <Link
          href="/places"
          className="text-sm font-semibold text-[var(--ob-sand-dim)] underline-offset-4 transition-colors hover:text-[var(--ob-sand)] hover:underline"
        >
          Browse all places →
        </Link>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls="day-builder-fine-tune"
          className="inline-flex items-center gap-1 rounded-full border border-[var(--ob-line)] px-3.5 py-1.5 text-xs font-semibold text-[var(--ob-sand)] transition-colors hover:border-[var(--ob-brass)]/55"
        >
          {expanded ? "Hide fine-tune" : "Fine-tune your day"}
          <span className={`transition-transform ${expanded ? "rotate-180" : ""}`}>▾</span>
        </button>
      </div>

      {/* FINE-TUNE — the full seven-axis brief. Collapsed by default; only power
          users who want a tailored shortlist open it. */}
      {expanded && (
        <div id="day-builder-fine-tune" className="mt-5 border-t border-[var(--ob-line)] pt-5">
          <p className="text-xs font-semibold text-[var(--ob-sand-dim)]">
            Tap only what matters — skip the rest. The list updates as you choose.
          </p>

          <div className="mt-4 space-y-4">
            {AXES.map((axis) => (
              <ChoiceGroup
                key={axis.key}
                label={axis.legend}
                options={axis.options}
                selected={choices[axis.key] ?? null}
                onSelect={(value) => toggle(axis.key, value)}
                wash={axis.wash}
              />
            ))}
          </div>

          <div
            key={pulseKey}
            className={`mt-5 rounded-2xl bg-black/18 p-3 ${pulseKey > 0 ? "ob-brief-pulse" : ""}`}
            aria-live="polite"
          >
            <p className="text-xs font-semibold uppercase text-[var(--ob-brass-2)]">
              Your map brief
            </p>
            <p className="mt-1 font-display text-sm italic text-[var(--ob-sand)]">
              {hasBrief ? summary : "Nothing preselected — tap only what matters, skip the rest."}
            </p>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
            <Link
              href={href}
              className="ob-cta-shimmer rounded-full bg-[var(--ob-sand)] px-5 py-3 text-center text-sm font-semibold text-[var(--ob-espresso)] transition-transform hover:-translate-y-0.5"
            >
              {hasBrief ? "Show my top 3 places" : "Browse all places"}
            </Link>
            <Link
              href="/places"
              className="rounded-full border border-[var(--ob-line)] px-5 py-3 text-center text-sm font-semibold text-[var(--ob-sand)] transition-colors hover:bg-white/5"
            >
              All places
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

function ChoiceGroup({
  label,
  options,
  selected,
  onSelect,
  wash,
}: {
  label: string;
  options: Choice[];
  selected: string | null;
  onSelect: (value: string) => void;
  wash?: string;
}) {
  return (
    <fieldset>
      <legend className="text-xs font-semibold text-[var(--ob-sand-dim)]">{label}</legend>
      {/* Two-column grid: every option is visible at once (no horizontal
          scroll, nothing sliced off the right edge). Each button is a toggle —
          aria-pressed announces selected state and a second tap clears it. */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        {options.map((option) => {
          const active = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(option.value)}
              data-active={active ? "true" : "false"}
              className={`ob-choice ${wash ?? ""} rounded-2xl border px-3 py-2 text-left ${
                active
                  ? "border-[var(--ob-brass)] bg-[var(--ob-brass)]/18 text-[var(--ob-sand)]"
                  : "border-[var(--ob-line)] bg-white/[0.04] text-[var(--ob-sand)] hover:border-[var(--ob-brass)]/55"
              }`}
            >
              <span className="block text-sm font-semibold">{option.label}</span>
              <span className="mt-0.5 block text-[11px] leading-snug text-[var(--ob-sand-dim)]">
                {option.hint}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
