import type { VenueOpeningHoursSpecification } from "./types";

const DAY_ORDER = [
  ["Monday", "Mo"],
  ["Tuesday", "Tu"],
  ["Wednesday", "We"],
  ["Thursday", "Th"],
  ["Friday", "Fr"],
  ["Saturday", "Sa"],
  ["Sunday", "Su"],
] as const;

const SCHEMA_RULE = /^(?:Mo|Tu|We|Th|Fr|Sa|Su)(?:-(?:Mo|Tu|We|Th|Fr|Sa|Su))? [0-2]\d:[0-5]\d-[0-2]\d:[0-5]\d(?:, (?:Mo|Tu|We|Th|Fr|Sa|Su)(?:-(?:Mo|Tu|We|Th|Fr|Sa|Su))? [0-2]\d:[0-5]\d-[0-2]\d:[0-5]\d)*$/;

function clock24(value: string): string | null {
  const match = value.trim().toLowerCase().match(/^(\d{1,2})(?:[.:](\d{2}))?(am|pm)$/);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2] ?? "00");
  if (hour < 1 || hour > 12 || minute > 59) return null;
  if (match[3] === "pm" && hour !== 12) hour += 12;
  if (match[3] === "am" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function interval24(value: unknown): string | null {
  const parts = intervalParts24(value);
  return parts ? `${parts.opens}-${parts.closes}` : null;
}

function intervalParts24(value: unknown): { opens: string; closes: string } | null {
  if (typeof value !== "string") return null;
  const parts = value.split(/\s*[-–—]\s*/);
  if (parts.length !== 2) return null;
  const open = clock24(parts[0]);
  const close = clock24(parts[1]);
  if (!open || !close || open === close) return null;
  return { opens: open, closes: close };
}

export function schemaOpeningHoursSpecification(
  jsonValue: unknown,
): VenueOpeningHoursSpecification[] | undefined {
  if (!jsonValue || typeof jsonValue !== "object" || Array.isArray(jsonValue)) return undefined;
  const record = jsonValue as Record<string, unknown>;
  const specifications: VenueOpeningHoursSpecification[] = [];
  for (const [dayName] of DAY_ORDER) {
    const intervals = record[dayName];
    if (!Array.isArray(intervals)) continue;
    for (const interval of intervals) {
      const normalized = intervalParts24(interval);
      if (!normalized) continue;
      specifications.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${dayName}`,
        ...normalized,
      });
    }
  }
  return specifications.length ? specifications : undefined;
}

export function schemaOpeningHours(
  jsonValue: unknown,
  legacyValue?: unknown,
): string | undefined {
  if (jsonValue && typeof jsonValue === "object" && !Array.isArray(jsonValue)) {
    const record = jsonValue as Record<string, unknown>;
    const rules: string[] = [];
    for (const [dayName, dayCode] of DAY_ORDER) {
      const intervals = record[dayName];
      if (!Array.isArray(intervals)) continue;
      for (const interval of intervals) {
        const normalized = interval24(interval);
        if (normalized) rules.push(`${dayCode} ${normalized}`);
      }
    }
    if (rules.length) return rules.join(", ");
  }

  const legacy = typeof legacyValue === "string" ? legacyValue.trim() : "";
  return legacy && SCHEMA_RULE.test(legacy) ? legacy : undefined;
}
