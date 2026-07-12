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

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function buildHref(parts: Choice[], missionSlug: string, durationSlug: string) {
  const params = new URLSearchParams();
  // Mission tags lead the brief (primary intent), so keep a slightly wider cap.
  const query = unique(parts.flatMap((part) => part.query)).slice(0, 8);
  const district = parts.find((part) => part.district)?.district;
  const category = [...parts].reverse().find((part) => part.category)?.category;

  if (query.length > 0) params.set("q", query.join(" "));
  if (district) params.set("district", district);
  if (category) params.set("category", category);
  if (missionSlug) params.set("m", missionSlug);
  if (durationSlug) params.set("dur", durationSlug);
  params.set("intent", "1");

  const qs = params.toString();
  return `/places?${qs}`;
}

export default function DayIntentBuilder() {
  const [mission, setMission] = useState(missionOptions[0].value);
  const [duration, setDuration] = useState(durationOptions[0].value);
  const [spend, setSpend] = useState(spendOptions[2].value);
  const [feel, setFeel] = useState(feelOptions[2].value);
  const [district, setDistrict] = useState(districtOptions[0].value);
  const [group, setGroup] = useState(groupOptions[1].value);
  const [finish, setFinish] = useState(finishOptions[0].value);

  // Mission + duration lead the brief; the explicit district/spend/finish
  // choices still win on category/district via buildHref precedence.
  const selected = useMemo(
    () => [
      missionOptions.find((option) => option.value === mission)!,
      durationOptions.find((option) => option.value === duration)!,
      spendOptions.find((option) => option.value === spend)!,
      feelOptions.find((option) => option.value === feel)!,
      districtOptions.find((option) => option.value === district)!,
      groupOptions.find((option) => option.value === group)!,
      finishOptions.find((option) => option.value === finish)!,
    ],
    [mission, duration, spend, feel, district, group, finish]
  );

  const href = useMemo(() => buildHref(selected, mission, duration), [selected, mission, duration]);
  const missionChoice = selected[0];
  const durationChoice = selected[1];
  const summary = `${missionChoice.label.toLowerCase()} · ${durationChoice.label.toLowerCase()} · ${selected[3].label.toLowerCase()}`;

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

      <div className="mt-5 space-y-4">
        <ChoiceGroup
          label="What kind of Bali are you here for?"
          options={missionOptions}
          selected={mission}
          onSelect={setMission}
          wash="ob-wash-dawn"
        />
        <ChoiceGroup
          label="How long are you here?"
          options={durationOptions}
          selected={duration}
          onSelect={setDuration}
          wash="ob-wash-island"
        />
        <ChoiceGroup
          label="How do you want to spend it?"
          options={spendOptions}
          selected={spend}
          onSelect={setSpend}
          wash="ob-wash-dawn"
        />
        <ChoiceGroup
          label="What do you want to feel?"
          options={feelOptions}
          selected={feel}
          onSelect={setFeel}
          wash="ob-wash-feel"
        />
        <ChoiceGroup
          label="Where are you today?"
          options={districtOptions}
          selected={district}
          onSelect={setDistrict}
          wash="ob-wash-island"
        />
        <ChoiceGroup
          label="Who are you with?"
          options={groupOptions}
          selected={group}
          onSelect={setGroup}
          wash="ob-wash-group"
        />
        <ChoiceGroup
          label="How should it end?"
          options={finishOptions}
          selected={finish}
          onSelect={setFinish}
          wash="ob-wash-finish"
        />
      </div>

      <div
        key={pulseKey}
        className={`mt-5 rounded-2xl bg-black/18 p-3 ${pulseKey > 0 ? "ob-brief-pulse" : ""}`}
        aria-live="polite"
      >
        <p className="text-xs font-semibold uppercase text-[var(--ob-brass-2)]">
          Your map brief
        </p>
        <p className="mt-1 font-display text-sm italic text-[var(--ob-sand)]">{summary}</p>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
        <Link
          href={href}
          className="ob-cta-shimmer rounded-full bg-[var(--ob-sand)] px-5 py-3 text-center text-sm font-semibold text-[var(--ob-espresso)] transition-transform hover:-translate-y-0.5"
        >
          Show my top 3
        </Link>
        <Link
          href="/places"
          className="rounded-full border border-[var(--ob-line)] px-5 py-3 text-center text-sm font-semibold text-[var(--ob-sand)] transition-colors hover:bg-white/5"
        >
          All places
        </Link>
      </div>
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
  selected: string;
  onSelect: (value: string) => void;
  wash?: string;
}) {
  return (
    <fieldset>
      <legend className="text-xs font-semibold text-[var(--ob-stone)]">{label}</legend>
      <div className="mt-2 flex max-w-full snap-x gap-2 overflow-x-auto pb-1">
        {options.map((option) => {
          const active = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              data-active={active ? "true" : "false"}
              className={`ob-choice ${wash ?? ""} min-w-[8.5rem] snap-start rounded-2xl border px-3 py-2 text-left ${
                active
                  ? "border-[var(--ob-brass)] bg-[var(--ob-brass)]/18 text-[var(--ob-sand)]"
                  : "border-[var(--ob-line)] bg-white/[0.03] text-[var(--ob-sand-dim)] hover:border-[var(--ob-brass)]/55"
              }`}
            >
              <span className="block text-sm font-semibold">{option.label}</span>
              <span className="mt-0.5 block text-[11px] leading-snug text-[var(--ob-stone)]">
                {option.hint}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
