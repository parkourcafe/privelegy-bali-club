export const REQUEST_ID_HEADER = "X-Request-ID";

const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isRequestCorrelationId(value: unknown): value is string {
  return typeof value === "string" && UUID_V4_PATTERN.test(value);
}

// The caller-provided header is intentionally unused. Keeping it explicit in
// the signature documents and tests the trust boundary: every request gets a
// fresh server-generated UUID, never a value supplied by the client or CDN.
export function createRequestCorrelationId(
  _untrustedIncoming: string | null,
  randomUUID: () => string = () => crypto.randomUUID(),
): string {
  const generated = randomUUID().toLowerCase();
  if (!isRequestCorrelationId(generated)) {
    throw new Error("request_id_generation_failed");
  }
  return generated;
}

export function requestHeadersWithCorrelationId(
  incoming: Headers,
  requestId: string,
): Headers {
  if (!isRequestCorrelationId(requestId)) {
    throw new Error("invalid_request_id");
  }
  const headers = new Headers(incoming);
  headers.set(REQUEST_ID_HEADER, requestId);
  return headers;
}

export function responseWithCorrelationId<T extends Response>(
  response: T,
  requestId: string,
): T {
  if (!isRequestCorrelationId(requestId)) {
    throw new Error("invalid_request_id");
  }
  response.headers.set(REQUEST_ID_HEADER, requestId);
  return response;
}
