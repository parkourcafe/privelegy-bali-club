import { NextResponse } from "next/server";
import { anonClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 48-hours guide lead capture (brief §18). Validates, applies the honeypot,
// then stores via the submit_guide_lead SECURITY DEFINER RPC (migration
// 0018). Honest failure modes: without a configured DB or applied migration
// the API reports stored:false — the client then still shows the web guide
// but NEVER claims anything was saved or sent.

interface LeadBody {
  firstName?: string;
  channel?: string;
  email?: string;
  whatsapp?: string;
  travelDate?: string;
  interests?: string[];
  language?: string;
  source?: string;
  utm?: Record<string, string>;
  consent?: boolean;
  website?: string; // honeypot — real users never fill it
}

export async function POST(req: Request) {
  let body: LeadBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Honeypot: pretend success to the bot, store nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true, stored: false, spam: true });
  }

  const firstName = (body.firstName ?? "").trim();
  const channel = body.channel === "whatsapp" ? "whatsapp" : "email";
  const email = (body.email ?? "").trim();
  const whatsapp = (body.whatsapp ?? "").replace(/[^0-9]/g, "");

  if (!body.consent) {
    return NextResponse.json({ ok: false, error: "consent_required" }, { status: 400 });
  }
  if (!firstName) {
    return NextResponse.json({ ok: false, error: "name_required" }, { status: 400 });
  }
  if (channel === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "bad_email" }, { status: 400 });
  }
  if (channel === "whatsapp" && (whatsapp.length < 7 || whatsapp.length > 16)) {
    return NextResponse.json({ ok: false, error: "bad_whatsapp" }, { status: 400 });
  }

  const sb = anonClient();
  if (!sb) {
    // No DB configured: be honest — the guide is still readable on the page.
    return NextResponse.json({ ok: false, error: "lead_storage_unconfigured" }, { status: 503 });
  }

  const { data, error } = await sb.rpc("submit_guide_lead", {
    p_first_name: firstName,
    p_channel: channel,
    p_email: channel === "email" ? email : null,
    p_whatsapp: channel === "whatsapp" ? whatsapp : null,
    p_travel_date: body.travelDate?.trim() || null,
    p_interests: Array.isArray(body.interests) ? body.interests.slice(0, 8) : null,
    p_language: body.language ?? null,
    p_source: body.source ?? null,
    p_utm: body.utm ?? null,
    p_consent: true,
    p_user_agent: req.headers.get("user-agent") ?? null,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "lead_write_failed" }, { status: 502 });
  }
  const r = (data ?? {}) as { ok?: boolean; error?: string; duplicate?: boolean };
  if (!r.ok) {
    return NextResponse.json({ ok: false, error: r.error ?? "lead_write_failed" }, { status: 400 });
  }
  return NextResponse.json({ ok: true, stored: true, duplicate: Boolean(r.duplicate) });
}
