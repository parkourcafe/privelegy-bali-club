"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Choice = {
  value: string;
  label: string;
  hint: string;
  query: string[];
  district?: string;
  category?: string;
};

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
  { value: "canggu", label: "Canggu", hint: "Beta area, deepest layer", query: [], district: "canggu" },
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

function buildHref(parts: Choice[]) {
  const params = new URLSearchParams();
  const query = unique(parts.flatMap((part) => part.query)).slice(0, 5);
  const district = parts.find((part) => part.district)?.district;
  const category = [...parts].reverse().find((part) => part.category)?.category;

  if (query.length > 0) params.set("q", query.join(" "));
  if (district) params.set("district", district);
  if (category) params.set("category", category);
  params.set("intent", "1");

  const qs = params.toString();
  return `/places?${qs}`;
}

export default function DayIntentBuilder() {
  const [spend, setSpend] = useState(spendOptions[2].value);
  const [feel, setFeel] = useState(feelOptions[2].value);
  const [district, setDistrict] = useState(districtOptions[0].value);
  const [group, setGroup] = useState(groupOptions[1].value);
  const [finish, setFinish] = useState(finishOptions[0].value);

  const selected = useMemo(
    () => [
      spendOptions.find((option) => option.value === spend)!,
      feelOptions.find((option) => option.value === feel)!,
      districtOptions.find((option) => option.value === district)!,
      groupOptions.find((option) => option.value === group)!,
      finishOptions.find((option) => option.value === finish)!,
    ],
    [spend, feel, district, group, finish]
  );

  const href = useMemo(() => buildHref(selected), [selected]);
  const summary = `${selected[0].label.toLowerCase()}, ${selected[1].label.toLowerCase()}, ${selected[3].label.toLowerCase()}`;

  return (
    <section
      id="day-builder"
      className="ob-float w-full max-w-[25rem] overflow-hidden rounded-3xl border border-[var(--ob-line)] bg-[var(--ob-espresso-2)]/88 p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md sm:p-5"
      aria-label="Build your Bali day"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-[var(--ob-brass)]">Build today</p>
          <h2 className="mt-2 font-display text-2xl font-semibold leading-tight">
            Tell us the day. Get the map.
          </h2>
        </div>
        <span className="rounded-full border border-[var(--ob-line)] px-3 py-1 text-xs text-[var(--ob-sand-dim)]">
          Bali
        </span>
      </div>

      <div className="mt-5 space-y-4">
        <ChoiceGroup
          label="How do you want to spend it?"
          options={spendOptions}
          selected={spend}
          onSelect={setSpend}
        />
        <ChoiceGroup
          label="What do you want to feel?"
          options={feelOptions}
          selected={feel}
          onSelect={setFeel}
        />
        <ChoiceGroup
          label="Where are you today?"
          options={districtOptions}
          selected={district}
          onSelect={setDistrict}
        />
        <ChoiceGroup
          label="Who are you with?"
          options={groupOptions}
          selected={group}
          onSelect={setGroup}
        />
        <ChoiceGroup
          label="How should it end?"
          options={finishOptions}
          selected={finish}
          onSelect={setFinish}
        />
      </div>

      <div className="mt-5 rounded-2xl bg-black/18 p-3">
        <p className="text-xs font-semibold uppercase text-[var(--ob-brass-2)]">
          Your map brief
        </p>
        <p className="mt-1 text-sm text-[var(--ob-sand-dim)]">{summary}</p>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
        <Link
          href={href}
          className="rounded-full bg-[var(--ob-sand)] px-5 py-3 text-center text-sm font-semibold text-[var(--ob-espresso)] transition-transform hover:-translate-y-0.5"
        >
          Build my map
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
}: {
  label: string;
  options: Choice[];
  selected: string;
  onSelect: (value: string) => void;
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
              className={`min-w-[8.5rem] snap-start rounded-2xl border px-3 py-2 text-left transition ${
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
