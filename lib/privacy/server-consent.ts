import "server-only";
import { headers } from "next/headers";
import { rawCookieValues } from "../http-cookie";
import {
  CONSENT_COOKIE,
  parseConsentState,
  type ConsentState,
} from "./consent";

export async function readServerConsentState(): Promise<ConsentState> {
  const values = rawCookieValues((await headers()).get("cookie"), CONSENT_COOKIE);
  if (values.length !== 1) return values.length > 1 ? "essential_only" : "unknown";
  try {
    return parseConsentState(decodeURIComponent(values[0]));
  } catch {
    return "unknown";
  }
}
