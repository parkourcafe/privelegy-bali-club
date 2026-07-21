// Pure logic for the interactive "My Day" builder. NO `server-only` and no IO —
// both the client question form (components/my-day/DayBuilderForm) and the
// server page (app/my-day/page) import from here, and the arc-planning +
// nearest-area maths are unit-tested in plain node (lib/day-builder.test.ts).
//
// This is the deterministic "Moment Builder" the architecture allows (structured
// moment flow, guardrail #3 — NOT an AI chatbot): the traveller answers a few
// questions, and each answer maps to a published collection the day slot draws
// from. Nothing here invents a place; the server page still only renders slots
// whose collection has real, decision-ready venues.

export interface AreaOption {
  slug: string; // district slug (venues.district)
  name: string;
  lat: number;
  lng: number;
}

// The selectable areas — the catalogued districts with enough published depth to
// fill a day. Centroids are approximate public area centres (used only to snap a
// geolocation fix to the nearest area; never stored — guardrail #11).
export const DAY_AREAS: AreaOption[] = [
  { slug: "canggu", name: "Canggu", lat: -8.648, lng: 115.139 },
  { slug: "seminyak", name: "Seminyak", lat: -8.691, lng: 115.168 },
  { slug: "kuta-legian", name: "Kuta & Legian", lat: -8.718, lng: 115.169 },
  { slug: "uluwatu-bukit", name: "Uluwatu & the Bukit", lat: -8.807, lng: 115.108 },
  { slug: "jimbaran", name: "Jimbaran", lat: -8.789, lng: 115.166 },
  { slug: "nusa-dua", name: "Nusa Dua", lat: -8.797, lng: 115.228 },
  { slug: "sanur", name: "Sanur", lat: -8.688, lng: 115.262 },
  { slug: "ubud", name: "Ubud", lat: -8.507, lng: 115.263 },
];

export interface ChoiceOption {
  value: string;
  label: string;
  hint: string;
}

export const GROUP_OPTIONS: ChoiceOption[] = [
  { value: "solo", label: "Solo", hint: "Easy to enter, no big plan" },
  { value: "couple", label: "Couple", hint: "Good for two" },
  { value: "family", label: "Family", hint: "Comfortable with kids" },
  { value: "friends", label: "Friends", hint: "Share plates, good energy" },
];

export const VIBE_OPTIONS: ChoiceOption[] = [
  { value: "quiet", label: "Quiet", hint: "Calm and easy" },
  { value: "local", label: "Local", hint: "Less polished, more Bali" },
  { value: "view", label: "A view", hint: "Ocean, ricefield, sunset" },
  { value: "lively", label: "Lively", hint: "Music, people, energy" },
  { value: "reset", label: "Reset", hint: "Softer, slower pace" },
];

export const BUDGET_OPTIONS: ChoiceOption[] = [
  { value: "cheap", label: "Keep it cheap", hint: "Warungs, local prices" },
  { value: "mid", label: "In the middle", hint: "A comfortable mix" },
  { value: "splurge", label: "Treat ourselves", hint: "Worth the splurge" },
];

export const FINISH_OPTIONS: ChoiceOption[] = [
  { value: "sunset", label: "A sunset", hint: "End with the view" },
  { value: "dinner", label: "A good dinner", hint: "A real table after dark" },
  { value: "special", label: "Something special", hint: "Worth dressing for" },
  { value: "early", label: "An early night", hint: "Good food, easy exit" },
];

export interface DayAnswers {
  area: string | null; // district slug, or null = all Bali
  group: string | null;
  vibe: string | null;
  budget: string | null;
  finish: string | null;
}

// Read answers off URL search params (the server page is URL-driven so a built
// day is shareable + SEO-visible). Unknown values are dropped, not trusted.
export function parseAnswers(sp: Record<string, string | string[] | undefined>): DayAnswers {
  const one = (k: string): string | null => {
    const v = sp[k];
    const s = Array.isArray(v) ? v[0] : v;
    return typeof s === "string" && s.trim() ? s.trim() : null;
  };
  const inSet = (v: string | null, set: readonly string[]) => (v && set.includes(v) ? v : null);
  const area = one("area");
  return {
    // A valid district slug is kept; "all" or anything unknown => null (all Bali).
    area: area && DAY_AREAS.some((a) => a.slug === area) ? area : null,
    group: inSet(one("group"), GROUP_OPTIONS.map((o) => o.value)),
    vibe: inSet(one("vibe"), VIBE_OPTIONS.map((o) => o.value)),
    budget: inSet(one("budget"), BUDGET_OPTIONS.map((o) => o.value)),
    finish: inSet(one("finish"), FINISH_OPTIONS.map((o) => o.value)),
  };
}

export function hasAnyAnswer(a: DayAnswers): boolean {
  return Boolean(a.area || a.group || a.vibe || a.budget || a.finish);
}

export function areaName(slug: string | null): string | null {
  if (!slug) return null;
  return DAY_AREAS.find((a) => a.slug === slug)?.name ?? null;
}

// Approx great-circle distance (equirectangular — accurate enough at Bali scale)
// in km, for snapping a geolocation fix to the nearest selectable area.
function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const rad = Math.PI / 180;
  const x = (bLng - aLng) * Math.cos(((aLat + bLat) / 2) * rad);
  const y = bLat - aLat;
  return Math.sqrt(x * x + y * y) * rad * R;
}

// Nearest selectable area to a coordinate, or null when the fix is well outside
// the covered south-Bali cluster (>35 km) — then the day falls back to all Bali
// rather than snapping someone in the north/east to a wrong area.
export function nearestArea(lat: number, lng: number, maxKm = 35): AreaOption | null {
  let best: AreaOption | null = null;
  let bestKm = Infinity;
  for (const a of DAY_AREAS) {
    const km = distanceKm(lat, lng, a.lat, a.lng);
    if (km < bestKm) {
      bestKm = km;
      best = a;
    }
  }
  return best && bestKm <= maxKm ? best : null;
}

export interface DaySlotPlan {
  key: string;
  time: string;
  title: string;
  line: string;
  collection: string; // published collection slug this slot draws from
}

// Resolve which collection each slot draws from, given the answers. Each branch
// points at a collection that exists in lib/collections.ts; the server page still
// hides any slot whose collection has no decision-ready venue in the end.
function morningCollection(a: DayAnswers): string {
  if (a.budget === "cheap") return "cheap-and-brilliant";
  return "brunch-and-breakfast";
}

function middayCollection(a: DayAnswers): string {
  if (a.vibe === "local") return "balinese-and-local-food";
  if (a.budget === "cheap") return "cheap-and-brilliant";
  return "local-and-calm";
}

function dinnerCollection(a: DayAnswers): string {
  if (a.finish === "special") return "special-occasion";
  if (a.budget === "splurge") return "worth-the-splurge";
  if (a.group === "family") return "family-easy-dinners";
  if (a.group === "friends") return "group-dinners";
  if (a.budget === "cheap") return "cheap-and-brilliant";
  if (a.finish === "early") return "local-and-calm";
  return "date-night";
}

// Build the day's arc (morning → midday → golden hour → dinner) from the
// answers. Order is the day itself, not a ranking. The golden-hour slot is
// dropped when the traveller says the day should end at dinner or an early
// night (no sunset stop), so the plan matches what they asked for.
export function buildArc(a: DayAnswers): DaySlotPlan[] {
  const slots: DaySlotPlan[] = [
    {
      key: "morning",
      time: "08:00 — Slow morning",
      title: "Ease in over breakfast",
      line: "Long coffees, eggs and a table you don't want to leave.",
      collection: morningCollection(a),
    },
    {
      key: "midday",
      time: "13:00 — Midday reset",
      title: "Somewhere calm to land",
      line: "Out of the heat and away from the crowd for the afternoon.",
      collection: middayCollection(a),
    },
    {
      key: "golden",
      time: "17:30 — Golden hour",
      title: "Catch the light",
      line: "A drink pointed west while the sky does its thing.",
      collection: "sunset-drinks",
    },
    {
      key: "dinner",
      time: "20:00 — Dinner",
      title: "Make it a night",
      line: "The kind of table worth staying out for when the day winds down.",
      collection: dinnerCollection(a),
    },
  ];
  // If they want to end on dinner or an early night, there's no sunset stop.
  const keepGolden = a.finish !== "dinner" && a.finish !== "early";
  return slots.filter((s) => s.key !== "golden" || keepGolden);
}
