import type { SupabaseClient } from "@supabase/supabase-js";

import { PHOTO_BUCKET } from "./photo-submission-policy";

type TransitionPayload = {
  ok?: unknown;
  error?: unknown;
  storage_state?: unknown;
};

export type PhotoCleanupResult =
  | "removed"
  | "cleanup_pending"
  | "consent_recorded"
  | "deferred";

type PhotoCleanupReason =
  | "upload_failed"
  | "state_transition_failed"
  | "consent_rejected";

type ExplicitPhotoCleanupReason = Exclude<PhotoCleanupReason, "upload_failed">;

function transitionPayload(data: unknown): TransitionPayload | null {
  return data && typeof data === "object" && !Array.isArray(data)
    ? data as TransitionPayload
    : null;
}

export async function markPhotoUploadStored(
  client: SupabaseClient,
  submissionId: string,
  venueSlug: string,
  imagePath: string,
  contentSha256: string,
): Promise<boolean> {
  const { data, error } = await client.rpc("mark_venue_photo_uploaded", {
    p_submission_id: submissionId,
    p_venue_slug: venueSlug,
    p_image_path: imagePath,
    p_content_sha256: contentSha256,
  });
  const payload = transitionPayload(data);
  return !error
    && payload?.ok === true
    && payload.storage_state === "uploaded";
}

/**
 * An upload error can be an ambiguous acknowledgement: the object PUT may
 * still commit after the response is lost. In that case callers must only
 * request durable cleanup and leave Storage removal to the grace-delayed
 * reconciler.
 */
export async function requestUnconsentedPhotoCleanup(
  client: SupabaseClient,
  submissionId: string,
  venueSlug: string,
  imagePath: string,
  reason: PhotoCleanupReason,
): Promise<PhotoCleanupResult> {
  const requested = await client.rpc("request_venue_photo_cleanup", {
    p_submission_id: submissionId,
    p_venue_slug: venueSlug,
    p_image_path: imagePath,
    p_reason: reason,
  });
  if (requested.error) return "deferred";

  const payload = transitionPayload(requested.data);
  if (payload?.error === "consent_recorded") return "consent_recorded";
  if (payload?.ok !== true) return "deferred";
  if (payload.storage_state === "removed") return "removed";
  return payload.storage_state === "cleanup_pending"
    ? "cleanup_pending"
    : "deferred";
}

/**
 * Distributed cleanup is deliberately ordered around the database row.
 * The CAS transition first proves that no consent evidence exists and blocks
 * a concurrent consent transaction. Only then may Storage be touched. The
 * durable row remains cleanup_pending until a checked remove completes.
 */
export async function cleanUnconsentedPhoto(
  client: SupabaseClient,
  submissionId: string,
  venueSlug: string,
  imagePath: string,
  reason: ExplicitPhotoCleanupReason,
): Promise<PhotoCleanupResult> {
  const requestResult = await requestUnconsentedPhotoCleanup(
    client,
    submissionId,
    venueSlug,
    imagePath,
    reason,
  );
  if (requestResult !== "cleanup_pending") return requestResult;

  const removal = await client.storage.from(PHOTO_BUCKET).remove([imagePath]);
  if (removal.error) return "cleanup_pending";

  const completed = await client.rpc("complete_venue_photo_cleanup", {
    p_submission_id: submissionId,
    p_venue_slug: venueSlug,
    p_image_path: imagePath,
    p_storage_removal_confirmed: true,
  });
  if (completed.error) return "cleanup_pending";
  const completionPayload = transitionPayload(completed.data);
  return completionPayload?.ok === true
    && completionPayload.storage_state === "removed"
    ? "removed"
    : "cleanup_pending";
}
