import { NextResponse } from "next/server";
import { getPartnerVenue } from "@/lib/partner-context";
import { serviceClient } from "@/lib/supabase/service";
import { validatePublicEvidenceUrl } from "@/lib/integrations/external-ordering";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DraftItem = {
  name?: string;
  description?: string;
  priceText?: string;
  priceMinor?: number | null;
  currency?: string | null;
  availabilityNote?: string;
  dietaryTags?: string[];
};

type DraftSection = { name?: string; description?: string; items?: DraftItem[] };

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function responseError(error: string, status = 422) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request) {
  let body: { venueSlug?: string; title?: string; sourceUrl?: string; sourceLabel?: string; completeness?: string; sections?: DraftSection[] };
  try {
    body = await req.json();
  } catch {
    return responseError("bad_request", 400);
  }

  const venueSlug = text(body.venueSlug, 160);
  const membership = await getPartnerVenue(venueSlug);
  if (!membership) return responseError("venue_membership_required", 403);
  const sourceUrl = validatePublicEvidenceUrl(body.sourceUrl);
  if (!sourceUrl) return responseError("official_https_source_required");
  const title = text(body.title, 160) || "Venue menu";
  const sourceLabel = text(body.sourceLabel, 160) || "Venue-submitted source";
  const sections = Array.isArray(body.sections) ? body.sections.slice(0, 100) : [];
  if (!sections.length) return responseError("at_least_one_section_required");

  const client = serviceClient();
  if (!client) return responseError("partner_schema_not_configured", 503);
  const capturedAt = new Date();
  const expiresAt = new Date(capturedAt.getTime() + 30 * 24 * 60 * 60 * 1000);
  const { data: latest, error: latestError } = await client
    .from("menus")
    .select("version")
    .eq("venue_slug", venueSlug)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (latestError) return responseError("menu_schema_unavailable", 503);

  const version = Number(latest?.version ?? 0) + 1;
  const { data: menu, error: menuError } = await client
    .from("menus")
    .insert({
      venue_slug: venueSlug,
      title,
      version,
      status: "draft",
      completeness: body.completeness === "full" ? "full" : "partial",
      source_url: sourceUrl,
      source_label: sourceLabel,
      captured_at: capturedAt.toISOString(),
      verified_at: null,
      expires_at: expiresAt.toISOString(),
    })
    .select("id,version,status,verified_at")
    .single();
  if (menuError || !menu) return responseError("menu_draft_not_created", 422);

  try {
    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex += 1) {
      const inputSection = sections[sectionIndex] ?? {};
      const sectionName = text(inputSection.name, 160);
      if (!sectionName) throw new Error("section_name_required");
      const { data: section, error: sectionError } = await client
        .from("menu_sections")
        .insert({ menu_id: menu.id, name: sectionName, description: text(inputSection.description, 1000) || null, position: sectionIndex })
        .select("id")
        .single();
      if (sectionError || !section) throw new Error("section_not_created");

      const items = Array.isArray(inputSection.items) ? inputSection.items.slice(0, 250) : [];
      for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
        const inputItem = items[itemIndex] ?? {};
        const itemName = text(inputItem.name, 200);
        if (!itemName) throw new Error("item_name_required");
        const priceMinor = Number.isInteger(inputItem.priceMinor) && Number(inputItem.priceMinor) >= 0 ? Number(inputItem.priceMinor) : null;
        const currency = priceMinor === null ? null : text(inputItem.currency, 3).toUpperCase();
        if (priceMinor !== null && !/^[A-Z]{3}$/.test(currency ?? "")) throw new Error("currency_required_with_numeric_price");
        const dietaryTags = Array.isArray(inputItem.dietaryTags)
          ? inputItem.dietaryTags.filter((tag): tag is string => typeof tag === "string").map((tag) => tag.trim().slice(0, 40)).filter(Boolean).slice(0, 12)
          : [];
        const { error: itemError } = await client.from("menu_items").insert({
          menu_id: menu.id,
          section_id: section.id,
          name: itemName,
          description: text(inputItem.description, 2000) || null,
          price_minor: priceMinor,
          currency,
          price_text: text(inputItem.priceText, 120) || null,
          dietary_tags: dietaryTags,
          verified_allergen_tags: [],
          partner_recommended: false,
          editorial_pick: false,
          editorial_note: null,
          availability_note: text(inputItem.availabilityNote, 500) || null,
          position: itemIndex,
        });
        if (itemError) throw new Error("item_not_created");
      }
    }
  } catch (error) {
    await client.from("menus").delete().eq("id", menu.id);
    return responseError(error instanceof Error ? error.message : "menu_draft_not_created", 422);
  }

  return NextResponse.json({ ok: true, draft: menu }, { status: 201 });
}
