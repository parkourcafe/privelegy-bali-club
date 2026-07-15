/**
 * Fail closed for cookie-authenticated, state-changing browser requests.
 * SameSite is site-scoped, so both exact Origin and Fetch Metadata must agree.
 */
export function isTrustedSameOriginMutation(req: Request): boolean {
  const origin = req.headers.get("origin");
  const fetchSite = req.headers.get("sec-fetch-site");
  let requestOrigin: string;
  try {
    requestOrigin = new URL(req.url).origin;
  } catch {
    return false;
  }
  return origin === requestOrigin && (fetchSite === null || fetchSite === "same-origin");
}
