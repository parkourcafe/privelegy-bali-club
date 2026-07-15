import { NextResponse } from "next/server";

import { readBoundedJson } from "@/lib/api/request";
import {
  OWNER_PHOTO_CANDIDATE_BUCKET,
  OWNER_PHOTO_CONSENT_BUCKET,
  ownerCandidatesForVenue,
} from "@/lib/owner-photo-candidates";
import {
  ownerCandidateConsentPath,
  ownerCandidateSubmissionId,
} from "@/lib/owner-photo-candidate-id";
import { photoContentSha256 } from "@/lib/photo-content-digest";
import { resolvePhotoOnboardingVenue } from "@/lib/photo-onboarding-token";
import {
  MAX_STORED_PHOTO_BYTES,
  PHOTO_BUCKET,
  PHOTO_CONSENT_TERMS_VERSION,
  boundedClientIp,
  detectPhotoMime,
  photoObjectPath,
} from "@/lib/photo-submission-policy";
import {
  cleanUnconsentedPhoto,
  markPhotoUploadStored,
} from "@/lib/photo-submission-reconciliation";
import { exactReleaseSchemaProbe } from "@/lib/release-schema-probe";
import { isTrustedSameOriginMutation } from "@/lib/same-origin-mutation";
import { serviceClient } from "@/lib/supabase/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8 * 1024;
const TOKEN = /^[A-Za-z0-9_-]{32,256}$/;
const SHA256 = /^[a-f0-9]{64}$/;
const NO_STORE = { "Cache-Control": "private, no-store, max-age=0" };

function response(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

function accepted(data: unknown): boolean {
  return Boolean(data)
    && typeof data === "object"
    && !Array.isArray(data)
    && (data as { ok?: unknown }).ok === true;
}

function parseRequest(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const body = value as Record<string, unknown>;
  const token = typeof body.token === "string" ? body.token.trim() : "";
  const submitterName = typeof body.submitterName === "string" ? body.submitterName.trim() : "";
  const submitterContact = typeof body.submitterContact === "string" ? body.submitterContact.trim() : "";
  const ids = Array.isArray(body.candidateIds)
    ? body.candidateIds.filter((id): id is string => typeof id === "string")
    : [];
  if (
    !TOKEN.test(token)
    || submitterName.length < 2
    || submitterName.length > 120
    || submitterContact.length > 200
    || body.rightsGranted !== true
    || body.website !== ""
    || ids.length < 1
    || ids.length > 3
    || new Set(ids).size !== ids.length
    || ids.some((id) => !SHA256.test(id))
  ) return null;
  return { token, submitterName, submitterContact, ids };
}

export async function POST(request: Request) {
  if (!isTrustedSameOriginMutation(request)) return response({ ok: false, error: "forbidden" }, 403);
  const body = await readBoundedJson(request, MAX_BODY_BYTES);
  if (!body.ok) return response({ ok: false, error: body.error }, body.error === "payload_too_large" ? 413 : 400);
  const input = parseRequest(body.value);
  if (!input) return response({ ok: false, error: "invalid_request" }, 422);

  const client = serviceClient();
  if (!client) return response({ ok: false, error: "unavailable" }, 503);
  const schema = await client.rpc("release_readiness_v2");
  const schemaReady = !schema.error && exactReleaseSchemaProbe(schema.data, 2, "0041");
  const venueSlug = await resolvePhotoOnboardingVenue(client, input.token);
  if (!venueSlug) return response({ ok: false, error: "invalid_invitation" }, 404);

  const allowed = new Map(ownerCandidatesForVenue(venueSlug).map((candidate) => [candidate.id, candidate]));
  const selected = input.ids.map((id) => allowed.get(id));
  if (selected.some((candidate) => !candidate)) {
    return response({ ok: false, error: "candidate_mismatch" }, 422);
  }

  const userAgent = (request.headers.get("user-agent") ?? "").slice(0, 500);
  const submittedIp = boundedClientIp(
    request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip"),
  );

  if (!schemaReady) {
    let staged = 0;
    let alreadyStaged = 0;
    for (const candidate of selected) {
      if (!candidate) continue;
      const source = await client.storage
        .from(OWNER_PHOTO_CANDIDATE_BUCKET)
        .download(candidate.objectPath);
      if (source.error || !source.data) return response({ ok: false, error: "candidate_unavailable" }, 503);
      const bytes = new Uint8Array(await source.data.arrayBuffer());
      if (
        bytes.length !== candidate.bytes
        || bytes.length > MAX_STORED_PHOTO_BYTES
        || detectPhotoMime(bytes) !== candidate.mimeType
        || photoContentSha256(bytes) !== candidate.sha256
      ) return response({ ok: false, error: "candidate_integrity_failed" }, 409);

      const receiptPath = ownerCandidateConsentPath(venueSlug, candidate.id);
      const receipt = {
        schemaVersion: 1,
        status: "pending_operator_import",
        venueSlug,
        candidateId: candidate.id,
        candidateObjectPath: candidate.objectPath,
        candidateSha256: candidate.sha256,
        rightsGranted: true,
        termsVersion: PHOTO_CONSENT_TERMS_VERSION,
        actorName: input.submitterName,
        actorContact: input.submitterContact,
        submittedAt: new Date().toISOString(),
        submittedIp,
        submittedUserAgent: userAgent,
        publicationAllowed: false,
      };
      const stored = await client.storage
        .from(OWNER_PHOTO_CONSENT_BUCKET)
        .upload(receiptPath, JSON.stringify(receipt), {
          contentType: "application/json",
          cacheControl: "300",
          upsert: false,
        });
      if (!stored.error) {
        staged += 1;
        continue;
      }
      const prior = await client.storage.from(OWNER_PHOTO_CONSENT_BUCKET).download(receiptPath);
      if (prior.error || !prior.data) return response({ ok: false, error: "consent_staging_failed" }, 503);
      try {
        const value = JSON.parse(await prior.data.text());
        if (
          value?.venueSlug !== venueSlug
          || value?.candidateId !== candidate.id
          || value?.candidateSha256 !== candidate.sha256
          || value?.rightsGranted !== true
          || value?.publicationAllowed !== false
        ) return response({ ok: false, error: "consent_staging_conflict" }, 409);
        alreadyStaged += 1;
      } catch {
        return response({ ok: false, error: "consent_staging_conflict" }, 409);
      }
    }
    return response({
      ok: true,
      status: "pending_review_staged",
      staged,
      alreadyStaged,
      publicationAllowed: false,
    }, 201);
  }

  const newlyStored: Array<{ id: string; path: string }> = [];
  let alreadySubmitted = 0;

  for (const candidate of selected) {
    if (!candidate) continue;
    const submissionId = ownerCandidateSubmissionId(venueSlug, candidate.id);
    const imagePath = photoObjectPath(venueSlug, submissionId, candidate.mimeType);
    if (!imagePath) return response({ ok: false, error: "candidate_mismatch" }, 422);

    const existing = await client
      .from("venue_photo_submissions")
      .select("id,venue_slug,image_path,status,storage_state,content_sha256,consent_granted")
      .eq("id", submissionId)
      .maybeSingle();
    if (existing.error) return response({ ok: false, error: "submission_failed" }, 502);
    if (existing.data) {
      const digest = String(existing.data.content_sha256 ?? "").replace(/^\\x/, "").toLowerCase();
      if (
        existing.data.venue_slug === venueSlug
        && existing.data.image_path === imagePath
        && existing.data.storage_state === "uploaded"
        && digest === candidate.sha256
        && existing.data.consent_granted === true
        && ["pending", "approved", "rejected"].includes(String(existing.data.status))
      ) {
        alreadySubmitted += 1;
        continue;
      }
      return response({ ok: true, status: "processing" }, 202);
    }

    const source = await client.storage.from(OWNER_PHOTO_CANDIDATE_BUCKET).download(candidate.objectPath);
    if (source.error || !source.data) return response({ ok: false, error: "candidate_unavailable" }, 503);
    const bytes = new Uint8Array(await source.data.arrayBuffer());
    if (
      bytes.length !== candidate.bytes
      || bytes.length > MAX_STORED_PHOTO_BYTES
      || detectPhotoMime(bytes) !== candidate.mimeType
      || photoContentSha256(bytes) !== candidate.sha256
    ) return response({ ok: false, error: "candidate_integrity_failed" }, 409);

    const reservation = await client.rpc("reserve_venue_photo_submission", {
      p_submission_id: submissionId,
      p_venue_slug: venueSlug,
      p_image_path: imagePath,
      p_submitter_name: input.submitterName,
      p_submitter_contact: input.submitterContact,
    });
    if (reservation.error || !accepted(reservation.data)) {
      return response({ ok: false, error: "submission_failed" }, 502);
    }

    const upload = await client.storage.from(PHOTO_BUCKET).upload(imagePath, bytes, {
      contentType: candidate.mimeType,
      cacheControl: "300",
      upsert: false,
    });
    if (upload.error) return response({ ok: true, status: "processing" }, 202);
    if (!await markPhotoUploadStored(client, submissionId, venueSlug, imagePath, candidate.sha256)) {
      await cleanUnconsentedPhoto(client, submissionId, venueSlug, imagePath, "state_transition_failed");
      return response({ ok: false, error: "submission_failed" }, 502);
    }
    newlyStored.push({ id: submissionId, path: imagePath });
  }

  if (newlyStored.length > 0) {
    const args = {
      p_submission_ids: newlyStored.map((item) => item.id),
      p_venue_slug: venueSlug,
      p_actor_name: input.submitterName,
      p_actor_contact: input.submitterContact,
      p_terms_version: PHOTO_CONSENT_TERMS_VERSION,
      p_user_agent: userAgent,
      p_submitted_ip: submittedIp,
    };
    const consent = await client.rpc("record_venue_photo_consent", args);
    if (consent.error || !accepted(consent.data)) {
      const retry = await client.rpc("record_venue_photo_consent", args);
      if (retry.error || !accepted(retry.data)) {
        return response({ ok: true, status: "processing" }, 202);
      }
    }
  }

  return response({
    ok: true,
    status: "pending_review",
    submitted: newlyStored.length,
    alreadySubmitted,
  }, 201);
}
