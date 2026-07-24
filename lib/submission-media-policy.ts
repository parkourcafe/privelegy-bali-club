import "server-only";

import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

// Stage B — partner submission media (photos + optional video) for the
// /list-your-property intake. Mirrors the proven venue-photo pipeline
// (lib/photo-submission-policy.ts): a PRIVATE Storage bucket, service-role-only
// server access, magic-byte re-sniffing, and a recorded photo-rights basis.
//
// Design choices (Stage B, no new domain entity — see migration 0045):
// - Media rows live in a `media jsonb` column on the existing venue_submissions
//   table, NOT a new table. Bucket bytes are private, operator-review-only, and
//   NEVER rendered publicly — publication still flows through the existing
//   consent-gated venue photo pipeline when editorial promotes a submission.
// - Bytes go browser -> Storage directly via single-use signed upload URLs
//   (Vercel's ~4.5 MB body cap can't carry a 15-30s MP4). Because signed uploads
//   bypass the server, a mandatory finalize step re-sniffs the stored object's
//   magic bytes and deletes+rejects on mismatch.
// - Upload is authorised by a short-lived stateless HMAC token bound to the
//   submission id (minted server-side at submit) — no tokens table needed.

export const SUBMISSION_MEDIA_BUCKET = "submission-media";
export const SUBMISSION_MEDIA_RIGHTS_VERSION = "submission-media-rights-v1-2026-07-20";

export const MAX_SUBMISSION_PHOTOS = 50;
export const MAX_SUBMISSION_VIDEOS = 1;
export const MAX_SUBMISSION_PHOTO_BYTES = 12 * 1024 * 1024; // 12 MiB
export const MAX_SUBMISSION_VIDEO_BYTES = 50 * 1024 * 1024; // 50 MiB
export const MEDIA_TOKEN_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

export type MediaKind = "photo" | "video";

export const ALLOWED_MEDIA_MIME: Record<MediaKind, readonly string[]> = {
  photo: ["image/jpeg", "image/png"],
  video: ["video/mp4"],
};

const EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "video/mp4": "mp4",
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function maxBytesForKind(kind: MediaKind): number {
  return kind === "video" ? MAX_SUBMISSION_VIDEO_BYTES : MAX_SUBMISSION_PHOTO_BYTES;
}

export function maxCountForKind(kind: MediaKind): number {
  return kind === "video" ? MAX_SUBMISSION_VIDEOS : MAX_SUBMISSION_PHOTOS;
}

// A single entry stored inside venue_submissions.media (jsonb array).
export type SubmissionMediaEntry = {
  id: string;
  kind: MediaKind;
  path: string;
  mime: string;
  size: number;
  status: "reserved" | "uploaded" | "rejected";
  rightsGranted: true;
  rightsTermsVersion: string;
  createdAt: string;
};

export function isMediaKind(value: unknown): value is MediaKind {
  return value === "photo" || value === "video";
}

export function isAllowedMime(kind: MediaKind, mime: string): boolean {
  return ALLOWED_MEDIA_MIME[kind].includes(mime);
}

export function mediaObjectPath(submissionId: string, mime: string): string | null {
  if (!UUID.test(submissionId)) return null;
  const ext = EXTENSION[mime];
  if (!ext) return null;
  return `${submissionId}/${randomUUID()}.${ext}`;
}

// ── Magic-byte sniffing (defence-in-depth for the signed-upload bypass) ──────
function startsWith(bytes: Uint8Array, sig: number[], offset = 0): boolean {
  return sig.every((v, i) => bytes[offset + i] === v);
}

export function detectMediaMime(kind: MediaKind, bytes: Uint8Array): string | null {
  if (kind === "photo") {
    if (bytes.length >= 3 && startsWith(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
    if (bytes.length >= 8 && startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
      return "image/png";
    return null;
  }
  // MP4: an "ftyp" box near the start (bytes 4..7 == 'ftyp').
  if (bytes.length >= 12 && startsWith(bytes, [0x66, 0x74, 0x79, 0x70], 4)) return "video/mp4";
  return null;
}

// ── Stateless HMAC upload token (bound to a submission id) ────────────────────
function mediaSecret(): string | null {
  return (
    process.env.SUBMISSION_MEDIA_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    null
  );
}

export function mintMediaToken(submissionId: string, now: number): string | null {
  const secret = mediaSecret();
  if (!secret || !UUID.test(submissionId)) return null;
  const exp = now + MEDIA_TOKEN_TTL_MS;
  const sig = createHmac("sha256", secret).update(`${submissionId}.${exp}`).digest("base64url");
  return `${exp}.${sig}`;
}

export function verifyMediaToken(submissionId: string, token: string, now: number): boolean {
  const secret = mediaSecret();
  if (!secret || !UUID.test(submissionId) || typeof token !== "string") return false;
  const dot = token.indexOf(".");
  if (dot < 1) return false;
  const expRaw = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp < now) return false;
  const expected = createHmac("sha256", secret).update(`${submissionId}.${exp}`).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
