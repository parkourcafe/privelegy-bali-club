import { NextResponse } from "next/server";
import { setVenueJtbd } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Partner fills its own fit context (Best for / Not for / jobs / practical
// tags). The RPC whitelists tags and caps text; we just shape the payload.
export async function POST(req: Request) {
  let body: {
    token?: string;
    bestFor?: string;
    notFor?: string;
    jobs?: unknown;
    practicalTags?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  if (!body.token) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const asStrings = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, 12) : [];

  const ok = await setVenueJtbd(body.token, {
    bestFor: (body.bestFor ?? "").slice(0, 200),
    notFor: (body.notFor ?? "").slice(0, 200),
    jobs: asStrings(body.jobs),
    practicalTags: asStrings(body.practicalTags),
  });

  return NextResponse.json({ ok }, { status: ok ? 200 : 422 });
}
