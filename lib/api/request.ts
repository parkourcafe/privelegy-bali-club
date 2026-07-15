export type BoundedJsonResult =
  | { ok: true; value: unknown }
  | { ok: false; error: "invalid_content_type" | "invalid_json" | "payload_too_large" };

const JSON_CONTENT_TYPE = /^(?:application\/json|application\/[a-z0-9.+-]+\+json)(?:\s*;|$)/i;

function declaredLength(request: Request): number | null {
  const value = request.headers.get("content-length");
  if (value === null) return null;
  if (!/^\d+$/.test(value)) return Number.NaN;
  return Number(value);
}

export async function readBoundedJson(
  request: Request,
  maxBytes: number,
): Promise<BoundedJsonResult> {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1) {
    throw new TypeError("maxBytes must be a positive safe integer");
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!JSON_CONTENT_TYPE.test(contentType)) {
    return { ok: false, error: "invalid_content_type" };
  }

  const length = declaredLength(request);
  if (Number.isNaN(length)) return { ok: false, error: "invalid_json" };
  if (length !== null && length > maxBytes) {
    return { ok: false, error: "payload_too_large" };
  }
  if (!request.body) return { ok: false, error: "invalid_json" };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        try {
          await reader.cancel("payload_too_large");
        } catch {
          // The size decision is final even if transport cleanup fails.
        }
        return { ok: false, error: "payload_too_large" };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, error: "invalid_json" };
  }

  if (total === 0) return { ok: false, error: "invalid_json" };
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, error: "invalid_json" };
  }
}
