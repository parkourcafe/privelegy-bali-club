// Search engines show roughly the first 155–160 characters of a meta
// description. A plain `.slice(0, 158)` cut venue and route descriptions in the
// middle of a word ("…best nasi campu"), which reads as broken in the snippet.
// Clip at the last word boundary instead and mark the cut with an ellipsis.
export const META_DESCRIPTION_MAX = 158;

export function clipMetaDescription(
  text: string,
  max: number = META_DESCRIPTION_MAX,
): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;

  // Reserve one character for the ellipsis.
  const room = clean.slice(0, max - 1);
  const lastSpace = room.lastIndexOf(" ");
  // A single word longer than the limit has no boundary to cut at; fall back
  // to a hard cut rather than returning an empty description.
  const head = lastSpace > 0 ? room.slice(0, lastSpace) : room;
  return `${head.replace(/[\s,;:—–-]+$/u, "")}…`;
}
