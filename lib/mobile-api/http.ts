import { createHash } from "node:crypto";
import {
  MOBILE_API_SCHEMA_VERSION,
  mobileSuccessEnvelopeSchema,
  type MobileContractSchema,
  type MobileErrorCode,
  type MobileErrorEnvelope,
  type MobileSuccessEnvelope,
} from "./contracts";
import { mobileApiUpdatedAt } from "./runtime";
import { logRequestFailure } from "../server-log";

const SUCCESS_CACHE_CONTROL = "public, max-age=0, s-maxage=300, stale-while-revalidate=86400";
const ERROR_CACHE_CONTROL = "no-store";

function publicHeaders(cacheControl: string): Headers {
  return new Headers({
    "Access-Control-Allow-Headers": "Accept, If-None-Match, X-Other-Bali-Mobile-Shell",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "ETag, X-Other-Bali-Schema-Version, X-Request-ID",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": cacheControl,
    "Content-Language": "en",
    "X-Content-Type-Options": "nosniff",
    "X-Other-Bali-Schema-Version": String(MOBILE_API_SCHEMA_VERSION),
    "X-Robots-Tag": "noindex, nofollow",
  });
}

function etagFor(body: string): string {
  const digest = createHash("sha256").update(body).digest("hex");
  return `"${digest}"`;
}

function stripWeakPrefix(value: string): string {
  return value.startsWith("W/") ? value.slice(2) : value;
}

export function requestMatchesEtag(header: string | null, etag: string): boolean {
  if (!header) return false;
  return header.split(",").some((entry) => {
    const candidate = entry.trim();
    return candidate === "*" || stripWeakPrefix(candidate) === stripWeakPrefix(etag);
  });
}

export function mobileApiSuccess<T>(
  request: Request,
  data: T,
  schema: MobileContractSchema<T>,
): Response {
  const envelope: MobileSuccessEnvelope<T> = {
    schemaVersion: MOBILE_API_SCHEMA_VERSION,
    updatedAt: mobileApiUpdatedAt(),
    data,
  };
  const parsed = mobileSuccessEnvelopeSchema(schema).safeParse(envelope);
  if (!parsed.success) {
    logRequestFailure(request, "mobile_api_contract_rejected");
    return mobileApiError("temporarily_unavailable", 503);
  }

  const body = JSON.stringify(parsed.data);
  const etag = etagFor(body);
  const headers = publicHeaders(SUCCESS_CACHE_CONTROL);
  headers.set("ETag", etag);
  headers.set("Vary", "Accept-Encoding");
  if (requestMatchesEtag(request.headers.get("if-none-match"), etag)) {
    return new Response(null, { status: 304, headers });
  }
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(body, { status: 200, headers });
}

const ERROR_MESSAGES: Record<MobileErrorCode, string> = {
  invalid_request: "The request is invalid.",
  not_found: "The requested resource was not found.",
  temporarily_unavailable: "The service is temporarily unavailable.",
};

export function mobileApiError(code: MobileErrorCode, status: 400 | 404 | 503): Response {
  const body: MobileErrorEnvelope = {
    schemaVersion: MOBILE_API_SCHEMA_VERSION,
    updatedAt: mobileApiUpdatedAt(),
    error: { code, message: ERROR_MESSAGES[code] },
  };
  const headers = publicHeaders(ERROR_CACHE_CONTROL);
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { status, headers });
}

export function mobileApiOptions(): Response {
  return new Response(null, {
    status: 204,
    headers: publicHeaders("public, max-age=86400"),
  });
}

export async function mobileApiContractResponse<T>(
  request: Request,
  schema: MobileContractSchema<T>,
  load: () => Promise<T> | T,
): Promise<Response> {
  try {
    return mobileApiSuccess(request, await load(), schema);
  } catch {
    logRequestFailure(request, "mobile_api_load_failed");
    return mobileApiError("temporarily_unavailable", 503);
  }
}
