import { isIP } from "node:net";

export const PHOTO_BUCKET = "venue-photos";
export const PHOTO_CONSENT_TERMS_VERSION = "venue-photo-rights-v1-2026-07-14";
export const PHOTO_REVIEW_CONFIRMATION = "photo-and-consent-reviewed";
export const MAX_PHOTO_BYTES = 4 * 1024 * 1024;
export const MAX_STORED_PHOTO_BYTES = 10 * 1024 * 1024;

export const ALLOWED_PHOTO_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export type AllowedPhotoMime = (typeof ALLOWED_PHOTO_MIME_TYPES)[number];

const EXTENSION: Record<AllowedPhotoMime, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VENUE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PHOTO_TOKEN = /^[A-Za-z0-9_-]{32,256}$/;

export type PhotoSubmissionFields = {
  token: string;
  submitterName: string;
  submitterContact: string;
  rightsGranted: boolean;
  honeypot: string;
  fileSize: number;
  declaredMime: string;
};

export type PhotoSubmissionValidation =
  | {
      ok: true;
      token: string;
      submitterName: string;
      submitterContact: string | null;
      mime: AllowedPhotoMime;
    }
  | { ok: false; error: "bad_request" | "rights_required" | "invalid_file" };

export function validatePhotoSubmissionFields(
  input: PhotoSubmissionFields
): PhotoSubmissionValidation {
  const token = input.token.trim();
  const submitterName = input.submitterName.trim();
  const submitterContact = input.submitterContact.trim();
  const mime = ALLOWED_PHOTO_MIME_TYPES.find((value) => value === input.declaredMime);

  if (
    input.honeypot ||
    !PHOTO_TOKEN.test(token) ||
    submitterName.length < 2 ||
    submitterName.length > 120 ||
    submitterContact.length > 200
  ) {
    return { ok: false, error: "bad_request" };
  }
  if (!input.rightsGranted) return { ok: false, error: "rights_required" };
  if (!mime || input.fileSize < 1 || input.fileSize > MAX_PHOTO_BYTES) {
    return { ok: false, error: "invalid_file" };
  }

  return {
    ok: true,
    token,
    submitterName,
    submitterContact: submitterContact || null,
    mime,
  };
}

function startsWith(bytes: Uint8Array, signature: number[], offset = 0): boolean {
  return signature.every((value, index) => bytes[offset + index] === value);
}

export function detectPhotoMime(bytes: Uint8Array): AllowedPhotoMime | null {
  if (bytes.length >= 3 && startsWith(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (bytes.length >= 8 && startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (
    bytes.length >= 12 &&
    startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)
  ) {
    return "image/webp";
  }
  if (
    bytes.length >= 12 &&
    startsWith(bytes, [0x66, 0x74, 0x79, 0x70], 4) &&
    (["avif", "avis"] as const).includes(
      String.fromCharCode(...bytes.slice(8, 12)) as "avif" | "avis"
    )
  ) {
    return "image/avif";
  }
  return null;
}

export function photoObjectPath(
  venueSlug: string,
  id: string,
  mime: AllowedPhotoMime
): string | null {
  if (!VENUE_SLUG.test(venueSlug) || !UUID.test(id)) return null;
  return `${venueSlug}/${id}.${EXTENSION[mime]}`;
}

export function approvedPhotoDeliveryUrl(
  submissionId: string,
  configuredSiteUrl: string | null | undefined
): string | null {
  if (!UUID.test(submissionId) || !configuredSiteUrl) return null;
  try {
    const origin = new URL(configuredSiteUrl);
    if (origin.protocol !== "https:" || origin.username || origin.password) return null;
    return new URL(`/api/venue-photo/${submissionId}`, origin.origin).toString();
  } catch {
    return null;
  }
}

export function boundedClientIp(value: string | null): string | null {
  const candidate = value?.split(",", 1)[0]?.trim() ?? "";
  return isIP(candidate) ? candidate : null;
}

export function isPhotoRecordId(value: string): boolean {
  return UUID.test(value);
}
