export function rawCookieValues(header: string | null | undefined, name: string): string[] {
  if (!header || !name) return [];
  const values: string[] = [];
  for (const part of header.split(";")) {
    const candidate = part.trim();
    const separator = candidate.indexOf("=");
    if (separator < 0 || candidate.slice(0, separator).trim() !== name) continue;
    values.push(candidate.slice(separator + 1).trim());
  }
  return values;
}
