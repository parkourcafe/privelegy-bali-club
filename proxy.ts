import { NextResponse, type NextRequest } from "next/server";
import { nanoid } from "nanoid";

// Guardrail #10: the anonymous GuestRef lives in a server-set httpOnly cookie,
// not localStorage. Set it on the first document request so every later fetch
// (source/event/redeem/dish) shares one stable id — no client-side identity, no
// races between concurrent first calls.
// (Next 16: this is the `proxy` file convention, formerly `middleware`.)
export function proxy(req: NextRequest) {
  const res = NextResponse.next();
  if (!req.cookies.get("bp_guest")) {
    res.cookies.set("bp_guest", "g_" + nanoid(16), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|icon-maskable.svg|manifest.webmanifest|sw.js).*)"],
};
