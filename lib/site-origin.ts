import "server-only";

import { headers } from "next/headers";
import { resolveSiteOrigin } from "./site-origin-policy";

export async function currentSiteOrigin(): Promise<string | null> {
  const requestHeaders = await headers();
  return resolveSiteOrigin({
    vercelEnv: process.env.VERCEL_ENV,
    configuredSiteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    vercelUrl: process.env.VERCEL_URL,
    forwardedHost: requestHeaders.get("x-forwarded-host"),
    host: requestHeaders.get("host"),
    forwardedProto: requestHeaders.get("x-forwarded-proto"),
  });
}
