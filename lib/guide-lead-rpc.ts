export type GuideLeadRpcDecision =
  | { status: "stored"; duplicate: boolean }
  | { status: "rate_limited"; retryAfterSeconds: number }
  | { status: "rejected" };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function boundedRetryAfter(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 900;
  return Math.max(1, Math.min(900, Math.ceil(value)));
}

export function interpretGuideLeadRpcResult(value: unknown): GuideLeadRpcDecision {
  if (!isRecord(value)) return { status: "rejected" };
  if (value.ok === true) {
    return { status: "stored", duplicate: value.duplicate === true };
  }
  if (value.ok === false && value.error === "rate_limited") {
    return {
      status: "rate_limited",
      retryAfterSeconds: boundedRetryAfter(value.retry_after_seconds),
    };
  }
  return { status: "rejected" };
}
