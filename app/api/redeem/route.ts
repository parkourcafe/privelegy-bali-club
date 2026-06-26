import { recordRedemption } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { guestRef?: string; venueSlug?: string; consentGranted?: boolean };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const { guestRef, venueSlug, consentGranted } = body;
  if (!guestRef || !venueSlug) {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const result = await recordRedemption({
    guestRef,
    venueSlug,
    consentGranted: Boolean(consentGranted),
    userAgent: req.headers.get("user-agent") ?? "",
  });

  return Response.json(result, { status: result.ok ? 200 : 422 });
}
