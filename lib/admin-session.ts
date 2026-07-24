import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { configuredAdminToken } from "./admin-auth";

// A friendly, cookie-based front door for the operator Field Kit
// (app/admin/login), alongside the existing break-glass Basic Auth header and
// Supabase operator-role paths (lib/admin-request-auth.ts). Same pattern as
// the submission-media upload token (lib/submission-media-policy.ts):
// stateless HMAC, no session table. Signed with the configured
// ADMIN_ACCESS_TOKEN itself, so a session can only be minted by someone who
// already knows that secret (the login form checks it first) — this adds
// convenience, not a new credential.

export const ADMIN_SESSION_COOKIE = "ob_admin_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function sessionSecret(): string | null {
  return configuredAdminToken();
}

export function mintAdminSessionToken(now: number): string | null {
  const secret = sessionSecret();
  if (!secret) return null;
  const exp = now + SESSION_TTL_MS;
  const sig = createHmac("sha256", secret).update(`admin-session.${exp}`).digest("base64url");
  return `${exp}.${sig}`;
}

export function verifyAdminSessionToken(token: string | undefined | null, now: number): boolean {
  const secret = sessionSecret();
  if (!secret || typeof token !== "string") return false;
  const dot = token.indexOf(".");
  if (dot < 1) return false;
  const expRaw = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp < now) return false;
  const expected = createHmac("sha256", secret).update(`admin-session.${exp}`).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export const ADMIN_SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
