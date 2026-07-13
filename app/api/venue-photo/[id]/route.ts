import { serviceClient } from "@/lib/supabase/service";
import {
  MAX_STORED_PHOTO_BYTES,
  PHOTO_BUCKET,
  detectPhotoMime,
  isPhotoRecordId,
} from "@/lib/photo-submission-policy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function notFound() {
  return new Response("Not found", {
    status: 404,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!isPhotoRecordId(id)) return notFound();

  const client = serviceClient();
  if (!client) return notFound();
  const { data: submission, error } = await client
    .from("venue_photo_submissions")
    .select("id,venue_slug,image_path,status,consent_granted,consent_log_id,published_url")
    .eq("id", id)
    .eq("status", "approved")
    .eq("consent_granted", true)
    .not("consent_log_id", "is", null)
    .single();
  if (error || !submission?.image_path || !submission.published_url) return notFound();

  const { data: consent, error: consentError } = await client
    .from("consent_log")
    .select("id")
    .eq("id", submission.consent_log_id)
    .eq("venue_slug", submission.venue_slug)
    .eq("consent_type", "venue_photo_rights")
    .eq("granted", true)
    .contains("submission_ids", [id])
    .maybeSingle();
  if (consentError || !consent) return notFound();

  const { data: object, error: objectError } = await client.storage
    .from(PHOTO_BUCKET)
    .download(submission.image_path);
  if (objectError || !object || object.size < 1 || object.size > MAX_STORED_PHOTO_BYTES) {
    return notFound();
  }

  const bytes = new Uint8Array(await object.arrayBuffer());
  const mime = detectPhotoMime(bytes);
  if (!mime) return notFound();

  return new Response(bytes, {
    status: 200,
    headers: {
      "Content-Type": mime,
      "Content-Length": String(bytes.byteLength),
      "Cache-Control": "public, max-age=300, s-maxage=300, must-revalidate",
      "Content-Disposition": "inline",
      "Cross-Origin-Resource-Policy": "same-site",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
