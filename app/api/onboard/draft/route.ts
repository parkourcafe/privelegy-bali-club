import { NextResponse } from "next/server";

import { serviceClient } from "@/lib/supabase/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN = /^[A-Za-z0-9_-]{20,160}$/;
const ACTION_KINDS = new Set(["reserve", "delivery", "takeaway", "preorder", "website", "whatsapp"]);
const PROVIDERS = new Set([
  "official", "whatsapp", "grabfood", "gofood", "shopeefood",
  "sevenrooms", "resdiary", "chope", "tablecheck",
]);
const DRAFT_TTL_MS = 60 * 24 * 60 * 60 * 1000;

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function safeHttps(value: unknown): string | null {
  const raw = text(value, 2048);
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      host === "example.com" ||
      host.endsWith(".example.com")
    ) return null;
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

  const token = text(body.token, 160);
  const draftType = text(body.draftType, 20);
  if (!TOKEN.test(token) || !["menu", "action"].includes(draftType)) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const client = serviceClient();
  if (!client) {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  if (draftType === "menu") {
    const capturedAt = new Date();
    const expiresAt = new Date(capturedAt.getTime() + DRAFT_TTL_MS);
    const title = text(body.title, 160);
    const sourceUrl = safeHttps(body.sourceUrl);
    const section = text(body.section, 160);
    const itemName = text(body.item, 240);
    const rawPrice = text(body.price, 20);
    const parsedPrice = rawPrice === "" ? null : Number(rawPrice);
    const priceMinor = parsedPrice === null
      ? null
      : Number.isFinite(parsedPrice) && parsedPrice >= 0 && parsedPrice <= 1_000_000_000
        ? Math.round(parsedPrice)
        : Number.NaN;
    if (!title || !sourceUrl || !section || !itemName || Number.isNaN(priceMinor)) {
      return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
    }

    const { data: draft, error: draftError } = await client.rpc("create_partner_menu_draft", {
      p_token: token,
      p_title: title,
      p_source_url: sourceUrl,
      p_source_label: "Venue-provided menu",
      p_captured_at: capturedAt.toISOString(),
      p_expires_at: expiresAt.toISOString(),
    });
    const menuId = draft && typeof draft === "object" && "menu_id" in draft
      ? String(draft.menu_id)
      : "";
    if (draftError || !menuId) {
      return NextResponse.json({ ok: false, error: "draft_failed" }, { status: 422 });
    }
    const { data: item, error: itemError } = await client.rpc("upsert_partner_menu_item", {
      p_token: token,
      p_menu_id: menuId,
      p_section_name: section,
      p_section_position: 0,
      p_name: itemName,
      p_description: "",
      p_price_minor: priceMinor,
      p_currency: priceMinor === null ? null : "IDR",
      p_dietary_tags: [],
      p_verified_allergen_tags: [],
      p_partner_recommended: false,
      p_availability_note: "",
      p_item_position: 0,
    });
    const itemOk = item && typeof item === "object" && "ok" in item ? item.ok === true : Boolean(item);
    if (itemError || !itemOk) {
      return NextResponse.json({ ok: false, error: "item_failed" }, { status: 422 });
    }
    return NextResponse.json({ ok: true, status: "pending_review" });
  }

  const kind = text(body.kind, 20);
  const capturedAt = new Date();
  const expiresAt = new Date(capturedAt.getTime() + DRAFT_TTL_MS);
  const url = safeHttps(body.url);
  const rawProvider = text(body.provider, 80).toLowerCase();
  const provider = kind === "whatsapp" ? "whatsapp" : rawProvider === "venue" ? "official" : rawProvider;
  if (!ACTION_KINDS.has(kind) || !url || !PROVIDERS.has(provider)) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }
  const { data, error } = await client.rpc("create_partner_action_draft", {
    p_token: token,
    p_kind: kind,
    p_provider: provider,
    p_url: url,
    p_label: null,
    p_priority: 100,
    p_confirmation_required: ["reserve", "preorder"].includes(kind),
    p_source_url: url,
    p_source_label: "Venue-provided official link",
    p_captured_at: capturedAt.toISOString(),
    p_expires_at: expiresAt.toISOString(),
  });
  const ok = data && typeof data === "object" && "ok" in data ? data.ok === true : Boolean(data);
  return NextResponse.json(
    { ok: !error && ok, status: !error && ok ? "pending_review" : undefined },
    { status: !error && ok ? 200 : 422 },
  );
}
