const IDENTITY_FREE_PUBLIC_PREFIXES = ["/api/mobile/v1", "/api/health"] as const;

export function isIdentityFreePublicPath(pathname: string): boolean {
  return IDENTITY_FREE_PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
