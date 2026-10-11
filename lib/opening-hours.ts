// Разбор часов работы из venues.opening_hours_json.
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
//
// Модуль отдаёт две формы одних и тех же данных:
//   • schemaOpeningHours — компактная строка «Mo 07:00-22:00, Tu …»
//     (venue.openingHours на границе данных);
//   • buildOpeningHoursSpec — массив OpeningHoursSpecification для разметки
//     страницы заведения.
// Парсер у них общий, чтобы две формы не разъехались.

const DAYS = [
  ["Monday", "Mo"],
  ["Tuesday", "Tu"],
  ["Wednesday", "We"],
  ["Thursday", "Th"],
  ["Friday", "Fr"],
  ["Saturday", "Sa"],
  ["Sunday", "Su"],
] as const;

// Унаследованное текстовое поле принимается только в строго нормализованном
// виде — всё остальное считается непроверенным и не публикуется.
const SCHEMA_RULE =
  /^(?:Mo|Tu|We|Th|Fr|Sa|Su)(?:-(?:Mo|Tu|We|Th|Fr|Sa|Su))? [0-2]\d:[0-5]\d-[0-2]\d:[0-5]\d(?:, (?:Mo|Tu|We|Th|Fr|Sa|Su)(?:-(?:Mo|Tu|We|Th|Fr|Sa|Su))? [0-2]\d:[0-5]\d-[0-2]\d:[0-5]\d)*$/;

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
    if (hour < 1 || hour > 12) return null;
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

function dayRanges(json: unknown, dayName: string): string[] {
  if (!json || typeof json !== "object" || Array.isArray(json)) return [];
  const record = json as Record<string, unknown>;
  const raw = record[dayName] ?? record[dayName.toLowerCase()];
  const list = Array.isArray(raw) ? raw : typeof raw === "string" ? [raw] : [];
  return list.filter(
    (entry): entry is string => typeof entry === "string" && !/closed/i.test(entry),
  );
}

/**
 * Компактная schema.org-строка часов. Канонический источник — jsonb;
 * унаследованное текстовое поле принимается только уже нормализованным.
 */
export function schemaOpeningHours(
  jsonValue: unknown,
  legacyValue?: unknown,
): string | undefined {
  const rules: string[] = [];
  for (const [dayName, dayCode] of DAYS) {
    for (const entry of dayRanges(jsonValue, dayName)) {
      const parsed = parseRange(entry);
      if (parsed) rules.push(`${dayCode} ${parsed.opens}-${parsed.closes}`);
    }
  }
  if (rules.length) return rules.join(", ");

  const legacy = typeof legacyValue === "string" ? legacyValue.trim() : "";
  return legacy && SCHEMA_RULE.test(legacy) ? legacy : undefined;
}

/**
 * Строит массив OpeningHoursSpecification — единственная форма, которая
 * умеет выразить две смены в один день. Неразобранные значения
 * пропускаются молча: отдать неверные часы хуже, чем не отдать никаких
 * (гардрейл №10).
 */
export function buildOpeningHoursSpec(json: unknown): OpeningHoursSpec[] {
  const out: OpeningHoursSpec[] = [];
  for (const [dayName] of DAYS) {
    for (const entry of dayRanges(json, dayName)) {
      const parsed = parseRange(entry);
      if (!parsed) continue;
      out.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${dayName}`,
        opens: parsed.opens,
        closes: parsed.closes,
      });
    }
  }
  return out;
}

const DISPLAY_DAY: Record<string, string> = {
  Mo: "Mon",
  Tu: "Tue",
  We: "Wed",
  Th: "Thu",
  Fr: "Fri",
  Sa: "Sat",
  Su: "Sun",
};
const DAY_CODES = DAYS.map(([, code]) => code as string);
const RULE = /^([A-Z][a-z])(?:-([A-Z][a-z]))? ([0-2]\d:[0-5]\d)-([0-2]\d:[0-5]\d)$/;

/**
 * Часы для людей: «Mo 07:00-23:00, Tu 07:00-23:00, …» -> «Daily 07:00–23:00»,
 * а разные часы — группами подряд идущих дней: «Mon–Fri 08:00–22:00 ·
 * Sat–Sun 09:00–23:00». Только для видимого текста; разметка получает
 * schemaOpeningHours как есть.
 *
 * Факт не добавляется: день, которого нет в строке, не называется ни
 * закрытым, ни открытым — он просто не попадает в группы. «23:59» остаётся
 * «23:59»: это может быть и полночь, и «до последнего гостя», источник
 * этого не говорит. Если хоть одна часть строки не разбирается, отдаём
 * исходную строку целиком.
 */
export function humanOpeningHours(value: string | null | undefined): string | undefined {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return undefined;

  const perDay = new Map<string, string[]>();
  for (const rule of raw.split(/,\s*/)) {
    const m = RULE.exec(rule.trim());
    if (!m) return raw;
    const from = DAY_CODES.indexOf(m[1]);
    const to = m[2] ? DAY_CODES.indexOf(m[2]) : from;
    if (from < 0 || to < 0 || to < from) return raw;
    for (let i = from; i <= to; i += 1) {
      const code = DAY_CODES[i];
      perDay.set(code, [...(perDay.get(code) ?? []), `${m[3]}–${m[4]}`]);
    }
  }

  const groups: { first: string; last: string; hours: string }[] = [];
  let previous: string | null = null;
  for (const code of DAY_CODES) {
    const ranges = perDay.get(code);
    if (!ranges) {
      previous = null;
      continue;
    }
    const hours = ranges.join(", ");
    const open = groups[groups.length - 1];
    if (open && previous === open.last && open.hours === hours) {
      open.last = code;
    } else {
      groups.push({ first: code, last: code, hours });
    }
    previous = code;
  }

  if (groups.length === 1 && groups[0].first === "Mo" && groups[0].last === "Su") {
    return `Daily ${groups[0].hours}`;
  }
  return groups
    .map(({ first, last, hours }) =>
      first === last
        ? `${DISPLAY_DAY[first]} ${hours}`
        : `${DISPLAY_DAY[first]}–${DISPLAY_DAY[last]} ${hours}`,
    )
    .join(" · ");
}
