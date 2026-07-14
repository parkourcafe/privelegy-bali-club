export function exactReleaseSchemaProbe(
  data: unknown,
  version: number,
  schemaRevision: string,
): boolean {
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;
  const probe = data as { ok?: unknown; version?: unknown; schemaRevision?: unknown };
  return probe.ok === true
    && probe.version === version
    && probe.schemaRevision === schemaRevision;
}
