import { createHash, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { serviceClient } from "@/lib/supabase/service";
import {
  MAX_PHOTO_BYTES,
  PHOTO_BUCKET,
  PHOTO_CONSENT_TERMS_VERSION,
  boundedClientIp,
  detectPhotoMime,
  photoObjectPath,
  validatePhotoSubmissionFields,
} from "@/lib/photo-submission-policy";
import { photoContentSha256 } from "@/lib/photo-content-digest";
import {
  cleanUnconsentedPhoto,
  markPhotoUploadStored,
  requestUnconsentedPhotoCleanup,
  type PhotoCleanupResult,
} from "@/lib/photo-submission-reconciliation";
import { isTrustedSameOriginMutation } from "@/lib/same-origin-mutation";
import { exactReleaseSchemaProbe } from "@/lib/release-schema-probe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MULTIPART_OVERHEAD = 512 * 1024;
const NO_STORE = { "Cache-Control": "no-store" };

function response(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status, headers: NO_STORE });
}

function pendingReviewResponse() {
  return NextResponse.json(
    { ok: true, status: "pending_review" },
    { status: 201, headers: NO_STORE },
  );
}

function processingResponse() {
  return NextResponse.json(
    { ok: true, status: "processing" },
    {
      status: 202,
      headers: { ...NO_STORE, "Retry-After": "60" },
    },
  );
}

function rpcAccepted(data: unknown): boolean {
  return Boolean(data)
    && typeof data === "object"
    && !Array.isArray(data)
    && (data as { ok?: unknown }).ok === true;
}

function responseAfterCleanup(
  cleanup: PhotoCleanupResult,
  failure: string,
) {
  return cleanup === "removed"
    ? response(failure, 502)
    : processingResponse();
}

function tokenHash(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("base64url");
}

async function resolveVenueSlug(
  client: SupabaseClient,
  token: string
): Promise<string | null> {
  const { data: photoToken, error: photoTokenError } = await client
    .from("venue_photo_tokens")
    .select("venue_slug,expires_at")
    .eq("token_hash", tokenHash(token))
    .is("revoked_at", null)
    .maybeSingle();
  if (photoTokenError) return null;
  if (photoToken) {
    const expiry = photoToken.expires_at ? Date.parse(photoToken.expires_at) : null;
    if (expiry === null || (Number.isFinite(expiry) && expiry > Date.now())) {
      return String(photoToken.venue_slug);
    }
    return null;
  }

  // Compatibility for current partner invitation links. This is a direct,
  // service-only lookup; it never calls or exposes operator roster/mint RPCs.
  const { data: onboardingToken, error: onboardingError } = await client
    .from("venue_onboard_tokens")
    .select("venue_slug")
    .eq("token", token)
    .maybeSingle();
  if (onboardingError || !onboardingToken) return null;
  return String(onboardingToken.venue_slug);
}

export async function POST(req: Request) {
  if (!isTrustedSameOriginMutation(req)) return response("forbidden", 403);

  const contentLength = Number(req.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_PHOTO_BYTES + MAX_MULTIPART_OVERHEAD) {
    return response("file_too_large", 413);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return response("bad_request", 400);
  }

  const file = form.get("photo");
  if (!(file instanceof File)) return response("invalid_file", 400);

  const validation = validatePhotoSubmissionFields({
    token: String(form.get("token") ?? ""),
    submitterName: String(form.get("submitterName") ?? ""),
    submitterContact: String(form.get("submitterContact") ?? ""),
    rightsGranted: form.get("rightsGranted") === "granted",
    honeypot: String(form.get("website") ?? ""),
    fileSize: file.size,
    declaredMime: file.type,
  });
  if (!validation.ok) {
    const status = validation.error === "invalid_file" ? 415 : 422;
    return response(validation.error, status);
  }

  const client = serviceClient();
  if (!client) return response("unavailable", 503);
  const schema = await client.rpc("release_readiness_v2");
  if (schema.error || !exactReleaseSchemaProbe(schema.data, 2, "0041")) {
    return response("unavailable", 503);
  }
  const venueSlug = await resolveVenueSlug(client, validation.token);
  if (!venueSlug) return response("invalid_invitation", 404);

  let bytes: Uint8Array;
  try {
    bytes = new Uint8Array(await file.arrayBuffer());
  } catch {
    return response("invalid_file", 400);
  }
  const detectedMime = detectPhotoMime(bytes);
  if (!detectedMime || detectedMime !== validation.mime) {
    return response("invalid_file", 415);
  }
  const contentSha256 = photoContentSha256(bytes);

  const submissionId = randomUUID();
  const imagePath = photoObjectPath(venueSlug, submissionId, detectedMime);
  if (!imagePath) return response("bad_request", 400);

  const { data: reservation, error: reservationError } = await client.rpc(
    "reserve_venue_photo_submission",
    {
      p_submission_id: submissionId,
      p_venue_slug: venueSlug,
      p_image_path: imagePath,
      p_submitter_name: validation.submitterName,
      p_submitter_contact: validation.submitterContact ?? "",
    }
  );
  if (reservationError || !reservation || reservation.ok !== true) {
    const status = reservation?.error === "rate_limited" ? 429 : 502;
    return response(reservation?.error === "rate_limited" ? "rate_limited" : "submission_failed", status);
  }

  const { error: uploadError } = await client.storage
    .from(PHOTO_BUCKET)
    .upload(imagePath, bytes, {
      contentType: detectedMime,
      cacheControl: "300",
      upsert: false,
  });
  if (uploadError) {
    // A failed response does not prove that the object PUT stopped. Request
    // durable cleanup, but leave physical removal to the grace-delayed
    // reconciler so a late Storage commit cannot recreate an orphan object.
    await requestUnconsentedPhotoCleanup(
      client,
      submissionId,
      venueSlug,
      imagePath,
      "upload_failed",
    );
    return processingResponse();
  }

  const uploadStored = await markPhotoUploadStored(
    client,
    submissionId,
    venueSlug,
    imagePath,
    contentSha256,
  );
  if (!uploadStored) {
    const cleanup = await cleanUnconsentedPhoto(
      client,
      submissionId,
      venueSlug,
      imagePath,
      "state_transition_failed",
    );
    return responseAfterCleanup(cleanup, "submission_failed");
  }

  const userAgent = (req.headers.get("user-agent") ?? "").slice(0, 500);
  const submittedIp = boundedClientIp(
    req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip")
  );
  const consentArgs = {
    p_submission_ids: [submissionId],
    p_venue_slug: venueSlug,
    p_actor_name: validation.submitterName,
    p_actor_contact: validation.submitterContact ?? "",
    p_terms_version: PHOTO_CONSENT_TERMS_VERSION,
    p_user_agent: userAgent,
    p_submitted_ip: submittedIp,
  };
  const consent = await client.rpc("record_venue_photo_consent", consentArgs);
  if (consent.error) {
    // The first transaction may have committed even if its response was lost.
    // One exact retry is safe because 0041 makes consent idempotent. If the
    // retry is still ambiguous, preserve both row and object for reconciliation.
    const retry = await client.rpc("record_venue_photo_consent", consentArgs);
    return !retry.error && rpcAccepted(retry.data)
      ? pendingReviewResponse()
      : processingResponse();
  }
  if (!consent.data || typeof consent.data !== "object" || Array.isArray(consent.data)) {
    return processingResponse();
  }
  if (!rpcAccepted(consent.data)) {
    const cleanup = await cleanUnconsentedPhoto(
      client,
      submissionId,
      venueSlug,
      imagePath,
      "consent_rejected",
    );
    return cleanup === "consent_recorded"
      ? pendingReviewResponse()
      : responseAfterCleanup(cleanup, "consent_failed");
  }

  // Never return a storage path, signed URL, public URL or roster data here.
  return pendingReviewResponse();
}
