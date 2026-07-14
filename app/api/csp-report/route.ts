import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// CSP violation sink for the Report-Only shakeout (audit 2026-07). Browsers POST
// a violation report here (application/csp-report or reports+json); we log a
// trimmed line to the server logs so real violations surface before the policy
// is switched to enforcing. Always 204 — never let reporting affect the client.
export async function POST(req: Request) {
  try {
    const body = (await req.text()).slice(0, 4000);
    if (body) console.warn("[csp-report]", body);
  } catch {
    /* ignore malformed reports */
  }
  return new NextResponse(null, { status: 204 });
}
