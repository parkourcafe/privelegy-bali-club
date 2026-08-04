import {
  GUEST_COOKIE,
  InvalidGuestRefError,
  guestCookieOptions,
  resolveGuestRef,
} from "@/lib/guest-server";
import { mutateRuntime, readRuntime } from "./data-access";
import { boundedRecord, idempotencyKey, parseRuntimeBody, type RuntimeOperation } from "./contracts";
import { runtimeError, runtimeSuccess } from "./http";

export async function mutationResponse(request: Request, operation: RuntimeOperation) {
  const body = await parseRuntimeBody(request);
  const key = body && idempotencyKey(request, body);
  const input = body && boundedRecord(body.input ?? body, 48_000);
  if (!body || !key || !input) return runtimeError("INVALID_REQUEST", "A bounded input and Idempotency-Key are required.");
  let guest: Awaited<ReturnType<typeof resolveGuestRef>>;
  try {
    guest = await resolveGuestRef(request);
  } catch (error) {
    if (error instanceof InvalidGuestRefError) {
      return runtimeError("INVALID_REQUEST", "The pseudonymous guest reference is invalid.");
    }
    return runtimeError("TEMPORARILY_UNAVAILABLE", "The runtime store is unavailable.", 503);
  }
  const { ref, created } = guest;
  const result = await mutateRuntime(ref, operation, input, key);
  if (!result.ok) {
    if (result.error === "bad_request") return runtimeError("INVALID_REQUEST", "The mutation is invalid.");
    if (result.error === "version_mismatch") {
      return runtimeError("SYNC_VERSION_MISMATCH", "The server state changed. Pull the current version before retrying.");
    }
    const code = result.error === "not_found" && operation === "feed.update"
      ? "FEED_SESSION_NOT_FOUND"
      : result.error === "not_found" ? "INVALID_REQUEST" : "TEMPORARILY_UNAVAILABLE";
    return runtimeError(code, code === "FEED_SESSION_NOT_FOUND" ? "The session was not found." : "The runtime store is unavailable.");
  }
  const response = runtimeSuccess(result, result.replayed ? 200 : 201);
  if (created) response.cookies.set(GUEST_COOKIE, ref, guestCookieOptions());
  return response;
}

export async function readResponse(resource: "feed" | "today" | "trip" | "sync", id?: string) {
  const { ref, created } = await resolveGuestRef();
  const result = await readRuntime(ref, resource, id);
  if (!result.ok) {
    if (result.error === "bad_request") return runtimeError("INVALID_REQUEST", "The read request is invalid.");
    const code = result.error === "not_found" && resource === "feed"
      ? "FEED_SESSION_NOT_FOUND"
      : "TEMPORARILY_UNAVAILABLE";
    return runtimeError(code, code === "FEED_SESSION_NOT_FOUND" ? "The session was not found." : "The runtime store is unavailable.");
  }
  const response = runtimeSuccess(result);
  if (created) response.cookies.set(GUEST_COOKIE, ref, guestCookieOptions());
  return response;
}
