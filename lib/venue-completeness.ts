import { validatePublicEvidenceUrl } from "./external-links";

export type VenueEditorialCompletenessInput = {
  whatToOrder?: string | readonly string[] | null;
  hasCurrentStructuredMenu?: boolean;
  officialMenuUrl?: string | null;
  contentVerifiedAt?: string | null;
  venueVerifiedAt?: string | null;
};

function nonEmpty(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function validDate(value: string | null | undefined): string | null {
  const normalized = nonEmpty(value);
  if (!normalized) return null;
  return Number.isNaN(new Date(normalized).getTime()) ? null : normalized;
}

/**
 * Editorial dish guidance is public only when a current structured menu or a
 * validated official/source menu URL backs it. A generic venue verification
 * date is deliberately not menu evidence.
 */
export function hasWhatToOrderEvidence({
  hasCurrentStructuredMenu = false,
  officialMenuUrl,
}: Pick<VenueEditorialCompletenessInput, "hasCurrentStructuredMenu" | "officialMenuUrl">): boolean {
  return hasCurrentStructuredMenu || Boolean(validatePublicEvidenceUrl(officialMenuUrl));
}

export function publicWhatToOrderItems(input: VenueEditorialCompletenessInput): string[] {
  if (!hasWhatToOrderEvidence(input)) return [];
  const source: readonly string[] = typeof input.whatToOrder === "string"
    ? input.whatToOrder.split(";")
    : input.whatToOrder ?? [];
  return source
    .map((item) => item.trim())
    .filter((item, index, items) => Boolean(item) && items.indexOf(item) === index);
}

/** Prefer the more specific editorial/source date, then the canonical venue row. */
export function publicVenueVerifiedAt({
  contentVerifiedAt,
  venueVerifiedAt,
}: Pick<VenueEditorialCompletenessInput, "contentVerifiedAt" | "venueVerifiedAt">): string | null {
  return validDate(contentVerifiedAt) ?? validDate(venueVerifiedAt);
}
