// Classification and ordering for the operator submissions queue.
//
// venue_submissions holds two different things under one shape: requests real
// owners sent through /for-venues, and rows written by internal research
// imports, whose `source` is namespaced `otherbali-*`. In the queue they were
// indistinguishable, so 46 research rows marked `accepted` buried the six
// live requests still sitting at needs_verification — untouched for three
// weeks before the 2026-08-08 audit surfaced them.

export type SubmissionOrigin = "web" | "research";

export function submissionOrigin(
  source: string | null | undefined
): SubmissionOrigin {
  return (source ?? "").startsWith("otherbali-") ? "research" : "web";
}

/**
 * Live requests first, newest first within each group. Research imports keep
 * their rows — they are data, not noise — but never above a person who wrote
 * in through the site.
 */
export function orderSubmissionsForReview<
  T extends { source?: string | null; createdAt?: string }
>(rows: readonly T[]): T[] {
  return [...rows].sort((a, b) => {
    const originRank =
      (submissionOrigin(a.source) === "web" ? 0 : 1) -
      (submissionOrigin(b.source) === "web" ? 0 : 1);
    if (originRank !== 0) return originRank;
    return String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? ""));
  });
}
