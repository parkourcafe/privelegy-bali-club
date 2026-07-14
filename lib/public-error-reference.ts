import { isRequestCorrelationId } from "./request-correlation";

const DIGEST_PATTERN = /^[A-Za-z0-9._:-]{1,128}$/;

export interface PublicErrorReferenceInput {
  digest?: unknown;
  requestId?: unknown;
}

export interface PublicErrorReference {
  digest: string | null;
  requestId: string | null;
}

export function publicErrorReference(input: PublicErrorReferenceInput): PublicErrorReference {
  const digest = typeof input.digest === "string" && DIGEST_PATTERN.test(input.digest)
    ? input.digest
    : null;
  const requestId = isRequestCorrelationId(input.requestId)
    ? input.requestId.toLowerCase()
    : null;
  return { digest, requestId };
}
