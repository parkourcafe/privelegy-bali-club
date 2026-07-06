import { NextResponse } from "next/server";
import { confirmOnboarding } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { token?: string; name?: string; agreed?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  if (!body.token) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });

  const result = await confirmOnboarding({
    token: body.token,
    name: (body.name ?? "").slice(0, 120),
    agreed: Boolean(body.agreed),
    userAgent: req.headers.get("user-agent") ?? "",
  });
  return NextResponse.json(result, { status: result.ok ? 200 : 422 });
}
