import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isCurrentAdminRequestAuthorized } from "@/lib/admin-request-auth";
import { PROTECTED_PREVIEW_SUBMISSION_SOURCE } from "@/lib/supabase/protected-preview-media-policy";
import {
  isProductionSubmissionMediaPreviewBridgeActive,
  submissionMediaServiceClient,
} from "@/lib/supabase/service";
import {
  SUBMISSION_MEDIA_BUCKET,
  SUBMISSION_MEDIA_RIGHTS_VERSION,
  isAllowedMime,
  isMediaKind,
  maxBytesForKind,
  maxCountForKind,
  mediaObjectPath,
  verifyMediaToken,
  type SubmissionMediaEntry,
} from "@/lib/submission-media-policy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stage B step 1: mint a single-use signed upload URL for one file. The browser
// PUTs the bytes straight to the PRIVATE submission-media bucket (past Vercel's
// body cap); the service-role key never leaves the server. A "reserved" entry is
// recorded on venue_submissions.media; the finalize route re-sniffs the stored
// object before it is ever considered usable.

const SAME_SITE = new Set(["same-origin", "same-site", "none"]);

function err(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request) {
  const site = req.headers.get("sec-fetch-site");
  if (site && !SAME_SITE.has(site)) return err("forbidden", 403);

  let body: {
    submissionId?: string;
    mediaToken?: string;
    kind?: unknown;
    mime?: string;
    size?: number;
    rightsGranted?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return err("bad_request", 400);
  }

  const submissionId = String(body.submissionId ?? "");
  const token = String(body.mediaToken ?? "");
  const kind = body.kind;
  const mime = String(body.mime ?? "");
  const size = Number(body.size ?? 0);
  const rightsGranted = body.rightsGranted === true;

  if (!verifyMediaToken(submissionId, token, Date.now())) return err("unauthorized", 401);
  if (!isMediaKind(kind)) return err("bad_kind", 400);
  if (!isAllowedMime(kind, mime)) return err("bad_mime", 415);
  if (!Number.isFinite(size) || size < 1 || size > maxBytesForKind(kind)) return err("file_too_large", 413);
  if (!rightsGranted) return err("rights_required", 400);

  const sb = submissionMediaServiceClient();
  if (!sb) return err("storage_unconfigured", 503);

  const { data: row, error: rowErr } = await sb
    .from("venue_submissions")
    .select("id,status,source,media")
    .eq("id", submissionId)
    .maybeSingle();
  if (rowErr) return err("lookup_failed", 502);
  if (!row) return err("not_found", 404);
  if (
    isProductionSubmissionMediaPreviewBridgeActive() &&
    row.source !== PROTECTED_PREVIEW_SUBMISSION_SOURCE
  ) {
    return err("forbidden", 403);
  }
  const status = String(row.status);
  const pendingUpload = ["needs_verification", "reviewing"].includes(status);
  const acceptedOperatorPreview =
    status === "accepted" && (await isCurrentAdminRequestAuthorized());
  if (!pendingUpload && !acceptedOperatorPreview) return err("closed", 409);

  // Quota counts reserved+uploaded only (rejected files must not lock the owner out).
  const media: SubmissionMediaEntry[] = Array.isArray(row.media) ? (row.media as SubmissionMediaEntry[]) : [];
  const active = media.filter((m) => m.kind === kind && m.status !== "rejected");
  if (active.length >= maxCountForKind(kind)) return err("limit_reached", 409);

  const path = mediaObjectPath(submissionId, mime);
  if (!path) return err("bad_request", 400);

  const { data: signed, error: signErr } = await sb.storage
    .from(SUBMISSION_MEDIA_BUCKET)
    .createSignedUploadUrl(path);
  if (signErr || !signed) return err("sign_failed", 502);

  const entry: SubmissionMediaEntry = {
    id: randomUUID(),
    kind,
    path,
    mime,
    size,
    status: "reserved",
    rightsGranted: true,
    rightsTermsVersion: SUBMISSION_MEDIA_RIGHTS_VERSION,
    createdAt: new Date().toISOString(),
  };

  const { error: updErr } = await sb
    .from("venue_submissions")
    .update({ media: [...media, entry], updated_at: new Date().toISOString() })
    .eq("id", submissionId);
  if (updErr) {
    await sb.storage.from(SUBMISSION_MEDIA_BUCKET).remove([path]).catch(() => {});
    return err("reserve_failed", 502);
  }

  return NextResponse.json({
    ok: true,
    mediaId: entry.id,
    path,
    uploadUrl: signed.signedUrl,
    token: signed.token,
  });
}
