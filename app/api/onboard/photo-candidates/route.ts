import { NextResponse } from "next/server";

import { readBoundedJson } from "@/lib/api/request";
import {
  OWNER_PHOTO_CANDIDATE_BUCKET,
  OWNER_PHOTO_CONSENT_BUCKET,
  ownerCandidatesForVenue,
} from "@/lib/owner-photo-candidates";
import { ownerCandidateConsentPath } from "@/lib/owner-photo-candidate-id";
import { photoContentSha256 } from "@/lib/photo-content-digest";
import { resolvePhotoOnboardingVenue } from "@/lib/photo-onboarding-token";
import {
  MAX_STORED_PHOTO_BYTES,
  boundedClientIp,
  detectPhotoMime,
} from "@/lib/photo-submission-policy";
import { isTrustedSameOriginMutation } from "@/lib/same-origin-mutation";
import { serviceClient } from "@/lib/supabase/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;
const TOKEN = /^[A-Za-z0-9_-]{32,256}$/;
const SHA256 = /^[a-f0-9]{64}$/;
const NO_STORE = { "Cache-Control": "private, no-store, max-age=0" };

function response(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

function parseRequest(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const body = value as Record<string, unknown>;
  const token = typeof body.token === "string" ? body.token.trim() : "";
  const ids = Array.isArray(body.candidateIds)
    ? body.candidateIds.filter((id): id is string => typeof id === "string")
    : [];
  if (
    !TOKEN.test(token)
    || body.website !== ""
    || ids.length < 1
    || ids.length > 100
    || new Set(ids).size !== ids.length
    || ids.some((id) => !SHA256.test(id))
  ) return null;
  return { token, ids };
}

export async function POST(request: Request) {
  if (!isTrustedSameOriginMutation(request)) {
    return response({ ok: false, error: "forbidden" }, 403);
  }
  const body = await readBoundedJson(request, MAX_BODY_BYTES);
  if (!body.ok) {
    return response(
      { ok: false, error: body.error },
      body.error === "payload_too_large" ? 413 : 400,
    );
  }
  const input = parseRequest(body.value);
  if (!input) return response({ ok: false, error: "invalid_request" }, 422);

  const client = serviceClient();
  if (!client) return response({ ok: false, error: "unavailable" }, 503);
  const venueSlug = await resolvePhotoOnboardingVenue(client, input.token);
  if (!venueSlug) return response({ ok: false, error: "invalid_invitation" }, 404);

  const allowed = new Map(
    ownerCandidatesForVenue(venueSlug).map((candidate) => [candidate.id, candidate]),
  );
  const selected = input.ids.map((id) => allowed.get(id));
  if (selected.some((candidate) => !candidate)) {
    return response({ ok: false, error: "candidate_mismatch" }, 422);
  }

  const submittedIp = boundedClientIp(
    request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip"),
  );
  const userAgent = (request.headers.get("user-agent") ?? "").slice(0, 500);
  let saved = 0;
  let alreadySaved = 0;

  for (const candidate of selected) {
    if (!candidate) continue;
    const source = await client.storage
      .from(OWNER_PHOTO_CANDIDATE_BUCKET)
      .download(candidate.objectPath);
    if (source.error || !source.data) {
      return response({ ok: false, error: "candidate_unavailable" }, 503);
    }
    const bytes = new Uint8Array(await source.data.arrayBuffer());
    if (
      bytes.length !== candidate.bytes
      || bytes.length > MAX_STORED_PHOTO_BYTES
      || detectPhotoMime(bytes) !== candidate.mimeType
      || photoContentSha256(bytes) !== candidate.sha256
    ) {
      return response({ ok: false, error: "candidate_integrity_failed" }, 409);
    }

    const selectionPath = ownerCandidateConsentPath(venueSlug, candidate.id);
    const selection = {
      schemaVersion: 2,
      status: "owner_selected_pending_operator_review",
      venueSlug,
      candidateId: candidate.id,
      candidateObjectPath: candidate.objectPath,
      candidateSha256: candidate.sha256,
      ownerSelected: true,
      rightsLicenseGranted: false,
      selectedAt: new Date().toISOString(),
      submittedIp,
      submittedUserAgent: userAgent,
      publicationAllowed: false,
    };
    const stored = await client.storage
      .from(OWNER_PHOTO_CONSENT_BUCKET)
      .upload(selectionPath, JSON.stringify(selection), {
        contentType: "application/json",
        cacheControl: "300",
        upsert: false,
      });
    if (!stored.error) {
      saved += 1;
      continue;
    }

    const prior = await client.storage
      .from(OWNER_PHOTO_CONSENT_BUCKET)
      .download(selectionPath);
    if (prior.error || !prior.data) {
      return response({ ok: false, error: "selection_staging_failed" }, 503);
    }
    try {
      const value = JSON.parse(await prior.data.text());
      if (
        value?.venueSlug !== venueSlug
        || value?.candidateId !== candidate.id
        || value?.candidateSha256 !== candidate.sha256
        || (value?.ownerSelected !== true && value?.rightsGranted !== true)
        || value?.publicationAllowed !== false
      ) {
        return response({ ok: false, error: "selection_staging_conflict" }, 409);
      }
      alreadySaved += 1;
    } catch {
      return response({ ok: false, error: "selection_staging_conflict" }, 409);
    }
  }

  return response({
    ok: true,
    status: "owner_selection_saved",
    saved,
    alreadySaved,
    publicationAllowed: false,
  }, 201);
}
