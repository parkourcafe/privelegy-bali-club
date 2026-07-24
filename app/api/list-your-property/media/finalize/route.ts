import { NextResponse } from "next/server";
import { PROTECTED_PREVIEW_SUBMISSION_SOURCE } from "@/lib/supabase/protected-preview-media-policy";
import {
  isProductionSubmissionMediaPreviewBridgeActive,
  submissionMediaServiceClient,
} from "@/lib/supabase/service";
import {
  SUBMISSION_MEDIA_BUCKET,
  detectMediaMime,
  verifyMediaToken,
  type SubmissionMediaEntry,
} from "@/lib/submission-media-policy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stage B step 2: mandatory finalize. Signed uploads bypass the server, so the
// only trustworthy validation happens HERE — re-read the stored object's first
// bytes, confirm the magic bytes match the declared kind/mime, and delete+reject
// on mismatch. A file that never finalizes stays "reserved" and can never be
// promoted (the operator/promotion path only ever uses "uploaded" rows).

const SAME_SITE = new Set(["same-origin", "same-site", "none"]);
const SNIFF_BYTES = 512 * 1024;

function err(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request) {
  const site = req.headers.get("sec-fetch-site");
  if (site && !SAME_SITE.has(site)) return err("forbidden", 403);

  let body: { submissionId?: string; mediaToken?: string; mediaId?: string };
  try {
    body = await req.json();
  } catch {
    return err("bad_request", 400);
  }

  const submissionId = String(body.submissionId ?? "");
  const token = String(body.mediaToken ?? "");
  const mediaId = String(body.mediaId ?? "");

  if (!verifyMediaToken(submissionId, token, Date.now())) return err("unauthorized", 401);
  if (!mediaId) return err("bad_request", 400);

  const sb = submissionMediaServiceClient();
  if (!sb) return err("storage_unconfigured", 503);

  const { data: row, error: rowErr } = await sb
    .from("venue_submissions")
    .select("id,source,media")
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

  const media: SubmissionMediaEntry[] = Array.isArray(row.media) ? (row.media as SubmissionMediaEntry[]) : [];
  const entry = media.find((m) => m.id === mediaId && m.status === "reserved");
  if (!entry) return err("not_found", 404);

  // Range-read only the first chunk (never pull a 50 MB video into the function).
  let detected: string | null = null;
  try {
    const { data: dl } = await sb.storage
      .from(SUBMISSION_MEDIA_BUCKET)
      .createSignedUrl(entry.path, 60);
    if (dl?.signedUrl) {
      const res = await fetch(dl.signedUrl, { headers: { Range: `bytes=0-${SNIFF_BYTES - 1}` } });
      if (res.ok) {
        const buf = new Uint8Array(await res.arrayBuffer());
        detected = detectMediaMime(entry.kind, buf);
      }
    }
  } catch {
    detected = null;
  }

  const accepted = detected !== null && detected === entry.mime;
  const nextStatus: SubmissionMediaEntry["status"] = accepted ? "uploaded" : "rejected";

  if (!accepted) {
    // Delete the bytes that failed the sniff — nothing rejected is ever kept.
    await sb.storage.from(SUBMISSION_MEDIA_BUCKET).remove([entry.path]).catch(() => {});
  }

  const nextMedia = media.map((m) => (m.id === mediaId ? { ...m, status: nextStatus } : m));
  const { error: updErr } = await sb
    .from("venue_submissions")
    .update({ media: nextMedia, updated_at: new Date().toISOString() })
    .eq("id", submissionId);
  if (updErr) return err("finalize_failed", 502);

  return NextResponse.json({ ok: true, status: nextStatus });
}
