export const MOBILE_CANONICAL_ORIGIN = "https://www.otherbali.com" as const;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SLUG_LENGTH = 120;

export type MobileDeepLinkTarget =
  | { kind: "place"; slug: string }
  | { kind: "route"; slug: string };

export function parseMobileDeepLink(value: unknown): MobileDeepLinkTarget | null {
  if (typeof value !== "string" || !value || value.length > 2_048) return null;

  try {
    const url = new URL(value);
    if (
      url.origin !== MOBILE_CANONICAL_ORIGIN
      || url.username
      || url.password
      || url.port
      || url.search
      || url.hash
    ) {
      return null;
    }

    const match = /^\/(places|route)\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(url.pathname);
    if (!match) return null;
    const [, collection, slug] = match;
    if (!slug || slug.length > MAX_SLUG_LENGTH || !SLUG_PATTERN.test(slug)) return null;

    return collection === "places"
      ? { kind: "place", slug }
      : { kind: "route", slug };
  } catch {
    return null;
  }
}

export function mobileShareUrl(target: MobileDeepLinkTarget): string {
  const collection = target.kind === "place" ? "places" : "route";
  if (!SLUG_PATTERN.test(target.slug) || target.slug.length > MAX_SLUG_LENGTH) {
    throw new Error("Mobile share target has an invalid slug");
  }
  return `${MOBILE_CANONICAL_ORIGIN}/${collection}/${target.slug}`;
}
