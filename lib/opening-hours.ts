// Разбор часов работы из venues.opening_hours_json в schema.org
// OpeningHoursSpecification.
//
// Формат в базе: {"Monday": ["10.00am-11.00pm"], "Tuesday": [...], …}
// У части заведений в массиве ДВЕ смены — обед и ужин
// (["7.00am-11.00am", "6.00pm-10.00pm"]). Это должно стать двумя записями
// на один день, а не склеенной строкой: иначе получается «работает
// с 7 утра до 10 вечера», что неправда.
//
// Главное правило разбора, на котором легко ошибиться: пометка am/pm,
// указанная один раз в конце, относится к ОБЕИМ границам. «5.00-11.00pm»
// это 17:00–23:00, а не «с пяти утра». На этой ошибке уже попался
// нормализатор унаследованных часов — она не видна на странице, человек
// просто приезжает к закрытой двери.

const DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
] as const;

export interface OpeningHoursSpec {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string;
  opens: string;
  closes: string;
}

// «7.30am», «11.00pm», «19:00», «7 a.m.» -> «HH:MM»
function toTime(raw: string, inheritedMeridiem?: string): string | null {
  const s = raw.trim().toLowerCase().replace(/\s+/g, "");
  const m = /^(\d{1,2})(?:[:.](\d{2}))?(a\.?m\.?|p\.?m\.?)?$/.exec(s);
  if (!m) return null;
  let hour = Number(m[1]);
  const minute = Number(m[2] ?? 0);
  const meridiem = m[3] ?? inheritedMeridiem;
  if (meridiem) {
    const pm = meridiem.startsWith("p");
    if (pm && hour !== 12) hour += 12;
    if (!pm && hour === 12) hour = 0;
  }
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) return null;
  if (!Number.isInteger(minute) || minute < 0 || minute > 59) return null;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function meridiemOf(raw: string): string | undefined {
  const m = /(a\.?m\.?|p\.?m\.?)\s*$/i.exec(raw.trim());
  return m ? m[1].toLowerCase().replace(/[.\s]/g, "") : undefined;
}

/** «10.00am-11.00pm» -> {opens, closes}; null, если разобрать нельзя. */
export function parseRange(range: string): { opens: string; closes: string } | null {
  const parts = range.split(/\s*[-–—]\s*/);
  if (parts.length !== 2) return null;
  const trailing = meridiemOf(parts[1]);
  const opens = toTime(parts[0], trailing);
  const closes = toTime(parts[1]);
  if (!opens || !closes) return null;
  // Закрытие в полночь или за полночь: календарно одной записью это не
  // выразить, а «20:00–04:00» читается как закрытие в тот же день.
  const normalisedCloses = closes === "00:00" || closes < opens ? "23:59" : closes;
  if (normalisedCloses === opens) return null;
  return { opens, closes: normalisedCloses };
}

/**
 * Строит массив OpeningHoursSpecification. Неразобранные значения
 * пропускаются молча — отдать неверные часы хуже, чем не отдать никаких
 * (гардрейл №10).
 */
export function buildOpeningHoursSpec(json: unknown): OpeningHoursSpec[] {
  if (!json || typeof json !== "object" || Array.isArray(json)) return [];
  const source = json as Record<string, unknown>;
  const out: OpeningHoursSpec[] = [];
  for (const day of DAYS) {
    const raw = source[day] ?? source[day.toLowerCase()];
    const ranges = Array.isArray(raw) ? raw : typeof raw === "string" ? [raw] : [];
    for (const entry of ranges) {
      if (typeof entry !== "string") continue;
      if (/closed/i.test(entry)) continue;
      const parsed = parseRange(entry);
      if (!parsed) continue;
      out.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${day}`,
        opens: parsed.opens,
        closes: parsed.closes,
      });
    }
  }
  return out;
}
