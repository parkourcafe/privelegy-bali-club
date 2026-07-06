import { NextResponse } from "next/server";
import { setVenuePhoto } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Called after the client uploaded a photo to storage; registers it as the
// venue's card photo. The RPC validates both the token and the URL prefix.
export async function POST(req: Request) {
  let body: { token?: string; url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!body.token || !body.url) return NextResponse.json({ ok: false }, { status: 400 });
  const ok = await setVenuePhoto(body.token, body.url);
  return NextResponse.json({ ok }, { status: ok ? 200 : 422 });
}
