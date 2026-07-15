import { NextResponse } from "next/server";
import { getPartnerVenue } from "@/lib/partner-context";
import { serviceClient } from "@/lib/supabase/service";
import { normalizeActionProvider, validateExternalProviderUrl, validatePublicEvidenceUrl } from "@/lib/integrations/external-ordering";
import type { ActionKind } from "@/lib/contracts/menu-action";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KINDS = new Set<ActionKind>(["reserve", "delivery", "takeaway", "preorder", "website", "whatsapp"]);
const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(req: Request) {
  let body: { venueSlug?: string; kind?: string; provider?: string; url?: string; label?: string; sourceUrl?: string; sourceLabel?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 }); }
  const venueSlug = text(body.venueSlug, 160);
  if (!(await getPartnerVenue(venueSlug))) return NextResponse.json({ ok: false, error: "venue_membership_required" }, { status: 403 });
  const kind = text(body.kind, 20) as ActionKind;
  if (!KINDS.has(kind)) return NextResponse.json({ ok: false, error: "unsupported_action_kind" }, { status: 422 });
  const provider = normalizeActionProvider(body.provider);
  if (!provider) return NextResponse.json({ ok: false, error: "unsupported_provider" }, { status: 422 });
  const sourceUrl = validatePublicEvidenceUrl(body.sourceUrl);
  if (!sourceUrl) return NextResponse.json({ ok: false, error: "official_https_source_required" }, { status: 422 });
  const url = validateExternalProviderUrl({ provider, kind, url: text(body.url, 1000), sourceUrl });
  if (!url) return NextResponse.json({ ok: false, error: "provider_url_not_allowed" }, { status: 422 });
  const client = serviceClient();
  if (!client) return NextResponse.json({ ok: false, error: "partner_schema_not_configured" }, { status: 503 });
  const { data: latest, error: latestError } = await client.from("venue_action_capabilities").select("version").eq("venue_slug", venueSlug).eq("kind", kind).order("version", { ascending: false }).limit(1).maybeSingle();
  if (latestError) return NextResponse.json({ ok: false, error: "action_schema_unavailable" }, { status: 503 });
  const now = new Date();
  const { data, error } = await client.from("venue_action_capabilities").insert({
    venue_slug: venueSlug,
    kind,
    provider,
    version: Number(latest?.version ?? 0) + 1,
    url,
    label: text(body.label, 160) || null,
    status: "draft",
    priority: 100,
    confirmation_required: true,
    source_url: sourceUrl,
    source_label: text(body.sourceLabel, 160) || "Venue-submitted source",
    captured_at: now.toISOString(),
    verified_at: null,
    expires_at: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }).select("id,version,status,verified_at").single();
  if (error || !data) return NextResponse.json({ ok: false, error: "action_draft_not_created" }, { status: 422 });
  return NextResponse.json({ ok: true, draft: data }, { status: 201 });
}
