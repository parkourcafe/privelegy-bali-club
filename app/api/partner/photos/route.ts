import { NextResponse } from "next/server";
import { getPartnerContext, getPartnerVenue } from "@/lib/partner-context";
import { serviceClient } from "@/lib/supabase/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("venue")?.trim() ?? "";
  if (!(await getPartnerVenue(slug))) return NextResponse.json({ ok: false, error: "venue_membership_required" }, { status: 403 });
  const client = serviceClient();
  if (!client) return NextResponse.json({ ok: false, error: "partner_schema_not_configured" }, { status: 503 });
  const { data, error } = await client.from("venue_photo_submissions").select("id,image_path,source_url,status,consent_granted,owner_confirmed_at,owner_confirmation_note,created_at").eq("venue_slug", slug).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ ok: false, error: "photo_schema_unavailable" }, { status: 503 });
  const photos = await Promise.all((data ?? []).map(async (photo) => {
    const signed = await client.storage.from("venue-photos").createSignedUrl(photo.image_path, 600);
    return { ...photo, image_url: signed.data?.signedUrl ?? null };
  }));
  return NextResponse.json({ ok: true, photos }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(req: Request) {
  let body: { venueSlug?: string; submissionIds?: string[]; actorContact?: string; termsVersion?: string; confirm?: boolean; note?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 }); }
  const slug = body.venueSlug?.trim() ?? "";
  const membership = await getPartnerVenue(slug);
  if (!membership) return NextResponse.json({ ok: false, error: "venue_membership_required" }, { status: 403 });
  const context = await getPartnerContext();
  if (!context) return NextResponse.json({ ok: false, error: "authentication_required" }, { status: 401 });
  const ids = Array.isArray(body.submissionIds) ? [...new Set(body.submissionIds.filter((id): id is string => typeof id === "string"))].slice(0, 20) : [];
  if (!ids.length) return NextResponse.json({ ok: false, error: "submission_ids_required" }, { status: 422 });
  const client = serviceClient();
  if (!client) return NextResponse.json({ ok: false, error: "partner_schema_not_configured" }, { status: 503 });
  const now = new Date().toISOString();
  if (body.confirm !== false) {
    const { data: selected, error: selectedError } = await client
      .from("venue_photo_submissions")
      .select("id,status,consent_granted")
      .eq("venue_slug", slug)
      .in("id", ids);
    if (selectedError || (selected ?? []).length !== ids.length) return NextResponse.json({ ok: false, error: "photo_selection_invalid" }, { status: 422 });
    const invalid = (selected ?? []).some((photo) => photo.status !== "pending" && photo.status !== "approved");
    if (invalid) return NextResponse.json({ ok: false, error: "photo_selection_not_reviewable" }, { status: 422 });
    const consentIds = (selected ?? []).filter((photo) => !photo.consent_granted).map((photo) => photo.id);
    if (consentIds.length) {
      const { data: consentResult, error: consentError } = await client.rpc("record_venue_photo_consent", {
      p_submission_ids: consentIds,
      p_venue_slug: slug,
      p_actor_name: context.email ?? membership.name,
      p_actor_contact: body.actorContact?.trim().slice(0, 200) || null,
      p_terms_version: (body.termsVersion?.trim() || "photo-rights-v1").slice(0, 80),
      p_user_agent: req.headers.get("user-agent")?.slice(0, 500) ?? "partner-workspace",
      p_submitted_ip: null,
      });
      if (consentError || !consentResult || consentResult.ok !== true) return NextResponse.json({ ok: false, error: "photo_consent_not_recorded" }, { status: 422 });
    }
    const { error: confirmError } = await client.from("venue_photo_submissions").update({ owner_confirmed_at: now, owner_confirmed_by: context.userId, owner_confirmation_note: body.note?.trim().slice(0, 2000) || null, updated_at: now }).in("id", ids).eq("venue_slug", slug);
    if (confirmError) return NextResponse.json({ ok: false, error: "photo_confirmation_not_recorded" }, { status: 422 });
  } else {
    const { error } = await client.from("venue_photo_submissions").update({ owner_confirmed_at: null, owner_confirmed_by: null, owner_confirmation_note: body.note?.trim().slice(0, 2000) || null, updated_at: now }).in("id", ids).eq("venue_slug", slug);
    if (error) return NextResponse.json({ ok: false, error: "photo_confirmation_not_updated" }, { status: 422 });
  }
  return NextResponse.json({ ok: true, publicationAllowed: false, status: "owner_review_recorded" });
}
