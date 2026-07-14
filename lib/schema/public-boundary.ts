import {
  isRecord,
  normalizedText,
  type ValidationResult,
} from "./common";

export type PublicDataEntity =
  | "venue"
  | "perk"
  | "plan_entry"
  | "route"
  | "route_stop";

export interface PublicRowRejection {
  event: "public_data_row_rejected";
  entity: PublicDataEntity;
  context: string;
  index: number;
  id: string | null;
  slug: string | null;
  issues: Array<{ code: string; path: string }>;
}

function safeIdentifier(value: unknown): string | null {
  const text = normalizedText(value);
  if (!text || text.length > 120 || !/^[A-Za-z0-9:_-]+$/.test(text)) return null;
  return text;
}

export function publicRowRejection(
  entity: PublicDataEntity,
  context: string,
  row: unknown,
  index: number,
  result: ValidationResult<unknown>,
): PublicRowRejection {
  const record = isRecord(row) ? row : {};
  return {
    event: "public_data_row_rejected",
    entity,
    context,
    index,
    id: safeIdentifier(record.id),
    slug: safeIdentifier(record.slug)
      ?? safeIdentifier(record.venue_slug)
      ?? safeIdentifier(record.route_slug),
    issues: result.issues.slice(0, 20).map(({ code, path }) => ({ code, path })),
  };
}

export function parsePublicRows<T>(
  rows: readonly unknown[],
  parser: (row: unknown, index: number) => ValidationResult<T>,
  options: {
    entity: PublicDataEntity;
    context: string;
    sink?: (line: string) => void;
  },
): T[] {
  const sink = options.sink ?? console.warn;
  const output: T[] = [];
  rows.forEach((row, index) => {
    const result = parser(row, index);
    if (result.ok && result.data !== null) {
      output.push(result.data);
      return;
    }
    sink(JSON.stringify(publicRowRejection(
      options.entity,
      options.context,
      row,
      index,
      result,
    )));
  });
  return output;
}
