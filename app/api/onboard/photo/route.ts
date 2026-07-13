import { NextResponse } from "next/server";
import { setVenuePhoto } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Called after the client uploaded a photo to storage; registers it as the
// venue's card photo. The RPC validates the token + URL prefix AND requires an
// explicit photo-rights consent, which it logs — no consent, no photo set.
export async function POST(req: Request) {
  let body: { token?: string; url?: string; consent?: boolean; grantedBy?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  if (!body.token || !body.url) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  const result = await setVenuePhoto(body.token, body.url, {
    consent: Boolean(body.consent),
    grantedBy: (body.grantedBy ?? "").slice(0, 120),
    userAgent: req.headers.get("user-agent") ?? "",
  });
  return NextResponse.json(result, { status: result.ok ? 200 : 422 });
}
