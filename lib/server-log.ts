import { publicReleaseId } from "./release-id";
import { isRequestCorrelationId, REQUEST_ID_HEADER } from "./request-correlation";

const EVENT_PATTERN = /^[a-z][a-z0-9_]{2,63}$/;

export interface ServerFailureInput {
  event: unknown;
  requestId?: unknown;
  release?: unknown;
}

export interface ServerFailureRecord {
  event: string;
  requestId: string;
  release: string;
}

export function serverFailureRecord(input: ServerFailureInput): ServerFailureRecord {
  const event = typeof input.event === "string" && EVENT_PATTERN.test(input.event)
    ? input.event
    : "server_failure";
  const requestId = isRequestCorrelationId(input.requestId)
    ? input.requestId.toLowerCase()
    : "unavailable";
  const release = typeof input.release === "string"
    ? publicReleaseId(input.release)
    : publicReleaseId();
  return { event, requestId, release };
}

export function logServerFailure(
  input: ServerFailureInput,
  sink: (line: string) => void = console.error,
): void {
  sink(JSON.stringify(serverFailureRecord(input)));
}

export function logRequestFailure(
  request: Request,
  event: string,
  sink?: (line: string) => void,
): void {
  logServerFailure({
    event,
    requestId: request.headers.get(REQUEST_ID_HEADER),
  }, sink);
}
