import { NextResponse } from "next/server";
import { setVenueJtbd } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Partners may update only their clearly attributed own-words note. Other
// fit/editorial fields stay operator-owned.
export async function POST(req: Request) {
  let body: {
    token?: string;
    ownerNote?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  if (!body.token) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const ok = await setVenueJtbd(body.token, {
    ownerNote: (typeof body.ownerNote === "string" ? body.ownerNote : "").slice(0, 4000),
  });

  return NextResponse.json({ ok }, { status: ok ? 200 : 422 });
}
