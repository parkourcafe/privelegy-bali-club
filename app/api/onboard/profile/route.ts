import { NextResponse } from "next/server";
import { notifyOperator } from "@/lib/notify";

import { serviceClient } from "@/lib/supabase/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN = /^[A-Za-z0-9_-]{20,160}$/;
const PRICE_RANGES = new Set(["$", "$$", "$$$", "$$$$"]);

// Hosts a Google Maps place link may live on. Owners paste share links, so
// the short-link domains count too.
const GMAPS_HOSTS = new Set([
  "google.com",
  "www.google.com",
  "maps.google.com",
  "goo.gl",
  "maps.app.goo.gl",
  "g.co",
]);
const INSTAGRAM_HOSTS = new Set(["instagram.com", "www.instagram.com"]);
// Video stays a LINK to a platform the venue already controls — we never
// host/ingest video files ourselves.
const VIDEO_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
  "instagram.com",
  "www.instagram.com",
  "tiktok.com",
  "www.tiktok.com",
  "vimeo.com",
  "www.vimeo.com",
  "facebook.com",
  "www.facebook.com",
  "fb.watch",
]);

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function safeHttpsUrl(value: unknown, allowedHosts?: Set<string>): string | null {
  const raw = text(value, 2048);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    const host = url.hostname.toLowerCase();
    if (allowedHosts && !allowedHosts.has(host)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Honeypot: bots fill every field; humans never see this one.
  if (text(body.company, 200)) {
    return NextResponse.json({ ok: true });
  }

  const token = text(body.token, 160);
  if (!TOKEN.test(token)) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const aboutText = text(body.aboutText, 2000);
  const submitterName = text(body.submitterName, 160);
  if (aboutText.length < 20) {
    return NextResponse.json({ ok: false, error: "about_required" }, { status: 400 });
  }
  if (submitterName.length < 2) {
    return NextResponse.json({ ok: false, error: "name_required" }, { status: 400 });
  }

  const gmapsUrl = safeHttpsUrl(body.gmapsUrl, GMAPS_HOSTS);
  if (!gmapsUrl) {
    return NextResponse.json({ ok: false, error: "gmaps_required" }, { status: 400 });
  }

  const instagramUrl = safeHttpsUrl(body.instagramUrl, INSTAGRAM_HOSTS);
  const websiteUrl = safeHttpsUrl(body.websiteUrl);
  if (text(body.instagramUrl, 2048) && !instagramUrl) {
    return NextResponse.json({ ok: false, error: "invalid_instagram" }, { status: 400 });
  }
  if (text(body.websiteUrl, 2048) && !websiteUrl) {
    return NextResponse.json({ ok: false, error: "invalid_website" }, { status: 400 });
  }
  if (!instagramUrl && !websiteUrl) {
    return NextResponse.json({ ok: false, error: "social_required" }, { status: 400 });
  }

  const videoUrl = safeHttpsUrl(body.videoUrl, VIDEO_HOSTS);
  if (text(body.videoUrl, 2048) && !videoUrl) {
    return NextResponse.json({ ok: false, error: "invalid_video" }, { status: 400 });
  }

  const rawPrice = text(body.priceRange, 8);
  const priceRange = PRICE_RANGES.has(rawPrice) ? rawPrice : null;

  const client = serviceClient();
  if (!client) {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  const { data, error } = await client.rpc("submit_venue_profile_draft", {
    p_token: token,
    p_about_text: aboutText,
    p_gmaps_url: gmapsUrl,
    p_submitter_name: submitterName,
    p_signature_items: text(body.signatureItems, 600) || null,
    p_opening_hours: text(body.openingHours, 400) || null,
    p_price_range: priceRange,
    p_instagram_url: instagramUrl,
    p_website_url: websiteUrl,
    p_video_url: videoUrl,
    p_publish_notes: text(body.publishNotes, 1500) || null,
    p_submitter_role: text(body.submitterRole, 160) || null,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }
  const result = (data ?? {}) as { ok?: boolean; error?: string };
  if (!result.ok) {
    const reason = typeof result.error === "string" ? result.error : "invalid_input";
    const status = reason === "bad_token" ? 404 : 400;
    return NextResponse.json({ ok: false, error: reason }, { status });
  }

  // Best-effort operator notification (no-ops if email isn't configured). Keeps
  // PII minimal — who submitted and where to review, not the full payload.
  await notifyOperator({
    subject: `Owner-filled page draft: ${submitterName}`,
    lines: [
      "A venue owner filled in their page draft via their private /onboard link.",
      "",
      `Submitted by: ${submitterName}${text(body.submitterRole, 160) ? ` (${text(body.submitterRole, 160)})` : ""}`,
      priceRange ? `Price range:  ${priceRange}` : "",
      videoUrl ? "Includes a video link." : "",
      "",
      "Review: https://www.otherbali.com/admin/profile-drafts",
    ].filter(Boolean),
  });

  return NextResponse.json({ ok: true });
}
