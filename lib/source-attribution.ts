const SOURCE_ID = /^[a-z0-9][a-z0-9_-]{0,63}$/;

export function isSourceId(value: unknown): value is string {
  return typeof value === "string" && SOURCE_ID.test(value);
}

export function parseSourceCaptureRequest(input: unknown): string | null {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return null;
  const record = input as Record<string, unknown>;
  if (
    Object.keys(record).some((key) => key !== "source") ||
    !isSourceId(record.source)
  ) {
    return null;
  }
  return record.source;
}
