export const EXPLICIT_REVIEW_CONFIRMATION = "source-and-content-checked";

export function hasExplicitReviewConfirmation(value: FormDataEntryValue | null): boolean {
  return value === EXPLICIT_REVIEW_CONFIRMATION;
}
