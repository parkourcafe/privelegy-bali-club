const SOURCE_ID = /^[a-z0-9][a-z0-9_-]{0,63}$/;

export function isSourceId(value: unknown): value is string {
  return typeof value === "string" && SOURCE_ID.test(value);
}
