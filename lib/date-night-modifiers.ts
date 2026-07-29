// Date-night modifier refinement (Intent OS pilot OB-CAN-0011).
//
// Narrows an already-qualifying date-night spoke by the constraint that actually
// decides the evening. This is an EXTENSION of the existing intent-spoke engine,
// not a second engine: it filters `IntentSpoke.venues` and creates no new route,
// no new column and no new query.
//
// Evidence rule (AGENTS.md guardrail 10 — no invented content): a venue is
// included only when its OWN editorial record carries positive evidence for the
// modifier. Absence is never read as satisfaction, and no modifier is inferred
// from an adjacent-but-different signal.
//
// `secluded` is deliberately declared with a null predicate: the live dataset
// carries no secluded/private tag on any venue. Mapping it onto `romantic` would
// be an approximation, so it ships unavailable instead of approximated.

import type { Venue } from "./types";

export type DateNightModifierKey = "quiet" | "sunset-view" | "secluded" | "special-occasion";

export interface DateNightModifier {
  key: DateNightModifierKey;
  label: string; // chip copy
  /** Short, honest description of what the filter actually tests. */
  evidence: string;
  /** null = no field in the dataset can evidence this modifier; ships disabled. */
  matches: ((v: Venue) => boolean) | null;
}

/** Canonical snake_case job slugs, matching lib/intents.ts and normalizeJobs(). */
function jobSlugs(v: Venue): string[] {
  return (v.jobs ?? []).map((j) => j.replace(/-/g, "_"));
}

function tagTokens(v: Venue): string[] {
  return [...(v.vibeTags ?? []), ...(v.practicalTags ?? [])].map((t) =>
    t.toLowerCase().replace(/[\s-]/g, "_")
  );
}

/** Exact tokens that count as positive evidence of a quiet room. */
const QUIET_TOKENS = new Set(["quiet", "quiet_enough_to_talk"]);

export const DATE_NIGHT_MODIFIERS: readonly DateNightModifier[] = [
  {
    key: "quiet",
    label: "Quiet enough to talk",
    evidence: "venue is tagged quiet or quiet-enough-to-talk",
    // Exact allowlist, not substring containment: `includes("quiet")` would also
    // accept a future negating tag such as `not_quiet` or an ambiguous
    // `quiet_unknown`. Only these two tokens are positive evidence.
    matches: (v) => tagTokens(v).some((t) => QUIET_TOKENS.has(t)),
  },
  {
    key: "sunset-view",
    label: "Sunset view",
    evidence: "venue also carries the sunset_drinks_view job",
    // The job slug is exact editorial evidence that the venue is a sunset spot.
    // A bare "view" tag is not used: a rice-field view is not a sunset view.
    matches: (v) => jobSlugs(v).includes("sunset_drinks_view"),
  },
  {
    key: "secluded",
    label: "Secluded",
    evidence: "no field in the dataset records seclusion",
    matches: null,
  },
  {
    key: "special-occasion",
    label: "Special occasion",
    evidence: "venue also carries the special_occasion job",
    // Fixed decision (Intent OS Stage 3): special-occasion is an independent
    // OCCASION, not a child of date-night. It refines, it does not reparent.
    matches: (v) => jobSlugs(v).includes("special_occasion"),
  },
] as const;

export function getModifier(key: string): DateNightModifier | undefined {
  return DATE_NIGHT_MODIFIERS.find((m) => m.key === key);
}

export function isDateNightModifierKey(v: string | undefined): v is DateNightModifierKey {
  return typeof v === "string" && DATE_NIGHT_MODIFIERS.some((m) => m.key === v);
}

/**
 * Plain-data availability view.
 *
 * Deliberately contains NO functions: this crosses the Server -> Client
 * Component boundary, and React cannot serialize a predicate. Carrying the
 * whole `DateNightModifier` (which holds `matches`) would throw at render time
 * the moment the flag is enabled.
 */
export interface ModifierAvailability {
  key: DateNightModifierKey;
  label: string;
  /** Short, honest description of what the filter actually tests. */
  evidence: string;
  /** How many venues in this spoke carry evidence for the modifier. */
  count: number;
  /** A modifier with no predicate, or zero matches here, is not offered. */
  available: boolean;
}

/**
 * Which modifiers are worth offering for this specific venue set.
 * A modifier with zero evidence in the current district is not shown, so the UI
 * never offers a filter that can only return an empty list.
 */
export function modifierAvailability(venues: readonly Venue[]): ModifierAvailability[] {
  return DATE_NIGHT_MODIFIERS.map(({ key, label, evidence, matches }) => {
    const count = matches ? venues.filter((v) => matches(v)).length : 0;
    return { key, label, evidence, count, available: matches !== null && count > 0 };
  });
}

/**
 * The modifier keys a single venue has positive evidence for.
 * Rendered as a `data-refine` attribute so the client filter can narrow
 * server-rendered cards without the server ever reading `searchParams` (which
 * would force this statically generated route to render dynamically).
 */
export function venueModifierKeys(v: Venue): DateNightModifierKey[] {
  return DATE_NIGHT_MODIFIERS.filter((m) => m.matches?.(v)).map((m) => m.key);
}

/**
 * Apply a modifier. Unknown or unavailable modifiers return the full set
 * unchanged, so a hand-edited query string can never silently empty the page.
 *
 * Generic over the venue shape so richer types (e.g. `VenueWithPerk`) survive
 * the filter — narrowing to `Venue` here would silently strip `perk`/`blurb`
 * from the cards the spoke renders.
 */
export function applyModifier<T extends Venue>(
  venues: readonly T[],
  key: string | undefined
): { venues: T[]; applied: DateNightModifierKey | null } {
  if (!isDateNightModifierKey(key)) return { venues: [...venues], applied: null };
  const modifier = getModifier(key);
  if (!modifier?.matches) return { venues: [...venues], applied: null };
  const matches = modifier.matches;
  return { venues: venues.filter((v) => matches(v)), applied: key };
}

/**
 * Feature flag. Default OFF: absent or any value other than "1" disables the
 * refinement entirely and the spoke renders exactly as it does today.
 */
export function dateNightModifiersEnabled(
  env: Record<string, string | undefined> = process.env
): boolean {
  return env.NEXT_PUBLIC_OB_DATE_NIGHT_MODIFIERS === "1";
}

/** The intent this pilot extends. Only this spoke gets the refinement. */
export const DATE_NIGHT_INTENT_SLUG = "date-night";
