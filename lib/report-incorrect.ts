export const REPORT_INCORRECT_REASONS = [
  { value: "place_closed", label: "Place closed" },
  { value: "wrong_hours", label: "Wrong hours" },
  { value: "wrong_address", label: "Wrong address" },
  { value: "wrong_price", label: "Wrong price" },
  { value: "photo_issue", label: "Photo issue" },
  { value: "other", label: "Other" },
] as const;

export type ReportIncorrectReason = (typeof REPORT_INCORRECT_REASONS)[number]["value"];

const SUPPORT_EMAIL = "support@otherbali.com";
const PUBLIC_PLACE_BASE = "https://www.otherbali.com/places/";
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isReportIncorrectReason(value: string): value is ReportIncorrectReason {
  return REPORT_INCORRECT_REASONS.some((reason) => reason.value === value);
}

export function buildReportIncorrectMailto(input: {
  venueSlug: string;
  venueName: string;
  reason: ReportIncorrectReason;
}): string | null {
  if (!SLUG.test(input.venueSlug) || !isReportIncorrectReason(input.reason)) return null;
  const reason = REPORT_INCORRECT_REASONS.find((item) => item.value === input.reason);
  if (!reason) return null;

  const safeName = input.venueName.trim().replace(/\s+/g, " ").slice(0, 120);
  if (!safeName) return null;
  const subject = `Other Bali correction: ${safeName}`;
  const body = [
    `Place: ${safeName}`,
    `Page: ${PUBLIC_PLACE_BASE}${input.venueSlug}`,
    `Issue: ${reason.label}`,
    "",
    "Please add any useful detail before sending. Reports are reviewed and are never published automatically.",
  ].join("\n");

  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
