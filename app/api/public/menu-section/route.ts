import { NextResponse } from "next/server";
import { getPublishedMenuSection } from "@/lib/data/menu-summary-repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const safeId = (value: string | null, max: number) => {
  const text = value?.trim() ?? "";
  return text.length > 0 && text.length <= max && /^[a-zA-Z0-9_-]+$/.test(text)
    ? text
    : "";
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const venueSlug = safeId(url.searchParams.get("venue"), 160);
  const menuId = safeId(url.searchParams.get("menu"), 100);
  const sectionId = safeId(url.searchParams.get("section"), 100);
  if (!venueSlug || !menuId || !sectionId) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  const section = await getPublishedMenuSection(venueSlug, menuId, sectionId);
  if (!section) {
    return NextResponse.json(
      { error: "not_found" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }
  return NextResponse.json(
    { section },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}
