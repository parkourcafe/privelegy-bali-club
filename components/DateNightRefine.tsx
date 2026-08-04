"use client";

// Modifier chips for the date-night spoke (Intent OS pilot OB-CAN-0011).
//
// Why the filtering happens here and not on the server: the spoke route is
// statically generated (generateStaticParams + revalidate). Reading
// `searchParams` in the server component forces dynamic rendering for every
// district spoke, which is a performance regression for pages unrelated to this
// pilot. So the server renders the complete set and this component narrows it
// after hydration.
//
// Consequences, all deliberate:
//   * crawlers and no-JS visitors always receive the full, unfiltered list;
//   * critical content is never hydration-dependent (AGENTS.md §7);
//   * a shared `?refine=` link still works — it just paints unfiltered first.

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";
import {
  isDateNightModifierKey,
  type DateNightModifierKey,
  type ModifierAvailability,
} from "@/lib/date-night-modifiers";

export default function DateNightRefine({
  basePath,
  availability,
  districtName,
  noun,
}: {
  basePath: string;
  availability: ModifierAvailability[];
  districtName: string;
  noun: string;
}) {
  const searchParams = useSearchParams();
  const raw = searchParams.get("refine") ?? undefined;
  const offered = availability.filter((a) => a.available);

  // Only an offered modifier may apply. An unknown or unavailable value is
  // ignored, so a hand-edited query string can never empty the page.
  const applied: DateNightModifierKey | null =
    isDateNightModifierKey(raw) && offered.some((a) => a.key === raw) ? raw : null;

  const matchCount = applied ? (offered.find((a) => a.key === applied)?.count ?? 0) : null;
  const lastReported = useRef<string | null>(null);

  useEffect(() => {
    if (!applied) return;
    if (lastReported.current === applied) return;
    lastReported.current = applied;
    // Enum only. No path, no free text, no venue identifier — the brief permits
    // the constraint enum and nothing else.
    track("shortlist_generated", { label: applied });
  }, [applied]);

  if (offered.length === 0) return null;

  return (
    <>
      {/* Hide non-matching server-rendered cards. Attribute selectors mean no
          DOM mutation and no layout thrash. */}
      {applied && (
        <style>{`[data-refine-grid] > [data-refine]:not([data-refine~="${applied}"]){display:none}`}</style>
      )}

      <section className="mt-6" aria-labelledby="refine-heading">
        <h2 id="refine-heading" className="text-sm font-semibold text-[var(--muted)]">
          Narrow it down
        </h2>
        {/* These are navigation links, not form controls: each is a real URL and
            must stay independently tabbable. `aria-current` conveys the active
            state honestly, where role="radio" would promise arrow-key roving
            navigation that links do not provide. */}
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={basePath}
            aria-current={applied === null ? "true" : undefined}
            scroll={false}
            className={`flex min-h-[44px] items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              applied === null
                ? "border-[var(--ink)] text-[var(--ink)]"
                : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            Any
          </Link>
          {offered.map(({ key, label, evidence, count }) => {
            const isOn = applied === key;
            return (
              <Link
                key={key}
                href={isOn ? basePath : `${basePath}?refine=${key}`}
                aria-current={isOn ? "true" : undefined}
                scroll={false}
                title={evidence}
                className={`flex min-h-[44px] items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  isOn
                    ? "border-[var(--ink)] text-[var(--ink)]"
                    : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                {label}
                <span className="ml-2 text-xs font-normal opacity-70">{count}</span>
              </Link>
            );
          })}
        </div>

        {/* A modifier is only offered when count > 0, so this is a safety net
            rather than an expected state — but it must never show a blank grid. */}
        {applied !== null && matchCount === 0 && (
          <div className="mt-6 rounded-2xl border border-[var(--line)] p-6">
            <h3 className="section-title">No verified match</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              No {districtName} venue currently has verified evidence for this constraint.
              Rather than guess, we leave it out.
            </p>
            <Link href={basePath} className="quiet-link mt-4 inline-block text-sm font-semibold">
              Show all {noun} in {districtName}
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
