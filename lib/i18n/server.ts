import { headers } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_HEADER, isPublicLocale, type PublicLocale } from "./locales";

/** Server-only: read the locale proxy.ts resolved for this request. Safe
 * default (en) if the proxy didn't run (e.g. a route outside its matcher) —
 * never throws, never returns a partner-only locale. */
export async function getLocale(): Promise<PublicLocale> {
  const h = await headers();
  const v = h.get(LOCALE_HEADER);
  return isPublicLocale(v) ? v : DEFAULT_LOCALE;
}
