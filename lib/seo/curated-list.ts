import type { Venue } from "@/lib/types";

// Selection for the Bali-wide "best <category>" guides.
//
// Why this exists: /best-restaurants-in-bali rendered every indexable
// restaurant in the catalogue — 700+ names on one page — and put all of them in
// its ItemList. A page titled "best" that lists the entire category is a
// catalogue, and an auto-expanded catalogue of thin entries is what Google's
// spam policy calls scaled content abuse. The guide page standard says the same
// thing from the other side: a listing entry must carry a card (an editorial
// sentence, Best for, Not for, price), and a bare `Name · area` link carries
// none of that.
//
// The selection signal is deliberately NOT a new editorial score. It is the
// record itself: a venue earns a place on a "best" page when we have actually
// written it up. That keeps the page honest under AGENTS.md #10 (no invented
// content) and #7 (nothing can be bought) — tier, partner status and
// isSponsored are never read here, and there is a test that says so.

/** Fields a card needs before a venue may be presented as a considered pick. */
export function hasCardCopy(v: Venue): boolean {
  return Boolean(v.whyItsHere?.trim()) && Boolean(v.bestFor?.trim());
}

function hasPrice(v: Venue): boolean {
  return Boolean(v.priceAnchor?.trim() || v.priceText?.trim() || v.priceMinIdr || v.priceMaxIdr);
}

const DAY_MS = 24 * 60 * 60 * 1000;
const FRESH_WINDOW_DAYS = 180;

function verifiedTime(v: Venue): number {
  const parsed = v.lastVerifiedAt ? new Date(v.lastVerifiedAt).getTime() : Number.NaN;
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * How complete the record is, 0–4. Ordering by this puts the venues we can
 * actually describe at the top; it reads nothing a partner could influence.
 */
export function recordDepth(v: Venue, now = Date.now()): number {
  let score = 0;
  if (v.notFor?.trim()) score += 1;
  if (hasPrice(v)) score += 1;
  if (v.whatToOrder?.trim()) score += 1;
  const verified = verifiedTime(v);
  if (verified && now - verified <= FRESH_WINDOW_DAYS * DAY_MS) score += 1;
  return score;
}

export interface CuratedSelection<T> {
  /** The venues the page renders and puts in its ItemList. */
  picks: T[];
  /** How many passed the card bar but did not fit the cap. */
  overflow: number;
  /** How many were excluded because the record cannot support a card. */
  withoutCardCopy: number;
}

/**
 * Pick the venues a "best" page should actually show.
 *
 * Deterministic: depth, then most recently verified, then name. Two builds of
 * the same data produce the same page, so the sitemap's lastmod stays honest.
 */
export function selectCurated<T extends Venue>(
  venues: readonly T[],
  { limit, now = Date.now() }: { limit: number; now?: number },
): CuratedSelection<T> {
  const eligible = venues.filter(hasCardCopy);
  const ranked = [...eligible].sort(
    (a, b) =>
      recordDepth(b, now) - recordDepth(a, now) ||
      verifiedTime(b) - verifiedTime(a) ||
      a.name.localeCompare(b.name),
  );
  return {
    picks: ranked.slice(0, limit),
    overflow: Math.max(0, ranked.length - limit),
    withoutCardCopy: venues.length - eligible.length,
  };
}

export interface AreaCuration<T, A> {
  /** Areas that kept at least one pick, in the order given. */
  areas: (A & { venues: T[] })[];
  /** Every rendered pick, flattened — use this for the ItemList. */
  shown: T[];
  /** Published venues in the category that the page does not show. */
  remaining: number;
  /** Most recent verification date among the rendered picks, or null. */
  lastChecked: string | null;
}

/**
 * The whole shortlist step for a Bali-wide "best" guide: curate within each
 * area so one dense district cannot swallow the page, then spend a page-wide
 * budget in area order.
 */
export function curateByArea<T extends Venue, A extends { key: string }>(
  venues: readonly T[],
  areas: readonly A[],
  { maxPicks, maxPerArea, now = Date.now() }: { maxPicks: number; maxPerArea: number; now?: number },
): AreaCuration<T, A> {
  let budget = maxPicks;
  const withVenues: (A & { venues: T[] })[] = [];
  for (const area of areas) {
    const { picks } = selectCurated(
      venues.filter((v) => v.district === area.key),
      { limit: maxPerArea, now },
    );
    const taken = picks.slice(0, Math.max(0, budget));
    budget -= taken.length;
    if (taken.length > 0) withVenues.push({ ...area, venues: taken });
  }
  const shown = withVenues.flatMap((a) => a.venues);
  return {
    areas: withVenues,
    shown,
    remaining: Math.max(0, venues.length - shown.length),
    lastChecked: lastCheckedFrom(shown),
  };
}

/**
 * The last-checked date a page may display: the most recent verification among
 * the venues it actually renders. Null when none of them carry one — the
 * standard says no evidence, no date, and a build timestamp is not evidence.
 */
export function lastCheckedFrom(venues: readonly Venue[]): string | null {
  const times = venues.map(verifiedTime).filter((t) => t > 0);
  if (times.length === 0) return null;
  return new Date(Math.max(...times)).toISOString().slice(0, 10);
}
