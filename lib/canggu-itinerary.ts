import type { VenueWithPerk } from "@/lib/data";

// Pure itinerary composition for the "3 perfect days in Canggu" page (P1-4).
// Given the published Canggu venues, arrange the strongest ones into a
// three-day arc by role, never repeating a venue. Kept view-free and
// dependency-free (only a type import) so the arrangement is unit-testable and
// the page stays a thin renderer. No invented facts — a venue only fills a
// block if its own category/job data fits it.

// Local copy of lib/canggu's venueHasJob so this module carries no runtime
// imports. Mirrors lib/intents.normalizeJobs (hyphen → underscore) exactly.
function venueHasJob(v: VenueWithPerk, jobs: string[]): boolean {
  const norm = (list?: string[] | null) => (list ?? []).map((j) => j.replace(/-/g, "_"));
  const own = norm(v.jobs);
  return norm(jobs).some((j) => own.includes(j));
}

type Pick = (v: VenueWithPerk) => boolean;

const isCoffee: Pick = (v) =>
  v.category === "cafe" || venueHasJob(v, ["quiet-work-cafe", "brunch-after-surf"]);
const isBeach: Pick = (v) => v.category === "beach_club" || v.category === "surf";
const isSunset: Pick = (v) =>
  v.category === "beach_club" || v.category === "bar" || venueHasJob(v, ["sunset-drinks-view"]);
const isDinner: Pick = (v) => v.category === "restaurant";
const isReset: Pick = (v) => v.category === "spa" || v.category === "yoga";
const isLocalFood: Pick = (v) => v.category === "warung" || v.category === "restaurant";

export interface BlockSpec {
  key: string;
  label: string;
  hint: string;
  pick: Pick;
}
export interface DaySpec {
  n: number;
  title: string;
  theme: string;
  blocks: BlockSpec[];
}

export const DAY_SPECS: DaySpec[] = [
  {
    n: 1,
    title: "Land, and find your feet",
    theme:
      "First coffee, first surf, first sunset — an easy arc that gets you oriented without crossing Canggu twice.",
    blocks: [
      { key: "d1-morning", label: "Morning", hint: "Coffee and a slow start.", pick: isCoffee },
      { key: "d1-midday", label: "Midday", hint: "Beach hours while the light is high.", pick: isBeach },
      { key: "d1-sunset", label: "Sunset", hint: "Golden hour with your feet near the sand.", pick: isSunset },
      { key: "d1-dinner", label: "Dinner", hint: "Walk-in-friendly, close to base.", pick: isDinner },
    ],
  },
  {
    n: 2,
    title: "Slow it down",
    theme: "A softer day — a proper café morning, a reset, and a dinner worth booking.",
    blocks: [
      { key: "d2-morning", label: "Morning", hint: "A longer café sit — laptop optional.", pick: isCoffee },
      { key: "d2-afternoon", label: "Afternoon", hint: "A reset — massage, spa or a slow studio hour.", pick: isReset },
      { key: "d2-sunset", label: "Sunset", hint: "A quieter west-end sundowner.", pick: isSunset },
      { key: "d2-dinner", label: "Dinner", hint: "The table you reserve ahead.", pick: isDinner },
    ],
  },
  {
    n: 3,
    title: "The send-off",
    theme: "One more beach day and the dinner you'll remember.",
    blocks: [
      { key: "d3-morning", label: "Morning", hint: "Last good coffee before the beach.", pick: isCoffee },
      { key: "d3-midday", label: "Midday", hint: "Warm sand, an easy lunch nearby.", pick: (v) => isBeach(v) || isLocalFood(v) },
      { key: "d3-sunset", label: "Sunset", hint: "The big send-off sunset.", pick: isSunset },
      { key: "d3-dinner", label: "Dinner", hint: "Go out on a high — book if it's a weekend.", pick: isDinner },
    ],
  },
];

// Fill the best-evidenced venues first so a thin catalogue still leads with its
// strongest places.
export function venueScore(v: VenueWithPerk): number {
  let s = 0;
  if (v.photoUrl) s += 3;
  if (v.tier === "founding") s += 2;
  else if (v.tier === "launch") s += 1;
  if (v.whyItsHere) s += 1;
  if (v.bestFor) s += 1;
  return s;
}

export interface Stop {
  label: string;
  hint: string;
  venue: VenueWithPerk;
}
export interface Day {
  n: number;
  title: string;
  theme: string;
  stops: Stop[];
}

// Greedy, no-repeat assignment: each block takes the strongest unused venue that
// fits its role; a block with nothing left is dropped, and an empty day with it.
export function buildItinerary(venues: VenueWithPerk[]): Day[] {
  const pool = [...venues].sort(
    (a, b) => venueScore(b) - venueScore(a) || a.name.localeCompare(b.name)
  );
  const used = new Set<string>();
  const take = (pick: Pick): VenueWithPerk | null => {
    const v = pool.find((x) => !used.has(x.slug) && pick(x));
    if (v) used.add(v.slug);
    return v ?? null;
  };
  return DAY_SPECS.map((day) => {
    const stops: Stop[] = [];
    for (const block of day.blocks) {
      const venue = take(block.pick);
      if (venue) stops.push({ label: block.label, hint: block.hint, venue });
    }
    return { n: day.n, title: day.title, theme: day.theme, stops };
  }).filter((day) => day.stops.length > 0);
}
