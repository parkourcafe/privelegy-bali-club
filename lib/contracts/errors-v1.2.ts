export const V12_ERROR_CODES = [
  "PLACE_NOT_FOUND",
  "PLACE_NOT_ROUTE_READY",
  "ACTION_NOT_VERIFIED",
  "ACTION_LINK_BROKEN",
  "DECISION_EMPTY",
  "DECISION_STALE",
  "ROUTE_PROVIDER_UNAVAILABLE",
  "ROUTE_QUOTA_EXCEEDED",
  "ROUTE_NO_PATH",
  "EVENT_EXPIRED",
  "EVENT_CANCELLED",
  "FEED_CURSOR_EXPIRED",
  "FEED_SESSION_NOT_FOUND",
  "OFFLINE_PACK_TOO_LARGE",
  "OFFLINE_ASSET_UNAVAILABLE",
  "SYNC_CONFLICT",
  "SYNC_VERSION_MISMATCH",
  "LOCATION_PERMISSION_DENIED",
  "DEEP_LINK_INVALID",
] as const;

export type V12ErrorCode = (typeof V12_ERROR_CODES)[number];
export type V12LogSeverity = "info" | "warning" | "error";

export interface V12ErrorContract {
  httpStatus: number;
  retryable: boolean;
  fallback: string;
  severity: V12LogSeverity;
}

const retryableProviderError: V12ErrorContract = {
  httpStatus: 503,
  retryable: true,
  fallback: "Offer a verified external Maps handoff or an honest unavailable state.",
  severity: "warning",
};

export const V12_ERROR_CONTRACTS: Record<V12ErrorCode, V12ErrorContract> = {
  PLACE_NOT_FOUND: { httpStatus: 404, retryable: false, fallback: "Return to the eligible result set.", severity: "info" },
  PLACE_NOT_ROUTE_READY: { httpStatus: 422, retryable: false, fallback: "Hide routing and explain that coordinates are not verified.", severity: "warning" },
  ACTION_NOT_VERIFIED: { httpStatus: 422, retryable: false, fallback: "Suppress the action.", severity: "warning" },
  ACTION_LINK_BROKEN: { httpStatus: 422, retryable: false, fallback: "Suppress the action and queue it for review.", severity: "error" },
  DECISION_EMPTY: { httpStatus: 200, retryable: false, fallback: "Show an honest empty state without cross-district fill.", severity: "info" },
  DECISION_STALE: { httpStatus: 409, retryable: true, fallback: "Recompute the decision from current facts.", severity: "info" },
  ROUTE_PROVIDER_UNAVAILABLE: retryableProviderError,
  ROUTE_QUOTA_EXCEEDED: retryableProviderError,
  ROUTE_NO_PATH: { httpStatus: 422, retryable: false, fallback: "Offer an exact external Maps handoff when verified.", severity: "warning" },
  EVENT_EXPIRED: { httpStatus: 410, retryable: false, fallback: "Remove the occurrence from active results.", severity: "info" },
  EVENT_CANCELLED: { httpStatus: 410, retryable: false, fallback: "Show cancellation and remove it from active plans.", severity: "warning" },
  FEED_CURSOR_EXPIRED: { httpStatus: 409, retryable: true, fallback: "Start a fresh bounded feed and explain the reset.", severity: "info" },
  FEED_SESSION_NOT_FOUND: { httpStatus: 404, retryable: true, fallback: "Create a new contextual session.", severity: "info" },
  OFFLINE_PACK_TOO_LARGE: { httpStatus: 413, retryable: false, fallback: "Offer a smaller area or route-corridor pack.", severity: "warning" },
  OFFLINE_ASSET_UNAVAILABLE: { httpStatus: 422, retryable: true, fallback: "Keep text and route-safe facts; omit the asset.", severity: "warning" },
  SYNC_CONFLICT: { httpStatus: 409, retryable: false, fallback: "Preserve both versions and ask the user to resolve.", severity: "warning" },
  SYNC_VERSION_MISMATCH: { httpStatus: 409, retryable: true, fallback: "Pull the latest cursor before retrying once.", severity: "warning" },
  LOCATION_PERMISSION_DENIED: { httpStatus: 403, retryable: false, fallback: "Offer manual area selection.", severity: "info" },
  DEEP_LINK_INVALID: { httpStatus: 422, retryable: false, fallback: "Use the canonical web fallback.", severity: "warning" },
};

