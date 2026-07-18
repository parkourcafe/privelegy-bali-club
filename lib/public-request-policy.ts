const IDENTITY_FREE_PUBLIC_PREFIXES = ["/api/mobile/v1", "/api/health"] as const;
const IDENTITY_FREE_PUBLIC_PATHS = new Set([
  "/.well-known/apple-app-site-association",
  "/.well-known/assetlinks.json",
]);

export function isIdentityFreePublicPath(pathname: string): boolean {
  return IDENTITY_FREE_PUBLIC_PATHS.has(pathname) || IDENTITY_FREE_PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
