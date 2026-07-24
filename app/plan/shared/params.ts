// Shared-plan URL params: one whitelist used by the page, its metadata and
// the OG-image route so the three can't drift. Unknown values fall back to
// safe defaults — a tampered link renders a valid (generic) plan, never an
// error or injected text (the OG card draws only these fixed strings).

export const MOODS = {
  "slow-morning": "Slow morning",
  "work-session": "Work session",
  "midday-reset": "Midday reset",
  "golden-hour": "Golden hour",
  "late-dinner": "Late dinner",
  "special-occasion": "Special occasion",
} as const;

export const DISTRICTS = {
  canggu: "Canggu",
  ubud: "Ubud",
  seminyak: "Seminyak",
  uluwatu: "Uluwatu",
  sanur: "Sanur",
  jimbaran: "Jimbaran",
  "nusa-dua": "Nusa Dua",
} as const;

export type Mood = keyof typeof MOODS;
export type District = keyof typeof DISTRICTS;

export function first(value: string | string[] | undefined | null) {
  return Array.isArray(value) ? value[0] : value ?? undefined;
}

export function allowedMood(value: string | undefined): Mood {
  return value && value in MOODS ? (value as Mood) : "slow-morning";
}

export function allowedDistrict(value: string | undefined): District {
  return value && value in DISTRICTS ? (value as District) : "canggu";
}

export function allowedDays(value: string | undefined) {
  return value === "3" || value === "7" ? value : "1";
}

export function daysLabel(days: string) {
  return days === "1" ? "One day" : `${days} days`;
}
