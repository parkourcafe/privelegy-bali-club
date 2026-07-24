"use client";

import { useMemo, useState } from "react";
import type { PlanBySlot } from "@/lib/data";
import { VIBES } from "@/lib/vibes";
import { MOMENTS, getMoment, venueFitsMoment } from "@/lib/moments";
import VenueCard from "@/components/VenueCard";
import VenueVisual from "@/components/VenueVisual";

const categoryLabel: Record<string, string> = {
  cafe: "Café",
  warung: "Warung",
  restaurant: "Restaurant",
  beach_club: "Beach club",
  spa: "Spa",
  bar: "Bar",
  surf: "Surf",
};

export default function PlanView({
  plan,
  initialMoment,
}: {
  plan: PlanBySlot[];
  initialMoment?: string;
}) {
  const [momentSlug, setMomentSlug] = useState<string | null>(
    getMoment(initialMoment)?.slug ?? null
  );
  const [area, setArea] = useState<string | null>(null);
  const [vibe, setVibe] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const moment = getMoment(momentSlug);

  const categories = useMemo(() => {
    const set = new Set<string>();
    plan.forEach((b) => b.venues.forEach((v) => set.add(v.category)));
    return [...set];
  }, [plan]);

  const areas = useMemo(() => {
    const set = new Set<string>();
    plan.forEach((b) => b.venues.forEach((v) => v.area && set.add(v.area)));
    return [...set].sort();
  }, [plan]);

  const filtered = useMemo(
    () =>
      plan
        .filter((b) => !moment?.slots || moment.slots.includes(b.slot))
        .map((b) => ({
          ...b,
          venues: b.venues.filter(
            (v) =>
              (!moment || venueFitsMoment(v, moment)) &&
              (!area || v.area === area) &&
              (!vibe || (v.vibeTags ?? []).includes(vibe)) &&
              (!category || v.category === category)
          ),
        }))
        .filter((b) => b.venues.length > 0),
    [plan, moment, area, vibe, category]
  );

  const decisionPicks = useMemo(
    () =>
      filtered
        .map((block) => ({
          block,
          best: block.venues[0],
          backup: block.venues[1],
          contrast: block.venues.find((venue) => venue.notFor) ?? block.venues[2],
        }))
        .filter(({ best }) => Boolean(best))
        .slice(0, 4),
    [filtered],
  );

  return (
    <>
      {/* Moment picker — static scenarios (buttons → predefined filters, §6) */}
      <div className="moment-strip">
        {MOMENTS.map((m) => {
          const on = momentSlug === m.slug;
          return (
            <button
              key={m.slug}
              type="button"
              aria-pressed={on}
              onClick={() => setMomentSlug(on ? null : m.slug)}
              className={`moment-card ${on ? "moment-card-active" : ""}`}
            >
              <span className="moment-label">{m.label}</span>
              <span className="moment-tagline">{m.tagline}</span>
            </button>
          );
        })}
      </div>

      <div className="filter-panel">
        {areas.length > 1 && (
          <Chips label="Area" options={areas} selected={area} onSelect={setArea} />
        )}
        <Chips
          label="Vibe"
          options={VIBES as readonly string[]}
          selected={vibe}
          onSelect={setVibe}
        />
        <Chips
          label="Type"
          options={categories}
          selected={category}
          onSelect={setCategory}
          render={(c) => categoryLabel[c] ?? c}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-[var(--muted)]">
          Nothing matches that combo. Clear a filter.
        </p>
      ) : (
        <div>
          <section className="result-triptych" aria-labelledby="result-triptych-title">
            <div className="result-triptych-header">
              <p className="topline">Decision-first view</p>
              <h2 id="result-triptych-title">Start with the best fits, then open detail if needed.</h2>
              <p>
                We show one strong fit per daypart first. The full list stays below for travellers who want to compare more.
              </p>
            </div>
            <div className="result-triptych-grid">
              {decisionPicks.map(({ block, best, backup, contrast }) => (
                <article key={block.slot} className="result-triptych-card">
                  <div className="result-triptych-media">
                    <VenueVisual name={best.name} category={best.category} photoUrl={best.photoUrl} />
                  </div>
                  <div className="result-triptych-body">
                    <p className="result-triptych-slot">{block.label}</p>
                    <h3>{best.name}</h3>
                    <p className="result-triptych-reason">{best.bestFor ?? best.blurb}</p>
                    <div className="result-triptych-chips">
                      <span>Best fit</span>
                      {backup ? <span>Backup: {backup.name}</span> : null}
                      {contrast ? <span>Check: {contrast.notFor ? contrast.notFor : contrast.name}</span> : null}
                    </div>
                    <a href={`#${block.slot}`} className="result-triptych-action">
                      Compare {block.label.toLowerCase()} options →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
          {filtered.map((block) => (
            <section key={block.slot} id={block.slot} className="slot-section scroll-mt-8">
              <div className="slot-heading">
                <h2>{block.label}</h2>
                <p>{block.hint}</p>
              </div>
              <ul className="venue-list">
                {block.venues.map((v) => (
                  <li key={v.slug}>
                    <VenueCard v={v} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}

function Chips({
  label,
  options,
  selected,
  onSelect,
  render,
}: {
  label: string;
  options: readonly string[];
  selected: string | null;
  onSelect: (v: string | null) => void;
  render?: (v: string) => string;
}) {
  if (options.length === 0) return null;
  return (
    <div className="chip-row">
      <span className="chip-label">{label}</span>
      {options.map((o) => {
        const on = selected === o;
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onSelect(on ? null : o)}
            className={`chip ${on ? "chip-active" : ""}`}
          >
            {render ? render(o) : o}
          </button>
        );
      })}
    </div>
  );
}
