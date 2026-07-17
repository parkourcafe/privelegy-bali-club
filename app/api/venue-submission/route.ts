import { NextResponse } from "next/server";
import { anonClient } from "@/lib/supabase/server";
import { notifyOperator } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public venue self-submission intake (migration 0035). A net-new venue asks
// to be added; the row lands in the needs_verification queue and NEVER
// publishes itself. Mirrors /api/guide-lead: honeypot, validation, storage via
// the submit_venue_application SECURITY DEFINER RPC, honest failure modes —
// without a configured DB the API reports stored:false and the UI never
// claims a listing was created.

interface SubmissionBody {
  name?: string;
  category?: string;
  district?: string;
  whatsapp?: string;
  email?: string;
  instagram?: string;
  websiteUrl?: string;
  note?: string;
  consent?: boolean;
  source?: string;
  utm?: Record<string, string>;
  website?: string; // honeypot — real users never fill it
}

export async function POST(req: Request) {
  let body: SubmissionBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Honeypot: pretend success to the bot, store nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true, stored: false, spam: true });
  }

  const name = (body.name ?? "").trim();
  const whatsapp = (body.whatsapp ?? "").replace(/[^0-9]/g, "");
  const email = (body.email ?? "").trim();
  const instagram = (body.instagram ?? "").trim();
  const websiteUrl = (body.websiteUrl ?? "").trim();

  if (!body.consent) {
    return NextResponse.json({ ok: false, error: "consent_required" }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ ok: false, error: "name_required" }, { status: 400 });
  }
  if (!whatsapp && !email && !instagram && !websiteUrl) {
    return NextResponse.json({ ok: false, error: "contact_required" }, { status: 400 });
  }

  const sb = anonClient();
  if (!sb) {
    return NextResponse.json({ ok: false, error: "submission_storage_unconfigured" }, { status: 503 });
  }

  const { data, error } = await sb.rpc("submit_venue_application", {
    p_name: name,
    p_category: body.category?.trim() || null,
    p_district: body.district?.trim() || null,
    p_whatsapp: whatsapp || null,
    p_email: email || null,
    p_instagram_url: instagram || null,
    p_website_url: websiteUrl || null,
    p_note: body.note?.trim() || null,
    p_consent: true,
    p_source: body.source ?? null,
    p_utm: body.utm ?? null,
    p_user_agent: req.headers.get("user-agent") ?? null,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "submission_write_failed" }, { status: 502 });
  }
  const r = (data ?? {}) as { ok?: boolean; error?: string; duplicate?: boolean };
  if (!r.ok) {
    return NextResponse.json({ ok: false, error: r.error ?? "submission_write_failed" }, { status: 400 });
  }

  // Best-effort operator notification (no-ops if email isn't configured).
  if (!r.duplicate) {
    await notifyOperator({
      subject: `New listing request: ${name}`,
      lines: [
        "A venue asked to be listed via /for-venues.",
        "",
        `Name:      ${name}`,
        `Category:  ${body.category?.trim() || "—"}`,
        `District:  ${body.district?.trim() || "—"}`,
        `WhatsApp:  ${whatsapp || "—"}`,
        `Email:     ${email || "—"}`,
        `Instagram: ${instagram || "—"}`,
        `Website:   ${websiteUrl || "—"}`,
        ...(body.note?.trim() ? ["", `Note: ${body.note.trim()}`] : []),
        "",
        "Review: https://www.otherbali.com/admin/submissions",
      ],
    });
  }

  return NextResponse.json({ ok: true, stored: true, duplicate: Boolean(r.duplicate) });
}
