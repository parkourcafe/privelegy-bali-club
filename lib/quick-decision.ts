export interface QuickDecisionInput {
  bestFor?: string | null;
  notFor?: string | null;
  whyGo?: string | null;
  whatToOrder?: readonly string[] | null;
  practicalNote?: string | null;
  reservationNote?: string | null;
}

export interface QuickDecisionRow {
  label: "Best for" | "Not for" | "Why go" | "What to order" | "Practical note" | "Reservations";
  value: string;
}

function clean(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  return normalized || null;
}

/** Projects existing verified/editorial fields only; it never infers claims. */
export function quickDecisionRows(input: QuickDecisionInput): QuickDecisionRow[] {
  const values: Array<[QuickDecisionRow["label"], string | null]> = [
    ["Best for", clean(input.bestFor)],
    ["Not for", clean(input.notFor)],
    ["Why go", clean(input.whyGo)],
    ["What to order", input.whatToOrder?.map(clean).filter((value): value is string => Boolean(value)).join(", ") || null],
    ["Practical note", clean(input.practicalNote)],
    ["Reservations", clean(input.reservationNote)],
  ];
  return values.filter((entry): entry is [QuickDecisionRow["label"], string] => Boolean(entry[1]))
    .map(([label, value]) => ({ label, value }));
}
