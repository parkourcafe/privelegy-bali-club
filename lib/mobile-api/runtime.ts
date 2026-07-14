const PROCESS_UPDATED_AT = new Date().toISOString();

function configuredUpdatedAt(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return null;
  return new Date(parsed).toISOString();
}

// A deployment may supply a source-data timestamp. The process timestamp is a
// safe fallback and stays stable for the lifetime of a server instance, so
// successful representations keep a useful conditional-request validator.
export function mobileApiUpdatedAt(): string {
  return configuredUpdatedAt(process.env.OTHER_BALI_MOBILE_DATA_UPDATED_AT)
    ?? PROCESS_UPDATED_AT;
}
